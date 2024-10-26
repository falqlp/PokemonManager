import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import NurseryService from '../../application/trainer/nursery/NurseryService';
import NurseryRepository from '../../domain/trainer/nursery/NurseryRepository';
import NurseryMapper from './NurseryMapper';
import { ReadOnlyController } from '../read-only.controller';
import { INursery } from '../../domain/trainer/nursery/Nursery';

@Controller('nursery')
export class NurseryController extends ReadOnlyController<INursery> {
  constructor(
    protected readonly service: NurseryRepository,
    protected readonly mapper: NurseryMapper,
    private readonly nurseryService: NurseryService,
  ) {
    super(service, mapper);
  }

  @Post('set-nursery-wishlist')
  async setNurseryWishlist(
    @Body('nurseryId') nurseryId: string,
    @Body('wishlist') wishlist: any,
    @Body('trainerId') trainerId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.nurseryService.setNurseryWishlist(
        nurseryId,
        wishlist,
        gameId,
        trainerId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to set nursery wishlist: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('save-nursery-wishlist')
  async saveNurseryWishlist(
    @Body('nurseryId') nurseryId: string,
    @Body('wishlist') wishlist: any,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.nurseryService.saveNurseryWishlist(
        nurseryId,
        wishlist,
        gameId,
      );
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to save nursery wishlist: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
