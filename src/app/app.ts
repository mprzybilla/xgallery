import { DOCUMENT } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CatalogService } from './services/catalog.service';
import { ConfigService } from './services/config.service';
import { EditModeService } from './services/edit-mode.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly config = inject(ConfigService);
  private readonly catalog = inject(CatalogService);
  private readonly doc = inject(DOCUMENT);
  protected readonly editMode = inject(EditModeService);

  protected readonly appTitle = computed(() => this.config.config().appTitle);
  protected readonly hasImprint = this.config.imprintEnabled;
  protected readonly hasPrivacy = this.config.privacyEnabled;
  protected readonly hasFooter = computed(() => this.hasImprint() || this.hasPrivacy());

  /** Lädt die aktuell im Speicher gehaltene catalog.json als Datei herunter. */
  protected downloadCatalog(): void {
    const json = this.catalog.toCatalogJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = this.doc.createElement('a');
    a.href = url;
    a.download = 'catalog.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}
