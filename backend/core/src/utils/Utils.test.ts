import { delay } from './Utils';

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should delay execution', async () => {
    const fn = jest.fn();
    delay(1000).then(fn);

    jest.advanceTimersByTime(500);
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(500);
    await Promise.resolve();

    expect(fn).toBeCalled();
  });
});
