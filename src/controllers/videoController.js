import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (errot, videos) => {});
  res.render("home", { pageTitle: "Home"});
}

export const watch = (req, res) => {
  const { id } = req.params;
  res.render("watch", { pageTitle: `Watching` });
}

export const getEdit = (req, res) => {
  const { id } = req.params;
  res.render("edit", { pageTitle: `Editing`});
}

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
}

export const getUpload = (req,res) => {
  res.render("upload",{ pageTitle : `Upload Video`});
}

export const postUpload = (req,res) => {
  const {title} = req.body;
  res.redirect("/");
}
