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
export default function introForElement (targetElm, group) {
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
    const allIntroSteps = targetElm.querySelectorAll("*[data-intro]");
    const introWithStepCount = allIntroSteps.filter(elem => elem.getAttribute('data-step') !== null).length;

    //use steps from data-* annotations
    const elmsLength = allIntroSteps.length;
    let disableInteraction;

    //if there's no element to intro
    if (elmsLength < 1) {
      return false;
    }

    const noStepIntroItems = [];
    let nextStep = introWithStepCount;

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

      // add intro items without data-step
      if (currentElement.getAttribute("data-step") === null) {
        if (currentElement.hasAttribute("data-disable-interaction")) {
          disableInteraction = !!currentElement.getAttribute(
            "data-disable-interaction"
          );
        } else {
          disableInteraction = this._options.disableInteraction;
        }

        noStepIntroItems.push({
          element: currentElement,
          title: currentElement.getAttribute("data-title") || "",
          intro: currentElement.getAttribute("data-intro"),
          step: nextStep++,
          tooltipClass: currentElement.getAttribute("data-tooltipclass"),
          highlightClass: currentElement.getAttribute("data-highlightclass"),
          position:
            currentElement.getAttribute("data-position") ||
            this._options.tooltipPosition,
          scrollTo:
            currentElement.getAttribute("data-scrollto") ||
            this._options.scrollTo,
          disableInteraction,
        });
      } else {
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
            step,
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
      }
    });

    //removing undefined/null elements
    introItems = introItems.filter(item => item);

    introItems = [...introItems, ...noStepIntroItems];
  }

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
