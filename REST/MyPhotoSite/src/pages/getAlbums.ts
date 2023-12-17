import type { APIRoute } from "astro";
import { parseSession } from "../session";
import { libraryApiGetAlbums } from "../photos";

export const prerender = false;

const albumCache = {
  getItem: (_?: string) => undefined,
  setItem: (_?: string, __?: any) => undefined,
  removeItem: (_?: string) => undefined,
};

export const GET: APIRoute = async ({ params, request, cookies }) => {
  const token = cookies.get("gp_token");
  const session = await parseSession(token?.value);

  console.info("Loading albums");
  const userId = session?.profile.userId;

  // Attempt to load the albums from cache if available.
  // Temporarily caching the albums makes the app more responsive.
  const cachedAlbums = albumCache.getItem(userId);
  if (cachedAlbums) {
    console.log("Loaded albums from cache.");
    res.status(200).send(cachedAlbums);
  } else {
    console.log("Loading albums from API.");
    // Albums not in cache, retrieve the albums from the Library API
    // and return them
    const data = await new Promise((resolve, reject) => {
      const generator = libraryApiGetAlbums(session?.sessionToken.access_token);
      const promise = generator.next();
      promise.then((result) => {
        // TODO: result.done check
        const x = result.value;
        if (x && x.albums) {
          resolve({ albums: x.albums });
        } else {
          reject(x);
        }
      });
    });
    if (data.error) {
      // Error occured during the request. Albums could not be loaded.
      returnError(res, data);
      // Clear the cached albums.
      albumCache.removeItem(userId);
    } else {
      // Albums were successfully loaded from the API. Cache them
      // temporarily to speed up the next request and return them.
      // The cache implementation automatically clears the data when the TTL is
      // reached.
      albumCache.setItem(userId, data);
      return new Response(JSON.stringify(data));
    }
  }
  return new Response(
    JSON.stringify({
      message: "This was a GET!",
    })
  );
};
