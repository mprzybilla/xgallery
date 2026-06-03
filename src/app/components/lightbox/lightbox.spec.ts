import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Lightbox } from './lightbox';
import { PhotoItem } from '../../models/photo-item.model';

const PHOTOS: PhotoItem[] = [
  { id: 'a', title: 'A', tags: [], Created: '2025-01-01T00:00:00Z', resolution: '1x1px' },
  { id: 'b', title: 'B', tags: [], Created: '2024-01-01T00:00:00Z', resolution: '1x1px' },
  { id: 'c', title: 'C', tags: [], Created: '2023-01-01T00:00:00Z', resolution: '1x1px' },
];

function setup(index = 0) {
  TestBed.configureTestingModule({
    imports: [Lightbox],
    providers: [provideRouter([]), provideHttpClient()],
  });
  const fixture = TestBed.createComponent(Lightbox);
  fixture.componentRef.setInput('photos', PHOTOS);
  fixture.componentRef.setInput('index', index);
  fixture.detectChanges();
  return fixture;
}

describe('Lightbox', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('zeigt das volle Bild des aktuellen Index', () => {
    const fixture = setup(1);
    const img = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toBe('data/b_full.jpg');
  });

  it('next() blättert vorwärts und läuft zirkulär um', () => {
    const fixture = setup(2);
    const cmp: any = fixture.componentInstance;
    cmp.next();
    expect(cmp.index()).toBe(0);
  });

  it('prev() blättert rückwärts und läuft zirkulär um', () => {
    const fixture = setup(0);
    const cmp: any = fixture.componentInstance;
    cmp.prev();
    expect(cmp.index()).toBe(2);
  });

  it('emittiert closed beim Schließen', () => {
    const fixture = setup(0);
    const spy = vi.fn();
    fixture.componentInstance.closed.subscribe(spy);
    fixture.componentInstance.close();
    expect(spy).toHaveBeenCalled();
  });

  it('reagiert auf Tastatur: Escape schließt, Pfeile navigieren', () => {
    const fixture = setup(0);
    const cmp: any = fixture.componentInstance;
    const spy = vi.fn();
    cmp.closed.subscribe(spy);

    cmp.onKey(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(cmp.index()).toBe(1);
    cmp.onKey(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(cmp.index()).toBe(0);
    cmp.onKey(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(spy).toHaveBeenCalled();
  });
});
