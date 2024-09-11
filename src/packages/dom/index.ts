/**
 * A TypeScript and modified version of the VanJS project.
 * Credits: https://github.com/vanjs-org/van & https://github.com/ge3224/van-ts
 */

/**
 * A type representing primitive JavaScript types.
 */
export type Primitive = string | number | boolean | bigint;

/**
 * A type representing a property value which can be a primitive, a function,
 * or null.
 */
export type PropValue = Primitive | (<T>(e: T) => void) | null;

/**
 * A type representing valid child DOM values.
 */
export type ValidChildDomValue = Primitive | Node | null | undefined;

/**
 * A type representing functions that generate DOM values.
 */
export type BindingFunc =
  | ((dom?: Node) => ValidChildDomValue)
  | ((dom?: Element) => Element);

/**
 * A type representing various possible child DOM values.
 */
export type ChildDom =
  | ValidChildDomValue
  | StateView<Primitive | null | undefined>
  | BindingFunc
  | readonly ChildDom[];

type ConnectedDom = { isConnected: number };

type Binding = {
  f: BindingFunc;
  _dom: HTMLElement | null | undefined;
};

type Listener<T> = {
  f: BindingFunc;
  s: State<T>;
  _dom?: HTMLElement | null | undefined;
};

type Connectable<T> = Listener<T> | Binding;

/**
 * Interface representing a state object with various properties and bindings.
 */
export interface State<T> {
  val: T | undefined;
  readonly oldVal: T | undefined;
  rawVal: T | undefined;
  _oldVal: T | undefined;
  _bindings: Array<Binding>;
  _listeners: Array<Listener<T>>;
}

/**
 * A type representing a read-only view of a `State` object.
 */
export type StateView<T> = Readonly<State<T>>;

/**
 * A type representing a value that can be either a `State` object or a direct
 * value of type `T`.
 */
export type Val<T> = State<T> | T;

/**
 * A type representing a property value, a state view of a property value, or a
 * function returning a property value.
 */
export type PropValueOrDerived =
  | PropValue
  | StateView<PropValue>
  | (() => PropValue);

/**
 * A type representing partial props with known keys for a specific
 * element type.
 */
export type Props = Record<string, PropValueOrDerived> & {
  class?: PropValueOrDerived;
};

export type PropsWithKnownKeys<ElementType> = Partial<{
  [K in keyof ElementType]: PropValueOrDerived;
}>;

/**
 * Represents a function type that constructs a tagged result using provided
 * properties and children.
 */
export type TagFunc<Result> = (
  first?: (Props & PropsWithKnownKeys<Result>) | ChildDom,
  ...rest: readonly ChildDom[]
) => Result;

/**
 * Interface representing dependencies with sets for getters and setters.
 */
interface Dependencies<T> {
  _getters: Set<State<T>>;
  _setters: Set<State<T>>;
}

/**
 * A function type for searching property descriptors in a prototype chain.
 */
type PropertyDescriptorSearchFn<T> = (
  proto: T
) => ReturnType<typeof Object.getOwnPropertyDescriptor> | undefined;

/**
 * A function type for setting event listeners.
 */
type EventSetterFn = (
  v: EventListenerOrEventListenerObject,
  oldV?: EventListenerOrEventListenerObject
) => void;

/**
 * A function type for setting property values.
 */
type PropSetterFn = (value: any) => void;

/**
 * Represents a function type for creating a namespace-specific collection of
 * tag functions.
 *
 * @param {string} namespaceURI
 * - The URI of the namespace for which the tag functions are being created.
 *
 * @returns {Readonly<Record<string, TagFunc<Element>>>}
 * - A readonly record of string keys to TagFunc<Element> functions,
 *   representing the collection of tag functions within the specified
 *   namespace.
 */
export type NamespaceFunction = (
  namespaceURI: string
) => Readonly<Record<string, TagFunc<Element>>>;

/**
 * Represents a type for a collection of tag functions.
 *
 * This type includes:
 * - A readonly record of string keys to TagFunc<Element> functions, enabling
 *   the creation of generic HTML elements.
 * - Specific tag functions for each HTML element type as defined in
 *   HTMLElementTagNameMap, with the return type corresponding to the specific
 *   type of the HTML element (e.g., HTMLDivElement for 'div',
 *   HTMLAnchorElement for 'a').
 *
 * Usage of this type allows for type-safe creation of HTML elements with
 * specific properties and child elements.
 */
