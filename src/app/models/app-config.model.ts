/**
 * Anschrift des Diensteanbieters.
 */
export interface ImprintAddress {
  street: string;
  zip: string;
  city: string;
  country?: string;
}

/**
 * Impressums-Angaben (§5 DDG / §5 ECG). Alle Felder außer den
 * Pflichtangaben (Anbieter + Anschrift + Kontakt) sind optional.
 */
export interface Imprint {
  /**
   * Schaltet die Impressum-Seite und den Footer-Link ab, ohne die Daten zu
   * entfernen. Standard (Feld weggelassen) = aktiv. false = deaktiviert.
   */
  enabled?: boolean;
  /**
   * true = Auftritt als Privatperson (private, nicht-geschäftsmäßige Seite).
   * Dann entfällt die Überschrift "Angaben gemäß § 5 DDG" und es werden
   * keine geschäftlichen Felder (Vertretung, USt-IdNr.) erwartet.
   */
  isPrivate?: boolean;
  /** Diensteanbieter: Name bzw. Firma (bei Privatpersonen: Vor- und Nachname). */
  provider: string;
  /** Postanschrift. */
  address: ImprintAddress;
  /** Kontakt-E-Mail. */
  email: string;
  /** Telefonnummer (optional). */
  phone?: string;
  /** Bei juristischen Personen: gesetzlicher Vertreter (optional). */
  representedBy?: string;
  /** Umsatzsteuer-Identifikationsnummer (optional). */
  vatId?: string;
  /** Inhaltlich Verantwortlicher nach § 18 Abs. 2 MStV (optional). */
  responsible?: string;
  /** Weitere freie Angaben, z.B. Registereintrag oder Haftungshinweis (optional). */
  additional?: string;
}

/**
 * Ein frei betitelter Abschnitt der Datenschutzerklärung.
 */
export interface PrivacySection {
  title: string;
  /** Fließtext; Zeilenumbrüche bleiben erhalten. */
  content: string;
}

/**
 * Datenschutzerklärung — frei konfigurierbare Abschnitte.
 */
export interface Privacy {
  /**
   * Schaltet die Datenschutz-Seite und den Footer-Link ab, ohne die Daten zu
   * entfernen. Standard (Feld weggelassen) = aktiv. false = deaktiviert.
   */
  enabled?: boolean;
  /** Optionaler Einleitungstext. */
  intro?: string;
  /** Inhaltliche Abschnitte (z.B. Verantwortlicher, Server-Logs, Rechte). */
  sections: PrivacySection[];
}

/**
 * Inhalt der /data/config.json — globale Konfiguration der Anwendung.
 */
export interface AppConfig {
  /** Titel der Anwendung (Navigation + Browser-Tab). */
  appTitle: string;
  /** Pfad zur Katalog-JSON mit den Bilddaten. */
  imageCatalog: string;
  /** Impressums-Angaben. Fehlt der Block, wird kein Impressum-Link angezeigt. */
  imprint?: Imprint;
  /** Datenschutzerklärung. Fehlt der Block, wird kein Datenschutz-Link angezeigt. */
  privacy?: Privacy;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  appTitle: 'XGallery',
  imageCatalog: '/data/catalog.json',
};
