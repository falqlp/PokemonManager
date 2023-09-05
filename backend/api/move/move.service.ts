import Move from "./move";
import moveMapper from "./move.mapper";
import ReadOnlyService from "../ReadOnlyService";

const MoveService = {
  ...new ReadOnlyService(Move, moveMapper),
};

export default MoveService;
