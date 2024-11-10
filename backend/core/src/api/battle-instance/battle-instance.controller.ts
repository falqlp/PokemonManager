import {
  Body,
  Controller,
  Get,
  Headers,
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
import {
  IBattlePokemon,
  IBattleTrainer,
} from '../../application/battle/BattleInterfaces';
import BattleInstanceRepository from '../../domain/battleInstance/BattleInstanceRepository';
import PokemonMapper from '../pokemon/PokemonMapper';
import BattleService from '../../application/battle/BattleService';
import { IBattleInstance } from '../../domain/battleInstance/Battle';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';

@Controller('battle-instance')
export class BattleInstanceController extends ReadOnlyController<IBattleInstance> {
  constructor(
    protected readonly repository: BattleInstanceRepository,
    protected readonly mapper: BattleInstanceMapper,
    private readonly battleInstanceService: BattleInstanceService,
    private readonly battleService: BattleService,
    private readonly pokemonMapper: PokemonMapper,
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

  @Get('init-battle/:id')
  public async initBattle(
    @Param('id') id: string,
  ): Promise<{ player: IBattleTrainer; opponent: IBattleTrainer }> {
    try {
      const result = await this.battleInstanceService.initBattle(id);
      if (result) {
        result.player.pokemons = result.player.pokemons.map(
          (value) => this.pokemonMapper.map(value) as IBattlePokemon,
        );
        result.opponent.pokemons = result.opponent.pokemons.map(
          (value) => this.pokemonMapper.map(value) as IBattlePokemon,
        );
      }
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to initialize battle: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  @Put(':id')
  public async updateBattleInstance(
    @Param('id') id: string,
    @Body() body: any,
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
}
