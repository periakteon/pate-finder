import { verifyJwtToken } from "./utils/verifyJwtToken.js";
import { NextResponse } from "next/server";
import { isAuthPages } from "./utils/isAuthPages";

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

  /**
   * cookie'deki token bilgileri random veya değiştirilmiş olabilir,
   * bu yüzden token'ı kontrol etmemiz gerekiyor
   * bunu kontrol etmek için öncelikle "token" var mı diye bakıyoruz,
   * eğer "token" varsa "verifyJwtToken" fonksiyonu ile token'ın sahih olup olmadığını kontrol etmemiz gerekiyor
   * bunun için de verifyJwtToken fonksiyonunu oluşturuyoruz ve parametre olarak token'ı veriyoruz
   */
  const hasVerifiedToken = token && (await verifyJwtToken(token));

  console.log("hasVerifiedToken:", hasVerifiedToken);

  /**
   * infinite loop'a girmemek için (çünkü hasVerifiedToken aşağıda false dönüyorsa login'e redirect ediyor, login'de de aynı işlemi yapıyor ve TOO_MANY_REDIRECTS hatası alıyoruz)
   * bunun için request'in içerisinden gelen nextUrl'i, yani kullanıcının gitmek istediği linki alıyoruz
   * buradaki nextUrl, kullanıcının gitmek istediği linki temsil ediyor
   * nextUrl.pathname ile de kullanıcının gitmek istediği linkin path'ini alıyoruz
   * "nextUrl.pathname" mesela şöyle bir şey olabilir: "/login"
   * eğer "nextUrl.pathname" bizim AUTH_PAGES içerisindeki url'lerden biri ile eşleşiyorsa, true dönecek
   */
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  /**
   * eğer AUTH_PAGES içerisindeki url'lerden biri ile eşleşiyorsa, yani isAuthPageRequested true döndürürse
   * ne tür bir reponse verilmesi gerektiğini yazıyoruz
   */
  if (isAuthPageRequested) {
    /**
     * eğer AUTH_PAGES içerisindeki url'lerden biri ile eşleşiyorsa, yani isAuthPageRequested true döndürürse ve,
     * request isteği atan kullanıcının token'ı geçerli değilse, yani hasVerifiedToken false döndürürse
     * bu isteği atan kullanıcı login olmaya aday bir kullanıcıdır, dolayısıyla gitmek istediği sayfaya (yani "next"e, mesela "/login" sayfasına) yönlendiririz
     */
    if (!hasVerifiedToken) {
      const response = NextResponse.next();

      return response;
    }

    /**
     * eğer AUTH_PAGES içerisindeki url'lerden biri ile eşleşiyorsa, yani isAuthPageRequested true döndürürse ve,
     * request isteği atan kullanıcının token'ı geçerliyse, yani hasVerifiedToken true döndürürse
     * bu isteği atan kullanıcı login olmuş bir kullanıcıdır
     * dolayısıyla "/login" sayfasına girmesinin bir mantığı yoktur
     * bu yüzden "/myprofile" sayfasına yönlendiriyoruz ("/" adresine de yönlendirebiliriz)
     */
    if (hasVerifiedToken) {
      const response = NextResponse.redirect(new URL("/myprofile", url));
      return response;
    }
  }

  if (!hasVerifiedToken) {
    /**
     * token geçerli değilse, yani hasVerifiedToken false döndürürse
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
