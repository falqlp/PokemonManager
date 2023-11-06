import { Component, OnInit } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';
import { PokemonBaseModel } from '../../../../models/PokemonModels/pokemonBase.model';
import { DisplayPokemonImageComponent } from '../../../display-pokemon-image/display-pokemon-image.component';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'pm-table-display-icon',
  standalone: true,
  imports: [DisplayPokemonImageComponent],
  templateUrl: './table-display-pokemon-icon.component.html',
  styleUrls: ['./table-display-pokemon-icon.component.scss'],
})
export class TableDisplayPokemonIconComponent
  extends DynamicCellBaseDirective<PokemonBaseModel>
  implements OnInit
{
  protected pokemon: PokemonModel;
  public ngOnInit(): void {
    this.pokemon = { basePokemon: this.data } as PokemonModel;
  }
}
