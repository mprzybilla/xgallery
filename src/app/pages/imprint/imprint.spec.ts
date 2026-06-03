import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it } from 'vitest';
import { Imprint } from './imprint';
import { ConfigService } from '../../services/config.service';
import { DEFAULT_APP_CONFIG } from '../../models/app-config.model';

describe('Imprint', () => {
  let config: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Imprint],
      providers: [provideRouter([]), provideHttpClient()],
    });
    config = TestBed.inject(ConfigService);
  });

  it('rendert die Impressums-Angaben aus der Konfiguration', () => {
    config.config.set({
      ...DEFAULT_APP_CONFIG,
      imprint: {
        isPrivate: true,
        provider: 'Erika Musterfrau',
        address: { street: 'Weg 1', zip: '12345', city: 'Musterstadt' },
        email: 'erika@example.com',
      },
    });
    const fixture = TestBed.createComponent(Imprint);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Erika Musterfrau');
    expect(text).toContain('erika@example.com');
    // Privatperson-Variante: keine § 5 DDG Überschrift
    expect(text).toContain('Verantwortlich für den Inhalt dieser Website');
  });

  it('zeigt einen Hinweis, wenn keine Angaben konfiguriert sind', () => {
    config.config.set(DEFAULT_APP_CONFIG);
    const fixture = TestBed.createComponent(Imprint);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('keine Impressums-Angaben');
  });
});
