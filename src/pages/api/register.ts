import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { z, ZodError } from "zod";
import { hashPassword } from "@/utils/utils";

const prisma = new PrismaClient();
type ResponseType =
  // Discriminated Union
  | { success: true; username: string; email: string }
  | { success: false; error: object };

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
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: { errorMessage: "Hatalı metod." } });
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
      return res
        .status(400)
        .json({
          success: false,
          error: { errorMessage: "Bu e-mail adresi sistemde kayıtlı." },
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
      .json({ success: true, username: user.username, email: user.email });
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMap = err.flatten().fieldErrors;
      const errorMessages = Object.values(errorMap).map((errors) => errors);
      return res.status(400).json({ success: false, error: errorMessages });
    } else {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, error: {errorMessage: "Kayıt yapılırken bir hata oluştu."} });
    }
  }
}
