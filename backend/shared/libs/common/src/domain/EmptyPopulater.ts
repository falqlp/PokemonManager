import Populater from './Populater';
import { PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmptyPopulater extends Populater<unknown> {
  public readonly schema: undefined;
  public populate(): PopulateOptions | PopulateOptions[] {
    return '' as unknown as PopulateOptions;
  }
}
