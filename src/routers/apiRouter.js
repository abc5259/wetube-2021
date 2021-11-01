import express from "express";
import { addSubscribe, cancelSubscribe } from "../controllers/userController";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/users/subscribe", addSubscribe);
apiRouter.post("/users/cancelSubscribe", cancelSubscribe);
apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/comment", createComment);
apiRouter.delete("/videos/:id/comment/delete", deleteComment);

export default apiRouter;
