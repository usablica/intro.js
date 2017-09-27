/*!
 * Start Bootstrap - Agency v1.1.1 (http://startbootstrap.com/template-overviews/agency)
 * Copyright 2013-2016 Start Bootstrap
 * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap/blob/gh-pages/LICENSE)
 */
!function(t){"use strict";t("a.page-scroll").bind("click",function(o){var a=t(this);t("html, body").stop().animate({scrollTop:t(a.attr("href")).offset().top-50},1250,"easeInOutExpo"),o.preventDefault()}),t("body").scrollspy({target:".navbar-fixed-top",offset:51}),t(".navbar-collapse ul li a:not(.dropdown-toggle)").click(function(){t(".navbar-toggle:visible").click()}),t("#mainNav").affix({offset:{top:100}})}(jQuery);