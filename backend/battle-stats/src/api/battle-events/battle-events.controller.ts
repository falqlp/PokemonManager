import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  BattleEventsBattleInstance,
  BattleEventService,
} from '../../application/battle-event/battle-event.service';
import { IStatsByPokemon } from '../../domain/battleevents/battle-event-queries-util.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IBattleParticipationEvent, IDamageEvent } from 'shared/models';

@Controller('battle-events')
export class BattleEventsController {
  constructor(private readonly service: BattleEventService) {}

  @Put()
  public async getBattleEventStats(
    @Headers('game-id') gameId: string,
    @Body() body: any,
  ): Promise<IStatsByPokemon[]> {
    try {
      const { type, isRelative, query, sort } = body;
      return await this.service.getBattleEventStats(
        gameId,
        type,
        isRelative,
        query,
        sort,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve battle event stats: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('battle-events.insert')
  public async insertBattleEventsData(
    @Payload('damageEvents') damageEvents: IDamageEvent[],
    @Payload('battleParticipationEvents')
    battleParticipationEvents: IBattleParticipationEvent[],
    @Payload('battle')
    battle: BattleEventsBattleInstance,
    @Payload('date')
    date: Date,
  ): Promise<void> {
    await this.service.insertBattleEventsData(
      damageEvents,
      battleParticipationEvents,
      battle,
      date,
    );
  }
}
