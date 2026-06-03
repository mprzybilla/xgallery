import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ConfigService } from './config.service';
import { DEFAULT_APP_CONFIG } from '../models/app-config.model';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('legt die geladene Config über die Defaults', async () => {
    const p = service.load();
    httpMock.expectOne('data/config.json').flush({ appTitle: 'Meine Galerie' });
    await p;
    expect(service.config().appTitle).toBe('Meine Galerie');
    // nicht übergebenes Feld bleibt auf dem Default
    expect(service.config().imageCatalog).toBe(DEFAULT_APP_CONFIG.imageCatalog);
  });

  it('behält die Defaults bei einem Ladefehler', async () => {
    const p = service.load();
    httpMock.expectOne('data/config.json').error(new ProgressEvent('fail'));
    await p;
    expect(service.config()).toEqual(DEFAULT_APP_CONFIG);
  });

  it('imprintEnabled: aktiv wenn Block vorhanden und nicht abgeschaltet', () => {
    expect(service.imprintEnabled()).toBe(false); // kein Block
    service.config.set({ ...DEFAULT_APP_CONFIG, imprint: { provider: 'X', address: { street: '', zip: '', city: '' }, email: 'a@b.de' } });
    expect(service.imprintEnabled()).toBe(true);
    service.config.update((c) => ({ ...c, imprint: { ...c.imprint!, enabled: false } }));
    expect(service.imprintEnabled()).toBe(false);
  });

  it('privacyEnabled: aktiv wenn Block vorhanden und nicht abgeschaltet', () => {
    expect(service.privacyEnabled()).toBe(false);
    service.config.set({ ...DEFAULT_APP_CONFIG, privacy: { sections: [] } });
    expect(service.privacyEnabled()).toBe(true);
    service.config.update((c) => ({ ...c, privacy: { ...c.privacy!, enabled: false } }));
    expect(service.privacyEnabled()).toBe(false);
  });
});
