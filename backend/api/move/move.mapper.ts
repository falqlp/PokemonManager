import { IMove } from "./move";
import { IMapper } from "../IMapper";

const MoveMapper: IMapper<IMove> = {
  map: function (move: IMove): IMove {
    return move;
  },
  update: function (move: IMove): IMove {
    return move;
  },
};

export default MoveMapper;
