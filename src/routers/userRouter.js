import express from "express";

const userRouter = express.Router();

const handleEditUSer = (req, res) => {
  res.send("Edit User");
}

userRouter.get("/edit", handleEditUSer);

export default userRouter;