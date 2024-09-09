import van, { State } from ".";

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
      const dom = div();
      van.add(createHiddenDom(), dom);
      // TODO: fix the any type here. It should ideally be an EventListener | null
      const handler = van.state(<any>(
        (() => van.add(dom, p("Button clicked!")))
      ));
      van.add(dom, button({ onclick: handler }));
      dom.querySelector("button")!.click();
      expect(dom.outerHTML).toBe(
        "<div><button></button><p>Button clicked!</p></div>"
      );

      handler.val = () => van.add(dom, div("Button clicked!"));
      await sleep(waitMsForDerivations);
      dom.querySelector("button")!.click();
      expect(dom.outerHTML).toBe(
        "<div><button></button><p>Button clicked!</p><div>Button clicked!</div></div>"
      );

      handler.val = null;
      await sleep(waitMsForDerivations);
      dom.querySelector("button")!.click();
      expect(dom.outerHTML).toBe(
        "<div><button></button><p>Button clicked!</p><div>Button clicked!</div></div>"
      );
    });

    it("should not change onclick handler when state is disconnected", async () => {
      const dom = div();
      const handler = van.state(() => van.add(dom, p("Button clicked!")));
      van.add(dom, button({ onclick: handler }));
      dom.querySelector("button")!.click();
      expect(dom.outerHTML).toBe(
        "<div><button></button><p>Button clicked!</p></div>"
      );

      handler.val = () => van.add(dom, div("Button clicked!"));
      await sleep(waitMsForDerivations);
      dom.querySelector("button")!.click();
      // The onclick handler won't change as dom is not connected to document, as a result, the <p> element will be added
      expect(dom.outerHTML).toBe(
        "<div><button></button><p>Button clicked!</p><p>Button clicked!</p></div>"
      );
    });

    it("should update props from a derived state", async () => {
      const host = van.state("example.com");
      const path = van.state("/hello");
      const dom = a(
        { href: () => `https://${host.val}${path.val}` },
        "Test Link"
      );
      van.add(createHiddenDom(), dom);
      expect(dom.href).toBe("https://example.com/hello");
      host.val = "vanjs.org";
      path.val = "/start";
      await sleep(waitMsForDerivations);
      expect(dom.href).toBe("https://vanjs.org/start");
    });

    it("should not update props from a disconnected derived state", async () => {
      const host = van.state("example.com");
      const path = van.state("/hello");
      const dom = a(
        { href: () => `https://${host.val}${path.val}` },
        "Test Link"
      );
      expect(dom.href).toBe("https://example.com/hello");
      host.val = "vanjs.org";
      path.val = "/start";
      await sleep(waitMsForDerivations);
      // href won't change as dom is not connected to document
      expect(dom.href).toBe("https://example.com/hello");
    });

    it("should update props when partial state", async () => {
      const host = van.state("example.com");
      const path = "/hello";
      const dom = a({ href: () => `https://${host.val}${path}` }, "Test Link");
      van.add(createHiddenDom(), dom);
      expect(dom.href).toBe("https://example.com/hello");
      host.val = "vanjs.org";
      await sleep(waitMsForDerivations);
      expect(dom.href).toBe("https://vanjs.org/hello");
    });

    it("should not update props when partial state is disconnected", async () => {
      const host = van.state("example.com");
      const path = "/hello";
      const dom = a({ href: () => `https://${host.val}${path}` }, "Test Link");
      expect(dom.href).toBe("https://example.com/hello");
      host.val = "vanjs.org";
      await sleep(waitMsForDerivations);
      // href won't change as dom is not connected to document
      expect(dom.href).toBe("https://example.com/hello");
    });

    it("should render correctly when connected state throws an error", async () => {
      const text = van.state("hello");
      const dom = div(
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error();
              return text.val;
            },
            "data-name": text,
          },
          text
        ),
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error();
              return text.val;
            },
            "data-name": text,
          },
          text
        )
      );
      van.add(createHiddenDom(), dom);
      expect(dom.outerHTML).toBe(
        '<div><div class="hello" data-name="hello">hello</div><div class="hello" data-name="hello">hello</div></div>'
      );

      text.val = "fail";
      await sleep(waitMsForDerivations);
      // The binding function for `class` property throws an error.
      // We want to validate the `class` property won't be updated because of the error,
      // but other properties and child nodes are updated as usual.
      expect(dom.outerHTML).toBe(
        '<div><div class="hello" data-name="fail">fail</div><div class="hello" data-name="fail">fail</div></div>'
      );
    });

    it("should render correct when disconnected state throws an error", async () => {
      const text = van.state("hello");
      const dom = div(
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error();
              return text.val;
            },
            "data-name": text,
          },
          text
        ),
        div(
          {
            class: () => {
              if (text.val === "fail") throw new Error();
              return text.val;
            },
            "data-name": text,
          },
          text
        )
      );
      expect(dom.outerHTML).toBe(
        '<div><div class="hello" data-name="hello">hello</div><div class="hello" data-name="hello">hello</div></div>'
      );

      text.val = "fail";
      await sleep(waitMsForDerivations);
      // `dom` won't change as it's not connected to document
      expect(dom.outerHTML).toBe(
        '<div><div class="hello" data-name="hello">hello</div><div class="hello" data-name="hello">hello</div></div>'
      );
    });

    it("should change and trigger onclick handler when state is connected", async () => {
      const hiddenDom = createHiddenDom();
      const elementName = van.state("p");
      van.add(
        hiddenDom,
        button({
          onclick: van.derive(() => {
            const name = elementName.val;
            return name
              ? () => van.add(hiddenDom, van.tags[name]("Button clicked!"))
              : null;
          }),
        })
      );
      hiddenDom.querySelector("button")!.click();
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Button clicked!</p>"
      );

      elementName.val = "div";
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("button")!.click();
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Button clicked!</p><div>Button clicked!</div>"
      );

      elementName.val = "";
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("button")!.click();
      expect(hiddenDom.innerHTML).toBe(
        "<button></button><p>Button clicked!</p><div>Button clicked!</div>"
      );
    });

    it("should not change onclick handler when state is disconnected", async () => {
      const dom = div();
      const elementName = van.state("p");
      van.add(
        dom,
        button({
          onclick: van.derive(() => {
            const name = elementName.val;
            return name
              ? () => van.add(dom, van.tags[name]("Button clicked!"))
              : null;
          }),
        })
      );
      dom.querySelector("button")!.click();
      expect(dom.innerHTML).toBe("<button></button><p>Button clicked!</p>");

      elementName.val = "div";
      await sleep(waitMsForDerivations);
      // The onclick handler won't change as `dom` is not connected to document,
      // as a result, the <p> element will be added.
      dom.querySelector("button")!.click();
      expect(dom.innerHTML).toBe(
        "<button></button><p>Button clicked!</p><p>Button clicked!</p>"
      );
    });

    it("should update data attributes when state is connected", async () => {
      const lineNum = van.state(1);
      const dom = div(
        {
          "data-type": "line",
          "data-id": lineNum,
          "data-line": () => `line=${lineNum.val}`,
        },
        "This is a test line"
      );
      van.add(createHiddenDom(), dom);
      expect(dom.outerHTML).toBe(
        '<div data-type="line" data-id="1" data-line="line=1">This is a test line</div>'
      );

      lineNum.val = 3;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        '<div data-type="line" data-id="3" data-line="line=3">This is a test line</div>'
      );
    });

    it("should not update data attributes when state is disconnected", async () => {
      const lineNum = van.state(1);
      const dom = div(
        {
          "data-type": "line",
          "data-id": lineNum,
          "data-line": () => `line=${lineNum.val}`,
        },
        "This is a test line"
      );
      expect(dom.outerHTML).toBe(
        '<div data-type="line" data-id="1" data-line="line=1">This is a test line</div>'
      );

      lineNum.val = 3;
      await sleep(waitMsForDerivations);
      // Attributes won't change as dom is not connected to document
      expect(dom.outerHTML).toBe(
        '<div data-type="line" data-id="1" data-line="line=1">This is a test line</div>'
      );
    });

    it("should update readonly props when state is connected", async () => {
      const form = van.state("form1");
      const dom = button({ form }, "Button");
      van.add(createHiddenDom(), dom);
      expect(dom.outerHTML).toBe('<button form="form1">Button</button>');

      form.val = "form2";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe('<button form="form2">Button</button>');

      expect(input({ list: "datalist1" }).outerHTML).toBe(
        '<input list="datalist1">'
      );
    });

    it("should not update readonly props when state is disconnected", async () => {
      const form = van.state("form1");
      const dom = button({ form }, "Button");
      expect(dom.outerHTML).toBe('<button form="form1">Button</button>');

      form.val = "form2";
      await sleep(waitMsForDerivations);
      // Attributes won't change as dom is not connected to document
      expect(dom.outerHTML).toBe('<button form="form1">Button</button>');

      expect(input({ list: "datalist1" }).outerHTML).toBe(
        '<input list="datalist1">'
      );
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

    it("should add state derived custom event handler", async () => {
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

    it("should add child as connected state", async () => {
      const hiddenDom = createHiddenDom();
      const line2 = van.state(<string | null>"Line 2");
      const dom = div(pre("Line 1"), pre(line2), pre("Line 3"));
      van.add(hiddenDom, dom);
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );

      line2.val = "Line 2: Extra Stuff";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2: Extra Stuff</pre><pre>Line 3</pre></div>"
      );

      // null to remove text DOM
      line2.val = null;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>"
      );

      // Resetting the state won't bring the text DOM back
      line2.val = "Line 2";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>"
      );
    });

    it("should not update child when state is disconnected", async () => {
      const line2 = van.state(<string | null>"Line 2");
      const dom = div(pre("Line 1"), pre(line2), pre("Line 3"));
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );

      line2.val = "Line 2: Extra Stuff";
      await sleep(waitMsForDerivations);
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );

      line2.val = null;
      await sleep(waitMsForDerivations);
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );
    });

    it("should not delete dom when child is a state", async () => {
      const text = van.state("Text");
      const dom = p(text);
      van.add(createHiddenDom(), dom);
      expect(dom.outerHTML).toBe("<p>Text</p>");
      text.val = "";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<p></p>");
      text.val = "Text";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<p>Text</p>");
    });

    it("should create svg elements", () => {
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

    it("should create math elements", () => {
      const { math, mi, mn, mo, mrow, msup } = van.tags(
        "http://www.w3.org/1998/Math/MathML"
      );
      const dom = math(
        msup(mi("e"), mrow(mi("i"), mi("π"))),
        mo("+"),
        mn("1"),
        mo("="),
        mn("0")
      );
      expect(dom.outerHTML).toBe(
        "<math><msup><mi>e</mi><mrow><mi>i</mi><mi>π</mi></mrow></msup><mo>+</mo><mn>1</mn><mo>=</mo><mn>0</mn></math>"
      );
    });
  });

  describe("add", () => {
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

    it("should add nested elements", () => {
      const dom = ul();
      expect(van.add(dom, [li("Item 1"), li("Item 2")])).toBe(dom);
      expect(dom.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
    });

    it("should add deeply nested elements", () => {
      const dom = ul();
      van.add(dom, [li("Item 1"), li("Item 2")]);
      // Deeply nested
      expect(van.add(dom, [[li("Item 3"), [li("Item 4")]], li("Item 5")])).toBe(
        dom
      );
      expect(dom.outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li><li>Item 5</li></ul>"
      );
    });

    it("should ignore empty array", () => {
      const dom = ul();
      van.add(dom, [li("Item 1"), li("Item 2")]);
      // No-op if no children specified
      expect(van.add(dom, [[[]]])).toBe(dom);
      expect(dom.outerHTML).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
    });

    it("should ignore null or undefined children", () => {
      const dom = ul();
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

    it("should ignore nested null or undefined children", () => {
      const dom = ul();
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

    it("should add children as connected state", async () => {
      const hiddenDom = createHiddenDom();
      const line2 = van.state(<string | null>"Line 2");
      expect(van.add(hiddenDom, pre("Line 1"), pre(line2), pre("Line 3"))).toBe(
        hiddenDom
      );
      expect(hiddenDom.outerHTML).toBe(
        '<div class="hidden"><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>'
      );

      line2.val = "Line 2: Extra Stuff";
      await sleep(waitMsForDerivations);
      expect(hiddenDom.outerHTML).toBe(
        '<div class="hidden"><pre>Line 1</pre><pre>Line 2: Extra Stuff</pre><pre>Line 3</pre></div>'
      );

      // null to remove text DOM
      line2.val = null;
      await sleep(waitMsForDerivations);
      expect(hiddenDom.outerHTML).toBe(
        '<div class="hidden"><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>'
      );

      // Resetting the state won't bring the text DOM back
      line2.val = "Line 2";
      await sleep(waitMsForDerivations);
      expect(hiddenDom.outerHTML).toBe(
        '<div class="hidden"><pre>Line 1</pre><pre></pre><pre>Line 3</pre></div>'
      );
    });

    it("should not change children when state is disconnected", async () => {
      const line2 = van.state(<string | null>"Line 2");
      const dom = div();
      expect(van.add(dom, pre("Line 1"), pre(line2), pre("Line 3"))).toBe(dom);
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );

      line2.val = "Line 2: Extra Stuff";
      await sleep(waitMsForDerivations);
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );

      line2.val = null;
      await sleep(waitMsForDerivations);
      // Content won't change as dom is not connected to document
      expect(dom.outerHTML).toBe(
        "<div><pre>Line 1</pre><pre>Line 2</pre><pre>Line 3</pre></div>"
      );
    });
  });

  describe("state", () => {
    it("should return the correct oldVal and val", async () => {
      const hiddenDom = createHiddenDom();
      const s = van.state("State Version 1");
      expect(s.val).toBe("State Version 1");
      expect(s.oldVal).toBe("State Version 1");

      // If the state object doesn't have any bindings, we directly update the `oldVal`
      s.val = "State Version 2";
      expect(s.val).toBe("State Version 2");
      expect(s.oldVal).toBe("State Version 2");

      van.add(hiddenDom, s);
      // If the state object has some bindings, `oldVal` refers to its old value until DOM update completes
      s.val = "State Version 3";
      expect(s.val).toBe("State Version 3");
      expect(s.oldVal).toBe("State Version 2");
      await sleep(waitMsForDerivations);
      expect(s.val).toBe("State Version 3");
      expect(s.oldVal).toBe("State Version 3");
    });

    it("should not trigger derived states when rawVal is set", async () => {
      const hiddenDom = createHiddenDom();
      const history: number[] = [];
      const a = van.state(3),
        b = van.state(5);
      const s = van.derive(() => a.rawVal! + b.val!);
      van.derive(() => history.push(a.rawVal! + b.val!));

      van.add(
        hiddenDom,
        input({ type: "text", value: () => a.rawVal! + b.val! }),
        p(() => a.rawVal! + b.val!)
      );

      await sleep(waitMsForDerivations);
      expect(s.val).toBe(8);
      expect(history).toStrictEqual([8]);
      expect(hiddenDom.querySelector("input")!.value).toBe("8");
      expect(hiddenDom.querySelector("p")!.innerHTML).toBe("8");

      // Changing the `val` of `a` won't trigger the derived states, side effects, state-derived
      // properties and state-derived child nodes, as the value of `a` is accessed via `a.rawVal`.
      ++a.val!;
      await sleep(waitMsForDerivations);
      expect(s.val).toBe(8);
      expect(history).toStrictEqual([8]);
      expect(hiddenDom.querySelector("input")!.value).toBe("8");
      expect(hiddenDom.querySelector("p")!.innerHTML).toBe("8");

      // Changing the `val` of `b` will trigger the derived states, side effects, state-derived
      // properties and state-derived child nodes, as the value of `b` is accessed via `b.rawVal`.
      ++b.val!;
      await sleep(waitMsForDerivations);
      expect(s.val).toBe(10);
      expect(history).toStrictEqual([8, 10]);
      expect(hiddenDom.querySelector("input")!.value).toBe("10");
      expect(hiddenDom.querySelector("p")!.innerHTML).toBe("10");
    });
  });

  describe("derive", () => {
    it("should trigger callback when val changes", async () => {
      const history: string[] = [];
      const s = van.state("This");
      van.derive(() => history.push(s.val!));
      expect(history).toStrictEqual(["This"]);

      s.val = "is";
      await sleep(waitMsForDerivations);
      expect(history).toStrictEqual(["This", "is"]);

      s.val = "a";
      await sleep(waitMsForDerivations);
      expect(history).toStrictEqual(["This", "is", "a"]);

      s.val = "test";
      await sleep(waitMsForDerivations);
      expect(history).toStrictEqual(["This", "is", "a", "test"]);

      s.val = "test";
      await sleep(waitMsForDerivations);
      expect(history).toStrictEqual(["This", "is", "a", "test"]);

      s.val = "test2";
      // "Test2" won't be added into `history` as `s` will be set to "test3" immediately
      s.val = "test3";
      await sleep(waitMsForDerivations);
      expect(history).toStrictEqual(["This", "is", "a", "test", "test3"]);
    });

    it("should trigger derived state callback when val changes", async () => {
      const numItems = van.state(0);
      const items = van.derive(() =>
        [...Array(numItems.val).keys()].map((i) => `Item ${i + 1}`)
      );
      const selectedIndex = van.derive(() => (items.val, 0));
      const selectedItem = van.derive(() => items.val![selectedIndex.val!]);

      numItems.val = 3;
      await sleep(waitMsForDerivations);
      expect(numItems.val).toBe(3);
      expect(items.val!.join(",")).toBe("Item 1,Item 2,Item 3");
      expect(selectedIndex.val).toBe(0);
      expect(selectedItem.val).toBe("Item 1");

      selectedIndex.val = 2;
      await sleep(waitMsForDerivations);
      expect(selectedIndex.val).toBe(2);
      expect(selectedItem.val).toBe("Item 3");

      numItems.val = 5;
      await sleep(waitMsForDerivations);
      expect(numItems.val).toBe(5);
      expect(items.val!.join(",")).toBe("Item 1,Item 2,Item 3,Item 4,Item 5");
      expect(selectedIndex.val).toBe(0);
      expect(selectedItem.val).toBe("Item 1");

      selectedIndex.val = 3;
      await sleep(waitMsForDerivations);
      expect(selectedIndex.val).toBe(3);
      expect(selectedItem.val).toBe("Item 4");
    });

    it("should trigger compute conditional derived state", async () => {
      const cond = van.state(true);
      const a = van.state(1),
        b = van.state(2),
        c = van.state(3),
        d = van.state(4);
      let numEffectTriggered = 0;
      const sum = van.derive(
        () => (
          ++numEffectTriggered, cond.val ? a.val! + b.val! : c.val! + d.val!
        )
      );

      expect(sum.val).toBe(3);
      expect(numEffectTriggered).toBe(1);

      a.val = 11;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(13);
      expect(numEffectTriggered).toBe(2);

      b.val = 12;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(23);
      expect(numEffectTriggered).toBe(3);

      // Changing c or d won't triggered the effect as they're not its current dependencies
      c.val = 13;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(23);
      expect(numEffectTriggered).toBe(3);

      d.val = 14;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(23);
      expect(numEffectTriggered).toBe(3);

      cond.val = false;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(27);
      expect(numEffectTriggered).toBe(4);

      c.val = 23;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(37);
      expect(numEffectTriggered).toBe(5);

      d.val = 24;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(47);
      expect(numEffectTriggered).toBe(6);

      // Changing a or b won't triggered the effect as they're not its current dependencies
      a.val = 21;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(47);
      expect(numEffectTriggered).toBe(6);

      b.val = 22;
      await sleep(waitMsForDerivations);
      expect(sum.val).toBe(47);
      expect(numEffectTriggered).toBe(6);
    });

    it("should not change state when derive throws error", async () => {
      const s0 = van.state(1);
      const s1 = van.derive(() => s0.val! * 2);
      const s2 = van.derive(() => {
        if (s0.val! > 1) throw new Error();
        return s0.val;
      });
      const s3 = van.derive(() => s0.val! * s0.val!);

      expect(s1.val).toBe(2);
      expect(s2.val).toBe(1);
      expect(s3.val).toBe(1);

      s0.val = 3;
      await sleep(waitMsForDerivations);
      // The derivation function for `s2` throws an error.
      // We want to validate the `val` of `s2` remains the same because of the error,
      // but other derived states are updated as usual.
      expect(s1.val).toBe(6);
      expect(s2.val).toBe(1);
      expect(s3.val).toBe(9);
    });

    it("should update dom when derived state changes", async () => {
      const hiddenDom = createHiddenDom();
      const CheckboxCounter = () => {
        const checked = van.state(false),
          numChecked = van.state(0);
        van.derive(() => {
          if (checked.val) ++numChecked.val!;
        });

        return div(
          input({
            type: "checkbox",
            checked,
            onclick: (e) =>
              (checked.val = ((e as Event).target as HTMLInputElement).checked),
          }),
          " Checked ",
          numChecked,
          " times. ",
          button({ onclick: () => (numChecked.val = 0) }, "Reset")
        );
      };

      van.add(hiddenDom, CheckboxCounter());

      expect(hiddenDom.innerHTML).toBe(
        '<div><input type="checkbox"> Checked 0 times. <button>Reset</button></div>'
      );

      hiddenDom.querySelector("input")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<div><input type="checkbox"> Checked 1 times. <button>Reset</button></div>'
      );

      hiddenDom.querySelector("input")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<div><input type="checkbox"> Checked 1 times. <button>Reset</button></div>'
      );

      hiddenDom.querySelector("input")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<div><input type="checkbox"> Checked 2 times. <button>Reset</button></div>'
      );

      hiddenDom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<div><input type="checkbox"> Checked 0 times. <button>Reset</button></div>'
      );
    });

    it("should batch derived state updates", async () => {
      const a = van.state(3),
        b = van.state(5);
      let numDerivations = 0;
      const s = van.derive(() => {
        ++numDerivations;
        return a.val! + b.val!;
      });

      expect(s.val).toBe(8);
      expect(numDerivations).toBe(1);

      // Both `a` and `b` will change. `s` will only be re-derived once
      ++a.val!, ++b.val!;
      await sleep(waitMsForDerivations);
      expect(s.val).toBe(10);
      expect(numDerivations).toBe(2);

      // `a` will change, and then change back. No derivation will happen
      ++a.val!, --a.val!;
      await sleep(waitMsForDerivations);
      expect(s.val).toBe(10);
      expect(numDerivations).toBe(2);
    });

    it("should batch multilayer derived state updates", async () => {
      const hiddenDom = createHiddenDom();
      const a = van.state(1),
        b = van.derive(() => a.val! * a.val!);
      const c = van.derive(() => b.val! * b.val!),
        d = van.derive(() => c.val! * c.val!);

      let numSDerived = 0,
        numSSquaredDerived = 0;
      const s = van.derive(() => {
        ++numSDerived;
        return a.val! + b.val! + c.val! + d.val!;
      });

      van.add(
        hiddenDom,
        "a = ",
        a,
        " b = ",
        b,
        " c = ",
        c,
        " d = ",
        d,
        " s = ",
        s,
        " s^2 = ",
        () => {
          ++numSSquaredDerived;
          return s.val! * s.val!;
        }
      );

      expect(hiddenDom.innerHTML).toBe(
        "a = 1 b = 1 c = 1 d = 1 s = 4 s^2 = 16"
      );
      expect(numSDerived).toBe(1);
      expect(numSSquaredDerived).toBe(1);

      ++a.val!;
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        "a = 2 b = 4 c = 16 d = 256 s = 278 s^2 = 77284"
      );
      // `s` is derived 4 times, triggered by `a`, `b`, `c`, `d`, respectively.
      expect(numSDerived).toBe(5);
      // `s^2` (the `s` derived Text node), is only derived once per one DOM update cycle.
      expect(numSSquaredDerived).toBe(2);
    });

    it("should stop updating when there is a cycle in the derivation", async () => {
      const a = van.state(1);
      const b = van.derive(() => a.val! + 1);
      van.derive(() => (a.val = b.val! + 1));

      // `a` and `b` are circular dependency. But derivations will stop after limited number of
      // iterations.
      ++a.val!;
      await sleep(waitMsForDerivations);
      expect(a.val).toBe(104);
      expect(b.val).toBe(103);
    });

    it("should dynamically update dom based on derived state", async () => {
      const hiddenDom = createHiddenDom();
      const verticalPlacement = van.state(false);
      const button1Text = van.state("Button 1"),
        button2Text = van.state("Button 2"),
        button3Text = van.state("Button 3");

      const domFunc = () =>
        verticalPlacement.val
          ? div(
              div(button(button1Text)),
              div(button(button2Text)),
              div(button(button3Text))
            )
          : div(button(button1Text), button(button2Text), button(button3Text));
      expect(van.add(hiddenDom, domFunc)).toBe(hiddenDom);

      const dom = <Element>hiddenDom.firstChild;
      expect(dom.outerHTML).toBe(
        "<div><button>Button 1</button><button>Button 2</button><button>Button 3</button></div>"
      );
      button2Text.val = "Button 2: Extra";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><button>Button 1</button><button>Button 2: Extra</button><button>Button 3</button></div>"
      );

      verticalPlacement.val = true;
      await sleep(waitMsForDerivations);

      // dom is disconnected from the document thus it won't be updated
      expect(dom.outerHTML).toBe(
        "<div><button>Button 1</button><button>Button 2: Extra</button><button>Button 3</button></div>"
      );
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><div><button>Button 1</button></div><div><button>Button 2: Extra</button></div><div><button>Button 3</button></div></div>"
      );
      button2Text.val = "Button 2: Extra Extra";
      await sleep(waitMsForDerivations);
      // Since dom is disconnected from document, its inner button won't be reactive to state changes
      expect(dom.outerHTML).toBe(
        "<div><button>Button 1</button><button>Button 2: Extra</button><button>Button 3</button></div>"
      );
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><div><button>Button 1</button></div><div><button>Button 2: Extra Extra</button></div><div><button>Button 3</button></div></div>"
      );
    });

    it("should update dom based on conditional derived state", async () => {
      const hiddenDom = createHiddenDom();
      const cond = van.state(true);
      const button1 = van.state("Button 1"),
        button2 = van.state("Button 2");
      const button3 = van.state("Button 3"),
        button4 = van.state("Button 4");
      let numFuncCalled = 0;
      const domFunc = () => (
        ++numFuncCalled,
        cond.val
          ? div(button(button1.val), button(button2.val))
          : div(button(button3.val), button(button4.val))
      );
      expect(van.add(hiddenDom, domFunc)).toBe(hiddenDom);

      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 1</button><button>Button 2</button></div>"
      );
      expect(numFuncCalled).toBe(1);

      button1.val = "Button 1-1";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 1-1</button><button>Button 2</button></div>"
      );
      expect(numFuncCalled).toBe(2);

      button2.val = "Button 2-1";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 1-1</button><button>Button 2-1</button></div>"
      );
      expect(numFuncCalled).toBe(3);

      // Changing button3 or button4 won't triggered the effect as they're not its current dependencies
      button3.val = "Button 3-1";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 1-1</button><button>Button 2-1</button></div>"
      );
      expect(numFuncCalled).toBe(3);

      button4.val = "Button 4-1";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 1-1</button><button>Button 2-1</button></div>"
      );
      expect(numFuncCalled).toBe(3);

      cond.val = false;
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 3-1</button><button>Button 4-1</button></div>"
      );
      expect(numFuncCalled).toBe(4);

      button3.val = "Button 3-2";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 3-2</button><button>Button 4-1</button></div>"
      );
      expect(numFuncCalled).toBe(5);

      button4.val = "Button 4-2";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 3-2</button><button>Button 4-2</button></div>"
      );
      expect(numFuncCalled).toBe(6);

      // Changing button1 or button2 won't triggered the effect as they're not its current dependencies
      button1.val = "Button 1-2";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 3-2</button><button>Button 4-2</button></div>"
      );
      expect(numFuncCalled).toBe(6);

      button1.val = "Button 2-2";
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        "<div><button>Button 3-2</button><button>Button 4-2</button></div>"
      );
      expect(numFuncCalled).toBe(6);
    });

    it("should rearrange dom when state changes", async () => {
      const hiddenDom = createHiddenDom();
      const numItems = van.state(0);
      const items = van.derive(() =>
        [...Array(numItems.val).keys()].map((i) => `Item ${i + 1}`)
      );
      const selectedIndex = van.derive(() => (items.val, 0));

      const domFunc = (dom?: Element) => {
        // If items aren't changed, we don't need to regenerate the entire dom
        if (dom && items.val === items.oldVal) {
          const itemDoms = dom.childNodes;
          (<Element>itemDoms[selectedIndex.oldVal!]).classList.remove(
            "selected"
          );
          (<Element>itemDoms[selectedIndex.val!]).classList.add("selected");
          return dom;
        }

        return ul(
          items.val!.map((item: string, i: number) =>
            li({ class: i === selectedIndex.val ? "selected" : "" }, item)
          )
        );
      };
      van.add(hiddenDom, domFunc);

      numItems.val = 3;
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        '<ul><li class="selected">Item 1</li><li class="">Item 2</li><li class="">Item 3</li></ul>'
      );
      const rootDom1stIteration = <Element>hiddenDom.firstChild;

      selectedIndex.val = 1;
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        '<ul><li class="">Item 1</li><li class="selected">Item 2</li><li class="">Item 3</li></ul>'
      );
      // Items aren't changed, thus we don't need to regenerate the dom
      expect(hiddenDom.firstChild!).toBe(rootDom1stIteration);

      numItems.val = 5;
      await sleep(waitMsForDerivations);
      // Items are changed, thus the dom for the list is regenerated
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        '<ul><li class="selected">Item 1</li><li class="">Item 2</li><li class="">Item 3</li><li class="">Item 4</li><li class="">Item 5</li></ul>'
      );
      expect(hiddenDom.firstChild !== rootDom1stIteration);
      // rootDom1stIteration is disconnected from the document and remain unchanged
      expect(rootDom1stIteration.outerHTML).toBe(
        '<ul><li class="">Item 1</li><li class="selected">Item 2</li><li class="">Item 3</li></ul>'
      );
      const rootDom2ndIteration = hiddenDom.firstChild!;

      selectedIndex.val = 2;
      await sleep(waitMsForDerivations);
      expect((<Element>hiddenDom.firstChild).outerHTML).toBe(
        '<ul><li class="">Item 1</li><li class="">Item 2</li><li class="selected">Item 3</li><li class="">Item 4</li><li class="">Item 5</li></ul>'
      );
      // Items aren't changed, thus we don't need to regenerate the dom
      expect(hiddenDom.firstChild!).toBe(rootDom2ndIteration);
      // rootDom1stIteration won't be updated as it has already been disconnected from the document
      expect(rootDom1stIteration.outerHTML).toBe(
        '<ul><li class="">Item 1</li><li class="selected">Item 2</li><li class="">Item 3</li></ul>'
      );
    });

    it("should remove dom when it returns null", async () => {
      const hiddenDom = createHiddenDom();
      const line1 = van.state("Line 1"),
        line2 = van.state("Line 2"),
        line3 = van.state(<string | null>"Line 3"),
        line4 = van.state(""),
        line5 = van.state(null);

      const dom = div(
        () => (line1.val === "" ? null : p(line1.val)),
        () => (line2.val === "" ? null : p(line2.val)),
        p(line3),
        // line4 won't appear in the DOM tree as its initial value is null
        () => (line4.val === "" ? null : p(line4.val)),
        // line5 won't appear in the DOM tree as its initial value is null
        p(line5)
      );
      van.add(hiddenDom, dom);

      expect(dom.outerHTML).toBe(
        "<div><p>Line 1</p><p>Line 2</p><p>Line 3</p><p></p></div>"
      );
      // Delete Line 2
      line2.val = "";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><p>Line 1</p><p>Line 3</p><p></p></div>"
      );

      // Deleted dom won't be brought back, even the underlying state is changed back
      line2.val = "Line 2";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><p>Line 1</p><p>Line 3</p><p></p></div>"
      );

      // Delete Line 3
      line3.val = null;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div><p>Line 1</p><p></p><p></p></div>");

      // Deleted dom won't be brought back, even the underlying state is changed back
      line3.val = "Line 3";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div><p>Line 1</p><p></p><p></p></div>");
    });

    it("should remove dom when it returns undefined", async () => {
      const hiddenDom = createHiddenDom();
      const line1 = van.state("Line 1"),
        line2 = van.state("Line 2"),
        line3 = van.state(<string | undefined>"Line 3"),
        line4 = van.state(""),
        line5 = van.state(undefined);

      const dom = div(
        () => (line1.val === "" ? null : p(line1.val)),
        () => (line2.val === "" ? null : p(line2.val)),
        p(line3),
        // line4 won't appear in the DOM tree as its initial value is null
        () => (line4.val === "" ? null : p(line4.val)),
        // line5 won't appear in the DOM tree as its initial value is null
        p(line5)
      );
      van.add(hiddenDom, dom);

      expect(dom.outerHTML).toBe(
        "<div><p>Line 1</p><p>Line 2</p><p>Line 3</p><p></p></div>"
      );
      // Delete Line 2
      line2.val = "";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><p>Line 1</p><p>Line 3</p><p></p></div>"
      );

      // Deleted dom won't be brought back, even the underlying state is changed back
      line2.val = "Line 2";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<div><p>Line 1</p><p>Line 3</p><p></p></div>"
      );

      // Delete Line 3
      line3.val = undefined;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div><p>Line 1</p><p></p><p></p></div>");

      // Deleted dom won't be brought back, even the underlying state is changed back
      line3.val = "Line 3";
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div><p>Line 1</p><p></p><p></p></div>");
    });

    it("should not remove dom when it returns 0", async () => {
      const hiddenDom = createHiddenDom();
      const state1 = van.state(0),
        state2 = van.state(1);
      const dom = div(
        state1,
        () => 1 - state1.val!,
        state2,
        () => 1 - state2.val!
      );
      van.add(hiddenDom, dom);

      expect(dom.outerHTML).toBe("<div>0110</div>");

      (state1.val = 1), (state2.val = 0);
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div>1001</div>");
    });

    it("should update dom when primitive state changes", async () => {
      const hiddenDom = createHiddenDom();
      const a = van.state(1),
        b = van.state(2),
        deleted = van.state(false);
      const dom = div(() => (deleted.val ? null : a.val! + b.val!));
      expect(dom.outerHTML).toBe("<div>3</div>");
      van.add(hiddenDom, dom);

      a.val = 6;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div>8</div>");

      b.val = 5;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div>11</div>");

      deleted.val = true;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div></div>");

      // Deleted dom won't be brought back, even the underlying state is changed back
      deleted.val = false;
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe("<div></div>");
    });

    it("should not update when state is not connected", async () => {
      const hiddenDom = createHiddenDom();
      const part1 = "👋Hello ",
        part2 = van.state("🗺️World");

      expect(
        van.add(
          hiddenDom,
          () => `${part1}${part2.val}, from: ${part1}${part2.oldVal}`
        )
      ).toBe(hiddenDom);

      const dom = <Element>hiddenDom.firstChild;
      expect(dom.textContent!).toBe("👋Hello 🗺️World, from: 👋Hello 🗺️World");
      expect(hiddenDom.innerHTML).toBe(
        "👋Hello 🗺️World, from: 👋Hello 🗺️World"
      );

      part2.val = "🍦VanJS";
      await sleep(waitMsForDerivations);

      // dom is disconnected from the document thus it won't be updated
      expect(dom.textContent!).toBe("👋Hello 🗺️World, from: 👋Hello 🗺️World");
      expect(hiddenDom.innerHTML).toBe(
        "👋Hello 🍦VanJS, from: 👋Hello 🗺️World"
      );
    });

    it("should not update dom when oldVal is referenced", async () => {
      const hiddenDom = createHiddenDom();
      const text = van.state("Old Text");

      expect(
        van.add(hiddenDom, () => `From: "${text.oldVal}" to: "${text.val}"`)
      ).toBe(hiddenDom);

      const dom = <Element>hiddenDom.firstChild;
      expect(dom.textContent!).toBe('From: "Old Text" to: "Old Text"');
      expect(hiddenDom.innerHTML).toBe('From: "Old Text" to: "Old Text"');

      text.val = "New Text";
      await sleep(waitMsForDerivations);

      // dom is disconnected from the document thus it won't be updated
      expect(dom.textContent).toBe('From: "Old Text" to: "Old Text"');
      expect(hiddenDom.innerHTML).toBe('From: "Old Text" to: "New Text"');
    });

    it("should not update when state derived children throws error", async () => {
      const hiddenDom = createHiddenDom();
      const num = van.state(0);

      expect(
        van.add(
          hiddenDom,
          num,
          () => {
            if (num.val! > 0) throw new Error();
            return span("ok");
          },
          num
        )
      ).toBe(hiddenDom);

      expect(hiddenDom.innerHTML).toBe("0<span>ok</span>0");

      num.val = 1;
      await sleep(waitMsForDerivations);
      // The binding function 2nd child of hiddenDom throws an error.
      // We want to validate the 2nd child won't be updated because of the error,
      // but other DOM nodes are updated as usual
      expect(hiddenDom.innerHTML).toBe("1<span>ok</span>1");
    });
  });

  describe("hydrate", () => {
    it("should hydrate the given dom with the provided state", async () => {
      const hiddenDom = createHiddenDom();
      const Counter = (init: number) => {
        const counter = van.state(init);
        return button(
          { "data-counter": counter, onclick: () => ++counter.val! },
          () => `Count: ${counter.val}`
        );
      };
      // Static DOM before hydration
      hiddenDom.innerHTML = Counter(5).outerHTML;

      // Before hydration, the counter is not reactive
      hiddenDom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<button data-counter="5">Count: 5</button>'
      );

      van.hydrate(hiddenDom.querySelector("button")!, (dom: HTMLElement) =>
        Counter(Number(dom.getAttribute("data-counter")))
      );

      // After hydration, the counter is reactive
      hiddenDom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<button data-counter="6">Count: 6</button>'
      );
    });

    it("should remove dom when it returns null", async () => {
      const hiddenDom = createHiddenDom();
      // Remove the DOM node upon hydration
      van.add(hiddenDom, div());
      van.hydrate(hiddenDom.querySelector("div")!, () => null);
      expect(hiddenDom.innerHTML).toBe("");

      // Remove the DOM node after the state update
      van.add(hiddenDom, div());
      const s = van.state(1);
      van.hydrate(<HTMLElement>hiddenDom.querySelector("div"), () =>
        s.val === 1 ? pre() : null
      );
      expect(hiddenDom.innerHTML).toBe("<pre></pre>");
      s.val = 2;
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe("");
    });

    it("should remove dom when it returns undefined", async () => {
      const hiddenDom = createHiddenDom();
      // Remove the DOM node upon hydration
      van.add(hiddenDom, div());
      van.hydrate(hiddenDom.querySelector("div")!, () => undefined);
      expect(hiddenDom.innerHTML).toBe("");

      // Remove the DOM node after the state update
      van.add(hiddenDom, div());
      const s = van.state(1);
      van.hydrate(<HTMLElement>hiddenDom.querySelector("div"), () =>
        s.val === 1 ? pre() : undefined
      );
      expect(hiddenDom.innerHTML).toBe("<pre></pre>");
      s.val = 2;
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe("");
    });

    it("should not remove dom when it returns 0", async () => {
      const hiddenDom = createHiddenDom();
      van.add(hiddenDom, div(), div());

      const s = van.state(0);
      const [dom1, dom2] = hiddenDom.querySelectorAll("div");

      van.hydrate(dom1, <any>(() => s.val));
      van.hydrate(dom2, <any>(() => 1 - s.val!));
      expect(hiddenDom.innerHTML).toBe("01");

      s.val = 1;
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe("10");
    });
  });

  describe("gc", () => {
    it("should bind basic state and derived state", async () => {
      const hiddenDom = createHiddenDom();
      const counter = van.state(0);
      const bindingsPropKey = Object.entries(counter).find(([_, v]) =>
        Array.isArray(v)
      )![0];

      van.add(hiddenDom, () => span(`Counter: ${counter.val}`));

      for (let i = 0; i < 100; ++i) ++counter.val!;
      await sleep(waitMsForDerivations);

      expect(hiddenDom.innerHTML).toBe("<span>Counter: 100</span>");
      expect(Object(counter)[bindingsPropKey]).toHaveLength(2);
    });

    it("should clean up nested bindings", async () => {
      const hiddenDom = createHiddenDom();
      const renderPre = van.state(false),
        text = van.state("Text");
      const bindingsPropKey = Object.entries(renderPre).find(([_, v]) =>
        Array.isArray(v)
      )![0];
      const dom = div(() =>
        (renderPre.val ? pre : div)(() => `--${text.val}--`)
      );
      van.add(hiddenDom, dom);

      for (let i = 0; i < 20; ++i) {
        renderPre.val = !renderPre.val;
        await sleep(waitMsForDerivations);
      }

      // Wait until GC kicks in
      await sleep(1000);

      expect(Object(renderPre)[bindingsPropKey]).toHaveLength(1);
      expect(Object(text)[bindingsPropKey]).toHaveLength(1);
    });

    it("should clean up conditional bindings", async () => {
      const hiddenDom = createHiddenDom();
      const cond = van.state(true);
      const a = van.state(0),
        b = van.state(0),
        c = van.state(0),
        d = van.state(0);
      const bindingsPropKey = Object.entries(cond).find(([_, v]) =>
        Array.isArray(v)
      )![0];
      const dom = div(() => (cond.val ? a.val! + b.val! : c.val! + d.val!));
      van.add(hiddenDom, dom);

      const allStates: State<number | boolean>[] = [cond, a, b, c, d];
      for (let i = 0; i < 100; ++i) {
        const randomState =
          allStates[Math.floor(Math.random() * allStates.length)];
        if (randomState === cond) randomState.val = !randomState.val;
        else ++(<State<number>>randomState).val!;
        await sleep(waitMsForDerivations);
      }

      allStates.every((s) => {
        expect(Object(s)[bindingsPropKey].length).toBeGreaterThanOrEqual(1);
        expect(Object(s)[bindingsPropKey].length).toBeLessThanOrEqual(15);
      });

      // Wait until GC kicks in
      await sleep(1000);
      allStates.every((s) =>
        expect(Object(s)[bindingsPropKey]).toHaveLength(1)
      );
    });

    it("should correctly call derived state function", async () => {
      const history: any[] = [];
      const a = van.state(0);
      const listenersPropKey = Object.entries(a).filter(([_, v]) =>
        Array.isArray(v)
      )[1][0];

      van.derive(() => history.push(a.val));

      for (let i = 0; i < 100; ++i) {
        ++a.val!;
        await sleep(waitMsForDerivations);
      }

      expect(history.length).toBe(101);
      expect(Object(a)[listenersPropKey]).toHaveLength(2);
    });

    it("should clean up derived state function", async () => {
      const hiddenDom = createHiddenDom();
      const renderPre = van.state(false),
        prefix = van.state("Prefix");
      const bindingsPropKey = Object.entries(renderPre).find(([_, v]) =>
        Array.isArray(v)
      )![0];
      const listenersPropKey = Object.entries(renderPre).filter(([_, v]) =>
        Array.isArray(v)
      )[1][0];
      const dom = div(() => {
        const text = van.derive(() => `${prefix.val} - Suffix`);
        return (renderPre.val ? pre : div)(() => `--${text.val}--`);
      });
      van.add(hiddenDom, dom);

      for (let i = 0; i < 20; ++i) {
        renderPre.val = !renderPre.val;
        await sleep(waitMsForDerivations);
      }

      // Wait until GC kicks in
      await sleep(1000);

      expect(Object(renderPre)[bindingsPropKey]).toHaveLength(1);
      expect(Object(prefix)[listenersPropKey]).toHaveLength(1);
    });

    it("should clean up derived state in props", async () => {
      const hiddenDom = createHiddenDom();
      const renderPre = van.state(false),
        class1 = van.state(true);
      const bindingsPropKey = Object.entries(renderPre).find(([_, v]) =>
        Array.isArray(v)
      )![0];
      const listenersPropKey = Object.entries(renderPre).filter(([_, v]) =>
        Array.isArray(v)
      )[1][0];
      const dom = div(() =>
        (renderPre.val ? pre : div)(
          { class: () => (class1.val ? "class1" : "class2") },
          "Text"
        )
      );
      van.add(hiddenDom, dom);

      for (let i = 0; i < 20; ++i) {
        renderPre.val = !renderPre.val;
        await sleep(waitMsForDerivations);
      }

      // Wait until GC kicks in
      await sleep(1000);

      expect(Object(renderPre)[bindingsPropKey]).toHaveLength(1);
      expect(Object(class1)[listenersPropKey]).toHaveLength(1);
    });

    it("should clean up derived state as event handler", async () => {
      const hiddenDom = createHiddenDom();
      const renderPre = van.state(false),
        handlerType = van.state(1);
      const bindingsPropKey = Object.entries(renderPre).find(([_, v]) =>
        Array.isArray(v)
      )![0];
      const listenersPropKey = Object.entries(renderPre).filter(([_, v]) =>
        Array.isArray(v)
      )[1][0];
      const dom = div(() =>
        (renderPre.val ? pre : div)(
          button({
            oncustom: van.derive(() =>
              handlerType.val === 1
                ? () => van.add(hiddenDom, p("Handler 1 triggered!"))
                : () => van.add(hiddenDom, p("Handler 2 triggered!"))
            ),
          })
        )
      );
      van.add(hiddenDom, dom);

      for (let i = 0; i < 20; ++i) {
        renderPre.val = !renderPre.val;
        await sleep(waitMsForDerivations);
      }

      // Wait until GC kicks in
      await sleep(1000);

      expect(Object(renderPre)[bindingsPropKey]).toHaveLength(1);
      expect(Object(handlerType)[listenersPropKey]).toHaveLength(1);
    });

    it("should clean up conditionally derived states", async () => {
      const cond = van.state(true);
      const a = van.state(0),
        b = van.state(0),
        c = van.state(0),
        d = van.state(0);
      const listenersPropKey = Object.entries(a).filter(([_, v]) =>
        Array.isArray(v)
      )[1][0];
      van.derive(() => (cond.val ? a.val! + b.val! : c.val! + d.val!));

      const allStates: State<number | boolean>[] = [cond, a, b, c, d];
      for (let i = 0; i < 100; ++i) {
        const randomState =
          allStates[Math.floor(Math.random() * allStates.length)];
        if (randomState === cond) randomState.val = !randomState.val;
        else ++(<State<number>>randomState).val!;
      }

      allStates.every((s) => {
        expect(Object(s)[listenersPropKey].length).toBeGreaterThanOrEqual(1);
        expect(Object(s)[listenersPropKey].length).toBeLessThanOrEqual(10);
      });

      // Wait until GC kicks in
      await sleep(1000);
      allStates.every((s) => {
        expect(Object(s)[listenersPropKey].length).toBeGreaterThanOrEqual(1);
        expect(Object(s)[listenersPropKey].length).toBeLessThanOrEqual(4);
      });
    });
  });

  describe("e2e", () => {
    it("should render Counter and update dom accordingly", async () => {
      const hiddenDom = createHiddenDom();
      const Counter = () => {
        const counter = van.state(0);
        return div(
          div("❤️: ", counter),
          button({ onclick: () => ++counter.val! }, "👍"),
          button({ onclick: () => --counter.val! }, "👎")
        );
      };

      van.add(hiddenDom, Counter());

      expect(
        (<Element>hiddenDom.firstChild).querySelector("div")!.innerHTML
      ).toBe("❤️: 0");

      const [incrementBtn, decrementBtn] =
        hiddenDom.getElementsByTagName("button");

      incrementBtn.click();
      await sleep(waitMsForDerivations);
      expect(
        (<Element>hiddenDom.firstChild).querySelector("div")!.innerHTML
      ).toBe("❤️: 1");

      incrementBtn.click();
      await sleep(waitMsForDerivations);
      expect(
        (<Element>hiddenDom.firstChild).querySelector("div")!.innerHTML
      ).toBe("❤️: 2");

      decrementBtn.click();
      await sleep(waitMsForDerivations);
      expect(
        (<Element>hiddenDom.firstChild).querySelector("div")!.innerHTML
      ).toBe("❤️: 1");
    });

    it("should render ul li", () => {
      const List = ({ items }: { items: string[] }) =>
        ul(items.map((it: any) => li(it)));
      expect(List({ items: ["Item 1", "Item 2", "Item 3"] }).outerHTML).toBe(
        "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"
      );
    });

    it("should render table", () => {
      const Table = ({
        head,
        data,
      }: {
        head?: readonly string[];
        data: readonly (string | number)[][];
      }) =>
        table(
          head ? thead(tr(head.map((h) => th(h)))) : [],
          tbody(data.map((row) => tr(row.map((col) => td(col)))))
        );

      expect(
        Table({
          head: ["ID", "Name", "Country"],
          data: [
            [1, "John Doe", "US"],
            [2, "Jane Smith", "CA"],
            [3, "Bob Johnson", "AU"],
          ],
        }).outerHTML
      ).toBe(
        "<table><thead><tr><th>ID</th><th>Name</th><th>Country</th></tr></thead><tbody><tr><td>1</td><td>John Doe</td><td>US</td></tr><tr><td>2</td><td>Jane Smith</td><td>CA</td></tr><tr><td>3</td><td>Bob Johnson</td><td>AU</td></tr></tbody></table>"
      );

      expect(
        Table({
          data: [
            [1, "John Doe", "US"],
            [2, "Jane Smith", "CA"],
          ],
        }).outerHTML
      ).toBe(
        "<table><tbody><tr><td>1</td><td>John Doe</td><td>US</td></tr><tr><td>2</td><td>Jane Smith</td><td>CA</td></tr></tbody></table>"
      );
    });

    it("should render and update dom after changing state", async () => {
      const hiddenDom = createHiddenDom();
      // Create a new state object with init value 1
      const counter = van.state(1);

      // Log whenever the value of the state is updated
      van.derive(() => console.log(`Counter: ${counter.val}`));

      // Derived state
      const counterSquared = van.derive(() => counter.val! * counter.val!);

      // Used as a child node
      const dom1 = div(counter);

      // Used as a property
      const dom2 = input({ type: "number", value: counter, disabled: true });

      // Used in a state-derived property
      const dom3 = div({ style: () => `font-size: ${counter.val}em;` }, "Text");

      // Used in a state-derived child
      const dom4 = div(counter, sup(2), () => ` = ${counterSquared.val}`);

      // Button to increment the value of the state
      const incrementBtn = button(
        { onclick: () => ++counter.val! },
        "Increment"
      );
      const resetBtn = button({ onclick: () => (counter.val = 1) }, "Reset");

      van.add(hiddenDom, incrementBtn, resetBtn, dom1, dom2, dom3, dom4);

      expect(hiddenDom.innerHTML).toBe(
        '<button>Increment</button><button>Reset</button><div>1</div><input type="number" disabled=""><div style="font-size: 1em;">Text</div><div>1<sup>2</sup> = 1</div>'
      );
      expect(dom2.value).toBe("1");

      incrementBtn.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<button>Increment</button><button>Reset</button><div>2</div><input type="number" disabled=""><div style="font-size: 2em;">Text</div><div>2<sup>2</sup> = 4</div>'
      );
      expect(dom2.value).toBe("2");

      incrementBtn.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<button>Increment</button><button>Reset</button><div>3</div><input type="number" disabled=""><div style="font-size: 3em;">Text</div><div>3<sup>2</sup> = 9</div>'
      );
      expect(dom2.value).toBe("3");

      resetBtn.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<button>Increment</button><button>Reset</button><div>1</div><input type="number" disabled=""><div style="font-size: 1em;">Text</div><div>1<sup>2</sup> = 1</div>'
      );
      expect(dom2.value).toBe("1");
    });

    it("should update dom based on derived state", async () => {
      const hiddenDom = createHiddenDom();
      const DerivedState = () => {
        const text = van.state("VanJS");
        const length = van.derive(() => text.val!.length);
        return span(
          "The length of ",
          input({
            type: "text",
            value: text,
            oninput: (e: any) => (text.val = e.target.value),
          }),
          " is ",
          length,
          "."
        );
      };

      van.add(hiddenDom, DerivedState());
      const dom = <Element>hiddenDom.firstChild;
      expect(dom.outerHTML).toBe(
        '<span>The length of <input type="text"> is 5.</span>'
      );

      const inputDom = dom.querySelector("input")!;
      inputDom.value = "Mini-Van";
      inputDom.dispatchEvent(new Event("input"));

      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        '<span>The length of <input type="text"> is 8.</span>'
      );
    });

    it("should update props based on state", async () => {
      const hiddenDom = createHiddenDom();
      const ConnectedProps = () => {
        const text = van.state("");
        return span(
          input({
            type: "text",
            value: text,
            oninput: (e: any) => (text.val = e.target.value),
          }),
          input({
            type: "text",
            value: text,
            oninput: (e: any) => (text.val = e.target.value),
          })
        );
      };
      van.add(hiddenDom, ConnectedProps());

      const [input1, input2] = hiddenDom.querySelectorAll("input");
      input1.value += "123";
      input1.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      expect(input1.value).toBe("123");
      expect(input2.value).toBe("123");

      input2.value += "abc";
      input2.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      expect(input1.value).toBe("123abc");
      expect(input2.value).toBe("123abc");
    });

    it("should update css based on state", async () => {
      const hiddenDom = createHiddenDom();
      const FontPreview = () => {
        const size = van.state(16),
          color = van.state("black");
        return span(
          "Size: ",
          input({
            type: "range",
            min: 10,
            max: 36,
            value: size,
            oninput: (e: any) =>
              (size.val = Number((<HTMLInputElement>e.target).value)),
          }),
          " Color: ",
          select(
            {
              oninput: (e: any) =>
                (color.val = (<HTMLInputElement>e.target).value),
              value: color,
            },
            ["black", "blue", "green", "red", "brown"].map((c) =>
              option({ value: c }, c)
            )
          ),
          span(
            {
              class: "preview",
              style: () => `font-size: ${size.val}px; color: ${color.val};`,
            },
            " Hello 🍦VanJS"
          )
        );
      };
      van.add(hiddenDom, FontPreview());
      expect((<any>hiddenDom.querySelector("span.preview")).style.cssText).toBe(
        "font-size: 16px; color: black;"
      );

      hiddenDom.querySelector("input")!.value = "20";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      expect((<any>hiddenDom.querySelector("span.preview")).style.cssText).toBe(
        "font-size: 20px; color: black;"
      );

      hiddenDom.querySelector("select")!.value = "blue";
      hiddenDom.querySelector("select")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      expect((<any>hiddenDom.querySelector("span.preview")).style.cssText).toBe(
        "font-size: 20px; color: blue;"
      );
    });

    it("should bind event listener based on derived state", async () => {
      const hiddenDom = createHiddenDom();
      const Counter = () => {
        const counter = van.state(0);
        const action = van.state("👍");
        return span(
          "❤️ ",
          counter,
          " ",
          select(
            {
              oninput: (e: any) => (action.val = e.target.value),
              value: action,
            },
            option({ value: "👍" }, "👍"),
            option({ value: "👎" }, "👎")
          ),
          " ",
          button(
            {
              onclick: van.derive(() =>
                action.val === "👍"
                  ? () => ++counter.val!
                  : () => --counter.val!
              ),
            },
            "Run"
          )
        );
      };

      van.add(hiddenDom, Counter());
      const dom = <Element>hiddenDom.firstChild;
      expect(dom.outerHTML).toBe(
        '<span>❤️ 0 <select><option value="👍">👍</option><option value="👎">👎</option></select> <button>Run</button></span>'
      );

      dom.querySelector("button")!.click();
      dom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        '<span>❤️ 2 <select><option value="👍">👍</option><option value="👎">👎</option></select> <button>Run</button></span>'
      );

      dom.querySelector("select")!.value = "👎";
      dom.querySelector("select")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      dom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        '<span>❤️ 1 <select><option value="👍">👍</option><option value="👎">👎</option></select> <button>Run</button></span>'
      );
    });

    it("should render nested ul li", async () => {
      const hiddenDom = createHiddenDom();
      const SortedList = () => {
        const items = van.state("a,b,c"),
          sortedBy = van.state("Ascending");
        return span(
          "Comma-separated list: ",
          input({
            oninput: (e: any) =>
              (items.val = (<HTMLInputElement>e.target).value),
            type: "text",
            value: items,
          }),
          " ",
          select(
            {
              oninput: (e: any) =>
                (sortedBy.val = (<HTMLInputElement>e.target).value),
              value: sortedBy,
            },
            option({ value: "Ascending" }, "Ascending"),
            option({ value: "Descending" }, "Descending")
          ),
          // A State-derived child node
          () =>
            sortedBy.val === "Ascending"
              ? ul(
                  items
                    .val!.split(",")
                    .sort()
                    .map((i) => li(i))
                )
              : ul(
                  items
                    .val!.split(",")
                    .sort()
                    .reverse()
                    .map((i) => li(i))
                )
        );
      };
      van.add(hiddenDom, SortedList());

      hiddenDom.querySelector("input")!.value = "a,b,c,d";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      expect(hiddenDom.querySelector("ul")!.outerHTML).toBe(
        "<ul><li>a</li><li>b</li><li>c</li><li>d</li></ul>"
      );

      hiddenDom.querySelector("select")!.value = "Descending";
      hiddenDom.querySelector("select")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      expect(hiddenDom.querySelector("ul")!.outerHTML).toBe(
        "<ul><li>d</li><li>c</li><li>b</li><li>a</li></ul>"
      );
    });

    it("should render editable ul li", async () => {
      const hiddenDom = createHiddenDom();
      const ListItem = ({ text }: { text: string }) => {
        const deleted = van.state(false);
        return () =>
          deleted.val
            ? null
            : li(text, a({ onclick: () => (deleted.val = true) }, "❌"));
      };

      const EditableList = () => {
        const listDom = ul();
        const textDom = input({ type: "text" });
        return div(
          textDom,
          " ",
          button(
            {
              onclick: () =>
                van.add(listDom, ListItem({ text: textDom.value })),
            },
            "➕"
          ),
          listDom
        );
      };
      van.add(hiddenDom, EditableList());

      hiddenDom.querySelector("input")!.value = "abc";
      hiddenDom.querySelector("button")!.click();
      hiddenDom.querySelector("input")!.value = "123";
      hiddenDom.querySelector("button")!.click();
      hiddenDom.querySelector("input")!.value = "def";
      hiddenDom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.querySelector("ul")!.outerHTML).toBe(
        "<ul><li>abc<a>❌</a></li><li>123<a>❌</a></li><li>def<a>❌</a></li></ul>"
      );

      {
        [...hiddenDom.querySelectorAll("li")]
          .find((e) => e.innerHTML.startsWith("123"))!
          .querySelector("a")!
          .click();
        await sleep(waitMsForDerivations);
        expect(hiddenDom.querySelector("ul")!.outerHTML).toBe(
          "<ul><li>abc<a>❌</a></li><li>def<a>❌</a></li></ul>"
        );
      }
      {
        [...hiddenDom.querySelectorAll("li")]
          .find((e) => e.innerHTML.startsWith("abc"))!
          .querySelector("a")!
          .click();
        await sleep(waitMsForDerivations);
        expect(hiddenDom.querySelector("ul")!.outerHTML).toBe(
          "<ul><li>def<a>❌</a></li></ul>"
        );
      }
      {
        [...hiddenDom.querySelectorAll("li")]
          .find((e) => e.innerHTML.startsWith("def"))!
          .querySelector("a")!
          .click();
        await sleep(waitMsForDerivations);
        expect(hiddenDom.querySelector("ul")!.outerHTML).toBe("<ul></ul>");
      }
    });

    it("should update dom based on polymorphic state", async () => {
      const stateProto = Object.getPrototypeOf(van.state());
      const hiddenDom = createHiddenDom();
      let numYellowButtonClicked = 0;

      const val = <T>(v: T | State<T> | (() => T)) => {
        const protoOfV = Object.getPrototypeOf(v ?? 0);
        if (protoOfV === stateProto) return (<State<T>>v).val;
        if (protoOfV === Function.prototype) return (<() => T>v)();
        return <T>v;
      };

      const Button = ({
        color,
        text,
        onclick,
      }: {
        color: State<string> | string | (() => string);
        text: State<string> | string;
        onclick: State<() => void> | (() => void);
      }) =>
        button(
          { style: () => `background-color: ${val(color)};`, onclick },
          text
        );

      const App = () => {
        const colorState = van.state("green");
        const textState = van.state("Turn Red");

        const turnRed = () => {
          colorState.val = "red";
          textState.val = "Turn Green";
          onclickState.val = turnGreen;
        };
        const turnGreen = () => {
          colorState.val = "green";
          textState.val = "Turn Red";
          onclickState.val = turnRed;
        };
        const onclickState = van.state(turnRed);

        const lightness = van.state(255);

        return span(
          Button({
            color: "yellow",
            text: "Click Me",
            onclick: () => ++numYellowButtonClicked,
          }),
          " ",
          Button({ color: colorState, text: textState, onclick: onclickState }),
          " ",
          Button({
            color: () =>
              `rgb(${lightness.val}, ${lightness.val}, ${lightness.val})`,
            text: "Get Darker",
            onclick: () => (lightness.val = Math.max(lightness.val! - 10, 0)),
          })
        );
      };

      van.add(hiddenDom, App());

      expect(hiddenDom.innerHTML).toBe(
        '<span><button style="background-color: yellow;">Click Me</button> <button style="background-color: green;">Turn Red</button> <button style="background-color: rgb(255, 255, 255);">Get Darker</button></span>'
      );
      const [button1, button2, button3] = hiddenDom.querySelectorAll("button");

      button1.click();
      expect(numYellowButtonClicked).toBe(1);
      button1.click();
      expect(numYellowButtonClicked).toBe(2);

      button2.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<span><button style="background-color: yellow;">Click Me</button> <button style="background-color: red;">Turn Green</button> <button style="background-color: rgb(255, 255, 255);">Get Darker</button></span>'
      );
      button2.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<span><button style="background-color: yellow;">Click Me</button> <button style="background-color: green;">Turn Red</button> <button style="background-color: rgb(255, 255, 255);">Get Darker</button></span>'
      );

      button3.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<span><button style="background-color: yellow;">Click Me</button> <button style="background-color: green;">Turn Red</button> <button style="background-color: rgb(245, 245, 245);">Get Darker</button></span>'
      );
      button3.click();
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<span><button style="background-color: yellow;">Click Me</button> <button style="background-color: green;">Turn Red</button> <button style="background-color: rgb(235, 235, 235);">Get Darker</button></span>'
      );
    });

    it("should update dom based on state", async () => {
      const hiddenDom = createHiddenDom();
      const TurnBold = () => {
        const vanJS = van.state(<any>"VanJS");
        return span(
          button({ onclick: () => (vanJS.val = b("VanJS")) }, "Turn Bold"),
          " Welcome to ",
          vanJS,
          ". ",
          vanJS,
          " is awesome!"
        );
      };

      van.add(hiddenDom, TurnBold());
      const dom = <Element>hiddenDom.firstChild;
      expect(dom.outerHTML).toBe(
        "<span><button>Turn Bold</button> Welcome to VanJS. VanJS is awesome!</span>"
      );

      dom.querySelector("button")!.click();
      await sleep(waitMsForDerivations);
      expect(dom.outerHTML).toBe(
        "<span><button>Turn Bold</button> Welcome to . <b>VanJS</b> is awesome!</span>"
      );
    });

    it("should batch updates", async () => {
      const hiddenDom = createHiddenDom();
      const name = van.state("");

      const Name1 = () => {
        const numRendered = van.state(0);
        return div(() => {
          ++numRendered.val!;
          return name.val!.trim().length === 0
            ? p("Please enter your name")
            : p("Hello ", b(name));
        }, p(i("The <p> element has been rendered ", numRendered, " time(s).")));
      };

      const Name2 = () => {
        const numRendered = van.state(0);
        const isNameEmpty = van.derive(() => name.val!.trim().length === 0);
        return div(() => {
          ++numRendered.val!;
          return isNameEmpty.val
            ? p("Please enter your name")
            : p("Hello ", b(name));
        }, p(i("The <p> element has been rendered ", numRendered, " time(s).")));
      };

      van.add(
        hiddenDom,
        p(
          "Your name is: ",
          input({
            type: "text",
            value: name,
            oninput: (e: any) => (name.val = e.target.value),
          })
        ),
        Name1(),
        Name2()
      );
      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<p>Your name is: <input type="text"></p><div><p>Please enter your name</p><p><i>The &lt;p&gt; element has been rendered 1 time(s).</i></p></div><div><p>Please enter your name</p><p><i>The &lt;p&gt; element has been rendered 1 time(s).</i></p></div>'
      );

      hiddenDom.querySelector("input")!.value = "T";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("input")!.value = "Ta";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("input")!.value = "Tao";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);

      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<p>Your name is: <input type="text"></p><div><p>Hello <b>Tao</b></p><p><i>The &lt;p&gt; element has been rendered 4 time(s).</i></p></div><div><p>Hello <b>Tao</b></p><p><i>The &lt;p&gt; element has been rendered 2 time(s).</i></p></div>'
      );

      hiddenDom.querySelector("input")!.value = "";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations * 2);
      expect(hiddenDom.innerHTML).toBe(
        '<p>Your name is: <input type="text"></p><div><p>Please enter your name</p><p><i>The &lt;p&gt; element has been rendered 5 time(s).</i></p></div><div><p>Please enter your name</p><p><i>The &lt;p&gt; element has been rendered 3 time(s).</i></p></div>'
      );

      hiddenDom.querySelector("input")!.value = "X";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("input")!.value = "Xi";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      hiddenDom.querySelector("input")!.value = "Xin";
      hiddenDom.querySelector("input")!.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);

      await sleep(waitMsForDerivations);
      expect(hiddenDom.innerHTML).toBe(
        '<p>Your name is: <input type="text"></p><div><p>Hello <b>Xin</b></p><p><i>The &lt;p&gt; element has been rendered 8 time(s).</i></p></div><div><p>Hello <b>Xin</b></p><p><i>The &lt;p&gt; element has been rendered 4 time(s).</i></p></div>'
      );
    });

    it("should hydrate the given element", async () => {
      const stateProto = Object.getPrototypeOf(van.state());

      const val = <T>(v: T | State<T>) =>
        Object.getPrototypeOf(v ?? 0) === stateProto ? (<State<T>>v).val : <T>v;

      const hiddenDom = createHiddenDom();
      const counterInit = 5;

      const Counter = ({
        id,
        init = 0,
        buttonStyle = "👍👎",
      }: {
        id?: string;
        init?: number;
        buttonStyle?: string | State<string>;
      }) => {
        const { button, div } = van.tags;

        const [up, down] = [...Object(val(buttonStyle))];
        const counter = van.state(init);
        return div(
          { ...(id ? { id } : {}), "data-counter": counter },
          "❤️ ",
          counter,
          " ",
          button({ onclick: () => ++counter.val! }, up),
          button({ onclick: () => --counter.val! }, down)
        );
      };
      const selectDom = select(
        { value: "👆👇" },
        option("👆👇"),
        option("👍👎"),
        option("🔼🔽"),
        option("⏫⏬"),
        option("📈📉")
      );
      const buttonStyle = van.state(selectDom.value);
      selectDom.oninput = (e) =>
        (buttonStyle.val = (<HTMLSelectElement>e!.target).value);
      // Static DOM before hydration
      hiddenDom.innerHTML = div(
        h2("Basic Counter"),
        Counter({ init: counterInit }),
        h2("Styled Counter"),
        p("Select the button style: ", selectDom),
        Counter({ init: counterInit, buttonStyle })
      ).innerHTML;

      const clickBtns = async (
        dom: HTMLElement,
        numUp: number,
        numDown: number
      ) => {
        const [upBtn, downBtn] = [...dom.querySelectorAll("button")];
        for (let i = 0; i < numUp; ++i) {
          upBtn.click();
          await sleep(waitMsForDerivations);
        }
        for (let i = 0; i < numDown; ++i) {
          downBtn.click();
          await sleep(waitMsForDerivations);
        }
      };

      const counterHTML = (counter: number, buttonStyle: string) => {
        const [up, down] = [...buttonStyle];
        return div(
          { "data-counter": counter },
          "❤️ ",
          counter,
          " ",
          button(up),
          button(down)
        ).innerHTML;
      };

      // Before hydration, counters are not reactive
      let [basicCounter, styledCounter] = hiddenDom.querySelectorAll("div");
      await clickBtns(basicCounter, 3, 1);
      await clickBtns(styledCounter, 2, 5);
      [basicCounter, styledCounter] = hiddenDom.querySelectorAll("div");
      expect(basicCounter.innerHTML).toBe(counterHTML(5, "👍👎"));
      expect(styledCounter.innerHTML).toBe(counterHTML(5, "👆👇"));

      // Selecting a new button style won't change the actual buttons
      selectDom.value = "🔼🔽";
      selectDom.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      [basicCounter, styledCounter] = hiddenDom.querySelectorAll("div");
      expect(styledCounter.innerHTML).toBe(counterHTML(5, "👆👇"));
      selectDom.value = "👆👇";
      selectDom.dispatchEvent(new Event("input"));

      van.hydrate(basicCounter, (dom) =>
        Counter({
          id: "basic-counter",
          init: Number(dom.getAttribute("data-counter")),
        })
      );
      van.hydrate(styledCounter, (dom) =>
        Counter({
          id: "styled-counter",
          init: Number(dom.getAttribute("data-counter")),
          buttonStyle: buttonStyle,
        })
      );

      // After hydration, counters are reactive
      [basicCounter, styledCounter] = hiddenDom.querySelectorAll("div");
      await clickBtns(basicCounter, 3, 1);
      await clickBtns(styledCounter, 2, 5);
      [basicCounter, styledCounter] = hiddenDom.querySelectorAll("div");
      expect(basicCounter.innerHTML).toBe(counterHTML(7, "👍👎"));
      expect(styledCounter.innerHTML).toBe(counterHTML(2, "👆👇"));

      // Selecting a new button style will change the actual buttons
      const prevStyledCounter = styledCounter;
      selectDom.value = "🔼🔽";
      selectDom.dispatchEvent(new Event("input"));
      await sleep(waitMsForDerivations);
      [basicCounter, styledCounter] = hiddenDom.querySelectorAll("div");
      expect(styledCounter.innerHTML).toBe(counterHTML(2, "🔼🔽"));
      expect(styledCounter !== prevStyledCounter);
    });
  });
});
