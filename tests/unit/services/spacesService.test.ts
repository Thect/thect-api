import { createMockContext, MockContext } from 'src/context';
import { SpacesService } from 'src/services/SpacesService';

describe('Space Service', () => {
  describe('Get My Spaces', () => {
    let ctx: MockContext;
    let spaceService: SpacesService;

    beforeAll(() => {
      ctx = createMockContext();
      spaceService = new SpacesService(ctx);
    });

    afterAll(() => {
      jest.resetModules();
    });

    it('Should return 1 result', async () => {
      const userId = 'test-user-id';
      const from = 0;
      const limit = 10;

      const spaces = [
        {
          id: 'test-1',
          name: 'test Space',
          description: 'The space for testing',
          locales: [],
          users: [],
        },
      ];
      ctx.prisma.spaces.findMany.mockResolvedValue(spaces);

      await expect(spaceService.getMySpaces({ userId, from, limit })).resolves.toHaveLength(1);
    });

    test('Should throw an error if called without a userId', async () => {
      const userId: string | undefined = undefined;
      const from = 0;
      const limit = 10;

      const ctx = createMockContext();
      const spaceService = new SpacesService(ctx);

      await expect(spaceService.getMySpaces({ userId, from, limit })).rejects.toThrow(
        'No user ID given.'
      );
    });

    test('The function should call prisma $connect once', async () => {
      const userId = 'test-user-id';
      const from = 0;
      const limit = 10;

      const ctx = createMockContext();
      ctx.prisma.$connect.mockImplementationOnce(jest.fn());
      const spaceService = new SpacesService(ctx);

      await spaceService.getMySpaces({ userId, from, limit });

      expect(ctx.prisma.$connect).toBeCalledTimes(1);
    });

    test('The function should call prisma $disconnect once', async () => {
      const userId = 'test-user-id';
      const from = 0;
      const limit = 10;

      const ctx = createMockContext();
      ctx.prisma.$disconnect.mockImplementationOnce(jest.fn());
      const spaceService = new SpacesService(ctx);

      await spaceService.getMySpaces({ userId, from, limit });

      expect(ctx.prisma.$disconnect).toBeCalledTimes(1);
    });
  });
});
