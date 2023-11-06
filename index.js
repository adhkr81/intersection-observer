/**
 * Intersection Obveserver API Test
 *
 * API Currently enjoys support on all major browsers expect for IE:
 * https://www.lambdatest.com/web-technologies/intersectionobserver
 *
 * Main observer api initializer ensures elements only animate on entering the screen from below,
 * injects styles derived from data-animation attribute and sets data-animated to false to avoid
 * re-animations. Fallback functionality  does not discriminate on scroll direction.
 * Elements above viewport on entering page have their animations triggered by default.
 */

// Movement direction constants
const directions = {
  UP_ENTER: "up_enter",
  UP_LEAVE: "up_leave",
  DOWN_ENTER: "down_enter",
  DOWN_LEAVE: "down_leave",
};

// Browser supports Intersection Observer
const INTERSECTION_OBSERVER_SUPPORT = "IntersectionObserver" in window;

const setDataAnimated = (el, val) => {
  // Sets data-animated attribute
  el.setAttribute("data-animated", val);
};

// const applyDataAnimation = (el) => {
//   // Retrieve styles from data attribute
//   const styles = el.getAttribute("data-animation");
//   if (typeof styles !== "string" || styles === "") return;
//   el.classList.add(styles);
// };

const entryDirection = (entry, state) => {
  /** Function uses previous rect data to derive direction and if entering or leaving */
  const currY = entry.boundingClientRect.y;
  const currRatio = entry.intersectionRatio;
  const isIntersecting = entry.isIntersecting;

  // Current Y < Previous Y indicates downwards motion of observed el
  if (currY < state.prevY) {
    // Current Ratio > Previous Ratio indicates element is entering viewport
    // Is intersecting indicates element is on screen and therefore not leaving
    if (currRatio > state.prevRatio && isIntersecting) {
      return directions.DOWN_ENTER;
    } else {
      return directions.DOWN_LEAVE;
    }
    // Current Y > Previous Y indicates upwards motion of observed el
  } else if (currY > state.prevY && isIntersecting) {
    // Current Ratio < Previous Ratio indicates element is leaving viewport
    if (currRatio < state.prevRatio) {
      return directions.UP_LEAVE;
    } else {
      return directions.UP_ENTER;
    }
  }
};

const initIntersectionObserver = () => {
  document.querySelectorAll('[data-animated="false"]')?.forEach((el) => {
    // Clause checks if element is already above current view
    const r = el.getBoundingClientRect();
    if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
      setDataAnimated(el, true);
    }

    // Form closure over object to hold previous state data
    const prev = {
      prevY: 0,
      prevRatio: 0,
    };

    const fn = (entries) => {
      const dir = entryDirection(entries[0], prev);
      const isEntering =
        dir === directions.UP_ENTER || dir === directions.DOWN_ENTER;
      // Sets data-animated attribute to true if element is entering and false if exiting
      setDataAnimated(el, isEntering);
    };

    // Create intersection observer
    new IntersectionObserver(fn, { threshold: 0 }).observe(el);
  });
};

const initIntersectionObserverFallback = () => {
  // Add scroll event listener
  window.addEventListener("scroll", () => {
    // Retrieve all elemetns with data-animated = false
    document.querySelectorAll('[data-animated="false"]').forEach((el) => {
      // Clause checks if element is already above current view
      const r = el.getBoundingClientRect();
      if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
        setDataAnimated(el, true);
        return;
      }
      // Check element if on-screen
      if (
        r.top >= 0 &&
        r.left >= 0 &&
        r.bottom <= window.innerHeight &&
        r.right <= window.innerWidth
      ) {
        // Change data animated to true
        setDataAnimated(el, true);
      }
    });
  });
};

// Checks for browser support and defaults to fallback functionality
if (INTERSECTION_OBSERVER_SUPPORT) {
  initIntersectionObserver();
} else {
  initIntersectionObserverFallback();
}
