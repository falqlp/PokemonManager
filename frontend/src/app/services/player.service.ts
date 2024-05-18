import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';
import { PcStorageQueriesService } from './queries/pc-storage-queries.service';
import { CacheService } from './cache.service';
import { WebsocketEventService } from './websocket-event.service';
import { TrainerQueriesService } from './queries/trainer-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  public maxStat = 0;

  private maxStatSubject = new BehaviorSubject<number>(this.maxStat);
  public maxStat$ = this.maxStatSubject.asObservable();

  public player$: Observable<TrainerModel>;

  public constructor(
    private pcStorageService: PcStorageQueriesService,
    private cacheService: CacheService,
    private websocketEventService: WebsocketEventService,
    private trainerQueriesService: TrainerQueriesService
  ) {
    this.player$ = this.cacheService.$trainerId.pipe(
      switchMap((id) => {
        return this.websocketEventService.updatePlayerEvent$.pipe(
          map(() => id)
        );
      }),
      switchMap((id) => {
        if (!id || id === 'undefined') {
          return EMPTY;
        }
        return this.trainerQueriesService.getPlayer(id);
      }),
      tap((player) => {
        if (player) {
          this.getMaxStat(player);
        }
      })
    );
  }

  public logout(): void {
    this.cacheService.setGameId(undefined);
    this.cacheService.setTrainerId(undefined);
    this.cacheService.setUserId(undefined);
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
