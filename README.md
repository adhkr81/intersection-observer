##### Intersection Observer Animation API

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
