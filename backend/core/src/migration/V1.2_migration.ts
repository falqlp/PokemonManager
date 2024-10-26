import { container } from "tsyringe";
import MoveRepository from "../domain/move/MoveRepository";
import axios from "axios";
import Move from "../domain/move/Move";

export default async function updateMove(): Promise<void> {
  const moves = await container.resolve(MoveRepository).list({});
  for (const move of moves) {
    axios
      .get("https://pokeapi.co/api/v2/move/" + move.name.toLowerCase())
      .then((response) => {
        const sideEffect: Record<string, number> = {};
        if (response.data.meta?.drain) {
          sideEffect.Drain = response.data.meta.drain;
        }
        if (response.data.effect_entries[0]?.effect.includes('"recharge"')) {
          sideEffect.Reload = 1;
        }
        if (Object.keys(sideEffect).length > 0) {
          Move.findOneAndUpdate(
            { name: response.data.name.toUpperCase() },
            { $set: { sideEffect } },
          ).then();
        }
      });
  }
}
