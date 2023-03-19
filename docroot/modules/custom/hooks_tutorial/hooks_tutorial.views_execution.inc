<?php

// Views hooks
// @See https://api.drupal.org/api/drupal/core%21modules%21views%21views.api.php/9

use Drupal\views\ViewExecutable;

/**
 * Implements hook_views_pre_render().
 */
function hooks_tutorial_views_pre_render(ViewExecutable $view) {
  $view_id = $view->id();

  $restricted = [
    '#type' => 'html_tag',
    '#tag' => 'div',
    '#value' => t('This article is restricted.'),
    '#attributes' => [
      'class' => [
        'alert',
        'bhcc-alert',
        'bhcc-alert-info',
      ],
    ],
  ];

  if ($view_id == 'news') {
    foreach($view->result as $key => $result) {
      // dpm(array_keys((array)$result));
      if (!$result->_entity->access('view')) {
        $view->result[$key]->build = $restricted;
        // $view->result->{$key} = $restricted;
      }
    }
  }
}
