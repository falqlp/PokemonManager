import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  protected userIdSubject = new BehaviorSubject<string>(undefined);
  public $userId = this.userIdSubject.asObservable();
  protected gameIdSubject = new BehaviorSubject<string>(undefined);
  public $gameId = this.gameIdSubject.asObservable();
  protected trainerIdSubject = new BehaviorSubject<string>(undefined);
  public $trainerId = this.trainerIdSubject.asObservable();

  constructor(protected router: Router) {
    this.init();
  }

  public init(): void {
    const gameId = localStorage.getItem('gameId');
    this.setGameId(gameId);
    const userId = localStorage.getItem('userId');
    this.setUserId(userId);
    const trainerId = localStorage.getItem('trainerId');
    this.setTrainerId(trainerId);
  }

  public setUserId(id: string): void {
    localStorage.setItem('userId', id);
    this.userIdSubject.next(id);
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }

  public setGameId(id: string): void {
    if (!id) {
      this.setTrainerId(undefined);
    }
    localStorage.setItem('gameId', id);
    this.gameIdSubject.next(id);
  }

  public getGameId(): string {
    return localStorage.getItem('gameId');
  }

  public setTrainerId(id: string): void {
    localStorage.setItem('trainerId', id);
    this.trainerIdSubject.next(id);
  }

  public getTrainerId(): string {
    return localStorage.getItem('trainerId');
  }
}
