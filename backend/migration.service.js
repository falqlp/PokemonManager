import PokemonBase from "./domain/pokemonBase/PokemonBase";

const axios = require("axios");
import Move from "./domain/move/Move";
import Evolution from "./domain/evolution/Evolution";
const MoveLearning = require("./domain/moveLearning/MoveLearning");
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
            const legendary = specie.is_legendary
              ? specie.is_legendary
              : undefined;
            const mythical = specie.is_mythical
              ? specie.is_mythical
              : undefined;
            const baby = specie.is_baby ? specie.is_baby : undefined;
            const genderRate =
              specie.gender_rate !== -1 ? specie.gender_rate * 8 : undefined;
            // console.log(
            //   specie.name,
            //   specie.is_legendary,
            //   specie.is_mythical,
            //   specie.is_baby,
            //   specie.gender_rate,
            //   specie.capture_rate,
            //   (progress * 100) / 1010
            // );
            PokemonBase.updateOne(
              { id: specie.id },
              {
                $set: {
                  legendary,
                  mythical,
                  baby,
                  genderRate,
                  captureRate: specie.capture_rate,
                  baseHappiness: specie.base_happiness,
                  base: specie.evolves_from_species === null,
                },
              },
            ).then(console.log);
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
  getEvolution: function () {
    for (let i = 1; i < 538; i++) {
      axios
        .get(`https://pokeapi.co/api/v2/evolution-chain/${i}`)
        .then((response) => {
          const newChain = response.data.chain;
          (async () => {
            for (const evolution of newChain.evolves_to) {
              if (
                this.checkNullorFalse(evolution.evolution_details[0]) &&
                evolution.evolution_details[0].trigger.name === "level-up"
              ) {
                try {
                  const pokemon = await PokemonBase.findOne({
                    name: newChain.species.name.toUpperCase(),
                  });

                  const pokemon2 = await PokemonBase.findOne({
                    name: evolution.species.name.toUpperCase(),
                  });

                  // console.log(
                  //   pokemon.id,
                  //   pokemon2.id,
                  //   evolution.evolution_details[0].min_level,
                  //   evolution.evolution_details[0].trigger.name.toUpperCase()
                  // );
                  const evolutionData = {
                    evolutionMethod:
                      evolution.evolution_details[0].trigger.name.toUpperCase(),
                    minLevel: evolution.evolution_details[0].min_level,
                    pokemonId: pokemon.id,
                    evolveTo: pokemon2.id,
                    minHappiness: evolution.evolution_details[0].min_happiness,
                  };
                  Evolution.findOneAndUpdate(
                    { ...evolutionData },
                    evolutionData,
                    {
                      upsert: true,
                      new: true,
                      rawResult: true,
                    },
                  )
                    .then((result) => {
                      if (result.lastErrorObject.upserted) {
                        console.log("The doc was new and upserted!");
                      }
                    })
                    .catch((error) => console.log(error));

                  for (const evolution2 of evolution.evolves_to) {
                    if (
                      this.checkNullorFalse(evolution2.evolution_details[0]) &&
                      evolution2.evolution_details[0].trigger.name ===
                        "level-up"
                    ) {
                      const pokemon3 = await PokemonBase.findOne({
                        name: evolution2.species.name.toUpperCase(),
                      });

                      // console.log(
                      //   pokemon2.id,
                      //   pokemon3.id,
                      //   evolution2.evolution_details[0].min_level,
                      //   evolution2.evolution_details[0].trigger.name.toUpperCase()
                      // );
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      const evolutionData = {
                        evolutionMethod:
                          evolution2.evolution_details[0].trigger.name.toUpperCase(),
                        minLevel: evolution2.evolution_details[0].min_level,
                        pokemonId: pokemon2.id,
                        evolveTo: pokemon3.id,
                        minHappiness:
                          evolution2.evolution_details[0].min_happiness,
                      };
                      Evolution.findOneAndUpdate(
                        { ...evolutionData },
                        evolutionData,
                        {
                          upsert: true,
                          new: true,
                          rawResult: true,
                        },
                      )
                        .then((result) => {
                          if (result.lastErrorObject.upserted) {
                            console.log("The doc was new and upserted!");
                          }
                        })
                        .catch((error) => console.log(error));
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            }
          })();
        })
        .catch((error) => console.log(error));
    }
  },
  checkNullorFalse: function (obj) {
    if (obj) {
      return !Object.values(obj).some(
        (value) =>
          value !== null &&
          value !== false &&
          value !== "" &&
          value !== obj.min_happiness &&
          value !== obj.min_level &&
          value !== obj.trigger,
      );
    }
    return false;
  },
};
export default MigrationService;
