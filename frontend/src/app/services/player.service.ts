import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { filter, Observable } from 'rxjs';
import { BehaviorSubject, of, tap } from 'rxjs';
import { PcStorageQueriesService } from './queries/pc-storage-queries.service';
import { GameQueriesService } from './queries/game-queries.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  protected playerSubject = new BehaviorSubject<TrainerModel>(undefined);

  protected gameId: string;

  public maxStat = 0;

  public player$ = this.playerSubject
    .asObservable()
    .pipe(filter((value) => !!value));

  public constructor(
    protected gameQueriesService: GameQueriesService,
    protected pcStorageService: PcStorageQueriesService,
    protected cacheService: CacheService
  ) {
    this.cacheService.$gameId.subscribe((gameId) => {
      this.gameId = gameId;
      this.updatePlayer();
    });
  }

  public logout(): void {
    this.cacheService.setGameId(undefined);
    this.cacheService.setUserId(undefined);
  }

  public updatePlayer(): void {
    this.getPlayer(this.gameId)
      .pipe(
        tap((player) => {
          if (player) {
            this.getMaxStat(player);
          }
          this.playerSubject?.next(player);
        })
      )
      .subscribe();
  }

  public getPlayer(gameId: string): Observable<TrainerModel> {
    if (!gameId) {
      return of(null);
    }
    return this.gameQueriesService.getPlayer(gameId);
  }

  public getMaxStat(player: TrainerModel): void {
    this.pcStorageService.get(player.pcStorage).subscribe((pc) => {
      const pcPokemons = pc.storage.map((storage) => storage.pokemon);
      const allPokemons = player.pokemons.concat(pcPokemons);
      this.maxStat = 0;
      allPokemons.forEach((pokemon) => {
        Object.entries(pokemon.stats).forEach(([key, value]) => {
          if (key === 'hp') {
            this.maxStat = Math.max(this.maxStat, value - pokemon.level - 5);
          } else if (key !== '_id') {
            this.maxStat = Math.max(this.maxStat, value);
          }
        });
      });
    });
  }
}
