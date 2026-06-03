import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Gallery } from './gallery';
import { PhotoItem } from '../../models/photo-item.model';

const CATALOG: PhotoItem[] = [
  { id: 'c', title: 'C', tags: ['x', 'y'], Created: '2025-01-01T00:00:00Z', resolution: '1x1px' },
  { id: 'b', title: 'B', tags: ['x'], Created: '2024-01-01T00:00:00Z', resolution: '1x1px' },
  { id: 'a', title: 'A', tags: ['y'], Created: '2023-01-01T00:00:00Z', resolution: '1x1px' },
];

async function setup(inputs: { tags?: string; sort?: string } = {}) {
  TestBed.configureTestingModule({
    imports: [Gallery],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: ActivatedRoute, useValue: {} },
    ],
  });
  const fixture = TestBed.createComponent(Gallery);
  if (inputs.tags !== undefined) fixture.componentRef.setInput('tags', inputs.tags);
  if (inputs.sort !== undefined) fixture.componentRef.setInput('sort', inputs.sort);
  fixture.detectChanges(); // ngOnInit -> load()
  TestBed.inject(HttpTestingController).expectOne('data/catalog.json').flush({ catalog: CATALOG });
  await fixture.whenStable(); // asynchrones load() abwarten
  fixture.detectChanges();
  return fixture;
}

describe('Gallery', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    // IntersectionObserver existiert in jsdom nicht -> Stub bereitstellen.
    (globalThis as any).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('ermittelt alle Tags alphabetisch sortiert', async () => {
    const cmp: any = (await setup()).componentInstance;
    expect(cmp.allTags()).toEqual(['x', 'y']);
  });

  it('leitet selectedTags aus dem ?tags-Parameter ab (kommasepariert)', async () => {
    const cmp: any = (await setup({ tags: 'x,y' })).componentInstance;
    expect(cmp.selectedTags()).toEqual(['x', 'y']);
  });

  it('filtert per UND-Verknüpfung über mehrere Tags', async () => {
    const cmp: any = (await setup({ tags: 'x,y' })).componentInstance;
    // nur 'c' trägt beide Tags
    expect(cmp.filtered().map((p: PhotoItem) => p.id)).toEqual(['c']);
  });

  it('sortiert standardmäßig absteigend (neueste zuerst)', async () => {
    const cmp: any = (await setup()).componentInstance;
    expect(cmp.sortDesc()).toBe(true);
    expect(cmp.filtered().map((p: PhotoItem) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('kehrt die Reihenfolge bei ?sort=asc um', async () => {
    const cmp: any = (await setup({ sort: 'asc' })).componentInstance;
    expect(cmp.sortDesc()).toBe(false);
    expect(cmp.filtered().map((p: PhotoItem) => p.id)).toEqual(['a', 'b', 'c']);
  });

  it('toggleTag schreibt die Auswahl in die URL', async () => {
    const fixture = await setup();
    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.toggleTag('x');
    expect(spy).toHaveBeenCalled();
    const [, extras] = spy.mock.calls[0] as any;
    expect(extras.queryParams).toEqual({ tags: 'x' });
    expect(extras.queryParamsHandling).toBe('merge');
  });

  it('toggleSort setzt ?sort=asc, wenn aktuell absteigend sortiert', async () => {
    const fixture = await setup();
    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentInstance.toggleSort();
    const [, extras] = spy.mock.calls[0] as any;
    expect(extras.queryParams).toEqual({ sort: 'asc' });
  });
});
