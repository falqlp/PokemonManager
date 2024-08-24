import type { Routes } from '@angular/router';

import { AuthGuard, GameGuard } from './core/guards/permission-service';
import { playRoutes } from './play.routes';

export const routes: Routes = [
  {
    path: '404Error',
    loadComponent: () =>
      import('./core/components/error/error.component').then(
        (m) => m.ErrorComponent
      ),
  },
  {
    path: 'verify-email/:id',
    loadComponent: () =>
      import('./views/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent
      ),
  },
  {
    path: 'change-password/:id',
    loadComponent: () =>
      import('./views/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/login/login.component').then((m) => m.LoginComponent),
    data: { title: 'LOGIN' },
  },
  {
    path: 'games',
    loadComponent: () =>
      import('./views/games/games.component').then((m) => m.GamesComponent),
    data: { title: 'PARTIES' },
    canActivate: [AuthGuard],
  },
  {
    path: 'play',
    children: playRoutes,
    canActivateChild: [GameGuard],
  },
  { path: '**', redirectTo: 'home' },
];
