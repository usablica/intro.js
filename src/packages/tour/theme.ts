// theme.ts
export type ThemeType = "light" | "dark" | "auto";

export interface ThemeOptions {
  theme?: ThemeType;
  root?: HTMLElement;
}

export class Theme {
  private _theme: "light" | "dark";
  private _root: HTMLElement;
  private mqlDark: MediaQueryList | null = null;
  private boundHandleSystemThemeChange: () => void;
  private themeType: ThemeType;

  constructor(options: ThemeOptions = {}) {
    this._root = options.root ?? document.documentElement;
    this.themeType = options.theme ?? "auto";

    this.boundHandleSystemThemeChange = this.handleSystemThemeChange.bind(this);

    this._theme = this.resolveTheme(this.themeType);
    this.applyToRoot();

    if (this.themeType === "auto") {
      this.mqlDark = window.matchMedia("(prefers-color-scheme: dark)");
      if ("addEventListener" in this.mqlDark) {
        this.mqlDark.addEventListener(
          "change",
          this.boundHandleSystemThemeChange
        );
      } else {
        (this.mqlDark as any).addListener(this.boundHandleSystemThemeChange);
      }
    }
  }

  private resolveTheme(theme: ThemeType): "light" | "dark" {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }

  private handleSystemThemeChange() {
    if (this.themeType === "auto") {
      this._theme = this.resolveTheme("auto");
      this.applyToRoot();
    }
  }

  private applyToRoot() {
    this._root.classList.remove("introjs-light", "introjs-dark");
    this._root.classList.add(`introjs-${this._theme}`);
  }

  /** Change theme manually */
  public setTheme(themeType: ThemeType) {
    this.themeType = themeType;
    this._theme = this.resolveTheme(themeType);
    this.applyToRoot();
  }

  /** Update the root element (useful for tour reopen) */
  public setRoot(root: HTMLElement) {
    if (this._root !== root) {
      this._root = root;
      this.applyToRoot();
    }
  }

  /** Optional cleanup */
  public destroy() {
    if (this.mqlDark) {
      if ("removeEventListener" in this.mqlDark) {
        this.mqlDark.removeEventListener(
          "change",
          this.boundHandleSystemThemeChange
        );
      } else {
        (this.mqlDark as any).removeListener(this.boundHandleSystemThemeChange);
      }
      this.mqlDark = null;
    }
  }

  public get value(): "light" | "dark" {
    return this._theme;
  }
}

let currentTheme: Theme | null = null;

export function getTheme(): Theme {
  if (!currentTheme) {
    currentTheme = new Theme({ theme: "auto" });
  }
  return currentTheme;
}

export function applyTheme(options: ThemeOptions = {}) {
  if (!currentTheme) {
    currentTheme = new Theme(options);
  } else {
    currentTheme.setTheme(options.theme ?? "auto");
    if (options.root) {
      currentTheme.setRoot(options.root);
    }
  }
  return currentTheme;
}
