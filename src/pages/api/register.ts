import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { z } from "zod";
import { hashPassword } from "@/utils/utils";

const prisma = new PrismaClient();
type Users = // Discriminated Union

    | { success: true; username: string; email: string }
    | { success: false; error: string };

const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Kullanici adi 3 karakterden fazla olmalidir." })
    .max(20, { message: "Kullanici adi 20 karakterden fazla olamaz." }),
  email: z
    .string()
    .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." }),
  password: z
    .string()
    .min(7, { message: "Parola 7 karakterden fazla olmalidir." }),
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }
  let username: RegisterSchemaType["username"];
  let email: RegisterSchemaType["email"];
  let password: RegisterSchemaType["password"];

  try {
    const parsed = registerSchema.parse(req.body);
    username = parsed.username;
    email = parsed.email;
    password = parsed.password;
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid request data" });
  }
  try {
    const oldUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (oldUser) {
      return res
        .status(400)
        .json({ success: false, error: "Bu e-mail adresi sistemde kayıtlı." });
    }

    const { salt, hash } = hashPassword(
      password,
      crypto.randomBytes(16).toString("hex"),
    );
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hash,
        salt,
      },
    });
    res
      .status(200)
      .json({ success: true, username: user.username, email: user.email });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, error: "Kayit yapilirken bir hata oldu." });
  }
}
