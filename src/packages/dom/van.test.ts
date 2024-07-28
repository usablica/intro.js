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

    it('should not update data attributes when state is disconnected', async () => {
      const lineNum = van.state(1)
      const dom = div({
        "data-type": "line",
        "data-id": lineNum,
        "data-line": () => `line=${lineNum.val}`,
      },
        "This is a test line",
      )
      expect(dom.outerHTML).toBe('<div data-type="line" data-id="1" data-line="line=1">This is a test line</div>')

      lineNum.val = 3
      await sleep(waitMsForDerivations)
      // Attributes won't change as dom is not connected to document
      expect(dom.outerHTML).toBe('<div data-type="line" data-id="1" data-line="line=1">This is a test line</div>')
    });

    it('should update readonly props when state is connected', async () => {
      const form = van.state("form1")
      const dom = button({ form }, "Button")
      van.add(createHiddenDom(), dom)
      expect(dom.outerHTML).toBe('<button form="form1">Button</button>')

      form.val = "form2"
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe('<button form="form2">Button</button>')

      expect(input({ list: "datalist1" }).outerHTML).toBe('<input list="datalist1">')
    })

    it('should not update readonly props when state is disconnected', async () => {
      const form = van.state("form1")
      const dom = button({ form }, "Button")
      expect(dom.outerHTML).toBe('<button form="form1">Button</button>')

      form.val = "form2"
      await sleep(waitMsForDerivations)
      // Attributes won't change as dom is not connected to document
      expect(dom.outerHTML).toBe('<button form="form1">Button</button>')

      expect(input({ list: "datalist1" }).outerHTML).toBe('<input list="datalist1">')
    });

    it("should add custom event handler", () => {
      const dom = div(
        button({ oncustom: () => van.add(dom, p("Event triggered!")) })
      );
      dom.querySelector("button")!.dispatchEvent(new Event("custom"));
      expect(dom.innerHTML).toBe("<button></button><p>Event triggered!</p>");
    });

    it("should add custom event handler with state", async () => {
      const hiddenDom = createHiddenDom();
      const oncustom = van.state(() =>
        van.add(hiddenDom, p("Handler 1 triggered!"))
      );
      van.add(hiddenDom, button({ oncustom }));
      hiddenDom.querySelector("button")!.dispatchEvent(new Event("custom"));
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Handler 1 triggered!</p>"
      );

      oncustom.val = () => van.add(hiddenDom, p("Handler 2 triggered!"));
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("button")!.dispatchEvent(new Event("custom"));
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Handler 1 triggered!</p><p>Handler 2 triggered!</p>"
      );
    });

    it('should add state derived custom event handler', async () => {
      const handlerType = van.state(1);
      const hiddenDom = createHiddenDom();
      van.add(
        hiddenDom,
        button({
          oncustom: van.derive(() =>
            handlerType.val === 1
              ? () => van.add(hiddenDom, p("Handler 1 triggered!"))
              : () => van.add(hiddenDom, p("Handler 2 triggered!"))
          ),
        })
      );
      hiddenDom.querySelector("button")!.dispatchEvent(new Event("custom"));
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Handler 1 triggered!</p>"
      );

      handlerType.val = 2;
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("button")!.dispatchEvent(new Event("custom"));
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Handler 1 triggered!</p><p>Handler 2 triggered!</p>"
      );
    });

    it('should add child as connected state', async () => {
      const hiddenDom = createHiddenDom();
      const line2 = van.state(<string | null>"Line 2")
      const dom = div(
        pre("Line 1"),
        pre(line2),
        pre("Line 3")
      )
      van.add(hiddenDom, dom)
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")

      line2.val = "Line 2: Extra Stuff"
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2: Extra Stuff</pre><pre>Line 3</pre></div>")

      // null to remove text DOM
      line2.val = null
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>")

      // Resetting the state won't bring the text DOM back
      line2.val = "Line 2"
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>")
    });

    it('should not update child when state is disconnected', async () => {
      const line2 = van.state(<string | null>"Line 2")
      const dom = div(
        pre("Line 1"),
        pre(line2),
        pre("Line 3")
      )
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")

      line2.val = "Line 2: Extra Stuff"
      await sleep(waitMsForDerivations)
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")

      line2.val = null
      await sleep(waitMsForDerivations)
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")
    });

    it('should not delete dom when child is a state', async () => {
      const text = van.state("Text")
      const dom = p(text)
      van.add(createHiddenDom(), dom)
      expect(dom.outerHTML).toBe("<p>Text</p>")
      text.val = ""
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe("<p></p>")
      text.val = "Text"
      await sleep(waitMsForDerivations)
      expect(dom.outerHTML).toBe("<p>Text</p>")
    });

    it('should create svg elements', () => {
      const { circle, path, svg } = van.tags("http://www.w3.org/2000/svg");
      const dom = svg(
        { width: "16px", viewBox: "0 0 50 50" },
        circle({
          cx: "25",
          cy: "25",
          r: "20",
          stroke: "black",
          "stroke-width": "2",
          fill: "yellow",
        }),
        circle({
          cx: "16",
          cy: "20",
          r: "2",
          stroke: "black",
          "stroke-width": "2",
          fill: "black",
        }),
        circle({
          cx: "34",
          cy: "20",
          r: "2",
          stroke: "black",
          "stroke-width": "2",
          fill: "black",
        }),
        path({
          d: "M 15 30 Q 25 40, 35 30",
          stroke: "black",
          "stroke-width": "2",
          fill: "transparent",
        })
      );
      expect(dom.outerHTML).toBe(
        '<svg width="16px" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" stroke="black" stroke-width="2" fill="yellow"></circle><circle cx="16" cy="20" r="2" stroke="black" stroke-width="2" fill="black"></circle><circle cx="34" cy="20" r="2" stroke="black" stroke-width="2" fill="black"></circle><path d="M 15 30 Q 25 40, 35 30" stroke="black" stroke-width="2" fill="transparent"></path></svg>'
      );
    });

    it('should create math elements', () => {
      const { math, mi, mn, mo, mrow, msup } = van.tags("http://www.w3.org/1998/Math/MathML")
      const dom = math(msup(mi("e"), mrow(mi("i"), mi("π"))), mo("+"), mn("1"), mo("="), mn("0"))
      expect(dom.outerHTML).toBe('<math><msup><mi>e</mi><mrow><mi>i</mi><mi>π</mi></mrow></msup><mo>+</mo><mn>1</mn><mo>=</mo><mn>0</mn></math>')
    })
  });

  describe('add', () => {
    it("should add elements to the document", () => {
      const dom = ul();
      expect(van.add(dom, li("Item 1"), li("Item 2"))).toBe(dom);
      expect(dom.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
      expect(van.add(dom, li("Item 3"), li("Item 4"), li("Item 5"))).toBe(dom);
      expect(dom.outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li></ul>"
      );
      // No-op if no children specified
      expect(van.add(dom)).toBe(dom);
      expect(dom.outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li></ul>"
      );
    });

    it('should add nested elements', () => {
      const dom = ul()
      expect(van.add(dom, [li("Item 1"), li("Item 2")])).toBe(dom)
      expect(dom.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>")
    });

    it('should add deeply nested elements', () => {
      const dom = ul();
      van.add(dom, [li("Item 1"), li("Item 2")]);
      // Deeply nested
      expect(van.add(dom, [[li("Item 3"), [li("Item 4")]], li("Item 5")])).toBe(dom)
      expect(dom.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li></ul>")
    });

    it('should ignore empty array', () => {
      const dom = ul()
      van.add(dom, [li("Item 1"), li("Item 2")]);
      // No-op if no children specified
      expect(van.add(dom, [[[]]])).toBe(dom)
      expect(dom.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>")
    });

    it('should ignore null or undefined children', () => {
      const dom = ul()
      expect(
        van.add(dom, li("Item 1"), li("Item 2"), undefined, li("Item 3"), null)
      ).toBe(dom);
      expect(dom.outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"
      );
      expect(
        van.add(dom, [
          li("Item 4"),
          li("Item 5"),
          undefined,
          li("Item 6"),
          null,
        ])
      ).toBe(dom);
      expect(dom.outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li><li>Item 6</li></ul>"
      );
    });

    it('should ignore nested null or undefined children', () => {
      const dom = ul()
      van.add(dom, li("Item 1"), li("Item 2"), undefined, li("Item 3"), null);
      van.add(dom, [li("Item 4"), li("Item 5"), undefined, li("Item 6"), null]);
      expect(
        van.add(dom, [
          [undefined, li("Item 7"), null, [li("Item 8")]],
          null,
          li("Item 9"),
          undefined,
        ])
      ).toBe(dom);
      expect(dom.outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li><li>Item 6</li><li>Item 7</li><li>Item 8</li><li>Item 9</li></ul>"
      );
    });

    it('should add children as connected state', async () => {
      const hiddenDom = createHiddenDom();
      const line2 = van.state(<string | null>"Line 2")
      expect(van.add(hiddenDom,
        pre("Line 1"),
        pre(line2),
        pre("Line 3")
      )).toBe(hiddenDom)
      expect(hiddenDom.outerHTML).toBe('<div class="hidden"><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>')

      line2.val = "Line 2: Extra Stuff"
      await sleep(waitMsForDerivations)
      expect(hiddenDom.outerHTML).toBe('<div class="hidden"><pre>Line 1</pre><pre>Line 2: Extra Stuff</pre><pre>Line 3</pre></div>')

      // null to remove text DOM
      line2.val = null
      await sleep(waitMsForDerivations)
      expect(hiddenDom.outerHTML).toBe('<div class="hidden"><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>')

      // Resetting the state won't bring the text DOM back
      line2.val = "Line 2"
      await sleep(waitMsForDerivations)
      expect(hiddenDom.outerHTML).toBe('<div class="hidden"><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>')
    });

    it('should not change children when state is disconnected', async () => {
      const line2 = van.state(<string | null>"Line 2")
      const dom = div()
      expect(van.add(dom,
        pre("Line 1"),
        pre(line2),
        pre("Line 3")
      )).toBe(dom)
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")

      line2.val = "Line 2: Extra Stuff"
      await sleep(waitMsForDerivations)
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")

      line2.val = null
      await sleep(waitMsForDerivations)
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe("<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>")
    });
  });
});
