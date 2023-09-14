import { AnimationModel } from './move.model';

export type Effectiveness =
  | 'IMMUNE'
  | 'NOT_VERY_EFFECTIVE'
  | 'EFFECTIVE'
  | 'SUPER_EFFECTIVE';

export interface DamageModel {
  damage: number;
  critical: boolean;
  effectivness: Effectiveness;
  missed: boolean;
  animation: AnimationModel;
}
