const ReadOnlyRouter = require("./ReadOnlyRouter");

class CompleteRouter {
  constructor(service) {
    this.router = require("express").Router();
    const readOnlyRouter = new ReadOnlyRouter(service);
    this.router.use("/", readOnlyRouter.router);
    this.initRouter(service);
  }

  initRouter(service) {
    this.router.post("/", (req, res, next) => {
      service
        .create(req.body)
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });

    this.router.put("/:id", (req, res, next) => {
      service
        .update(req.params.id, req.body)
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });

    this.router.delete("/:id", (req, res, next) => {
      service
        .delete(req.params.id)
        .then()
        .catch((error) => console.log(error));
    });
  }
}

module.exports = CompleteRouter;
