// theme.ts
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

// Theme registry to store custom themes
const themeRegistry: Map<string, string> = new Map([
  ["dark", "themes/introjs-dark.css"],
  ["light", "themes/introjs-light.css"],
  ["modern", "themes/introjs-modern.css"],
  ["flattener", "themes/introjs-flattener.css"],
  ["nassim", "themes/introjs-nassim.css"],
  ["nazanin", "themes/introjs-nazanin.css"],
  ["royal", "themes/introjs-royal.css"],
]);

// Track loaded CSS files to avoid duplicate loads
const loadedCssFiles: Set<string> = new Set();

/**
 * Dynamically loads a CSS file into the document
 * @param cssPath - Path to the CSS file
 * @param themeId - Unique identifier for this theme
 * @returns Promise that resolves when CSS is loaded
 */
function loadCssFile(cssPath: string, themeId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (loadedCssFiles.has(cssPath)) {
      resolve();
      return;
    }

    // Check if link element already exists
    const existingLink = document.querySelector(
      `link[data-introjs-theme="${themeId}"]`
    );
    if (existingLink) {
      resolve();
      return;
    }

    // Create and append link element
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

/**
 * Removes a loaded CSS file from the document
 * @param themeId - Theme identifier
 */
function unloadCssFile(themeId: string): void {
  const link = document.querySelector(
    `link[data-introjs-theme="${themeId}"]`
  );
  if (link) {
    const cssPath = link.getAttribute("href");
    link.remove();
    if (cssPath) {
      loadedCssFiles.delete(cssPath);
    }
  }
}

/**
 * Register a custom theme
 * @param name - Theme name (e.g., "ocean", "sunset")
 * @param cssPath - Path to the CSS file
 */
export function registerTheme(name: string, cssPath: string): void {
  themeRegistry.set(name, cssPath);
}

/**
 * Register multiple themes at once
 * @param themes - Array of theme registrations
 */
export function registerThemes(themes: ThemeRegistration[]): void {
  themes.forEach((theme) => {
    registerTheme(theme.name, theme.cssPath);
  });
}

/**
 * Get the CSS path for a registered theme
 * @param themeName - Name of the theme
 * @returns CSS path or undefined if not found
 */
export function getThemePath(themeName: string): string | undefined {
  return themeRegistry.get(themeName);
}

/**
 * Get all registered theme names
 * @returns Array of theme names
 */
export function getRegisteredThemes(): string[] {
  return Array.from(themeRegistry.keys());
}

export class Theme {
  private _theme: "light" | "dark";
  private _root: HTMLElement;
  private _currentThemeName: string;
  private _currentCssPath: string | null = null;
  private mqlDark: MediaQueryList | null = null;
  private boundHandleSystemThemeChange: () => void;
  private themeType: ThemeType;

  constructor(options: ThemeOptions = {}) {
    this._root = options.root ?? document.documentElement;
    this.themeType = options.theme ?? "auto";
    this._currentThemeName = this.themeType;

    this.boundHandleSystemThemeChange = this.handleSystemThemeChange.bind(this);

    // Resolve the theme
    this._theme = this.resolveTheme(this.themeType);
    
    // Load CSS file if theme is registered or custom path provided
    this.loadThemeCss(this.themeType, options.themePath).catch((error) => {
      console.error("Failed to load theme:", error);
    });

    this.applyToRoot();

    // Set up auto theme detection if needed
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
    // For custom themes, default to light mode class if not explicitly dark
    if (theme === "dark") {
      return "dark";
    }
    return "light";
  }

  private async loadThemeCss(
    themeName: string,
    customPath?: string
  ): Promise<void> {
    // Unload previous theme CSS if exists
    if (this._currentCssPath) {
      unloadCssFile(this._currentThemeName);
    }

    // Skip loading for "auto" mode (uses classes only)
    if (themeName === "auto") {
      return;
    }

    // Use custom path if provided
    if (customPath) {
      await loadCssFile(customPath, themeName);
      this._currentCssPath = customPath;
      return;
    }

    // Check if theme is registered
    const registeredPath = getThemePath(themeName);
    if (registeredPath) {
      await loadCssFile(registeredPath, themeName);
      this._currentCssPath = registeredPath;
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

  /**
   * Change theme manually
   * @param themeType - Theme name ("light", "dark", "auto", or custom theme name)
   * @param themePath - Optional path to custom CSS file
   */
  public async setTheme(
    themeType: ThemeType,
    themePath?: string
  ): Promise<void> {
    this.themeType = themeType;
    this._currentThemeName = themeType;
    this._theme = this.resolveTheme(themeType);

    await this.loadThemeCss(themeType, themePath);
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

    // Unload CSS file
    if (this._currentCssPath) {
      unloadCssFile(this._currentThemeName);
      this._currentCssPath = null;
    }
  }

  public get value(): "light" | "dark" {
    return this._theme;
  }

  public get currentTheme(): string {
    return this._currentThemeName;
  }
}

let currentTheme: Theme | null = null;

export function getTheme(): Theme {
  if (!currentTheme) {
    currentTheme = new Theme({ theme: "auto" });
  }
  return currentTheme;
}

export function applyTheme(options: ThemeOptions = {}): Theme {
  if (!currentTheme) {
    currentTheme = new Theme(options);
  } else {
    currentTheme
      .setTheme(options.theme ?? "auto", options.themePath)
      .catch((error) => {
        console.error("Failed to apply theme:", error);
      });
    if (options.root) {
      currentTheme.setRoot(options.root);
    }
  }
  return currentTheme;
}