export type Tags = Readonly<Record<string, TagFunc<Element>>> & {
  [K in keyof HTMLElementTagNameMap]: TagFunc<HTMLElementTagNameMap[K]>;
};

/**
 * While VanJS prefers using `let` instead of `const` to help reduce bundle
 * size, this project employs the `const` keyword. Bundle sizes are managed
 * during TypeScript compilation and bundling, incorporating minification and
 * tree shaking.
 *
 * The following are global variables used by VanJS to alias some builtin
 * symbols and reduce the bundle size.
 */

/**
 * Set containing changed states.
 */
let changedStates: Set<State<any>> | undefined;

/**
 * Set containing derived states.
 */
let derivedStates: Set<State<any>>;

/**
 * Current dependencies object, containing getters and setters.
 */
let curDeps: Dependencies<any>;

/**
 * Array containing current new derivations.
 */
let curNewDerives: Array<any>;

/**
 * Set containing objects marked for garbage collection.
 */
let forGarbageCollection: Set<any> | undefined;

/**
 * Alias for the built-in primitive value `undefined`. This variable is used to
 * reduce bundle size. Since it is never initialized, its value equals
 * `undefined`. During minification, variable names are shortened.
 */
let _undefined: undefined;

/**
 * Alias for the keyword `Object`. This is used to reduce bundle size during
 * minification.
 */
const _object = Object;

/**
 * Alias for the keyword `document`. This is used to reduce bundle size during
 * minification.
 */
const _document = document;

/**
 * A constant function returning the prototype of an object.
 */
const protoOf = _object.getPrototypeOf;

/**
 * Constant representing a DOM object that is always considered connected.
 */
const alwaysConnectedDom: ConnectedDom = { isConnected: 1 };

/**
 * Constant representing the garbage collection cycle duration in milliseconds.
 */
const gcCycleInMs = 1000;

/**
 * Cache object for property setters.
 */
const propSetterCache: { [key: string]: (<T>(v: T) => void) | 0 } = {};

/**
 * Prototype of the `alwaysConnectedDom` object.
 */
const objProto = protoOf(alwaysConnectedDom);

/**
 * Prototype of the `Function` object.
 */
const funcProto = Function.prototype;

/**
 * Adds a state object to a set and schedules an associated function to be
 * executed after a specified delay if the set is initially undefined.
 */
const addAndScheduleOnFirst = <T>(
  set: Set<State<T>> | undefined,
  state: State<T>,
  fn: () => void,
  waitMs?: number
): Set<State<T>> => {
  if (set === undefined) {
    setTimeout(fn, waitMs);
    set = new Set<State<T>>();
  }
  set.add(state);
  return set;
};

/**
 * Executes a function with a given argument and tracks dependencies during
 * its execution.
 */
const runAndCaptureDependencies = <T>(
  fn: Function,
  deps: Dependencies<T>,
  arg: T
): T => {
  let prevDeps = curDeps;
  curDeps = deps;

  try {
    return fn(arg);
  } catch (e) {
    console.error(e);
    return arg;
  } finally {
    curDeps = prevDeps;
  }
};

/**
 * Filters an array of Connectable objects, returning only those whose `_dom`
 * property is connected to the current document.
 */
const keepConnected = <T extends Connectable<T>>(l: T[]): T[] => {
  return l.filter((b) => b._dom?.isConnected);
};

/**
 * Adds a state object to a collection that will be processed for
 * garbage collection.
 */
const addForGarbageCollection = <T>(discard: State<T>): void => {
  forGarbageCollection = addAndScheduleOnFirst(
    forGarbageCollection,
    discard,
    () => {
      if (forGarbageCollection) {
        for (let s of forGarbageCollection) {
          s._bindings = keepConnected(s._bindings);
          s._listeners = keepConnected(s._listeners);
        }
        forGarbageCollection = _undefined; // Resets `forGarbageCollection` after processing
      }
    },
    gcCycleInMs
  );
};

/**
 * Prototype for state objects, providing getter and setter for `val` and
 * `oldVal`.
 */
const stateProto = {
  get val() {
    const state = this as State<unknown>;
    curDeps?._getters?.add(state);
    return state.rawVal;
  },

  get oldVal() {
    const state = this as State<unknown>;
    curDeps?._getters?.add(state);
    return state._oldVal;
  },

  set val(v) {
    const state = this as State<unknown>;
    curDeps?._setters?.add(state);
    if (v !== state.rawVal) {
      state.rawVal = v;
      state._bindings.length + state._listeners.length
        ? (derivedStates?.add(state),
          (changedStates = addAndScheduleOnFirst(
            changedStates,
            state,
            updateDoms
          )))
        : (state._oldVal = v);
    }
  },
};

