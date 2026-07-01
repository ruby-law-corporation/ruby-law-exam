import type { ApiError, ApiSuccess } from '@app/types';

export async function requestData<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  const body = (await response.json().catch(() => null)) as
    ApiSuccess<T> | ApiError | null;

  if (!response.ok || !body || 'error' in body) {
    const message =
      body && 'error' in body
        ? body.error.message
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return body.data;
}
