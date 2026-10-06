import { prisma } from "../db/client.js";


export const PostRepository = {
    create({ authorId, title, body, status, publishedAt }) {
        return prisma.post.create({
            data: { authorId, title, body, status, publishedAt },
        });
    },

    async createWithTags({ authorId, title, body, tagNames = [], status, publishedAt }) {
      // Find or create each tag record by name, then create the Post with connected PostTags
      const tagConnects = await Promise.all(
        tagNames.map(async (name) => {
          const tag = await prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          return { tag: { connect: { id: tag.id } } };
        })
      );
  
      return prisma.post.create({
        data: {
          authorId,
          title,
          body,
          status,
          publishedAt,
          tags: {
            create: tagConnects,
          },
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    },
  

    async findPublished({ page, pageSize }) {
        const rows = await prisma.post.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize + 1, // fetch one extra row to compute hasMore
        });
        const hasMore = rows.length > pageSize;
            return { posts: rows.slice(0, pageSize), hasMore };
    },

    async searchPublished({ query, page, pageSize }) {
        const where = {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { body: { contains: query, mode: "insensitive" } },
          ],
        };
        const rows = await prisma.post.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize + 1,
        });
        const hasMore = rows.length > pageSize;
        return { posts: rows.slice(0, pageSize), hasMore };
      },
};