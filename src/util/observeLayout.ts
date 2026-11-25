export type LayoutObserver = {
  /** also watch the size of this element */
  observe: (element: Element) => void;
  unobserve: (element: Element) => void;
  disconnect: () => void;
};

// events after which elements may have moved without a change to the DOM
const layoutEvents = ["transitionend", "animationend", "load"];

/**
 * Calls `onChange` (at most once per frame) when something happened that
 * may have moved or resized elements on the page: the DOM changed (outside
 * of what `ignore` returns true for, like our own layers), the page or an
 * observed element was resized, a transition or an animation ended, or an
 * image loaded. `onChange` checks whether what it cares about really moved.
 *
 * @api private
 */
export default function observeLayout(
  onChange: () => void,
  ignore: (node: Node) => boolean = () => false
): LayoutObserver {
  let frame: number | undefined;
  const schedule = () => {
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      onChange();
    });
  };

  const mutations =
    typeof MutationObserver === "undefined"
      ? undefined
      : new MutationObserver((records) => {
          if (records.some((record) => !ignore(record.target))) schedule();
        });
  mutations?.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });

  const resizes =
    typeof ResizeObserver === "undefined"
      ? undefined
      : new ResizeObserver(schedule);
  resizes?.observe(document.body);

  // these don't bubble (load) or come from anywhere: listen while capturing
  for (const type of layoutEvents) {
    document.addEventListener(type, schedule, true);
  }

  return {
    observe: (element) => resizes?.observe(element),
    unobserve: (element) => resizes?.unobserve(element),
    disconnect: () => {
      mutations?.disconnect();
      resizes?.disconnect();
      for (const type of layoutEvents) {
        document.removeEventListener(type, schedule, true);
      }
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    },
  };
}
