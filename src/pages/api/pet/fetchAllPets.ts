import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Pet } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { fetchAllPetsResponse } from "@/utils/zodSchemas";
import { z } from "zod";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof fetchAllPetsResponse>;

const fetchAllPets = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "GET") {
    return res
      .status(400)
      .json({ success: false, errors: ["Method not allowed."] });
  }

  if (req.method === "GET") {
    try {
      const fetchPets = await prisma.pet.findMany();
      if (fetchPets.length === 0) {
        return res
          .status(400)
          .json({ success: false, errors: ["Petler bulunamadi."] });
      } else {
        return res.status(200).json({
          success: true,
          message: `Petler getirildi!`,
          fetchPets,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [`Petler getirilirken bir hata oluştu: ${error}`],
      });
    }
  }
};

export default authMiddleware(fetchAllPets);
