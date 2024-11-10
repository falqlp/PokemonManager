import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import TrainerMapper from './TrainerMapper';
import TrainerService from '../../application/trainer/TrainerService';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { ITrainer } from '../../domain/trainer/Trainer';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ListBody } from 'shared/common';

@Controller('trainer')
export class TrainerController extends ReadOnlyController<ITrainer> {
  constructor(
    protected readonly service: TrainerRepository,
    protected readonly mapper: TrainerMapper,
    private readonly trainerService: TrainerService,
  ) {
    super(service, mapper);
  }

  @Get('player/:id')
  public async getPlayer(@Param('id') id: string): Promise<ITrainer> {
    try {
      const obj = await this.service.get(id);
      return this.mapper.mapPlayer(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve player: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update-pc-positions')
  public async updatePcPositions(
    @Body('trainerId') trainerId: string,
    @Body('teamPositions') teamPositions: string[],
    @Body('pcPositions') pcPositions: string[],
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.trainerService.updatePcPosition(
        trainerId,
        teamPositions,
        pcPositions,
        gameId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to update PC positions: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('trainer.list')
  public async listTrainer(
    @Payload() data: { body: ListBody; gameId: string },
  ): Promise<ITrainer[]> {
    return (await this.repository.list(data.body, { gameId: data.gameId })).map(
      (obj) => this.mapper.map(obj),
    );
  }
}
