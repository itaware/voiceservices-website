(function ($) {
  $.fn.tabAccordion = function (params) {
    var titleElt;
    var titleActiveElt;
    var contentElt;
    var contentActiveElt;
    // Init
    var init = function (element) {
      var options = $.extend({}, $.fn.defaults, params);


      // Title
      titleElt = $(element).find('.tab-accordion-title');
      titleActiveElt = titleElt.first();

      // Content
      contentElt = $(element).find('.tab-accordion-content');
      contentActiveElt = contentElt.first();

      // Active first element
      contentActiveElt.addClass('open');
      titleActiveElt.addClass('open');


      $(window).resize(function () {
        $.fn.sizeElt(element);
      });

      $(document).on('click', '.tab-accordion-title', function (e) {
        e.preventDefault();
        var id_content = $(this).find('a').attr('href');
        if (window.innerWidth < options.breakpoint) {
          if (!$(this).hasClass('open')) {
            $(element).find('.tab-accordion-content').slideUp();
            $(id_content).slideDown();
          }
          else {
            $(id_content).slideUp();
          }
        }
        if (!$(this).hasClass('open')) {
          $(element).find('.tab-accordion-content').removeClass('open');
          $(element).find('.tab-accordion-title').removeClass('open');
          $(this).addClass('open');
          $(id_content).addClass('open');
        }

        $.fn.sizeElt(element);
      });
      // add class
      $(element).addClass('tab-pos-'+options.position);

      // clone title for desktop
      $(element).append($('<div class="container-tab-title hidden-xs" />').append('<div class="inner" />'));
       titleElt.each(function(index){
        if(!titleElt.hasClass('title-tab')) {
           $(this).clone().addClass('title-tab').appendTo($(element).find('.container-tab-title .inner'));
           $(this).addClass('visible-xs');
        }
      });


      $.fn.sizeElt = function (element) {
        $(element).find('.tab-accordion-title').css('display', '');
        $(element).find('.tab-accordion-content').css('display', '');

        if (window.innerWidth < options.breakpoint) {
          $(element).height('');
          $(element).find('.tab-accordion-content').hide();
          $(element).find('.tab-accordion-content.open').show();
        }
        else {
          titleHeight = $(element).find('.tab-accordion-title').getMaxHeight();
          if (options.direction == 'horizontal') {
            $(element).height(titleHeight + $(element).find('.tab-accordion-content.open').height());
            if(options.position == 'bottom'){
              $(element).find('.tab-accordion-content').css({bottom: titleHeight});
            }
            else{
              $(element).find('.tab-accordion-content').css({top: titleHeight});
            }
          }
          else {
            $(element).css('min-height', titleHeight + $(element).find('.tab-accordion-content.open').height())

          }

        }
      };

      // Init size container + content

      $.fn.sizeElt(element);

    };


    /*------------------------------------------------------*/
    // Initialize plugin
    this.each(function () {

      $.fn.defaults = {
        direction: 'horizontal',
        position: 'bottom',
        breakpoint: 767
      }

      plugin = init(this);
      //  $(this).data('tabAccordion', plugin);
    });
    return this;
  };

  $.fn.getMaxHeight = function () {
    var maxHeight = this.map(function (i, e) {
      return $(e).outerHeight();
    }).get();
    return Math.max.apply(this, maxHeight);
  };

})(jQuery);