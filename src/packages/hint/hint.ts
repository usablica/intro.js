import { Package } from "../package";
import { getDefaultHintOptions, HintOptions } from "./option";
import { HintItem } from "./hintItem";
import { setOption, setOptions } from "src/option";
import isFunction from "../../util/isFunction";
import debounce from "src/util/debounce";
import { reAlignHints } from "./position";
import DOMEvent from "src/util/DOMEvent";

type hintsAddedCallback = (this: Hint) => void | Promise<void>;
type hintClickCallback = (
  this: Hint,
  hintElement: HTMLElement,
  item: HintItem,
  stepId: number
) => void | Promise<void>;
type hintCloseCallback = (this: Hint, stepId: number) => void | Promise<void>;

export class Hint implements Package<HintOptions> {
  private _hints: HintItem[] = [];
  private readonly _targetElement: HTMLElement;
  private _options: HintOptions;
  private readonly callbacks: {
    hintsAdded?: hintsAddedCallback;
    hintClick?: hintClickCallback;
    hintClose?: hintCloseCallback;
  } = {};
  private _hintsAutoRefreshFunction?: () => void;

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;
    this._options = getDefaultHintOptions();
  }

  callback<K extends keyof typeof this.callbacks>(
    callbackName: K
  ): (typeof this.callbacks)[K] | undefined {
    const callback = this.callbacks[callbackName];
    if (isFunction(callback)) {
      return callback;
    }
    return undefined;
  }

  getTargetElement(): HTMLElement {
    return this._targetElement;
  }

  getHints(): HintItem[] {
    return this._hints;
  }

  getHint(stepId: number): HintItem | undefined {
    return this._hints[stepId];
  }

  setHints(hints: HintItem[]): this {
    this._hints = hints;
    return this;
  }

  addHint(hint: HintItem): this {
    this._hints.push(hint);
    return this;
  }

  enableHintAutoRefresh(): this {
    const hintAutoRefreshInterval = this.getOption("hintAutoRefreshInterval");
    if (hintAutoRefreshInterval >= 0) {
      this._hintsAutoRefreshFunction = debounce(
        () => reAlignHints(this),
        hintAutoRefreshInterval
      );

      DOMEvent.on(window, "scroll", this._hintsAutoRefreshFunction, true);
    }

    return this;
  }

  disableHintAutoRefresh(): this {
    if (this._hintsAutoRefreshFunction) {
      DOMEvent.off(window, "scroll", this._hintsAutoRefreshFunction, true);

      this._hintsAutoRefreshFunction = undefined;
    }

    return this;
  }

  getOption<K extends keyof HintOptions>(key: K): HintOptions[K] {
    return this._options[key];
  }

  setOptions(partialOptions: Partial<HintOptions>): this {
    this._options = setOptions(this._options, partialOptions);
    return this;
  }

  setOption<K extends keyof HintOptions>(key: K, value: HintOptions[K]): this {
    this._options = setOption(this._options, key, value);
    return this;
  }

  clone(): ThisType<this> {
    return new Hint(this._targetElement);
  }

  isActive(): boolean {
    return this.getOption("isActive");
  }

  render(): Promise<this> {
    throw new Error("Method not implemented.");
  }

  onhintsadded(providedCallback: hintsAddedCallback) {
    if (isFunction(providedCallback)) {
      this.callbacks.hintsAdded = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  }

  onhintclick(providedCallback: hintClickCallback) {
    if (isFunction(providedCallback)) {
      this.callbacks.hintClick = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  }

  onhintclose(providedCallback: hintCloseCallback) {
    if (isFunction(providedCallback)) {
      this.callbacks.hintClose = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }
}
