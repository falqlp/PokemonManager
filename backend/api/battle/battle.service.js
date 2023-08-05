const Battle = require("./battle");
const trainerService = require("../trainer/trainer.service");

const BattleService = {
  get: async function (_id) {
    try {
      const battle = await Battle.findOne({ _id });
      battle.player = await trainerService.get(battle.player);
      battle.opponent = await trainerService.get(battle.opponent);
      return battle;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  list: async function (ids) {
    try {
      const battles = await Battle.find({ _id: { $in: ids } });
      return await Promise.all(
        battles.map(async (battle) => {
          battle.player = await trainerService.get(battle.player);
          battle.opponent = await trainerService.get(battle.opponent);
          return battle;
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  },

  update: async function (_id, battle) {
    try {
      return await Battle.updateOne(
        { _id },
        { ...battle, player: battle.player._id, opponent: battle.opponent._id }
      );
    } catch (error) {
      return Promise.reject(error);
    }
  },

  create: async function (battle) {
    try {
      const newBattle = new Battle({ ...battle });
      return await newBattle.save();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
module.exports = BattleService;
