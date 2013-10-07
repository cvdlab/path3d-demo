
var input_from = $('[name="from"]');
var input_to = $('[name="to"]');
var button_run = $('.run');

var wall_color = [0.25,0.25,0.25,0.5];
var wall_quote = [30];
var path_color = [0.85,0.05,0];
var graph_color = [0.25,0.25,0.75];
var equipment_color = [0.25,0.25,0.75];
var equipment_quote = [5];
var code_color = [0.15,0.15,0.15];
var code_quote = [1];

var g = new Graph(graph);
var current_path = null;

draw_walls(walls);
draw_equipments(equipments);
// var model_qr_code = draw_qr_code(qr_code);
// draw_graph(graph);

button_run.click(function (event){
  event.preventDefault();
  var from = input_from.val();
  var to = input_to.val();
  // var path = g.min_path(from, to);
  var min_path = g.findShortestPath(from, to);

  draw_path(min_path);
});

function draw_path (path) {
  if (current_path) {
    current_path.hide();
  }
  var points = path.map(function (id) {
    return graph[id].pos;
  });

  var domain = INTERVALS(1)(20);
  var spline = SPLINE(CUBIC_UBSPLINE(domain))(points);
  var path = navigator(3)(SPLINE_TO_POINTS(spline));
  // var polyline = POLYLINE(points);
  
  path.color(path_color);
  DRAW(path);
  current_path = path;
  return path;
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
    polyline = POLYFILL(2)(wall.points);
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
    model.translate([0,1,2], equipment.pos);
    model = model.extrude(equipment_quote);
    model.color(color);
    DRAW(model);
  } 
}

function draw_qr_code (qr_code) {
  var id;
  var code;
  var shape;
  var pixels = [];
  var pixel;
  var type;
  var color;
  for (id in qr_code) {
    code = qr_code[id];
    color = code.color || code_color;
    pixel = CUBOID(code.dim);
    pixel.translate([0,1], code.pos);
    pixel = pixel.extrude(code_quote);
    pixel.color(color);
    pixels.push(pixel);
  } 
  var model = STRUCT(pixels);
  DRAW(model);
  return model;
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
