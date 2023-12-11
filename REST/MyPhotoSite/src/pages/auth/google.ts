import type { APIRoute } from "astro";
import { OAuth2Client } from "google-auth-library";

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  let keys = import.meta.env.GOOGLE_KEYS_JSON;
  if (!keys) {
    throw new Error(
      "GOOGLE_KEYS_JSON wasn't set. Please follow https://developers.google.com/photos/library/guides/get-started https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest etc to create OAuth client and download client_secret_XXX.json file. Save the whole file content to GOOGLE_KEYS_JSON env variable."
    );
  }
  keys = JSON.parse(keys);
  const oAuth2Client = new OAuth2Client(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile",
  });

  return new Response("Hello, world!! " + authorizeUrl, {});
};
