import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { followFollowResponse } from "@/utils/zodSchemas";

const prisma = new PrismaClient();
type ResponseType = z.infer<typeof followFollowResponse>;

const followSchema = z.object({
  followingId: z.number({
    required_error: "Takip edilecek kullanıcı id'si zorunludur.",
    invalid_type_error:
      "Takip edilecek kullanıcı id'si sayı tipinde olmalıdır.",
  }),
});

const handleFollowRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: ["Method not allowed"] });
  }

  const parsed = await followSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    // console.log(errorMap);
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    ); // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce operatörü

    return res.status(400).json({ success: false, error: errorMessages });
  }

  const followerId = req.userId;
  const { followingId } = parsed.data;

  if (followerId === followingId) {
    return res
      .status(400)
      .json({ success: false, error: ["Kendinizi takip edemezsiniz!"] });
  }

  try {
    const follow = await prisma.follows.create({
      data: {
        follower: {
          connect: {
            id: Number(followerId),
          },
        },
        following: {
          connect: {
            id: Number(followingId),
          },
        },
      },
    });

    console.log("Takip işlemi başarılı!");

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
