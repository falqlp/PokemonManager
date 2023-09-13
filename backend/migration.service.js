const axios = require("axios");
import Move from "./api/move/move";
const PokemonBase = require("./api/pokemonBase/pokemonBase");
const MoveLearning = require("./api/moveLearning/moveLearning");
const Evolution = require("./api/evolution/evolution");
const { response } = require("express");
const fs = require("fs");
const path = require("path");
const { setTimeout } = require("timers");

const MigrationService = {
  updatePokemonInfo: function () {
    let progress = 0;
    for (let i = 1; i < 1011; i++) {
      setTimeout(() => {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
          .then((response) => {
            const specie = response.data;
            progress++;
            console.log(
              response.data.id,
              response.data.is_legendary,
              response.data.is_mythical,
              (progress * 100) / 1011
            );
          })
          .catch((error) => {
            console.error("Erreur lors de la requête API:", error);
          });
      }, i * 10);
    }
  },
  moveAnimation: function () {
    console.log(Move);
    Move.find({ power: { $ne: null } }).then((res) => {
      res.forEach((move) => {
        move.animation.opponent = move.type;
        const newMove = new Move(move);
        Move.findByIdAndUpdate(move._id, newMove).then(console.log);
      });
    });
  },
};
export default MigrationService;
