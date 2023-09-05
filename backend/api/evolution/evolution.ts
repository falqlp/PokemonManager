import mongoose, { Document, Schema } from "mongoose";

interface IEvolution extends Document {
  evolutionMethod: string;
  minLevel?: number;
  pokemonId: number;
  evolveTo: number;
}

const evolutionSchema = new Schema<IEvolution>({
  evolutionMethod: {
    type: String,
    required: true,
  },
  minLevel: {
    type: Number,
  },
  pokemonId: {
    type: Number,
    required: true,
  },
  evolveTo: {
    type: Number,
    required: true,
  },
});

const Evolution = mongoose.model<IEvolution>("Evolution", evolutionSchema);
export default Evolution;
