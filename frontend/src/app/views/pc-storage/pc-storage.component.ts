import { Component, OnInit } from '@angular/core';
import { PcStorageQueriesService } from '../../services/pc-storage-queries.service';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { switchMap } from 'rxjs';
import { PcStorageModel } from '../../models/pc-storage.model';

@Component({
  selector: 'app-pc-storage',
  templateUrl: './pc-storage.component.html',
  styleUrls: ['./pc-storage.component.scss'],
})
export class PcStorageComponent implements OnInit {
  protected player: TrainerModel;
  protected pcStorage: PcStorageModel;
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
      });
  }

  get indices(): number[] {
    return Array.from({ length: this.pcStorage.maxSize }, (_, i) => i + 1);
  }
}
