import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConfigService } from './services/config.service';

/** Lässt /impressum nur zu, wenn das Impressum aktiviert ist – sonst zurück zur Übersicht. */
export const imprintGuard: CanActivateFn = () => {
  const config = inject(ConfigService);
  const router = inject(Router);
  return config.imprintEnabled() ? true : router.createUrlTree(['/']);
};

/** Lässt /datenschutz nur zu, wenn der Datenschutz aktiviert ist – sonst zurück zur Übersicht. */
export const privacyGuard: CanActivateFn = () => {
  const config = inject(ConfigService);
  const router = inject(Router);
  return config.privacyEnabled() ? true : router.createUrlTree(['/']);
};
