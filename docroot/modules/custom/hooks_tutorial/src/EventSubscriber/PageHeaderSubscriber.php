<?php

namespace Drupal\hooks_tutorial\EventSubscriber;

use Drupal\node\Entity\Node;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\localgov_core\Event\PageHeaderDisplayEvent;

/**
 * Set page title.
 *
 * @package Drupal\hooks_tutorial\EventSubscriber
 */
class PageHeaderSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      PageHeaderDisplayEvent::EVENT_NAME => ['setPageHeader', 0],
    ];
  }

  /**
   * Set page title and lede.
   */
  public function setPageHeader(PageHeaderDisplayEvent $event) {
    if ($event->getEntity() instanceof Node &&
      $event->getEntity()->bundle() == 'news_article'
    ) {
      $event->setLede('Here is some news!');
    }

    // if (!$event->getEntity()) {
    //   $event->setVisibility(FALSE);
    // }
  }

}