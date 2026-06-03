import { Component, computed, HostListener, inject, input, model, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { PhotoItem } from '../../models/photo-item.model';

/**
 * Vollbild-Lightbox: zeigt das volle Bild (_full) als Overlay mit
 * Vor-/Zurück-Navigation, Tastatursteuerung (Esc / Pfeile) und einem
 * Link zur Detailseite. Operiert auf der übergebenen (gefilterten) Liste.
 */
@Component({
  selector: 'app-lightbox',
  imports: [RouterLink],
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
})
export class Lightbox {
  protected readonly catalog = inject(CatalogService);

  /** Die Bilder, durch die navigiert wird (z.B. die gefilterte Liste). */
  readonly photos = input.required<PhotoItem[]>();
  /** Aktueller Index in `photos` (zweiweg-gebunden). */
  readonly index = model.required<number>();
  /** Wird ausgelöst, wenn die Lightbox geschlossen werden soll. */
  readonly closed = output<void>();

  protected readonly current = computed<PhotoItem | undefined>(() => this.photos()[this.index()]);
  protected readonly fullUrl = computed(() => {
    const p = this.current();
    return p ? this.catalog.imageUrl(p.id, 'full') : '';
  });

  next(): void {
    this.index.update((i) => (i + 1) % this.photos().length);
  }

  prev(): void {
    this.index.update((i) => (i - 1 + this.photos().length) % this.photos().length);
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowRight':
        this.next();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
    }
  }
}
