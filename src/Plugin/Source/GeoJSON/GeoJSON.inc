<?php
/**
 * @file
 * Source: GeoJson.
 */

/**
 * Plugin definition.
 */
function openlayers_GeoJSON_openlayers_source() {
  return array(
    'handler' => array(
      'class' => '\\Drupal\\openlayers\\Source\\GeoJSON',
    ),
  );
}