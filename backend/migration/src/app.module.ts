import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { join } from "path";
import { AppService } from "./app.service";
import { MigrationScript } from "./migration-script/MigrationScript";
import DrainMoveMigration from "./migration-script/v1.2.0/drain-move.migration";
import ReadNewsMigration from "./migration-script/v0.0.0/ReadNews.migration";
import { Version, VersionSchema } from "./domain/version.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, "..", ".env"), "../.env"],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGODB_LOCAL !== "0"
            ? "mongodb://127.0.0.1:27017/PokemonManager"
            : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.1eldau8.mongodb.net/PokemonManager`,
      }),
    }),
    MongooseModule.forFeature([{ name: Version.name, schema: VersionSchema }]),
  ],
  providers: [
    AppService,
    DrainMoveMigration,
    ReadNewsMigration,
    {
      provide: "ALL_SERVICES",
      useFactory: (...services: MigrationScript[]) => services,
      inject: [DrainMoveMigration, ReadNewsMigration],
    },
  ],
})
export class AppModule {}
