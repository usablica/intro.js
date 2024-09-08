import { Package } from "../package";
import { getDefaultHintOptions, HintOptions } from "./option";
import { fetchHintItems, HintItem } from "./hintItem";
import { setOption, setOptions } from "../../option";
import isFunction from "../../util/isFunction";
import debounce from "../../util/debounce";
import DOMEvent from "../../util/DOMEvent";
import { getContainerElement } from "../../util/containerElement";
import { hideHint, hideHints } from "./hide";
import { showHint, showHints } from "./show";
import van from "../dom/van";
import { HintsRoot } from "./components/HintsRoot";

type hintsAddedCallback = (this: Hint) => void | Promise<void>;
type hintClickCallback = (this: Hint, item: HintItem) => void | Promise<void>;
type hintCloseCallback = (this: Hint, item: HintItem) => void | Promise<void>;

export class Hint implements Package<HintOptions> {
  private _root: HTMLElement | undefined;
  private _hints: HintItem[] = [];
  private readonly _targetElement: HTMLElement;
  private _options: HintOptions;
  private _activeHintSignal = van.state<number | undefined>(undefined);
  private _refreshes = van.state(0);

  private readonly callbacks: {
    hintsAdded?: hintsAddedCallback;
    hintClick?: hintClickCallback;
    hintClose?: hintCloseCallback;
  } = {};

  // Event handlers
  private _hintsAutoRefreshFunction?: () => void;
  // The hint close function used when the user clicks outside the hint
  private _windowClickFunction?: () => void;

  /**
   * Create a new Hint instance
   * @param elementOrSelector Optional target element or CSS query to start the Hint on
   * @param options Optional Hint options
   */
  public constructor(
    elementOrSelector?: string | HTMLElement,
    options?: Partial<HintOptions>
  ) {
    this._targetElement = getContainerElement(elementOrSelector);
    this._options = options
      ? setOptions(this._options, options)
      : getDefaultHintOptions();
  }

  /**
   * Get the callback function for the provided callback name
   * @param callbackName The name of the callback
   */
  callback<K extends keyof typeof this.callbacks>(
    callbackName: K
  ): (typeof this.callbacks)[K] | undefined {
    const callback = this.callbacks[callbackName];
    if (isFunction(callback)) {
      return callback;
    }
    return undefined;
  }

  /**
   * Get the target element for the Hint
   */
  getTargetElement(): HTMLElement {
    return this._targetElement;
  }

  /**
   * Get the Hint items
   */
  getHints(): HintItem[] {
    return this._hints;
  }

  /**
   * Get the Hint item for the provided step ID
   * @param stepId The step ID
   */
  getHint(stepId: number): HintItem | undefined {
    return this._hints[stepId];
  }

  /**
   * Set the Hint items
   * @param hints The Hint items
   */
  setHints(hints: HintItem[]): this {
    this._hints = hints;
    return this;
  }

  /**
   * Add a Hint item
   * @param hint The Hint item
   */
  addHint(hint: HintItem): this {
    // always set isActive to true
    hint.isActive = van.state(true);
    this._hints.push(hint);
    return this;
  }

  /**
   * Get the active hint signal
   * This is meant to be used internally by the Hint package
   */
  getActiveHintSignal() {
    return this._activeHintSignal;
  }

  /**
   * Returns the underlying state of the refreshes
   * This is an internal method and should not be used outside of the package.
   */
  getRefreshesSignal() {
    return this._refreshes;
  }

  /**
   * Returns true if the hints are rendered
   */
  isRendered() {
    return this._root !== undefined;
  }

  private createRoot() {
    this._root = HintsRoot({ hint: this });
    van.add(this._targetElement, this._root);
  }

  private recreateRoot() {
    if (this._root) {
      this._root.remove();
      this.createRoot();
    }
  }

  /**
   * Render hints on the page
   */
  async render(): Promise<this> {
    if (!this.isActive()) {
      return this;
    }

    if (this.isRendered()) {
      return this;
    }

    fetchHintItems(this);
    this.createRoot();

    this.callback("hintsAdded")?.call(this);

    this.enableHintAutoRefresh();
    this.enableCloseDialogOnWindowClick();

    return this;
  }

  /**
   * Enable closing the dialog when the user clicks outside the hint
   */
  enableCloseDialogOnWindowClick() {
    this._windowClickFunction = () => {
      this._activeHintSignal.val = undefined;
    };

    DOMEvent.on(document, "click", this._windowClickFunction, false);
  }

  /**
   * Disable closing the dialog when the user clicks outside the hint
   */
  disableCloseDialogOnWindowClick() {
    if (this._windowClickFunction) {
      DOMEvent.off(document, "click", this._windowClickFunction, false);
    }
  }

  /**
   * @deprecated renderHints() is deprecated, please use render() instead
   */
  async addHints() {
    return this.render();
  }

  /**
   * Hide a specific hint on the page
   * @param stepId The hint step ID
   */
  async hideHint(stepId: number) {
    const hintItem = this.getHint(stepId);

    if (hintItem) {
      await hideHint(this, hintItem);
    }

    return this;
  }

  /**
   * Hide all hints on the page
   */
  async hideHints() {
    await hideHints(this);
    return this;
  }

