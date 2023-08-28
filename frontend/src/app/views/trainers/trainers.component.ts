import { Component, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from '../../services/trainer-queries.service';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { NgForOf } from '@angular/common';
import { AppModule } from '../../app.module';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';

@Component({
  standalone: true,
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss'],
  imports: [MatTableModule, NgForOf, DisplayPokemonImageComponent],
})
export class TrainersComponent implements OnInit {
  protected trainers$: Observable<TrainerModel[]>;
  protected displayedColumns = ['trainer', 'pokemons'];

  public constructor(protected trainerService: TrainerQueriesService) {}

  public ngOnInit(): void {
    this.trainers$ = this.trainerService.list();
  }

  protected click(row: TrainerModel) {
    console.log(row);
  }
}
