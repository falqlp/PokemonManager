import { Component, Input } from '@angular/core';
import { PokemonModel } from '../pokemon.model';

@Component({
  selector: 'pokemon-panel',
  templateUrl: './pokemon-panel.component.html',
  styleUrls: ['./pokemon-panel.component.scss'],
})
export class PokemonPanelComponent {
  @Input() public pokemon?: PokemonModel;
}
