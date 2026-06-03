import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it } from 'vitest';
import { imprintGuard, privacyGuard } from './guards';
import { ConfigService } from './services/config.service';
import { DEFAULT_APP_CONFIG } from './models/app-config.model';

describe('Route-Guards', () => {
  let config: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()],
    });
    config = TestBed.inject(ConfigService);
  });

  const run = (guard: typeof imprintGuard) =>
    TestBed.runInInjectionContext(() => guard({} as never, {} as never));

  it('imprintGuard erlaubt Zugriff bei aktivem Impressum', () => {
    config.config.set({
      ...DEFAULT_APP_CONFIG,
      imprint: { provider: 'X', address: { street: '', zip: '', city: '' }, email: 'a@b.de' },
    });
    expect(run(imprintGuard)).toBe(true);
  });

  it('imprintGuard leitet bei deaktiviertem Impressum auf die Übersicht um', () => {
    config.config.set(DEFAULT_APP_CONFIG); // kein Impressum
    expect(run(imprintGuard)).toBeInstanceOf(UrlTree);
  });

  it('privacyGuard leitet bei deaktiviertem Datenschutz um', () => {
    config.config.set(DEFAULT_APP_CONFIG);
    expect(run(privacyGuard)).toBeInstanceOf(UrlTree);
  });
});
