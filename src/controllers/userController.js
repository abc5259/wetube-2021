import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle: "Join"});
}

export const postJoin = async(req, res) => {
  const {name, email, username, password, password2, location} = req.body;
  const exits = await User.exists({$or: [{ username }, { email }]});
  if(password !== password2){
    return res.status(400).render("join", {
      pageTitle: "join",
      errorMessage : "Password confirmation does not match"
    });
  }
  if(exits){
    return res.status(400).render("join", {
      pageTitle: "join",
      errorMessage : "This username/email is already taken."
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location
    })
    return res.redirect("/login");
  } catch(error) {
    return res.status(400).render("join",{ 
      pageTitle : "Join", 
      errorMessage: error._message
    });
  }
}

export const edit = (req, res) => {
  return res.send("Edit");
}

export const remove = (req, res) => {
  return res.send("Remove User");
}

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login"});
}

export const postLogin = async(req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login"
  const user = await User.findOne({username});
  if(!user){
    return res.status(400).render("login", {pageTitle, errorMessage:"존재하지 않는 사용자입니다."})
  }
  const match = await bcrypt.compare(password, user.password);
  if(!match) {
    return res.status(400).render("login",{ 
      pageTitle,
      errorMessage: "Worng Password"
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}

export const logout = (req, res) => {
  return res.send("Logout");
}

export const see = (req, res) => {
  console.log(req.params);
  return res.send("See");
}