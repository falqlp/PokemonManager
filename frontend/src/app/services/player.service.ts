import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { TrainerQueriesService } from './queries/trainer-queries.service';
import { PcStorageQueriesService } from './queries/pc-storage-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  protected playerSubject = new BehaviorSubject<TrainerModel>({
    _id: '649e0e86e45d3dab76652543',
    name: 'Popole',
    pokemons: [],
    pcStorage: '64d295d602f276756870fd45',
  });

  public maxStat = 0;

  public player$ = this.playerSubject.asObservable();
  public constructor(
    protected trainerService: TrainerQueriesService,
    protected pcStorgaeService: PcStorageQueriesService
  ) {
    this.updatePlayer('649e0e86e45d3dab76652543');
  }

  public updatePlayer(id: string): void {
    this.getPlayer(id).subscribe((trainer) => {
      this.getMaxStat(trainer);
      this.playerSubject.next(trainer);
    });
  }

  public getPlayer(id: string): Observable<TrainerModel> {
    return this.trainerService.get(id);
  }

  public getMaxStat(player: TrainerModel): void {
    this.pcStorgaeService.get(player.pcStorage).subscribe((pc) => {
      const pcPokemons = pc.storage.map((storage) => storage.pokemon);
      const allPokemons = player.pokemons.concat(pcPokemons);
      this.maxStat = 0;
      allPokemons.forEach((pokemon) => {
        for (const key in pokemon.stats) {
          if (key === 'hp') {
            this.maxStat = Math.max(
              this.maxStat,
              pokemon.stats['hp'] - pokemon.level - 5
            );
          } else if (key !== '_id') {
            this.maxStat = Math.max(this.maxStat, pokemon.stats[key]);
          }
        }
      });
    });
  }
}
