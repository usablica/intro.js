/** empty function, used for gracefully removing event listeners */
const noop = () => {};

/**
 * events: extends a class to accept custom event listener methods:
 * (on/off/fire/once)
 */
export const events = {
  /**
   * Adds custom event listeners to an instance
   *
   * @param {string | Record<string, () => void>} types
   * @param {() => void} fn
   * @param {*} context
   */
  on(types, fn, context) {
    // types can be a map of types/handlers
    if (typeof types === "object") {
      for (let type in types) {
        this._on(type, types[type], fn);
      }
    } else {
      this._on(types, fn, context);
    }

    return this;
  },

  /**
   * Removes custom event listeners from an instance
   *
   * @param {string | Record<string, () => void>} types
   * @param {() => void} fn
   * @param {*} context
   */
  off(types, fn, context) {
    if (!types) {
      // clear all listeners if called without arguments
      delete this._events;
    } else if (typeof types === "object") {
      for (let type in types) {
        this._off(type, types[type], fn);
      }
    } else {
      this._off(types, fn, context);
    }

    return this;
  },

  /**
   * Internal add event listener
   *
   * @param {string} type
   * @param {() => void} fn
   * @param {*} context
   */
  _on(type, fn, context) {
    this._events = this._events || {};

    /* lazy initialize this._events[type] */
    const listeners = this._events[type] || [];
    this._events[type] = listeners;

    const newListener = { fn: fn, ctx: context };

    // check if fn already there
    for (const listener of listeners) {
      if (listener.fn === fn && listener.ctx === context) {
        return;
      }
    }

    listeners.push(newListener);
  },

  /** keeps track of calls to fire, so we can safely remove event listeners inside of event listeners */
  _firingCount: 0,

  /**
   * Internal remove event listener
   *
   * @param {string} type
   * @param {() => void} fn
   * @param {*} context
   */
  _off(type, fn, context) {
    if (!this._events) {
      return;
    }

    let listeners = this._events[type] || [];

    if (listeners.length === 0) {
      return;
    }

    if (!fn) {
      // Set all removed listeners to noop so they are not called if remove happens in fire
      for (const listener of listeners) {
        listener.fn = noop;
      }
      // clear all listeners for a type if function isn't specified
      delete this._events[type];
      return;
    }

    // find fn and remove it
    for (let i = 0, len = listeners.length; i < len; i++) {
      const listener = listeners[i];
      if (listener.ctx === context && listener.fn === fn) {
        // set the removed listener to noop so that's not called if remove happens in fire
        listener.fn = noop;

        if (this._firingCount) {
          // copy array in case events are being fired
          this._events[type] = listeners = listeners.slice();
        }

        listeners.splice(i, 1);

        return;
      }
    }
  },

  /**
   * Calls all event listeners that listen for a given event type
   * @param {string} type name of event
   * @param {*} data data to be passed to event handler
   */
  fire(type, data) {
    if (!this._events || !this.listens(type)) {
      return this;
    }

    const listeners = this._events[type] || [];

    if (listeners.length > 0) {
      const event = Object.assign({}, data, {
        type: type,
        target: this,
        sourceTarget: (data && data.sourceTarget) || this,
      });

      this._firingCount++;
      for (const listener of listeners) {
        listener.fn.call(listener.ctx || this, event);
      }
      this._firingCount--;
    }

    return this;
  },

  /**
   * Determine if an event type has any listeners
   *
   * @param {string} type event type
   * @returns boolean
   */
  listens(type) {
    const listeners = this._events && this._events[type];

    return listeners && listeners.length > 0;
  },

  /**
   * Adds custom event listeners to an instance which fire only once
   *
   * @param {string | Record<string, () => void>} types
   * @param {() => void} fn
   * @param {*} context
   */
  once(types, fn, context) {
    if (typeof types === "object") {
      for (const type in types) {
        this.once(type, types[type], fn);
      }
      return this;
    }

    const removeFn = function () {
      this.off(types, fn, context).off(types, removeFn, context);
    }.bind(this);

    // add a listener that's executed once and removed after that
    return this.on(types, fn, context).on(types, removeFn, context);
  },
};
