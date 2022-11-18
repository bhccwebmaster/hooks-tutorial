/**
 * @File JS File for the extending the accordion component to locate the Active service
 *
 */

(function($) {

  Drupal.behaviors.activeService = {
    attach: function(context) {

      var accordions = $(document).find(".accordion");
      if(!accordions.length) {
        return;
      }

      $('.accordion', context).once('init-active-service').each(function() {
        var accordionSections = $(this).children('.accordion__section');
        accordionSections.each(function() {
          var activeService = $(this).find('.active-service');

          // Expand the menu automatically for larger screens.
          if (activeService.length && $(window).width() > 767) {
            $(this).addClass('accordion--active-initial');
            $(this).attr('aria-expanded', 'true');
          }
        });
      });
    }
  }

}) (jQuery);
