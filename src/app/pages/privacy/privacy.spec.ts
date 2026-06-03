import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it } from 'vitest';
import { Privacy } from './privacy';
import { ConfigService } from '../../services/config.service';
import { DEFAULT_APP_CONFIG } from '../../models/app-config.model';

describe('Privacy', () => {
  let config: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Privacy],
      providers: [provideRouter([]), provideHttpClient()],
    });
    config = TestBed.inject(ConfigService);
  });

  it('rendert Intro und alle Abschnitte', () => {
    config.config.set({
      ...DEFAULT_APP_CONFIG,
      privacy: {
        intro: 'Kurze Einleitung.',
        sections: [
          { title: 'Verantwortlicher', content: 'Max Mustermann' },
          { title: 'Server-Logfiles', content: 'Kurze Speicherung.' },
        ],
      },
    });
    const fixture = TestBed.createComponent(Privacy);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Kurze Einleitung.');
    expect(text).toContain('Verantwortlicher');
    expect(text).toContain('Server-Logfiles');
    const headings = fixture.nativeElement.querySelectorAll('h2');
    expect(headings.length).toBe(2);
  });

  it('zeigt einen Hinweis, wenn keine Erklärung konfiguriert ist', () => {
    config.config.set(DEFAULT_APP_CONFIG);
    const fixture = TestBed.createComponent(Privacy);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('keine Datenschutzerklärung');
  });
});
