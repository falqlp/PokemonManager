import { DateConverterMiddleware } from './date-converter.middleware';

describe('DateConverterMiddleware', () => {
  it('should be defined', () => {
    expect(new DateConverterMiddleware()).toBeDefined();
  });
});
