import type { NextApiRequest, NextApiResponse } from "next";

type Users = // Discriminated Union
  { success: true; users: string[] } | { success: false; error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Users>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // TODO: Register with a secret and hash the password and create user.
  // TODO: for each api validate with ZOD!!!!

  res.status(200).json({ success: true, users: ["Masum Gökyüz", "Ege Aydemir"] });
}
