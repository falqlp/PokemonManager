import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { BattleComponent } from './views/battle/battle.component';
import { BattleResumeComponent } from './views/battle-resume/battle-resume.component';
import { PcStorageComponent } from './views/pc-storage/pc-storage.component';
import { TrainersComponent } from './views/trainers/trainers.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'battle-resume', component: BattleResumeComponent },
  { path: 'pcStorage', component: PcStorageComponent },
  { path: 'trainers', component: TrainersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
