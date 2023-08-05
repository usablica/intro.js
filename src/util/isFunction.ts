// Returns true if the given parameter is a function
export default (x: any): x is Function => typeof x === "function";
