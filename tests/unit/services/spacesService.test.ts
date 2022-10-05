import { SpacesService } from 'src/services/SpacesService';

describe('Space Service', () => {
  describe('Get My Spaces', () => {
    let spaceService: SpacesService;

    beforeAll(() => {
      spaceService = new SpacesService();
    });

    it('Should return at least 1 result', async () => {
      const userId = '';
      const from = 0;
      const limit = 10;

      const res = spaceService.getMySpaces({ userId, from, limit });

      expect(res.length).toBeGreaterThanOrEqual(1);
    });

    test('Should throw an error if called without a userId', () => {
      const userId: string | undefined = undefined;
      const from = 0;
      const limit = 10;

      expect(() => {
        spaceService.getMySpaces({ userId, from, limit });
      }).toThrow('No user ID given.');
    });
  });
});
