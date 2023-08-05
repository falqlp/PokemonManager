const Move = require("./move");

const MoveService = {
  get: function (_id) {
    return Move.findOne({ _id });
  },
  list: function (ids) {
    return Move.find({ _id: { $in: ids } });
  },
};

module.exports = MoveService;
