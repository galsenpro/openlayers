Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Control.internal.Rotate',
  init: function(data) {
    return new ol.control.Rotate(data.opt);
  }
});
