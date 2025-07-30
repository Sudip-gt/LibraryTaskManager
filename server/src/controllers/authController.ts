import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, role });

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

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, user: { id: user._id, name: user.name, role: user.role } });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId) as IUser;

    if (!user || user.refreshToken !== token) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    res.json({ accessToken: newAccessToken });
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

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict', secure: true });
  res.json({ message: 'Logged out' });
};
