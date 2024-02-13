import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf } from '@angular/common';
import { PokedexMoveLearnedModel } from '../pokedex-details.model';

@Component({
  selector: 'pm-pokedex-moves-learned',
  standalone: true,
  imports: [TranslateModule, NgForOf],
  templateUrl: './pokedex-moves-learned.component.html',
  styleUrls: ['./pokedex-moves-learned.component.scss'],
})
export class PokedexMovesLearnedComponent {
  @Input() public movesLearned: PokedexMoveLearnedModel[];
}
