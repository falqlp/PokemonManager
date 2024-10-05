import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonModel } from '../../../models/PokemonModels/pokemon.model';
import { MatButtonModule } from '@angular/material/button';
import { PokemonSummaryModifyMovesComponent } from './pokemon-resume-modify-moves/pokemon-summary-modify-moves.component';

import { MoveComponent } from '../../move/move.component';

@Component({
  selector: 'pm-pokemon-resume-moves',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    PokemonSummaryModifyMovesComponent,
    MoveComponent,
  ],
  templateUrl: './pokemon-summary-moves.component.html',
  styleUrls: ['./pokemon-summary-moves.component.scss'],
})
export class PokemonSummaryMovesComponent {
  @Input()
  set pokemon(value: PokemonModel) {
    this._pokemon = value;
    this.modify = false;
  }

  get pokemon(): PokemonModel {
    return this._pokemon;
  }

  private _pokemon: PokemonModel;
  protected modify = false;
}
