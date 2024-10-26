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
import { ReadOnlyController } from '../read-only.controller';
import { ITrainer } from '../../domain/trainer/Trainer';

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
  async getPlayer(@Param('id') id: string) {
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
  async updatePcPositions(
    @Body('trainerId') trainerId: string,
    @Body('teamPositions') teamPositions: any,
    @Body('pcPositions') pcPositions: any,
    @Headers('game-id') gameId: string,
  ) {
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
}
