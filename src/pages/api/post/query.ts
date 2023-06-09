import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import authMiddleware from "@/middleware/authMiddleware";
import {
  infiniteScrollRequestQuerySchema,
  infiniteScrollResponseSchema,
} from "../../../utils/zodSchemas";

const prisma = new PrismaClient();

type infiniteScrollResponseSchema = z.infer<
  typeof infiniteScrollResponseSchema
>;

const getPostsByFollowedUsers = async (
  req: NextApiRequest,
  res: NextApiResponse<infiniteScrollResponseSchema>,
) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const userId = req.userId;
  const parsed = await infiniteScrollRequestQuerySchema.safeParseAsync(
    req.query,
  );

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { page, pageSize } = parsed.data;

  const pageNumber = page;
  const pageSizeNumber = pageSize;

  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followedUserIds = follows.map((f) => f.followingId);

  const posts = await prisma.post.findMany({
    where: { authorId: { in: followedUserIds } },
    orderBy: { createdAt: "desc" },
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    select: {
      id: true,
      caption: true,
      postImage: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          username: true,
          profile_picture: true,
        },
      },
      comments: {
        select: {
          id: true,
          text: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          user: {
            select: {
              username: true,
              profile_picture: true,
            },
          },
        },
      },
    },
  });

  return res
    .status(200)
    .json({ success: true, posts, message: "Feed başarıyla getirildi." });
};

export default authMiddleware(getPostsByFollowedUsers);