/**
 * Generates a property descriptor with preset characteristics for properties
 * of a state object.
 */
const statePropertyDescriptor = <T>(value: T): PropertyDescriptor => {
  return {
    writable: true,
    configurable: true,
    enumerable: true,
    value: value,
  };
};

/**
 * Creates a state object with optional initial value. The properties of the
 * created object are configured to be enumerable, writable, and configurable.
 *
 * @template
 * @param {T} [initVal] - Optional initial value for the state.
 * @returns {State<T>} A state object.
 */
const state = <T>(initVal?: T): State<T> => {
  // In contrast to the VanJS implementation (above), where reducing the bundle
  // size is a key priority, we use the `Object.create` method instead of the
  // `Object.prototype.__proto__` accessor since the latter is no longer
  // recommended.
  //
  // [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
  return _object.create(stateProto, {
    rawVal: statePropertyDescriptor(initVal),
    _oldVal: statePropertyDescriptor(initVal),
    _bindings: statePropertyDescriptor([]),
    _listeners: statePropertyDescriptor([]),
  });
};

/**
 * Binds a function to a DOM element, capturing its dependencies and updating
 * the DOM as needed.
 *
 * @template T
 * @param {Function} f - The function to bind.
 * @param {T | undefined} [dom] - Optional DOM element or undefined.
 * @returns {T} The resulting DOM element or text node.*
 */
const bind = <T>(f: Function, dom?: T | undefined): T => {
  let deps: Dependencies<any> = { _getters: new Set(), _setters: new Set() };
  let binding: { [key: string]: any } = { f };
  let prevNewDerives = curNewDerives;

  curNewDerives = [];
  let newDom = runAndCaptureDependencies(f, deps, dom);

  newDom = ((newDom ?? _document) as Node).nodeType
    ? newDom
    : new Text(newDom as string | undefined);

  for (let d of deps._getters)
    deps._setters.has(d) ||
      (addForGarbageCollection(d as any), (d as any)._bindings.push(binding));
  for (let l of curNewDerives) l._dom = newDom;
  curNewDerives = prevNewDerives;
  return (binding._dom = newDom);
};

/**
 * Derives a State<T> based on a function and optional paremeters.
 *
 * @template T - The type of value returned by the derivation function.
 * @param {() => T} f - The derivation that computes the value.
 * @param {State<T>} [s] - Optional initial State<T> object to store the derived value.
 * @param {ChildDom} [dom] - Optional DOM element or ChildDom to associate with the derivation.
 * @returns {State<T>} The State<T> object containing the derived value and associated dependencies.
 */
const derive = <T>(f: () => T, s?: State<T>, dom?: ChildDom): State<T> => {
  s = s ?? state();
  let deps: Dependencies<T> = { _getters: new Set(), _setters: new Set() };
  let listener: { [key: string]: any } = { f, s };
  listener._dom = dom ?? curNewDerives?.push(listener) ?? alwaysConnectedDom;
  s.val = runAndCaptureDependencies(f, deps, s.rawVal);
  for (let d of deps._getters)
    deps._setters.has(d) ||
      (addForGarbageCollection(d), d._listeners.push(listener as Listener<T>));
  return s;
};

/**
 * Appends child elements to a DOM element and returns said DOM element.
 *
 * @param {Element} dom - The DOM element to which children will be added.
 * @param {readonly ChildDom[]} children - An array of child elements or arrays of child elements to add.
 * @returns {Element} The modified DOM element after adding all children.
 */
const add = (dom: Element, ...children: readonly ChildDom[]): Element => {
  for (let c of (children as any).flat(Infinity)) {
    const protoOfC = protoOf(c ?? 0);
    const child =
      protoOfC === stateProto
        ? bind(() => c.val)
        : protoOfC === funcProto
        ? bind(c)
        : c;
    child != _undefined && dom.append(child);
  }
  return dom;
};

/**
 * Creates a new DOM element with specified namespace, tag name, properties,
 * and children.
 */
