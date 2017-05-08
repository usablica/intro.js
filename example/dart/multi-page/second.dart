import "dart:html";
import "../../../introjs.dart";

void main() {
  if (new RegExp("multipage", caseSensitive: false)
      .hasMatch(window.location.search)) {
    new IntroJs().start();
  }
}
