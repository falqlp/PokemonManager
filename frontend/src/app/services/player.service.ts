import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { Observable, switchMap } from 'rxjs';
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

  protected maxStatSubject = new BehaviorSubject<number>(this.maxStat);
  public maxStat$ = this.maxStatSubject.asObservable();

  public player$ = this.playerSubject.asObservable();

  public constructor(
    protected gameQueriesService: GameQueriesService,
    protected pcStorageService: PcStorageQueriesService,
    protected cacheService: CacheService
  ) {
    this.cacheService.$gameId
      .pipe(
        switchMap((gameId) => {
          this.gameId = gameId;
          return this.getPlayer();
        })
      )
      .subscribe();
  }

  public logout(): void {
    this.cacheService.setGameId(undefined);
    this.cacheService.setUserId(undefined);
  }

  public getPlayer(): Observable<TrainerModel> {
    if (!this.gameId) {
      return of(null).pipe(
        tap((player) => {
          if (player) {
            this.getMaxStat(player);
          }
          this.playerSubject?.next(player);
        })
      );
    }
    return this.gameQueriesService.getPlayer(this.gameId).pipe(
      tap((player) => {
        if (player) {
          this.getMaxStat(player);
        }
        this.playerSubject?.next(player);
      })
    );
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
      this.maxStatSubject.next(this.maxStat);
    });
  }
}
