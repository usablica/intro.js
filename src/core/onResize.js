import refresh from "./refresh";

export default function onResize() {
  if (document.querySelector('.introjs-tooltip') !== null) {
    refresh.call(this);
  }
}
