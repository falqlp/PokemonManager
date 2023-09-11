import Trainer, { ITrainer } from "./trainer";
import CompleteService from "../CompleteService";
import TrainerMapper from "./trainer.mapper";
import { ListBody } from "../ReadOnlyService";

class TrainerService extends CompleteService<ITrainer> {
  private static instance: TrainerService;
  public static getInstance(): TrainerService {
    if (!TrainerService.instance) {
      TrainerService.instance = new TrainerService(
        Trainer,
        TrainerMapper.getInstance()
      );
    }
    return TrainerService.instance;
  }

  public async getPartial(_id: string): Promise<ITrainer> {
    try {
      const entity = (await this.schema.findOne({ _id })) as ITrainer;
      return this.mapper.mapPartial(entity);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async listPartial(body: ListBody): Promise<ITrainer[]> {
    try {
      const query = { ...body.custom };
      if (body.ids) {
        query._id = { $in: body.ids };
      }
      const dtos = await this.schema
        .find(query)
        .limit(body.limit || 0)
        .sort(body.sort);

      if (body.ids?.length) {
        dtos.sort((a: any, b: any) => {
          return (
            body.ids!.indexOf(a._id.toString()) -
            body.ids!.indexOf(b._id.toString())
          );
        });
      }

      return await Promise.all(
        dtos.map(async (dto) => {
          return this.mapper.mapPartial(dto);
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default TrainerService;
