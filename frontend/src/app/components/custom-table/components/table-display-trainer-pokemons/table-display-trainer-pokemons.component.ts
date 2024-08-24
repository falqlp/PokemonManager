import { Component } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';
import { TrainerModel } from '../../../../models/TrainersModels/trainer.model';
import { DisplayPokemonImageComponent } from '../../../display-pokemon-image/display-pokemon-image.component';

@Component({
  selector: 'pm-table-display-trainer-pokemons',
  standalone: true,
  imports: [DisplayPokemonImageComponent],
  templateUrl: './table-display-trainer-pokemons.component.html',
  styleUrls: ['./table-display-trainer-pokemons.component.scss'],
})
export class TableDisplayTrainerPokemonsComponent extends DynamicCellBaseDirective<TrainerModel> {}
