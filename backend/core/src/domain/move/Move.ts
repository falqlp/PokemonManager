import mongoose, { Schema } from 'mongoose';
import { IMove, ISideEffect, SideEffect } from 'shared/models/move/mode-model';

const sideEffectSchema = new Schema<ISideEffect>(
  {
    [SideEffect.DRAIN]: { type: Number },
    [SideEffect.RELOAD]: { type: Number },
  },
  { _id: false },
);

const moveSchema = new Schema<IMove>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
  },
  sideEffect: sideEffectSchema,
  animation: { opponent: { type: String }, player: { type: String } },
});

const Move = mongoose.model<IMove>('Move', moveSchema);
export default Move;
