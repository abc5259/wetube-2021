const subscribe = document.querySelector(".subscribe");
const span = subscribe.querySelector("span");

const subscribesLength = isPlus => {
  const subscribeLength = document.querySelector(".subscribers__length")
    ? document.querySelector(".subscribers__length")
    : false;
  if (!subscribeLength) {
    return;
  }
  const subscribeNumber = subscribeLength.innerText.replace(/[^0-9]/g, "");
  const length = isPlus
    ? parseInt(subscribeNumber) + 1
    : parseInt(subscribeNumber) - 1;
  subscribeLength.innerText = `구독자 ${length}명`;
};

const paintSubscribe = (text, color, backgroundColor) => {
  span.innerText = text;
  subscribe.style.color = color;
  subscribe.style.backgroundColor = backgroundColor;
};

const handleSubscribe = async e => {
  const { userid } = subscribe.dataset;
  if (span.innerText === "구독") {
    const response = await fetch("/api/users/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
      }),
    });
    console.log(response.status);
    if (response.status === 200) {
      paintSubscribe("구독중", "#AAAAAA", "#FFFFFF1A");
      subscribesLength(true);
    }
  } else {
    const response = await fetch("/api/users/cancelSubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
      }),
    });
    if (response.status === 200) {
      paintSubscribe("구독", "#ffffff", "#cc0000");
      subscribesLength(false);
    }
  }
};

if (span.innerText === "구독중") {
  paintSubscribe("구독중", "#AAAAAA", "#FFFFFF1A");
}

subscribe.addEventListener("click", handleSubscribe);
