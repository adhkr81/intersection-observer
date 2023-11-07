### Intersection Observer Animation API

Intersection Observer API Currently enjoys support on all major browsers expect for IE:
https://www.lambdatest.com/web-technologies/intersectionobserver

This project provides an API for setting before and after styles on both
parent and child classes by leveraging data attributes.

In order to use it, set the `data-animated` attribute to `true` and the
`data-animation` attribute to the relevant key of your config object.
In the config object, specify if there are child classes to be animated
with the `childClass` key, and the styles that will be applied in the
`parentStyles` and `childStyles` keys, both containing a `before` and `after`
string with the styles.

Animations are triggered whenever element enters the screen from the bottom or
from the top, and are not retriggered when the element exits screen.

---

##### Usage

Define config object within javascript project.

```js
const animationConfig = {
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
```

After that, configure your HTML with the relevant data attributes on the parent element
and the animation class on the children:

```html
<div data-animated="true" data-animation="multiple-staggered-fadein">
  <div class="animated-child"></div>
  <div class="animated-child"></div>
  <div class="animated-child"></div>
  <div class="animated-child"></div>
</div>
```
---

##### Test Cases

- Element entering screen triggers animations

Animations declare in the `after` block of both `parentStyles` and `childStyles`
should be triggered when the element enters the screen from below (scrolling down) or
from above (scrolling up).

- Element exiting screen should return to before state

Once the object exits the screen from above or below, he `before` state should be triggered,
which makes it possible to trigger the `after` state if the object re-enters the screen.

- Element should be in `before` state by default

The styles declared in the respective `before` blocks should be set by default, these will
be apply at initialization time when the element becomes *observed*.

- Animation states are only applied to `[data-animated=true]` elements

Only elements with this specific data attribute will become observed and have their animation
states applied.

- Elements with `[data-animated=true]` but without a valid `data-animation` should be ignored

If `data-animated` is set to `true` but there is no valid configuration for the `data-animation`
attribute, no intersection observer should be created for that element.

- Animation states should only be applied to children with corresponding `childClass`

Animation styles should not be applied to children that do not have the class that
corresponds to the `childClass` key in the animation config.


