const BattleService = {
  getCooldownMs(pokemon) {
    return 6 + 200 / Math.sqrt(pokemon.stats["spe"]);
  },
};
module.exports = BattleService;
