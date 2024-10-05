import {
  Component,
  DestroyRef,
  inject,
  output,
  ViewChild,
} from '@angular/core';
import { PlayerService } from '../../../../services/player.service';
import { switchMap } from 'rxjs';
import { PcStorageQueriesService } from '../../../../services/queries/pc-storage-queries.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { DisplayPokemonImageComponent } from '../../../../components/display-pokemon-image/display-pokemon-image.component';
import { TrainerQueriesService } from '../../../../services/queries/trainer-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BadgeDataService } from '../../../../services/badge.data.service';
import { MatBadge } from '@angular/material/badge';
import { NgClass, NgStyle } from '@angular/common';
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuTrigger,
} from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-pokemon-storage',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    DisplayPokemonImageComponent,
    MatBadge,
    NgStyle,
    MatMenu,
    MatMenuTrigger,
    NgClass,
    MatMenuItem,
    MatMenuContent,
    TranslateModule,
  ],
  templateUrl: './pokemon-storage.component.html',
  styleUrl: './pokemon-storage.component.scss',
})
export class PokemonStorageComponent {
  public readonly selectionChange = output<{
    firstSelected: PokemonModel;
    secondSelected: PokemonModel;
  }>();

  @ViewChild(MatMenuTrigger)
  protected readonly contextMenu: MatMenuTrigger;

  protected readonly player$ = inject(PlayerService).player$;
  protected readonly pcStorageQueriesService = inject(PcStorageQueriesService);
  protected readonly trainerService = inject(TrainerQueriesService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly badgeDataService = inject(BadgeDataService);

  protected readonly maxTeamSize = 6;

  protected teamStorage: PokemonModel[] = [];
  protected mainStorage: PokemonModel[] = [];
  protected pcMaxSize: number;
  protected trainerId: string;
  protected firstSelected: PokemonModel;
  protected secondSelected: PokemonModel;

  protected contextMenuPosition = { x: '0px', y: '0px' };

  constructor() {
    this.mainPredicate = this.mainPredicate.bind(this);
    this.teamPredicate = this.teamPredicate.bind(this);
    this.player$
      .pipe(
        switchMap((player) => {
          this.trainerId = player._id;
          this.teamStorage = player.pokemons;
          return this.pcStorageQueriesService.get(player.pcStorage);
        }),
        takeUntilDestroyed()
      )
      .subscribe((storage) => {
        this.pcMaxSize = storage.maxSize;
        this.mainStorage = storage.storage.map((st) => st.pokemon);
      });
  }

  protected onContextMenu(event: MouseEvent, pokemon: PokemonModel): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { pokemon };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  protected drop(event: CdkDragDrop<PokemonModel[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.update();
  }

  protected update(): void {
    this.trainerService
      .updatePcPosition(
        this.trainerId,
        this.teamStorage.map((pokemon) => pokemon._id),
        this.mainStorage.map((pokemon) => pokemon._id)
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected selectFirst(pokemon: PokemonModel): void {
    this.firstSelected = pokemon;
    if (pokemon._id === this.secondSelected?._id) {
      this.secondSelected = undefined;
    }
    this.updateSelection();
  }

  protected selectSecond(pokemon: PokemonModel): void {
    this.secondSelected = pokemon;
    if (pokemon._id === this.firstSelected?._id) {
      this.firstSelected = undefined;
    }
    this.updateSelection();
  }

  protected updateSelection(): void {
    this.selectionChange.emit({
      firstSelected: this.firstSelected,
      secondSelected: this.secondSelected,
    });
  }

  protected mainPredicate(): boolean {
    return this.mainStorage.length < this.pcMaxSize;
  }

  protected teamPredicate(): boolean {
    return this.teamStorage.length < this.maxTeamSize;
  }
}
