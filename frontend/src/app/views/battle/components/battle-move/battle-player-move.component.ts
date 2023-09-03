import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { MoveModel } from 'src/app/models/move.model';

@Component({
  selector: 'app-battle-player-move',
  templateUrl: './battle-player-move.component.html',
  styleUrls: ['./battle-player-move.component.scss'],
})
export class BattlePlayerMoveComponent implements OnChanges {
  @Input() public activePokemon: PokemonModel;

  @Input() public set progress(value: number) {
    this._progress = value;
  }

  public get progress(): number {
    return this._progress;
  }

  @Input() public set selectedMove(value: MoveModel) {
    this._selectedMove = value;
  }

  public get selectedMove(): MoveModel {
    return this._selectedMove;
  }

  @Output() public onMoveChange = new EventEmitter<MoveModel>();
  protected _selectedMove: MoveModel;
  protected _progress: number;

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['activePokemon'] &&
      changes['activePokemon'].previousValue?._id !==
        changes['activePokemon'].currentValue._id
    ) {
      this._selectedMove = undefined;
    }
  }
}
