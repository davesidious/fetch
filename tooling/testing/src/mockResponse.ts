import { intercept, Match } from "@davesidious/intercept-plugin";

export const mockResponse = (
  match: Match = {},
  body?: BodyInit | null,
  headers?: HeadersInit,
  status?: number,
) => intercept(match, () => new Response(body, { status, headers }));
