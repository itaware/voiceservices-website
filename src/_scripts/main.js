// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

var $ = require('jquery');
require('bootstrap');
require('./timeline/jquery.timeline');
require('./tab-accordion/jquery.tabAccordion');
require('owl.carousel');


$(document).ready(function () {
  $('a[href*="#"]:not([href="#"])').on('click', function () {
    if(!$(this).parents('.tab-accordion')){

      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top - parseInt($('body').css('padding-top'))
          }, 800);
          return false;
        }
      }
    }
  });

  $('.owl-carousel').owlCarousel({
    items: 1,
    autoplay: true
  });

  $('.container-timeline').timeline();

  $('.tab-accordion').tabAccordion();
});