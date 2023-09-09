import fs from "fs";
import path from "path";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateApi(objectName: string, isReadOnly: boolean): void {
  const capObjectName = capitalizeFirstLetter(objectName);
  const readOnlyStr = isReadOnly ? "Readonly" : "Complete";

  const currentDir = process.cwd();

  if (!fs.existsSync(`${currentDir}/${objectName}`)) {
    fs.mkdirSync(`${currentDir}/${objectName}`);
  }

  const modelContent = `
import mongoose, { Document, Schema } from "mongoose";

export interface I${capObjectName} extends Document {}

const ${objectName}Schema = new Schema<I${capObjectName}>({});

const ${capObjectName} = mongoose.model<I${capObjectName}>("${capObjectName}", ${objectName}Schema);
export default ${capObjectName};
`;

  const mapperContent = `
import { IMapper } from "../IMapper";
import { I${capObjectName} } from "./${objectName}";

class ${capObjectName}Mapper implements IMapper<I${capObjectName}> {
  private static instance: ${capObjectName}Mapper;
  constructor() {}
  public async map(dto: I${capObjectName}): Promise<I${capObjectName}> {
    return dto;
  }

  public update(dto: I${capObjectName}): I${capObjectName} {
    return dto;
  }

  public static getInstance(): ${capObjectName}Mapper {
    if (!${capObjectName}Mapper.instance) {
      ${capObjectName}Mapper.instance = new ${capObjectName}Mapper();
    }
    return ${capObjectName}Mapper.instance;
  }
}

export default ${capObjectName}Mapper;
`;

  const serviceContent = `
import ${readOnlyStr}Service from "../${readOnlyStr}Service";
import ${capObjectName}, { I${capObjectName} } from "./${objectName}";
import ${capObjectName}Mapper from "./${objectName}.mapper";

class ${capObjectName}Service extends ${readOnlyStr}Service<I${capObjectName}> {
  private static instance: ${capObjectName}Service;
  public static getInstance(): ${capObjectName}Service {
    if (!${capObjectName}Service.instance) {
      ${capObjectName}Service.instance = new ${capObjectName}Service(
        ${capObjectName},
        ${capObjectName}Mapper.getInstance()
      );
    }
    return ${capObjectName}Service.instance;
  }
}

export default ${capObjectName}Service;
`;

  const routesContent = `
import express from "express";
import ${readOnlyStr}Router from "../${readOnlyStr}Router";
import ${capObjectName}Service from "./${objectName}.service";

const router = express.Router();
const completeRouter = new ${readOnlyStr}Router(${capObjectName}Service.getInstance());

router.use("/", completeRouter.router);

export default router;
`;

  fs.writeFileSync(
    path.join(`${currentDir}/${objectName}`, `${objectName}.ts`),
    modelContent
  );
  fs.writeFileSync(
    path.join(`${currentDir}/${objectName}`, `${objectName}.mapper.ts`),
    mapperContent
  );
  fs.writeFileSync(
    path.join(`${currentDir}/${objectName}`, `${objectName}.service.ts`),
    serviceContent
  );
  fs.writeFileSync(
    path.join(`${currentDir}/${objectName}`, `${objectName}.routes.ts`),
    routesContent
  );
}

const [objectName, isReadOnly] = process.argv.slice(2);
if (!objectName) {
  console.error("Please provide an object name.");
  process.exit(1);
}

generateApi(objectName, isReadOnly === "true");
