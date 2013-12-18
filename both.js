function color(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.toHEX = function () {
    return addzeropadding(this.r.toString(16)) + addzeropadding(this.g.toString(16)) + addzeropadding(this.b.toString(16));
  }
}

function colorFromTriple(t){
  return new color(t.r, t.g, t.b);
}

function atand(x, y) {
  fh = document.vf6;
  if (Math.abs(x) < Math.pow(10, -6)) {
    if (Math.abs(y) < Math.pow(10, -6)) return 0;
    if (y > 0) return 90;
    if (y < 0) return 270
  };
  if (x > 0) {
    if (y >= 0) return 180 * Math.atan(y / x) / Math.PI;
    if (y < 0) return 180 * Math.atan(y / x) / Math.PI - (-1) * 360
  };
  if (x < 0) {
    if (y >= 0) return 180 - 180 * Math.atan(-y / x) / Math.PI;
    if (y < 0) return -180 - (-1) * 180 * Math.atan(y / x) / Math.PI - (-1) * 360
  }
}

function norm(v) {
  //Normalize a vector direction (correct so that 0<=v<360)
  // -inf < v < inf
  v = v % 360;
  // -360 < v < 360
  if (v < 0) {
    v + 360;
  }
  // 0 <= v < 360
  return v;
}

      
        function addzeropadding(i) {
              if (i < 10) {
                  i = "0" + i;
              }
              return i;
          }
      

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function Arrayremove(array, from) {
  array.splice(from, 1)
  return array;
};

function vector(direction, magnitude) {
  this.direction = direction;
  this.magnitude = magnitude;
  this.push = function (sp) {
    if ((Math.abs(this.magnitude + sp) < 21)) {
      this.magnitude += sp;
      return this;
    }
  }
  this.nudge = function (d) {
    this.direction = (this.direction + d) % 360;
    return this;
  }
  this.radian = function () {
    return -1 * (this.direction * (Math.PI / 180))
    return this;
  }
}


function vectorFromJSON(j){
  return new vector(j.direction, j.magnitude);
}

function vector_from_two_points(head, tail) {
  var dx = tail.x - head.x;
  var dy = tail.y - head.y;
  var mag = Math.sqrt((dx * dx) + (dy * dy));
  var dir = atand(dy, dx);
  dir = dir - 90
  if (dir < 0) {
    dir = 360 + dir
  }
  return new vector(dir, mag);
}
