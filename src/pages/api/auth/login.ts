import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "@/utils/utils";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "../../../utils/verifyJwtToken";
import { serialize } from "cookie";

const prisma = new PrismaClient();

type ResponseType =
  | {
      success: true;
      message: string;
      accessToken: string;
    }
  | { success: false; error: string };

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default async function handleLogin(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
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
        .status(404)
        .json({ success: false, error: "E-mail bulunamadı." });
    }

    const { hash } = hashPassword(password, user.salt);

    if (user.hash !== hash) {
      return res.status(400).json({ success: false, error: "Hatalı parola." });
    }

    // generating JWT token
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(getJwtSecretKey());

    // set cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      path: "/",
    });

    console.log("(Server Side Log) Login işlemi başarılı:", user);
    console.log("(Server Side Log) Cookie:", cookie);

    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ success: true, message: "Giriş başarılı", accessToken: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Bir hata oluştu." });
  }
}
