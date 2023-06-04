import { NextApiRequest, NextApiResponse } from "next";
import { Like, PrismaClient } from "@prisma/client";
import { checkLikeRequest } from "@/utils/zodSchemas";
import authMiddleware from "../../../middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType =
  | { success: true; message: string; liked: Like | null }
  | { success: false; errors: string[] };

const handleCheckLikeRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }
  const userId = req.userId;
  const parsed = await checkLikeRequest.safeParseAsync(req.query);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { postId } = parsed.data;

  try {
    const liked = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Kontroller yapıldı.", liked });
  } catch (error) {
    console.error("An error occurred:", error);
    return res
      .status(500)
      .json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(handleCheckLikeRequest);
