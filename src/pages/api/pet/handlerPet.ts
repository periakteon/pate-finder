/**
 * 
 * @api {post} /api/pet/handlerPet Pet Oluşturma
  "name": "Fido",
  "breed": "Golden Retriever",
  "age": 3,
  "profile_picture": "https://example.com/fido.jpg",
  "type": "Dog",
  "bio": "I'm a friendly and active dog who loves playing fetch!",
  "ownerId": 12345
    }
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Pet } from "@prisma/client";
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
  const userId = req.userId;

  const parsed = await handlerPetRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    ); // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce operatörü

    return res.status(400).json({ success: false, errors: errorMessages });
  }
  const { name, breed, age, profile_picture, type, bio } = parsed.data;

  if (req.method === "POST") {
    try {
      const hasPet = await prisma.pet.findFirst({
        where: {
          userId: userId,
        },
      });
      if (hasPet) {
        return res.status(400).json({
          success: false,
          errors: [
            "Bu kullanıcının zaten peti var: Birden fazla pet eklenemez.",
          ],
        });
      }
      const pet = await prisma.pet.create({
        data: {
          name,
          breed,
          age,
          profile_picture,
          type,
          bio,
          userId: userId,
        },
      });
      return res
        .status(200)
        .json({ success: true, message: `Pet oluşturuldu!`, pet });
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: [`Pet oluşturulurken bir hata oluştu: ${error}`],
      });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }
};

export default authMiddleware(handlePet);
