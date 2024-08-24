import type { Routes } from '@angular/router';

import { AuthGuard, GameGuard } from './core/guards/permission-service';

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
    path: 'home',
    loadComponent: () =>
      import('./views/home/home.component').then((m) => m.HomeComponent),
    data: { title: 'HOME' },
    canActivate: [GameGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/login/login.component').then((m) => m.LoginComponent),
    data: { title: 'LOGIN' },
  },
  {
    path: 'battle/:id',
    loadComponent: () =>
      import('./views/new-battle/new-battle.component').then(
        (m) => m.NewBattleComponent
      ),
    data: { navigationDisabled: true, title: 'BATTLE' },
    canActivate: [GameGuard],
  },
  {
    path: 'pokedex-details/:id',
    loadComponent: () =>
      import('./views/pokedex-details/pokedex-details.component').then(
        (m) => m.PokedexDetailsComponent
      ),
    canActivate: [GameGuard],
  },
  {
    path: 'battle-resume',
    loadComponent: () =>
      import('./views/battle-resume/battle-resume.component').then(
        (m) => m.BattleResumeComponent
      ),
    data: { title: 'BATTLE-RESUME' },
    canActivate: [GameGuard],
  },
  {
    path: 'battle-strategy',
    loadComponent: () =>
      import(
        './views/default-battle-strategy/default-battle-strategy.component'
      ).then((m) => m.DefaultBattleStrategyComponent),
    data: { title: 'BATTLE-STRATEGY' },
    canActivate: [GameGuard],
  },
  {
    path: 'pcStorage',
    loadComponent: () =>
      import('./views/pc-storage/pc-storage.component').then(
        (m) => m.PcStorageComponent
      ),
    data: { title: 'PC-STORAGE' },
    canActivate: [GameGuard],
  },
  {
    path: 'trainers',
    loadComponent: () =>
      import('./views/trainers/trainers.component').then(
        (m) => m.TrainersComponent
      ),
    data: { title: 'TRAINERS' },
    canActivate: [GameGuard],
  },
  {
    path: 'games',
    loadComponent: () =>
      import('./views/games/games.component').then((m) => m.GamesComponent),
    data: { title: 'PARTIES' },
    canActivate: [AuthGuard],
  },
  {
    path: 'nursery',
    loadComponent: () =>
      import('./views/nursery/nursery.component').then(
        (m) => m.NurseryComponent
      ),
    data: { title: 'NURSERY' },
    canActivate: [GameGuard],
  },
  {
    path: 'pokedex',
    loadComponent: () =>
      import('./views/pokedex/pokedex.component').then(
        (m) => m.PokedexComponent
      ),
    data: { title: 'POKEDEX' },
    canActivate: [GameGuard],
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./views/events/events.component').then((m) => m.EventsComponent),
    data: { title: 'EVENTS' },
    canActivate: [GameGuard],
  },
  {
    path: 'starters',
    loadComponent: () =>
      import('./views/starters/starters.component').then(
        (m) => m.StartersComponent
      ),
    data: { navigationDisabled: true, title: 'STARTERS' },
    canActivate: [GameGuard],
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./views/competition-history/competition-history.component').then(
        (m) => m.CompetitionHistoryComponent
      ),
    data: { title: 'HISTORY' },
    canActivate: [GameGuard],
  },
  {
    path: 'battle-event-stats',
    loadComponent: () =>
      import('./views/battle-events-stats/battle-events-stats.component').then(
        (m) => m.BattleEventsStatsComponent
      ),
    data: { title: 'BATTLE_EVENT_STATS' },
    canActivate: [GameGuard],
  },
  { path: '**', redirectTo: 'home' },
];
