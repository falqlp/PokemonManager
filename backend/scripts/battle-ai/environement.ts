import * as tf from "@tensorflow/tfjs-node-gpu";
import { IBattleTrainer } from "../../api/battle/BattleInterfaces";
import { aiReward } from "./ai-reward";
import BattleService from "../../api/battle/BattleService";
import { prepareEnvironmentState } from "./prepare-state";
export class Environement {
  constructor(public player: IBattleTrainer, public opponent: IBattleTrainer) {}
  step(action: number): { nextState: any; reward: number; done: boolean } {
    this.action(action);
    const { trainer1, trainer2 } = BattleService.simulateBattleRound(
      this.player,
      this.opponent
    );
    this.player = trainer1;
    this.opponent = trainer2;
    const preparedState = prepareEnvironmentState(this.player, this.opponent);
    let nextState = tf.tensor2d([preparedState], [1, preparedState.length]);
    let reward = aiReward(this.player, this.opponent);
    let done = this.player.defeat || this.opponent.defeat;
    return { nextState, reward, done };
  }

  action(action: number): void {
    const decision = this.player.decision ?? {
      move: this.player.pokemons[0].moves[0],
      pokemon: this.player.pokemons[0],
    };
    switch (action) {
      case 0:
        break;
      case 1:
        decision.move = this.player.pokemons[0].moves[0];
        break;
      case 2:
        decision.move = this.player.pokemons[0].moves[1];
        break;
      case 3:
        // console.log("pokemon 1", this.player.pokemons[1].currentHp);
        decision.pokemon = this.player.pokemons[1];
        break;
      case 4:
        // console.log("pokemon 2", this.player.pokemons[2].currentHp);

        decision.pokemon = this.player.pokemons[2];
        break;
      case 5:
        decision.pokemon = this.player.pokemons[3];
        // console.log("pokemon 3", this.player.pokemons[3].currentHp);

        break;
      case 6:
        decision.pokemon = this.player.pokemons[4];
        // console.log("pokemon 4", this.player.pokemons[4].currentHp);

        break;
      case 7:
        // console.log("pokemon 5", this.player.pokemons[5].currentHp);

        decision.pokemon = this.player.pokemons[5];
        break;
    }
    // console.log("decision", decision.pokemon.currentHp);
    this.player.decision = decision;
  }
}
