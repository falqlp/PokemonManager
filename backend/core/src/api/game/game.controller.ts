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
  async getTime(@Param('id') id: string) {
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
  async deleteGame(
    @Body('gameId') gameId: string,
    @Body('userId') userId: string,
  ) {
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
  async createGameWithUsers(
    @Body() body: any,
    @Param('userId') userId: string,
  ) {
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
  async addPlayerToGame(
    @Body('game') game: IGame,
    @Body('userId') userId: string,
  ) {
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
  async initIfNot(@Param('id') id: string) {
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
}
