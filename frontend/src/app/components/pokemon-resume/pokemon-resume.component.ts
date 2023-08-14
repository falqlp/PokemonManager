import { Component, Input } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-pokemon-resume',
  templateUrl: './pokemon-resume.component.html',
  styleUrls: ['./pokemon-resume.component.scss'],
})
export class PokemonResumeComponent {
  @Input() public pokemon: PokemonModel;
}
