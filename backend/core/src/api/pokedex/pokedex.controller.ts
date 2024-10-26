import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PokedexService } from '../../application/pokedex/PokedexService';

@Controller('pokedex')
export class PokedexController {
  constructor(private readonly pokedexService: PokedexService) {}

  @Get(':id')
  async getPokemonDetails(@Param('id') id: number) {
    try {
      return await this.pokedexService.getPokemonDetails(id);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve Pokémon details: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
