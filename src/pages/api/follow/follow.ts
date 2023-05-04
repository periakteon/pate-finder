import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handleFollowRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { followerId, followingId } = req.body

  if (!followerId || !followingId) {
    return res.status(400).json({ message: 'Hatalı veya eksik ID' })
  }
  try {
    const follower = await prisma.user.findUnique({
      where: { id: Number(followerId) },
    })
    console.log("followerId: ", follower);
    if (!follower) {
      return res.status(404).json({ message: 'Takipçi bulunamadı.' })
    }

    const following = await prisma.user.findUnique({
      where: { id: Number(followingId) },
    })
    console.log("followingId: ", following);
    if (!following) {
      return res.status(404).json({ message: 'Takip edilecek olan kişi bulunamadı.' })
    }
    console.log("ok");
    
    const existingFollow = await prisma.follows.findUnique({      
      where: {
        followerId_followingId: {
          followerId: Number(follower.id),
          followingId: Number(following.id),
        },
      },
    })
    if (existingFollow) {
      return res.status(200).json({ message: 'Kullanıcı zaten takip ediliyor.' })
    }    
    const follow = await prisma.follows.create({
      data: {
        follower:{ 
          connect: { id: Number(follower.id) }
        },
        following: {
          connect: { id: Number(following.id) }
        },
      },
    })
    console.log("Takip işlemi başarılı!");
    
    res.status(200).json({message: "Takip başarılı!", follow})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}