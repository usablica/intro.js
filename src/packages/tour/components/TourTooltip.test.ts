import { Header } from "./TourTooltip";

describe("Header", () => {
  it("renders plain text title when renderAsHtml is false", () => {
    const el = Header({
      title: "<strong>Bold Text</strong>",
      skipLabel: "Skip",
      renderAsHtml: false,
      onSkipClick: jest.fn(),
    });

    const h1 = el.querySelector("h1")!;

    expect(h1.innerHTML).toBe("&lt;strong&gt;Bold Text&lt;/strong&gt;");
    expect(h1.querySelector("strong")).toBeNull();
  });

  it("renders HTML title when renderAsHtml is true", () => {
    const el = Header({
      title: "<strong>Bold Text</strong>",
      skipLabel: "Skip",
      renderAsHtml: true,
      onSkipClick: jest.fn(),
    });

    const h1 = el.querySelector("h1")!;

    expect(h1.innerHTML).toBe("<strong>Bold Text</strong>");
    expect(h1.querySelector("strong")?.textContent).toBe("Bold Text");
  });

  it("takes no room without a title (#1149)", () => {
    const el = Header({
      title: "",
      skipLabel: "Skip",
      onSkipClick: jest.fn(),
    });

    expect(el.querySelector("h1")).toBeNull();
    expect(el.classList.contains("introjs-tooltip-header-notitle")).toBe(true);
    // the close button is still there
    expect(el.querySelector(".introjs-skipbutton")).not.toBeNull();
  });

  it("is a normal header with a title", () => {
    const el = Header({
      title: "A title",
      skipLabel: "Skip",
      onSkipClick: jest.fn(),
    });

    expect(el.classList.contains("introjs-tooltip-header-notitle")).toBe(false);
  });
});
