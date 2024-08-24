import type { Routes } from '@angular/router';
import { ErrorComponent } from './core/components/error/error.component';
import { HomeComponent } from './views/home/home.component';
import { AuthGuard, GameGuard } from './core/guards/permission-service';
import { LoginComponent } from './views/login/login.component';
import { PokedexDetailsComponent } from './views/pokedex-details/pokedex-details.component';
import { BattleResumeComponent } from './views/battle-resume/battle-resume.component';
import { PcStorageComponent } from './views/pc-storage/pc-storage.component';
import { TrainersComponent } from './views/trainers/trainers.component';
import { GamesComponent } from './views/games/games.component';
import { NurseryComponent } from './views/nursery/nursery.component';
import { PokedexComponent } from './views/pokedex/pokedex.component';
import { EventsComponent } from './views/events/events.component';
import { StartersComponent } from './views/starters/starters.component';
import { NewBattleComponent } from './views/new-battle/new-battle.component';
import { VerifyEmailComponent } from './views/verify-email/verify-email.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { CompetitionHistoryComponent } from './views/competition-history/competition-history.component';
import { BattleEventsStatsComponent } from './views/battle-events-stats/battle-events-stats.component';
import { DefaultBattleStrategyComponent } from './views/default-battle-strategy/default-battle-strategy.component';

export const routes: Routes = [
  { path: '404Error', component: ErrorComponent },
  {
    path: 'verify-email/:id',
    component: VerifyEmailComponent,
  },
  {
    path: 'change-password/:id',
    component: ChangePasswordComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'HOME' },
    canActivate: [GameGuard],
  },
  { path: 'login', component: LoginComponent, data: { title: 'LOGIN' } },
  {
    path: 'battle/:id',
    component: NewBattleComponent,
    data: { navigationDisabled: true, title: 'BATTLE' },
    canActivate: [GameGuard],
  },
  {
    path: 'pokedex-details/:id',
    component: PokedexDetailsComponent,
    canActivate: [GameGuard],
  },
  {
    path: 'battle-resume',
    component: BattleResumeComponent,
    data: { title: 'BATTLE-RESUME' },
    canActivate: [GameGuard],
  },
  {
    path: 'battle-strategy',
    component: DefaultBattleStrategyComponent,
    data: { title: 'BATTLE-STRATEGY' },
    canActivate: [GameGuard],
  },
  {
    path: 'pcStorage',
    component: PcStorageComponent,
    data: { title: 'PC-STORAGE' },
    canActivate: [GameGuard],
  },
  {
    path: 'trainers',
    component: TrainersComponent,
    data: { title: 'TRAINERS' },
    canActivate: [GameGuard],
  },
  {
    path: 'games',
    component: GamesComponent,
    data: { title: 'PARTIES' },
    canActivate: [AuthGuard],
  },
  {
    path: 'nursery',
    component: NurseryComponent,
    data: { title: 'NURSERY' },
    canActivate: [GameGuard],
  },
  {
    path: 'pokedex',
    component: PokedexComponent,
    data: { title: 'POKEDEX' },
    canActivate: [GameGuard],
  },
  {
    path: 'events',
    component: EventsComponent,
    data: { title: 'EVENTS' },
    canActivate: [GameGuard],
  },
  {
    path: 'starters',
    component: StartersComponent,
    data: { navigationDisabled: true, title: 'STARTERS' },
    canActivate: [GameGuard],
  },
  {
    path: 'history',
    component: CompetitionHistoryComponent,
    data: { title: 'HISTORY' },
    canActivate: [GameGuard],
  },
  {
    path: 'battle-event-stats',
    component: BattleEventsStatsComponent,
    data: { title: 'BATTLE_EVENT_STATS' },
    canActivate: [GameGuard],
  },
  { path: '**', redirectTo: 'home' },
];
