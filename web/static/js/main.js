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
    console.log("Animate " + toAdd + ", " + toRemove);
    $prop.removeClass(toRemove).addClass(toAdd);
    $prop.clearQueue().delay(duration).queue(
      function() {
	animate(toRemove, toAdd);
      });
  }
  animate(startClass, endClass);
}

function openPage($page) {
  $(".page-opened").removeClass("page-opened").addClass("page-closed");
  $page.addClass("page-opened").removeClass("page-closed");
  $(".pages-container").css("height", $page.outerHeight() + "px");  
}