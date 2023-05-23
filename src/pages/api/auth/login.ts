import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword } from "@/utils/utils";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "../../../utils/verifyJwtToken";
import { serialize } from "cookie";
import { loginRequestSchema, loginResponseSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof loginResponseSchema>;

export default async function handleLogin(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  const parsed = await loginRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }
  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: ["E-mail bulunamadı."] });
    }

    const { hash } = hashPassword(password, user.salt);

    if (user.hash !== hash) {
      return res
        .status(400)
        .json({ success: false, errors: ["Hatalı parola."] });
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

    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      id: user.id,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errors: ["Bir hata oluştu."] });
  }
}
