import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import authMiddleware from "@/middleware/authMiddleware";
import { fetchFeedResponse } from "@/utils/zodSchemas";

const prisma = new PrismaClient();
type ResponseType = z.infer<typeof fetchFeedResponse>;

export async function getPostsByFollowedUsers(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }
  // Get IDs of users that the given user is following
  const userId = req.userId;
  console.log(userId);

  const follows = await prisma.follows.findMany({
    where: { followerId: userId },
    select: { following: { select: { posts: true } } },
  });
  console.log(follows);

  const followedPosts = follows.map((f) => f.following.posts).flat();

  console.log(followedPosts);

  // Sort the posts by descending order of creation date
  const sortedPosts = followedPosts.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return res.status(200).json({ success: true, message: "Postlar başarıyla çekildi!", posts: sortedPosts });
}

export default authMiddleware(getPostsByFollowedUsers);
