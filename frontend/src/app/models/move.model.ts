export interface AnimationModel {
  opponent: string;
  player: string;
}
export interface MoveModel {
  name: string;
  type: string;
  category: string;
  accuracy: number;
  power?: number;
  effect?: string;
  _id?: string;
  animation: AnimationModel;
}
