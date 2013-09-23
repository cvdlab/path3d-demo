var PLASM = require('cvdlab-plasm-fun');
PLASM('plasm').globalize();

var $ = require('jquery');

var input_from = $('.from');
var input_to = $('.to');
var button_run = $('.run');

var wall_color = [0.25,0.25,0.25];
var wall_quote = [1];
var path_color = [0.05,0.75,0];
var graph_color = [0.25,0.25,0.75];
var equipment_color = [0.25,0.25,0.75];
var equipment_quote = [1];

// var g = new Graph(input.graph);
var current_path = null;

draw_walls(input.walls);
draw_equipments(input.equipments);
draw_graph(input.graph);

button_run.click(function (event){
  event.preventDefault();
  var from = input_from.val();
  var to = input_to.val();
  var path = g.min_path(from, to);

  draw_path(path);
});

function draw_path (path) {
  if (current_path) {
    current_path.hide();
  }
  var points = path.map(function (id) {
    return input[id].position;
  });
  var polyline = POLYLINE(points);
  polyline.color(path_color);
  DRAW(polyline);
  current_path = polyline;
  return polyline;
}

function draw_graph (graph) {
  var points = Object.keys(graph).map(function (id) {
    return graph[id].position;
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
      line = POLYLINE([from.position, to.position]);
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
    polyline.extrude(wall_quote);
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
      model = CIRCLE(equipment.dimensions[0])(32,32);
    } else {
      model = CUBOID(equipment.dimensions);
    }
    model.translate([0,1], equipment.position);
    model.extrude(equipment_quote);
    model.color(color);
    DRAW(model);
  } 
}