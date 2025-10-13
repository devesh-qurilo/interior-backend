export async function callApi(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.status === false) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
}
