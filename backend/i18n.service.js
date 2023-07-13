const fs = require("fs");
const path = require("path");

const i18nService = {
  checkAndSortLanguageFiles: function () {
    const dirPath = "../frontend/src/assets/i18n";
    try {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const obj = JSON.parse(fs.readFileSync(filePath, "utf8"));

        let sortedArray = Object.keys(obj)
          .sort()
          .map((key) => {
            return [key, obj[key]];
          });

        let newObj = {};
        for (let i = 0; i < sortedArray.length; i++) {
          newObj[sortedArray[i][0]] = sortedArray[i][1];
        }

        const newData = JSON.stringify(newObj, null, 2);
        fs.writeFileSync(filePath, newData, "utf8");
      });

      console.log("Language files have been successfully checked and sorted.");
    } catch (error) {
      console.error("An error occurred while checking language files: ", error);
    }
  },
};
module.exports = i18nService;
