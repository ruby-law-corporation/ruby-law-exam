import { useEffect, useRef } from 'react';

export interface SseHandlers<T> {
  onMessage: (data: T, close: () => void) => void;
  onError: (message: string) => void;
}

export function subscribeSse<T>(
  url: string,
  { onMessage, onError }: SseHandlers<T>,
): () => void {
  const source = new EventSource(url);
  let closed = false;
  const close = () => {
    closed = true;
    source.close();
  };

  source.onmessage = (event) => onMessage(JSON.parse(event.data) as T, close);
  source.onerror = () => {
    if (closed) return;
    close();
    onError('Lost connection to the stream');
  };

  return close;
}

export function useSse<T>(url: string, handlers: SseHandlers<T>): void {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(
    () =>
      subscribeSse<T>(url, {
        onMessage: (data, close) => latest.current.onMessage(data, close),
        onError: (message) => latest.current.onError(message),
      }),
    [url],
  );
}
