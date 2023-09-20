import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonModel } from '../../../models/PokemonModels/pokemon.model';
import { MatButtonModule } from '@angular/material/button';
import { PokemonResumeModifyMovesComponent } from './pokemon-resume-modify-moves/pokemon-resume-modify-moves.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'pm-pokemon-resume-moves',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    PokemonResumeModifyMovesComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './pokemon-resume-moves.component.html',
  styleUrls: ['./pokemon-resume-moves.component.scss'],
})
export class PokemonResumeMovesComponent {
  @Input() public pokemon: PokemonModel;
  protected modify = false;
}
