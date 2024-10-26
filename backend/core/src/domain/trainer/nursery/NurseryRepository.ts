import CompleteRepository from '../../CompleteRepository';
import Nursery, { INursery } from './Nursery';
import { Injectable } from '@nestjs/common';
import NurseryPopulater from './NurseryPopulater';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
class NurseryRepository extends CompleteRepository<INursery> {
  constructor(
    nurseryPopulater: NurseryPopulater,
    @InjectModel(Nursery.modelName)
    protected override readonly schema: Model<INursery>,
  ) {
    super(schema, nurseryPopulater);
  }

  public async create(dto: INursery): Promise<INursery> {
    if (!dto.step) {
      dto.step = 'WISHLIST';
    }
    if (!dto.level) {
      dto.level = 1;
    }
    return super.create(dto);
  }
}

export default NurseryRepository;
