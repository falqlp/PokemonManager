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
export type SideEffectDescLambda = (value: number) => string;
export const SIDE_EFFECT_DESC: Record<SideEffect, SideEffectDescLambda> = {
  [SideEffect.DRAIN]: (value: number): string => {
    return value > 0 ? 'DRAIN_DESC' : 'BACKLASH_DESC';
  },
  [SideEffect.RELOAD]: (): string => {
    return 'RELOAD_DESC';
  },
};
