import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../services/config.service';

/**
 * Datenschutz-Seite. Die Inhalte stammen vollständig aus der config.json
 * (Abschnitt "privacy") und werden hier nur dargestellt.
 */
@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy {
  private readonly config = inject(ConfigService);
  protected readonly privacy = computed(() => this.config.config().privacy);
}
