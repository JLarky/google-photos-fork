import * as config from "./config";

const logger = {
	verbose: console.log,
	debug: console.log,
	info: console.info,
	error: console.error,
};

// Returns a list of all albums owner by the logged in user from the Library
// API.
export async function* libraryApiGetAlbums(authToken: string) {
	let counter = 0;
	let nextPageToken = null;
	let error = null;

	let parameters = new URLSearchParams();
	parameters.append("pageSize", "" + config.albumPageSize);

	try {
		// Loop while there is a nextpageToken property in the response until all
		// albums have been listed.
		do {
			logger.verbose(`Loading albums. Received so far: ${counter}`);
			// Make a GET request to load the albums with optional parameters (the
			// pageToken if set).
			const albumResponse = await fetch(
				config.apiEndpoint + "/v1/albums?" + parameters,
				{
					method: "get",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + authToken,
					},
				},
			);

			const result = await checkStatus<{
				albums: {
					id: string;
					title: string;
					productUrl: string;
					mediaItemsCount: string;
					coverPhotoBaseUrl: string;
					coverPhotoMediaItemId: string;
				}[];
			}>(albumResponse);

			logger.debug(`Response: ${result}`);

			if (result && result.albums) {
				logger.verbose(`Number of albums received: ${result.albums.length}`);
				// Parse albums and add them to the list, skipping empty entries.
				const items = result.albums.filter((x) => !!x);

				counter += items.length;

				yield {albums: items};
			}
			if (result.nextPageToken) {
				parameters.set("pageToken", result.nextPageToken);
			} else {
				parameters.delete("pageToken");
			}

			// Loop until all albums have been listed and no new nextPageToken is
			// returned.
		} while (parameters.has("pageToken"));
	} catch (err) {
		// Log the error and prepare to return it.
		error = err;
		logger.error(error);
	}

	logger.info("Albums loaded.");
	if (error) yield {error};
}

// Return the body as JSON if the request was successful, or thrown a StatusError.
async function checkStatus<T>(response: Response): Promise<T> {
	if (!response.ok) {
		// Throw a StatusError if a non-OK HTTP status was returned.
		let message = "";
		try {
			// Try to parse the response body as JSON, in case the server returned a useful response.
			message = await response.json();
		} catch (err) {
			// Ignore if no JSON payload was retrieved and use the status text instead.
		}
		throw new StatusError(response.status, response.statusText, message);
	}

	// If the HTTP status is OK, return the body as JSON.
	return await response.json();
}

// Custom error that contains a status, title and a server message.
class StatusError extends Error {
	constructor(status: number, title: string, serverMessage: string, ...params: undefined[]) {
		super(`[${status}] ${title}. ${JSON.stringify(serverMessage)}`, ...params);
		const that = this as any
		that.status = status;
		that.statusTitle = title;
		that.serverMessage = serverMessage;
	}
}
