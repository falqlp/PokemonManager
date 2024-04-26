import {
  AfterViewInit,
  Component,
  DestroyRef,
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

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MatSidenavModule, SidenavComponent, TopBarComponent, RouterOutlet],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') public drawer: MatDrawer;
  constructor(
    protected websocketService: WebsocketService,
    protected sidenavService: SidenavService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
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
  }
}
