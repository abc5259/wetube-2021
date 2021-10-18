
export const trending = (req, res) => {
  const videos = [
    {
      title:"First Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title:"Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title:"Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    }
  ]
  res.render("home", { pageTitle: "Home", videos});
}

export const see = (req, res) => {
  console.log(req.params);
  res.render("watch", { pageTitle: "Video" });
}

export const edit = (req, res) => {
  console.log(req.params);
  res.render("edit", { pageTitle: "Edit" });
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