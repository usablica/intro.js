import addOverlayLayer from "./addOverlayLayer";
import cloneObject from "../util/cloneObject";
import forEach from "../util/forEach";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import createElement from "../util/createElement";

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 * @method _introForElement
 * @param {Object} targetElm
 * @param {String} group
 * @returns {Boolean} Success or not?
 */
export default function introForElement(targetElm, group) {
  const allIntroSteps = targetElm.querySelectorAll("*[data-intro]");
  let introItems = [];

  if (this._options.steps) {
    //use steps passed programmatically
    forEach(this._options.steps, (step) => {
      const currentItem = cloneObject(step);

      //set the step
      currentItem.step = introItems.length + 1;

      currentItem.title = currentItem.title || "";

      //use querySelector function only when developer used CSS selector
      if (typeof currentItem.element === "string") {
        //grab the element with given selector from the page
        currentItem.element = document.querySelector(currentItem.element);
      }

      //intro without element
      if (
        typeof currentItem.element === "undefined" ||
        currentItem.element === null
      ) {
        let floatingElementQuery = document.querySelector(
          ".introjsFloatingElement"
        );

        if (floatingElementQuery === null) {
          floatingElementQuery = createElement("div", {
            className: "introjsFloatingElement",
          });

          document.body.appendChild(floatingElementQuery);
        }

        currentItem.element = floatingElementQuery;
        currentItem.position = "floating";
      }

      currentItem.scrollTo = currentItem.scrollTo || this._options.scrollTo;

      if (typeof currentItem.disableInteraction === "undefined") {
        currentItem.disableInteraction = this._options.disableInteraction;
      }

      if (currentItem.element !== null) {
        introItems.push(currentItem);
      }
    });
  } else {
    //use steps from data-* annotations
    const elmsLength = allIntroSteps.length;
    let disableInteraction;

    //if there's no element to intro
    if (elmsLength < 1) {
      return false;
    }

    forEach(allIntroSteps, (currentElement) => {
      // PR #80
      // start intro for groups of elements
      if (group && currentElement.getAttribute("data-intro-group") !== group) {
        return;
      }

      // skip hidden elements
      if (currentElement.style.display === "none") {
        return;
      }

      const step = parseInt(currentElement.getAttribute("data-step"), 10);

      if (currentElement.hasAttribute("data-disable-interaction")) {
        disableInteraction = !!currentElement.getAttribute(
          "data-disable-interaction"
        );
      } else {
        disableInteraction = this._options.disableInteraction;
      }

      if (step > 0) {
        introItems[step - 1] = {
          element: currentElement,
          title: currentElement.getAttribute("data-title") || "",
          intro: currentElement.getAttribute("data-intro"),
          step: parseInt(currentElement.getAttribute("data-step"), 10),
          tooltipClass: currentElement.getAttribute("data-tooltipclass"),
          highlightClass: currentElement.getAttribute("data-highlightclass"),
          position:
            currentElement.getAttribute("data-position") ||
            this._options.tooltipPosition,
          scrollTo:
            currentElement.getAttribute("data-scrollto") ||
            this._options.scrollTo,
          disableInteraction,
        };
      }
    });

    //next add intro items without data-step
    //todo: we need a cleanup here, two loops are redundant
    let nextStep = 0;

    forEach(allIntroSteps, (currentElement) => {
      // PR #80
      // start intro for groups of elements
      if (group && currentElement.getAttribute("data-intro-group") !== group) {
        return;
      }

      if (currentElement.getAttribute("data-step") === null) {
        while (true) {
          if (typeof introItems[nextStep] === "undefined") {
            break;
          } else {
            nextStep++;
          }
        }

        if (currentElement.hasAttribute("data-disable-interaction")) {
          disableInteraction = !!currentElement.getAttribute(
            "data-disable-interaction"
          );
        } else {
          disableInteraction = this._options.disableInteraction;
        }

        introItems[nextStep] = {
          element: currentElement,
          title: currentElement.getAttribute("data-title") || "",
          intro: currentElement.getAttribute("data-intro"),
          step: nextStep + 1,
          tooltipClass: currentElement.getAttribute("data-tooltipclass"),
          highlightClass: currentElement.getAttribute("data-highlightclass"),
          position:
            currentElement.getAttribute("data-position") ||
            this._options.tooltipPosition,
          scrollTo:
            currentElement.getAttribute("data-scrollto") ||
            this._options.scrollTo,
          disableInteraction,
        };
      }
    });
  }

  //removing undefined/null elements
  const tempIntroItems = [];
  for (let z = 0; z < introItems.length; z++) {
    if (introItems[z]) {
      // copy non-falsy values to the end of the array
      tempIntroItems.push(introItems[z]);
    }
  }

  introItems = tempIntroItems;

  //Ok, sort all items with given steps
  introItems.sort((a, b) => a.step - b.step);

  //set it to the introJs object
  this._introItems = introItems;

  //add overlay layer to the page
  if (addOverlayLayer.call(this, targetElm)) {
    //then, start the show
    nextStep.call(this);

    if (this._options.keyboardNavigation) {
      DOMEvent.on(window, "keydown", onKeyDown, this, true);
    }
    //for window resize
    DOMEvent.on(window, "resize", onResize, this, true);
  }
  return false;
}
