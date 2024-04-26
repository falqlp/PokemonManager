import { Component, input } from '@angular/core';
import { PokemonModel } from '../../../models/PokemonModels/pokemon.model';
import { LocalDatePipe } from '../../../pipes/local-date.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-pokemon-resume-infos',
  standalone: true,
  imports: [LocalDatePipe, TranslateModule],
  templateUrl: './pokemon-resume-infos.component.html',
  styleUrl: './pokemon-resume-infos.component.scss',
})
export class PokemonResumeInfosComponent {
  public pokemon = input<PokemonModel>();
}
