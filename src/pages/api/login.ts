import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Users = // Discriminated Union
  { success: true; users: string[] } | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  console.log(req.body);

  // TODO: check if hash is the same with the provided email
  // TODO: for each api validate with ZOD!!!!

  // await prisma.user.findFirst({
  //   where: {
  //     email: "" // req.body'den alinacak
  //   },
  //   select: {
  //     id: true,
  //     username: true,
  //     email: true,

  //     profile_picture: true,
  //     posts: {
  //       select: {
  //         postImage: true,
  //         caption: true,
  //       },
  //     },
  //   }
  // })

  res.status(200).json({ success: true, users: ["Masum Gökyüz", "Ege Aydemir"] });
}
