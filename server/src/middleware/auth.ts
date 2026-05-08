import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : undefined;
  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

export const requireAdmin = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
