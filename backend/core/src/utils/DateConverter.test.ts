import { AnyObject } from 'mongoose';
import { convertStringsToDateInObject } from './DateConverter';

describe('convertStringsToDateInObject function', () => {
  it('should convert date strings to Date objects in a given object', () => {
    const inputObject: AnyObject = {
      name: 'testName',
      createdAt: '2023-01-01T00:00:00.000Z',
      nested: {
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    };

    convertStringsToDateInObject(inputObject);

    expect(inputObject.name).toBe('testName');
    expect(inputObject.createdAt).toBeInstanceOf(Date);
    expect(inputObject.nested.updatedAt).toBeInstanceOf(Date);
  });

  it('should leave non-date strings unchanged', () => {
    const inputObject: AnyObject = {
      name: 'testName',
      notDate: '2023-01-01',
    };

    convertStringsToDateInObject(inputObject);

    expect(inputObject.name).toBe('testName');
    expect(inputObject.notDate).toBe('2023-01-01');
  });

  it('should handle null values correctly', () => {
    const inputObject: AnyObject = {
      name: 'testName',
      nullValue: null,
    };

    convertStringsToDateInObject(inputObject);

    expect(inputObject.name).toBe('testName');
    expect(inputObject.nullValue).toBeNull();
  });

  it('should handle non-object values correctly', () => {
    const inputObject: AnyObject = {
      name: 'testName',
      numberValue: 12345,
    };

    convertStringsToDateInObject(inputObject);

    expect(inputObject.name).toBe('testName');
    expect(inputObject.numberValue).toBe(12345);
  });
});
