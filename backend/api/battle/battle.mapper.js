const trainerService = require("../trainer/trainer.service");

const BattleMapper = {
  map: async function (battle) {
    battle.player = await trainerService.get(battle.player);
    battle.opponent = await trainerService.get(battle.opponent);
    return battle;
  },

  update: function (battle) {
    battle.player = battle.player._id;
    battle.opponent = battle.opponent._id;
    return battle;
  },
};
module.exports = BattleMapper;
