import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { PlayerService } from '../player.service';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { environment } from '../../../environments/environment';

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
    evolutions: {
      pokemonId: string;
      evolution: PokemonBaseModel;
      name: string;
    }[];
  }> {
    return this.http.get<{
      trainer: TrainerModel;
      xpAndLevelGain: { xp: number; level: number }[];
      evolutions: {
        pokemonId: string;
        evolution: PokemonBaseModel;
        name: string;
      }[];
    }>(environment.apiUrl + '/api/xp/weeklyXpGain/' + trainerId);
  }
}
