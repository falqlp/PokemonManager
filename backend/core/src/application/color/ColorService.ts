import { Injectable } from '@nestjs/common';
import { getRandomFromArray } from 'shared/utils/RandomUtils';

export const TRAINER_COLORS = [
  '#dd6b66',
  '#759aa0',
  '#e69d87',
  '#8dc1a9',
  '#ea7e53',
  '#eedd78',
  '#73a373',
  '#73b9bc',
  '#7289ab',
  '#91ca8c',
  '#f49f42',
  '#37A2DA',
  '#32C5E9',
  '#67E0E3',
  '#9FE6B8',
  '#FFDB5C',
  '#ff9f7f',
  '#fb7293',
  '#E062AE',
  '#E690D1',
  '#e7bcf3',
  '#9d96f5',
  '#8378EA',
  '#96BFFF',
];

@Injectable()
export default class ColorService {
  public getColorForTrainer(id: string): string {
    return getRandomFromArray(TRAINER_COLORS, id);
  }
}
