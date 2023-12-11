// The scopes to request. The app requires the photoslibrary.readonly and
// plus.me scopes.
export const scopes = [
	"https://www.googleapis.com/auth/photoslibrary.readonly",
	"profile",
];

// The number of photos to load for search requests.
export const photosToLoad = 150;

// The page size to use for search requests. 100 is reccommended.
export const searchPageSize = 100;

// The page size to use for the listing albums request. 50 is reccommended.
export const albumPageSize = 50;

// The API end point to use. Do not change.
export const apiEndpoint = "https://photoslibrary.googleapis.com";
