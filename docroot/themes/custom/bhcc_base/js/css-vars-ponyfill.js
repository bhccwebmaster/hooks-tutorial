/**
 * @File JS File for the CSS Vars Ponyfill library
 */

 (function cssVarsPonyfillScript(Drupal) {
  Drupal.behaviors.cssVarsPonyfill = {
    attach: function() {
      cssVars({
        onlyLegacy: true,
      });
    }
  }
}(Drupal));