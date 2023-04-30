import { verifyJwtToken } from "@/utils/verifyJwtToken.js";
import { NextResponse } from "next/server";

export const authMiddleware = async (request) => {
  /**
   * url: anlık içerisinde bulunan url
   * nextUrl: yönlendirilecek url
   * cookies: cookie bilgileri, token'ı tutmak için
   */
  const { url, nextUrl, cookies } = request;

  /**
   * "const token = cookies.get("token")" şeklinde yazdığımızda şöyle bir obje dönüyor:
   *
   * {
   *  key: "token",
   *  value: "token değeri",
   * }
   *
   * sadece "value" değerini almak istediğimiz için value key'ini destruct ediyoruz ve "token" isminde bir değişkene atıyoruz
   * coalesce işlemi yapıyoruz, eğer value değeri yoksa null döndürüyoruz
   */
  const { value: token } = cookies.get("token") ?? { value: null };

  console.log("Cookie'deki token'in değeri:", token);

  /**
   * cookie'deki token bilgileri random veya değiştirilmiş olabilir,
   * bu yüzden token'ı kontrol etmemiz gerekiyor
   * bunu kontrol etmek için öncelikle "token" var mı diye bakıyoruz,
   * eğer "token" varsa "verifyJwtToken" fonksiyonu ile token'ın sahih olup olmadığını kontrol etmemiz gerekiyor
   * bunun için de verifyJwtToken fonksiyonunu oluşturuyoruz ve parametre olarak token'ı veriyoruz
   */
  const isVerifiedToken = token && (await verifyJwtToken(token));

  console.log("isVerifiedToken:", isVerifiedToken);

  if (!isVerifiedToken) {
    /**
     * token geçerli değilse, yani isVerifiedToken false döndürürse
     * kullanıcıyı login sayfasına yönlendiriyoruz
     */
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
};

// hangi sayfalarda kontrol yapmak istediğimizi belirtiyoruz
// halihazırda login yapmışsa, "login" ve "register" route'larına erişemesin
export const config = {
  matcher: ["/login", "/register", "/myprofile"],
};

export default authMiddleware;
