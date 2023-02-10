<?php

use Drupal\views\ViewExecutable;

/**
 * Implements hook_views_pre_render().
 */
function hooks_tutorial_views_pre_render(ViewExecutable $view) {
  $user = \Drupal::currentUser();
  $view_id = $view->id();
}