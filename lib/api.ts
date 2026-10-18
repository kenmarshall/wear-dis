import type { OutfitsRequest, OutfitsResponse } from "./schemas";

// Browser-side helpers for the app's API routes.

export class ApiError extends Error {}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new ApiError(`${url} responded ${response.status}`);
  }
  return (await response.json()) as T;
}

export function fetchOutfits(request: OutfitsRequest): Promise<OutfitsResponse> {
  return postJson<OutfitsResponse>("/api/outfits", request);
}
