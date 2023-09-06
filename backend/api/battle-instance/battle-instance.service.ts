import Battle from "./battle";
import battleMapper from "./battle-instance.mapper";
import CompleteService from "../CompleteService";

const BattleInstanceService = {
  ...new CompleteService(Battle, battleMapper),
};

export default BattleInstanceService;
