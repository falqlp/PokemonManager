import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PokedexService } from '../../application/pokedex/PokedexService';
import { IPokedex } from '../../application/pokedex/Pokedex';

@Controller('pokedex')
export class PokedexController {
  constructor(private readonly pokedexService: PokedexService) {}

  @Get(':id')
  public async getPokemonDetails(@Param('id') id: number): Promise<IPokedex> {
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
