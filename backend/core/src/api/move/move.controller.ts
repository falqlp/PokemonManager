import { Controller } from '@nestjs/common';
import MoveRepository from '../../domain/move/MoveRepository';
import MoveMapper from './MoveMapper';
import { ReadOnlyGlobalController } from '../read-only-global.controller';
import { IMove } from '../../domain/move/Move';

@Controller('move')
export class MoveController extends ReadOnlyGlobalController<IMove> {
  constructor(protected readonly service: MoveRepository) {
    super(service, MoveMapper);
  }
}
