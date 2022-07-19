import stamp from "../util/stamp";
import { IntroJs } from "../IntroJs";

/**
 * DOMEvent Handles all DOM events
 *
 * methods:
 *
 * on - add event handler
 * off - remove event
 */
class DOMEvent {
  private events_key = "introjs_event";

  private _id(
    _obj: any,
    type: string,
    listener: (data: any) => void,
    context: IntroJs
  ) {
    return type + stamp(listener) + (context ? `_${stamp(context)}` : "");
  }

  public on(
    obj: any,
    type: string,
    _listener: (data: any) => void,
    _context: IntroJs,
    useCapture: boolean
  ) {
    const id = this._id(this, type, _listener, _context);
    const handler = (e: Event) =>
      _listener.call(_context || obj, e || window.event);

    if ("addEventListener" in obj) {
      obj.addEventListener(type, handler, useCapture);
    } else if ("attachEvent" in obj) {
      obj.attachEvent(`on${type}`, handler);
    }

    obj[this.events_key] = obj[this.events_key] || {};
    obj[this.events_key][id] = handler;
  }

  public off(
    obj: any,
    type: string,
    _listener: (data: any) => void,
    _context: IntroJs,
    useCapture: boolean
  ) {
    const id = this._id(this, type, _listener, _context);
    const handler = obj[this.events_key] && obj[this.events_key][id];

    if (!handler) {
      return;
    }

    if ("removeEventListener" in obj) {
      obj.removeEventListener(type, handler, useCapture);
    } else if ("detachEvent" in obj) {
      obj.detachEvent(`on${type}`, handler);
    }

    obj[this.events_key][id] = null;
  }
}

const domEvent = new DOMEvent();

export default domEvent;
