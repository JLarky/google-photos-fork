import type { APIRoute } from "astro";
import { OAuth2Client } from "google-auth-library";
import { scopes } from "../../config";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
	const keysString = import.meta.env.GOOGLE_KEYS_JSON;
	if (!keysString) {
		throw new Error(
			"GOOGLE_KEYS_JSON wasn't set. Please follow https://developers.google.com/photos/library/guides/get-started https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest etc to create OAuth client and download client_secret_XXX.json file. Save the whole file content to GOOGLE_KEYS_JSON env variable.",
		);
	}
	const keys = JSON.parse(keysString);
	const redirectUrl = new URL(url);
	redirectUrl.pathname = "/auth/google/callback";
	const redirectUri = redirectUrl.toString();
	if (!keys.web.redirect_uris.includes(redirectUri)) {
		throw new Error(
			`GOOGLE_KEYS_JSON.web.redirect_uris doesn't include ${redirectUri}. Please update your oauth client configuration and download the new client_secret_XXX.json file.`,
		);
	}
	const oAuth2Client = new OAuth2Client(
		keys.web.client_id,
		keys.web.client_secret,
		redirectUri,
	);

	// Generate the url that will be used for the consent dialog.
	const authorizeUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizeUrl,
		},
	});
};
