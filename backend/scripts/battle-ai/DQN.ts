import * as tf from "@tensorflow/tfjs-node-gpu";
import { IBattleTrainer } from "../../api/battle/battle-interfaces";
import { LayersModel } from "@tensorflow/tfjs-node-gpu";

export class DQN {
  private model: LayersModel;
  private targetModel: LayersModel;
  public epsilon: number = 1;
  private epsilonMin: number = 0.001;
  private epsilonDecay: number = 0.995;
  private learningRate: number = 0.001;

  constructor(private readonly numActions: number) {
    this.model = this.createModel();
    this.targetModel = this.createModel();
    this.updateTargetModel();
  }

  private createModel(): LayersModel {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: 24,
        inputShape: [338],
        activation: "relu",
      })
    );
    model.add(tf.layers.dense({ units: 48, activation: "relu" }));
    model.add(tf.layers.dense({ units: 24, activation: "relu" }));
    model.add(tf.layers.dense({ units: 24, activation: "relu" }));
    model.add(
      tf.layers.dense({ units: this.numActions, activation: "linear" })
    );
    model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: "meanSquaredError",
    });
    return model;
  }

  public updateTargetModel() {
    this.targetModel.setWeights(this.model.getWeights());
  }

  public async trainModel(
    state: tf.Tensor,
    action: number,
    reward: number,
    nextState: tf.Tensor,
    done: boolean
  ) {
    let target = reward;
    if (!done) {
      const futureReward = tf
        .max(this.targetModel.predict(nextState) as tf.Tensor)
        .dataSync()[0];
      target += this.learningRate * futureReward;
    }

    const targetF = (this.model.predict(state) as tf.Tensor).dataSync();
    targetF[action] = target;

    await this.model.fit(state, tf.tensor([targetF]), {
      epochs: 1,
      verbose: 0,
    });
  }

  public selectAction(state: tf.Tensor, player: IBattleTrainer): number {
    const validActions = this.getValidActions(player);
    const validActionsIndices: number[] = [];
    validActions.forEach((isValid, index) => {
      if (isValid) validActionsIndices.push(index);
    });

    if (Math.random() < this.epsilon) {
      // Exploration: choisir une action valide aléatoirement
      const randomIndex = Math.floor(
        Math.random() * validActionsIndices.length
      );
      return validActionsIndices[randomIndex];
    } else {
      // Exploitation: choisir la meilleure action valide selon le modèle
      const qValues = this.model.predict(state) as tf.Tensor;
      const qValuesArray = qValues.dataSync();

      // Filtrer les qValues pour ne garder que ceux des actions valides
      const validQValues: number[] = validActionsIndices.map(
        (index) => qValuesArray[index]
      );
      const maxQValue = Math.max(...validQValues);
      const maxQValueIndex = validQValues.indexOf(maxQValue);

      return validActionsIndices[maxQValueIndex];
    }
  }

  getValidActions(player: IBattleTrainer): boolean[] {
    const doNothing = true;
    if (player.autorizations.updateCooldown !== 0) {
      return [doNothing, false, false, false, false, false, false, false];
    }
    const move = player.autorizations.moveCooldown === 0;
    const move1 = move && !!player.pokemons[0].moves[0];
    const move2 = move && !!player.pokemons[0].moves[1];
    const pokemon = player.autorizations.pokemonCooldown === 0;
    const pokemon1 = pokemon && !!player.pokemons[1];
    const pokemon2 = pokemon && !!player.pokemons[2];
    const pokemon3 = pokemon && !!player.pokemons[3];
    const pokemon4 = pokemon && !!player.pokemons[4];
    const pokemon5 = pokemon && !!player.pokemons[5];
    return [
      doNothing,
      move1,
      move2,
      pokemon1,
      pokemon2,
      pokemon3,
      pokemon4,
      pokemon5,
    ];
  }

  public decayEpsilon() {
    if (this.epsilon > this.epsilonMin) {
      this.epsilon *= this.epsilonDecay;
    }
  }
  public async saveModel() {
    await this.model.save(
      "file://C:/Users/falql/Desktop/Pokemon Manager/pokemon-manager/my-model"
    );
  }
  public async loadModel(modelPath: string) {
    this.model = await tf.loadLayersModel(modelPath);
    this.model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: "meanSquaredError",
    });
    this.updateTargetModel(); // Mettez à jour le modèle cible si nécessaire
  }
}
