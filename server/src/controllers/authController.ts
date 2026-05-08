import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens';

const isProduction = process.env.NODE_ENV === 'production';

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'none' as const : 'strict' as const,
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const accessCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'none' as const : 'strict' as const,
  secure: isProduction,
  maxAge: 15 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? 'none' as const : 'strict' as const,
  secure: isProduction,
};

const buildUserResponse = (user: IUser) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  res.status(201).json({ message: 'Registered successfully' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }) as IUser;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('jwt', refreshToken, refreshCookieOptions);

  res.json({ user: buildUserResponse(user) });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId) as IUser;

    if (!user || user.refreshToken !== token) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('accessToken', newAccessToken, accessCookieOptions);
    res.cookie('jwt', newRefreshToken, refreshCookieOptions);

    res.json({
      user: buildUserResponse(user),
    });
  } catch {
    return res.sendStatus(403);
  }
};


export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(204);

  const user = await User.findOne({ refreshToken: token }) as IUser;
  if (user) {
    user.refreshToken = '';
    await user.save();
  }

  res.clearCookie('accessToken', clearCookieOptions);
  res.clearCookie('jwt', clearCookieOptions);
  res.json({ message: 'Logged out' });
};
