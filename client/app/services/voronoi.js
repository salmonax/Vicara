/*
  TODO: 
    Check children on all polys and set pointer-events none

*/
angular.module('vicara')
.factory('voronoi', function (util, $rootScope) {
  var options = {
    polygon: 'rectangle', // rectangle, triangle, pentagon, octogon, circle
    max_depth: 'none', // acceptable values: 1-12 or none
    stroke_by_depth: false, // boolean
    color: 'bindu' // acceptable values: name, linear, none, bindu
  };
  var cShift = 75;

  function make_regular_polygon(width, height, border, sides) {
    var center = [width*0.5, height*0.5],
      width_radius = (width - 2*border) * 0.5,
      height_radius = (height - 2*border) * 0.5,
      radius = Math.min( width_radius, height_radius ),
      angle_radians = 2*Math.PI / sides,
      initial_angle = sides%2==0 ? -Math.PI/2 -angle_radians*0.5 : -Math.PI/2, // subtract angles
      result = [],
      somevariable = 0;
    
    // special case few sides
    if (sides == 3) {
      center[1] += height_radius / 3.0; // can always do this (I think?)
    
      radius_for_width = width_radius * 2 / Math.sqrt(3);
      radius_for_height = height_radius * 4.0 / 3.0;
      radius = Math.min(radius_for_width, radius_for_height);
    }
    else if (sides == 4) {
      radius *= Math.sqrt(2);
    }
    
    for (var i = 0; i < sides; i++) {
      result.push([center[0] + radius * Math.cos(initial_angle - i * angle_radians), center[1] + radius * Math.sin(initial_angle - i * angle_radians)]);
    }

    return result;
  }

  // here we set up the svg
  // var width = 800;
  // var height = 1000;
  var width = window.innerWidth+20;
  var height = window.innerHeight+20;
  console.log("width-height on init", width, height);
  var border = 10;
  var svg_container = d3.select("#treemap").append("svg")
    .attr("width",width)
    .attr("height",height)
    .attr("id","svgid");

  ///////// bounding polygon
  function get_selected_polygon() {
    var width_less_border = width - 2 * border;
    var height_less_border = height - 2 * border;
    var entire_svg_polygon = [[border,border],
      [border,height_less_border],
      [width_less_border,height_less_border],
      [width_less_border,border]];

    // var select_polygon = d3.select("#select_polygon").node().value;
    var select_polygon = options.polygon;
    // console.log(select_polygon);
    if (select_polygon == "rectangle") {
      return entire_svg_polygon;
    }
    else if (select_polygon == "triangle") {
      return make_regular_polygon(width, height, border, 3);
    }
    else if (select_polygon == "pentagon") {
      return make_regular_polygon(width, height, border, 5);
    }
    else if (select_polygon == "octogon") {
      return make_regular_polygon(width, height, border, 8);
    }
    else if (select_polygon == "circle") {
      return make_regular_polygon(width, height, border, 100);
    } 
  }

  function get_selected_dataset() {
    var select_dataset = d3.select("#select_dataset").node().value;
    if (select_dataset == "flare") {
      return flare_json;
    }
    else if (select_dataset == "paper_simple_example") {
      // console.log(paper_simple_example_json);
      return paper_simple_example_json;
    }
    else if (select_dataset == "random_10_3_000") {
      return random_10_3_000_json;
    }
  }


  function make_d3_poly(d) {
    return "M" + d.join("L") + "Z";
  }

  function get_poly_center_x(d) {
    // console.log(JSON.stringify(d.polygon));
    return 100;
  }

  function get_poly_center_y(d) {
    return 100;
  }

  function getCentroid(poly) {
    var centroid = { x: 0, y: 0 };
    for (var i = 0; i < poly.length; i++) {
      centroid.x += poly[i][0];
      centroid.y += poly[i][1];
    }
    centroid.x/=poly.length;
    centroid.y/=poly.length;
    return centroid;
  }


  var paint = function(nodes){
    svg_container.selectAll("path").remove();
    svg_container.selectAll("text").remove();

    // background color
    //var background_color = "lightgray";
    var background_color = "none";
    svg_container.append("g").append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", background_color);



    // strokes by depth
    // a bit awkward to use the UI element here
    // var stroke_by_depth = d3.select("#checkbox_stroke").property('checked'); 
    var stroke_by_depth = options.stroke_by_depth;
    // console.log('stroke by depth: ', stroke_by_depth);
    var stroke_min = 2,
      stroke_max = stroke_by_depth ? 10 : stroke_min,
      stroke_levels = 3,// could determine from max depth...see color...
      stroke_delta = (stroke_max - stroke_min) * 1.0 / stroke_levels;
    
    // color
    // var select_color = d3.select("#select_color").node().value;
    var select_color = options.color;
    // console.log('select color: ', select_color);
    if (select_color == "linear") {
      var nodes_all_depths = nodes.map(function(x) {return x.depth});
      var nodes_max_depth = Math.max.apply(null, nodes_all_depths);
      var color_d3_linear = d3.scale.linear().domain([0, nodes_max_depth]).range(["blue","lightblue"]);
      var color_func = function(d) { return color_d3_linear(d.depth); };
    }
    else if (select_color == "name") {
      var color_d3 = d3.scale.category20c();
      var color_func = function(d) { return color_d3(d.name); };
    } else if (select_color == "bindu") {
      var color_func = function(d) {
        var color = util.binduRGB(d.name);
        var rgb = d3.rgb(color.r,color.g,color.b)
        return rgb.toString();
      }
    } else {
      // none or some other weird thing ;)
      var color_func = "lightblue"; // or whatever color
    }
    
    // any maximum depth?
    // var select_max_depth = d3.select("#select_max_depth").node().value;
    var select_max_depth = options.max_depth;
    // console.log('max depth: ', select_max_depth);
    var max_depth = 12; // or whatever big thing...
    if (select_max_depth != "none") {
      max_depth = parseInt(select_max_depth);
    }
    
    
    
    // consolidate and draw polygons
    var selected_node_list = [];
    for (var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        if (node.polygon != null && node.depth <= max_depth){
            selected_node_list.push(node);
        }
    }
    var testText = d3.select("body")
      .append("text")
      .classed('label', true)
      .text('Just a random text string');

    var colorShift = function(rgb, num) {
      return d3.rgb(rgb.r+num, rgb.g+num, rgb.b+num);
    }

    var activeTimer = null;
    var activeTimerName = null;
    var lastInactiveColor = null;
    var activeColor = d3.rgb(230,0,0);
    var activateTimer = function(d, el) {
      var $d = d3.select(el);
      // var shiftAmount = $d.data.hovering ? cShift : 0;
      var inactiveColor = d3.rgb($d.style("fill"));
      $d.style("fill", activeColor);
      if (activeTimer) {
        resetLastActiveTimer(el);
      }
      lastInactiveColor = inactiveColor;
      activeTimer = el;
      activeTimerName = d.name;
      $rootScope.$broadcast('timer:activate',{
        name: d.name
      });
    };
    var deactivateTimer = function(d, el) {
      var $d = d3.select(el);
      $d.style("fill", lastInactiveColor);
      activeTimer = null;
      activeTimerName = null;
      $rootScope.$broadcast('timer:deactivate', {
        name: d.name
      });
      // resetLastActiveTimer(el);
    };

    var resetLastActiveTimer = function(el) {
      var $last = d3.select(activeTimer);
      console.log(el);
      $rootScope.$broadcast('timer:deactivate', {
        name: activeTimerName
      });
      var $d = d3.select(el);
      var shiftAmount = $d.data.hovering ? cShift : 0;
      $last.style("fill", colorShift(lastInactiveColor, shiftAmount));
      activeTimer = null; 
      activeTimerName = null;
      lastInactiveColor = null;
    }

 

    var polylines = svg_container.append("g").selectAll("path").data(selected_node_list);
    var pEnter = polylines.enter();
    pEnter.append("path")
      .attr("d", function(d) {
        return make_d3_poly(d.polygon);
      })
      .attr("stroke-width", function(d) { return Math.max(stroke_max - stroke_delta*d.depth, stroke_min) + "px";})
      .attr("stroke", "black")
      .attr("fill", color_func)
      .on('click', function(d,i) {
          if (d.children) { return; }
          if (activeTimer === this) {
            deactivateTimer(d, this);
          } else {
            activateTimer(d, this);
          }
        // console.log('timer started!!!');
      })
      .on('mouseover', function(d) {
        if (d.children) { return; }
        var $d = d3.select(this)
        $d.data.hovering = true;
        var color = d3.rgb($d.style("fill"));
        $d.style("fill", colorShift(color,-cShift) );
      })
      .on('mouseout', function(d) {
        if (d.children) { return; }
        var $d = d3.select(this)
        // console.log($d.data.hovering);
        $d.data.hovering = false;
        var color = d3.rgb($d.style("fill"));
        $d.style("fill", colorShift(color,cShift) );
      })

    pEnter.append("text")
      .classed('label', true)
      .attr('pointer-events', 'none')
      .attr('x', function(d) {
        return getCentroid(d.polygon).x-(d.name.length*10); // hard coding for now
      })
      .attr('y', function(d) {
        return getCentroid(d.polygon).y;
      })
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'white')
      .text(function(d) {
        return (!d.children) ? d.name : null;
      });
    polylines.exit().remove();

    
    // also circles?  only for leaves?
    // a subset of selected_node_list as it turns out
    var leaf_node_list = [];
      for (var i = 0; i < selected_node_list.length; i++){
          var node = selected_node_list[i];
          if (!node.children || node.depth == max_depth){
              leaf_node_list.push(node);
          }
      }

    // disabled because of weirdness with non-leaf centroids
    // centroid circles
    //var show_leaf_centroids = d3.select("#checkbox_leaf_centroids").property('checked');
    if (false) {
      var center_circles = svg_container.append("g").selectAll(".center.circle").data(leaf_node_list);
      center_circles.enter().append("circle")
        .attr("class", "center circle")
        .attr("cx", function(d) {return (d.site.x);})
        .attr("cy", function(d) {return (d.site.y);})
        .attr("r", function(d) {return 5;})
        //.attr("r", function(d) {return (Math.sqrt(d.weight));})
        //.attr("r", function(d) {return (Math.max(Math.sqrt(d.weight), 2));})
        .attr("stroke", "black")
        .attr("fill", "black");
    }
    
    // weight circles
    // this does work...but is kind of ugly
    if (false) {
      var radius_circles = svg_container.append("g").selectAll(".radius.circle").data(leaf_node_list);
      radius_circles.enter().append("circle")
        .attr("class", "radius circle")
        .attr("cx", function(d) {return (d.site.x);})
        .attr("cy", function(d) {return (d.site.y);})
        //.attr("r", function(d) {return 5;})
        .attr("r", function(d) {return (Math.sqrt(d.weight));})
        //.attr("r", function(d) {return (Math.max(Math.sqrt(d.weight), 2));})
        .attr("stroke", "white")
        .attr("stroke-width", "5px")
        .attr("fill", "none");
    }
  }

  var newnodes;
  function compute() {
    // arbitrarily selected for now

    var select_polygon = get_selected_polygon(); 

    var vt = d3.layout.voronoitreemap()
      .root_polygon(select_polygon)
      .value(function(d) {
        return d.size; 
      })
      .iterations(100);
    
    // var select_dataset = get_selected_dataset(); // will 
    var select_dataset = paper_simple_example_json;
    newnodes = vt(select_dataset);
    paint(newnodes);
  }



  // yeah...should probably update on all input changes
  // nope...only the fast ones!

  /* Probably will change these with either react State or other means that aren't html elements, who knows */
  // d3.select("#checkbox_stroke").on("click", function() {paint(newnodes)});
  // d3.select("#select_color").on("change", function() {paint(newnodes)});
  // d3.select("#checkbox_leaf_centroids").on("click", function() {paint(newnodes)});
  // d3.select("#select_max_depth").on("change", function() {paint(newnodes)});

  // d3.select("#button_compute").on("click", function() {compute();});

  function resizeTreemap() {
    width = window.innerWidth+20;
    height = window.innerHeight+20;
    console.log("width-height at resize: ", width, height);
    d3.select('#svgid')
    .attr("width", width)
    .attr("height",height);
    compute();
  }

  function bindResizeEvent() {
    d3.select(window).on('resize.updatesvg', resizeTreemap);
  }

  function bindTimers(timers) {
    console.log(timers);
    d3.selectAll('text').each(function(d,i) {
      if (d) {
        d.elapsed = (timers[d.name]) ? timers[d.name].elapsed : 0;
        if (d.elapsed) { console.log('!!', d.name, d.elapsed); }
      }
    });
    // LOOK HERE
    d3.selectAll('text').text(function(d) {
      console.log(d);
      if (!d || d.children) { return null; }
      return (d.elapsed) ? d.name + ' ' + d.elapsed : d.name;
    });
  }

  return {
    compute: compute,
    bindResizeEvent: bindResizeEvent,
    bindTimers: bindTimers
  }

});