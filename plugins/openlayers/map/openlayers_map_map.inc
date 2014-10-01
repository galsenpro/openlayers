<?php

function openlayers_openlayers_map_map_openlayers_map() {
  return array(
    'handler' => array(
      'class' => 'openlayers_map_map',
      'file' => 'openlayers_map_map.inc'
    )
  );
}

class openlayers_map_map extends openlayers_map {

  function options_form() {
    $form['ui'] = array(
      '#type' => 'fieldset',
      '#title' => t('Size of the map'),
      '#tree' => TRUE,
      'width' => array(
        '#type' => 'textfield',
        '#title' => 'Width',
        '#default_value' => $this->getOption('width', 'auto'),
        '#parents' => array('options', 'width'),
      ),
      'height' => array(
        '#type' => 'textfield',
        '#title' => 'height',
        '#default_value' => $this->getOption('height', '300px'),
        '#parents' => array('options', 'height'),
      ),
      'contextualLinks' => array(
        '#type' => 'checkbox',
        '#title' => 'Contextual links',
        '#description' => t('Enable contextual links on the map.'),
        '#default_value' => $this->getOption('contextualLinks', TRUE),
        '#parents' => array('options', 'contextualLinks'),
      ),
      'provideBlock' => array(
        '#type' => 'checkbox',
        '#title' => 'Provide Drupal block',
        '#description' => t('Enable this to enable a block to display the map.'),
        '#default_value' => $this->getOption('provideBlock', TRUE),
        '#parents' => array('options', 'provideBlock'),
      ),
    );

    $form['view'] = array(
      '#type' => 'fieldset',
      '#title' => t('View: center and rotation'),
      '#tree' => TRUE,
    );

    if ($this->machine_name != 'map_view_edit_form') {
      $map = openlayers_object_load('map', 'map_view_edit_form');
      if ($view = $this->getOption('view')) {
        $map->setOption('view', $view);
      }

      $form['view']['map'] = array(
        '#title' => 'Map',
        '#markup' => openlayers_render_map($map),
      );
    }

    $form['view']['center'] = array(
      '#tree' => TRUE,
      'lat' => array(
        '#type' => 'textfield',
        '#title' => 'Latitude',
        '#default_value' => $this->getOption(array('view', 'center', 'lat'), 0),
      ),
      'lon' => array(
        '#type' => 'textfield',
        '#title' => 'Longitude',
        '#default_value' => $this->getOption(array('view', 'center', 'lat'), 0),
      )
    );
    $form['view']['rotation'] = array(
      '#type' => 'textfield',
      '#title' => 'Rotation',
      '#default_value' => $this->getOption(array('view', 'rotation'), 0),
    );
    $form['view']['zoom'] = array(
      '#type' => 'textfield',
      '#title' => 'Zoom',
      '#default_value' => $this->getOption(array('view', 'zoom'), 0),
    );
    $form['view']['minZoom'] = array(
      '#type' => 'textfield',
      '#title' => 'Min zoom',
      '#default_value' => $this->getOption(array('view', 'minZoom'), 0),
    );
    $form['view']['maxZoom'] = array(
      '#type' => 'textfield',
      '#title' => 'Max zoom',
      '#default_value' => $this->getOption(array('view', 'maxZoom'), 0),
    );

    return $form;
  }

  function attached() {
    $attached = parent::attached();
    $attached['libraries_load'][] = array('openlayers3');
    return $attached;
  }
}