/**
 * @File 
 *   JS File for detecting user's browsers specifically Internet Explorer (IE)
 */

 (function($) {

  /**
   * Add the IE message if browser is Internet Explorer.
   * 
   * @param {jQuery} body 
   */
  function ie_message(body) {
    var user_agent = navigator.userAgent;
    var ie_message = 'The Brighton & Hove City Council website is no longer supported in Internet Explorer. If you continue to use Internet Explorer, some parts of this website might look broken. To use this website properly, you need to upgrade to a different browser.';
    if (user_agent.match(/MSIE/i) || user_agent.match(/Trident/i)) {
      body.addClass('browser-ie');
      var ie_banner = $('<div>', {
        class: 'ie-banner__inner',
      }).text(ie_message);
      ie_banner.prependTo(body).wrap('<div class="ie-banner"></div>');
    }
  }

  Drupal.behaviors.bhcc_ieMessage = {
    attach: function(context, settings) {
      $('body', context).once('ieMessage').each(function() {
        ie_message($(this));
      });
    }
  }

}) (jQuery);
