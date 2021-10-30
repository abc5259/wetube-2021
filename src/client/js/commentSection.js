const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector("#commentForm");

const handleSubmit = e => {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: {
      text,
    },
  });
};

form.addEventListener("submit", handleSubmit);
