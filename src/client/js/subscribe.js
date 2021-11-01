const subscribe = document.querySelector(".subscribe");
const span = subscribe.querySelector("span");

const handleSubscribe = async e => {
  const { userid } = subscribe.dataset;
  if (span.innerText === "구독") {
    await fetch("/api/users/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
      }),
    });
  } else {
    await fetch("/api/users/cancelSubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
      }),
    });
  }
};

subscribe.addEventListener("click", handleSubscribe);

// watch에서 보내면 video owner로 찾으면 되고
// user profile로 보내면  user id로 보내면 되기는 한데..???????
