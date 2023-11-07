/**
 * Intersection Obveserver Animation API
 *
 * API Currently enjoys support on all major browsers expect for IE:
 * https://www.lambdatest.com/web-technologies/intersectionobserver
 *
 * This project provides an API for setting before and after styles on both
 * parent and child classes recognized by the data-animated attribute.
 *
 * In order to use it, set the data-animated attribute to true and the
 * data-animation attribute to the key of your config object. In the
 * config object, specify if there are child classes to be animated
 * with the childClass key, and the styles that will be applied in the
 * parentStyles and childStyles keys, both containing a before and after.
 *
 */

const animationConfig = {
  "multiple-staggered-fadein": {
    child_class: "animated-child",
    stagger: 100,
    parentStyles: {
      before: `
        boxSizing:border-box;
        padding: 35px;
        transition: 2s;
      `,
      after: `
        backgroundColor:#7d7d7d;
        padding:50px;
      `,
    },
    childStyles: {
      before: `
        opacity: 0;
        transition: 2s;
      `,
      after: `
        opacity: 1;
      `,
    },
  },
  "multiple-staggered-pop": {
    child_class: "animated-child",
    stagger: 500,
    parentStyles: {
      before: `
        boxSizing:border-box;
        padding:50px;
        transition:2s;
      `,
      after: `
        backgroundColor:#7d7d7d;
        padding:35px;
      `,
    },
    childStyles: {
      before: `
        backgroundColor: black;
        boxShadow: none;
        transition: 2s;
      `,
      after: `
        backgroundColor:#606c38;
        boxShadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
      `,
    },
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

const applyStyles = (el, styles) => {
  // Based on styles string, applies parsed styles to element.
  styles.split(";").forEach((style) => {
    if (style === "") return;
    const [k, v] = style.split(":");
    el.style[k?.trim()] = v?.trim();
  });
};

const applyDataAnimation = (el, key) => {
  // Find the data-animation attribute key to match with config object.
  const attr = el.getAttribute("data-animation");
  const config = animationConfig[attr];
  if (!config) return;

  // If parent styles are specified, apply them.
  if (Object.hasOwn(config?.parentStyles, key)) {
    applyStyles(el, config.parentStyles[key]);
  }

  // Find classes based on specified class name on config object.
  el.querySelectorAll(`.${config.child_class}`).forEach((node, idx) => {
    // Calculate stagger and apply to child node.
    if (config?.stagger) {
      node.style.transitionDelay = `${idx * config.stagger}ms`;
    }

    // If child styles are specified, apply them.
    if (Object.hasOwn(config?.childStyles, key)) {
      applyStyles(node, config.childStyles[key]);
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
    // On init, sets all elements to before state

    // On init, sets all elements above view to after state, and below to before
    const r = el.getBoundingClientRect();
    if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
      applyDataAnimation(el, "after");
    } else {
      applyDataAnimation(el, "before");
    }

    // Form closure over object to hold previous state data
    const prev = {
      prevY: 0,
      prevRatio: 0,
    };

    // Intersection observer API callback
    const fn = (entries) => {
      const dir = entryDirection(entries[0], prev);
      console.log("DIR", dir);
      if (dir === directions.UP_ENTER) {
        applyDataAnimation(el, "after");
      } else if (dir === directions.UP_LEAVE) {
        applyDataAnimation(el, "before");
      }
    };

    // Create intersection observer
    new IntersectionObserver(fn, {
      threshold: 0,
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
