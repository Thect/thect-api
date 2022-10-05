import { PrismaClient } from '@prisma/client';
import { SpacesListItem } from 'src/models/spaces/spacesListItem';

export class SpacesService {
  async getMySpaces({
    userId,
    from,
    limit,
  }: {
    userId?: string;
    from?: number;
    limit?: number;
  }): Promise<SpacesListItem[]> {
    if (userId === undefined) {
      throw new Error('No user ID given.');
    }
    from = from && isNaN(from) ? 0 : from;
    limit = limit && isNaN(limit) ? 10 : limit;
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log(userId);
    const spaces = await prisma.spaces.findMany({
      where: {
        users: { has: userId },
      },
    });
    await prisma.$disconnect();
    return spaces;
  }
}
