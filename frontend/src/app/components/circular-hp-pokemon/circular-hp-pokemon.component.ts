import { Component, Input } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-circular-hp-pokemon',
  templateUrl: './circular-hp-pokemon.component.html',
  styleUrls: ['./circular-hp-pokemon.component.scss'],
})
export class CircularHpPokemonComponent {
  @Input() public pokemon: PokemonModel;
}
