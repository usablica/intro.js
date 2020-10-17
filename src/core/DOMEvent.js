import stamp from "../util/stamp";

/**
 * DOMEvent Handles all DOM events
 *
 * methods:
 *
 * on - add event handler
 * off - remove event
 */

const DOMEvent = (() => {
  function DOMEvent() {
    const events_key = "introjs_event";

    /**
     * Gets a unique ID for an event listener
     *
     * @param obj Object
     * @param type event type
     * @param listener Function
     * @param context Object
     * @return String
     */
    this._id = (obj, type, listener, context) =>
      type + stamp(listener) + (context ? `_${stamp(context)}` : "");

    /**
     * Adds event listener
     *
     * @param obj Object obj
     * @param type String
     * @param listener Function
     * @param context Object
     * @param useCapture Boolean
     * @return null
     */
    this.on = function (obj, type, listener, context, useCapture) {
      const id = this._id.apply(this, arguments);
      const handler = (e) => listener.call(context || obj, e || window.event);

      if ("addEventListener" in obj) {
        obj.addEventListener(type, handler, useCapture);
      } else if ("attachEvent" in obj) {
        obj.attachEvent(`on${type}`, handler);
      }

      obj[events_key] = obj[events_key] || {};
      obj[events_key][id] = handler;
    };

    /**
     * Removes event listener
     *
     * @param obj Object
     * @param type String
     * @param listener Function
     * @param context Object
     * @param useCapture Boolean
     * @return null
     */
    this.off = function (obj, type, listener, context, useCapture) {
      const id = this._id.apply(this, arguments);
      const handler = obj[events_key] && obj[events_key][id];

      if (!handler) {
        return;
      }

      if ("removeEventListener" in obj) {
        obj.removeEventListener(type, handler, useCapture);
      } else if ("detachEvent" in obj) {
        obj.detachEvent(`on${type}`, handler);
      }

      obj[events_key][id] = null;
    };
  }

  return new DOMEvent();
})();

export default DOMEvent;
