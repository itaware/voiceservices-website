// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

var $ = require('jquery');
require('bootstrap');
require('./timeline/jquery.timeline');
require('./tab-accordion/jquery.tabAccordion');


$(document).ready(function () {
  $('a[href*="#"]:not([href="#"])').on('click', function () {
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
  });



  $('.container-timeline').timeline();

  $('.tab-accordion').tabAccordion();
});