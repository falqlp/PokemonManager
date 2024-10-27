import Move, { IMove } from './Move';
import ReadOnlyRepository from '../ReadOnlyRepository';
import { Injectable } from '@nestjs/common';
import { EmptyPopulater } from '../EmptyPopulater';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
class MoveRepository extends ReadOnlyRepository<IMove> {
  constructor(
    movePopulater: EmptyPopulater,
    @InjectModel(Move.modelName)
    protected override readonly schema: Model<IMove>,
  ) {
    super(schema, movePopulater);
  }
}

export default MoveRepository;