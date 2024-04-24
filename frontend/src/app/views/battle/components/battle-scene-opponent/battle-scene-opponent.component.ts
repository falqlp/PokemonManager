import { Component, input } from '@angular/core';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene-opponent',
  templateUrl: './battle-scene-opponent.component.html',
  styleUrls: ['./battle-scene-opponent.component.scss'],
})
export class BattleSceneOpponentComponent {
  public opponentActivePokemon = input<PokemonModel>();
  public opponentDamage = input<DamageModel>();
}
