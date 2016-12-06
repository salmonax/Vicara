angular.module('vicara')
.factory('util', function () {

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
    binduRGB: binduRGB
  };
});