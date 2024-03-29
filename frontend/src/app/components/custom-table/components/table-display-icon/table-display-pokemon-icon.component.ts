import { Component } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';
import { PokemonBaseModel } from '../../../../models/PokemonModels/pokemonBase.model';
import { DisplayPokemonImageComponent } from '../../../display-pokemon-image/display-pokemon-image.component';

@Component({
  selector: 'pm-table-display-icon',
  standalone: true,
  imports: [DisplayPokemonImageComponent],
  templateUrl: './table-display-pokemon-icon.component.html',
  styleUrls: ['./table-display-pokemon-icon.component.scss'],
})
export class TableDisplayPokemonIconComponent extends DynamicCellBaseDirective<PokemonBaseModel> {}
