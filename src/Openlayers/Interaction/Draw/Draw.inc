<?php
/**
 * @file
 * Interaction: Draw.
 */

/**
 * Plugin definition.
 */
function openlayers_Draw_openlayers_interaction() {
  return array(
    'handler' => array(
      'class' => '\\Drupal\\openlayers\\Interaction\\Draw',
    ),
  );
}