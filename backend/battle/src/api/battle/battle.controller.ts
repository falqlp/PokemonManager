import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import BattleService from '../../application/battle/BattleService';
import { BattleInstanceBattle } from '../../application/core-interface/core-interface.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IBattleState } from '../../application/battle/BattleInterfaces';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Post('init-trainer')
  public async initTrainer(
    @Body('trainerId') trainerId: string,
    @Body('battleId') battleId: string,
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleService.initTrainer(trainerId, battleId, gameId);
      return { status: 'success' };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Failed to initialize trainer: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ask-next-round')
  public async askNextRound(
    @Body('trainerId') trainerId: string,
    @Body('battleId') battleId: string,
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleService.askNextRound(trainerId, battleId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to ask next round: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ask-next-round-loop')
  public async askNextRoundLoop(
    @Body('trainerId') trainerId: string,
    @Body('battleId') battleId: string,
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleService.askNextRoundLoop(trainerId, battleId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to ask next round loop: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('delete-ask-next-round')
  public async deleteAskNextRound(
    @Body('trainerId') trainerId: string,
    @Body('battleId') battleId: string,
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleService.deleteAskNextRound(trainerId, battleId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete ask next round: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('delete-ask-next-round-loop')
  public async deleteAskNextRoundLoop(
    @Body('trainerId') trainerId: string,
    @Body('battleId') battleId: string,
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleService.deleteAskNextRoundLoop(
        trainerId,
        battleId,
        gameId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete ask next round loop: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset-next-round-status')
  public async resetNextRoundStatus(
    @Body('battleId') battleId: string,
    @Headers('game-id') gameId: string,
  ): Promise<{ status: string }> {
    try {
      await this.battleService.resetNextRoundStatus(battleId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to reset next round status: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('battle.simulateBattle')
  public simulateBattle(
    @Payload('battle') battle: BattleInstanceBattle,
    @Payload('date') date: Date,
  ): BattleInstanceBattle {
    try {
      return this.battleService.simulateBattle(battle, date);
    } catch (error) {
      throw new Error('Failed to simulate battle: ' + error);
    }
  }

  @Get('init-battle/:id')
  public async initBattle(@Param('id') id: string): Promise<IBattleState> {
    try {
      return await this.battleService.initBattleForTrainer(id);
    } catch (error) {
      throw new HttpException(
        'Failed to initialize battle: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
