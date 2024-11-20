import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  BattleInstanceService,
  ISerieRanking,
  ITrainerRanking,
} from '../../application/battleInstance/BattleInstanceService';
import BattleInstanceMapper from './BattleInstanceMapper';
import BattleInstanceRepository from '../../domain/battleInstance/BattleInstanceRepository';
import { IBattleInstance } from '../../domain/battleInstance/Battle';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('battle-instance')
export class BattleInstanceController extends ReadOnlyController<IBattleInstance> {
  constructor(
    protected readonly repository: BattleInstanceRepository,
    protected readonly mapper: BattleInstanceMapper,
    private readonly battleInstanceService: BattleInstanceService,
  ) {
    super(repository, mapper);
  }

  @Get('ranking/:id')
  public async getChampionshipRanking(
    @Param('id') id: string,
  ): Promise<ITrainerRanking[]> {
    try {
      const obj = await this.battleInstanceService.getChampionshipRanking(id);
      return obj.map((value) => {
        value.directWins = undefined;
        return value;
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch championship ranking: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('groups-ranking/:id')
  public async getGroupsRanking(
    @Param('id') id: string,
  ): Promise<ITrainerRanking[][]> {
    try {
      const obj = await this.battleInstanceService.getGroupsRanking(id);
      return obj.map((group) =>
        group.map((val) => {
          val.directWins = undefined;
          return val;
        }),
      );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch groups ranking: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tournament-ranking/:id')
  public async getTournamentRanking(
    @Param('id') id: string,
  ): Promise<{ tournamentRanking: ISerieRanking[][]; step: number }> {
    try {
      return await this.battleInstanceService.getTournamentRanking(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch tournament ranking: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('simulateBattle')
  public async simulateBattle(
    @Body('_id') id: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleInstanceService.simulateBattle(id);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to simulate battle: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  public async updateBattleInstance(
    @Param('id') id: string,
    @Body() body: IBattleInstance,
  ): Promise<IBattleInstance> {
    try {
      const obj = await this.battleInstanceService.update(id, body);
      return this.mapper.map(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to update battle instance: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('battleInstance.get')
  public async getBattleInstance(
    @Payload() data: string,
  ): Promise<IBattleInstance> {
    try {
      return this.repository.get(data);
    } catch (error) {
      throw new Error('Failed to get battle instance: ' + error);
    }
  }

  @MessagePattern('battleInstance.update')
  public async battleInstanceUpdate(
    @Payload('_id') _id: string,
    @Payload('battle') battle: IBattleInstance,
  ): Promise<void> {
    try {
      await this.battleInstanceService.update(_id, battle);
    } catch (error) {
      throw new Error('Failed to update battle instance: ' + error);
    }
  }
}
