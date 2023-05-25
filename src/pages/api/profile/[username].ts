import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  UserProfileRequestSchema,
  UserProfileResponseSchema,
} from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof UserProfileResponseSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const parsed = await UserProfileRequestSchema.safeParseAsync(req.query);

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
      where: {
        username,
      },
      select: {
        username: true,
        profile_picture: true,
        followedBy: {
          select: {
            follower: {
              select: {
                username: true,
                profile_picture: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                username: true,
                profile_picture: true,
              },
            },
          },
        },
        pet: {
          select: {
            name: true,
            breed: true,
            pet_photo: true,
            type: true,
            bio: true,
          },
        },
        posts: {
          select: {
            caption: true,
            createdAt: true,
            postImage: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: ["Kullanıcı bulunamadı"] });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, errors: ["Kullanıcı bulunamadı"] });
  } finally {
    await prisma.$disconnect();
  }
}
