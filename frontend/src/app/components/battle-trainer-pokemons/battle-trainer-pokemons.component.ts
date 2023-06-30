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
  protected disabled = false;
  protected progress = 0;

  protected click(pokemon: PokemonModel): void {
    this.clickOnPokemon.emit(pokemon);
    this.disabled = true;
    this.progress = 100;
    const interval = setInterval(() => {
      this.progress -= 1; // ajustez cette valeur en fonction de la durée du cooldown
      if (this.progress <= 0) {
        clearInterval(interval);
        this.disabled = false;
        this.progress = 0;
      }
    }, 50); // ajustez cette valeur en fonction de la durée du cooldown
  }
}
