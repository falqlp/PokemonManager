const axios = require("axios");
const Move = require("./api/move/move");
const PokemonBase = require("./api/pokemonBase/pokemonBase");
const MoveLearning = require("./api/moveLearning/moveLearning");
const Evolution = require("./api/evolution/evolution");
const { response } = require("express");
const fs = require("fs");
const path = require("path");

const MigrationService = {
  move: function () {
    for (let i = 0; i < 1000; i++) {
      axios
        .get("https://pokeapi.co/api/v2/move/" + (i + 1))
        .then((response) => {
          let name;
          response.data.names.forEach((element) => {
            if (element.language.name === "fr") {
              name = element.name;
            }
          });
          if (name === undefined) {
            response.data.names.forEach((element) => {
              if (element.language.name === "en") {
                name = element.name;
              }
            });
          }
          let moveData = {
            id: i + 1,
            name: response.data.name.toUpperCase(),
            type: response.data.type.name.toUpperCase(),
            category: response.data.damage_class.name,
            accuracy: response.data.accuracy,
            power: response.data.power,
          };

          Move.findOneAndUpdate({ name: moveData.name }, moveData, {
            upsert: true,
            new: true,
            runValidators: true,
          })
            .then((doc) => {
              console.log(moveData.id, " ok");
            })
            .catch((err) => {
              console.log("Something went wrong when updating the data!", err);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
  typeEnToFr: function (type) {
    switch (type) {
      case "normal":
        return "Normal";
      case "fire":
        return "Feu";
      case "water":
        return "Eau";
      case "electric":
        return "Électrik";
      case "grass":
        return "Plante";
      case "ice":
        return "Glace";
      case "fighting":
        return "Combat";
      case "poison":
        return "Poison";
      case "ground":
        return "Sol";
      case "flying":
        return "Vol";
      case "psychic":
        return "Psy";
      case "bug":
        return "Insecte";
      case "rock":
        return "Roche";
      case "ghost":
        return "Spectre";
      case "dragon":
        return "Dragon";
      case "dark":
        return "Ténèbres";
      case "steel":
        return "Acier";
      case "fairy":
        return "Fée";
      default:
        return type;
    }
  },
  typeFrToEn: function (type) {
    switch (type) {
      case "Normal":
        return "normal";
      case "Feu":
        return "fire";
      case "Eau":
        return "water";
      case "Électrik":
        return "electric";
      case "Plante":
        return "grass";
      case "Glace":
        return "ice";
      case "Combat":
        return "fighting";
      case "Poison":
        return "poison";
      case "Sol":
        return "ground";
      case "Vol":
        return "flying";
      case "Psy":
        return "psychic";
      case "Insecte":
        return "bug";
      case "Roche":
        return "rock";
      case "Spectre":
        return "ghost";
      case "Dragon":
        return "dragon";
      case "Ténèbres":
        return "dark";
      case "Acier":
        return "steel";
      case "Fée":
        return "fairy";
      default:
        return type;
    }
  },

  updatePokemonName: function () {
    for (let i = 600; i < 1011; i++) {
      setTimeout(
        () =>
          axios
            .get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
            .then((response) => {
              const specie = response.data;
              const key = specie.name.toUpperCase();
              const value = specie.names.find(
                (name) => name.language.name === "en"
              ).name;
              const newEntry = { [key]: value };

              const filePath = path.join(
                "../frontend/src/assets/i18n",
                "en.json"
              );
              fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                  console.error(
                    "Une erreur s'est produite lors de la lecture du fichier.",
                    err
                  );
                  return;
                }

                const jsonContent = JSON.parse(data);
                Object.assign(jsonContent, newEntry);

                fs.writeFile(
                  filePath,
                  JSON.stringify(jsonContent, null, 2),
                  "utf8",
                  (err) => {
                    if (err) {
                      console.error(
                        "Une erreur s'est produite lors de l'écriture dans le fichier.",
                        err
                      );
                    } else {
                      console.log("Mise à jour réussie.");
                    }
                  }
                );
              });
            })
            .catch((error) => {
              console.error("Erreur lors de la requête API:", error);
            }),
        200 * (i - 599)
      );
    }
  },
  updateTypeToEn: function () {
    PokemonBase.find().then((pokemons) => {
      pokemons.forEach((pokemon) => {
        const newTypes = [];
        pokemon.types.forEach((type) => {
          newTypes.push(this.typeFrToEn(type).toUpperCase());
        });
        pokemon.types = newTypes;
        pokemon.save().then(() => console.log(pokemon.name));
      });
    });
  },
  updateMoveTypeToEn: function () {
    Move.find().then((moves) => {
      moves.forEach((move) => {
        move.type = this.typeFrToEn(move.type).toUpperCase();
        move.save().then(() => console.log(move.name));
      });
    });
  },
  updateMoveName: function () {
    let translations = {};
    Move.find()
      .then((moves) => {
        let requests = moves.map((move) => {
          return axios
            .get(`https://pokeapi.co/api/v2/move/${move.id}`)
            .then((response) => {
              move.name = response.data.name.toUpperCase();
              let englishName = response.data.name.toUpperCase();

              let nameObj = response.data.names.find(
                (name) => name.language.name === "en"
              );
              if (!nameObj) {
                nameObj = response.data.names.find(
                  (name) => name.language.name === "en"
                );
              }
              let frenchName = nameObj.name;
              translations[englishName] = frenchName;
              // move.save().then(console.log(move.name));
            });
        });

        Promise.all(requests).then(() => {
          console.log(translations);
        });
      })
      .catch((error) => console.log(error));
  },

  getPokemonMoveLearning: function () {
    for (let i = 1; i < 1011; i++) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`).then((response) => {
        let moves = response.data.moves;
        moves.forEach((move) => {
          let levelLearnAt = 0;
          for (
            let index = 0;
            index < move.version_group_details.length;
            index++
          ) {
            let learnMethod =
              move.version_group_details[index].move_learn_method.name;
            if (learnMethod === "level-up") {
              levelLearnAt = move.version_group_details[index].level_learned_at;
            }
          }
          if (levelLearnAt !== 0) {
            Move.findOne({ name: move.move.name.toUpperCase() }).then(
              (newMove) => {
                const dataToInsert = newMove? {
                  pokemonId: i,
                  moveId: newMove._id,
                  levelLearnAt,
                  learnMethod: "LEVEL-UP",
                }: {};
                MoveLearning.findOneAndUpdate(
                  {
                    pokemonId: dataToInsert.pokemonId,
                    moveId: dataToInsert.moveId,
                    levelLearnAt: dataToInsert.levelLearnAt,
                    learnMethod: dataToInsert.learnMethod,
                  },
                  dataToInsert,
                  {
                    upsert: true,
                    new: true,
                    rawResult: true,
                  }
                )
                  .then((result) => {
                    if (result.lastErrorObject.upserted) {
                      console.log("The doc was new and upserted!");
                    }
                  })
                  .catch((error) => console.log(error));
              }
            );
          }
        });
      });
    }
  },
  getEvolution: function () {
    for (let i = 1; i < 538; i++) {
      axios
        .get(`https://pokeapi.co/api/v2/evolution-chain/${i}`)
        .then((response) => {
          const newChain = response.data.chain;
          // Utilisez une fonction auto-invoquée pour pouvoir utiliser async/await
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
                  };
                  Evolution.findOneAndUpdate(
                    { ...evolutionData },
                    evolutionData,
                    {
                      upsert: true,
                      new: true,
                      rawResult: true,
                    }
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
                      const evolutionData = {
                        evolutionMethod:
                          evolution2.evolution_details[0].trigger.name.toUpperCase(),
                        minLevel: evolution2.evolution_details[0].min_level,
                        pokemonId: pokemon2.id,
                        evolveTo: pokemon3.id,
                      };
                      Evolution.findOneAndUpdate(
                        { ...evolutionData },
                        evolutionData,
                        {
                          upsert: true,
                          new: true,
                          rawResult: true,
                        }
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
        .catch((error) => console.log("pb"));
    }
  },
  checkNullorFalse: function (obj) {
    if (obj) {
      return !Object.values(obj).some(
        (value) =>
          value !== null &&
          value !== false &&
          value !== "" &&
          value !== obj.min_level &&
          value !== obj.trigger
      );
    }
    return false;
  },
  getPokemonBase: function () {
    for (let i = 1; i < 1011; i++) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`).then((result) => {
        const pokemon = result.data;
        const types = [];
        const baseStats = {
          hp: pokemon.stats[0].base_stat,
          atk: pokemon.stats[1].base_stat,
          def: pokemon.stats[2].base_stat,
          spAtk: pokemon.stats[3].base_stat,
          spDef: pokemon.stats[4].base_stat,
          spe: pokemon.stats[5].base_stat,
        };
        pokemon.types.forEach((type) => {
          types.push(type.type.name.toUpperCase());
        });
        console.log(pokemon.id, pokemon.name.toUpperCase(), types, baseStats);
        PokemonBase.findOneAndUpdate(
          { id: pokemon.id },
          {
            id: pokemon.id,
            name: pokemon.name.toUpperCase(),
            types,
            baseStats,
          },
          {
            upsert: true,
            new: true,
            rawResult: true,
          }
        )
          .then((result) => {
            if (result.lastErrorObject.upserted) {
              console.log("The doc was new and upserted!");
            }
          })
          .catch((error) => console.log(error));
      });
    }
  },
};
module.exports = MigrationService;
