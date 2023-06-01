import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/utils/utils";
import authMiddleware from "@/middleware/authMiddleware";
import crypto from "crypto";
import {
  UpdateProfileRequestSchema,
  UpdateProfileResponseSchema,
  UpdatedUserSchema,
} from "@/utils/zodSchemas";
import { z } from "zod";

const prisma = new PrismaClient();

type ResponseType = z.infer<typeof UpdateProfileResponseSchema>;

const updateAndDeleteToken = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  try {
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

    const updatedUserData = UpdatedUserSchema.parse({});

    if (username !== undefined && username !== null) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          success: false,
          errors: ["Bu kullanıcı adı kullanılmaktadır."],
        });
      }
      updatedUserData.username = username;
    }

    if (email !== undefined && email !== null) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== userId) {
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

    if (profile_picture !== undefined && profile_picture !== null) {
      updatedUserData.profile_picture = profile_picture;
    }

    if (bio !== undefined && bio !== null) {
      updatedUserData.bio = bio;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updatedUserData,
    });

    if (password || email) {
      res.setHeader(
        "Set-Cookie",
        `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
      );
    }

    return res.json({
      success: true,
      updatedUser: updatedUserData,
    });
  } catch (error) {
    console.error("Kullanıcı güncellenirken bir hata oluştu:", error);
    return res.status(500).json({
      success: false,
      errors: ["Kullanıcı güncellenirken bir hata oluştu."],
    });
  }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  await updateAndDeleteToken(req, res);
};

export default authMiddleware(updateUser);
