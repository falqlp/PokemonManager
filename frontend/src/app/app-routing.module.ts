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

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { title: 'HOME' } },
  { path: 'login', component: LoginComponent, data: { title: 'LOGIN' } },
  {
    path: 'battle/:id',
    component: BattleComponent,
    data: { goHomeDisabled: true, title: 'BATTLE' },
  },
  {
    path: 'battle-resume',
    component: BattleResumeComponent,
    data: { title: 'BATTLE-RESUME' },
  },
  {
    path: 'pcStorage',
    component: PcStorageComponent,
    data: { title: 'PC-STORAGE' },
  },
  {
    path: 'trainers',
    component: TrainersComponent,
    data: { title: 'TRAINERS' },
  },
  {
    path: 'games',
    component: GamesComponent,
    data: { title: 'PARTIES' },
  },
  {
    path: 'nursery',
    component: NurseryComponent,
    data: { title: 'NURSERY' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
