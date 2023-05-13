import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await prisma.user.deleteMany();
    res
      .status(200)
      .json({ message: "All users have been deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting users" });
  }
}
