import * as fs from "fs";
import * as path from "path";
import { MongoClient } from "mongodb";

interface Translation {
  [key: string]: string;
}

const i18nService = {
  checkAndSortLanguageFiles: (): void => {
    const dirPath: string = "../frontend/src/assets/i18n";
    try {
      const files: string[] = fs.readdirSync(dirPath);

      files.forEach((file: string) => {
        const filePath: string = path.join(dirPath, file);
        const fileContent: string = fs.readFileSync(filePath, "utf8");
        const obj: Translation = JSON.parse(fileContent);

        const sortedArray: [string, string][] = Object.keys(obj)
          .sort()
          .map((key: string) => {
            return [key, obj[key]];
          });

        const newObj: Translation = {};
        for (let i = 0; i < sortedArray.length; i++) {
          newObj[sortedArray[i][0]] = sortedArray[i][1];
        }

        const newData: string = JSON.stringify(newObj, null, 2) + "\n";
        fs.writeFileSync(filePath, newData, "utf8");
      });

      console.log("Language files have been successfully checked and sorted.");
    } catch (error: any) {
      console.error("An error occurred while checking language files: ", error);
    }
  },
  translationsToDatabase: () => {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(
        "mongodb://127.0.0.1:27017/PokemonManager"
      );

      const jsonFilePathEn = path.join(
        __dirname,
        "../../frontend/src/assets/i18n/en-EN.json"
      );
      const jsonFilePathFr = path.join(
        __dirname,
        "../../frontend/src/assets/i18n/fr-FR.json"
      );

      const readJsonFile = (path: string) => {
        return new Promise((resolve, reject) => {
          fs.readFile(path, "utf8", (err, data) => {
            if (err) {
              reject("Error reading JSON file:" + err);
              return;
            }
            resolve(JSON.parse(data));
          });
        });
      };

      client
        .connect()
        .then(async (client) => {
          const Db = client.db("PokemonManager");
          const collection = Db.collection("translations");

          try {
            const [translationsEn, translationsFr]: Record<string, any>[] =
              await Promise.all([
                readJsonFile(jsonFilePathEn),
                readJsonFile(jsonFilePathFr),
              ]);

            const updatePromises = Object.keys(translationsEn).map((key) => {
              const updateDoc = {
                $set: {
                  en: translationsEn[key],
                  fr: translationsFr[key],
                },
              };
              return collection.updateOne({ key }, updateDoc, { upsert: true });
            });

            await Promise.all(updatePromises);
            console.log("Translation documents successfully updated");
            resolve("Translation documents successfully updated");
          } catch (e) {
            reject("Error updating translation documents:" + e);
          } finally {
            await client.close();
          }
        })
        .catch(reject);
    });
  },
};

i18nService.checkAndSortLanguageFiles();
i18nService.translationsToDatabase().then();
