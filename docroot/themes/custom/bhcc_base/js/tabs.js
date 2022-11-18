/**
 * @File Contains tab switching functionality.
 */

(function($) {

  Drupal.behaviors.tabs = {
    attach: function attach() {

      $.fn.tabs = function(options) {

        const tabs = this;
        const tabControl = tabs.find(".tab-control li a");
        const hash = window.location.hash.substr(1);
        const hashElement = tabs.find('[id="' + hash + '"]');
        let tabToOpen;

        const settings = $.extend({
          prevNext: false,
          prevNextClass: '',
          prevText: 'Previous',
          prevClass: '',
          nextText: 'Next',
          nextClass: '',
          prevNextTitle: '',
          fadeEffect: true,
          fadeSpeed: 400,
          autoScroll: true,
          scrollSpeed: 200
        }, options);

        function _displayPrevNextControls() {

          const container = $('<div>', {
            class: [
              'margin-top-xx-large',
              'padding-top-large',
              'default-border-top',
            ].join(' ')
          }).append(
            $('<nav>', {
              class: [
                'tabs-prevnext',
                'lgd-row ' + settings.prevNextClass,
              ].join(' '),
              role: 'navigation'
            }).append([
              $('<div>', {
                class: [
                  'lgd-row__one-half',
                  'tabs-prevnext__prev',
                ].join(' ')
              }),
              $('<div>', {
                class: [
                  'lgd-row__one-half',
                  'tabs-prevnext__next',
                ].join(' ')
              })
            ])
          );

          $(this).append(container);

          let prevControl = $('<a>', {
              href: '#' + $(this).parent().prev().find(".js-bhcc-tab-content").attr('id'),
              class: [
                settings.prevClass,
                'block',
              ].join(' '),
            }
          ).append(
            $('<div>', {
              class: 'page-navigation__label',
              text: settings.prevText
            })
          ).append(
            $('<div>', {
              class: 'page-prevnext__text',
              text: $(this).parent().prev().find(settings.prevNextTitle).first().text()
            })
          );

          let nextControl = $('<a>', {
            href: '#' + $(this).parent().next().find(".js-bhcc-tab-content").attr('id'),
            class: settings.nextClass + ' block',
          }).append(
            $('<div>', {
              class: 'page-navigation__label',
              text: settings.nextText
            })
          ).append(
            $('<div>', {
              class: 'page-navigation__text',
              text: $(this).parent().next().find(settings.prevNextTitle).first().text()
            })
          );

          // Append Previous button to all tabs except the first
          tabs.find(".js-bhcc-tab-content:not(:first)").each(function() {
            $(this).find(".tabs-prevnext__prev").append(prevControl);
          });

          // Append Next button to all tabs except the first
          tabs.find(".js-bhcc-tab-content:not(:last)").each(function() {
            $(this).find(".tabs-prevnext__next").append(nextControl);
          });
        }

        function _prevNextClickAction() {

          // Remove active class and ARIA expanded attribute from active tab
          tabs.find(".is-active").removeClass("is-active");

          // Get the ID of the active panel
          const panelID = $(this).attr('href').substr(1);

          // Get the ID of the active tab from the active panel (this is needed if the user clicks on the Prev/Next buttons)
          const tabID = $('[id="' + panelID + '"]').attr('aria-labelledby');

          // Add active class and ARIA selected attribute to the new active tab
          $('[id="' + tabID + '"]').addClass("is-active").attr('aria-selected', 'true');

          // Hide all the panels
          tabs.find(".js-bhcc-tab-content").hide();

          // If the fade effect is switched on, fade in if not show
          if (settings.fadeEffect) {
            $('[id="' + panelID + '"]').fadeIn(settings.fadeSpeed).addClass('is-active');
          }
          else {
            $('[id="' + panelID + '"]').show().addClass('is-active');
          }
        }

        // Display Previous/Next controls if switched on
        if (settings.prevNext) {
          tabs.find(".js-bhcc-tab-content").each(_displayPrevNextControls);
        }

        // On page load, hide all panels except the first
        // (or the active tab if from a fragment link).
        // The format [id="#name"] is used as some heading begin with a number.
        if (hash && tabs.find('[id="' + hash + '"]').length > 0) {

          // As some html pages will link to inner tab content,
          // check that the link is in a tab, or find the closest.
          if (hashElement.hasClass('.js-bhcc-tab-content')) {
            tabToOpen = hash;
          } else {
            tabToOpen = hashElement.closest('.js-bhcc-tab-content').attr('id');
          }
          tabs.find('.js-bhcc-tab-content:not([id="' + tabToOpen + '"])').hide();
          tabs.find('[id="' + tabToOpen + '"]').addClass('is-active');
        } else {
          tabs.find(".js-bhcc-tab-content:not(:first)").hide();
          tabs.find(".js-bhcc-tab-content").first().addClass('is-active');
        }

        // Add ARIA labels to the tab list element
        tabs.find(".tab-control ul").attr('role', 'tablist');

        // Add ARIA labels to the tab and panel elements
        tabControl.each(function() {

          const href = $(this).attr('href');
          const hrefSlice = href.slice(1);
          const ctrlLabel = 'ctrl-' + hrefSlice;

          $(this).attr('id', ctrlLabel).attr('aria-controls', hrefSlice).attr('aria-selected', 'false').attr('role', 'tab');
          $(href).attr('role', 'tabpanel').attr('aria-labelledby', ctrlLabel);
        });

        // Add active class and ARIA selected attribute to open tab
        const activeTabId = tabs.find('.js-bhcc-tab-content.is-active').attr('id');
        tabs.find('#ctrl-' + activeTabId).addClass("is-active").attr('aria-selected', 'true');

        // Register click event either on the tab or the Prev/Next buttons.
        const prevNextControl = tabs.find('.tabs-prevnext a');
        $(tabControl).add(prevNextControl).click(_prevNextClickAction);

        // trigger default tab if in hash fragment.
        // As tab-- has now been prefixed, rewrite old fragment links.
        if (window.location.hash.slice(1)) {
          if (tabs.find('#ctrl-' + hash).length > 0) {
            tabs.find('#ctrl-' + hash).trigger('click');
          } else if (tabs.find('#ctrl-tab--' + hash).length > 0) {
            tabs.find('#ctrl-tab--' + hash).trigger('click');
          }
        }

      }
    }
  }

}) (jQuery);
