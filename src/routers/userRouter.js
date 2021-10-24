import express from "express";
import {
  see,
  getEdit,
  logout,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getChangePssword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectedMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectedMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectedMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .all(protectedMiddleware)
  .get(getChangePssword)
  .post(postChangePassword);
userRouter.get("/:id", see);

export default userRouter;
