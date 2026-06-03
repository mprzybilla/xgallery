import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { Lightbox } from '../../components/lightbox/lightbox';
import { PhotoItem } from '../../models/photo-item.model';

/** Anzahl Kacheln, die initial und pro Nachladeschritt angezeigt werden. */
const PAGE_SIZE = 24;

/**
 * Übersichtsseite: Bilder nach Created sortiert in einem responsiven Raster,
 * mit Tag-Filter, Infinite-Scroll (Lazy-Loading) und Lightbox.
 *
 * Filter und Sortierung leben vollständig in der URL (Query-Parameter
 * ?tags=… und ?sort=asc) und bleiben so über Reload und Navigation erhalten.
 */
@Component({
  selector: 'app-gallery',
  imports: [Lightbox],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit, OnDestroy {
  protected readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** ?tags=tag1,tag2 — kommaseparierte Filter-Tags (UND-Verknüpfung). */
  readonly tagsParam = input<string | undefined>(undefined, { alias: 'tags' });
  /** ?sort=asc|desc — Sortierrichtung (Standard: desc = neueste zuerst). */
  readonly sortParam = input<string | undefined>(undefined, { alias: 'sort' });

  /** Aktiv gewählte Tags, aus dem URL-Parameter abgeleitet. */
  protected readonly selectedTags = computed<string[]>(() => {
    const raw = this.tagsParam();
    return raw ? raw.split(',').filter(Boolean) : [];
  });
  /** true = neueste zuerst (Standard), false = älteste zuerst. */
  protected readonly sortDesc = computed(() => this.sortParam() !== 'asc');

  /** Wie viele der gefilterten Bilder gerade gerendert werden. */
  protected readonly visibleCount = signal(PAGE_SIZE);
  /** Index des in der Lightbox geöffneten Bildes (null = geschlossen). */
  protected readonly lightboxIndex = signal<number | null>(null);

  /** Alle im Katalog vorkommenden Tags, alphabetisch sortiert. */
  protected readonly allTags = computed(() => {
    const tags = new Set<string>();
    for (const p of this.catalog.photos()) {
      p.tags?.forEach((t) => tags.add(t));
    }
    return [...tags].sort((a, b) => a.localeCompare(b));
  });

  /** Nach den aktiven Tags gefilterte und nach Sortierrichtung geordnete Bilder. */
  protected readonly filtered = computed<PhotoItem[]>(() => {
    const tags = this.selectedTags();
    // catalog.photos() ist bereits absteigend (neueste zuerst) sortiert.
    let list =
      tags.length === 0
        ? this.catalog.photos()
        : this.catalog.photos().filter((p) => tags.every((t) => p.tags?.includes(t)));
    if (!this.sortDesc()) {
      list = [...list].reverse();
    }
    return list;
  });

  /** Aktuell sichtbarer Ausschnitt (Lazy-Loading). */
  protected readonly visible = computed(() => this.filtered().slice(0, this.visibleCount()));

  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
  private readonly observer: IntersectionObserver;

  constructor() {
    // Bei jeder Filter-/Sortieränderung wieder von vorne anzeigen.
    effect(() => {
      this.selectedTags();
      this.sortDesc();
      this.visibleCount.set(PAGE_SIZE);
    });

    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.loadMore();
      }
    });

    // Sentinel kann durch @if erscheinen/verschwinden — auf Verfügbarkeit reagieren.
    effect((onCleanup) => {
      const el = this.sentinel()?.nativeElement;
      if (el) {
        this.observer.observe(el);
        onCleanup(() => this.observer.unobserve(el));
      }
    });
  }

  ngOnInit(): void {
    void this.catalog.load();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  /** Schaltet einen Tag im Filter an/aus und schreibt das Ergebnis in die URL. */
  toggleTag(tag: string): void {
    const tags = this.selectedTags();
    const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    this.updateQuery({ tags: next.length ? next.join(',') : null });
  }

  clearTags(): void {
    this.updateQuery({ tags: null });
  }

  toggleSort(): void {
    // Standard ist desc -> beim Umschalten 'asc' setzen bzw. wieder entfernen.
    this.updateQuery({ sort: this.sortDesc() ? 'asc' : null });
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
  }

  /** Aktualisiert Query-Parameter und behält die übrigen bei (null = entfernen). */
  private updateQuery(params: Record<string, string | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  private loadMore(): void {
    if (this.visibleCount() < this.filtered().length) {
      this.visibleCount.update((c) => c + PAGE_SIZE);
    }
  }
}
