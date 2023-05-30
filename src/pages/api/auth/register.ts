import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { z } from "zod";
import { hashPassword } from "@/utils/utils";
import { registerResponse, registerRequestSchema } from "@/utils/zodSchemas";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof registerResponse>;
type PrismaErrorMeta = {
  target: string[];
  [key: string]: string[];
};

export default async function handleRegister(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, errors: ["Hatalı metod"] });
  }

  const parsed = await registerRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    ); // error'un undefined dönme ihtimaline karşı array dönmesi için coalesce operatörü

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { username, email, password } = parsed.data;

  const { salt, hash } = hashPassword(
    password,
    crypto.randomBytes(16).toString("hex"),
  );

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hash,
        salt,
      },
    });

    res.status(200).json({
      success: true,
      username: user.username,
      email: user.email,
      message: "Üye kaydı başarılı!",
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = (err.meta as PrismaErrorMeta).target[0];
        return res.status(400).json({
          success: false,
          errors: [`Bu ${target} halihazırda kullanılmaktadır.`],
        });
      }
    } else {
      console.log("Prisma Register Hatası:", err);
      return res
        .status(500)
        .json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}
