import { NullPipe } from './null.pipe';

describe('NullPipe', () => {
  it('create an instance', () => {
    const pipe = new NullPipe();
    expect(pipe).toBeTruthy();
  });
});
