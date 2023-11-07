### Intersection Observer Animation API

Intersection Observer API Currently enjoys support on all major browsers expect for IE:
https://www.lambdatest.com/web-technologies/intersectionobserver

This project provides an API injecting classes into children component of components
containing a 'data-animation' attribute. The data-animation attribute is the name of the
class the children component are flagged with, those children component get injected
with a '.animated' class on intersection.

---

##### Usage

Define a class with a `data-animation` attributes that matches the class in the
child components. Optionally, define a `data-root-margin` for when the intersection
is triggered, default is "0px"; and define a `data-stagger` for the animation staggering,
default is 0;

```html
<div
  class="content"
  data-animation="fade-in-up"
  data-stagger="250"
  data-root-margin="-150px"
>
  <div class="fade-in-up white rectangle"></div>
  <div class="fade-in-up white rectangle"></div>
  <div class="fade-in-up white rectangle"></div>
  <div class="fade-in-up white rectangle"></div>
</div>
```

The CSS setup could look similar to this:

```css
.fade-in-up {
  transform: translateY(20px);
  opacity: 0;
  transition: 0.3s ease;
}
.fade-in-up.animated {
  transform: translateY(0px);
  opacity: 1;
}
```

---

##### Test Cases

- Element entering screen should inject `.animate`

Classes with that match `data-animation` attribute should receive
an `.animate` class upon intersection.

- Element exiting the screen when scrolling up should remove class

Once the object exits the screen when scrolling up, `.animate` should
be removed.

- Elements below view should not have `.animate`

Elements initialized below the current view on page load should not have `.animate`

- Elements above view should have `.animate`

Elements that start above view on page load should already have the `.animate`
injected.

- Animation states are only applied to `[data-animation]` elements

Only elements with this specific data attribute will become observed and have their animation
states applied.

- Elements without `[data-animation]` should be ignored

No intersection observer should be created for elements without a `data-animation` attribute.

- Animation states should only be applied to children with corresponding css class

`.animated` class should not be applied to children that do not have the class that
corresponds to the `data-animation` attribute.
