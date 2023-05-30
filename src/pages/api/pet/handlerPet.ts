import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";
import { z } from "zod";
import {
  handlerPetResponse,
  handlerPetRequestSchema,
} from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof handlerPetResponse>;

const handlePet = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const userId = req.userId;
  const parsed = await handlerPetRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { name, age, breed, pet_photo, type, bio } = parsed.data;

  try {
    const petResponse = await prisma.pet.upsert({
      where: {
        userId,
      },
      create: {
        name,
        age,
        breed,
        pet_photo,
        type,
        bio,
        user: {
          connect: { id: userId },
        },
      },
      update: {
        name,
        breed,
        age,
        pet_photo,
        type,
        bio,
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json({ success: true, pet: petResponse });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errors: [`Pet oluşturulurken bir hata oluştu: ${error}`],
    });
  }
};

export default authMiddleware(handlePet);
