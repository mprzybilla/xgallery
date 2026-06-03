/**
 * Ein einzelnes Foto aus der catalog.json.
 */
export interface PhotoItem {
  /** Eindeutige ID. Bestimmt auch die Bildpfade: /data/<id>_xs.jpg & /data/<id>_full.jpg */
  id: string;
  /** Anzeige-Titel des Bildes. */
  title: string;
  /** Frei wählbare Schlagworte. */
  tags: string[];
  /** Erstellungszeitpunkt (ISO-Timestamp), bestimmt die Sortierung. */
  Created: string;
  /** Auflösung als Text, z.B. "600x800px". */
  resolution: string;
  /** Urheber des Bildes (optional). */
  author?: string;
  /** Lizenz, z.B. "CC BY 4.0" (optional). */
  license?: string;
}

/**
 * Wurzelobjekt der catalog.json.
 */
export interface Catalog {
  catalog: PhotoItem[];
}