  /**
   * Show a specific hint on the page
   * @param stepId The hint step ID
   */
  showHint(stepId: number) {
    const hintItem = this.getHint(stepId);

    if (hintItem) {
      showHint(hintItem);
    }

    return this;
  }

  /**
   * Show all hints on the page
   */
  async showHints() {
    await showHints(this);
    return this;
  }

  /**
   * Destroys and removes all hint elements on the page
   * Useful when you want to destroy the elements and add them again (e.g. a modal or popup)
   */
  destroy() {
    if (this._root) {
      this._root.remove();
      this._root = undefined;
    }

    this.disableHintAutoRefresh();
    this.disableCloseDialogOnWindowClick();

    return this;
  }

  /**
   * @deprecated removeHints() is deprecated, please use destroy() instead
   */
  removeHints() {
    this.destroy();
    return this;
  }

  /**
   * Remove one single hint element from the page
   * Useful when you want to destroy the element and add them again (e.g. a modal or popup)
   * Use removeHints if you want to remove all elements.
   *
   * @param stepId The hint step ID
   */
  removeHint(stepId: number) {
    this._hints = this._hints.filter((_, i) => i !== stepId);
    this.recreateRoot();

    return this;
  }

  /**
   * Show hint dialog for a specific hint
   * @param stepId The hint step ID
   */
  async showHintDialog(stepId: number) {
    const item = this.getHint(stepId);

    if (!item) return;

    this._activeHintSignal.val = stepId;

    // call the callback function (if any)
    await this.callback("hintClick")?.call(this, item);

    return this;
  }

  /**
   * Hide hint dialog from the page
   */
  hideHintDialog() {
    this._activeHintSignal.val = undefined;
    return this;
  }

  /**
   * Refresh the hints on the page
   */
  public refresh() {
    if (!this.isRendered()) {
      return this;
    }

    if (this._refreshes.val !== undefined) {
      this._refreshes.val += 1;
    }

    return this;
  }

  /**
   * Enable hint auto refresh on page scroll and resize for hints
   */
  enableHintAutoRefresh(): this {
    const hintAutoRefreshInterval = this.getOption("hintAutoRefreshInterval");
    if (hintAutoRefreshInterval >= 0) {
      this._hintsAutoRefreshFunction = debounce(
        () => this.refresh(),
        hintAutoRefreshInterval
      );

      DOMEvent.on(window, "scroll", this._hintsAutoRefreshFunction, true);
      DOMEvent.on(window, "resize", this._hintsAutoRefreshFunction, true);
    }

    return this;
  }

  /**
   * Disable hint auto refresh on page scroll and resize for hints
   */
  disableHintAutoRefresh(): this {
    if (this._hintsAutoRefreshFunction) {
      DOMEvent.off(window, "scroll", this._hintsAutoRefreshFunction, true);
      DOMEvent.on(window, "resize", this._hintsAutoRefreshFunction, true);

      this._hintsAutoRefreshFunction = undefined;
    }

    return this;
  }

  /**
   * Get specific Hint option
   * @param key The option key
   */
  getOption<K extends keyof HintOptions>(key: K): HintOptions[K] {
    return this._options[key];
  }

  /**
   * Set Hint options
   * @param partialOptions Hint options
   */
  setOptions(partialOptions: Partial<HintOptions>): this {
    this._options = setOptions(this._options, partialOptions);
    return this;
  }

  /**
   * Set specific Hint option
   * @param key Option key
   * @param value Option value
   */
  setOption<K extends keyof HintOptions>(key: K, value: HintOptions[K]): this {
    this._options = setOption(this._options, key, value);
    return this;
  }

  /**
   * Clone the Hint instance
   */
  clone(): ThisType<this> {
    return new Hint(this._targetElement, this._options);
  }

  /**
   * Returns true if the Hint is active
   */
  isActive(): boolean {
    return this.getOption("isActive");
  }

  onHintsAdded(providedCallback: hintsAddedCallback) {
    if (!isFunction(providedCallback)) {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }

    this.callbacks.hintsAdded = providedCallback;
    return this;
  }

  /**
   * @deprecated onhintsadded is deprecated, please use onHintsAdded instead
   * @param providedCallback callback function
   */
  onhintsadded(providedCallback: hintsAddedCallback) {
    this.onHintsAdded(providedCallback);
  }

  /**
   * Callback for when hint items are clicked
   * @param providedCallback callback function
   */
  onHintClick(providedCallback: hintClickCallback) {
    if (!isFunction(providedCallback)) {
      throw new Error("Provided callback for onhintclick was not a function.");
    }

    this.callbacks.hintClick = providedCallback;
    return this;
  }

  /**
   * @deprecated onhintclick is deprecated, please use onHintClick instead
   * @param providedCallback
   */
  onhintclick(providedCallback: hintClickCallback) {
    this.onHintClick(providedCallback);
  }

  /**
   * Callback for when hint items are closed
   * @param providedCallback callback function
   */
  onHintClose(providedCallback: hintCloseCallback) {
    if (isFunction(providedCallback)) {
      this.callbacks.hintClose = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }

  /**
   * @deprecated onhintclose is deprecated, please use onHintClose instead
   * @param providedCallback
   */
  onhintclose(providedCallback: hintCloseCallback) {
    this.onHintClose(providedCallback);
  }
}
