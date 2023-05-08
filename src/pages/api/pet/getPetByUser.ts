import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import { getPetByUserResponse } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof getPetByUserResponse>;

const getPetByUserSchema = z.object({
  userId: z
    .string({
      invalid_type_error: "Kullanıcı id'si sayı olmalıdır.",
      required_error: "Kullanıcı id'si gereklidir.",
    })
    .transform(Number),
});

const handleGetPetsByUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  const parsed = await getPetByUserSchema.safeParseAsync(req.query);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  const { userId } = parsed.data;

  /**
   * http://localhost:3000/api/pet/getPetByUser?userId=1
   */
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  try {
    const pet = await prisma.pet.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!pet) {
      return res
        .status(404)
        .json({ success: false, errors: ["Pet bulunamadı."] });
    }
    res
      .status(200)
      .json({ success: true, message: "Petler başarıyla getirildi.", pet });
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Internal Server Error"] });
  }
};

export default authMiddleware(handleGetPetsByUser);
