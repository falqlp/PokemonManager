import { Component, inject } from '@angular/core';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { MatTableModule } from '@angular/material/table';

import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatSortModule } from '@angular/material/sort';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import {
  TableConfModel,
  TableSearchType,
} from '../../components/custom-table/custom-table.model';

@Component({
  standalone: true,
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss'],
  imports: [
    MatTableModule,
    DisplayPokemonImageComponent,
    MatSortModule,
    CustomTableComponent,
  ],
})
export class TrainersComponent {
  protected trainerService = inject(TrainerQueriesService);

  protected conf: TableConfModel = {
    columns: [
      {
        name: 'class',
        header: {
          component: 'displayText',
          data: 'CLASS',
        },
        content: {
          component: 'displayText',
          data: 'class',
        },
      },
      {
        sort: true,
        name: 'name',
        header: {
          component: 'displayText',
          data: 'NAME',
        },
        content: {
          component: 'displayText',
          data: 'name',
        },
        search: {
          type: TableSearchType.TEXT,
          value: 'name',
        },
      },
      {
        name: 'pokemons',
        header: {
          component: 'displayText',
          data: 'TEAM',
        },
        content: {
          component: 'displayTrainerPokemons',
          data: 'all',
        },
      },
    ],
  };
}
