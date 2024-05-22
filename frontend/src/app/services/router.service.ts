import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';

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

  constructor(protected activatedRoute: ActivatedRoute) {
    super();
    this.init();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public init(): void {
    this.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const routeData: any = this.config.find(
          (config) =>
            config.path === (event as NavigationEnd).url.replace('/', '')
        ).data;
        this.setTitle(routeData.title);
        this.navigationDisabledSubject.next(routeData.navigationDisabled);
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
}
