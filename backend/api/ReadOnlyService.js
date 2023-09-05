class ReadOnlyService {
  constructor(schema, mapper) {
    this.schema = schema;
    this.mapper = mapper;
    this.get = this.get.bind(this);
    this.list = this.list.bind(this);
  }
  async get(_id) {
    try {
      return this.mapper.map(await this.schema.findOne({ _id }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async list(body) {
    try {
      const query = { ...body.custom };
      if (body.ids) {
        query._id = { $in: body.ids };
      }

      const dtos = await this.schema
        .find(query)
        .limit(body.limit)
        .sort(body.sort);
      if (body.ids?.length) {
        dtos.sort((a, b) => {
          return (
            body.ids.indexOf(a._id.toString()) -
            body.ids.indexOf(b._id.toString())
          );
        });
      }
      return await Promise.all(
        dtos.map(async (dto) => {
          return this.mapper.map(dto);
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = ReadOnlyService;
