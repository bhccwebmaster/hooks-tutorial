/**
 * @File JS File for the Show/Hide component
 */

(function($) {

  Drupal.behaviors.showHide = {
    attach: function(context) {

      var showHideToggle = $(document).find(".show-hide-toggle");
      if(!showHideToggle.length) {
        return;
      }

      $('.show-hide-toggle', context).once('init-show-hide').each(function() {
        $(this).click(function(e) {
          e.preventDefault();
          currentState = $(this).attr('aria-expanded');
          currentState === 'false' ?
            $(this).attr('aria-expanded', 'true') :
            $(this).attr('aria-expanded', 'false');
          $(this).hasClass('show-hide-toggle--is-active') ?
            $(this).removeClass('show-hide-toggle--is-active') :
            $(this).addClass('show-hide-toggle--is-active');

          target = $(document).find('#' + $(this).attr('data-target'));
          if (!target.hasClass('show-hide--is-active')) {
            target.slideDown(function() {
              target.addClass('show-hide--is-active').css('display', '');
            });
          } else {
            target.slideUp(function() {
              target.removeClass('show-hide--is-active').css('display', '');
            });
          }

        });
      });
    }
  }

}) (jQuery);
