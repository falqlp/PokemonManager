export interface IEntity {
  createdAt?: Date;
  updateAt?: Date;
}

export const entitySchema = {
  createdAt: { type: Date, required: false },
  updateAt: { type: Date, required: false },
};
