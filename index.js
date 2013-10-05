var PLASM = require('cvdlab-plasm-fun');
PLASM('plasm').globalize();

var $ = require('jquery');

var input_from = $('[name="from"]');
var input_to = $('[name="to"]');
var button_run = $('.run');

var wall_color = [0.25,0.25,0.25,0.5];
var wall_quote = [1];
var path_color = [0.05,0.75,0];
var graph_color = [0.25,0.25,0.75];
var equipment_color = [0.25,0.25,0.75];
var equipment_quote = [1];

var g = new Graph(graph);
var current_path = null;

draw_walls(walls);
draw_equipments(equipments);
draw_graph(graph);

button_run.click(function (event){
  event.preventDefault();
  var from = input_from.val();
  var to = input_to.val();
  // var path = g.min_path(from, to);
  var path = g.findShortestPath(from, to);

  draw_path(path);
});

function draw_path (path) {
  if (current_path) {
    current_path.hide();
  }
  var points = path.map(function (id) {
    return graph[id].pos;
  });
  // var polyline = POLYLINE(points);
  
  var domain = INTERVALS(1)(20);
  var polyline = SPLINE(CUBIC_CARDINAL(domain))(points);
  
  polyline.color(path_color);
  DRAW(polyline);
  current_path = polyline;
  return polyline;
}

function draw_graph (graph) {
  var points = Object.keys(graph).map(function (id) {
    return graph[id].pos;
  }); 

  var polypoint = POLYPOINT(points);
  var from_id;
  var from;
  var to_id;
  var to;
  var line;
  for (from_id in graph) {
    from = graph[from_id];
    for (to_id in from.adj) {
      to = graph[to_id];
      line = POLYLINE([from.pos, to.pos]);
      line.color(graph_color);
      DRAW(line);
    }
  }
  polypoint.color(graph_color);
  DRAW(polypoint);
}

function draw_walls (walls) {
  var id;
  var wall;
  var polyline;
  var color;
  for (id in walls) {
    wall = walls[id];
    color = wall.color || wall_color;
    polyline = POLYLINE(wall.points);
    polyline.color(color);
    polyline = polyline.extrude(wall_quote);
    DRAW(polyline);
  }
}

function draw_equipments (equipments) {
  var id;
  var equipment;
  var shape;
  var model;
  var type;
  var color;
  for (id in equipments) {
    equipment = equipments[id];
    color = equipment.color || equipment_color;
    if (equipment.type === 'circle') {
      model = DISK(equipment.dim[0])([16,2]);
    } else {
      model = CUBOID(equipment.dim);
    }
    model.translate([0,1], equipment.pos);
    model = model.extrude(equipment_quote);
    model.color(color);
    DRAW(model);
  } 
}

function color_graph () {
  var c = graph;
  var draw_adj = function (n) {
    if (c[n].visited) {
      return;
    }

    var adj = c[n].adj;
    var x;
    c[n].visited = true;
    for (x in adj) {
      DRAW(POLYLINE([c[n].pos, c[x].pos]).color([1,0,0]));
      draw_adj(x);
    }
  };

  draw_adj(20);
}

// color_graph();

function VECTDIFF (arg) {
  var v1 = arg[0];
  var v2 = arg[1];
  var res = [];
  
  v1.forEach(function (v, i) {
    res[i] = v - v2[i];
  });

  return res;
}

function navigator (r) {
  function nav0(polyline) {
    var circle = CIRCLE(r)([24,1]);
    var square = [[0,0],[1,0],[1,1],[0,1]];
    var fun = function (p) { return T([1,2])(p)(circle) };
    var balls = AA(fun)(polyline);
    var lines = [];
    var l;
    for (l = 1; l < polyline.length; l += 1) {
      lines[l-1] = [polyline[l], polyline[l-1]];
    }
    var tangents = AA(VECTDIFF)(lines);
    var out = [];
    
  }
}

