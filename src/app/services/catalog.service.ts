import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Catalog, PhotoItem } from '../models/photo-item.model';
import { ConfigService } from './config.service';

/**
 * Lädt den Bildkatalog und liefert die Fotos nach Created-Timestamp sortiert.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  /** Alle Fotos, absteigend nach Erstellungsdatum (neueste zuerst). */
  readonly photos = signal<PhotoItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private loaded = false;

  /** Lädt den Katalog einmalig (Pfad stammt aus der config.json). */
  async load(): Promise<void> {
    if (this.loaded) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const path = this.normalize(this.configService.config().imageCatalog);
      const data = await firstValueFrom(this.http.get<Catalog>(path));
      const items = [...(data?.catalog ?? [])].sort(
        (a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime(),
      );
      this.photos.set(items);
      this.loaded = true;
    } catch (err) {
      console.error('Katalog konnte nicht geladen werden.', err);
      this.error.set('Der Bildkatalog konnte nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }

  /** Liefert ein einzelnes Foto anhand seiner ID. */
  findById(id: string): PhotoItem | undefined {
    return this.photos().find((p) => p.id === id);
  }

  /** Aktualisiert ein Foto in-memory (Edit-Modus). Persistenz erfolgt über Download. */
  updatePhoto(id: string, patch: Partial<PhotoItem>): void {
    this.photos.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }

  /** Serialisiert den aktuellen Katalog im Format der catalog.json. */
  toCatalogJson(): string {
    return JSON.stringify({ catalog: this.photos() }, null, 2) + '\n';
  }

  /** Baut den Pfad zu einer Bildausprägung: /data/<id>_<variant>.jpg */
  imageUrl(id: string, variant: 'xs' | 'full'): string {
    return `data/${id}_${variant}.jpg`;
  }

  /** Entfernt einen führenden Slash, damit der Pfad relativ zur App-URL bleibt. */
  private normalize(path: string): string {
    return path.replace(/^\//, '');
  }
}
