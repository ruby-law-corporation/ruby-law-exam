import type { NextFunction, Request, RequestHandler, Response } from 'express';

export function asyncHandler<P>(
  handler: (
    req: Request<P>,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler<P> {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
