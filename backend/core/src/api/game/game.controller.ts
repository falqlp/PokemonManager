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
import GameRepository from '../../domain/game/GameRepository';
import GameService from '../../application/game/GameService';
import GameMapper from './GameMapper';
import TrainerMapper from '../trainer/TrainerMapper';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { IGame } from '../../domain/game/Game';
import { ITrainer } from '../../domain/trainer/Trainer';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('game')
export class GameController extends ReadOnlyController<IGame> {
  constructor(
    protected readonly service: GameRepository,
    protected readonly mapper: GameMapper,
    private readonly gameService: GameService,
    private readonly trainerMapper: TrainerMapper,
  ) {
    super(service, mapper);
  }

  @Get('time/:id')
  public async getTime(@Param('id') id: string): Promise<Date> {
    try {
      const obj = await this.service.get(id);
      return obj.actualDate;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch game time: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('delete-game')
  public async deleteGame(
    @Body('gameId') gameId: string,
    @Body('userId') userId: string,
  ): Promise<{ status: string }> {
    try {
      await this.gameService.deleteGameForUser(gameId, userId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete game: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':userId')
  public async createGameWithUsers(
    @Body() body: any,
    @Param('userId') userId: string,
  ): Promise<IGame> {
    try {
      const obj = await this.gameService.createWithUsers(body, userId);
      return this.mapper.map(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to create game with users: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('add-player-to-game')
  public async addPlayerToGame(
    @Body('game') game: IGame,
    @Body('userId') userId: string,
  ): Promise<ITrainer> {
    try {
      const obj = await this.gameService.addPlayerToGame(game, userId);
      return this.trainerMapper.map(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to add player to game: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('init-if-not/:id')
  public async initIfNot(@Param('id') id: string): Promise<{ status: string }> {
    try {
      await this.gameService.initIfNot(id);
      return { status: 'initialized' };
    } catch (error) {
      throw new HttpException(
        'Failed to initialize game if not: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('game.get')
  public async getGame(@Payload() gameId: string): Promise<IGame> {
    try {
      const obj = await this.service.get(gameId);
      return this.mapper.map(obj);
    } catch (error) {
      throw new Error('Failed to fetch game: ' + error);
    }
  }
}
