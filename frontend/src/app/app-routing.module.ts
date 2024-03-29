import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { BattleComponent } from './views/battle/battle.component';
import { BattleResumeComponent } from './views/battle-resume/battle-resume.component';
import { PcStorageComponent } from './views/pc-storage/pc-storage.component';
import { TrainersComponent } from './views/trainers/trainers.component';
import { GamesComponent } from './views/games/games.component';
import { NurseryComponent } from './views/nursery/nursery.component';
import { ErrorComponent } from './core/components/error/error.component';
import { PokedexComponent } from './views/pokedex/pokedex.component';
import { AuthGuard, GameGuard } from './core/guards/permission-service';
import { PokedexDetailsComponent } from './views/pokedex-details/pokedex-details.component';

const routes: Routes = [
  { path: '404Error', component: ErrorComponent },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'HOME' },
    canActivate: [GameGuard],
  },
  { path: 'login', component: LoginComponent, data: { title: 'LOGIN' } },
  {
    path: 'battle/:id',
    component: BattleComponent,
    data: { goHomeDisabled: true, title: 'BATTLE' },
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
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
