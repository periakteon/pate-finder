import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import crypto from "crypto";
import * as z from "zod";

const prisma = new PrismaClient();
type Users = // Discriminated Union

    | { success: true; username: string; email: string }
    | { success: false; error: string };

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(7),
});

const hashPassword = (password: string, salt: string) => {
  const hash = crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return { salt, hash };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }
  const { username, email, password } = registerSchema.parse(req.body);
  console.log("Body: ", req.body);

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

  // TODO: Register with a secret and hash the password and create user.
  // TODO: for each api validate with ZOD!!!!
}
