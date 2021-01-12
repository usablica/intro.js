import {DOMWindow, JSDOM} from "jsdom";

export interface Global {
  document: Document;
  window: DOMWindow;
}

declare var global: Global;

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
