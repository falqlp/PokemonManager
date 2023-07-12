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
          console.log(
            i,
            name,
            this.typeEnToFr(response.data.type.name),
            response.data.damage_class.name,
            response.data.accuracy,
            response.data.power
          );
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
};
module.exports = MigrationService;
