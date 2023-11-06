const directions = {
  UP_ENTER: "up_enter",
  UP_LEAVE: "up_leave",
  DOWN_ENTER: "down_enter",
  DOWN_LEAVE: "down_leave",
};
const rootEl = document.querySelector("#root-area");
const observedEl = document.querySelector("#animated-el");

const options = {
  root: rootEl,
  rootMargin: "0px",
  threshold: 0,
};

const intersectionState = {
  prevY: 0,
  prevRatio: 0,
};

const entryDirection = (entry, state) => {
  const currY = entry.boundingClientRect.y;
  const currRatio = entry.intersectionRatio;
  const isIntersecting = entry.isIntersecting;

  if (currY < state.prevY) {
    if (currRatio > state.prevRatio && isIntersecting) {
      return directions.DOWN_ENTER;
    } else {
      return directions.DOWN_LEAVE;
    }
  } else if (currY > state.prevY && isIntersecting) {
    if (currRatio < state.prevRatio) {
      return directions.UP_LEAVE;
    } else {
      return directions.UP_ENTER;
    }
  }
};

const callback = (entryArray) => {
  const entry = entryArray[0];
  if (entryDirection(entry, intersectionState) === directions.UP_ENTER) {
    console.log("Entrei");
  }
};

const observer = new IntersectionObserver(callback, options);
observer.observe(observedEl);
