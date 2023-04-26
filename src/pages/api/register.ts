import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
type Users = // Discriminated Union
  { success: true; user: User } | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }
  const { username, email, password } = req.body;
  console.log("req bodyyyyy",req.body)

  try {
    const oldUser = await prisma.user.findUnique({
      where: {
        email: email,
    },
    });
    if (oldUser) {
      return res.status(400).json({ success: false, error: "Kullanici zaten var" });
    }
    if(password.length < 6){
      return res.status(400).json({success: false, error:"Parola en az 7 karakter olmalidir."})
    }
    if(username.length < 2){
      return res.status(400).json({success: false, error: "Kullanici adi en az 3 karakter olmalidir"})
    }
    if(username.length > 20){
      return res.status(400).json({success: false, error: "Kullanici adi 20 karakterden fazla olamaz."})
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hash: hashedPassword,
      },
    });
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.log(err)
    res.status(500).json({success: false, error:"Kayit yapilirken bir hata oldu."})
  }

  // TODO: Register with a secret and hash the password and create user.
  // TODO: for each api validate with ZOD!!!!
}