const tag = (ns: string | null, name: string, ...args: any): Element => {
  const [props, ...children] =
    protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args];

  const dom: Element | HTMLElement = ns
    ? _document.createElementNS(ns, name)
    : _document.createElement(name);

  for (let [k, v] of _object.entries(props)) {
    const getDesc: PropertyDescriptorSearchFn<any> = (proto: any) =>
      proto
        ? _object.getOwnPropertyDescriptor(proto, k as PropertyKey) ??
          getDesc(protoOf(proto))
        : _undefined;

    const cacheKey = `${name},${k}`;

    const propSetter =
      propSetterCache[cacheKey] ??
      (propSetterCache[cacheKey] = getDesc(protoOf(dom))?.set ?? 0);

    const setter: PropSetterFn | EventSetterFn = k.startsWith("on")
      ? (
          v: EventListenerOrEventListenerObject,
          oldV?: EventListenerOrEventListenerObject
        ) => {
          const event = k.slice(2);
          if (oldV) dom.removeEventListener(event, oldV);
          dom.addEventListener(event, v);
        }
      : propSetter
      ? propSetter.bind(dom)
      : dom.setAttribute.bind(dom, k);

    let protoOfV = protoOf(v ?? 0);

    k.startsWith("on") ||
      (protoOfV === funcProto &&
        ((v = derive(v as BindingFunc)), (protoOfV = stateProto)));

    protoOfV === stateProto
      ? bind(() => (setter((v as any).val, (v as any)._oldVal), dom))
      : setter(v as EventListenerOrEventListenerObject);
  }

  return add(dom, ...children);
};

/**
 * Creates a proxy handler object for intercepting the 'get' property access
 * operation. The handler wraps the access in a function call that binds the
 * accessed property name along with an optional namespace.
 */
const proxyHandler = (namespace?: string): ProxyHandler<object> => {
  return {
    get: (_: never, name: string) =>
      tag.bind(_undefined, namespace ?? null, name),
  };
};

/**
 * Creates a Proxy-based Tags object with optional namespace functionality.
 *
 * @function
 * @param {string} [namespace] - Optional namespace for organizing tags.
 * @returns {Tags & NamespaceFunction} A Proxy object representing tags and namespaces.
 */
const tags = new Proxy(
  (namespace?: string) =>
    new Proxy(tag, proxyHandler(namespace)) as NamespaceFunction,
  proxyHandler()
) as Tags & NamespaceFunction;

/**
 * Updates a DOM element with a new DOM element, replacing the old one or
 * removing it if newDom is null or undefined.
 *
 * @template T
 * @param {T} dom - The current DOM element to update.
 * @param {T} newDom - The new DOM element to replace with.
 * @returns {void}
 */
const update = <T>(dom: T, newDom: T): void => {
  newDom
    ? newDom !== dom &&
      (dom as HTMLElement).replaceWith(newDom as string | Node)
    : (dom as HTMLElement).remove();
};

/**
 * Updates DOM elements based on changed and derived states.
 */
const updateDoms = () => {
  let iter = 0,
    derivedStatesArray = changedStates
      ? [...changedStates].filter((s) => s.rawVal !== s._oldVal)
      : [];
  do {
    derivedStates = new Set();
    for (let l of new Set(
      derivedStatesArray.flatMap(
        (s) => (s._listeners = keepConnected(s._listeners))
      )
    ))
      derive(l.f, l.s, l._dom), (l._dom = _undefined);
  } while (++iter < 100 && (derivedStatesArray = [...derivedStates]).length);
  let changedStatesArray = changedStates
    ? [...changedStates].filter((s) => s.rawVal !== s._oldVal)
    : [];
  changedStates = _undefined;
  for (let b of new Set(
    changedStatesArray.flatMap(
      (s) => (s._bindings = keepConnected(s._bindings))
    )
  ))
    b._dom && update(b._dom, bind(b.f, b._dom)), (b._dom = _undefined);

  for (let s of changedStatesArray) s._oldVal = s.rawVal;
};

/**
 * Hydrates a DOM element with a function that updates its content.
 *
 * @template T
 * @param {T} dom - The DOM node to hydrate.
 * @param {(dom: T) => T | null | undefined} updateFn - The function to update the DOM node.
 * @returns {T | void} The updated DOM node or void if update fails.
 */
const hydrate = <T extends Node>(
  dom: T,
  updateFn: (dom: T) => T | null | undefined
): T | void => {
  return update(dom, bind(updateFn, dom));
};

export default { add, tags, state, derive, hydrate };
