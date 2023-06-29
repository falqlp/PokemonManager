const PokemonService = {
  createPokemon: function (pokemon) {
    if (pokemon.exp === undefined) {
      pokemon.exp = 0;
    }
    if (pokemon.expMax === undefined) {
      pokemon.expMax = 100;
    }
    if (pokemon.iv === undefined) {
      pokemon.iv = this.generateIvs();
    }
    if (pokemon.ev === undefined) {
      pokemon.ev = this.initEvs();
    }
    pokemon.stats = this.updateStats(pokemon);
    return pokemon;
  },

  generateIvs: function () {
    return {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      spe: Math.floor(Math.random() * 32),
    };
  },

  initEvs: function () {
    return {
      hp: 0,
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      spe: 0,
    };
  },

  updateStats: function (pokemon) {
    return {
      hp: this.calcHp(
        pokemon.basePokemon.baseStats.hp,
        pokemon.level,
        pokemon.iv.hp,
        pokemon.ev.hp
      ),
      atk: this.calcStat(
        pokemon.basePokemon.baseStats.atk,
        pokemon.level,
        pokemon.iv.atk,
        pokemon.ev.atk
      ),
      def: this.calcStat(
        pokemon.basePokemon.baseStats.def,
        pokemon.level,
        pokemon.iv.def,
        pokemon.ev.def
      ),
      spAtk: this.calcStat(
        pokemon.basePokemon.baseStats.spAtk,
        pokemon.level,
        pokemon.iv.spAtk,
        pokemon.ev.spAtk
      ),
      spDef: this.calcStat(
        pokemon.basePokemon.baseStats.spDef,
        pokemon.level,
        pokemon.iv.spDef,
        pokemon.ev.spDef
      ),
      spe: this.calcStat(
        pokemon.basePokemon.baseStats.spe,
        pokemon.level,
        pokemon.iv.spe,
        pokemon.ev.spe
      ),
    };
  },

  calcStat: function (bs, niv, iv, ev) {
    return (
      Math.floor(
        ((2 * bs + (ev === 0 ? 0 : Math.floor(ev / 4)) + iv) * niv) / 100
      ) + 5
    );
  },

  calcHp: function (bs, niv, iv, ev) {
    return (
      Math.floor(
        ((2 * bs + (ev === 0 ? 0 : Math.floor(ev / 4)) + iv) * niv) / 100
      ) +
      niv +
      10
    );
  },
};

module.exports = PokemonService;
