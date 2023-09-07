import * as fs from "fs";
import * as path from "path";

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

        const newData: string = JSON.stringify(newObj, null, 2);
        fs.writeFileSync(filePath, newData, "utf8");
      });

      console.log("Language files have been successfully checked and sorted.");
    } catch (error: any) {
      console.error("An error occurred while checking language files: ", error);
    }
  },
};

export default i18nService;
