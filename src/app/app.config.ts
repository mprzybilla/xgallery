import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { routes } from './app.routes';
import { ConfigService } from './services/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    // Konfiguration vor dem Rendern laden und den Browser-Tab-Titel setzen.
    provideAppInitializer(async () => {
      const config = inject(ConfigService);
      const title = inject(Title);
      await config.load();
      title.setTitle(config.config().appTitle);
    }),
  ],
};
