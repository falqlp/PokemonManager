import { inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  RouteConfigLoadEnd,
  Router,
} from '@angular/router';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService extends Router {
  protected activatedRoute = inject(ActivatedRoute);

  protected lastUrl: string;
  protected titleSubject = new BehaviorSubject<string>('');
  private navigationDisabledSubject = new BehaviorSubject<boolean>(false);
  public $navigationDisabled: Observable<boolean> =
    this.navigationDisabledSubject.asObservable();

  public $title = this.titleSubject.asObservable();

  constructor() {
    super();
    this.init();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public init(): void {
    this.events
      .pipe(filter((event) => event instanceof RouteConfigLoadEnd))
      .subscribe((event) => {
        const routeData = (event as RouteConfigLoadEnd).route.data;
        this.setTitle(routeData['title']);
        this.navigationDisabledSubject.next(routeData['navigationDisabled']);
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
    return this.events
      .pipe(filter((event) => event instanceof RouteConfigLoadEnd))
      .pipe(
        map((event) => {
          const data = (event as RouteConfigLoadEnd).route.data;
          return data['topBar'] !== false || data['title'] === undefined;
        })
      );
  }
}
