import { EventEmitter } from 'node:events';

export interface Job<T> {
  emitter: EventEmitter;
  lastEvent: T;
}

const jobs = new Map<string, Job<unknown>>();

export function createJob<T>(id: string, initialEvent: T): Job<T> {
  const job: Job<T> = { emitter: new EventEmitter(), lastEvent: initialEvent };
  jobs.set(id, job as Job<unknown>);
  return job;
}

export function getJob<T>(id: string): Job<T> | undefined {
  return jobs.get(id) as Job<T> | undefined;
}

export function deleteJob(id: string): void {
  jobs.delete(id);
}

export function emitEvent<T>(job: Job<T>, event: T): void {
  job.lastEvent = event;
  job.emitter.emit('event', event);
}
