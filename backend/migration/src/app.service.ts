import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Version } from './domain/version.schema';
import * as semver from 'semver';
import { MigrationScript } from './migration-script/MigrationScript';

@Injectable()
export class AppService implements OnModuleInit {
  private maxVersion: string = '1.0.0';
  constructor(
    @InjectModel(Version.name) private versionModel: Model<Version>,
    @Inject('ALL_SERVICES') private readonly services: MigrationScript[],
  ) {}

  async onModuleInit(): Promise<any> {
    let versionDoc = await this.versionModel.findOne().exec();
    if (!versionDoc) {
      versionDoc = await this.versionModel.create({
        currentVersion: this.maxVersion,
      });
    }
    this.maxVersion = versionDoc.currentVersion;
    await this.runAll();
  }

  async getCurrentVersion(): Promise<string> {
    const versionDoc = await this.versionModel.findOne().exec();
    return versionDoc ? versionDoc.currentVersion : null;
  }

  async updateVersion(): Promise<void> {
    const versionDoc = await this.versionModel.findOne().exec();
    if (versionDoc) {
      versionDoc.currentVersion = this.maxVersion;
      versionDoc.updatedAt = new Date();
      await versionDoc.save();
    } else {
      await this.versionModel.create({ currentVersion: this.maxVersion });
    }
    Logger.log(`Updated version: ${this.maxVersion}`);
  }

  async runAll() {
    const promise = this.services.map(async (service) => {
      await this.executeIfVersionLower(service);
    });
    await Promise.all(promise);
  }

  async executeIfVersionLower(migration: MigrationScript): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    if (
      !currentVersion ||
      semver.lt(currentVersion, migration.version) ||
      migration.version === '0.0.0'
    ) {
      await migration.run();
      Logger.log('Success ' + migration.name);
    }
    if (semver.lt(currentVersion, migration.version)) {
      this.maxVersion = migration.version;
    }
  }
}
