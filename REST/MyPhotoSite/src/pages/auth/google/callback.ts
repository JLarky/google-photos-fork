import type { APIRoute } from "astro";
import { getOAuth2Client } from "../../../oauth";

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

	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
			"Set-Cookie": `gp_token=${r.tokens.access_token}; Path=/; HttpOnly; Secure`,
		},
	});
};
