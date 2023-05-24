import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { searchRequest, searchResponse } from "@/utils/zodSchemas";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof searchResponse>;

const search = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }
  const parsed = await searchRequest.safeParseAsync(req.query);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { username } = parsed.data;

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      select: {
        id: true,
        username: true,
        profile_picture: true,
      },
    });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, errors: ["Internal Server Error."] });
  }
};

export default authMiddleware(search);
