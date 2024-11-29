import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export abstract class MigrationScript {
  public abstract version: string;
  public abstract name: string;
  public abstract run(): Promise<void>;
  public constructor(
    @InjectConnection() protected readonly connection: Connection,
  ) {}
}
