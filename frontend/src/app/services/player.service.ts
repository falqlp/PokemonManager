import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { PcStorageQueriesService } from './queries/pc-storage-queries.service';
import { PartyQueriesService } from './queries/party-queries.service';

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

  protected partyId = '64fd9cf21308150436317aed';

  public maxStat = 0;

  public player$ = this.playerSubject.asObservable();
  public constructor(
    protected partyQueriesService: PartyQueriesService,
    protected pcStorgaeService: PcStorageQueriesService
  ) {
    this.updatePlayer();
  }

  public updatePlayer(): void {
    this.getPlayer(this.partyId).subscribe((player) => {
      this.getMaxStat(player);
      this.playerSubject.next(player);
    });
  }

  public getPlayer(partyId: string): Observable<TrainerModel> {
    return this.partyQueriesService.getPlayer(partyId);
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
