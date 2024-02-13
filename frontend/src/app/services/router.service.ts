import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService extends Router {
  protected lastUrl: string;
  protected titleSubject = new BehaviorSubject<string>('');
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    super();
    this.init();
  }

  public goHomeDisabled(): Observable<boolean> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['goHomeDisabled'];
      })
    );
  }

  public getTitle(): Observable<string> {
    return combineLatest([
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['title'];
        })
      ),
      this.titleSubject.asObservable(),
    ]).pipe(
      map(([routeTitle, subjectTitle]) => {
        return routeTitle ?? subjectTitle;
      })
    );
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  protected init(): void {
    this.activatedRoute.title.subscribe(console.log);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.lastUrl = this.router.url;
      });
  }

  public getLastUrl(): string {
    return this.lastUrl;
  }
}
