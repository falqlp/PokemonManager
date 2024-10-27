import PcStorage, { IPcStorage } from './PcStorage';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import PcStoragePopulater from './PcStoragePopulater';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
class PcStorageRepository extends CompleteRepository<IPcStorage> {
  constructor(
    pcStoragePopulater: PcStoragePopulater,
    @InjectModel(PcStorage.modelName)
    protected override readonly schema: Model<IPcStorage>,
  ) {
    super(schema, pcStoragePopulater);
  }

  public async create(dto: IPcStorage): Promise<IPcStorage> {
    if (!dto.storage) {
      dto.storage = [];
    }
    if (!dto.maxSize) {
      dto.maxSize = 0;
    }
    return super.create(dto);
  }
}

export default PcStorageRepository;
