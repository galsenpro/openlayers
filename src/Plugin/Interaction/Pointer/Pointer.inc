<?php
/**
 * @file
 * Interaction: Pointer.
 */

/**
 * Plugin definition.
 */
function openlayers_Pointer_openlayers_interaction() {
  return array(
    'handler' => array(
      'class' => '\\Drupal\\openlayers\\Interaction\\Pointer',
    ),
  );
}