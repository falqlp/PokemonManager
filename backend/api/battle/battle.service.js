const Battle = require("./battle");
const battleMapper = require("./battle.mapper");
const CompleteService = require("../CompleteService");

const BattleService = {
  ...new CompleteService(Battle, battleMapper),
};
module.exports = BattleService;
