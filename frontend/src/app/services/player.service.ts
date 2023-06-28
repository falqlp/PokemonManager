import { Injectable } from '@angular/core';
import { TrainerModel } from '../models/TrainersModels/trainer.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TrainerQueriesService } from './trainer-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerSubject = new BehaviorSubject<TrainerModel>({
    _id: '649c3bdbe45d3dab76652529',
    name: 'Unconnected',
    pokemons: [],
  });

  public player$ = this.playerSubject.asObservable();
  constructor(protected trainerService: TrainerQueriesService) {}

  public updatePlayer(id: string): void {
    this.getPlayer(id).subscribe((trainer) => {
      this.playerSubject.next(trainer);
    });
  }

  public getPlayer(id: string): Observable<TrainerModel> {
    return this.trainerService.getTrainer(id);
  }
}
