import { Routes } from '@angular/router';
import { imprintGuard, privacyGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
  },
  {
    path: 'photo/:id',
    loadComponent: () => import('./pages/detail/detail').then((m) => m.Detail),
  },
  {
    path: 'impressum',
    canActivate: [imprintGuard],
    loadComponent: () => import('./pages/imprint/imprint').then((m) => m.Imprint),
  },
  {
    path: 'datenschutz',
    canActivate: [privacyGuard],
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  { path: '**', redirectTo: '' },
];
