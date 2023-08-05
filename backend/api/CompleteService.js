const ReadOnlyService = require("./ReadOnlyService");

class CompleteService {
  constructor(schema, mapper) {
    this.schema = schema;
    this.mapper = mapper;
    this.readOnlyService = new ReadOnlyService(schema, mapper);
    this.get = this.readOnlyService.get;
    this.list = this.readOnlyService.list;
    this.getAll = this.readOnlyService.getAll;
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async update(_id, dto) {
    try {
      return await this.schema.updateOne(
        { _id },
        { ...this.mapper.update(dto) }
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(dto) {
    try {
      const newDto = new this.schema({ ...dto });
      return await newDto.save();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(_id) {
    try {
      return await this.schema.deleteOne({ _id });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = CompleteService;
