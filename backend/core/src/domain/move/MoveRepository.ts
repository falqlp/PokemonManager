import Move from './Move';
import ReadOnlyRepository from 'shared/common/domain/ReadOnlyRepository';
import { Injectable } from '@nestjs/common';
import { EmptyPopulater } from 'shared/common/domain/EmptyPopulater';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMove } from 'shared/models/move/mode-model';

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
