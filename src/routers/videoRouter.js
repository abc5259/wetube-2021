import express from "express";

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => {
  res.send("Wahch Video");
}

videoRouter.get("/watch", handleWatchVideo);

export default videoRouter;