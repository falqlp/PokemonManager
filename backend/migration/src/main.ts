import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppService } from "./app.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.get(AppService).onModuleInit();
  await app.get(AppService).updateVersion();
  await app.close();
}
bootstrap();
