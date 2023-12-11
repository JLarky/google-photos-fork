# How to

Follow the [Get Started guide](https://developers.google.com/photos/library/guides/get-started).

Make sure to add `Authorized JavaScript origins`:

    http://localhost:4321
    https://something-something.vercel.app

And in `Authorized redirect URI`:

    http://localhost:4321/auth/google/callback
    https://something-something.vercel.app/auth/google/callback

Then go and download your credentials https://console.cloud.google.com/apis/credentials

Make sure that your project is linked to Vercel.

    vercel link

Now save that file in vercel environment variables:

    vercel env add GOOGLE_KEYS_JSON

Or

    cat client_secret_*.apps.googleusercontent.com.json | vercel env add GOOGLE_KEYS_JSON production

Pull JSON secrets from Vercel to `.env` file:

    vercel env pull

Restart your server:

    pnpm run dev
