import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import PokemonRepository from '../../domain/pokemon/PokemonRepository';
import EffectivenessService from '../../application/pokemon/EffectivenessService';
import PokemonService from '../../application/pokemon/PokemonService';
import PokemonMapper from './PokemonMapper';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';

@Controller('pokemon')
export class PokemonController extends ReadOnlyController<IPokemon> {
  constructor(
    protected readonly service: PokemonRepository,
    protected readonly mapper: PokemonMapper,
    private readonly effectivenessService: EffectivenessService,
    private readonly pokemonService: PokemonService,
  ) {
    super(service, mapper);
  }

  @Put('effectiveness')
  calculateEffectiveness(@Body() body: any) {
    try {
      return this.effectivenessService.calculateEffectiveness(body);
    } catch (error) {
      throw new HttpException(
        'Failed to calculate effectiveness: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('starters/:id')
  async generateStarters(
    @Param('id') id: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      const starters = await this.pokemonService.generateStarters(gameId, id);
      return starters.map((starter) => this.mapper.mapStarters(starter));
    } catch (error) {
      throw new HttpException(
        'Failed to generate starters: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('starters')
  async createStarters(
    @Body('starters') starters: IPokemon[],
    @Headers('game-id') gameId: string,
  ) {
    try {
      for (const pokemon of starters) {
        await this.pokemonService.create(pokemon, gameId);
      }
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to create starters: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('changeNickname')
  async changeNickname(
    @Body('pokemonId') pokemonId: string,
    @Body('nickname') nickname: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.changeNickname(pokemonId, nickname, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to change nickname: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('modify-moves')
  async modifyMoves(
    @Body('pokemonId') pokemonId: string,
    @Body('movesId') movesId: string[],
    @Body('trainerId') trainerId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.modifyMoves(
        pokemonId,
        movesId,
        trainerId,
        gameId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to modify moves: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('modify-strategy')
  async modifyStrategy(
    @Body('strategies') strategies: any[],
    @Body('trainerId') trainerId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.modifyMoveStrategy(
        strategies,
        trainerId,
        gameId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to modify strategy: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('modify-battle-strategy')
  async modifyBattleStrategy(
    @Body('strategies') strategies: any[],
    @Body('trainerId') trainerId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.modifyBattleMoveStrategy(
        strategies,
        trainerId,
        gameId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to modify battle strategy: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('hatch-egg')
  async hatchEgg(
    @Body('pokemonId') pokemonId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.hatchEgg(pokemonId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to hatch egg: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('evolve')
  async evolve(
    @Body('pokemonId') pokemonId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.evolve(pokemonId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to evolve Pokemon: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('release/:id')
  async releasePokemon(
    @Param('id') id: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.pokemonService.releasePokemon(id, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to release Pokemon: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
