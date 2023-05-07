import type { NextApiRequest, NextApiResponse } from "next";
import { Pet, PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";

const prisma = new PrismaClient();

type ResponseType =
  | { success: true; message: string; pets: Pet[] }
  | { success: false; error: string[] };

const getPetsByUserSchema = z.object({
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
  const parsed = await getPetsByUserSchema.safeParseAsync(req.query);
  console.log("parsed", parsed);
  console.log("req.query:", req.query);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );
    return res.status(400).json({ success: false, error: errorMessages });
  }
  const { userId } = parsed.data;
  console.log("userId:", userId);

  /**
   * http://localhost:3000/api/pet/getPetsByUser?userId=1
   */
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: ["Method not allowed"] });
  }

  try {
    const pets = await prisma.pet.findMany({
      where: {
        ownerId: userId,
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Petler başarıyla getirildi.", pets });
  } catch (error) {
    res.status(500).json({ success: false, error: ["Internal Server Error"] });
  }
};

export default authMiddleware(handleGetPetsByUser);
