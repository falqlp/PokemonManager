import { CanActivateFn } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { inject, Injectable } from '@angular/core';
import { CacheService } from '../../services/cache.service';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  protected router = inject(RouterService);
  protected cacheService = inject(CacheService);

  gameGuard(): boolean {
    const gameId = this.cacheService.getGameId();
    const trainerId = this.cacheService.getTrainerId();
    if (gameId === 'null' || (trainerId === 'null' && !gameId) || !trainerId) {
      this.router.navigateByUrl('/games');
      return false;
    }
    return this.authGuard();
  }

  authGuard(): boolean {
    const userId = this.cacheService.getUserId();
    if (userId === 'null' || !userId) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

export const GameGuard: CanActivateFn = (): boolean => {
  return inject(PermissionsService).gameGuard();
};

export const AuthGuard: CanActivateFn = (): boolean => {
  return inject(PermissionsService).authGuard();
};
