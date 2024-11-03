import Evolution, { IEvolution } from './Evolution';
import PokemonBaseRepository from '../pokemon/pokemonBase/PokemonBaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPokemonBase } from 'shared/models/pokemon/pokemon-models';

@Injectable()
class EvolutionRepository {
  constructor(
    protected pokemonBaseRepository: PokemonBaseRepository,
    @InjectModel(Evolution.modelName)
    protected readonly schema: Model<IEvolution>,
  ) {}

  public hasEvolution(id: number): Promise<IEvolution[]> {
    return this.schema.find({ pokemonId: id });
  }

  public isEvolution(id: number): Promise<IEvolution | null> {
    return this.schema.findOne({ evolveTo: id });
  }

  public async evolve(
    id: number,
    level: number,
    method: string,
  ): Promise<IPokemonBase> {
    const evolution = await this.schema.findOne({
      evolutionMethod: method,
      pokemonId: id,
      minLevel: { $lte: level },
    });
    return evolution
      ? this.pokemonBaseRepository.getPokemonBaseById(evolution.evolveTo)
      : null;
  }

  public async maxEvolution(
    id: number,
    level: number,
    method: string,
  ): Promise<IPokemonBase> {
    let evolution = await this.schema.findOne({
      evolutionMethod: method,
      pokemonId: id,
      minLevel: { $lte: level },
    });
    if (evolution) {
      const maxEvolution = await this.schema.findOne({
        evolutionMethod: method,
        pokemonId: evolution.evolveTo,
        minLevel: { $lte: level },
      });
      if (maxEvolution) {
        evolution = maxEvolution;
      }
    }
    return evolution
      ? this.pokemonBaseRepository.getPokemonBaseById(evolution.evolveTo)
      : null;
  }
}
export default EvolutionRepository;
