import { ITrainingCamp } from '../../../domain/trainer/trainingCamp/TrainingCamp';

export class TrainingCampTestMother {
  static basicTrainingCamp(): ITrainingCamp {
    return {
      level: 1,
    } as ITrainingCamp;
  }

  static withCustomOptions(options: Partial<ITrainingCamp>): ITrainingCamp {
    return {
      ...this.basicTrainingCamp(),
      ...options,
    } as ITrainingCamp;
  }

  static advencedTrainingCamp(): ITrainingCamp {
    return this.withCustomOptions({ level: 8 });
  }
}
