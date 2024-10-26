import { Controller } from '@nestjs/common';
import PokemonBaseRepository from '../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import PokemonBaseMapper from './PokemonBaseMapper';
import { ReadOnlyGlobalController } from '../read-only-global.controller';
import { IPokemonBase } from '../../domain/pokemon/pokemonBase/PokemonBase';

@Controller('pokemon-base')
export class PokemonBaseController extends ReadOnlyGlobalController<IPokemonBase> {
  constructor(protected readonly service: PokemonBaseRepository) {
    super(service, PokemonBaseMapper);
  }
}
