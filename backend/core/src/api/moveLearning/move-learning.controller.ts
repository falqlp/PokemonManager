import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import MoveLearningService from '../../application/moveLearning/MoveLearningService';
import { ListBody } from 'shared/common/domain/ReadOnlyRepository';
import { IMove } from 'shared/models';

@Controller('move-learning')
export class MoveLearningController {
  constructor(private readonly moveLearningService: MoveLearningService) {}

  @Put('learnableMoves')
  public async learnableMoves(
    @Body('id') id: number,
    @Body('level') level: number,
    @Body('query') query: ListBody,
  ): Promise<IMove[]> {
    try {
      return await this.moveLearningService.learnableMoves(id, level, query);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve learnable moves: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
