import * as handler from '../../../../src/functions/security/authentication/handler';

describe('Functions', () => {
  describe('Security', () => {
    describe('Authentication', () => {
      it('Should return unauthorized if authService.authenticate throws an error', async () => {
        const event = {} as any;
        const context = {
          fail: jest.fn(),
        } as any;
        await handler.main(event, context);
        expect(context.fail).toBeCalledWith('Unauthorized');
      });
      it('Should return the result of authService.authenticate', async () => {
        const event = {} as any;
        const context = {} as any;

        handler.authService.authenticate = jest.fn().mockResolvedValue('test-result');

        const result = await handler.main(event, context);
        expect(result).toBe('test-result');
      });
    });
  });
});
