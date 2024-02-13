import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'pm-display-type',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-type.component.html',
  styleUrls: ['./display-type.component.scss'],
})
export class DisplayTypeComponent {
  @Input() public basePokemon: PokemonBaseModel;
}
