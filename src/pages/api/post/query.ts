import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

const POSTS_PER_PAGE = 10;

export async function getPostsByFollowedUsers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, errors: ["Method not allowed"] });
  }

  const userId = req.userId;
  const { page } = req.query;
  const pageNumber = parseInt(page as string, 10) || 1;
  const skip = (pageNumber - 1) * POSTS_PER_PAGE;

  const follows = await prisma.follows.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followedUserIds = follows.map((f) => f.followingId);

  const [posts, count] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: { in: followedUserIds } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({
      where: { authorId: { in: followedUserIds } },
    }),
  ]);

  const totalPages = Math.ceil(count / POSTS_PER_PAGE);

  return res.status(200).json({ success: true, posts, totalPages });
}

export default authMiddleware(getPostsByFollowedUsers);
