import { Component, OnInit } from '@angular/core';
import { PcStorageQueriesService } from '../../services/pc-storage-queries.service';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { switchMap } from 'rxjs';
import {
  PcStorageModel,
  StorageArrayModel,
} from '../../models/pc-storage.model';

@Component({
  selector: 'app-pc-storage',
  templateUrl: './pc-storage.component.html',
  styleUrls: ['./pc-storage.component.scss'],
})
export class PcStorageComponent implements OnInit {
  protected player: TrainerModel;
  protected pcStorage: PcStorageModel;
  protected storageArray: StorageArrayModel[] = [];
  protected playerTeam: StorageArrayModel[] = [];
  public constructor(
    protected pcStorageQueriesService: PcStorageQueriesService,
    protected playerService: PlayerService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        switchMap((player) => {
          this.player = player;
          return this.pcStorageQueriesService.get(player.pcStorage);
        })
      )
      .subscribe((pcStorage) => {
        this.pcStorage = pcStorage;
        if (this.storageArray.length === 0) {
          for (let i = 0; i < 36; i++) {
            const pokemon = this.pcStorage.storage.find(
              (el) => el.position === i
            )?.pokemon;
            const disabled = i >= this.pcStorage.maxSize;
            if (pokemon) {
              this.storageArray.push({
                pokemon,
                disabled,
              });
            } else {
              this.storageArray.push({ disabled });
            }
          }
        }
        if (this.player.pokemons) {
          for (let i = 0; i < 6; i++) {
            this.playerTeam.push({
              pokemon: this.player.pokemons[i],
              disabled: false,
            });
          }
        }
      });
  }

  protected click(): void {
    this.player.pokemons.forEach((pokemon, index) => {
      this.storageArray[index].pokemon = pokemon;
    });
  }

  protected setFirstSelected(storage: StorageArrayModel): void {
    if (storage.secondSelected) {
      this.deselectSecondSelected();
    }
    this.deselectFirstSelected();
    storage.firstSelected = true;
  }

  protected deselectFirstSelected(): void {
    this.storageArray.map((storage) => (storage.firstSelected = false));
    this.playerTeam.map((storage) => {
      storage.firstSelected = false;
    });
  }

  protected setSecondSelected(
    storage: StorageArrayModel,
    event: MouseEvent
  ): void {
    console.log(1);
    if (storage.firstSelected) {
      this.deselectFirstSelected();
    }
    this.deselectSecondSelected();
    storage.secondSelected = true;
    event.preventDefault();
  }

  protected deselectSecondSelected(): void {
    this.storageArray.map((storage) => (storage.secondSelected = false));
    this.playerTeam.map((storage) => {
      storage.secondSelected = false;
    });
  }
}
