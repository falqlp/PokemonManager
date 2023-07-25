import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrainerModel } from '../../../../models/TrainersModels/trainer.model';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { AttackModel } from '../../../../models/attack.model';

@Component({
  selector: 'app-battle-oppenent-pokemons',
  templateUrl: './battle-oppenent-pokemons.component.html',
  styleUrls: ['./battle-oppenent-pokemons.component.scss'],
})
export class BattleOppenentPokemonsComponent {
  @Input() public trainer: TrainerModel;
  @Input() public trainerPokemons: PokemonModel[];
  @Input() public selectedAttack: AttackModel;
  @Output() public clickOnPokemon = new EventEmitter<PokemonModel>();
  protected disabled = false;
  protected progress = 0;

  protected click(pokemon: PokemonModel): void {
    this.clickOnPokemon.emit(pokemon);
    this.disabled = true;
    this.progress = 100;
    const interval = setInterval(() => {
      this.progress -= 1;
      if (this.progress <= 0) {
        clearInterval(interval);
        this.disabled = false;
        this.progress = 0;
      }
    }, 50);
  }
}
