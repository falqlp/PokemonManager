import { IMapper } from 'shared/common/domain/IMapper';
import { IMove } from 'shared/models/move/mode-model';

const MoveMapper: IMapper<IMove> = {
  map: function (move: IMove): IMove {
    return move;
  },
};

export default MoveMapper;
