import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import ReadOnlyRepository, {
  ListBody,
  TableResult,
} from '../domain/ReadOnlyRepository';
import { MongoId } from '../domain/MongoId';
import { IMapper } from '../domain/IMapper';

@Controller()
export abstract class ReadOnlyController<T extends MongoId> {
  protected constructor(
    protected readonly repository: ReadOnlyRepository<T>,
    protected readonly mapper: IMapper<T>,
  ) {}

  @Get(':id')
  public async getOne(
    @Param('id') id: string,
    @Headers('game-id') gameId: string,
  ): Promise<T> {
    try {
      const obj = await this.repository.get(id, { gameId });
      return this.mapper.map(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch item ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  public async list(
    @Body() body: ListBody,
    @Headers('game-id') gameId: string,
  ): Promise<T[]> {
    try {
      const obj = await this.repository.list(body, { gameId });
      return obj.map((value) => this.mapper.map(value));
    } catch (error) {
      throw new HttpException(
        'Failed to list items ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('query-table')
  public async queryTable(
    @Body() body: ListBody,
    @Headers('game-id') gameId: string,
    @Headers('lang') lang: string,
  ): Promise<TableResult<T>> {
    try {
      const obj = await this.repository.queryTable(body, { gameId, lang });
      obj.data = obj.data.map((value) => this.mapper.map(value));
      return obj;
    } catch (error) {
      throw new HttpException(
        'Failed to query table ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
