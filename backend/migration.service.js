const axios = require("axios");
const Attack = require("./models/attack");
const PokemonBase = require("./models/PokemonModels/pokemonBase");

const MigrationService = {
  attack: function () {
    for (let i = 1000; i < 1000; i++) {
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
          let attackData = {
            id: i,
            name: name,
            type: typeEnToFr(response.data.type.name),
            category: response.data.damage_class.name,
            accuracy: response.data.accuracy,
            power: response.data.power,
          };

          Attack.findOneAndUpdate({ name: attackData.name }, attackData, {
            upsert: true,
            new: true,
            runValidators: true,
          })
            .then((doc) => {
              console.log(doc);
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
  updateAttackTypeToEn: function () {
    Attack.find().then((attacks) => {
      attacks.forEach((attack) => {
        attack.type = this.typeFrToEn(attack.type).toUpperCase();
        attack.save().then(() => console.log(attack.name));
      });
    });
  },
  updateAttackName: function () {
    let translations = {};
    Attack.find()
      .then((attacks) => {
        let requests = attacks.map((attack) => {
          return axios
            .get(`https://pokeapi.co/api/v2/move/${attack.id + 1}`)
            .then((response) => {
              attack.name = response.data.name.toUpperCase();
              let englishName = response.data.name.toUpperCase();

              let nameObj = response.data.names.find(
                (name) => name.language.name === "fr"
              );
              if (!nameObj) {
                nameObj = response.data.names.find(
                  (name) => name.language.name === "en"
                );
              }
              let frenchName = nameObj.name;
              translations[englishName] = frenchName;
              attack.save().then(console.log(attack.name));
            });
        });

        Promise.all(requests).then(() => {
          console.log(translations);
        });
      })
      .catch((error) => console.log(error));
  },
};
module.exports = MigrationService;
