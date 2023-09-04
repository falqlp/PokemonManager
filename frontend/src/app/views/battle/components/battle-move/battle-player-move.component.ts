import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { MoveModel } from 'src/app/models/move.model';

@Component({
  selector: 'app-battle-player-move',
  templateUrl: './battle-player-move.component.html',
  styleUrls: ['./battle-player-move.component.scss'],
})
export class BattlePlayerMoveComponent {
  @Input() public activePokemon: PokemonModel;

  @Input() public set cooldown(value: number) {
    this._cooldown = value;
  }

  public get cooldown(): number {
    return this._cooldown;
  }

  @Input() public set selectedMove(value: MoveModel) {
    this._selectedMove = value;
  }

  public get selectedMove(): MoveModel {
    return this._selectedMove;
  }

  @Output() public onMoveChange = new EventEmitter<MoveModel>();
  protected _selectedMove: MoveModel;
  protected _cooldown: number;
}
