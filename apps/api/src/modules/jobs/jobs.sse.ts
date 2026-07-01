import type { SseStream } from '../../platform/http/sse';
import type { Job } from './jobs.store';

export function streamJob<T>(
  job: Job<T>,
  stream: SseStream,
  isTerminal: (event: T) => boolean,
): void {
  stream.send(job.lastEvent);
  if (isTerminal(job.lastEvent)) {
    stream.close();
    return;
  }

  const onEvent = (event: T) => {
    stream.send(event);
    if (isTerminal(event)) {
      stream.close();
    }
  };

  job.emitter.on('event', onEvent);
  stream.onClose(() => job.emitter.off('event', onEvent));
}
