import { Component, input } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { MoveModel } from 'src/app/models/move.model';
import { NgClass, NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NumberCooldownComponent } from '../../../../components/number-cooldown/number-cooldown.component';

@Component({
  selector: 'app-battle-player-move',
  templateUrl: './battle-player-move.component.html',
  styleUrls: ['./battle-player-move.component.scss'],
  standalone: true,
  imports: [NgClass, NgForOf, TranslateModule, NumberCooldownComponent],
})
export class BattlePlayerMoveComponent {
  public activePokemon = input<PokemonModel>();
  public cooldown = input<number>();
  public selectedMove = input<MoveModel>();
}
