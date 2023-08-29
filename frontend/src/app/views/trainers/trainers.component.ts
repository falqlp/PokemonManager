import { Component, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from '../../services/trainer-queries.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { NgForOf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatSortModule, Sort } from '@angular/material/sort';

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
  ],
})
export class TrainersComponent implements OnInit {
  protected trainers$: Observable<TrainerModel[]>;
  protected displayedColumns = ['name', 'pokemons'];
  protected sortQuerySubject: BehaviorSubject<Record<string, number>> =
    new BehaviorSubject({});

  public constructor(protected trainerService: TrainerQueriesService) {}

  public ngOnInit(): void {
    this.trainers$ = this.sortQuerySubject.pipe(
      switchMap((sortQuery) => {
        return this.trainerService.list({ sort: sortQuery });
      })
    );
  }

  protected click(row: TrainerModel): void {
    console.log(row);
  }

  protected sort(event: Sort): void {
    this.sortQuerySubject.next(this.createSortQuery(event));
  }

  protected createSortQuery(sort: Sort): Record<string, number> {
    const sortQuery: Record<string, number> = {};
    let direction;
    switch (sort.direction) {
      case 'asc':
        direction = 1;
        break;
      case 'desc':
        direction = -1;
        break;
      default:
        direction = 0;
        break;
    }
    sortQuery[sort.active] = direction;
    return sortQuery;
  }
}
