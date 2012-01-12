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
}

function openPage($page) {
  var $toClose = $(".page-opened");
  $toClose.removeClass("page-opened").addClass("page-closed");
  $(".page-content", $toClose).hide();
  var delay = isMobile() ? 600 : 0;
  $page.addClass("page-opened").removeClass("page-closed").clearQueue().delay(delay).queue(function() {
    $(".page-content", $page).slideDown(function() {
      $(".delay-load.not-loaded", $page).each(function() {
        $(this).html($(this).comments().join(""));
        $(this).removeClass("not-loaded");
      });
    });
  });
}

function fillStack() {
  var $stack = $(".stack");
  $stack.css("top", $(".page").last().position().top + 50 + "px");
  var images = [
    "images/paper1b.jpg",
    "images/paper2.jpg",
    "images/paper3.jpg",
    "images/paper4.jpg",
    "images/paper5.jpg",
    "images/paper6.jpg",
    "images/paper7b.jpg"
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
    $header.css("backgroundPosition", "0px " + Math.random() * -600 + "px");
    $("<div class='page-content'/>").appendTo($page);
    lastTop += 25;
  }
}

function isMobile() {
  return navigator.userAgent.indexOf("Mobile") >= 0;
}

function generateStack($container, images, opt_title, opt_firstSrc) {
  $container.addClass("polaroid-stack");
  var firstSrc = opt_firstSrc || images[0][0];
  var $img = $("<img/>").attr("src", firstSrc);
  var $first = $("<div class='polaroid stack-first'/>").appendTo($container);
  $("<div class='stack-mask'/>").appendTo($first);
  $("<div class='stack-play'/>").appendTo($first);
  $first.append($img);
  $container.mouseenter(function() {
    $(".stack-mask", $first).addClass("stack-mask-hover");
  }).mouseleave(function() {
    $(".stack-mask", $first).removeClass("stack-mask-hover");
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
      resizeDuration: 0, captionAnimationDuration: 0, counterText: false, imageFadeDuration: 0
    });
  });
}