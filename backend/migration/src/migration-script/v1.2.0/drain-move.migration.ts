import axios from 'axios';
import Bottleneck from 'bottleneck';
import { MigrationScript } from '../MigrationScript';
import { Injectable } from '@nestjs/common';
import * as cliProgress from 'cli-progress';

@Injectable()
export default class DrainMoveMigration extends MigrationScript {
  name: string = 'Drain Move Migration';
  version: string = '1.2.0';

  async run(): Promise<void> {
    const moves = await this.connection.collection('moves').find({}).toArray();

    const progressBar = new cliProgress.SingleBar(
      {
        format:
          'DrainMoveMigration Progress |{bar}| {percentage}% || {value}/{total} Moves Processed',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic,
    );

    progressBar.start(moves.length, 0);

    const limiter = new Bottleneck({
      maxConcurrent: 200,
      minTime: 1,
    });

    const movePromises = moves.map((move) =>
      limiter.schedule(async () => {
        try {
          const response = await axios.get(
            'https://pokeapi.co/api/v2/move/' + move.name.toLowerCase(),
          );

          const sideEffect: Record<string, number> = {};
          if (response.data.meta?.drain) {
            sideEffect.Drain = response.data.meta.drain;
          }
          if (response.data.effect_entries[0]?.effect.includes('"recharge"')) {
            sideEffect.Reload = 1;
          }
          if (Object.keys(sideEffect).length > 0) {
            await this.connection
              .collection('moves')
              .findOneAndUpdate(
                { name: response.data.name.toUpperCase() },
                { $set: { sideEffect } },
              );
          }
        } catch (error) {
          console.error(
            `Erreur lors du traitement de ${move.name}:`,
            error.message,
          );
        } finally {
          progressBar.increment();
        }
      }),
    );

    await Promise.all(movePromises);

    progressBar.stop();
  }
}
