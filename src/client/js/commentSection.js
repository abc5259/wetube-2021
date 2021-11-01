const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector("#commentForm");
const input = form.querySelector("input");
const button = form.querySelector("button");

const addComment = (text, json) => {
  const { user, comment } = json;
  const videoComments = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.dataset.id = comment._id;
  li.className = "video__comment-wrapper";
  li.innerHTML = `
    <div class="video__comment__column">
      <a href=/users/${user._id}>
        <img class="video__comments--avatar" src=${user.avatarUrl} crossorigin>
      </a>
    </div>
    <div class="video__comment__column">
      <div class="video__comment-owner">
        <div>${user.name}</div>
        <div>${new Date(comment.createAt).toLocaleDateString()}</div>
      </div>
      <div class="video__comment">
        <span>${comment.text}</span>
      </div>
    </div>
    <div class="video__comment__column">
      <span>삭제</span>
    </div>
  `;
  videoComments.prepend(li);
};

const handleSubmit = async e => {
  e.preventDefault();
  const text = input.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  const json = await response.json();
  console.log(json);
  if (response.status === 201) {
    input.value = "";
    addComment(text, json);
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
