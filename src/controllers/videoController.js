export const trending = (req, res) => {
  res.render("home");
}

export const see = (req, res) => {
  console.log(req.params);
  res.render("watch");
}

export const edit = (req, res) => {
  console.log(req.params);
  res.render("edit");
}

export const search = (req, res) => {
  res.send("Search");
}

export const upload = (req, res) => {
  res.send("Uplaod");
}

export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("Remove Video");
}