// Create your server
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import userRouter from "./routes/user.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:4321",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/users", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Invalid route!",
  });
});

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("Missing port!");
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
