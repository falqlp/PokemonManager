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
} from 'shared/common/domain/ReadOnlyRepository';
import { MongoId } from 'shared/common/domain/MongoId';
import { IMapper } from 'shared/common/domain/IMapper';

@Controller()
export abstract class ReadOnlyGlobalController<T extends MongoId> {
  protected constructor(
    protected readonly service: ReadOnlyRepository<T>,
    protected readonly mapper: IMapper<T>,
  ) {}

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<T> {
    try {
      const obj = await this.service.get(id);
      return this.mapper.map(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch item ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put()
  async list(@Body() body: ListBody): Promise<T[]> {
    try {
      const obj = await this.service.list(body);
      return obj.map((value) => this.mapper.map(value));
    } catch (error) {
      throw new HttpException(
        'Failed to list items ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('query-table')
  async queryTable(
    @Body() body: ListBody,
    @Headers('lang') lang: string,
  ): Promise<TableResult<T>> {
    try {
      const obj = await this.service.queryTable(body, { lang });
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
