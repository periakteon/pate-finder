import { verifyJwtToken } from "../utils/verifyJwtToken.js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"

const authMiddleware = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    
    // 1. Cookie'deki "token"ın değerini al ve JWT ile verify et. 
    const cookies = cookie.parse(req.headers.cookie || '')
    const token = cookies.token
    const verifiedToken = await verifyJwtToken(token)

    if (!verifiedToken) {
      throw new Error('Bunu yapmaya yetkiniz yok')
    }
    
    // 2. Token'ı decoded hale getir ve "id"yi kullanıcının id'si ile eşitle.
    const userId = Number(verifiedToken.id)

    // Call the API route handler with the updated request object
    return handler({ ...req, userId }, res)
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: 'Bunu yapmaya yetkiniz yok' })
  }
}

export default authMiddleware;
