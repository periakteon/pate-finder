import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Pet } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType =
  | { success: true; message: string; pets: Pet[] }
  | { success: false; error: string };

const handleGetPetsByUser = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  const userId = req.query.userId;

  // TODO: ALARM ALARM no type validation with zod for user id
  /**
   * http://localhost:3000/api/pet/getPetsByUser?userId=1
   */
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }
  if (req.method === "GET") {
    try {
      const pets = await prisma.pet.findMany({
        where: {
          ownerId: parseInt(userId as string),
        },
      });
      res
        .status(200)
        .json({ success: true, message: "Petler başarıyla getirildi.", pets });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};

export default authMiddleware(handleGetPetsByUser);
