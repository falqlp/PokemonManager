import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { BattleEventsService } from '../../application/BattleEvents/BattleEventsService';
import PokemonMapper from '../pokemon/PokemonMapper';

@Controller('battle-events')
export class BattleEventsController {
  constructor(
    private readonly service: BattleEventsService,
    private readonly pokemonMapper: PokemonMapper,
  ) {}

  @Put()
  async getBattleEventStats(
    @Headers('game-id') gameId: string,
    @Body() body: any,
  ) {
    try {
      const { type, isRelative, query, sort } = body;
      const obj = await this.service.getBattleEventStats(
        gameId,
        type,
        isRelative,
        query,
        sort,
      );

      // Mapper les Pokémon et retourner la réponse JSON
      return obj.map((o) => {
        o.pokemon = this.pokemonMapper.map(o.pokemon);
        return o;
      });
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve battle event stats: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
