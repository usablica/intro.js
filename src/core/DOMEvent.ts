import { IntroJs } from "../intro";
import stamp from "../util/stamp";

/**
 * DOMEvent Handles all DOM events
 *
 * methods:
 *
 * on - add event handler
 * off - remove event
 */

class DOMEvent {
  private readonly events_key: string = "introjs_event";

  /**
   * Gets a unique ID for an event listener
   */
  private _id(type: string, listener: Function, context: IntroJs) {
    return type + stamp(listener) + (context ? `_${stamp(context)}` : "");
  }

  /**
   * Adds event listener
   */
  public on(
    obj: EventTarget,
    type: string,
    listener: (
      context: IntroJs | EventTarget,
      e: Event
    ) => void | undefined | string | Promise<string | void>,
    context: IntroJs,
    useCapture: boolean
  ) {
    const id = this._id(type, listener, context);
    const handler = (e: Event) => listener(context || obj, e || window.event);

    if ("addEventListener" in obj) {
      obj.addEventListener(type, handler, useCapture);
    } else if ("attachEvent" in obj) {
      // @ts-ignore
      obj.attachEvent(`on${type}`, handler);
    }

    // @ts-ignore
    obj[this.events_key] = obj[this.events_key] || {};
    // @ts-ignore
    obj[this.events_key][id] = handler;
  }

  /**
   * Removes event listener
   */
  public off(
    obj: EventTarget,
    type: string,
    listener: (
      context: IntroJs | EventTarget,
      e: Event
    ) => void | undefined | string | Promise<string | void>,
    context: IntroJs,
    useCapture: boolean
  ) {
    const id = this._id(type, listener, context);
    // @ts-ignore
    const handler = obj[this.events_key] && obj[this.events_key][id];

    if (!handler) {
      return;
    }

    if ("removeEventListener" in obj) {
      obj.removeEventListener(type, handler, useCapture);
    } else if ("detachEvent" in obj) {
      // @ts-ignore
      obj.detachEvent(`on${type}`, handler);
    }

    // @ts-ignore
    obj[this.events_key][id] = null;
  }
}

export default new DOMEvent();
