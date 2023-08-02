import { Component, Input } from '@angular/core';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene-player',
  templateUrl: './battle-scene-player.component.html',
  styleUrls: ['./battle-scene-player.component.scss'],
})
export class BattleScenePlayerComponent {
  @Input() public playerActivePokemon: PokemonModel;
  @Input() public playerDamage: DamageModel;
}
