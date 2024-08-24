import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  protected router = inject(Router);

  protected userIdSubject = new BehaviorSubject<string>(undefined);
  public $userId = this.userIdSubject.asObservable();
  protected gameIdSubject = new BehaviorSubject<string>(undefined);
  public $gameId = this.gameIdSubject.asObservable();
  protected trainerIdSubject = new BehaviorSubject<string>(undefined);
  public $trainerId = this.trainerIdSubject.asObservable();

  constructor() {
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

  public setConnexionDate(): void {
    localStorage.setItem('connexionDate', new Date(Date.now()).toString());
  }

  public needNewlogin(): boolean {
    const connexionDate = localStorage.getItem('connexionDate');
    if (!connexionDate || connexionDate === 'undefined') {
      return true;
    }
    const currentDate = new Date(Date.now());
    const lastConnexionDate = new Date(connexionDate);
    const diffInDays = Math.floor(
      (currentDate.getTime() - lastConnexionDate.getTime()) / (1000 * 3600 * 24)
    );
    return diffInDays > 4;
  }

  public setUserId(id: string): void {
    localStorage.setItem('userId', id);
    this.userIdSubject.next(id === 'undefined' ? undefined : id);
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }

  public setGameId(id: string): void {
    if (!id) {
      this.setTrainerId(undefined);
    }
    localStorage.setItem('gameId', id);
    this.gameIdSubject.next(id === 'undefined' ? undefined : id);
  }

  public getGameId(): string {
    return localStorage.getItem('gameId');
  }

  public setTrainerId(id: string): void {
    localStorage.setItem('trainerId', id);
    this.trainerIdSubject.next(id === 'undefined' ? undefined : id);
  }

  public getTrainerId(): string {
    return localStorage.getItem('trainerId');
  }
}
