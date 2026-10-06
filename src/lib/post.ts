import type { Prisma } from "@/generated/prisma";

export const MAX_POST_LENGTH = 500;
export const MAX_COMMENT_LENGTH = 300;

// Shared shape for every post list (feed, profile posts, liked posts)
export const postInclude = {
  author: {
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
    },
  },
  comments: {
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  },
  likes: {
    select: {
      userId: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} satisfies Prisma.PostInclude;
