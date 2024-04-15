import { Component, DestroyRef, OnInit } from '@angular/core';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first } from 'rxjs';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '../../modals/generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../../modals/generic-dialog/generic-dialog.models';
import { ChangeNicknameComponent } from '../../modals/change-nickname/change-nickname.component';
import { PlayerService } from '../../services/player.service';
import { RouterService } from '../../services/router.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';

@Component({
  selector: 'pm-starters',
  standalone: true,
  imports: [
    NgIf,
    DisplayPokemonImageComponent,
    NgForOf,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './starters.component.html',
  styleUrl: './starters.component.scss',
})
export class StartersComponent implements OnInit {
  protected starters: PokemonModel[];
  protected player: TrainerModel;
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
      .pipe(takeUntilDestroyed(this.destroyRef), first())
      .subscribe((player) => {
        this.player = player;
      });
    this.pokemonService
      .getStarters()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((starters: PokemonModel[]) => {
        this.starters = starters;
      });
  }

  protected selectPokemon(pokemon: PokemonModel): void {
    pokemon.trainerId = this.player._id;
    const selectLambda = (): void => {
      this.pokemonService
        .create(pokemon)
        .pipe(first())
        .subscribe((newPokemon) => {
          const lambdaButtons: DialogButtonsModel[] = [
            {
              label: 'YES',
              color: 'warn',
              close: true,
              click: (): void => {
                this.matDialog
                  .open(ChangeNicknameComponent, {
                    data: newPokemon,
                  })
                  .afterClosed()
                  .subscribe(() => {
                    this.router.navigateByUrl('home');
                  });
              },
            },
            {
              label: 'NO',
              color: 'primary',
              close: true,
              click: (): void => {
                this.router.navigateByUrl('home');
              },
            },
          ];
          this.matDialog.open(GenericDialogComponent, {
            data: {
              message: 'WANT_CHANGE_NICKNAME',
              buttons: lambdaButtons,
            },
          });
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
        message: this.translateService.instant('CHOOSE_THIS_POKEMON', {
          name: this.translateService.instant(pokemon.basePokemon.name),
        }),
      },
    });
  }
}
