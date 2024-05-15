import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { first, Observable, switchMap } from 'rxjs';
import { BehaviorSubject, of, tap } from 'rxjs';
import { PcStorageQueriesService } from './queries/pc-storage-queries.service';
import { CacheService } from './cache.service';
import { WebsocketEventService } from './websocket-event.service';
import { TrainerQueriesService } from './queries/trainer-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerSubject = new BehaviorSubject<TrainerModel>(undefined);
  private trainerId: string;

  public maxStat = 0;

  private maxStatSubject = new BehaviorSubject<number>(this.maxStat);
  public maxStat$ = this.maxStatSubject.asObservable();

  public player$ = this.playerSubject.asObservable();

  public constructor(
    private pcStorageService: PcStorageQueriesService,
    private cacheService: CacheService,
    private websocketEventService: WebsocketEventService,
    private trainerQueriesService: TrainerQueriesService
  ) {
    this.cacheService.$trainerId
      .pipe(
        switchMap((trainerId) => {
          this.trainerId = trainerId;
          return this.getPlayer();
        })
      )
      .subscribe();
    this.websocketEventService.updatePlayerEvent$
      .pipe(
        switchMap(() => {
          return this.getPlayer().pipe(first());
        })
      )
      .subscribe();
  }

  public logout(): void {
    this.cacheService.setGameId(undefined);
    this.cacheService.setUserId(undefined);
  }

  public getPlayer(): Observable<TrainerModel> {
    if (!this.trainerId) {
      return of(null).pipe(
        tap((player) => {
          this.playerSubject?.next(player);
        })
      );
    }
    return this.trainerQueriesService.getPlayer(this.trainerId).pipe(
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
