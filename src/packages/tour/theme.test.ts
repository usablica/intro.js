import {
  Theme,
  registerTheme,
  registerThemes,
  getThemePath,
  getRegisteredThemes,
} from "./theme";

const mockMatchMedia = (prefersDark: boolean) => {
  const listeners: Set<() => void> = new Set();
  const mql = {
    matches: prefersDark,
    addEventListener: jest.fn((_: string, cb: () => void) => listeners.add(cb)),
    removeEventListener: jest.fn((_: string, cb: () => void) =>
      listeners.delete(cb)
    ),
    dispatchChange: () => {
      mql.matches = !mql.matches;
      listeners.forEach((cb) => cb());
    },
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockReturnValue(mql),
  });
  return mql;
};

describe("Theme", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("div");
    document.body.appendChild(root);
    jest.resetAllMocks();
  });

  afterEach(() => {
    root.remove();
  });

  describe("constructor", () => {
    test("defaults to document.documentElement when no root provided", () => {
      mockMatchMedia(false);
      const theme = new Theme({ theme: "light" });
      expect(document.documentElement.classList.contains("introjs-light")).toBe(
        true
      );
      theme.destroy();
      document.documentElement.classList.remove("introjs-light");
    });

    test("applies introjs-light class for light theme", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "light" });
      expect(root.classList.contains("introjs-light")).toBe(true);
      expect(root.classList.contains("introjs-dark")).toBe(false);
      theme.destroy();
    });

    test("applies introjs-dark class for dark theme", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "dark" });
      expect(root.classList.contains("introjs-dark")).toBe(true);
      expect(root.classList.contains("introjs-light")).toBe(false);
      theme.destroy();
    });

    test("applies introjs-dark when auto and system is dark", () => {
      mockMatchMedia(true);
      const theme = new Theme({ root, theme: "auto" });
      expect(root.classList.contains("introjs-dark")).toBe(true);
      theme.destroy();
    });

    test("applies introjs-light when auto and system is light", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "auto" });
      expect(root.classList.contains("introjs-light")).toBe(true);
      theme.destroy();
    });

    test("defaults to auto when no theme provided", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root });
      expect(root.classList.contains("introjs-light")).toBe(true);
      theme.destroy();
    });
  });

  describe("auto mode - system theme change", () => {
    test("updates class when system theme changes", () => {
      const mql = mockMatchMedia(false);
      const theme = new Theme({ root, theme: "auto" });

      expect(root.classList.contains("introjs-light")).toBe(true);

      mql.dispatchChange();

      expect(root.classList.contains("introjs-dark")).toBe(true);
      expect(root.classList.contains("introjs-light")).toBe(false);

      theme.destroy();
    });

    test("registers addEventListener on construction", () => {
      const mql = mockMatchMedia(false);
      new Theme({ root, theme: "auto" }).destroy();
      expect(mql.addEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });
  });

  describe("destroy", () => {
    test("removes event listener on destroy", () => {
      const mql = mockMatchMedia(false);
      const theme = new Theme({ root, theme: "auto" });
      theme.destroy();
      expect(mql.removeEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    });

    test("does not listen for changes after destroy", () => {
      const mql = mockMatchMedia(false);
      const theme = new Theme({ root, theme: "auto" });
      theme.destroy();

      root.classList.remove("introjs-light", "introjs-dark");
      mql.dispatchChange();

      expect(root.classList.contains("introjs-dark")).toBe(false);
    });

    test("does not throw when destroyed twice", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "light" });
      expect(() => {
        theme.destroy();
        theme.destroy();
      }).not.toThrow();
    });
  });

  describe("setTheme", () => {
    test("switches from light to dark", async () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "light" });
      await theme.setTheme("dark");
      expect(root.classList.contains("introjs-dark")).toBe(true);
      expect(root.classList.contains("introjs-light")).toBe(false);
      theme.destroy();
    });

    test("switches from dark to light", async () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "dark" });
      await theme.setTheme("light");
      expect(root.classList.contains("introjs-light")).toBe(true);
      expect(root.classList.contains("introjs-dark")).toBe(false);
      theme.destroy();
    });
  });

  describe("setRoot", () => {
    test("moves theme class to new root", () => {
      mockMatchMedia(false);
      const newRoot = document.createElement("div");
      const theme = new Theme({ root, theme: "light" });

      theme.setRoot(newRoot);

      expect(newRoot.classList.contains("introjs-light")).toBe(true);
      theme.destroy();
    });

    test("does nothing when same root is passed", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "light" });
      theme.setRoot(root);
      expect(root.classList.contains("introjs-light")).toBe(true);
      theme.destroy();
    });
  });

  describe("value getter", () => {
    test("returns light for light theme", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "light" });
      expect(theme.value).toBe("light");
      theme.destroy();
    });

    test("returns dark for dark theme", () => {
      mockMatchMedia(false);
      const theme = new Theme({ root, theme: "dark" });
      expect(theme.value).toBe("dark");
      theme.destroy();
    });
  });
});

describe("registerTheme / registerThemes", () => {
  test("registers a custom theme", () => {
    registerTheme("ocean", "/themes/ocean.css");
    expect(getThemePath("ocean")).toBe("/themes/ocean.css");
  });

  test("registers multiple themes at once", () => {
    registerThemes([
      { name: "sunset", cssPath: "/themes/sunset.css" },
      { name: "forest", cssPath: "/themes/forest.css" },
    ]);
    expect(getThemePath("sunset")).toBe("/themes/sunset.css");
    expect(getThemePath("forest")).toBe("/themes/forest.css");
  });

  test("getRegisteredThemes includes registered themes", () => {
    registerTheme("coral", "/themes/coral.css");
    expect(getRegisteredThemes()).toContain("coral");
  });

  test("returns undefined for unknown theme", () => {
    expect(getThemePath("nonexistent-theme-xyz")).toBeUndefined();
  });

  test("built-in themes are not in the registry", () => {
    expect(getThemePath("light")).toBeUndefined();
    expect(getThemePath("dark")).toBeUndefined();
    expect(getThemePath("auto")).toBeUndefined();
  });
});
