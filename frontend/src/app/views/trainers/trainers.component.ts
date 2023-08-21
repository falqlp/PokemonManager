import { Component, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from '../../services/trainer-queries.service';

@Component({
  standalone: true,
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss'],
})
export class TrainersComponent implements OnInit {
  protected trainers: TrainerModel[];

  public constructor(protected trainerService: TrainerQueriesService) {}

  public ngOnInit(): void {
    this.trainerService.list().subscribe((trainers) => console.log(trainers));
  }
}
