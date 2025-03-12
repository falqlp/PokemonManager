import { Component, inject } from '@angular/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { PingQueriesService } from '../../../../services/queries/ping-queries.service';
import { catchError } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

export enum PingState {
  Online = 'Online',
  Offline = 'Offline',
}

@Component({
  selector: 'pm-ping',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './ping.component.html',
  styleUrl: './ping.component.scss',
})
export class PingComponent {
  private pingQueriesService = inject(PingQueriesService);

  private subscriptions: Subscription;
  protected ping: number;
  protected status: PingState = PingState.Online;
  constructor() {
    this.doPing();
    setInterval(() => {
      this.doPing();
    }, 2000);
  }

  private doPing(): void {
    const now = new Date();
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
      if (!this.subscriptions.closed) {
        this.status = PingState.Offline;
      }
    }
    this.subscriptions = forkJoin([
      this.pingQueriesService.pingCore(),
      this.pingQueriesService.pingBattle(),
    ])
      .pipe(
        catchError(() => {
          return of('error');
        })
      )
      .subscribe((res) => {
        if (res === 'error') {
          this.status = PingState.Offline;
          return;
        }
        this.status = PingState.Online;
        if (this.ping !== undefined) {
          this.ping = Math.floor(
            (this.ping + new Date().getMilliseconds() - now.getMilliseconds()) /
              2
          );
        } else {
          this.ping = new Date().getMilliseconds() - now.getMilliseconds();
        }
      });
  }
}
