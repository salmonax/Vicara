angular.module('vicara')
.controller('MainCtrl', function($scope, voronoi, $rootScope, util) {
  $scope.activePoly = "WOOT WOOT";
  $scope.elapsed = 0;

  var timerStore = {};

  $rootScope.$on('timer:activate', function(e, args) {
    var name = args.name;
    timerStore[name] = timerStore[name] || new util.Timer(name);
    voronoi.bindTimers(timerStore);
    timerStore[name].start(function(elapsed) {
      // console.log(name);
      $scope.elapsed = elapsed;
      $scope.activePoly = name;
      $scope.$apply();
    });
  });
  $rootScope.$on('timer:deactivate',function(e, args) {
    var name = args.name;
    console.log(name);
    timerStore[name].stop();
    $scope.activePoly = 'None';
    $scope.$apply();
  });

  var init = function() {
    $scope.timers = {};
    voronoi.bindResizeEvent();
    voronoi.compute(); 
  };
  init();



});