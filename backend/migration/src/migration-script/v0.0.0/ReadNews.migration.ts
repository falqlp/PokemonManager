import { MigrationScript } from '../MigrationScript';

export default class ReadNewsMigration extends MigrationScript {
  name: string = 'Read News Migration';
  version: string = '0.0.0';

  async run(): Promise<void> {
    await this.connection.db
      .collection('users')
      .updateMany({}, { $set: { hasReadNews: false } });
  }
}
