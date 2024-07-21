/**
 * DOMEvent Handles all DOM events
 *
 * methods:
 *
 * on - add event handler
 * off - remove event
 */

interface Events {
  keydown: KeyboardEvent;
  resize: Event;
  scroll: Event;
  click: MouseEvent;
}

type Listener<T> = (e: T) => void | undefined | string | Promise<string | void>;

class DOMEvent {
  /**
   * Adds event listener
   */
  public on<T extends keyof Events>(
    obj: EventTarget,
    type: T,
    listener: Listener<Events[T]>,
    useCapture: boolean
  ) {
    if ("addEventListener" in obj) {
      obj.addEventListener(type, listener, useCapture);
    } else if ("attachEvent" in obj) {
      (obj as any).attachEvent(`on${type}`, listener);
    }
  }

  /**
   * Removes event listener
   */
  public off<T extends keyof Events>(
    obj: EventTarget,
    type: T,
    listener: Listener<Events[T]>,
    useCapture: boolean
  ) {
    if ("removeEventListener" in obj) {
      obj.removeEventListener(type, listener, useCapture);
    } else if ("detachEvent" in obj) {
      (obj as any).detachEvent(`on${type}`, listener);
    }
  }
}

export default new DOMEvent();
