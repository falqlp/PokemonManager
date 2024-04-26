import { Component, DestroyRef, OnInit } from '@angular/core';
import { PcStorageQueriesService } from '../../services/queries/pc-storage-queries.service';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { filter, switchMap } from 'rxjs';
import {
  PcStorageModel,
  StorageArrayModel,
  StorageModel,
} from '../../models/pc-storage.model';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonResumeComponent } from '../../components/pokemon-resume/pokemon-resume.component';
import { MatBadgeModule } from '@angular/material/badge';
import { BadgeDataService } from '../../services/badge.data.service';

@Component({
  selector: 'app-pc-storage',
  templateUrl: './pc-storage.component.html',
  styleUrls: ['./pc-storage.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    DisplayPokemonImageComponent,
    MatButtonModule,
    TranslateModule,
    NgIf,
    PokemonResumeComponent,
    MatBadgeModule,
  ],
})
export class PcStorageComponent implements OnInit {
  protected player: TrainerModel;
  protected pcStorage: PcStorageModel;
  protected storageArray: StorageArrayModel[] = [];
  protected playerTeam: StorageArrayModel[] = [];
  protected firstSelected: PokemonModel;
  protected secondSelected: PokemonModel;
  public constructor(
    protected pcStorageQueriesService: PcStorageQueriesService,
    protected playerService: PlayerService,
    protected trainerService: TrainerQueriesService,
    protected destroyRef: DestroyRef,
    protected badgeDataService: BadgeDataService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        filter((player) => !!player),
        takeUntilDestroyed(this.destroyRef),
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
        if (this.playerTeam.length === 0) {
          for (let i = 0; i < 6; i++) {
            this.playerTeam.push({
              pokemon: this.player.pokemons[i],
              disabled: false,
            });
          }
        }
      });
  }

  protected setFirstSelected(storage: StorageArrayModel): void {
    this.badgeDataService.pokemon = this.badgeDataService.pokemon.filter(
      (el) => el !== storage.pokemon._id
    );
    if (storage.secondSelected) {
      this.deselectSecondSelected();
    }
    this.deselectFirstSelected();
    storage.firstSelected = true;
    this.firstSelected = storage.pokemon;
  }

  protected deselectFirstSelected(): void {
    this.firstSelected = undefined;
    this.storageArray.map((storage) => (storage.firstSelected = false));
    this.playerTeam.map((storage) => {
      storage.firstSelected = false;
    });
  }

  protected setSecondSelected(
    storage: StorageArrayModel,
    event: MouseEvent
  ): void {
    this.badgeDataService.pokemon = this.badgeDataService.pokemon.filter(
      (el) => el !== storage.pokemon._id
    );
    if (storage.firstSelected) {
      this.deselectFirstSelected();
    }
    this.deselectSecondSelected();
    storage.secondSelected = true;
    this.secondSelected = storage.pokemon;
    event.preventDefault();
  }

  protected deselectSecondSelected(): void {
    this.secondSelected = undefined;
    this.storageArray.map((storage) => (storage.secondSelected = false));
    this.playerTeam.map((storage) => {
      storage.secondSelected = false;
    });
  }

  protected switchPokemon(): void {
    if (this.canSwitchPokemon()) {
      this.findAndSwapFirstSelected();
      this.findAndSwapSecondSelected();
      [this.secondSelected, this.firstSelected] = [
        this.firstSelected,
        this.secondSelected,
      ];
      this.rearrangePokemons(this.playerTeam);
    }
    this.update();
  }

  protected findAndSwapFirstSelected(): void {
    let firstSelectedIndex = this.playerTeam.findIndex((storage) => {
      return storage.firstSelected;
    });
    if (firstSelectedIndex === -1) {
      firstSelectedIndex = this.storageArray.findIndex((storage) => {
        return storage.firstSelected;
      });
      this.storageArray[firstSelectedIndex].pokemon = this.secondSelected;
    } else {
      this.playerTeam[firstSelectedIndex].pokemon = this.secondSelected;
    }
  }

  protected findAndSwapSecondSelected(): void {
    let secondSelectedIndex = this.playerTeam.findIndex((storage) => {
      return storage.secondSelected;
    });
    if (secondSelectedIndex === -1) {
      secondSelectedIndex = this.storageArray.findIndex((storage) => {
        return storage.secondSelected;
      });
      this.storageArray[secondSelectedIndex].pokemon = this.firstSelected;
    } else {
      this.playerTeam[secondSelectedIndex].pokemon = this.firstSelected;
    }
  }

  protected rearrangePokemons(storages: StorageArrayModel[]): void {
    for (let i = 0; i < storages.length - 1; i++) {
      if (!storages[i].pokemon) {
        let nextPokemonIndex = -1;
        for (let j = i + 1; j < storages.length; j++) {
          if (storages[j].pokemon) {
            nextPokemonIndex = j;
            break;
          }
        }

        if (nextPokemonIndex !== -1) {
          storages[i].pokemon = storages[nextPokemonIndex].pokemon;
          if (storages[i].firstSelected) {
            this.firstSelected = storages[i].pokemon;
          }
          if (storages[i].secondSelected) {
            this.secondSelected = storages[i].pokemon;
          }
          storages[nextPokemonIndex].pokemon = undefined;
          if (storages[nextPokemonIndex].firstSelected) {
            this.firstSelected = storages[nextPokemonIndex].pokemon;
          }
          if (storages[nextPokemonIndex].secondSelected) {
            this.secondSelected = storages[nextPokemonIndex].pokemon;
          }
        }
      }
    }
  }

  protected canSwitchPokemon(): boolean {
    return (
      this.playerTeam[1].pokemon !== undefined ||
      (!this.playerTeam[0].firstSelected &&
        !this.playerTeam[0].secondSelected) ||
      (this.playerTeam[0].firstSelected && !!this.secondSelected) ||
      (this.playerTeam[0].secondSelected && !!this.firstSelected)
    );
  }

  protected update(): void {
    this.updatePc();
    this.updateTrainer();
  }

  protected updatePc(): void {
    const newStorage: StorageModel[] = [];
    this.storageArray.forEach((storage, position) => {
      if (storage.pokemon) {
        newStorage.push({ pokemon: storage.pokemon, position });
      }
    });
    this.pcStorage.storage = newStorage;
    this.pcStorageQueriesService
      .update(this.pcStorage, this.pcStorage._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected updateTrainer(): void {
    const newPokemons: PokemonModel[] = [];
    this.playerTeam.forEach((storage) => {
      if (storage.pokemon) {
        newPokemons.push(storage.pokemon);
      }
    });
    this.player.pokemons = newPokemons;
    this.trainerService
      .update(this.player, this.player._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
