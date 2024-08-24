import type { Routes } from '@angular/router';

export const playRoutes: Routes = [
  {
    path: 'nursery',
    loadComponent: () =>
      import('./views/nursery/nursery.component').then(
        (m) => m.NurseryComponent
      ),
    data: { title: 'NURSERY' },
  },
  {
    path: 'pokedex',
    loadComponent: () =>
      import('./views/pokedex/pokedex.component').then(
        (m) => m.PokedexComponent
      ),
    data: { title: 'POKEDEX' },
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./views/events/events.component').then((m) => m.EventsComponent),
    data: { title: 'EVENTS' },
  },
  {
    path: 'starters',
    loadComponent: () =>
      import('./views/starters/starters.component').then(
        (m) => m.StartersComponent
      ),
    data: { navigationDisabled: true, title: 'STARTERS' },
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./views/competition-history/competition-history.component').then(
        (m) => m.CompetitionHistoryComponent
      ),
    data: { title: 'HISTORY' },
  },
  {
    path: 'battle-event-stats',
    loadComponent: () =>
      import('./views/battle-events-stats/battle-events-stats.component').then(
        (m) => m.BattleEventsStatsComponent
      ),
    data: { title: 'BATTLE_EVENT_STATS' },
  },
  {
    path: 'battle/:id',
    loadComponent: () =>
      import('./views/new-battle/new-battle.component').then(
        (m) => m.NewBattleComponent
      ),
    data: { navigationDisabled: true, title: 'BATTLE' },
  },
  {
    path: 'pokedex-details/:id',
    loadComponent: () =>
      import('./views/pokedex-details/pokedex-details.component').then(
        (m) => m.PokedexDetailsComponent
      ),
  },
  {
    path: 'battle-resume',
    loadComponent: () =>
      import('./views/battle-resume/battle-resume.component').then(
        (m) => m.BattleResumeComponent
      ),
    data: { title: 'BATTLE-RESUME' },
  },
  {
    path: 'battle-strategy',
    loadComponent: () =>
      import(
        './views/default-battle-strategy/default-battle-strategy.component'
      ).then((m) => m.DefaultBattleStrategyComponent),
    data: { title: 'BATTLE-STRATEGY' },
  },
  {
    path: 'pcStorage',
    loadComponent: () =>
      import('./views/pc-storage/pc-storage.component').then(
        (m) => m.PcStorageComponent
      ),
    data: { title: 'PC-STORAGE' },
  },
  {
    path: 'trainers',
    loadComponent: () =>
      import('./views/trainers/trainers.component').then(
        (m) => m.TrainersComponent
      ),
    data: { title: 'TRAINERS' },
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./views/home/home.component').then((m) => m.HomeComponent),
    data: { title: 'HOME' },
  },
];
