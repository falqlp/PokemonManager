const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

const client = new MongoClient("mongodb://127.0.0.1:27017/PokemonManager");
const jsonFilePathEn =
  "C:/Users/falql/Desktop/Pokemon Manager/pokemon-manager/frontend/src/assets/i18n/en.json";
const jsonFilePathFr =
  "C:/Users/falql/Desktop/Pokemon Manager/pokemon-manager/frontend/src/assets/i18n/fr.json";

// Fonction pour lire un fichier JSON et retourner son contenu
const readJsonFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject("Error reading JSON file:", err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

client.connect().then(async (client) => {
  console.log("Connected successfully to MongoDB");
  const Db = client.db("PokemonManager");
  const collection = Db.collection("translations");

  try {
    const [translationsEn, translationsFr] = await Promise.all([
      readJsonFile(jsonFilePathEn),
      readJsonFile(jsonFilePathFr),
    ]);

    const updatePromises = Object.keys(translationsEn).map((key) => {
      const updateDoc = {
        $set: {
          en: translationsEn[key],
          fr: translationsFr[key], // Assurez-vous que la clé existe aussi dans le fichier FR
        },
      };
      return collection.updateOne({ key: key }, updateDoc, { upsert: true });
    });

    const results = await Promise.all(updatePromises);
    results.forEach((result, index) => {
      if (result.matchedCount === 0) {
        console.log(`Inserted new key: ${Object.keys(translationsEn)[index]}`);
      } else {
        console.log(
          `Updated existing key: ${Object.keys(translationsEn)[index]}`
        );
      }
    });
  } catch (e) {
    console.error("Error updating documents:", e);
  } finally {
    // Fermez la connexion
    await client.close();
    console.log("Disconnected from MongoDB");
  }
});
