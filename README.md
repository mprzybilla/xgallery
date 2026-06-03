# XGallery

Eine schlanke, responsive Foto-Galerie als **Angular**-Single-Page-App, gestaltet mit
**Bootstrap**. Die Anwendung speist sich vollständig aus statischen JSON-Dateien und
Bildern und lässt sich als statisches Bundle hinter einem beliebigen Webserver
ausliefern – mitgeliefert wird ein **NGINX-Docker-Setup**.

## Features

- 📷 **Übersicht** im dichten, responsiven Raster (an Apple Fotos angelehnt), sortiert nach Aufnahmedatum
- 🔀 **Sortierung umschaltbar** (neueste/älteste zuerst)
- 🏷️ **Tag-Filter** mit Mehrfachauswahl (UND-Verknüpfung)
- 🔗 **Filter & Sortierung in der URL** – bleiben über Reload, Bookmark und Navigation erhalten
- 🖼️ **Lightbox** (Vollbild) mit Vor-/Zurück-Navigation und Tastatursteuerung (`Esc`, `←`, `→`)
- 📝 **Detailseite** mit Metadaten (Titel, Datum, Auflösung, Autor, Lizenz, Tags) und Download in voller Auflösung
- 🧩 **„Passend zu"-Empfehlungen** – pro Tag weitere Bilder, verlinkt und nach Datum sortiert
- ⚡ **Lazy-Loading** der Bilder + Infinite-Scroll
- ⚙️ **Konfigurierbar zur Laufzeit** über `config.json` – inkl. App-Titel, **Impressum** und **Datenschutz**
- 🐳 **Docker/NGINX**-Deployment mit Mount für die statischen Daten (Austausch ohne Rebuild)

## Tech-Stack

