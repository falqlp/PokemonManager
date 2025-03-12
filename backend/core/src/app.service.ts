import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import BattleService from './application/battle/battle.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  public constructor(private readonly battleService: BattleService) {}

  public onApplicationBootstrap(): void {
    this.pingBattle();
  }

  public pingBattle(): void {
    setInterval(() => {
      const start = new Date();
      this.battleService.ping().then(() => {
        Logger.log(
          'Battle App ping: ' +
            `${new Date().getMilliseconds() - start.getMilliseconds()}`,
        );
      });
    }, 10000);
  }
}
