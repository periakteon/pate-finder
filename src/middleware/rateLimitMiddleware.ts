import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MAX_REQUESTS_PER_HOUR = 30;
const REQUEST_WINDOW_DURATION = 60 * 60 * 1000; // 1 saat milisaniye cinsinden

type RequestCount = {
  timestamp: number;
  count: number;
};

const requestCounts = new Map<string, RequestCount>();

export default function rateLimitMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = req.userId?.toString();
    const ip =
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);
    const now = Date.now();

    if (userId) {
      // Kullanıcı tabanlı sınırlama
      let userRequestCounts = requestCounts.get(userId);
      if (!userRequestCounts) {
        userRequestCounts = {
          timestamp: now,
          count: 0,
        };
        requestCounts.set(userId, userRequestCounts);
      }

      if (now - userRequestCounts.timestamp > REQUEST_WINDOW_DURATION) {
        userRequestCounts.count = 0;
        userRequestCounts.timestamp = now;
      }

      if (userRequestCounts.count >= MAX_REQUESTS_PER_HOUR) {
        return res.status(429).json({
          success: false,
          errors: ["Bir saatte en fazla 30 gönderi ekleyebilirsiniz."],
        });
      }

      userRequestCounts.count++;

      const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
      if (user && user.postCount >= MAX_REQUESTS_PER_HOUR) {
        return res.status(429).json({
          success: false,
          errors: ["Bir saatte en fazla 30 gönderi ekleyebilirsiniz."],
        });
      }

      if (user) {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { postCount: user.postCount + 1 },
        });
      }
    } else {
      // IP tabanlı sınırlama
      let ipRequestCounts = requestCounts.get(ip);
      if (!ipRequestCounts) {
        ipRequestCounts = {
          timestamp: now,
          count: 0,
        };
        requestCounts.set(ip, ipRequestCounts);
      }

      if (now - ipRequestCounts.timestamp > REQUEST_WINDOW_DURATION) {
        ipRequestCounts.count = 0;
        ipRequestCounts.timestamp = now;
      }

      if (ipRequestCounts.count >= MAX_REQUESTS_PER_HOUR) {
        return res.status(429).json({
          success: false,
          errors: ["Bir saatte en fazla 30 gönderi ekleyebilirsiniz."],
        });
      }

      ipRequestCounts.count++;
    }

    return handler(req, res);
  };
}
