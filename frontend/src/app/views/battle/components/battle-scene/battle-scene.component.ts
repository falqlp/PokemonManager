import { Component, Input } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-battle-scene',
  templateUrl: './battle-scene.component.html',
  styleUrls: ['./battle-scene.component.scss'],
})
export class BattleSceneComponent {
  @Input() public opponentActivePokemon: PokemonModel;
  @Input() public playerActivePokemon: PokemonModel;
}
