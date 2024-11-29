import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Version extends Document {
  @Prop({ required: true })
  currentVersion: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VersionSchema = SchemaFactory.createForClass(Version);
