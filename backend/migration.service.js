const axios = require("axios");
const Move = require("./models/move");
const PokemonBase = require("./models/PokemonModels/pokemonBase");
const MoveLearning = require("./models/moveLearning");

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
    let translations = {};
    PokemonBase.find().then((pokemons) => {
      let requests = pokemons.map((pokemon) => {
        return axios
          .get(
            `https://pokeapi.co/api/v2/pokemon-species/${parseInt(pokemon.id)}`
          )
          .then((response) => {
            pokemon.name = response.data.name.toUpperCase();
            let englishName = response.data.name.toUpperCase();
            let frenchName = response.data.names.find(
              (name) => name.language.name === "en"
            ).name;
            translations[englishName] = frenchName;
          });
      });

      Promise.all(requests).then(() => {
        console.log(translations);
      });
    });
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
          let learnMethod =
            move.version_group_details[move.version_group_details.length - 1]
              .move_learn_method.name;
          let levelLearnAt =
            move.version_group_details[move.version_group_details.length - 1]
              .level_learned_at;
          if (learnMethod === "level-up") {
            Move.findOne({ name: move.move.name.toUpperCase() }).then(
              (newMove) => {
                const dataToInsert = {
                  pokemonId: i,
                  moveId: newMove._id,
                  levelLearnAt,
                  learnMethod: learnMethod.toUpperCase(),
                };
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
                      console.log("The doc was new and upserted!", result);
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
};
module.exports = MigrationService;
