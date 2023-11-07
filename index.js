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

const animationConfig = {
  "multiple-staggered-fadein": {
    child_class: "hidden-animated",
    parent_styles: "backgroundColor:#7d7d7d;padding:50px;",
    child_styles: `
      opacity:1;
    `,
    stagger: 100,
  },
  "multiple-staggered-pop": {
    child_class: "pop-animated",
    parent_styles: "backgroundColor:#7d7d7d;padding:50px;",
    child_styles: `
      backgroundColor:#606c38;
      boxShadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    `,
    stagger: 500,
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
  styles
    .trim()
    .split(";")
    .forEach((style) => {
      if (style === "") return;
      const [k, v] = style.split(":");
      el.style[k?.trim()] = v?.trim();
    });
};

const removeStyles = (el, styles) => {
  // Based on styles string, removes parsed styles to element.
  styles
    .trim()
    .split(";")
    .forEach((style) => {
      if (style === "") return;
      const [k, _] = style.split(":");
      el.style[k?.trim()] = "";
    });
};

const setDataAnimated = (el, val) => {
  // Sets data-animated attribute
  el.setAttribute("data-animated", val);
};

const removeDataAnimation = (el) => {
  // Funtion is analogous to applyData animation but removes styles.
  const attr = el.getAttribute("data-animation");
  const config = animationConfig[attr];
  if (!config) return;
  if (config.parent_styles) removeStyles(el, config.parent_styles);
  el.querySelectorAll(`.${config.child_class}`).forEach((node, _) => {
    if (config?.stagger) {
      node.style.transitionDelay = "";
    }
    if (config?.child_styles) {
      removeStyles(node, config.child_styles);
    }
  });
};

const applyDataAnimation = (el) => {
  // Retrieve config with data attribute
  const attr = el.getAttribute("data-animation");

  // Find configuration for specific attribute
  const config = animationConfig[attr];
  if (!config) return;

  // Apply parent styles if present
  if (config.parent_styles) applyStyles(el, config.parent_styles);

  // Find child elements based on child_class
  el.querySelectorAll(`.${config.child_class}`).forEach((node, idx) => {
    // If stagger, apply transition delay
    if (config?.stagger) {
      node.style.transitionDelay = `${idx * config.stagger}ms`;
    }

    // If child_styles, apply them to child node
    if (config?.child_styles) {
      applyStyles(node, config.child_styles);
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
    // Clause checks if element is already above current view
    const r = el.getBoundingClientRect();
    if ((r.top >= 0 && r.bottom <= window.innerHeight) || r.top < 0) {
      applyDataAnimation(el);
    }

    // Form closure over object to hold previous state data
    const prev = {
      prevY: 0,
      prevRatio: 0,
    };

    // Intersection observer API callback
    const fn = (entries) => {
      const dir = entryDirection(entries[0], prev);
      if (dir === directions.UP_ENTER || dir === directions.DOWN_ENTER) {
        applyDataAnimation(el);
      } else {
        removeDataAnimation(el);
      }
    };

    // Create intersection observer
    new IntersectionObserver(fn, { threshold: 0 }).observe(el);
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
