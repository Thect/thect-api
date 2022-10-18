import * as handler from '../../../../src/functions/spaces/getMySpaces/handler';

describe('Spaces', () => {
  describe('getMySpaces', () => {
    describe('handler', () => {
      afterAll(() => {
        jest.resetModules();
      });

      it('Should return 0 results', async () => {
        const event = {
          headers: {
            'x-validated-user': 'test-user-id',
          },
        } as any;

        expect(handler.getMySpaces(event)).resolves.toStrictEqual({
          body: '{"data":[],"count":0}',
          statusCode: 200,
        });
      });
    });
  });
});
