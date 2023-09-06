import Battle from "./battle";

const battleMapper = require("./battle-instance.mapper");
const CompleteService = require("../CompleteService");

const BattleInstanceService = {
  ...new CompleteService(Battle, battleMapper),
};
module.exports = BattleInstanceService;
