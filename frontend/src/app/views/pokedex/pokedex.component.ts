import { Component, inject } from '@angular/core';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { PokemonBaseQueriesService } from '../../services/queries/pokemon-base-queries.service';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { RouterService } from '../../services/router.service';
import {
  TableConfModel,
  TableSearchType,
} from '../../components/custom-table/custom-table.model';

@Component({
  selector: 'pm-pokedex',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent {
  protected pokemonBaseQueriesService = inject(PokemonBaseQueriesService);
  protected routerService = inject(RouterService);

  protected conf: TableConfModel = {
    defaultSort: { column: 'id', direction: 'asc' },
    columns: [
      {
        name: 'id',
        sort: true,
        search: { value: 'id', type: TableSearchType.NUMBER },
        header: {
          component: 'displayText',
          data: 'N°',
        },
        content: {
          component: 'displayText',
          data: 'id',
        },
      },
      {
        name: 'icon',
        sort: false,
        header: {
          component: 'displayText',
          data: 'ICON',
        },
        content: {
          component: 'displayPokemonIcon',
          data: 'all',
        },
      },
      {
        name: 'name',
        sort: 'translation.name',
        search: { value: 'translation.name', type: TableSearchType.TEXT },
        header: {
          component: 'displayText',
          data: 'NAME',
        },
        content: {
          component: 'displayText',
          data: 'name',
        },
      },
      {
        name: 'types',
        search: {
          value: 'types',
          type: TableSearchType.MULTI_SELECT,
          values: [
            'BUG',
            'DARK',
            'DRAGON',
            'ELECTRIC',
            'FAIRY',
            'FIGHTING',
            'FIRE',
            'GHOST',
            'GRASS',
            'GROUND',
            'ICE',
            'NORMAL',
            'POISON',
            'PSY',
            'ROCK',
            'STEEL',
            'WATER',
          ],
        },
        header: {
          component: 'displayText',
          data: 'TYPES',
        },
        content: {
          component: 'displayPokemonTypes',
          data: 'types',
        },
      },
      {
        name: 'baseStats.hp',
        sort: true,
        header: {
          component: 'displayText',
          data: 'HP',
        },
        content: {
          component: 'displayText',
          data: 'baseStats.hp',
        },
      },
      {
        name: 'baseStats.atk',
        sort: true,
        header: {
          component: 'displayText',
          data: 'ATTACK',
        },
        content: {
          component: 'displayText',
          data: 'baseStats.atk',
        },
      },
      {
        name: 'baseStats.def',
        sort: true,
        header: {
          component: 'displayText',
          data: 'DEFENSE',
        },
        content: {
          component: 'displayText',
          data: 'baseStats.def',
        },
      },
      {
        name: 'baseStats.spAtk',
        sort: true,
        header: {
          component: 'displayText',
          data: 'SPECIAL_ATTACK',
        },
        content: {
          component: 'displayText',
          data: 'baseStats.spAtk',
        },
      },
      {
        name: 'baseStats.spDef',
        sort: true,
        header: {
          component: 'displayText',
          data: 'SPECIAL_DEFENSE',
        },
        content: {
          component: 'displayText',
          data: 'baseStats.spDef',
        },
      },
      {
        name: 'baseStats.spe',
        sort: true,
        header: {
          component: 'displayText',
          data: 'SPEED',
        },
        content: {
          component: 'displayText',
          data: 'baseStats.spe',
        },
      },
    ],
  };

  public onRowClick(event: PokemonBaseModel): void {
    this.routerService.navigateByUrl('pokedex-details/' + event.id);
  }
}
