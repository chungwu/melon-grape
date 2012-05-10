function animateCycle(selector, duration, startCss, endCss, opt_easing) {
  var easing = opt_easing;
  var $prop = $(selector);
  function toStart() {
    $prop.animate(startCss, {duration:duration, complete:toEnd, easing:easing});
  }
  function toEnd() {
    $prop.animate(endCss, {duration:duration, complete:toStart, easing:easing});
  }
  toEnd();
}

function animateStraight(selector, duration, startCss, endCss, opt_easing) {
  var $prop = $(selector);
  var easing = opt_easing;
  function animate() {
    $prop.animate(
      endCss, {
	duration:duration,
	easing: easing,
	complete:function() {
	  $prop.css(startCss);
	  animate();
	}
      });
  }
  animate();
}

function animateClasses(selector, duration, startClass, endClass) {
  var $prop = $(selector);
  function animate(toAdd, toRemove) {
    $prop.removeClass(toRemove).addClass(toAdd);
    $prop.clearQueue().delay(duration).queue(
      function() {
	animate(toRemove, toAdd);
      });
  }
  animate(startClass, endClass);
}

function onHistoryChanged(opt_hash) {
  var hash = opt_hash || "home";
  openPage($(".page-" + hash));
  _gaq.push(['_trackPageview', '/' + hash]);
}

function openPage($page) {
  var $toClose = $(".page-opened");
  $toClose.removeClass("page-opened").addClass("page-closed");
  var mobile = isMobile();
  $(".page-content", $toClose).hide();
  function render() {
    $(".delay-load.not-loaded", $page).each(function() {
      if (mobile && $(this).hasClass("not-mobile")) {
        return;
      }
      var html = $(this).comments().join("");
      $(this).html(html);
      $(this).removeClass("not-loaded");
    });
  }
  var $content = $(".page-content", $page);
  $page.addClass("page-opened").removeClass("page-closed");
  if (mobile) {
    $content.show();
    render();
  } else {
    $content.slideDown(render);
  }
}

function fillStack() {
  var $stack = $(".stack");
  $stack.css("top", $(".page").last().position().top + 50 + "px");
  var images = [
    "images/paper1d.jpg",
    "images/paper2d.jpg",
    "images/paper3d.jpg",
    "images/paper4d.jpg",
    "images/paper5d.jpg",
    "images/paper6d.jpg",
    "images/paper7d.jpg"
  ];
  var lastTop = 0;
  for (var i = 0; i < 10; i++) {
    var $page = $("<div/>").addClass("page page-closed").css(
      {
	top: lastTop - 5 + Math.random() * 10 + "px",
	left: -790 + Math.random()*20 + "px"
      }).appendTo($stack);
    var $header = $("<div class='page-header'><div class='page-title'>&nbsp;</div></div>").appendTo($page);
    $header.css("backgroundImage", "url('" +  images[Math.floor(Math.random() * images.length)] + "')");
    $header.css("backgroundPosition", Math.random() * 600 + "px 0px");
    $("<div class='page-content'/>").appendTo($page);
    lastTop += 25;
  }
}

function isMobile() {
  return navigator.userAgent.indexOf("Mobi") >= 0 && navigator.userAgent.indexOf("iPad") < 0;
}

function generateStack($container, images, opt_title, opt_firstSrc, opt_class) {
  $container.addClass("polaroid-stack");
  var firstSrc = opt_firstSrc || images[0][0];
  var $img = $("<img/>").attr("src", firstSrc);
  var $first = $("<div class='polaroid stack-first'/>").appendTo($container);
  $("<div class='stack-mask'/>").appendTo($first);
  $("<div class='stack-play'/>").appendTo($first);
  $first.append($img);
  $container.mouseenter(function() {
    $container.addClass("polaroid-stack-hover");
  }).mouseleave(function() {
    $container.removeClass("polaroid-stack-hover");
  });
  if (opt_title) {
    $("<div class='stack-title'/>").text(opt_title).appendTo($first);
  }
  $img.load(function() {
    var width = $first.width();
    var height = $first.height();
    for (var i = 0; i < 3; i++) {
      var $pol = $("<div class='polaroid'/>").css({width: width, height: height}).appendTo($container);
      $pol.css("top", Math.random() * 30 - 15 + "px");
      $pol.css("left", Math.random() * 30 - 15 + "px");
    }
  });
  var wrappedImages = [];
  for (var i = 0; i < images.length; i++) {
    if (typeof(images[i]) == "string") {
      wrappedImages.push([images[i]]);
    } else {
      wrappedImages.push(images[i]);
    }
  }

  $container.click(function() {
    $.slimbox(wrappedImages, 0, {
      resizeDuration: 0, captionAnimationDuration: 0, counterText: false, imageFadeDuration: 0,
      optClass: opt_class
    });
    _gaq.push(["_trackEvent", "Slideshows", "Play", opt_title]);
  });
}

function loadCss(file) {
  var css = $("<link>").attr({
    rel:  "stylesheet",
    type: "text/css",
    href: file
  }).appendTo($("head"));
}