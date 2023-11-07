### Intersection Observer Animation API

Intersection Observer API Currently enjoys support on all major browsers expect for IE:
https://www.lambdatest.com/web-technologies/intersectionobserver

This project provides an API injecting classes into children component of components
flagged with 'data-animated' attribute.

In order to use it, set the `data-animated` attribute to `true` and the
`data-animation` attribute to the relevant key of your config object.
In the config object, specify if there are child classes to be animated
with the `child_class` key, and the class that will be injected witht the
`class_to_add` key.

Classes are injected whenever element crosses threshold while scrolling down
and are removed when element crosses the threshold while scrolling up.

---

##### Usage

Define config object within javascript project.

```js
const animationConfig = {
  "multiple-staggered-fadein": {
    child_class: "fade-in-up",
    class_to_add: "animated",
    stagger: 100,
  },
};
```

After that, configure your HTML with the relevant data attributes on the parent element
and the animation class on the children:

```html
<div data-animated="true" data-animation="multiple-staggered-fadein">
  <div class="fade-in-up"></div>
  <div class="fade-in-up"></div>
  <div class="fade-in-up"></div>
  <div class="fade-in-up"></div>
</div>
```

---

##### Test Cases

- Element entering screen should inject `class_to_add`

Classes declared in `class_to_add` should be injected when the element
enters the screen from below (scrolling down).

- Element exiting the screen when scrolling up should remove class

Once the object exits the screen when scrolling up, `class_to_add` should
be removed.

- Elements below view should not have `class_to_add`

Elements initialized below the current view on page load should not have `class_to_add`

- Elements above view should have `class_to_add`

Elements that start above view on page load should already have the `class_to_add`
injected.

- Animation states are only applied to `[data-animated=true]` elements

Only elements with this specific data attribute will become observed and have their animation
states applied.

- Elements with `[data-animated=true]` but without a valid `data-animation` should be ignored

If `data-animated` is set to `true` but there is no valid configuration for the `data-animation`
attribute, no intersection observer should be created for that element.

- Animation states should only be applied to children with corresponding `child_class` css class

Animation styles should not be applied to children that do not have the class that
corresponds to the `child_class` key in the animation config.
