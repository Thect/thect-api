import * as handler from '../../../../src/functions/spaces/getMySpaces/handler';

jest.mock('../../../../src/services/SpacesService', () => {
  return {
    SpacesService: jest.fn().mockImplementation(() => {
      return {
        getMySpaces: jest.fn().mockResolvedValue([
          {
            id: 'test-1',
            name: 'test Space',
            description: 'The space for testing',
            locales: [],
            users: [],
          },
        ]),
      };
    }),
  };
});

describe('Spaces', () => {
  describe('getMySpaces', () => {
    describe('handler', () => {
      afterAll(() => {
        jest.resetModules();
      });

      it('Should return 200 status code', async () => {
        const event = {
          headers: {
            'x-validated-user': 'test-user-id',
          },
        } as any;

        const result = await handler.getMySpaces(event);
        expect(result.statusCode).toBe(200);
      });

      it('Should return a JSON body', async () => {
        const event = {
          headers: {
            'x-validated-user': 'test-user-id',
          },
        } as any;

        const result = await handler.getMySpaces(event);
        const returnValue = JSON.parse(result.body);
        expect(returnValue).not.toBeNull();
      });

      it('Should return 1 in count', async () => {
        const event = {
          headers: {
            'x-validated-user': 'test-user-id',
          },
        } as any;

        const result = await handler.getMySpaces(event);
        const returnValue = JSON.parse(result.body);
        expect(returnValue.count).toBe(1);
      });
    });
  });
});
