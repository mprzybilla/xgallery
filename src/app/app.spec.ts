import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { ConfigService } from './services/config.service';
import { DEFAULT_APP_CONFIG } from './models/app-config.model';

describe('App', () => {
  let config: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient()],
    });
    config = TestBed.inject(ConfigService);
  });

  it('zeigt den App-Titel aus der Konfiguration in der Navbar', () => {
    config.config.set({ ...DEFAULT_APP_CONFIG, appTitle: 'Foto-Sammlung' });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const brand = fixture.nativeElement.querySelector('.navbar-brand');
    expect(brand.textContent.trim()).toBe('Foto-Sammlung');
  });

  it('blendet den Footer aus, wenn weder Impressum noch Datenschutz aktiv sind', () => {
    config.config.set(DEFAULT_APP_CONFIG);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();
  });

  it('zeigt beide Footer-Links, wenn Impressum und Datenschutz aktiv sind', () => {
    config.config.set({
      ...DEFAULT_APP_CONFIG,
      imprint: { provider: 'X', address: { street: '', zip: '', city: '' }, email: 'a@b.de' },
      privacy: { sections: [] },
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('footer a');
    const texts = Array.from(links).map((a: any) => a.textContent.trim());
    expect(texts).toContain('Impressum');
    expect(texts).toContain('Datenschutz');
  });
});
