## Release History

 * **v2.9.3** - 2018-04-24
   - hotfix to skipping and exiting the intro

 * **v2.9.2** - 2018-04-24
   - hotfix to add any minified files that might have been dependencies to the npm package

 * **v2.9.1** - 2018-04-24
   - hotfix to removing events from removed DOM elements

 * **v2.9.0** - 2018-04-23
   - Added @bozdoz as Author
   - Fixed scroll positions when parent element is scrollable 
   - Added DOM Event helper function and _stamp to uniquely identify objects and intro instances; fixes issues with removing event listeners
   - Added new syntax for radial gradients
   - Fixes to CSP violations to avoid using `setAttribute`
   - Fix to intro groups from PR #80 (also PR #763)
   - optional `buttonClass` option to overwrite 'introjs-button'
   - Added `onskip` callback

 * **v2.9.0-alpha.1** - 2017-12-02
   - Supporting scroll option `off`
   - Improved accuracy of tooltip positions
   - Improved auto position
   - Changed HTML attributes to lowercase
   - Improved coding style
   - Many bug fixes

 * **v2.8.0-alpha.1** - 2017-08-30
   - Enabling `onbeforechange` to return bool and prevent the next step to display
   - Updating disable interaction layer after window resize
   - Fixing disable interaction layer z-index issue

 * **v2.7.0** - 2017-08-17
   - Added `onbeforeexit` callback
   - Added `force` parameter to `exit()`
   - Added Code of Conduct and Contributing guide files

 * **v2.6.0** - 2017-07-29
   - Per step disable interaction
   - Adding `scrollTo` option 
   - Better scrolling method
   - Fixing pulse animation issue on IE
   - Adding a new method to show the popup of specific hint
   - Fixing build script
   - Some minor bug fixes

 * **v2.5.0** - 2017-03-22
   - SVG support
   - Adding new function: `goToStepNumber`, `removeHint`, `removeHits`
   - Adding new positions for hints
   - Adding library to Yarn
   - Fixing documentation
   - and many minor bug fixes + refactoring

 * **v2.4.0** - 2016-12-11
   - New documentation
   - New template: Modern
   - Added showHint and showHints
   - Added Dart and R wrappers
   - Minor bug fixes and coding style issues

 * **v2.3.0** - 2016-07-01
   - Fixing the conflict with Bootstrap 3
   - Adding two new options to hide next and previous button in first and last steps
   - Add web components compatibility (polymer)
   - Removing `position: absolute` from parent fix class
   - Fixing typo in hint pulse class
   - Adding a Bootstrap 3 example + different positions example
   - and some minor bug fixes.

 * **v2.1.0** - 2016-04-20
   - Removed javascript:void hrefs in order to support CSP
   - Add hideHint function to public api
   - Add re-align hints to refresh function + skip hidden elements for intro
   - Added a check for ghost elements
   - Remove `introjs-fixedTooltip` if not needed
   - Removed any leftover introjs-fixedTooltip class
   - CSS - Make filter a string
   - Add new template 'flattener'
   - Updating documentation + adding Emberjs
   - and some minor bug fixes.

 * **v2.0.0** - 2015-12-21
   - Adding `hint` feature
   - Updating templates

 * **v1.1.1** - 2015-09-05
   - Fix versioning issue

 * **v1.1.0** - 2015-09-01
   - Fix no interaction bug
   - Fix recursion bug with jQuery
   - Call `onexit` on pressing Esc or clicking on the overlay layer
   - Fix helper layer positioning issue when the content changes
   - Fix transform is 'undefined' in IE 8
   - Fix coding style issues

 * **v1.0.0** - 2014-10-17
   - Auto-positioning feature for tooltip box
   - Add progress-bar to tooltip box
   - Fix `z-index` issue
   - Add dark template
   - Fix bad sizing with Bootstrap 3
   - Add disable interaction ability
   - Fix code styling issues and many minor bug fixes

 * **v0.9.0** - 2014-05-23
   - Add IntroJS templates
   - Add more tooltip positions (bottom-right, bottom-middle, bottom-left)
   - Fix table `tr` element's issue

 * **v0.8.0** - 2014-03-25
   - Ability to define introductions without focusing on elements
   - Fix Internet Explorer 8.0 issue
   - Add `_direction` property

 * **v0.7.1** - 2014-03-11
   - Fix "Too much recursion" issue with Firefox and Internet Explorer.

 * **v0.7.0** - 2014-02-07
   - Add `onafterchange` event
   - Add scrolling to element option
   - Add `nextStep` and `previousStep` functions publicly
   - Add `_cloneObject` method to prevent data overwriting
   - Fix null elements problem with programmatic definition
   - Fix issues with single-step introductions
   - Fix top margin problem on hidden elements
   - Fix stacking context problem caused by element opacity
   - Fix call exit() on null elements
   - Update documentation and add more details on CDN servers and RTL example

 * **v0.6.0** - 2013-11-13
   - Add step bullets with navigating
   - Add option to hide introduction navigating buttons
   - Make keyboard navigation optional
   - Making `data-step` optional with elements
   - Fix scroll issue when scrolling down to elements bigger than window
   - Fix Chrome version 30.0.1599.101 issue with hiding step numbers
   - Fix incorrect calling onExit callback when user clicks on overlay layer
   - Fix coding styles and improvement in performance

 * **v0.5.0** - 2013-07-19
   - Add CSS class option for tooltips (And tooltip buttons also)
   - Add RTL version
   - Ability to add HTML codes in tooltip content
   - Ability to add DOM object and CSS selector in programmatic API (So you can use jQuery selector engine)
   - Add `refresh()` method to refresh and order layers manually
   - Show tooltip buttons only when introduction steps are more than one
   - Fix `onbeforechange` event bug and pass correct object in parameters
   - Fix `Null element exception` in some browsers
   - And add more examples

 * **v0.4.0** - 2013-05-20
   - Add multi-page introduction example
   - Add programmatic introduction definition
   - Cooler introduction background!
   - Remove IE specific css file and embed IE support to main css file (property fallback)
   - Update introduction position on window resize (Also support tablet/mobile devices rotation)
   - Disable buttons on the first and start of introduction (Skip and Done button)
   - Add `onbeforechange` callback
   - Add `showStepNumbers` option to show/hide step numbers
   - Add `exitOnEsc` and `exitOnOverlayClick` options
   - Fix bad tooltip position calculating problem
   - Fix a bug when using `!important` in element css properties
   - Fix a bug in `onexit` behavior
   - Code refactoring

 * **v0.3.0** - 2013-03-28
   - Adding support for CommonJS, RequireJS AMD and Browser Globals.
   - Add `goToStep` function to go to specific step of introduction.
   - Add `onchange` callback.
   - Add `exit` function to exit from introduction.
   - Adding options with `setOption` and `setOptions` functions.
   - More IE compatibility.
   - Fix `min-width` bug with tooltip box.
   - Code cleanup + Better coding style.

 * **v0.2.1** - 2013-03-20
   - Fix keydown event unbinding bug.

 * **v0.2.0** - 2013-03-20
   - Ability to define tooltip position with `data-position` attribute
   - Add `onexit` and `oncomplete` callback
   - Better scrolling functionality
   - Redesign navigating buttons + add previous button
   - Fix overlay layer bug in wide monitors
   - Fix show element for elements with position `absolute` or `relative`
   - Add `enter` key for navigating in steps
   - Code refactoring


 * **v0.1.0** - 2013-03-16
   - First commit.
