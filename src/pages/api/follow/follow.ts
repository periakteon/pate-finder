import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { followFollowResponse, followRequestSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();
type ResponseType = z.infer<typeof followFollowResponse>;

const handleFollowRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: ["Method not allowed"] });
  }

  const parsed = await followRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, error: errorMessages });
  }

  const followerId = req.userId;
  const { email } = parsed.data;

  try {
    const following = await prisma.user.findUnique({ where: { email } });

    if (!following) {
      return res
        .status(404)
        .json({ success: false, error: ["Kullanıcı bulunamadı"] });
    }

    if (followerId === following.id) {
      return res
        .status(400)
        .json({ success: false, error: ["Kendinizi takip edemezsiniz!"] });
    }

    await prisma.follow.create({
      data: {
        follower: {
          connect: {
            id: Number(followerId),
          },
        },
        following: {
          connect: {
            id: following.id,
          },
        },
      },
    });
    res.status(200).json({ success: true, message: "Takip başarılı!" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(200)
          .json({ success: true, message: "Zaten takip ediyorsunuz!" });
      }

      res.status(500).json({ success: false, error: [JSON.stringify(error)] });
    }
  }
};

export default authMiddleware(handleFollowRequest);
