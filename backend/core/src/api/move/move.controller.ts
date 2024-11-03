import { Controller } from '@nestjs/common';
import MoveRepository from '../../domain/move/MoveRepository';
import MoveMapper from './MoveMapper';
import { ReadOnlyGlobalController } from '../read-only-global.controller';
import { IMove } from 'shared/models/move/mode-model';

@Controller('move')
export class MoveController extends ReadOnlyGlobalController<IMove> {
  constructor(protected readonly service: MoveRepository) {
    super(service, MoveMapper);
  }
}
