import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly config = inject(ConfigService);
  protected readonly appTitle = computed(() => this.config.config().appTitle);
  protected readonly hasImprint = this.config.imprintEnabled;
  protected readonly hasPrivacy = this.config.privacyEnabled;
  protected readonly hasFooter = computed(() => this.hasImprint() || this.hasPrivacy());
}
