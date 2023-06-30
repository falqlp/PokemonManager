import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';

@Component({
  selector: 'app-battle-trainer-pokemons',
  templateUrl: './battle-trainer-pokemons.component.html',
  styleUrls: ['./battle-trainer-pokemons.component.scss'],
})
export class BattleTrainerPokemonsComponent {
  @Input() public activePokemon: PokemonModel;
  @Input() public trainer: TrainerModel;
  @Input() public trainerPokemons: PokemonModel[];
  @Output() public clickOnPokemon = new EventEmitter<PokemonModel>();

  protected click(pokemon: PokemonModel): void {
    this.clickOnPokemon.emit(pokemon);
  }
}
