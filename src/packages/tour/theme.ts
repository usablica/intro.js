export type ThemeType = "light" | "dark" | "auto" | string;

export interface ThemeOptions {
  theme?: ThemeType;
  root?: HTMLElement;
  themePath?: string; // Path to custom CSS file
}

export interface ThemeRegistration {
  name: string;
  cssPath: string;
}

// Built-in themes handled via CSS classes + variables — no external CSS needed.
const builtInThemes = new Set(["light", "dark", "auto"]);

// Registry for external CSS-file-based themes (e.g. "modern", "nassim").
const themeRegistry: Map<string, string> = new Map([
  ["modern", "themes/introjs-modern.css"],
  ["flattener", "themes/introjs-flattener.css"],
  ["nassim", "themes/introjs-nassim.css"],
  ["nazanin", "themes/introjs-nazanin.css"],
  ["royal", "themes/introjs-royal.css"],
]);

// Track loaded CSS files to avoid duplicate loads
const loadedCssFiles: Set<string> = new Set();

function loadCssFile(cssPath: string, themeId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loadedCssFiles.has(cssPath)) {
      resolve();
      return;
    }

    const existingLink = document.querySelector(
      `link[data-introjs-theme="${themeId}"]`
    );
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = cssPath;
    link.setAttribute("data-introjs-theme", themeId);

    link.onload = () => {
      loadedCssFiles.add(cssPath);
      resolve();
    };

    link.onerror = () => {
      reject(new Error(`Failed to load theme CSS: ${cssPath}`));
    };

    document.head.appendChild(link);
  });
}

function unloadCssFile(themeId: string): void {
  const link = document.querySelector(`link[data-introjs-theme="${themeId}"]`);
  if (link) {
    const cssPath = link.getAttribute("href");
    link.remove();
    if (cssPath) {
      loadedCssFiles.delete(cssPath);
    }
  }
}

export function registerTheme(name: string, cssPath: string): void {
  themeRegistry.set(name, cssPath);
}

export function registerThemes(themes: ThemeRegistration[]): void {
  themes.forEach((theme) => {
    registerTheme(theme.name, theme.cssPath);
  });
}

export function getThemePath(themeName: string): string | undefined {
  return themeRegistry.get(themeName);
}

export function getRegisteredThemes(): string[] {
  return Array.from(themeRegistry.keys());
}

export class Theme {
  private _theme: "light" | "dark";
  private _root: HTMLElement;
  private _currentThemeName: string;
  // id of the external CSS file currently loaded (if any), used to unload it later.
  // Kept separate from _currentThemeName because that field is updated to the *new*
  // theme before the *old* theme's CSS needs to be unloaded.
  private _loadedThemeId: string | null = null;
  private mqlDark: MediaQueryList | null = null;
  private boundHandleSystemThemeChange: () => void;
  private themeType: ThemeType;

  constructor(options: ThemeOptions = {}) {
    this._root = options.root ?? document.documentElement;
    this.themeType = options.theme ?? "auto";
    this._currentThemeName = this.themeType;

    this.boundHandleSystemThemeChange = this.handleSystemThemeChange.bind(this);

    this._theme = this.resolveTheme(this.themeType);

    this.loadThemeCss(this.themeType, options.themePath).catch((error) => {
      console.error("Failed to load theme:", error);
    });

    this.applyToRoot();

    this.syncAutoListener();
  }

  private syncAutoListener() {
    const shouldListen = this.themeType === "auto";

    if (shouldListen && !this.mqlDark) {
      this.mqlDark = window.matchMedia("(prefers-color-scheme: dark)");
      if ("addEventListener" in this.mqlDark) {
        this.mqlDark.addEventListener(
          "change",
          this.boundHandleSystemThemeChange
        );
      } else {
        (this.mqlDark as any).addListener(this.boundHandleSystemThemeChange);
      }
    } else if (!shouldListen && this.mqlDark) {
      this.removeAutoListener();
    }
  }

  private removeAutoListener() {
    if (!this.mqlDark) return;

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

  private resolveTheme(theme: ThemeType): "light" | "dark" {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    if (theme === "dark") {
      return "dark";
    }
    return "light";
  }

  private async loadThemeCss(
    themeName: string,
    customPath?: string
  ): Promise<void> {
    if (this._loadedThemeId) {
      unloadCssFile(this._loadedThemeId);
      this._loadedThemeId = null;
    }

    // Built-in themes (light, dark, auto) use CSS classes — no external file needed.
    if (builtInThemes.has(themeName)) {
      return;
    }

    if (customPath) {
      await loadCssFile(customPath, themeName);
      this.onCssLoaded(themeName);
      return;
    }

    const registeredPath = getThemePath(themeName);
    if (registeredPath) {
      await loadCssFile(registeredPath, themeName);
      this.onCssLoaded(themeName);
    }
  }

  // Called once a theme's CSS has finished loading. If setTheme() was called
  // again in the meantime, this load has already been superseded — unload it
  // immediately instead of tracking it, so it doesn't leak or get mistaken
  // for the currently active theme.
  private onCssLoaded(themeName: string): void {
    if (this._currentThemeName === themeName) {
      this._loadedThemeId = themeName;
    } else {
      unloadCssFile(themeName);
    }
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

  public async setTheme(
    themeType: ThemeType,
    themePath?: string
  ): Promise<void> {
    this.themeType = themeType;
    this._currentThemeName = themeType;
    this._theme = this.resolveTheme(themeType);

    this.syncAutoListener();
    await this.loadThemeCss(themeType, themePath);
    this.applyToRoot();
  }

  public setRoot(root: HTMLElement) {
    if (this._root !== root) {
      this._root = root;
      this.applyToRoot();
    }
  }

  public destroy() {
    this.removeAutoListener();

    if (this._loadedThemeId) {
      unloadCssFile(this._loadedThemeId);
      this._loadedThemeId = null;
    }
  }

  public get value(): "light" | "dark" {
    return this._theme;
  }

  public get currentTheme(): string {
    return this._currentThemeName;
  }
}
