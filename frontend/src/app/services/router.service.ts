import { Injectable } from '@angular/core';
import { NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService extends Router {
  protected lastUrl: string;
  protected titleSubject = new BehaviorSubject<string>('');
  private navigationDisabledSubject = new BehaviorSubject<boolean>(false);
  public $navigationDisabled: Observable<boolean> =
    this.navigationDisabledSubject.asObservable();

  public $title = this.titleSubject.asObservable();

  private readonly routeData$ = this.events.pipe(
    filter((event) => event instanceof RouteConfigLoadEnd),

    map((event) => {
      return (event as RouteConfigLoadEnd).route.data;
    }),
    filter((data) => !!data)
  );

  constructor() {
    super();
    this.init();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public init(): void {
    this.routeData$.subscribe((data) => {
      this.setTitle(data['title']);
      this.navigationDisabledSubject.next(data['navigationDisabled']);
    });
    this.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.lastUrl = this.url;
      });
  }

  public getLastUrl(): string {
    return this.lastUrl;
  }

  public topBar(): Observable<boolean> {
    return this.routeData$.pipe(
      map((data) => {
        return (
          data && (data['topBar'] !== false || data['title'] === undefined)
        );
      })
    );
  }
}
