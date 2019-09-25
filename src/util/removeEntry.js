/**
 * Remove an entry from a string array if it's there, does nothing if it isn't there.
 *
 * @param {Array} stringArray
 * @param {String} stringToRemove
 */
export default function removeEntry(stringArray, stringToRemove) {
  if (stringArray.includes(stringToRemove)) {
    stringArray.splice(stringArray.indexOf(stringToRemove), 1);
  }
}
