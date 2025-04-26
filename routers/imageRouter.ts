import express from "express";
import { getImage } from "../controllers/imageController";

const imageRouter = express.Router();

imageRouter.get("/:imageName", getImage);

export default imageRouter;
