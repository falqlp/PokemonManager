import { Component, input } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { MoveModel } from 'src/app/models/move.model';

@Component({
  selector: 'app-battle-player-move',
  templateUrl: './battle-player-move.component.html',
  styleUrls: ['./battle-player-move.component.scss'],
})
export class BattlePlayerMoveComponent {
  public activePokemon = input<PokemonModel>();
  public cooldown = input<number>();
  public selectedMove = input<MoveModel>();
}
