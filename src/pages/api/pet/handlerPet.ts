import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Pet } from "@prisma/client";

const prisma = new PrismaClient();

type ResponseType =
  | { success: true; message: string; pet?: Pet }
  | { success: true; message: string; fetchAllPets?: Pet[] }
  | { success: false; error: string };

export default async function handlerPet(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method === "POST") {
    try {
      const {
        owner_first_name,
        owner_last_name,
        name,
        breed,
        age,
        profile_picture,
        pet_type,
        bio,
        phone,
        city,
        country,
        ownerId,
      } = req.body;
      const pet = await prisma.pet.create({
        data: {
          owner_first_name,
          owner_last_name,
          name,
          breed,
          age,
          profile_picture,
          pet_type,
          bio,
          phone,
          city,
          country,
          ownerId: parseInt(ownerId),
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
      res
        .status(500)
        .json({
          success: false,
          error: `Tüm petler getirilirken bir hata oluştu: ${error}`,
        });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
