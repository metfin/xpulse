import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchClient<T>(
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const finalHeaders: Record<string, string> = { ...headers };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Fetch error: ${res.status}`;
    try {
      const err = await res.json();
      msg += ` - ${err.message || JSON.stringify(err)}`;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
