(function($) {

    /**
     * Responsive tables.
     *
     * Loop through each table, then each header,
     *  find its text value and apply a
     *  data-label attribute to corresponding table items.
     *
     *  @param {jQuery} table
     *    Table jQuery element.
     */
    function responsiveTables(table) {
  
      // Only do this for tables in the body or explicitly class .table.
      if (table.closest('.layout-content').length > 0 || table.hasClass('table')) {
  
        // Set labels on responsive tables
        table.find('th').each(function(index, value) {
          var theTable = $(this).closest('.table, table');
          var theRow = index + 1;
          var theLabel = $(this).text();
          theTable.find('tr').find('td:nth-child('+theRow+')').attr('data-label', theLabel);
        });
  
        // Wrap table contents in a div.
        // Fix DRUP-1251.
        table.find('td').each(function(index, value) {
          $(this).wrapInner('<div></div>');
        });
      }
    }
  
    // For Drupal only.
    Drupal.behaviors.bhcc_responsive_table = {
      attach: function(context, settings) {
        $('.table, table', context).once('responsive-tables').each(function() {
          responsiveTables($(this));
        });
      }
    }
  
  }) (jQuery);