(function ($) {

  $.timeline = function (element, options) {

    // default options
    var defaults = {
      displayed_from: 0.5,
      space_end: 0.05
    }

    var plugin = this;

    // Merge settings
    plugin.settings = $.extend({}, defaults, options);

    var $element = $(element),
      element = element,
      $children = $element.find('.timeline-item');
    timeline_max = $element.height();


    var last_scroll, last_timeline_height = 0;
    var last_item_size = function(){
      var last_item = $(element).find('.timeline-item').last();
      var space_bottom = last_item.find('.timeline-item-content').height() / 2 + $(element).find('.timeline-item').height();
      $(element).css('padding-bottom', space_bottom - parseInt($(element).find('.timeline-item').css('padding-top')));
      $(element).find('.timeline').css('bottom', space_bottom);
    };


    plugin.init = function () {
      $(window).on('scroll', function () {
        timelineProgress();
      });

      $(window).resize(function () {
        timeline_max = $element.height();
        timelineProgress();
        last_item_size();
      });

      $element.find('.timeline-modal-button').on('click', function(e){
        e.preventDefault();
        open_modal($(this));
      });

      $element.on('click', '.timeline-modal-open .button-close', function(e){
        e.preventDefault();
        close_modal();
      });


      last_item_size();
    };



    plugin.init();

    var element_visible_value = function (element) {
      var percentage = ($(window).scrollTop() + $(window).height() - element.offset().top) / element.height();
      return percentage;
    };
    var element_bottom_visible = function (element) {
      var is_visible = (element.offset().top + element.height()) < ($(window).scrollTop() + window.innerHeight);
      return is_visible;
    };

    var timelineProgress = function () {
      offsetTop = $element.offset().top;
      if (element_visible_value($element) > 0) {
        $element.addClass('active');
        $children.removeClass('active');
        $children.each(function (index) {
          if (element_visible_value($(this)) > plugin.settings.displayed_from) {
            $(this).addClass('anim');
          }
          else if (element_visible_value($(this)) <= 0) {
            $(this).removeClass('anim');
          }
          if (element_visible_value($(this)) > plugin.settings.displayed_from && !element_bottom_visible($(this))) {
            $(this).addClass('active');
          }
        });
        last_child_visible = $element.find('.active').length > 0 ? $element.find('.active') : $children.last();
        var percent_timeline = element_visible_value($element) - plugin.settings.space_end;

        timeline_height = percent_timeline * $element.height();

        if (timeline_height >= timeline_max) {
          timeline_height = timeline_max;
          $element.addClass('anim-timeline-end');
        }
        else $element.removeClass('anim-timeline-end');

        $element.find('.timeline-line').height(timeline_height);

        last_timeline_height = timeline_height;

      }
      else {
        $element.removeClass('active');
      }
      last_scroll = $(window).scrollTop();

    };
    var open_modal = function (button) {
      var modal = button.parents('.timeline-item').find('.timeline-modal');
      $(modal).addClass('timeline-modal-open');
    };

    var close_modal = function () {
      $element.find('.timeline-modal').removeClass('timeline-modal-open');
    };


  };

  // add the plugin to the jQuery.fn object
  $.fn.timeline = function (options) {

    // iterate through the DOM elements we are attaching the plugin to
    return this.each(function () {

      // if plugin has not already been attached to the element
      if (undefined == $(this).data('timeline')) {


        var plugin = new $.timeline(this, options);

        $(this).data('timeline', plugin);

      }

    });
  }
})(jQuery);
