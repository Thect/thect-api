import { SpacesListItem } from 'src/models/spaces/spacesListItem';

export class SpacesService {
  getMySpaces({
    userId,
    from,
    limit,
  }: {
    userId: string;
    from?: number | undefined;
    limit?: number | undefined;
  }): SpacesListItem[] {
    if (userId === undefined) {
      throw new Error('No user ID given.');
    }
    from = from && isNaN(from) ? 0 : from;
    limit = limit && isNaN(limit) ? 10 : limit;
    return [
      {
        name: 'Space 1',
      },
      {
        name: 'Space 2',
      },
      {
        name: 'Space 3',
      },
    ];
  }
}
