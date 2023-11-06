
/** Direction constants */
const directions = {
  UP_ENTER: "up_enter",
  UP_LEAVE: "up_leave",
  DOWN_ENTER: "down_enter",
  DOWN_LEAVE: "down_leave",
};

/** Scroll area and animated elements */
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
  /** Function uses previous rect data to derive direction and if entering or leaving */
  const currY = entry.boundingClientRect.y;
  const currRatio = entry.intersectionRatio;
  const isIntersecting = entry.isIntersecting;

  /** Current Y < Previous Y indicates downwards motion of observed el */
  if (currY < state.prevY) {
    /** Current Ratio > Previous Ratio indicates element is entering viewport*/
    /** Is intersecting indicates element is on screen and therefore not leaving */
    if (currRatio > state.prevRatio && isIntersecting) {
      return directions.DOWN_ENTER;
    } else {
      return directions.DOWN_LEAVE;
    }
    /** Current Y > Previous Y indicates upwards motion of observed el */
  } else if (currY > state.prevY && isIntersecting) {
    /** Current Ratio < Previous Ratio indicates element is leaving viewport*/
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
    const styles = observedEl.getAttribute("data-animation");
    for (let style of styles?.split(";")) {
      const [key, val] = style.split(":");
      observedEl.style[key.trim()] = val.trim();
      console.log(style);
    }
  }
};

const observer = new IntersectionObserver(callback, options);
observer.observe(observedEl);
