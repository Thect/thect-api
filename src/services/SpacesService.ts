import { PrismaClient } from '@prisma/client';
import { SpacesListItem } from 'src/models/spaces/spacesListItem';
import { Context } from '../context';

export class SpacesService {
  prisma: PrismaClient;

  constructor(ctx: Context) {
    this.prisma = ctx.prisma;
  }

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

    await this.prisma.$connect();
    const spaces = await this.prisma.spaces.findMany({
      where: {
        users: { has: userId },
      },
    });
    await this.prisma.$disconnect();

    return spaces;
  }
}
