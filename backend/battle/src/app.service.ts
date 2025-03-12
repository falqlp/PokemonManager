import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BattleEventsService } from './application/battle-events/battle-events.service';
import BattleWebsocketService from './application/websocket/battle-websocket.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly battleEventsService: BattleEventsService,
    private readonly battleWebsocketService: BattleWebsocketService,
  ) {}

  public onApplicationBootstrap(): void {
    this.pingBattleStats();
    this.pingBattleWebsocket();
  }

  public pingBattleStats(): void {
    setInterval(() => {
      const start = new Date();
      this.battleEventsService.ping().then(() => {
        Logger.log(
          'Battle stats App ping: ' +
            `${new Date().getMilliseconds() - start.getMilliseconds()}`,
        );
      });
    }, 10000);
  }

  public pingBattleWebsocket(): void {
    setInterval(() => {
      const start = new Date();
      this.battleWebsocketService.ping().then(() => {
        Logger.log(
          'Battle websocket App ping: ' +
            `${new Date().getMilliseconds() - start.getMilliseconds()}`,
        );
      });
    }, 10000);
  }
}
