import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import DamageEventRepository from '../../domain/battleevents/damageevent/DamageEventRepository';

@Controller('damage-event')
export class DamageEventController {
  constructor(private readonly damageEventRepository: DamageEventRepository) {}
  @MessagePattern('damage-event.delete-all-for-game')
  public async deleteDamageEventsForGame(
    @Payload() gameId: string,
  ): Promise<void> {
    await this.damageEventRepository.deleteMany({ gameId });
  }
}
