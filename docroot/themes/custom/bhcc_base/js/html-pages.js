/**
 * @File JS File for the HTML Page content type.
 */

(function($) {

  Drupal.behaviors.html_page = {
    attach: function attach(context) {

      const tabs = $('#tabs', context);

      tabs.tabs({
        prevNext: true,
        prevNextClass: 'page-navigation',
        prevClass: 'page-navigation__prev',
        nextClass: 'page-navigation__next',
        prevNextTitle: '.html-page-section__heading',
        fadeSpeed: 100,
        scrollSpeed: 0
      });
    }
  }

}) (jQuery);
