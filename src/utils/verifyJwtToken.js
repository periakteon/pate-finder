import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!jwtSecretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  /**
   * TextEncoder() ile jwtSecretKey'i Uint8Array tipine çeviriyoruz
   * çünkü jwtVerify fonksiyonu Uint8Array tipinde bir parametre alıyor
   * Jose dokümantasyonundan aldım aşağıdaki kodu
   */
  return new TextEncoder().encode(jwtSecretKey);
};

export const verifyJwtToken = async (token) => {
  try {
    /**
     * JWT aslında üç parçadan oluşuyor: header, payload ve signature
     * bizim için önemli olan kısım payload kısmı
     * payload kısmında kullanıcıya ait bilgiler bulunuyor
     * yalnızca "payload" almak için verify edilen token'ın dönüş değerini destruct ediyoruz - yalnızca payload'ı alacak şekilde
     */
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    console.log("Dönen payload:", payload);
    return payload;
  } catch (error) {
    console.log(
      "JWT verify edilirken bir hata oluştu (verifyJwtToken.js): ",
      error,
    );
    return null;
  }
};
