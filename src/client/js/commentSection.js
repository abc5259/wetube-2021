const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector("#commentForm");
const input = form.querySelector("input");
const button = form.querySelector("button");

const addComment = text => {
  const videoComments = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.innerText = text;
  videoComments.prepend(li);
};

const handleSubmit = async e => {
  e.preventDefault();
  const text = input.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  input.value = "";
  if (status === 201) {
    addComment(text);
    changeAddCommentBtnColor("#ffffff1a", "#aaaaaa");
  }
};

const changeAddCommentBtnColor = (backgroundColor, color) => {
  button.style.backgroundColor = backgroundColor;
  button.style.color = color;
};

const handlerInput = () => {
  if (input.value) {
    changeAddCommentBtnColor("#3ea6ff", "#030303");
  } else {
    changeAddCommentBtnColor("#ffffff1a", "#aaaaaa");
  }
};

form.addEventListener("submit", handleSubmit);
input.addEventListener("input", handlerInput);
