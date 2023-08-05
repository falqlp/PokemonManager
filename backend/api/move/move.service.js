const Move = require("./move");
const moveMapper = require("./move.mapper");
const ReadOnlyService = require("../ReadOnlyService");

const MoveService = {
  ...new ReadOnlyService(Move, moveMapper),
};

module.exports = MoveService;
