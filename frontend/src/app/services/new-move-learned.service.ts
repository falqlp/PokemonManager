import { Injectable } from '@angular/core';
import { WebsocketEventService } from './websocket-event.service';
import { BadgeDataService } from './badge.data.service';
import { NotifierService } from './notifier.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NewMoveLearnedService {
  constructor(
    private websocketEventService: WebsocketEventService,
    private badgeDataService: BadgeDataService,
    private notifierService: NotifierService,
    private translateService: TranslateService
  ) {}

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
