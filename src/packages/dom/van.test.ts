import van from "./van";

const {
  a,
  b,
  button,
  div,
  h2,
  i,
  input,
  li,
  option,
  p,
  pre,
  select,
  span,
  sup,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
  ul,
} = van.tags;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const waitMsForDerivations = 5;

const createHiddenDom = () => {
  const dom = div({ class: "hidden" });
  van.add(document.body, dom);
  return dom;
};


describe("van", () => {
  describe("tag", () => {
    it("should create basic tag", () => {
      const dom = div(
        p("👋Hello"),
        ul(li("🗺️World"), li(a({ href: "https://vanjs.org/" }, "🍦VanJS")))
      );

      expect(dom.outerHTML).toBe(
        '<div><p>👋Hello</p><ul><li>🗺️World</li><li><a href="https://vanjs.org/">🍦VanJS</a></li></ul></div>'
      );
    });

    it("should add onclick event", () => {
      const dom = div(
        button({ onclick: () => van.add(dom, p("Button clicked!")) })
      );
      dom.querySelector("button")!.click();
      expect(dom.outerHTML).toBe(
        "<div><button></button><p>Button clicked!</p></div>"
      );
    });

    it("should escape html tags", () => {
      expect(p("<input>").outerHTML).toBe("<p>&lt;input&gt;</p>");
      expect(div("a && b").outerHTML).toBe("<div>a &amp;&amp; b</div>");
      expect(div("<input a && b>").outerHTML).toBe(
        "<div>&lt;input a &amp;&amp; b&gt;</div>"
      );
    });

    it("should create nested tags", () => {
      expect(ul([li("Item 1"), li("Item 2"), li("Item 3")]).outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"
      );
    });

    it("should create deep nested tags", () => {
      expect(ul([[li("Item 1"), [li("Item 2")]], li("Item 3")]).outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"
      );
    });

    it("should create tags with null props", () => {
      const dom = button({ onclick: null });
      expect(dom.onclick === null);
    });

    it("should connect props to state", async () => {
      const href = van.state("http://example.com/");
      const dom = a({ href }, "Test Link");
      van.add(createHiddenDom(), dom);
      expect(dom.href).toBe("http://example.com/");
      href.val = "https://vanjs.org/";
      await sleep(waitMsForDerivations);
      expect(dom.href).toBe("https://vanjs.org/");
    });

    it("should not change props when state is disconnected", async () => {
      const href = van.state("http://example.com/");
      const dom = a({ href }, "Test Link");
      expect(dom.href).toBe("http://example.com/");
      href.val = "https://vanjs.org/";
      await sleep(waitMsForDerivations);
      // href won't change as dom is not connected to document
      expect(dom.href).toBe("http://example.com/");
    });

    it("should change connect onclick handler with state", async () => {
      const dom = div()
      van.add(createHiddenDom(), dom)
      // TODO: fix the any type here. It should ideally be an EventListener | null
      const handler = van.state(<any>(() => van.add(dom, p("Button clicked!"))))
      van.add(dom, button({ onclick: handler }))
      dom.querySelector("button")!.click()
      expect(dom.outerHTML).toBe("<div><button></button><p>Button clicked!</p></div>")

      handler.val = () => van.add(dom, div("Button clicked!"))
      await sleep(waitMsForDerivations)
      dom.querySelector("button")!.click()
      expect(dom.outerHTML).toBe("<div><button></button><p>Button clicked!</p><div>Button clicked!</div></div>")

      handler.val = null
      await sleep(waitMsForDerivations)
      dom.querySelector("button")!.click()
      expect(dom.outerHTML).toBe("<div><button></button><p>Button clicked!</p><div>Button clicked!</div></div>")
    });

    it('should not change onclick handler when state is disconnected', async () => {
      const dom = div()
      const handler = van.state(() => van.add(dom, p("Button clicked!")))
      van.add(dom, button({ onclick: handler }))
      dom.querySelector("button")!.click()
      expect(dom.outerHTML).toBe("<div><button></button><p>Button clicked!</p></div>")

      handler.val = () => van.add(dom, div("Button clicked!"))
      await sleep(waitMsForDerivations)
      dom.querySelector("button")!.click()
      // The onclick handler won't change as dom is not connected to document, as a result, the <p> element will be added
      expect(dom.outerHTML).toBe("<div><button></button><p>Button clicked!</p><p>Button clicked!</p></div>")
    });

    it("should update props from a derived state", async () => {
      const host = van.state("example.com")
      const path = van.state("/hello")
      const dom = a({ href: () => `https://${host.val}${path.val}` }, "Test Link")
      van.add(createHiddenDom(), dom)
      expect(dom.href).toBe("https://example.com/hello")
      host.val = "vanjs.org"
      path.val = "/start"
      await sleep(waitMsForDerivations)
      expect(dom.href).toBe("https://vanjs.org/start")
    });

    it('should not update props from a disconnected derived state', async () => {
      const host = van.state("example.com")
      const path = van.state("/hello")
      const dom = a({ href: () => `https://${host.val}${path.val}` }, "Test Link")
      expect(dom.href).toBe("https://example.com/hello")
      host.val = "vanjs.org"
      path.val = "/start"
      await sleep(waitMsForDerivations)
      // href won't change as dom is not connected to document
      expect(dom.href).toBe("https://example.com/hello")
    });

    it("should update props when partial state", async () => {
      const host = van.state("example.com")
      const path = "/hello"
      const dom = a({ href: () => `https://${host.val}${path}` }, "Test Link")
      van.add(createHiddenDom(), dom)
      expect(dom.href).toBe("https://example.com/hello")
      host.val = "vanjs.org"
      await sleep(waitMsForDerivations)
      expect(dom.href).toBe("https://vanjs.org/hello")
    });

    it("should not update props when partial state is disconnected", async () => {
      const host = van.state("example.com")
      const path = "/hello"
      const dom = a({ href: () => `https://${host.val}${path}` }, "Test Link")
      expect(dom.href).toBe("https://example.com/hello")
      host.val = "vanjs.org"
      await sleep(waitMsForDerivations)
      // href won't change as dom is not connected to document
      expect(dom.href).toBe("https://example.com/hello")
    });

    it("should render correctly when connected state throws an error", async () => {
      const text = van.state("hello")
      const dom = div(
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error()
              return text.val
            },
            "data-name": text,
          },
          text,
        ),
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error()
              return text.val
            },
            "data-name": text,
          },
          text,
        ),
      )
      van.add(createHiddenDom(), dom)
      expect(dom.outerHTML).toBe('<div><div class="hello" data-name="hello">hello</div><div class="hello" data-name="hello">hello</div></div>')

      text.val = "fail"
      await sleep(waitMsForDerivations)
      // The binding function for `class` property throws an error.
      // We want to validate the `class` property won't be updated because of the error,
      // but other properties and child nodes are updated as usual.
      expect(dom.outerHTML).toBe('<div><div class="hello" data-name="fail">fail</div><div class="hello" data-name="fail">fail</div></div>')
    });

    it('should render correct when disconnected state throws an error', async () => {
      const text = van.state("hello")
      const dom = div(
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error()
              return text.val
            },
            "data-name": text,
          },
          text,
        ),
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error()
              return text.val
            },
            "data-name": text,
          },
          text,
        ),
      )
      expect(dom.outerHTML).toBe('<div><div class="hello" data-name="hello">hello</div><div class="hello" data-name="hello">hello</div></div>')

      text.val = "fail"
      await sleep(waitMsForDerivations)
      // `dom` won't change as it's not connected to document
      expect(dom.outerHTML).toBe('<div><div class="hello" data-name="hello">hello</div><div class="hello" data-name="hello">hello</div></div>')
    });

    it('should change and trigger onclick handler when state is connected', async () => {
      const hiddenDom = createHiddenDom();
      const elementName = van.state("p")
      van.add(hiddenDom, button({
        onclick: van.derive(() => {
          const name = elementName.val
          return name ? () => van.add(hiddenDom, van.tags[name]("Button clicked!")) : null
        }),
      }))
      hiddenDom.querySelector("button")!.click()
      expect(hiddenDom.innerHTML).toBe("<button></button><p>Button clicked!</p>")

      elementName.val = "div"
      await sleep(waitMsForDerivations)
      hiddenDom.querySelector("button")!.click()
      expect(hiddenDom.innerHTML).toBe("<button></button><p>Button clicked!</p><div>Button clicked!</div>")

      elementName.val = ""
      await sleep(waitMsForDerivations)
      hiddenDom.querySelector("button")!.click()
      expect(hiddenDom.innerHTML).toBe("<button></button><p>Button clicked!</p><div>Button clicked!</div>")
    });
    
    it("should not change onclick handler when state is disconnected", async () => {
      const dom = div()
      const elementName = van.state("p")
      van.add(dom, button({
        onclick: van.derive(() => {
          const name = elementName.val
          return name ? () => van.add(dom, van.tags[name]("Button clicked!")) : null
        }),
      }))
      dom.querySelector("button")!.click()
      expect(dom.innerHTML).toBe("<button></button><p>Button clicked!</p>")

      elementName.val = "div"
      await sleep(waitMsForDerivations)
      // The onclick handler won't change as `dom` is not connected to document,
      // as a result, the <p> element will be added.
      dom.querySelector("button")!.click()
      expect(dom.innerHTML).toBe("<button></button><p>Button clicked!</p><p>Button clicked!</p>")
    });

    it("should update data attributes when state is connected", async () => {
      const lineNum = van.state(1)
      const dom = div({
        "data-type": "line",
        "data-id": lineNum,
        "data-line": () => `line=${lineNum.val}`,
      },
        "This is a test line",
      )
      van.add(createHiddenDom(), dom)
      expect(dom.outerHTML).toBe('<div data-type="line" data-id="1" data-line="line=1">This is a test line</div>')

      lineNum.val = 3
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe('<div data-type="line" data-id="3" data-line="line=3">This is a test line</div>')
    });
  });
});
