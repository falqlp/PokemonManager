const axios = require("axios");
const Move = require("./api/move/move");
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
    Move.updateMany(
      { power: { $ne: null } },
      {
        $set: {
          "animation.opponent": "$type", // Ici "$type" est une variable représentant le type de l'attaque. Remplacez-la par la manière dont vous stockez ce type dans vos documents.
        },
      },
      function (err, res) {
        if (err) throw err;
        console.log(res.result.nModified + " document(s) updated");
      }
    );
  },
};
module.exports = MigrationService;
