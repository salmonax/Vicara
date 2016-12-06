angular.module('vicara')
.factory('util', function () {
  var Timer = function(name) {
    console.log("NEW TIMER CREATED: ", name);
    this.name = name;
    this.startTime = null;
    this.elapsed = null;
    this.timerId = null;
    this.total = 0;
  };
  Timer.prototype.start = function(callback) {
    this.startTime = Date.now();
    this.timerId = setInterval(function() {
      this.elapsed = Date.now() - this.startTime + this.total;
      // console.log(this.elapsed);
      callback(this.elapsed);
    }.bind(this),1000);
  }
  Timer.prototype.stop = function() {
    clearInterval(this.timerId);
    this.total = this.elapsed;
    return this.counter;
  };
  Timer.prototype.create = function(name) {
    return new Timer(name);
  };
  // not used
  Timer.prototype.get = function(prop) {
    return this[prop];
  }

  function binduRGB(text) {
    // sums the ascii values of each character in the stat to use as seed
    var seed = text.split('').reduce( function(sum,item,i) { return sum + item.charCodeAt()*i+2 },0);

    var color = {
      r: parseInt(seededRandom(seed)*100+50),
      g: parseInt(seededRandom(++seed)*100+50),
      b: parseInt(seededRandom(++seed)*100+100)
    };
    return color;
  };

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  return {
    binduRGB: binduRGB,
    Timer: Timer
  };
});