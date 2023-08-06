import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { PokemonQueriesService } from 'src/app/services/pokemon-queries.service';
import { Router } from '@angular/router';
import { BattleQueriesService } from '../../services/battle-queries.service';
import { TrainerQueriesService } from '../../services/trainer-queries.service';
import { HttpClient } from '@angular/common/http';
import { MoveModel } from '../../models/move.model';
import { TranslateService } from '@ngx-translate/core';
import { MoveLearningService } from '../../services/move-learning.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  protected pokemonBases: PokemonBaseModel[];
  protected player: TrainerModel;
  protected opponent: TrainerModel;
  protected progress = 50;

  constructor(
    protected moveLearningService: MoveLearningService,
    protected router: Router,
    protected dialog: MatDialog,
    protected playerService: PlayerService,
    protected pokemonService: PokemonQueriesService,
    protected battleQueries: BattleQueriesService,
    protected trainerService: TrainerQueriesService,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$.subscribe((player) => {
      this.player = player;
    });
    this.trainerService.get('6496f985f15bc10f660c1958').subscribe((trainer) => {
      this.opponent = trainer;
    });
  }

  protected click(): void {
    this.dialog
      .open(PokemonFormComponent)
      .afterClosed()
      .subscribe((pokemon) =>
        pokemon ? this.createPokemon(pokemon) : undefined
      );
  }

  protected clickP(): void {
    this.moveLearningService
      .learnableMove(
        this.player.pokemons[1].basePokemon.id,
        this.player.pokemons[1].level
      )
      .subscribe((moves) => {
        console.log(
          moves
            .sort((a, b) => a.power - b.power)
            .map((move) => this.translateService.instant(move.name))
        );
      });
  }

  protected onPokemonsChanged(pokemons: PokemonBaseModel[]): void {
    this.pokemonBases = pokemons;
  }

  protected createPokemon(pokemon: PokemonModel): void {
    this.pokemonService
      .create(pokemon)
      .subscribe((newpokemon) => console.log(newpokemon));
  }

  protected imgNumber(pokemon: PokemonBaseModel): string {
    return (
      'assets/images/sprites/' +
      pokemon.id.toString().padStart(3, '0') +
      'MS.png'
    );
  }

  protected startBattle(): void {
    this.battleQueries
      .create({
        player: this.player,
        opponent: this.opponent,
      })
      .subscribe((battle) => {
        this.router.navigate(['battle'], {
          queryParams: { battle: battle._id },
        });
      });
  }

  protected testRoute(): void {
    this.pokemonService.delete('64c559fd900a4f737a512be7').subscribe();
  }
}
