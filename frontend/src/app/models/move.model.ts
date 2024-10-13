export interface AnimationModel {
  opponent?: string;
  player?: string;
}

export enum SideEffect {
  DRAIN = 'Drain',
  RELOAD = 'Reload',
}

export type SideEffectModel = Record<SideEffect, number>;
export interface MoveModel {
  name: string;
  type: string;
  category: string;
  accuracy: number;
  power?: number;
  sideEffect?: SideEffectModel;
  _id?: string;
  animation: AnimationModel;
}
