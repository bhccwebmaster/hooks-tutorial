/**
 * Reflow tab order on homepage icons
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
	 * @param  {Event}  e jQuery keypress event
	 * @return {Boolean} True when is enter key
	 */
	function isKeyEnterKey(e) {
		var keyCode = e.keyCode || e.which;
		return keyCode === 13 ? true : false;
	}

	$(document).ready(function() {

		/**
		 * Mark service icons visiblity
		 * @param  {jQuery} servicesFeature Service Icons container jQuery Object
		 */
		function servicesIconsVisibility(servicesFeature) {
			// Get the stage and left / right positions.
			var stage = servicesFeature.find('.owl-stage');
			var stageWidth = servicesFeature.width();
			var stageLeft = 0 - stage.position().left;
			var stageRight = stageLeft + stageWidth;
			
			// For each column in the carousel. 
			servicesFeature.find('.owl-item').each(function() {
				var itemWidth = $(this).width();
				var itemLeft = $(this).position().left;
				var itemRight = itemLeft + itemWidth;
				
				// If visible, mark as visible, else mark it to be skipped over.
				if (stageLeft <= itemLeft && stageRight >= itemRight - 0.5) {
					$(this).addClass('item-visible');
					$(this).find('a').attr('tabindex', '0');
					$(this).find('a').removeAttr('aria-hidden');
				} else {
					$(this).removeClass('item-visible');
					$(this).find('a').attr('tabindex', '-1');
					$(this).find('a').attr('aria-hidden', 'true');
				}
			});
		}

		/**
		 * Enable tabbing over service icons
		 *
		 * Run after Owl Carousel has been initialized
		 * @todo   only works with 2 rows, needs refactor if adding extra rows
		 * @param  {jQuery} servicesFeature Service Icons container jQuery Object
		 */
		function servicesTabbing(servicesFeature) {

			// find the first and last services column (so tabbing knows when to loop)
			var firstServicesContainer = servicesFeature.find('.owl-item.item-visible').first();
			var lastServicesContainer = servicesFeature.find('.owl-item.item-visible').last();

			// find each services block (that contains the icon and the link)
			servicesFeature.find('.services--feature-block').each(function() {

				// Get previous and next container blocks - these will be owl carousel markup
				var prevServicesContainer = $(this).closest('.owl-item').prev('.owl-item.item-visible');
				var nextServicesContainer = $(this).closest('.owl-item').next('.owl-item.item-visible');
				
				// First dot.
				var firstDot = servicesFeature.find('.owl-dots .owl-dot:visible').first();

				// Key press event on the anchor
				$(this).find('a').off('keydown');
				$(this).find('a').keydown(function(e) {

					// forward tabbing
					if (!e.shiftKey && isKeyTabKey(e)) {

						// If this is the first link in the column, first try to to the first link in next column,
						// if there is no next column, wrap around the the bottom link in the first column
            var itemsInCol = $(this).closest('.owl-item').find('.services--feature-block').length;
            var itemsInNextCol = nextServicesContainer.find('.services--feature-block').length;
            if ($(this).closest('.services--feature-block').next().length > 0) {
							if (nextServicesContainer.length > 0) {
								// Go to first item in next coloumn.
								nextServicesContainer.find('.services--feature-block:first-child a').focus();
							} else {
								// Go to the last item in the first column.
								firstServicesContainer.find('.services--feature-block:last-child a').focus();
							}
							e.preventDefault();

						// if this is the last link in the column, move to the last link in next column if it exists.
						// if it does not, resume normal tabbing order.
            } else if (nextServicesContainer.length > 0 && itemsInNextCol >= 2) {
							// Go to last item in the next column.
							nextServicesContainer.find('.services--feature-block:last-child a').focus();
							e.preventDefault();
						} else if (itemsInCol <= 1) {
							// Go to the last item in the first container.
              firstServicesContainer.find('.services--feature-block:last-child a').focus();
							e.preventDefault();
						} else if (itemsInNextCol <= 1 && firstDot.length > 0) {
							// Skip to dots.
              servicesFeature.find('.owl-dots .owl-dot').first().focus();
              e.preventDefault();
            }
					}

					// reverse tabbing
					if (e.shiftKey && isKeyTabKey(e)) {

						// if this is the first link in the column, check that there is a previous column and focus on the first link
						// else do not interupt normal tabbing flow
						if ($(this).closest('.services--feature-block').prev().length === 0) {
							if (prevServicesContainer.length > 0) {
								prevServicesContainer.find('.services--feature-block:first-child a').focus();
								e.preventDefault();
							}

						// if this is the bottom link in the column, go to the previous column if it exits,
						// else wrap arpund to the first link in the last column
						} else {
							if (prevServicesContainer.length > 0) {
								prevServicesContainer.find('.services--feature-block:last-child a').focus();
							} else {
								lastServicesContainer.find('.services--feature-block:first-child a').focus();
							}
							e.preventDefault();
						}

					}

				}); // End keydown event

			}); // End each .services--feature-block loop
		}

		/**
		 * Focus dots control key bindings
		 *
		 * Added as variable to allow it to be selectivly bound / unbound.
		 * @param  {Event}  e jQuery keypress event
		 */
		var focusControl = function(e) {
			var servicesFeature = $(this).closest('.services--feature');
			
			/**
			 * Callback for focus on carosel after enter key.
			 * @param  {Event}  e jQuery keypress event
			 */
			var focusServicesCallback = function(e) {
				$(this).find('.owl-item.item-visible a').first().focus();
				$(this).unbind('translated.owl.carousel', focusServicesCallback);
			};
			if (isKeyEnterKey(e)) {
				servicesFeature.bind('translated.owl.carousel', focusServicesCallback);
			}
      if ($(this).prev('.owl-dot').length <= 0 && e.shiftKey && isKeyTabKey(e)) {
        servicesFeature.find('.owl-item.item-visible .services--feature-block + .services--feature-block').last().find('a').focus();
				e.preventDefault();
      }
		};

		/**
		 * Services carousel pager buttons setup.
		 * @param  {jQuery} servicesFeature Service Icons container jQuery Object
		 */
		function servicesCarouselPagerButtons(servicesFeature) {
			var dots = servicesFeature.find('.owl-dot');
			dots.each(function(i) {
				var page = i + 1
				var ariaLabel = 'Action links page ' + page + '.';
				if ($(this).hasClass('active')) {
					ariaLabel += ' Active page.';
				} else {
					ariaLabel = 'Go to ' + ariaLabel;
				}
				$(this).attr('aria-label', ariaLabel);
				$(this).html('<span aria-hidden="true"></span>');

				$(this).unbind('keydown', focusControl);
				$(this).bind('keydown', focusControl);
			});
		}

		// Wait until owl carousel is initialized before 'fixing' the tabbing.
		$('.services--feature').each(function() {
			var servicesFeature = $(this);
			// After initialisation.
			$(this).on('initialized.owl.carousel', function(e) {
				servicesIconsVisibility(servicesFeature);
				servicesTabbing(servicesFeature);
				// Have to wait before scripting the dots.
				window.setTimeout(function() {
					servicesCarouselPagerButtons(servicesFeature);
				}, 100);
			});
			// After carousel resized.
			$(this).on('resized.owl.carousel', function(e) {
				servicesIconsVisibility(servicesFeature);
				servicesCarouselPagerButtons(servicesFeature);
				servicesTabbing(servicesFeature);
			});
			// As carousel slides.
			$(this).on('translate.owl.carousel', function(e) {
				servicesCarouselPagerButtons(servicesFeature);
			});
			// After carousel slides.
			$(this).on('translated.owl.carousel', function(e) {
				servicesIconsVisibility(servicesFeature);
				servicesTabbing(servicesFeature);
			});
		});

		/* Owl Carousel */
		$(document).ready(function(){
      $(".owl-carousel").owlCarousel({
        responsive : {
          // breakpoint from 0 up
          0 : {
            items : 1
          },
          // breakpoint from 540 up
          540 : {
            items : 2
          },
          // breakpoint from 768 up
          768 : {
            items : 3
          },
          // breakpoint from 992 up
          992 : {
            items : 4
          }
        }
      });
    });

	});

}) (jQuery);
