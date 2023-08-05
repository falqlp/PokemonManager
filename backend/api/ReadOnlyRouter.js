class ReadOnlyRouter {
  constructor(service) {
    this.router = require("express").Router();
    this.initRouter(service);
  }

  initRouter(service) {
    this.router.get("/:id", (req, res, next) => {
      service
        .get(req.params.id)
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });

    this.router.get("/", (req, res, next) => {
      service
        .getAll()
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });

    this.router.put("/", (req, res, next) => {
      service
        .list(req.body)
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });
  }
}

module.exports = ReadOnlyRouter;
