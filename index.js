/**
 * Intersection Obveserver Animation API
 *
 * API Currently enjoys support on all major browsers expect for IE:
 * https://www.lambdatest.com/web-technologies/intersectionobserver
 *
 * Intersection Observer API injects classes into children that contain
 * the specified class, the children to be animated can be flagged
 * with the 'child_class' configuration key while the actual class
 * that will be injected can be specified with the 'class_to_add' key.
 */

const animationConfig = {
  "multiple-staggered-fadein": {
    child_class: "fade-in-up",
    class_to_add: "animated",
    stagger: 100,
  },
};

// Movement direction enum
const directions = {
  UP_ENTER: "up_enter",
  UP_LEAVE: "up_leave",
  DOWN_ENTER: "down_enter",
  DOWN_LEAVE: "down_leave",
};

// Browser supports Intersection Observer
const INTERSECTION_OBSERVER_SUPPORT = "IntersectionObserver" in window;

const toggleDataAnimation = (el, action = "apply") => {
  // Find the data-animation attribute key to match with config object.
  const attr = el.getAttribute("data-animation");
  const config = animationConfig[attr];
  if (!config) return;

  // Find classes based on specified class name on config object.
  el.querySelectorAll(`.${config.child_class}`).forEach((node, idx) => {
    // Calculate stagger and apply to child node.
    if (Object.hasOwn(config, "stagger")) {
      node.style.transitionDelay = `${idx * config.stagger}ms`;
    }

    // If child class is specified, apply it.
    if (Object.hasOwn(config, "class_to_add")) {
      if (action === "apply") {
        node?.classList.add(config.class_to_add);
      } else if (action === "remove") {
        node?.classList.remove(config.class_to_add);
      } else {
        throw new Error(
          "toggleDataAnimation should be called with either ( 'apply' | 'remove' )"
        );
      }
    }
  });
};

const entryDirection = (entry, state) => {
  const currY = entry.boundingClientRect.y;
  const currRatio = entry.intersectionRatio;
  const isIntersecting = entry.isIntersecting;

  // Based on current Y and stored Y, find motion direction.
  //  Then find if element entering or existing based on intersectionRatio.
  if (currY < state.prevY) {
    return currRatio > state.prevRatio && isIntersecting
      ? directions.DOWN_ENTER
      : directions.DOWN_LEAVE;
  } else if (currY > state.prevY) {
    return currRatio > state.prevRatio && isIntersecting
      ? directions.UP_ENTER
      : directions.UP_LEAVE;
  }
};

const initIntersectionObserver = () => {
  document.querySelectorAll('[data-animated="true"]')?.forEach((el) => {
    // On init, sets all elements above view to after state, and below to before
    const r = el.getBoundingClientRect();
    if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
      toggleDataAnimation(el);
    } else {
      toggleDataAnimation(el, "remove");
    }

    // Form closure over object to hold previous state data
    const prev = {
      prevY: 0,
      prevRatio: 0,
    };

    // Intersection observer API callback
    const fn = (entries) => {
      const dir = entryDirection(entries[0], prev);
      if (dir === directions.UP_ENTER) {
        toggleDataAnimation(el);
      } else if (dir === directions.UP_LEAVE) {
        toggleDataAnimation(el, "remove");
      }
    };

    // Create intersection observer
    new IntersectionObserver(fn, {
      threshold: 0,
      rootMargin: "-250px",
    }).observe(el);
  });
};

const initIntersectionObserverFallback = () => {
  // Add scroll event listener
  window.addEventListener("scroll", () => {
    // Retrieve all elemetns with data-animated = false
    document.querySelectorAll('[data-animated="true"]').forEach((el) => {
      // Clause checks if element is already above current view
      const r = el.getBoundingClientRect();
      if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
        toggleDataAnimation(el);
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
        toggleDataAnimation(el);
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
