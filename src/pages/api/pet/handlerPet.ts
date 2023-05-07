/**
 * 
 * @api {post} /api/pet/handlerPet Pet Oluşturma
  "name": "Fido",
  "breed": "Golden Retriever",
  "age": 3,
  "profile_picture": "https://example.com/fido.jpg",
  "pet_type": "Dog",
  "bio": "I'm a friendly and active dog who loves playing fetch!",
  "phone": "555-1234",
  "city": "Istanbul",
  "country": "Turkey",
  "ownerId": 12345
    }
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Pet } from "@prisma/client";
import authMiddleware from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

type ResponseType =
  | { success: true; message: string; pet?: Pet }
  | { success: true; message: string; fetchAllPets?: Pet[] }
  | { success: false; error: string };

const handlePet = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  
  const userId = req.userId;

  if (req.method === "POST") {
    try {
      const {
        name,
        breed,
        age,
        profile_picture,
        pet_type,
        bio,
        phone,
        city,
        country,
      } = req.body;

      // TODO: ALARM ALARM no Type validation with zod!!!!!!!!!!

      const pet = await prisma.pet.create({
        data: {
          name,
          breed,
          age,
          profile_picture,
          pet_type,
          bio,
          phone,
          city,
          country,
          ownerId: userId,
        },
      });
      res.status(200).json({ success: true, message: `Pet oluşturuldu!`, pet });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Pet oluşturulurken bir hata oluştu: ${error}`,
      });
    }
  } else if (req.method === "GET") {
    try {
      const fetchAllPets = await prisma.pet.findMany();
      if (fetchAllPets.length === 0) {
        res.status(404).json({ success: false, error: "Hiç pet bulunamadı." });
      } else {
        res.status(200).json({
          success: true,
          message: "Petler başarıyla getirildi",
          fetchAllPets,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Tüm petler getirilirken bir hata oluştu: ${error}`,
      });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
};

export default authMiddleware(handlePet);
