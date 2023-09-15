import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { PlayerService } from '../player.service';

@Injectable({
  providedIn: 'root',
})
export class ExperienceQueriesService {
  public constructor(
    protected http: HttpClient,
    protected playerService: PlayerService
  ) {}

  public getWeeklyXp(trainerId: string): Observable<{
    trainer: TrainerModel;
    xpAndLevelGain: { xp: number; level: number }[];
  }> {
    return this.http
      .get<{
        trainer: TrainerModel;
        xpAndLevelGain: { xp: number; level: number }[];
      }>('api/xp/weeklyXpGain/' + trainerId)
      .pipe(
        tap(() => {
          this.playerService.updatePlayer();
        })
      );
  }
}
