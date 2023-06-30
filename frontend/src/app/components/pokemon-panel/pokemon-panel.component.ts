import { Component, Input } from '@angular/core';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'pokemon-panel',
  templateUrl: './pokemon-panel.component.html',
  styleUrls: ['./pokemon-panel.component.scss'],
})
export class PokemonPanelComponent {
  @Input() public pokemon: PokemonBaseModel;
}
