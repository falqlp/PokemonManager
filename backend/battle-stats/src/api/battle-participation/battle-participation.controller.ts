import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import BattleParticipationEventRepository from '../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository';

@Controller('battle-participation')
export class BattleParticipationController {
  constructor(
    private readonly battleParticipationEventRepository: BattleParticipationEventRepository,
  ) {}

  @MessagePattern('battle-participation.delete-all-for-game')
  public async deleteAllBattleParticipationsForGame(
    @Payload() gameId: string,
  ): Promise<void> {
    await this.battleParticipationEventRepository.deleteMany({ gameId });
  }
}
