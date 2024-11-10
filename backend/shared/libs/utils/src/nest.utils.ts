import { Model } from 'mongoose';
import { ModelDefinition } from '@nestjs/mongoose';

export function mapSchemas(models: Model<any>[]): ModelDefinition[] {
  return models.map((model) => {
    return {
      name: model.modelName,
      schema: model.schema,
      collection: model.collection.name,
    };
  });
}
