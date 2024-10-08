import "regenerator-runtime/runtime";
//@ts-ignore
import { JSDOM } from "jsdom";
//import * as matchers from "jest-extended";
//import expect from "expect";

//expect.extend(matchers);

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.Element = dom.window.Element;
global.Text = dom.window.Text;
global.Event = dom.window.Event;
global.SVGElement = dom.window.SVGElement;
