import "regenerator-runtime/runtime";
import { JSDOM } from "jsdom";
import * as matchers from "jest-extended";
import expect from "expect";

expect.extend(matchers);

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.Element = dom.window.Element;
global.SVGElement = dom.window.SVGElement;
