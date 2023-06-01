import { NextApiRequest, NextApiResponse } from "next";

const logoutHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, errors: ["Method not allowed"] });
  }

  res.setHeader(
    "Set-Cookie",
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;",
  );

  // Başarılı yanıt döndürme
  return res.status(200).json({ success: true, message: "Çıkış yapıldı" });
};

export default logoutHandler;
