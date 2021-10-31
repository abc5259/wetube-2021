const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector("#commentForm");

const addComment = text => {
  const videoComments = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  li.innerText = text;
  videoComments.prepend(li);
};

const handleSubmit = async e => {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
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
  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
};

form.addEventListener("submit", handleSubmit);
