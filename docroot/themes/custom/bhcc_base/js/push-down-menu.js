/**
 * @File JS File for the Push down menu component
 */

 (function($) {

  /**
	 * Check Key pressed is Tab Key
	 * @param  {Event}  e jQuery keypress event
	 * @return {Boolean}  True when is tab key.
	 */
	function isKeyTabKey(e) {
		var keyCode = e.keyCode || e.which;
		return keyCode === 9 ? true : false;
	}

  /**
	 * Check Key pressed is Enter Key
   * 
	 * @param  {Event}  e jQuery keypress event
	 * @return {Boolean}  True when is tab key.
	 */
	function isKeyEnterKey(e) {
		var keyCode = e.keyCode || e.which;
		return keyCode === 13 ? true : false;
	}

  /**
   * Add top nav keyboard accessbility
   * 
   * @param {jQuery} push_down_menu The push down menu element container.
   */
  function menu_tab_accessibility(push_down_menu) {

    // Keyboard tabbing accessibility.

    push_down_menu.find('.js-menu__services-links__link').keydown(function(e) {

      // If enter key, trigger click.
      // Needed as sometimes the links are spans not anchor tags.
      if (isKeyEnterKey(e)) {
        $(this).trigger('click');
      }

      // Forward tab, if open go to first child item.
      if ($(this).hasClass('active') && isKeyTabKey(e) && !e.shiftKey) {
        e.preventDefault();
        $('#push-menu').find('a').first().focus();
      }

      // Reverse tab on main menu, focus on the last push down menu item 
      // if the preceeding menu link has children and is open.
      var preceeding_link_open = $(this).closest('.menu__services-links').prev().find('.js-menu__services-links__link--has-children.active').length;
      if (isKeyTabKey(e) && e.shiftKey && preceeding_link_open) {
        $('#push-menu').find('a').last().focus();
        e.preventDefault();
      }
    });

    // Reverse tabbing on the search input, focus on the last push down 
    // menu item if the preceeding menu link has children and is oepn.
    $('.header-search__desktop input[type="search"]').keydown(function(e) {
      var last_link_open = push_down_menu.find('.menu-level-1 > .menu__services-links').last().find('.js-menu__services-links__link--has-children.active').length;
      if (isKeyTabKey(e) && e.shiftKey && last_link_open) {
        $('#push-menu').find('a').last().focus();
        e.preventDefault();
      }
    });
  }

  /**
   * Push down menu keyboard accessbility
   * 
   * Required here as menu gets cloned on each push down.
   * @param {jQuery} push_down_menu The push down menu element container.
   */
  function push_menu_tab_accessibility(push_down_menu) {

    // When child item focus, make all child items focusable. 
    $('#push-menu').find('a').focus(function(e) {
      $('#push-menu').find('a').attr('tabindex', '0');
    });

    // When child item loses focus, 
    // prevent all child items being focusable.
    $('#push-menu').find('a').blur(function(e) {
      $('#push-menu').find('a').attr('tabindex', '-1');
    });

    // Reverse tab off first child, go to the parent menu item.
    $('#push-menu').find('a').first().keydown(function(e) {
      if (isKeyTabKey(e) && e.shiftKey) {
        push_down_menu.find('.active').focus();
        e.preventDefault();
      }
    });

    // Forward tab off last child, go to the next focusable item.
    $('#push-menu').find('a').last().keydown(function(e) {
      if (isKeyTabKey(e) && !e.shiftKey) {
        push_down_menu.find('.active').focus();
      }
    });
  }

  /**
   * Toggle the push down menu
   * 
   * @param {jQuery} push_down_menu The push down menu element container.
   * @param {jQuery} new_menu_element A new menu element to be opened.
   */
  function swap_push_down_menu(push_down_menu, new_menu_element) {
    $("#push-menu .page-container").slideUp(200, function() {
      $(this).find('.menu-level-2').remove();
      if (typeof new_menu_element !== 'undefined') {
        open_push_down_menu(push_down_menu, new_menu_element);
      }
    });

  }

  /**
   * Open the push down menu
   * 
   * @param {jQuery} push_down_menu The push down menu element container.
   * @param {jQuery} new_menu_element A new menu element to be opened.
   */
  function open_push_down_menu(push_down_menu, new_menu_element) {
    new_menu_element.clone()
      .appendTo("#push-menu .page-container")
      .addClass("active")
      .closest('.page-container')
      .slideDown(200)
      .find('a').attr('tabindex', '-1')
    push_menu_tab_accessibility(push_down_menu);
  }

  Drupal.behaviors.push_down_menu = {
    attach: function(context) {
      $('#header-menu__services .js-push-down-menu', context).once('init-push-down-menu').each(function() {

        //FD Note: I changed the behaviour here from hover to click.

        // Things to be awear of if using this push menu,
        // 1. its clones the sub-menus .menu-level-2 and append them to a container which it's self is injected with js.
        // SEO - http://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157

        // inject this html elements to prepare for push-down-menu
        $(".page-header").append('<div id="push-menu" class="push-menu"><div class="page-container"></div></div>');
        $('#push-menu .page-container').hide();
        var push_down_menu = $(this);

        // Add keyboard tabbing.
        menu_tab_accessibility(push_down_menu);

        // Click function on top-level menu items does all the work
        push_down_menu.find(".menu-level-1 > li > .js-menu__services-links__link--has-children").on("click", function () {
          if ($(this).hasClass("active")) {

            // if the menu is already open or active do this
            push_down_menu.find(".menu-level-1 > li > .js-menu__services-links__link--has-children").not(this).removeClass("active");
            $(this).removeClass("active");

            // Close the push down menu (dont send a new menu to open).
            swap_push_down_menu(push_down_menu);
          } else {

            // else do this if the menus are all is closed with none active
            push_down_menu.find(".menu-level-1 > li > .js-menu__services-links__link--has-children").not(this).removeClass("active");
            $(this).addClass("active");

            // Get the new menu element.
            new_menu_element = $(this).parent().children(".menu-level-2");

            // If there is already a menu open, swap it, else open.
            if ($('#push-menu .page-container').children().length > 0) {
              swap_push_down_menu(push_down_menu, new_menu_element);
            } else {
              open_push_down_menu(push_down_menu, new_menu_element);
            }

          }

        });

      });
    }
  }

}) (jQuery);