import type { Request, Response } from 'express';

export interface SseStream {
  send(data: unknown): void;
  close(): void;
  onClose(fn: () => void): void;
}

export function openSseStream(req: Request, res: Response): SseStream {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  return {
    send: (data) => res.write(`data: ${JSON.stringify(data)}\n\n`),
    close: () => res.end(),
    onClose: (fn) => req.on('close', fn),
  };
}
