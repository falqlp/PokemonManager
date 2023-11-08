import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SidenavStatusModel = 'close' | 'open';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  protected sidenavStatusSubject = new BehaviorSubject<SidenavStatusModel>(
    'close'
  );

  public $sidenavStatus: Observable<SidenavStatusModel> =
    this.sidenavStatusSubject.asObservable();

  public closeSidenav(): void {
    this.sidenavStatusSubject.next('close');
  }

  public openSidenav(): void {
    this.sidenavStatusSubject.next('open');
  }
}
