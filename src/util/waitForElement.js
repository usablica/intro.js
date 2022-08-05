/**
 * Waits until Element will appear
 *
 * @api private
 * @method _waitForElement
 * @param {string} elSelector Selector to locate Element
 * @param {() => void} callback Callback to be called after Element appearance
 */
export default function _waitForElement(elSelector, callback) {
  if (document.querySelector(elSelector) !== null) {
    callback();
    return;
  }

  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => {
      if (document.querySelector(elSelector) !== null) {
        observer.disconnect();
        callback();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  } else {
    // Old browsers will wait by timeout
    waitForElementByTimeout(elSelector, callback, 1000, 10000);
  }
}

/**
 * @param {string} elSelector
 * @param {() => void} callback
 * @param {number} checkInterval In milliseconds
 * @param {number} maxTimeout In milliseconds
 */
function waitForElementByTimeout(
  elSelector,
  callback,
  checkInterval,
  maxTimeout
) {
  let startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(elSelector) !== null) {
      callback();
      return;
    } else {
      setTimeout(function () {
        if (Date.now() - startTimeInMs > maxTimeout) {
          callback();
          return;
        }
        loopSearch();
      }, checkInterval);
    }
  })();
}
