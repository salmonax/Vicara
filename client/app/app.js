angular.module('vicara',[])
.run(function() {
  function loadPomsheet() {
    $('#pomsheet').load('/data/pomsheet.txt');


  }
  function initCarousel() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var carouselWidth = width*3;
    var snaps = JSON.stringify([0,0-width,0-width*2]);
    $('div.screen')
      .css('width', width)
      .css('height', height);

    $('div.carouselWrap')
      .attr('snap-locations', snaps)
      .css('width',carouselWidth)
      .css('-webkit-transform', 'translate3d(' + -width + 'px, 0px, 0px)');

    $('#left').css('width',width);
    $('#center').css('width',width);
    $('#right').css('width',width);
    $('.login').css({transform: 'scale(1.6)'});
  }
  initCarousel();
  loadPomsheet();

  $(window).on('resize', initCarousel);


  // Login page business... Replace!

  // $('.error-page').hide(0);

  // $('.login-button , .no-access').click(function(){
  //   $('.login').slideUp(500);
  //   $('.error-page').slideDown(1000);
  // });

  // $('.try-again').click(function(){
  //   $('.error-page').hide(0);
  //   $('.login').slideDown(1000);
  // });

});