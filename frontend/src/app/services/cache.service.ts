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

  constructor(protected router: Router) {
    this.init();
  }

  public init(): void {
    const gameId = localStorage.getItem('gameId');
    this.setGameId(gameId);
    if (!gameId) {
      console.log('gameId');
      this.router.navigateByUrl('games');
    }
    const userId = localStorage.getItem('userId');
    this.setUserId(userId);
    if (!userId) {
      this.router.navigateByUrl('login');
    }
  }

  public setUserId(id: string): void {
    localStorage.setItem('userId', id);
    this.userIdSubject.next(id);
  }

  public getUserId(): string {
    return localStorage.getItem('userId');
  }

  public setGameId(id: string): void {
    localStorage.setItem('gameId', id);
    this.gameIdSubject.next(id);
  }

  public getGameId(): string {
    return localStorage.getItem('gameId');
  }

  public removeGameId(): void {
    localStorage.removeItem('gameId');
    this.gameIdSubject.next(undefined);
  }
}
