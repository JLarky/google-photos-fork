import { OAuth2Client } from "google-auth-library";

export function getOAuth2Client(url?: URL) {
	const keysString = import.meta.env.GOOGLE_KEYS_JSON;
	if (!keysString) {
		throw new Error(
			"GOOGLE_KEYS_JSON wasn't set. Please follow https://developers.google.com/photos/library/guides/get-started https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest etc to create OAuth client and download client_secret_XXX.json file. Save the whole file content to GOOGLE_KEYS_JSON env variable.",
		);
	}
	const keys = JSON.parse(keysString);
	let redirectUri: string | undefined;
	if (url) {
		const redirectUrl = new URL(url);
		redirectUrl.pathname = "/auth/google/callback";
		redirectUrl.search = "";
		redirectUri = redirectUrl.toString();
		if (!keys.web.redirect_uris.includes(redirectUri)) {
			throw new Error(
				`GOOGLE_KEYS_JSON.web.redirect_uris doesn't include ${redirectUri}. Please update your oauth client configuration and download the new client_secret_XXX.json file.`,
			);
		}
	}
	const oAuth2Client = new OAuth2Client(
		keys.web.client_id,
		keys.web.client_secret,
		redirectUri,
	);
	return oAuth2Client;
}
