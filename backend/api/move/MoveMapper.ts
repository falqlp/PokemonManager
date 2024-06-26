import { IMove } from "../../domain/move/Move";
import { IMapper } from "../../domain/IMapper";

const MoveMapper: IMapper<IMove> = {
  map: function (move: IMove): IMove {
    return move;
  },
};

export default MoveMapper;
