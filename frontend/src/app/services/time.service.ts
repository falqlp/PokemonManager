import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  protected actualDate: Date;
  protected actualDaySubject: BehaviorSubject<string>;

  public constructor() {
    const actualDate = new Date(Date.now());
    actualDate.setHours(0, 0, 0, 0);
    this.actualDate = actualDate;
    this.actualDaySubject = new BehaviorSubject(
      this.dateToLocalDate(this.actualDate)
    );
  }

  public simulateDay(): void {
    this.actualDate.setDate(this.actualDate.getDate() + 1);
    this.actualDaySubject.next(this.dateToLocalDate(this.actualDate));
  }

  public getActualDate(): Observable<string> {
    return this.actualDaySubject.asObservable();
  }

  public dateToLocalDate(date: Date): string {
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }
}
