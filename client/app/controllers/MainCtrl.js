angular.module('vicara')
.controller('MainCtrl', function(voronoi) {
  var init = function() {
    voronoi.bindResizeEvent();
    voronoi.compute();    
  };
  init();

});