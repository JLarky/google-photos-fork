import type { APIRoute } from "astro";
import paseto from "paseto";
import { getOAuth2Client } from "../../../oauth";
import { secretKey } from "../../../config";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
	const oAuth2Client = getOAuth2Client(url);
	const code = url.searchParams.get("code");
	if (!code && typeof code !== "string") {
		throw new Error("Code not found");
	}

	// Now that we have the code, use that to acquire tokens.
	const r = await oAuth2Client.getToken(code);
	// Make sure to set the credentials on the OAuth2 client.
	oAuth2Client.setCredentials(r.tokens);

	const gp_token = await paseto.V3.encrypt(r.tokens, secretKey, { expiresIn: "1h" });
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
			"Set-Cookie": `gp_token=${gp_token}; Path=/; HttpOnly; Secure`,
		},
	});
};
