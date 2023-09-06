import trainerService from "../trainer/trainer.service";
import { IBattleInstance } from "./battle";

const BattleInstanceMapper = {
  map: async function (battle: IBattleInstance): Promise<IBattleInstance> {
    battle.player = await trainerService.get(battle.player);
    battle.opponent = await trainerService.get(battle.opponent);
    return battle;
  },

  update: function (battle: IBattleInstance): IBattleInstance {
    battle.player = battle.player._id;
    battle.opponent = battle.opponent._id;
    return battle;
  },
};

export default BattleInstanceMapper;
