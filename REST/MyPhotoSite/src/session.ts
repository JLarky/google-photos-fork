import { V3 } from "paseto";
import jwt from "jsonwebtoken";
import { secretKey } from "./config";

export async function parseSession(token: string | undefined) {
  if (!token) {
    return;
  }
  let sessionToken:
    | undefined
    | {
        access_token: string;
        id_token: string;
      };
  try {
    sessionToken = await V3.decrypt(token, secretKey);
  } catch (e) {}

  if (sessionToken) {
    const x = jwt.decode(sessionToken.id_token);
    if (typeof x === "string" || !x) {
      console.error("Invalid id_token");
      return;
    }
    const { sub: userId, name: name, picture: avatarUrl } = x;
    return { sessionToken, profile: { userId, name, avatarUrl } };
  }
  return;
}
