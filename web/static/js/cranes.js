var crane = {};
crane.UP = 0;
crane.EVEN = 1;
crane.DOWN = 2;
crane.EVEN2 = 3;
crane.LEFT = 0;
crane.RIGHT = 1;
crane.images = [
  ['images/crane_up_left.png', 'images/crane_up_right.png'],
  ['images/crane_even_left.png', 'images/crane_even_right.png'],
  ['images/crane_down_left.png', 'images/crane_down_right.png'],
  ['images/crane_even2_left.png', 'images/crane_even2_right.png']
];
crane.DISTANCE = 20;
crane.EMOTION_NORMAL = 0;
crane.EMOTION_PANIC = 1;

function Crane() {
  this.curX = 0;
  this.curY = 0;
  this.wingState = Math.floor(Math.random() * 4);
  this.faceState = Math.floor(Math.random() * 2);
  this.emotionState = crane.EMOTION_NORMAL;
  this.goalX = -1;
  this.goalY = -1;
  this.hoverable = $("<div/>").addClass("crane-hoverable").appendTo($("body"));
  this.images = [];
  for (var i = 0; i < 4; i++) {
    var wings = [];
    this.images.push(wings);
    for (var j = 0; j < 2; j++) {
      wings.push($("<img/>").prop("src", crane.images[i][j]).addClass("crane").hide().appendTo($("body")));
    }
  }
  this.setNewGoal();
  this.curX = this.goalX;
  this.curY = this.goalY;
  this.animating = false;

  var self = this;
  this.hoverTimeoutId = undefined;
  function onMouseOver() { 
    if (self.hoverTimeoutId) {
      clearTimeout(self.hoverTimeoutId);
      self.hoverTimeoutId = undefined;
    }
    self.setEmotion(crane.EMOTION_PANIC);
  }
  function onMouseOut() { 
    if (self.hoverTimeoutId) {
      clearTimeout(self.hoverTimeoutId);
    }
    self.hoverTimeoutId = setTimeout(function() { self.setEmotion(crane.EMOTION_NORMAL); }, 500);
  }
  this.hoverable.mouseenter(onMouseOver).mouseleave(onMouseOut);
}

Crane.prototype.update = function(speed) {
  if (this._shouldSetNewGoal()) {
    this.setNewGoal();
  }

  var lastImage = this.images[this.wingState][this.faceState];
  lastImage.clearQueue().show().css("opacity", 1).fadeOut(speed);

  this.faceState = (this.goalX > this.curX) ? crane.RIGHT : crane.LEFT;
  this.wingState = (this.wingState + 1) % 4;
  this.curX += (this.goalX > this.curX) ? crane.DISTANCE : -crane.DISTANCE;
  this.curY += (this.goalY > this.curY) ? crane.DISTANCE : -crane.DISTANCE;

  var curImage = this.images[this.wingState][this.faceState];
  curImage.css("top", this.curY + "px").css("left", this.curX + "px");
  curImage.clearQueue().hide().fadeIn(speed);

  this.hoverable.css("top", this.curY + "px").css("left", this.curX + "px");
};

Crane.prototype._shouldSetNewGoal = function() {
  if (this.goalX < 0 || this.goalY < 0) {
    return true;
  }
  if (Math.abs(this.curX - this.goalX) < crane.DISTANCE &&
      Math.abs(this.curY - this.goalY) < crane.DISTANCE) {
    return true;
  }
  return false;
};

Crane.prototype.setNewGoal = function(opt_x, opt_y) {
  if (opt_x) {
    this.goalX = opt_x;
  } else {
    this.goalX = ($(window).width() - 100) * Math.random();
  }

  if (opt_y) {
    this.goalY = opt_y;
  } else {
    this.goalY = ($(window).height() - 100) * Math.random();
  }
};

Crane.prototype.setEmotion = function(emotion) {
  var oldState = this.emotionState;
  this.emotionState = emotion;
  if (this.animating && oldState != this.emotionState) {
    this._animateFrame();
  }
};

Crane.prototype.animate = function(opt_on) {
  var oldState = this.animating;
  var animating = opt_on == undefined ? true : opt_on;
  this.animating = animating;
  if (oldState != animating) {
    if (animating) {
      this._animateFrame();
    } else {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  }
};

Crane.prototype._animateFrame = function() {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
  if (this.animating) {
    var self = this;
    function frame() { self._animateFrame(); }
    if (this.emotionState == crane.EMOTION_NORMAL) {
      this.update(400);
      this.timeoutId = setTimeout(frame, 1000);
    } else {
      this.update(50);
      this.timeoutId = setTimeout(frame, 200);
    }
  }
};