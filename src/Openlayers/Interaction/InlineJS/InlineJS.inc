<?php
/**
 * @file
 * Interaction: InlineJS.
 */

/**
 * Plugin definition.
 */
function openlayers_InlineJS_openlayers_interaction() {
  return array(
    'handler' => array(
      'class' => '\\Drupal\\openlayers\\Interaction\\InlineJS',
    ),
  );
}