import { Request, Response } from "express";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const exists = await userModel.findByUsername(username);
    if (exists) {
      res.status(409).json({ message: "Username taken" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      password: hashed,
      firstname,
      lastname,
    });

    const { password: _p, ...publicUser } = user;
    res.status(201).json(publicUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const user = await userModel.findByUsername(username);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    (req.session as any).username = user.username;
    res.json({ message: "Logged in", username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session?.destroy?.((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out" });
  });
};

export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sessionUsername = (req.session as any)?.username;
    if (!sessionUsername) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await userModel.findByUsername(sessionUsername);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password: _p, ...publicUser } = user;
    res.json(publicUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
