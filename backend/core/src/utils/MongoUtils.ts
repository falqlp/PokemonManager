import { ObjectId } from 'mongodb';

export function mongoId(): string {
  return new ObjectId() as unknown as string;
}
