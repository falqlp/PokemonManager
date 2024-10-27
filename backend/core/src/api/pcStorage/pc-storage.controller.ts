import { Controller } from '@nestjs/common';
import PcStorageService from '../../domain/trainer/pcStorage/PcStorageRepository';
import PcStorageMapper from './PcStorageMapper';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { IPcStorage } from '../../domain/trainer/pcStorage/PcStorage';

@Controller('pc-storage')
export class PcStorageController extends ReadOnlyController<IPcStorage> {
  constructor(
    protected readonly service: PcStorageService,
    protected readonly mapper: PcStorageMapper,
  ) {
    super(service, mapper);
  }
}
