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
    userId: string;
    from: number;
    limit: number;
  }): Promise<SpacesListItem[]> {
    if (userId === undefined) {
      throw new Error('No user ID given.');
    }

    from = isNaN(from) ? 0 : from;
    limit = isNaN(limit) ? 10 : limit;

    await this.prisma.$connect();
    const spaces = await this.prisma.spaces.findMany({
      where: {
        users: { has: userId },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      skip: from,
      take: limit,
    });
    await this.prisma.$disconnect();
    return spaces;
  }

  async countMySpaces({ userId }: { userId: string }): Promise<number> {
    if (userId === undefined) {
      throw new Error('No user ID given.');
    }

    await this.prisma.$connect();
    const countMySpaces = await this.prisma.spaces.count({
      where: {
        users: { has: userId },
      },
    });
    await this.prisma.$disconnect();
    return countMySpaces;
  }
}
