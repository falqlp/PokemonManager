import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { SidenavService } from './components/sidenav/sidenav.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoMobileComponent } from './core/components/no-mobile/no-mobile.component';
import { InitGameService } from './services/init-game.service';
import { EggHatchedService } from './services/egg-hatched.service';
import { NewMoveLearnedService } from './services/new-move-learned.service';
import { WeeklyXpService } from './services/weekly-xp.service';
import { LanguageService } from './services/language.service';
import { RouterService } from './services/router.service';
import { UserService } from './services/user.service';
import { CacheService } from './services/cache.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatSidenavModule,
    SidenavComponent,
    TopBarComponent,
    RouterOutlet,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    NoMobileComponent,
    AsyncPipe,
    NgClass,
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  private websocketService = inject(WebsocketService);
  private sidenavService = inject(SidenavService);
  private destroyRef = inject(DestroyRef);
  private elementRef = inject(ElementRef);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  protected routerService = inject(RouterService);
  private userService = inject(UserService);
  private cacheService = inject(CacheService);
  @ViewChild('drawer') public drawer: MatDrawer;
  protected isMobile = false;
  protected topBar$ = this.routerService.topBar();
  constructor() {
    const initGameService = inject(InitGameService);
    const eggHatchedService = inject(EggHatchedService);
    const newMoveLearnedService = inject(NewMoveLearnedService);
    const weeklyXpService = inject(WeeklyXpService);
    const routerService = this.routerService;

    initGameService.init();
    eggHatchedService.init();
    newMoveLearnedService.init();
    weeklyXpService.init();
    routerService.init();
  }

  public ngOnInit(): void {
    this.userService.$user
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user && this.cacheService.needNewlogin()) {
          this.routerService.navigateByUrl('login');
        }
      });
    this.languageService
      .getLanguage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => this.translateService.use(lang));
    this.websocketService.connect();
  }

  public ngAfterViewInit(): void {
    this.drawer._closedStream
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.sidenavService.closeSidenav());
    this.sidenavService.$sidenavStatus
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        if (status === 'close') {
          this.drawer.close();
        } else {
          this.drawer.open();
        }
      });
    this.isMobile = this.elementRef.nativeElement.offsetWidth < 750;
  }
}
