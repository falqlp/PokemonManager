import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { SidenavService } from './components/sidenav/sidenav.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') public drawer: MatDrawer;
  constructor(
    protected websocketService: WebsocketService,
    protected sidenavService: SidenavService
  ) {}

  public ngOnInit(): void {
    this.websocketService.connect();
  }

  public ngAfterViewInit(): void {
    this.drawer._closedStream.subscribe(() =>
      this.sidenavService.closeSidenav()
    );
    this.sidenavService.$sidenavStatus.subscribe((status) => {
      if (status === 'close') {
        this.drawer.close();
      } else {
        this.drawer.open();
      }
    });
  }
}
