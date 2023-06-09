import crypto from "crypto";

export const hashPassword = (password: string | number, salt: string) => {
  const hash = crypto
    .createHash("sha256")
    .update(`${salt}${password}`)
    .digest("hex");
  return { salt, hash };
};
