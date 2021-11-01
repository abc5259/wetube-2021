const subscribe = document.querySelector(".subscribe");
const span = subscribe.querySelector("span");

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
    }
  }
};

if (span.innerText === "구독중") {
  paintSubscribe("구독중", "#AAAAAA", "#FFFFFF1A");
}

subscribe.addEventListener("click", handleSubscribe);
