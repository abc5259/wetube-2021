import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const exits = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "join",
      errorMessage: "Password confirmation does not match",
    });
  }
  if (exits) {
    return res.status(400).render("join", {
      pageTitle: "join",
      errorMessage: "This username/email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "존재하지 않는 사용자입니다.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.flash("info", "Bye");
  req.session.destroy();
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      email => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        password: "",
        location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const pagetitle = "Edit Profile";
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  if (req.session.user.email !== email) {
    const existEmail = await User.exists({ email });
    if (existEmail) {
      return res.status(400).render("edit-profile", {
        pagetitle,
        errorMessage: "이미 있는 이메일 입니다.",
      });
    }
  }
  if (req.session.user.username !== username) {
    const existUsername = await User.exists({ username });
    if (existUsername) {
      return res.status(400).render("edit-profile", {
        pagetitle,
        errorMessage: "이미 있는 username 입니다.",
      });
    }
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getChangePssword = (req, res) => {
  if (req.session.user.socialOnly) {
    req.flash("error", "Can't change password");
    return res.redirect("/");
  }
  res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { OldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const match = await bcrypt.compare(OldPassword, password);
  if (!match) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "현재 비밀번호가 일치하지 않습니다",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "새로운 비밀번호가 일치하지 않습니다.",
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password Updated");
  req.session.user.password = user.password;
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    req.flash("error", "User not found.");
    return res.status(404).render("404", { pageTitle: "User not found." });
  }
  console.log(user);
  return res.render("users/profile", {
    pageTitle: `${user.name} Profile`,
    user,
  });
};

export const addSubscribe = async (req, res) => {
  const {
    body: { userid },
    session: { user },
  } = req;
  const subscriptionTarget = await User.findById(userid);
  const me = await User.findById(user._id);
  if (!subscriptionTarget) {
    return res.sendStatus(404);
  }
  if (!me) {
    return res.sendStatus(404);
  }
  me.subscribe.push(subscriptionTarget._id);
  subscriptionTarget.subscribers += 1;
  await me.save();
  await subscriptionTarget.save();
  req.session.user = me;
  return res.sendStatus(200);
};

export const cancelSubscribe = async (req, res) => {
  const {
    body: { userid },
    session: { user },
  } = req;
  const subscriptionTarget = await User.findById(userid);
  const me = await User.findById(user._id);
  if (!subscriptionTarget) {
    return res.sendStatus(404);
  }
  if (!me) {
    return res.sendStatus(404);
  }
  me.subscribe.splice(me.subscribe.indexOf(subscriptionTarget._id), 1);
  subscriptionTarget.subscribers -= 1;
  await me.save();
  await subscriptionTarget.save();
  req.session.user = me;
  return res.sendStatus(200);
};
