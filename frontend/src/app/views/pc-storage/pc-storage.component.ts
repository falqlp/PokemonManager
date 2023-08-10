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
              this.storageArray.push({ pokemon, disabled });
            } else {
              this.storageArray.push({ disabled });
            }
          }
        }
      });
  }

  protected click(): void {
    this.player.pokemons.forEach((pokemon, index) => {
      this.storageArray[index].pokemon = pokemon;
    });
  }
}
