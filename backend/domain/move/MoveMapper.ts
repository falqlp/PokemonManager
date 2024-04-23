import { IMove } from "./Move";
import { IMapper } from "../IMapper";
import { PopulateOptions } from "mongoose";

const MoveMapper: IMapper<IMove> = {
  populate(): PopulateOptions | PopulateOptions[] {
    return null;
  },
  map: function (move: IMove): IMove {
    return move;
  },
  update: function (move: IMove): IMove {
    return move;
  },
};

export default MoveMapper;
