import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CatalogService } from './catalog.service';

const PHOTO = (id: string, created: string, tags: string[] = []) => ({
  id,
  title: id.toUpperCase(),
  tags,
  Created: created,
  resolution: '1x1px',
});

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lädt den Katalog vom Default-Pfad ohne führenden Slash', async () => {
    const p = service.load();
    httpMock.expectOne('data/catalog.json').flush({ catalog: [] });
    await p;
    expect(service.photos()).toEqual([]);
  });

  it('sortiert die Bilder absteigend nach Created (neueste zuerst)', async () => {
    const p = service.load();
    httpMock.expectOne('data/catalog.json').flush({
      catalog: [
        PHOTO('a', '2024-01-01T00:00:00Z'),
        PHOTO('c', '2025-06-01T00:00:00Z'),
        PHOTO('b', '2024-09-01T00:00:00Z'),
      ],
    });
    await p;
    expect(service.photos().map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('baut die Bildpfade korrekt zusammen', () => {
    expect(service.imageUrl('foo', 'xs')).toBe('data/foo_xs.jpg');
    expect(service.imageUrl('foo', 'full')).toBe('data/foo_full.jpg');
  });

  it('findById liefert das passende bzw. kein Bild', async () => {
    const p = service.load();
    httpMock.expectOne('data/catalog.json').flush({ catalog: [PHOTO('x', '2024-01-01T00:00:00Z')] });
    await p;
    expect(service.findById('x')?.title).toBe('X');
    expect(service.findById('nope')).toBeUndefined();
  });

  it('setzt einen Fehler, wenn der Katalog nicht geladen werden kann', async () => {
    const p = service.load();
    httpMock.expectOne('data/catalog.json').error(new ProgressEvent('fail'));
    await p;
    expect(service.error()).toBeTruthy();
    expect(service.photos()).toEqual([]);
  });
});
