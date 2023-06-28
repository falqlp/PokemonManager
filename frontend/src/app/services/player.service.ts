import { Injectable } from '@angular/core';
import { TrainerModel } from '../models/TrainersModels/trainer.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TrainerQueriesService } from './trainer-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerSubject = new BehaviorSubject<TrainerModel>({
    _id: '6496f985f15bc10f660c1958',
    name: 'Popole',
    pokemons: [],
  });

  public player$ = this.playerSubject.asObservable();
  constructor(protected trainerService: TrainerQueriesService) {
    this.updatePlayer('6496f985f15bc10f660c1958');
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
