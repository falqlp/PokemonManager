import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BadgeDataService {
  public sidenav: string[] = [];
  public pokemon: string[] = [];
}
