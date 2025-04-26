import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import authRouter from "./routers/authRouter";
import reservationRouter from "./routers/reservationRouter";
import placeRouter from "./routers/placeRouter";
import imageRouter from "./routers/imageRouter";
import reviewRouter from "./routers/reviewRouter";
import userRouter from "./routers/userRouter";
import path from "path";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27018/booking";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

app.use("/api/auth", authRouter);
app.use("/api/reservation", reservationRouter);
app.use("/api/place", placeRouter);
app.use("/api/review", reviewRouter);
app.use("/api/user", userRouter);
app.use("/image", imageRouter);

if (process.env.NODE_ENV === "production") {
  const dirname = path.resolve();
  console.log(dirname);
  app.use(express.static(path.join(dirname, "/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(dirname, "dist", "index.html"))
  );
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
