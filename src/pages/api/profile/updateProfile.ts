import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/utils";
import authMiddleware from "@/middleware/authMiddleware";
import crypto from "crypto";
import {
  UpdateProfileRequestSchema,
  UpdateProfileResponseSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof UpdateProfileResponseSchema>;

// Function to update the user and delete token if needed
async function updateAndDeleteToken(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const userId = req.userId;
  const parsed = await UpdateProfileRequestSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    const errorMap = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.values(errorMap).flatMap(
      (errors) => errors ?? [],
    );

    return res.status(400).json({ success: false, errors: errorMessages });
  }

  const { username, email, password, profile_picture, bio } = parsed.data;
  let hash, salt;

  if (password) {
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const { salt: newSalt, hash: newPasswordHash } = hashPassword(
      password,
      randomBytes,
    );
    salt = newSalt;
    hash = newPasswordHash;
  }

  const updatedUserData: any = {};

  if (username !== undefined) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          errors: ["Bu kullanıcı adı kullanılmaktadır."],
        });
    }
    updatedUserData.username = username;
  }

  if (email !== undefined) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, errors: ["Bu e-mail kullanılmaktadır."] });
    }
    updatedUserData.email = email;
  }

  if (salt && hash) {
    updatedUserData.salt = salt;
    updatedUserData.hash = hash;
  }

  if (profile_picture !== undefined) {
    updatedUserData.profile_picture = profile_picture;
  }

  if (bio !== undefined) {
    updatedUserData.bio = bio;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedUserData,
  });

  if (password || email) {
    // Delete token from cookie
    res.setHeader(
      "Set-Cookie",
      `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
    );
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  try {
    await updateAndDeleteToken(req, res);

    res.json({ success: true, message: "Kullanıcı bilgisi başarıyla güncellendi!" });
  } catch (error) {
    console.error("Kullanıcı güncellenirken bir hata oluştu:", error);
    res
      .status(500)
      .json({
        success: false,
        errors: ["Kullanıcı güncellenirken bir hata oluştu."],
      });
  }
}

export default authMiddleware(updateUser);
