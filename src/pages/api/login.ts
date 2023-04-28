import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "@/utils/utils";

const prisma = new PrismaClient();
type ResponseType = // Discriminated Union
  { success: true; message: string } | { success: false; error: string };

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  let email: LoginSchemaType["email"];
  let password: LoginSchemaType["password"];

  try {
    const parsed = loginSchema.parse(req.body);
    email = parsed.email;
    password = parsed.password;
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, error: "Geçersiz form bilgisi." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "E-mail bulunamadı." });
    }

    const { hash } = hashPassword(password, user.salt);
    if (user.hash !== hash) {
      return res.status(400).json({ success: false, error: "Hatalı parola." });
    }
    console.log("Login işlemi başarılı: ", user);
    res.status(200).json({ success: true, message: "Kullanıcı girişi başarılı!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, error: "Giriş yaparken bir hata oluştu." });
  }

  // TODO: Login with a secret and hash the password and authenticate user.
  // TODO: for each api validate with ZOD!!!!
}
