import { IBattleTrainer } from "../../api/battle/BattleInterfaces";

export function aiReward(
  player: IBattleTrainer,
  opponent: IBattleTrainer
): number {
  let reward = 0;
  // switch (opponent.damage?.effectiveness) {
  //   case "EFFECTIVE":
  //     break;
  //   case "IMMUNE":
  //     reward -= 0.05;
  //     break;
  //   case "NOT_VERY_EFFECTIVE":
  //     reward -= 0.01;
  //     break;
  //   case "SUPER_EFFECTIVE":
  //     reward += 0.02;
  //     break;
  //   default:
  //     break;
  // }
  // if (!player.damage) {
  //   reward += 0.05;
  // } else {
  //   switch (player.damage.effectiveness) {
  //     case "EFFECTIVE":
  //       break;
  //     case "IMMUNE":
  //       reward += 0.05;
  //       break;
  //     case "NOT_VERY_EFFECTIVE":
  //       reward += 0.01;
  //       break;
  //     case "SUPER_EFFECTIVE":
  //       reward -= 0.02;
  //       break;
  //     default:
  //       break;
  //   }
  // }
  if (opponent.damage) {
    reward += (opponent.damage.damage / opponent.pokemons[0].stats.hp) * 0.1;
  }
  //
  // if (player.damage) {
  //   reward -= (player.damage.damage / player.pokemons[0].stats.hp) * 0.1;
  // }

  if (opponent.onKo) {
    reward += 1;
  }
  if (opponent.defeat) {
    reward += 10;
  }
  return reward;
}
