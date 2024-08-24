import { Injectable, inject } from '@angular/core';
import { WebsocketEventService } from './websocket-event.service';
import { BadgeDataService } from './badge.data.service';
import { NotifierService } from './notifier.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NewMoveLearnedService {
  private websocketEventService = inject(WebsocketEventService);
  private badgeDataService = inject(BadgeDataService);
  private notifierService = inject(NotifierService);
  private translateService = inject(TranslateService);

  public init(): void {
    this.websocketEventService.notifyNewMoveLearnedEvent$.subscribe(
      (payload) => {
        this.badgeDataService.pokemon.push(payload.id);
        this.badgeDataService.sidenav.push('PC-STORAGE');
        this.notifierService.notify({
          key: this.translateService.instant(payload.key, {
            pokemon: this.translateService.instant(payload.pokemonName),
          }),
        });
      }
    );
  }
}
