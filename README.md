![XGallery Logo](/public/icon.png)

# XGallery

Eine schlanke, responsive Foto-Galerie SPA. Die Anwendung speist sich vollständig aus statischen JSON-Dateien und Bildern und lässt sich als statisches Bundle hinter einem beliebigen Webserver ausliefern – kann via Docker bereitgestellt werden.

## Features

- 📷 **Übersicht** im dichten, responsiven Raster, sortiert nach Aufnahmedatum
- 🔀 **Sortierung umschaltbar** (neueste/älteste zuerst)
- 🏷️ **Tag-Filter** mit Mehrfachauswahl (UND-Verknüpfung)
- 🔗 **Filter & Sortierung in der URL** – bleiben über Reload, Bookmark und Navigation erhalten
- 🖼️ **Lightbox** (Vollbild) mit Vor-/Zurück-Navigation und Tastatursteuerung (`Esc`, `←`, `→`)
- 📝 **Detailseite** mit Metadaten (Titel, Datum, Auflösung, Autor, Lizenz, Tags) und Download in voller Auflösung
- 🧩 **„Passend zu"-Empfehlungen** – pro Tag weitere Bilder, verlinkt und nach Datum sortiert
- ⚡ **Lazy-Loading** der Bilder + Infinite-Scroll
- ⚙️ **Konfigurierbar zur Laufzeit** über `config.json` – inkl. App-Titel, **Impressum** und **Datenschutz**
- 🐳 **Docker/NGINX**-Deployment mit Mount für die statischen Daten (Austausch ohne Rebuild)
