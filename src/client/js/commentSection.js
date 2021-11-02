const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector("#commentForm");
const input = form.querySelector("input");
const button = form.querySelector("button");
const deleteComment = document.querySelectorAll(".comment__delete");

const commentsLength = isPlus => {
  const commentsLengthElem = document.querySelector(
    ".video__comments--length span"
  );
  const commentLength = commentsLengthElem.innerText.replace(/[^0-9]/g, "");
  const length = isPlus
    ? parseInt(commentLength) + 1
    : parseInt(commentLength) - 1;
  commentsLengthElem.innerText = `댓글 ${length}개`;
};

const fakeDeletComment = commentElem => {
  commentElem.remove();
  commentsLength(false);
};

const handleDeleteComment = async e => {
  const videoId = videoContainer.dataset.id;
  const li = e.currentTarget.parentElement;
  const commentId = li.dataset.id;
  await fetch(`/api/videos/${videoId}/comment/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commentId,
    }),
  });
  fakeDeletComment(li);
};

const addComment = (text, json) => {
  const {
    user: { _id, avatarUrl, name },
    comment,
  } = json;
  const avatarUrlSrc = avatarUrl.startsWith("http")
    ? avatarUrl
    : `/${avatarUrl}`;
  const videoComments = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.dataset.id = comment._id;
  li.className = "video__comment-wrapper";
  li.innerHTML = `
    <div class="video__comment__column">
      <a href=/users/${_id}>
        <img class="video__comments--avatar" src=${avatarUrlSrc} crossorigin>
      </a>
    </div>
    <div class="video__comment__column">
      <div class="video__comment-owner">
        <div>${name}</div>
        <div>${new Date(comment.createAt).toLocaleDateString()}</div>
      </div>
      <div class="video__comment">
        <span>${text}</span>
      </div>
    </div>
    <div class="video__comment__column comment__delete deleteBtn">
      <span>삭제</span>
    </div>
  `;
  videoComments.prepend(li);
  commentsLength(true);
  const deleteBtn = document.querySelector(".deleteBtn");
  deleteBtn.addEventListener("click", handleDeleteComment);
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

const handleInput = () => {
  if (input.value) {
    changeAddCommentBtnColor("#3ea6ff", "#030303");
  } else {
    changeAddCommentBtnColor("#ffffff1a", "#aaaaaa");
  }
};

form.addEventListener("submit", handleSubmit);
input.addEventListener("input", handleInput);
deleteComment.forEach(item =>
  item.addEventListener("click", handleDeleteComment)
);
