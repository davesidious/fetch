import { intercept, Match } from "intercept-plugin";

export const mockResponse = (
  match: Match = {},
  body?: BodyInit | null,
  headers?: HeadersInit,
) => intercept(match, () => new Response(body, { headers }));
