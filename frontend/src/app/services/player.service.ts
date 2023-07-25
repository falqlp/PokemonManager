import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { TrainerQueriesService } from './trainer-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  protected playerSubject = new BehaviorSubject<TrainerModel>({
    _id: '649e0e86e45d3dab76652543',
    name: 'Popole',
    pokemons: [],
  });

  public player$ = this.playerSubject.asObservable();
  public constructor(protected trainerService: TrainerQueriesService) {
    this.updatePlayer('649e0e86e45d3dab76652543');
  }

  public updatePlayer(id: string): void {
    this.getPlayer(id).subscribe((trainer) => {
      this.playerSubject.next(trainer);
    });
  }

  public getPlayer(id: string): Observable<TrainerModel> {
    return this.trainerService.getTrainer(id);
  }
}
