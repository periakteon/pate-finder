import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

// TODO: ALARM ALARM Handle Request and Response type ZODS PLX
// HANDLE req.query for request, and write

export async function getPostsByFollowedUsers(
  req: NextApiRequest,
  res: NextApiResponse,
  // res: NextApiResponse<ResponseType> plx
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const userId = req.userId;
  const { page, pageSize } = req.query;

  // TODO: ALARM ALARM ZOD VALIDATION PLX
  const pageNumber = Number(page) ?? 1; // SET PAGE, and set default please
  const pageSizeNumber = Number(pageSize) ?? 1; // SET PAGE SIZE MAX IN ZOD, and set default please
  // TODO: ALARM ALARM ZOD VALIDATION PLX

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
          profile_picture: true,
          username: true,
        },
      },
    },
  });

  // TODO: PLX
  // const result: QueryResponseType = {

  // }

  return res.status(200).json({ success: true, posts });
}

export default authMiddleware(getPostsByFollowedUsers);
