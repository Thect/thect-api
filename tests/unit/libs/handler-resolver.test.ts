import { handlerPath } from '../../../src/libs/handler-resolver';

describe('Lib', () => {
  describe('Handler Resolver', () => {
    describe('Handler Path', () => {
      it('Should return the correct path', () => {
        const spy = jest.spyOn(process, 'cwd');
        spy.mockReturnValue('src');
        const path = handlerPath('src/test');
        expect(path).toBe('test');
      });
    });
  });
});
