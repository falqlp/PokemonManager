import * as tf from "@tensorflow/tfjs-node-gpu";
import { DQN } from "./DQN";
import { Environement } from "./environement";
import TrainerService from "../backend/api/trainer/TrainerService";
import { ITrainer } from "../backend/api/trainer/Trainer";
import { IBattleTrainer } from "../backend/application/battle/BattleInterfaces";
import { prepareEnvironmentState } from "./prepare-state";
import mongoose from "mongoose";

const mongoURI = "mongodb://127.0.0.1:27017/PokemonManager";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection error to MongoDB", error);
  });

(async () => {
  const numActions = 8;
  const agent = new DQN(numActions);
  await agent.loadModel(
    "file://C:/Users/falql/Desktop/Pokemon Manager/pokemon-manager/my-model/model.json"
  );
  let sumHp = 0;
  let sumReward = 0;
  let sumWin = 0;
  for (let episode = 0; episode < 1000; episode++) {
    const player = mapBattleTrainer(
      await TrainerService.getInstance().get("65c68ee02717e3796f502f44")
    );
    const opponent = mapBattleTrainer(
      await TrainerService.getInstance().get("65c68f1c7a3d1f9b3b7e0514")
    );
    player.pokemons.map((p) => {
      p.currentHp = p.stats.hp;
      return p;
    });
    opponent.pokemons.map((p) => {
      p.currentHp = p.stats.hp;
      return p;
    });
    player.isAI = true;
    let environment = new Environement(player, opponent);
    const preparedState = prepareEnvironmentState(
      environment.player,
      environment.opponent
    );
    let state = tf.tensor2d([preparedState], [1, preparedState.length]);
    let endBattle = false;
    let rounds = 0;
    while (!endBattle) {
      rounds++;
      const action = agent.selectAction(state, player);
      const { nextState, reward, done } = environment.step(action);
      await agent.trainModel(state, action, reward, nextState, done);
      state = nextState;
      endBattle = done;
      sumReward += reward;
      if (rounds > 2000) {
        console.log("skip");
        break;
      }
      if (done) {
        sumHp +=
          environment.opponent.pokemons[0].currentHp +
          environment.opponent.pokemons[1].currentHp +
          environment.opponent.pokemons[2].currentHp;
        agent.decayEpsilon();
        // console.log(rounds);
        if (environment.opponent.defeat) {
          console.log("Victoire");
          sumWin++;
        }
        if (episode % 10 === 0) {
          console.log(
            episode,
            sumHp / 10,
            sumReward / 10,
            agent.epsilon,
            sumWin
          );
          sumHp = 0;
          sumReward = 0;
          sumWin = 0;
        }
      }
    }
  }
  agent.saveModel().then(() => console.log("saved"));
})();

function mapBattleTrainer(trainer: ITrainer): IBattleTrainer {
  return {
    _id: trainer._id,
    name: trainer.name,
    pokemons: trainer.pokemons,
    selectedMove: undefined,
    damage: undefined,
    decision: undefined,
    updateDecision: true,
    autorizations: {
      pokemonCooldown: 0,
      moveCooldown: 0,
      updateCooldown: 0,
    },
    defeat: false,
    onKo: false,
  } as IBattleTrainer;
}
