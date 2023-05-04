import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Post } from "@prisma/client";
import { z, ZodError } from "zod";

type ResponseType = // Discriminated Union

    | { success: true; message: string; post?: Post }
    | { success: false; error: string[] };

const postSchema = z.object({
  caption: z
    .string()
    .max(280, { message: "Caption must be less than 280 characters" }),
  postImage: z.string().url(),
  petId: z.number(),
  authorId: z.number(),
});

const prisma = new PrismaClient();

export default async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: ["Method not allowed"] });
  }
  if (req.method === "POST") {
    try {
      const parsed = postSchema.parse(req.body);
      const { caption, postImage, petId, authorId } = parsed;
      const post = await prisma.post.create({
        data: {
          caption,
          postImage,
          pet: { connect: { id: Number(petId) } },
          author: { connect: { id: Number(authorId) } },
        },
      });
      res
        .status(200)
        .json({ success: true, message: "Post oluşturuldu:", post: post });
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap = error.flatten().fieldErrors;
        const errorMessages = Object.values(errorMap).flatMap(
          (errors) => errors ?? [],
        ); // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce
        return res.status(400).json({ success: false, error: errorMessages });
      } else {
        res
          .status(500)
          .json({ success: false, error: ["Internal Server Error"] });
      }
    }
  }
}
