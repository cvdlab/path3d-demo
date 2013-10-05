/**
 * navigator
 */

function VECTADD (arg) {
  var v1 = arg[0];
  var v2 = arg[1];
  var res = [];
  
  v1.forEach(function (v, i) {
    res[i] = v + v2[i];
  });

  return res;
}

function VECTDIFF (arg) {
  var v1 = arg[0];
  var v2 = arg[1];
  var res = [];
  
  v1.forEach(function (v, i) {
    res[i] = v - v2[i];
  });

  return res;
}

function MATRIXADD (m, v) {
  return m.map(function (vm, i) {
    return VECTADD([vm, v]);
  });
}

function MATRIXDIFF (m, v) {
  return m.map(function (vm, i) {
    return VECTDIFF([vm, v]);
  });
}

function VECTNORM (v) {
  var pow = Math.pow;
  var rn = v.length;
  var sum = 0;
  var i;
  for (i = 0; i < rn; i += 1) {
    sum += pow(v[i],2);
  }

  return Math.sqrt(sum);
}

function zip (a, b) {
  var zipped = [];
  var n = Math.min(a.length, b.length);
  var i;
  for (i = 0; i < n; i += 1) {
    zipped.push([a[i], b[i]]);
  }
  return zipped;
}

function trianglePair (points) {
  return SIMPLICIAL_COMPLEX(points)([[0,1,2],[2,3,0]]);
}

function balls(points, r) {
  var circle = DISK(r)([24,1]);
  var fun = function (p) { return T([0,1])(p)(circle) };
  var balls = AA(fun)(points);
  return balls;
}
    
function navigator (r) {
  function nav0(polyline) {
    
    var square = [[0,0],[1,0],[1,1],[0,1]];
    var square_T = numeric.transpose(square);
    var lines = [];
    var l;
    for (l = 1; l < polyline.length; l += 1) {
      lines[l-1] = [polyline[l], polyline[l-1]];
    }
    var tangents = AA(VECTDIFF)(lines);
    var out = [];
    var models= [];
    var length = tangents.length;
    var i, p, v, size, scaling, rotation, q, rect, joint, final_add, final_diff;
    for (i = 0; i < length; i +=1) {
      p = polyline[i];
      v = tangents[i];
      vx = v[0];
      vy = v[1];
      size = VECTNORM(v);
      scaling = [[size,0.0],[0.0,2*r]];
      rotation = [[vx/size,vy/size],[vy/size,-vx/size]];
      q = numeric.dot(rotation, scaling);
      rect = numeric.transpose(numeric.dot(q, square_T));
      joint = numeric.transpose(numeric.dot(q, [[0],[0.5]]))[0];
      final_add = MATRIXADD(rect, p);
      final_diff = MATRIXDIFF(final_add,joint);
      out.push(final_diff);
    }
    Array.prototype.push.apply(models, balls(polyline, r));
    Array.prototype.push.apply(models, AA(trianglePair)(out));
    return STRUCT(models);
  }
  return nav0;
}

/**
 * tests
 */

// var polyline1_points = [[0,10],[5,10],[5,20],[-5,20],[-5,-10],[5,-10],[5,0],[15,0]];
// var poliline1 = POLYLINE(polyline1_points);
// DRAW(polyline1);
// var path = navigator(0.5)(polyline1_points);
// DRAW(path);

// var polyline2_points = [[10,8],[15,10],[5,12],[-5,4],[-15,-10],[5,-3],[5,0],[15,0]];
// var polyline2 = POLYLINE(polyline2_points);
// var path = navigator(0.3)(polyline2_points);
// DRAW(path);