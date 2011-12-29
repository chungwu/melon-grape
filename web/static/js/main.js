function animateCycle(selector, duration, startCss, endCss) {
  var $prop = $(selector);
  function toStart() {
    $prop.animate(startCss, {duration:duration, complete:toEnd});
  }
  function toEnd() {
    $prop.animate(endCss, {duration:duration, complete:toStart});
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
  $(".page-opened").removeClass("page-opened").addClass("page-closed");
  $page.addClass("page-opened").removeClass("page-closed");
  $(".sand-background").css("height", $page.outerHeight() + "px");
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
  for (var i = 0; i < 50; i++) {
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