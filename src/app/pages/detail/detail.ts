import { Component, computed, inject, input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';

/**
 * Detailseite eines Bildes: zeigt das Bild groß zusammen mit den Meta-Infos
 * und bietet Buttons zum Herunterladen der vollen Auflösung.
 */
@Component({
  selector: 'app-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {
  protected readonly catalog = inject(CatalogService);

  /** Route-Parameter :id (per withComponentInputBinding gebunden). */
  readonly id = input.required<string>();

  protected readonly photo = computed(() => this.catalog.findById(this.id()));
  protected readonly fullUrl = computed(() => this.catalog.imageUrl(this.id(), 'full'));

  /**
   * Pro Tag des aktuellen Bildes die übrigen Bilder mit demselben Tag,
   * nach Created absteigend sortiert (neueste zuerst). Die globale
   * Foto-Liste ist bereits so sortiert, daher genügt das Filtern.
   * Tags ohne weitere Bilder werden ausgelassen.
   */
  protected readonly related = computed(() => {
    const current = this.photo();
    if (!current) {
      return [];
    }
    return (current.tags ?? [])
      .map((tag) => ({
        tag,
        photos: this.catalog
          .photos()
          .filter((p) => p.id !== current.id && p.tags?.includes(tag)),
      }))
      .filter((group) => group.photos.length > 0);
  });

  ngOnInit(): void {
    // Sicherstellen, dass der Katalog auch beim Direktaufruf geladen ist.
    void this.catalog.load();
  }
}
