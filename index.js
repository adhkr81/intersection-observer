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

// Movement direction enum
const directions = {
  UP_ENTER: "up_enter",
  UP_LEAVE: "up_leave",
  DOWN_ENTER: "down_enter",
  DOWN_LEAVE: "down_leave",
};

// Browser supports Intersection Observer
const INTERSECTION_OBSERVER_SUPPORT = "IntersectionObserver" in window;

// Default class to be injected into CSS elements
const INJECTED_CLASS = "animated";

// Data animation actions
const actions = {
  APPLY: "apply",
  REMOVE: "remove",
};

const toggleDataAnimation = (el, action = actions.APPLY) => {
  // Find the data-animation attribute key to match with config object.
  const animationAttr = el.getAttribute("data-animation");
  const staggerAttr = el.getAttribute("data-stagger");

  // Find classes based on specified class name on config object.
  el.querySelectorAll(`.${animationAttr}`).forEach((node, idx) => {
    // Calculate stagger and apply to child node.
    if (staggerAttr) {
      const parsed = parseInt(staggerAttr);
      node.style.transitionDelay = `${idx * parsed}ms`;
    }

    console.log({ action }, action, action.APPLY);
    if (action === actions.APPLY) {
      node?.classList.add(INJECTED_CLASS);
    } else if (action === actions.REMOVE) {
      node?.classList.remove(INJECTED_CLASS);
    } else {
      throw new Error(
        "toggleDataAnimation should be called with either ( 'apply' | 'remove' )"
      );
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
  document.querySelectorAll("[data-animation]")?.forEach((el) => {
    // On init, sets all elements above view to after state, and below to before
    const r = el.getBoundingClientRect();
    if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
      toggleDataAnimation(el, actions.APPLY);
    } else {
      toggleDataAnimation(el, actions.REMOVE);
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
        toggleDataAnimation(el, actions.APPLY);
      } else if (dir === directions.UP_LEAVE) {
        toggleDataAnimation(el, actions.REMOVE);
      }
    };

    const rootMargin = el.getAttribute("data-root-margin") || "0px";

    // Create intersection observer
    new IntersectionObserver(fn, {
      threshold: 0,
      rootMargin,
    }).observe(el);
  });
};

const initIntersectionObserverFallback = () => {
  // Add scroll event listener
  window.addEventListener("scroll", () => {
    // Retrieve all elemetns with data-animated = false
    document.querySelectorAll("[data-animation]").forEach((el) => {
      // Clause checks if element is already above current view
      const r = el.getBoundingClientRect();
      if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
        toggleDataAnimation(el, actions.APPLY);
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
        toggleDataAnimation(el, actions.APPLY);
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
