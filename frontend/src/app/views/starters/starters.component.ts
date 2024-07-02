import { Component, DestroyRef, OnInit } from '@angular/core';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, first, switchMap } from 'rxjs';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '../../modals/generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../../modals/generic-dialog/generic-dialog.models';
import { PlayerService } from '../../services/player.service';
import { RouterService } from '../../services/router.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'pm-starters',
  standalone: true,
  imports: [
    DisplayPokemonImageComponent,
    MatButtonModule,
    TranslateModule,
    MatCheckboxModule,
    NgClass,
    MatRippleModule,
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './starters.component.html',
  styleUrl: './starters.component.scss',
})
export class StartersComponent implements OnInit {
  protected starters: PokemonModel[];
  protected player: TrainerModel;
  protected selected: PokemonModel[] = [];
  constructor(
    protected pokemonService: PokemonQueriesService,
    protected destroyRef: DestroyRef,
    protected matDialog: MatDialog,
    protected playerService: PlayerService,
    protected router: RouterService,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value),
        switchMap((player) => {
          this.player = player;
          return this.pokemonService.getStarters(player._id);
        })
      )
      .subscribe((starters: PokemonModel[]) => {
        this.starters = starters;
      });
  }

  protected findPokemon(pokemon: PokemonModel): boolean {
    return !!this.selected.find(
      (selectedEl) => selectedEl.basePokemon.id === pokemon.basePokemon.id
    );
  }

  protected selectPokemon(pokemon: PokemonModel): void {
    if (!this.findPokemon(pokemon)) {
      this.selected.push(pokemon);
    } else {
      this.selected = this.selected.filter(
        (selectedEl) => selectedEl.basePokemon.id !== pokemon.basePokemon.id
      );
    }
  }

  protected chooseStarters(): void {
    const selectLambda = (): void => {
      this.selected.map((pokemon) => {
        pokemon.trainerId = this.player._id;
        return pokemon;
      });
      this.pokemonService
        .createStarters(this.selected)
        .pipe(first())
        .subscribe(() => {
          this.router.navigateByUrl('home');
        });
    };
    const buttons: DialogButtonsModel[] = [
      {
        color: 'primary',
        close: true,
        label: 'CANCEL',
      },
      {
        color: 'warn',
        close: true,
        label: 'CHOOSE',
        click: selectLambda,
      },
    ];
    this.matDialog.open(GenericDialogComponent, {
      data: {
        buttons,
        message: this.translateService.instant('CHOOSE_THESE_POKEMON', {
          first: this.translateService.instant(
            this.selected[0].basePokemon.name
          ),
          sec: this.translateService.instant(this.selected[1].basePokemon.name),
          third: this.translateService.instant(
            this.selected[2].basePokemon.name
          ),
        }),
      },
    });
  }
}
