import { Component, input } from '@angular/core';
import { BattleTrainerModel } from '../../battle.model';

@Component({
  selector: 'app-battle-trainer-pokemons',
  templateUrl: './battle-trainer-pokemons.component.html',
  styleUrls: ['./battle-trainer-pokemons.component.scss'],
})
export class BattleTrainerPokemonsComponent {
  public cooldown = input<number>();
  public trainer = input<BattleTrainerModel>();
}
