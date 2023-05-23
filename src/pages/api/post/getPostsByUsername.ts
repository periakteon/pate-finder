import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";
import { z } from "zod";
import {
  getPostsResponseSchema,
  getPostsRequestSchema,
} from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof getPostsResponseSchema>;

// GET http://localhost:3000/api/post/getPostsByUsername?username=Glen8

export default async function getPostsByUsername(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const parsed = await getPostsRequestSchema.safeParseAsync(req.query);
  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }
  const { username } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { posts: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: ["Kullanici bulunamadi"] });
    }

    const posts = user.posts.map((post) => ({
      id: post.id,
      caption: post.caption,
      postImage: post.postImage,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return res.status(200).json({
      success: true,
      username: user.username,
      posts,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, errors: ["Internal server error"] });
  }
}
