import { Component, Input } from '@angular/core';

import { DisplayPokemonImageComponent } from '../../../components/display-pokemon-image/display-pokemon-image.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonBaseModel } from '../../../models/PokemonModels/pokemonBase.model';
import { PokedexEvolutionModel } from '../pokedex-details.model';

@Component({
  selector: 'pm-evolution-tree',
  standalone: true,
  imports: [DisplayPokemonImageComponent, MatIconModule, TranslateModule],
  templateUrl: './evolution-tree.component.html',
  styleUrls: ['./evolution-tree.component.scss'],
})
export class EvolutionTreeComponent {
  @Input() pokemonBase: PokemonBaseModel;
  @Input() evolutionOf: PokedexEvolutionModel[];
  @Input() evolutions: PokedexEvolutionModel[];
}
