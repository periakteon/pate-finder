import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Post } from "@prisma/client";
import { z, ZodError } from "zod";
import authMiddleware from "../../../middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType = // Discriminated Union

    | { success: true; message: string; post?: Post }
    | { success: false; error: string[] };

const postSchema = z.object({
  caption: z
    .string()
    .max(280, { message: "Caption must be less than 280 characters" }),
  postImage: z.string().url(),
  petId: z.number(),
});

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: ["Method not allowed"] });
  }
  const parsed = await postSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    // console.log(errorMap);
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    ); // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce operatörü

    return res.status(400).json({ success: false, error: errorMessages });
  }
  if (req.method === "POST") {
    try {
      const authorId = req.userId;
      const { caption, postImage, petId } = parsed.data;

      const post = await prisma.post.create({
        data: {
          caption,
          postImage,
          pet: { connect: { id: petId } },
          author: { connect: { id: authorId } },
        },
      });

      res
        .status(200)
        .json({ success: true, message: "Post oluşturuldu:", post: post });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: ["Internal Server Error"] });
    }
  }
}

export default authMiddleware(handlePost);
