class ReadOnlyService {
  constructor(schema, mapper) {
    this.schema = schema;
    this.mapper = mapper;
    this.getAll = this.getAll.bind(this);
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

  async getAll() {
    try {
      const dtos = await this.schema.find();
      return await Promise.all(
        dtos.map(async (dto) => {
          return this.mapper.map(dto);
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async list(ids) {
    try {
      const dtos = await this.schema.find({ _id: { $in: ids } });
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
