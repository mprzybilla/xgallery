import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Detail } from './detail';
import { PhotoItem } from '../../models/photo-item.model';

const CATALOG: PhotoItem[] = [
  { id: 'winter', title: 'Winter', tags: ['berge', 'schnee'], Created: '2025-01-01T00:00:00Z', resolution: '1x1px' },
  { id: 'mittenwald', title: 'Mittenwald', tags: ['berge', 'alpen'], Created: '2024-01-01T00:00:00Z', resolution: '1x1px' },
  { id: 'see', title: 'See', tags: ['wasser'], Created: '2023-01-01T00:00:00Z', resolution: '1x1px' },
];

async function setup(id: string) {
  TestBed.configureTestingModule({
    imports: [Detail],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  const fixture = TestBed.createComponent(Detail);
  fixture.componentRef.setInput('id', id);
  fixture.detectChanges(); // löst ngOnInit -> load() aus
  TestBed.inject(HttpTestingController).expectOne('data/catalog.json').flush({ catalog: CATALOG });
  await fixture.whenStable(); // asynchrones load() abwarten
  fixture.detectChanges();
  return fixture;
}

describe('Detail', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('findet das aktuelle Bild über die ID', async () => {
    const cmp: any = (await setup('mittenwald')).componentInstance;
    expect(cmp.photo()?.title).toBe('Mittenwald');
  });

  it('gruppiert ähnliche Bilder pro Tag und schließt das aktuelle aus', async () => {
    const cmp: any = (await setup('mittenwald')).componentInstance;
    const related = cmp.related();
    // 'berge' hat ein weiteres Bild (winter), 'alpen' keines -> nur eine Gruppe
    expect(related).toHaveLength(1);
    expect(related[0].tag).toBe('berge');
    expect(related[0].photos.map((p: PhotoItem) => p.id)).toEqual(['winter']);
  });

  it('liefert keine Gruppen, wenn kein Tag geteilt wird', async () => {
    const cmp: any = (await setup('see')).componentInstance;
    expect(cmp.related()).toHaveLength(0);
  });
});
