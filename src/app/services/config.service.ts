import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig, DEFAULT_APP_CONFIG } from '../models/app-config.model';

/**
 * Lädt die globale Konfiguration (/data/config.json) und stellt sie
 * applikationsweit zur Verfügung. Wird beim App-Start initialisiert.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);

  /** Reaktives Konfigurationsobjekt, initial mit Standardwerten gefüllt. */
  readonly config = signal<AppConfig>(DEFAULT_APP_CONFIG);

  /** Impressum aktiv: Block vorhanden und nicht via enabled:false abgeschaltet. */
  readonly imprintEnabled = computed(() => {
    const im = this.config().imprint;
    return !!im && im.enabled !== false;
  });

  /** Datenschutz aktiv: Block vorhanden und nicht via enabled:false abgeschaltet. */
  readonly privacyEnabled = computed(() => {
    const pv = this.config().privacy;
    return !!pv && pv.enabled !== false;
  });

  /**
   * Lädt /data/config.json relativ zur Anwendung. Fehlende Felder werden
   * mit den Standardwerten aufgefüllt. Bei Fehlern bleiben die Defaults aktiv.
   */
  async load(): Promise<void> {
    try {
      const loaded = await firstValueFrom(this.http.get<Partial<AppConfig>>('data/config.json'));
      this.config.set({ ...DEFAULT_APP_CONFIG, ...loaded });
    } catch (err) {
      console.error('Konfiguration konnte nicht geladen werden, nutze Standardwerte.', err);
    }
  }
}
