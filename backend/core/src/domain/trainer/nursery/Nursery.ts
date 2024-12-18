import mongoose, { Schema } from 'mongoose';
import { MongoId } from 'shared/common/domain/MongoId';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';

export interface IWishList {
  typeRepartition: {
    bug: number;
    dark: number;
    dragon: number;
    electric: number;
    fairy: number;
    fighting: number;
    fire: number;
    flying: number;
    ghost: number;
    grass: number;
    ground: number;
    ice: number;
    normal: number;
    poison: number;
    psy: number;
    rock: number;
    steel: number;
    water: number;
  };
  quantity: number;
}

const TypeRepartitionSchema = new Schema({
  bug: Number,
  dark: Number,
  dragon: Number,
  electric: Number,
  fairy: Number,
  fighting: Number,
  fire: Number,
  flying: Number,
  ghost: Number,
  grass: Number,
  ground: Number,
  ice: Number,
  normal: Number,
  poison: Number,
  psy: Number,
  rock: Number,
  steel: Number,
  water: Number,
});

export type NurserySteps = 'WISHLIST' | 'FIRST_SELECTION' | 'LAST_SELECTION';

export interface INursery extends MongoId {
  gameId: string;
  level: number;
  wishList?: IWishList;
  eggs?: IPokemon[];
  step: NurserySteps;
}

const WishListSchema = new Schema({
  typeRepartition: {
    type: TypeRepartitionSchema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const NurserySchema = new Schema<INursery>({
  gameId: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  wishList: WishListSchema,
  eggs: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }],
  step: String,
});

const Nursery = mongoose.model<INursery>('Nursery', NurserySchema);
export default Nursery;
