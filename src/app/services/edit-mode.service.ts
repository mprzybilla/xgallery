import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

/**
 * Globaler Edit-Modus. Per Hotkey (Cmd/Ctrl+E) umschaltbar.
 * Komponenten, die Edit-Funktionen anbieten, beobachten `enabled`.
 */
@Injectable({ providedIn: 'root' })
export class EditModeService {
  private readonly doc = inject(DOCUMENT);
  readonly enabled = signal(false);

  constructor() {
    const win = this.doc.defaultView;
    if (!win) {
      return;
    }
    win.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        this.enabled.update((v) => !v);
      }
    });
  }
}
