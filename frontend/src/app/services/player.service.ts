import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import type { Observable } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';
import { PcStorageQueriesService } from './queries/pc-storage-queries.service';
import { GameQueriesService } from './queries/game-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  protected playerSubject = new BehaviorSubject<TrainerModel>(undefined);

  protected gameId = '64fd9cf21308150436317aed';

  public maxStat = 0;

  public player$ = this.playerSubject.asObservable();
  public constructor(
    protected gameQueriesService: GameQueriesService,
    protected pcStorageService: PcStorageQueriesService
  ) {
    this.updatePlayer().subscribe();
  }

  public updatePlayer(): Observable<TrainerModel> {
    return this.getPlayer(this.gameId).pipe(
      tap((player) => {
        this.getMaxStat(player);
        this.playerSubject?.next(player);
      })
    );
  }

  public getPlayer(gameId: string): Observable<TrainerModel> {
    return this.gameQueriesService.getPlayer(gameId);
  }

  public getMaxStat(player: TrainerModel): void {
    this.pcStorageService.get(player.pcStorage).subscribe((pc) => {
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
