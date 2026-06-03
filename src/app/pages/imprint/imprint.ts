import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../../services/config.service';

/**
 * Impressum-Seite. Die Angaben stammen vollständig aus der config.json
 * (Abschnitt "imprint") und werden hier nur dargestellt.
 */
@Component({
  selector: 'app-imprint',
  imports: [RouterLink],
  templateUrl: './imprint.html',
  styleUrl: './imprint.scss',
})
export class Imprint {
  private readonly config = inject(ConfigService);
  protected readonly imprint = computed(() => this.config.config().imprint);
}
