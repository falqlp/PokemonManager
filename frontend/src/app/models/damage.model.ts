export interface DamageModel {
  damage: number;
  critical: boolean;
  effectivness: Effectiveness;
}

export type Effectiveness =
  | 'Immune'
  | 'Not very effective'
  | 'Effective'
  | 'Super effective';
