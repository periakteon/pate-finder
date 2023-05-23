import authMiddleware from "@/middleware/authMiddleware";
import { exploreResponse } from "@/utils/zodSchemas";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof exploreResponse>;

const explorer = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }
  try {
    const userId = req.userId;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        profile_picture: true,
        createdAt: true,
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            pet_photo: true,
          },
        },
      },
      where: {
        NOT: {
          id: userId,
        },
      },
    });

    res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(explorer);
