import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
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

  gameGuard(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const gameId = this.cacheService.getGameId();
    console.log('gameId', gameId); //Je ne comprends pas pourquoi en le laissant ça marche donc je laisse ^^
    if (gameId === 'null') {
      this.router.navigateByUrl('/games');
      return false;
    }
    return this.authGuard(next, state);
  }

  authGuard(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userId = this.cacheService.getUserId();
    console.log('userId', userId); //Je ne comprends pas pourquoi en le laissant ça marche donc je laisse ^^
    if (userId === 'null') {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}

export const GameGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionsService).gameGuard(next, state);
};

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionsService).authGuard(next, state);
};
