import { Component } from '@angular/core';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { MatTableModule } from '@angular/material/table';
import { NgForOf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatSortModule } from '@angular/material/sort';
import {
  TableConfModel,
  CustomTableComponent,
} from '../../components/custom-table/custom-table.component';

@Component({
  standalone: true,
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss'],
  imports: [
    MatTableModule,
    NgForOf,
    DisplayPokemonImageComponent,
    MatSortModule,
    CustomTableComponent,
  ],
})
export class TrainersComponent {
  protected conf: TableConfModel = {
    columns: [
      {
        sort: true,
        name: 'name',
        header: {
          component: 'displayText',
          data: 'Trainer',
        },
        content: {
          component: 'displayText',
          data: 'name',
        },
      },
      {
        name: 'pokemons',
        header: {
          component: 'displayText',
          data: 'Pokemons',
        },
        content: {
          component: 'displayTrainerPokemons',
          data: 'all',
        },
      },
    ],
  };

  public constructor(protected trainerService: TrainerQueriesService) {}
}
