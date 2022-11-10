import * as handler from '../../../../src/functions/spaces/getMySpaces/handler';

jest.mock('../../../../src/services/spacesService', () => {
  return {
    SpacesService: jest.fn().mockImplementation(() => {
      return {
        getMySpaces: jest.fn().mockImplementation(() => {
          return [
            {
              id: 'test-1',
              name: 'test Space',
              description: 'The space for testing',
              locales: [],
              users: [],
            },
          ];
        }),
        countMySpaces: jest.fn().mockImplementation(() => {
          return 1;
        }),
      };
    }),
  };
});

describe('Functions', () => {
  describe('Spaces', () => {
    describe('getMySpaces', () => {
      describe('handler', () => {
        afterAll(() => {
          jest.resetModules();
        });

        it('Should return 200 status code', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
          } as any;

          const result = await handler.getMySpaces(event);
          expect(result.statusCode).toBe(200);
        });

        it('Should return a JSON body', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
          } as any;

          const result = await handler.getMySpaces(event);
          expect(result).not.toBeNull();
          const returnValue = JSON.parse(result.body ?? '');
          expect(returnValue).not.toBeNull();
        });

        it('Should return 1 in count', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
          } as any;

          const result = await handler.getMySpaces(event);
          expect(result).not.toBeNull();
          const returnValue = JSON.parse(result.body ?? '');
          expect(returnValue.count).toBe(1);
        });

        it('Should call count my spaces with correct user id', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
          } as any;

          await handler.getMySpaces(event);
          const mockedSpacesService = handler.spaceService;
          const mockedCountMySpaces = mockedSpacesService.countMySpaces as jest.Mock;
          const values =
            mockedCountMySpaces.mock.calls[mockedCountMySpaces.mock.calls.length - 1][0];
          expect(values.userId).toBe('test-user-id');
        });

        it('Should call get my spaces with correct user id', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
          } as any;

          await handler.getMySpaces(event);
          const mockedSpacesService = handler.spaceService;
          const mockedGetMySpaces = mockedSpacesService.getMySpaces as jest.Mock;
          const values = mockedGetMySpaces.mock.calls[mockedGetMySpaces.mock.calls.length - 1][0];
          expect(values.userId).toBe('test-user-id');
        });

        it('Should call get my spaces with correct from', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
            queryStringParameters: {
              from: '99',
            },
          } as any;

          await handler.getMySpaces(event);
          const mockedSpacesService = handler.spaceService;
          const mockedGetMySpaces = mockedSpacesService.getMySpaces as jest.Mock;
          const values = mockedGetMySpaces.mock.calls[mockedGetMySpaces.mock.calls.length - 1][0];
          expect(values.from).toBe(99);
        });

        it('Should call get my spaces with correct limit', async () => {
          const event = {
            requestContext: {
              authorizer: {
                principalId: 'test-user-id',
              },
            },
            queryStringParameters: {
              limit: '99',
            },
          } as any;

          await handler.getMySpaces(event);
          const mockedSpacesService = handler.spaceService;
          const mockedGetMySpaces = mockedSpacesService.getMySpaces as jest.Mock;
          const values = mockedGetMySpaces.mock.calls[mockedGetMySpaces.mock.calls.length - 1][0];
          expect(values.limit).toBe(99);
        });
      });
    });
  });
});
