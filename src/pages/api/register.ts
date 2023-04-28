import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { z, ZodError } from "zod";
import { hashPassword } from "@/utils/utils";

const prisma = new PrismaClient();
type ResponseType =
  // Discriminated Union
  | { success: true; username: string; email: string; message: string }
  | { success: false; error: string[] };

const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Kullanıcı adı 3 karakterden fazla olmalıdır." })
    .max(20, { message: "Kullanıcı adı 20 karakterden fazla olamaz." }),
  email: z
    .string()
    .email({ message: "Lütfen geçerli bir e-mail adresi giriniz." }),
  password: z
    .string()
    .min(7, { message: "Parola 7 karakterden fazla olmalıdir." }),
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: ["Hatalı metod"] });
  }

  try {
    const parsed = registerSchema.parse(req.body) as RegisterSchemaType;
    const { username, email, password } = parsed;

    const oldUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (oldUser) {
      return res.status(400).json({
        success: false,
        error: ["Bu e-mail adresi kullanılmaktadır."],
      });
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
      .json({
        success: true,
        username: user.username,
        email: user.email,
        message: "Üye kaydı başarılı!",
      });
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMap = err.flatten().fieldErrors;
      const errorMessages = Object.values(errorMap)
      .flatMap((errors) => errors ?? []) // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce operatörü
      return res.status(400).json({ success: false, error: errorMessages });
    } else {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, error: ["Kayıt yapılırken hata oluştu."] });
    }
  }
}
