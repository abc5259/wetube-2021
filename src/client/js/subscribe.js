const subscribe = document.querySelector(".subscribe");
const span = subscribe.querySelector("span");

const handleSubscribe = e => {
  if (span.innerText === "구독") {
    // await fetch(`/api/users/`);
  } else {
    console.log("no");
  }
};

subscribe.addEventListener("click", handleSubscribe);
