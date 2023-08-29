import { Component, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from '../../services/trainer-queries.service';
import { Observable } from 'rxjs';
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

  public constructor(protected trainerService: TrainerQueriesService) {}

  public ngOnInit(): void {
    this.trainers$ = this.trainerService.list({ sort: { name: 1 } });
  }

  protected click(row: TrainerModel): void {
    console.log(row);
  }

  protected sort(event: Sort): void {
    console.log(event);
  }
}