- [Angular](https://angular.dev) 21 (Standalone Components, Signals)
- [Bootstrap](https://getbootstrap.com) 5
- SCSS
- NGINX (Auslieferung) + Docker / Docker Compose

## Schnellstart (Entwicklung)

Voraussetzungen: Node.js ≥ 20, npm.

```bash
npm install
npm start
```

Die App läuft dann unter <http://localhost:4200>.

### Tests

Unit-Tests laufen mit [Vitest](https://vitest.dev) (Standard-Runner von Angular 21, jsdom):

```bash
npm test                 # Watch-Modus
npm test -- --watch=false  # einmaliger Lauf (z. B. für CI)
```

Getestet werden Services (Config/Katalog laden & sortieren), Guards sowie alle
Komponenten (Galerie-Filter/Sortierung, Detail-Empfehlungen, Lightbox, Impressum,
Datenschutz).

## Datenstruktur

Alle Inhalte werden zur Laufzeit relativ zur App unter `/data/` geladen. Im Repo liegen
diese Dateien unter [`public/data/`](public/data) (werden in den Build kopiert) und für den
Docker-Mount zusätzlich unter [`data/`](data).

```
data/
├── config.json          # globale Konfiguration
├── catalog.json         # Liste aller Bilder
├── <id>_xs.jpg          # Vorschaubild (Übersicht/Lightbox-Thumbs)
└── <id>_full.jpg        # volle Auflösung (Detailseite/Download)
```

### `config.json`

```json
{
  "appTitle": "XGallery",
  "imageCatalog": "/data/catalog.json",
  "imprint": {
    "enabled": true,
    "isPrivate": true,
    "provider": "Vorname Nachname",
    "address": { "street": "…", "zip": "…", "city": "…", "country": "…" },
    "email": "kontakt@example.com",
    "phone": "…",
    "responsible": "…"
  },
  "privacy": {
    "enabled": true,
    "intro": "…",
    "sections": [{ "title": "Verantwortlicher", "content": "Mehrzeiliger\nText" }]
  }
}
```

| Feld           | Pflicht | Beschreibung                                                        |
| -------------- | ------- | ------------------------------------------------------------------- |
| `appTitle`     | ✓       | Titel in Navigation und Browser-Tab                                 |
| `imageCatalog` | –       | Pfad zur Katalog-Datei (Standard: `/data/catalog.json`)             |
| `imprint`      | –       | Impressums-Angaben; fehlt der Block, wird kein Impressum-Link gezeigt |
| `privacy`      | –       | Datenschutz-Abschnitte; fehlt der Block, wird kein Datenschutz-Link gezeigt |

**Seiten abschalten:** Impressum und Datenschutz lassen sich unabhängig deaktivieren – ohne
die hinterlegten Daten zu verlieren. Setze dazu `enabled: false` im jeweiligen Block (oder
lasse den Block ganz weg). Bei deaktivierter Seite verschwindet der Footer-Link und ein
Direktaufruf von `/impressum` bzw. `/datenschutz` leitet zur Übersicht zurück. Ohne das Feld
(bzw. `enabled: true`) ist die Seite aktiv.

`imprint.isPrivate: true` stellt das Impressum auf den Auftritt als Privatperson um.

### `catalog.json`

```json
{
  "catalog": [
    {
      "id": "mittenwald",
      "title": "Mittenwald",
      "tags": ["berge", "alpen"],
      "Created": "2024-08-12T14:30:00Z",
      "resolution": "600x800px",
      "author": "Vorname Nachname",
      "license": "CC BY 4.0"
    }
  ]
}
```

Die `id` bestimmt die erwarteten Bildpfade: `/data/<id>_xs.jpg` und `/data/<id>_full.jpg`.
`Created` (ISO-Timestamp) steuert die Sortierung. `author` und `license` sind optional.

## Deployment mit Docker

```bash
docker compose up -d --build
```

Die App ist anschließend unter <http://localhost:8088> erreichbar (Port in
[`docker-compose.yaml`](docker-compose.yaml) anpassbar).

Der Ordner `./data` wird per Volume read-only in den Container gemountet und überlagert die
ins Image gebauten Daten:

```yaml
volumes:
  - ./data:/usr/share/nginx/html/data:ro
```

So lassen sich **Bilder, Katalog und Konfiguration ohne Rebuild austauschen**:

- **Nur Daten geändert** (`data/…`): kein Rebuild nötig, ggf. Seite neu laden.
- **Code geändert** (`src/…`): `docker compose up -d --build` (Code wird zur Build-Zeit ins Image kompiliert).

## CI/CD (GitHub Actions)

Die Pipeline [`.github/workflows/ci.yml`](.github/workflows/ci.yml) läuft bei **jedem Push**:

1. **Test & Build** – `npm ci`, Unit-Tests (`npm test -- --watch=false`) und Produktiv-Build.
   Schlagen die Tests fehl, bricht der gesamte Workflow ab.
2. **Build & Publish Docker image** – läuft nur, wenn Schritt 1 erfolgreich war. Baut das
   Image und published es in die **GitHub Container Registry** (`ghcr.io`).

Getaggt wird mit dem Commit-SHA, dem Branch-Namen und – auf dem Default-Branch – zusätzlich
`latest`. Es sind **keine zusätzlichen Secrets** nötig; die Authentifizierung läuft über das
automatische `GITHUB_TOKEN`.

Das veröffentlichte Image ziehen und starten:

```bash
docker run -d -p 8088:80 \
  -v "$(pwd)/data:/usr/share/nginx/html/data:ro" \
  ghcr.io/mprzybilla/xgallery:latest
```

## Projektstruktur

```
src/app/
├── components/lightbox/   # Vollbild-Lightbox
├── pages/
│   ├── gallery/           # Übersicht (Raster, Filter, Sortierung, Lazy-Load)
│   ├── detail/            # Detailseite + Empfehlungen
│   ├── imprint/           # Impressum
│   └── privacy/           # Datenschutz
├── services/
│   ├── config.service.ts  # lädt config.json beim Start
│   └── catalog.service.ts # lädt & sortiert den Katalog
└── models/                # TypeScript-Interfaces
```

## Lizenz

[MIT](LICENSE)