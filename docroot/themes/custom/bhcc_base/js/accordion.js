/**
 * @File JS File for the Accordion component
 */

(function($) {

  Drupal.behaviors.accordions = {
    attach: function(context) {

      var accordions = $(document).find(".accordion");
      if(!accordions.length) {
        return;
      }

      $('.accordion', context).once('init-accordion').each(function() {
        var accordionSections = $(this).children('.accordion__section');
        accordionSections.each(function() {
          var accordionHeading = $(this).children('.accordion__heading');
          accordionHeading.click(function(e) {
            e.preventDefault();
            var currentState = $(this).parent().attr('aria-expanded');
            if(!currentState || currentState == 'false') {
              accordionSections.each(function() {
                $(this).removeClass('accordion--active-initial');
                $(this).removeClass('accordion--active');
                $(this).attr('aria-expanded', 'false');
                $(this).children('.accordion__body').slideUp();
              });
              accordionParent = $(this).parent();
              accordionParent.addClass('accordion--active');
              accordionParent.attr('aria-expanded', 'true');
              accordionParent.children('.accordion__body').slideDown();
            } else {
              currentHref = $(this).attr('href');
              // Commented out below so sidebar always shows / hides
              // instead of following link to sub landing page.
              /*if(currentHref !== '#') {
                window.location.href = $(this).attr('href');
              } else {*/
                accordionParent = $(this).parent();
                accordionParent.children('.accordion__body').slideUp(400, function() {
                  accordionParent.removeClass('accordion--active-initial accordion--active');
                  accordionParent.attr('aria-expanded', 'false');
                });
              /*}*/
            }
          });
        });
      });
    }
  }

}) (jQuery);