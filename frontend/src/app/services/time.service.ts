import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  protected actualDate: Date;
  protected actualDaySubjectToString: BehaviorSubject<string>;
  protected actualDaySubject: BehaviorSubject<Date>;

  public constructor() {
    const actualDate = new Date(Date.now());
    actualDate.setHours(0, 0, 0, 0);
    this.actualDate = actualDate;
    this.actualDaySubjectToString = new BehaviorSubject(
      this.dateToLocalDate(this.actualDate)
    );
    this.actualDaySubject = new BehaviorSubject(this.actualDate);
  }

  public simulateDay(): void {
    this.actualDate.setDate(this.actualDate.getDate() + 1);
    this.actualDaySubjectToString.next(this.dateToLocalDate(this.actualDate));
    this.actualDaySubject.next(this.actualDate);
  }

  public getActualDateToString(): Observable<string> {
    return this.actualDaySubjectToString.asObservable();
  }

  public getActualDate(): Observable<Date> {
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

  public dateToSimplifyLocalDate(date: Date): string {
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
    });
  }
}
