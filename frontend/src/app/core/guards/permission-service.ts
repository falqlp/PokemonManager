import { CanActivateFn } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { inject, Injectable } from '@angular/core';
import { CacheService } from '../../services/cache.service';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    protected router: RouterService,
    protected cacheService: CacheService
  ) {}

  gameGuard(): boolean {
    const gameId = this.cacheService.getGameId();
    if (gameId === 'null') {
      this.router.navigateByUrl('/games');
      return false;
    }
    return this.authGuard();
  }

  authGuard(): boolean {
    const userId = this.cacheService.getUserId();
    if (userId === 'null') {
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
