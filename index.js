/** Direction constants */
const directions = {
  UP_ENTER: "up_enter",
  UP_LEAVE: "up_leave",
  DOWN_ENTER: "down_enter",
  DOWN_LEAVE: "down_leave",
};

const INTERSECTION_OBSERVER_SUPPORT = "IntersectionObserver" in window;

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

const animatedElements = document.querySelectorAll('[data-animated="false"]');
animatedElements.forEach((element) => {
  // Form closure over object to hold previous state data
  const intersectionState = {
    prevY: 0,
    prevRatio: 0,
  };

  const fn = (entries) => {
    const entry = entries[0];
    // Ensure entry direction is on scroll down
    if (entryDirection(entry, intersectionState) !== directions.UP_ENTER) {
      return;
    }

    // Retrieve styles from data attribute
    const styles = element.getAttribute("data-animation");
    if (typeof styles !== "string") return;

    // Inject styles into element
    styles.split(";").forEach((style) => {
      const [key, val] = style.split(":");
      if (key && val) element.style[key?.trim()] = val?.trim();
    });

    // Change data animated to true
    element.setAttribute("data-animated", "true");
  };

  // Create intersection observer
  new IntersectionObserver(fn, { threshold: 0 }).observe(element);
});
