export const trending = (req, res) => {
  res.send("Home Page Videos");
}

export const see = (req, res) => {
  console.log(req.params);
  res.send("see");
}

export const edit = (req, res) => {
  console.log(req.params);
  res.send("Edit");
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