import MoveLearning, { IMoveLearning } from './MoveLearning';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';

@Injectable()
class MoveLearningRepository {
  constructor(
    @InjectModel(MoveLearning.modelName)
    protected readonly schema: Model<IMoveLearning>,
  ) {}

  public async getNewMoveLearned(pokemon: IPokemon): Promise<IMoveLearning[]> {
    return this.schema.find({
      pokemonId: pokemon.basePokemon.id,
      levelLearnAt: pokemon.maxLevel,
      learnMethod: 'LEVEL-UP',
    });
  }

  public getAllMoveAtLevel(
    id: number,
    level: number,
  ): Promise<IMoveLearning[]> {
    return this.schema.find({
      pokemonId: id,
      levelLearnAt: { $lte: level },
      learnMethod: 'LEVEL-UP',
    });
  }
}

export default MoveLearningRepository;
