const AUTH_PAGES = ["/login", "/register"];

/**
 * öncelikle middleware'deki request'ten gelen "url"yi parametre olarak verip gelen url'i AUTH_PAGES içerisindeki url'ler ile karşılaştırıyoruz
 * eğer AUTH_PAGES içerisindeki url'lerden biri ile eşleşiyorsa true dönüyoruz
 * eğer AUTH_PAGES içerisindeki url'lerden hiçbiri ile eşleşmiyorsa false dönüyoruz
 */
export const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));
