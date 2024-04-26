import { Component, Input } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { CircularProgressBarComponent } from '../circular-progress-bar/circular-progress-bar.component';
import { DisplayPokemonImageComponent } from '../display-pokemon-image/display-pokemon-image.component';

@Component({
  selector: 'app-circular-hp-pokemon',
  templateUrl: './circular-hp-pokemon.component.html',
  styleUrls: ['./circular-hp-pokemon.component.scss'],
  standalone: true,
  imports: [CircularProgressBarComponent, DisplayPokemonImageComponent],
})
export class CircularHpPokemonComponent {
  @Input() public pokemon: PokemonModel;
}
