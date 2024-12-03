import { MigrationScript } from '../MigrationScript';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class DrainMoveMigration extends MigrationScript {
  name: string = 'Division on trainer';
  version: string = '1.2.0';

  async run(): Promise<void> {
    await this.connection.db
      .collection('trainers')
      .updateMany({}, { $set: { division: 3 } });
  }
}
