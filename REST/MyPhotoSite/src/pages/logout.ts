import type { APIRoute } from "astro";

export const GET: APIRoute = ({ cookies }) => {
	cookies.delete("gp_token");
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/",
		},
	});
};
