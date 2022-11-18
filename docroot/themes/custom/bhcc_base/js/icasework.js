/**
 * @File 
 *   JS File for supporting iCasework
 */

 (function($) {

  /**
   * Add the iCasework embed support.
   * 
   * @param {jQuery} icasework_iframe
   *   iCasework iframe jQuery element.
   */
  function icasework(icasework_iframe) {
    if (typeof iFrameResize !== 'undefined') {
      iFrameResize({checkOrigin: false});
    }
  }

  Drupal.behaviors.bhcc_iCasework = {
    attach: function(context, settings) {
      $('.js-icaseworkembed', context).once('icaseworkembed').each(function() {
        icasework($(this));
      });
    }
  }

}) (jQuery);
