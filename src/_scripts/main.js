// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

var $ = require('jquery');
require('bootstrap');
require('./timeline/jquery.timeline');
require('./tab-accordion/jquery.tabAccordion');


$(document).ready(function(){
    $('.container-timeline').timeline();

    $('.tab-accordion').tabAccordion();
});
