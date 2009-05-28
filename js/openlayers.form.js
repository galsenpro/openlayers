// $Id$

/**
 * @file
 * This file holds the javascript functions for the settings forms.
 *
 * @ingroup openlayers
 */
 
/**
 * When document is ready for JS
 */
$(document).ready(function() {
  // @@TODO: Namespace this using the form ID
  // @@BUG:  Maps will not display inside fieldsets that are collapsed by default
  
  // Hide the textfield form
  $('.openlayers-form-projection').parent().css('display','none');
  
  var trueProjection = $('.openlayers-form-projection').val();
  var radioSelected = false;
  
  // Go through each radio projection option
  $('.openlayers-form-easy-projection input').each(function() {
    
    // If it matches the true projection, then select it. 
    if ($(this).val() == trueProjection) {
      $(this).attr('checked','checked');
      $('.openlayers-form-projection').parent().css('display','none');
      radioSelected = true;
    }
    
    // Attach events to the projection radio buttons
    $(this).change(function() {
      var projection = $(this).val();
      if (projection == 'other') {
        $('.openlayers-form-projection').parent().css('display','block');
      }
      else{
        $('.openlayers-form-projection').parent().css('display','none');
        $('.openlayers-form-projection').val(projection);
        
        // If we are using a web spherical-mercador projection, set the MaxResolution and MaxExtent (If they are not already set)
        OL.webSpericalMercadorAutoSettings();
        
        // Update our selectable layers
        OL.updateSelectableLayers(projection);
      }
    });
    
    // If no radio has been selected, select "other"
    if (radioSelected == false) {
      // @@TODO: use class to do this
      $('#edit-easy-projection-other').attr('checked', 'checked');
      $('.openlayers-form-projection').parent().css('display','block');
    }
  });
  
  // Center and zoom for zoom / center helper
  $('openlayers-form-lat').change(OL.updateHelpmapCenter);
  $('openlayers-form-lon').change(OL.updateHelpmapCenter);
  $('openlayers-form-zoom').change(OL.updateHelpmapCenter);
  OL.updateHelpmapCenter();
  
  // Set up the manual projection input so that layers will filter.
  $('.openlayers-form-projection').change(function() {
    OL.updateSelectableLayers(false);
  });
  
  // Do an initial filter of the available layers
  OL.updateSelectableLayers(trueProjection);
  
});


/**
 * Auto Set parameters for web spherical mercador
 *
 * Web spherical mercador (projection 900913 used for Google, Yahoo etc.)
 * require very specific Max Extent and Max Resolution. We auto set and
 * unset these parameters here.
 *
 */
OL.webSpericalMercadorAutoSettings = function(){  
  // If the projection matches, we should potentially set max extent and max resolution.
  var projection = $('.openlayers-form-projection').val();
  if (projection == '900913' || projection == '3785') {
    var maxResolutionSet = false;
    var maxExtentSet = false;
    
    // Checking to see if we should automatically set the maximum Resolution
    if ($('.openlayers-form-maxResolution').val() == '') {
      $('.openlayers-form-maxResolution').val('156543.0339');
      maxResolutionSet = true;
    }
    
    // Checking to see if we should automatically set the maximum Extent
    if ($('.openlayers-form-maxExtent-left').val() == '' && $('.openlayers-form-maxExtent-right').val() == '' && $('.openlayers-form-maxExtent-bottom').val() == '' && $('.openlayers-form-maxExtent-top').val() == ''){
      $('.openlayers-form-maxExtent-left').val('-20037508.34');
      $('.openlayers-form-maxExtent-right').val('20037508.34');
      $('.openlayers-form-maxExtent-bottom').val('-20037508.34');
      $('.openlayers-form-maxExtent-top').val('20037508.34');
      maxExtentSet = true;
    }
    
    // Letting the user know we did some automatic changes
    if (maxResolutionSet && maxExtentSet) {
      $('#openlayers-form-proj-msg').html("Maximum Resolution and Maximum Extent have automatically been set for this projection.").show("slow");
      setTimeout("$('#openlayers-form-proj-msg').hide('fast');",3000);
    }
    if (maxResolutionSet && !maxExtentSet) {
      $('#openlayers-form-proj-msg').html("Maximum Resolution has automatically been set for this projection.").show("slow");
      setTimeout("$('#openlayers-form-proj-msg').hide('fast');",3000);
    }
    if (!maxResolutionSet && maxExtentSet) {
      $('#openlayers-form-proj-msg').html("Maximum Extent has automatically been set for this projection.").show("slow");
      setTimeout("$('#openlayers-form-proj-msg').hide('fast');",3000);
    }
  }
  
  // If the projection does not match, we should potentially unset max extent and max resolution.
  if (projection != '900913'&& projection != '3785') {
    var maxResolutionUnset = false;
    var maxExtentUnset = false;
    
    // Checking to see if we should automatically unset the maximum Resolution
    if ($('.openlayers-form-maxResolution').val() == '156543.0339'){
     $('.openlayers-form-maxResolution').val('');
     maxResolutionUnset = true;
    }
    
    // Checking to see if we should automatically set the maximum Extent
    if ($('.openlayers-form-maxExtent-left').val() == '-20037508.34' && $('.openlayers-form-maxExtent-right').val() == '20037508.34' && $('.openlayers-form-maxExtent-bottom').val() == '-20037508.34' && $('.openlayers-form-maxExtent-top').val() == '20037508.34') {
      $('.openlayers-form-maxExtent-left').val('');
      $('.openlayers-form-maxExtent-right').val('');
      $('.openlayers-form-maxExtent-bottom').val('');
      $('.openlayers-form-maxExtent-top').val('');
      maxExtentUnset = true;
    }
    
    // Letting the user know we did some automatic changes
    if (maxResolutionUnset && maxExtentUnset) {
      $('#openlayers-form-proj-msg').html("Maximum Resolution and Maximum Extent have automatically been unset.").show("slow");
      setTimeout("$('#openlayers-form-proj-msg').hide('fast');",3000);
    }
    if (maxResolutionUnset && !maxExtentUnset) {
      $('#openlayers-form-proj-msg').html("Maximum Resolution has automatically been unset.").show("slow");
      setTimeout("$('#openlayers-form-proj-msg').hide('fast');",3000);
    }
    if (!maxResolutionUnset && maxExtentUnset) {
      $('#openlayers-form-proj-msg').html("Maximum Extent has automatically been unset.").show("slow");
      setTimeout("$('#openlayers-form-proj-msg').hide('fast');",3000);
    }
  }
  
}

/**
 * Update the layers that are presented to the user
 *
 * Only certain layers and compatable with certain projections.
 * When the user selects a projection, this function is fired
 * and the layer list is filtered.
 *
 * @param projection
 *   Projection to filter on.
 */
OL.updateSelectableLayers = function(projection) {
  if (projection){
    $('input.openlayers-form-baselayers').each(function() {
      OL.layerCheckProjection(projection, this);
    });
    
    $('input.openlayers-form-default-layer').each(function() {
      OL.layerCheckProjection(projection, this);
    });
    
    $('input.openlayers-form-overlays').each(function() {
      OL.layerCheckProjection(projection, this);
    });
  }
  else {
    // No projection specified. Assume the user knows what they are doing and show all layers. 
    $('input.openlayers-form-baselayers').each(function() {
      $(this).parent().parent().css('display','block');
    });
    
    $('input.openlayers-form-default-layer').each(function() {
       $(this).parent().parent().css('display','block');
    });
    
    $('input.openlayers-form-overlays').each(function() {
       $(this).parent().parent().css('display','block');
    });
  }
}

/**
 * Check projection for a given radio and checkbox.
 *
 * Given a projection and a DOM Element, look up the projection
 * and see if the element's value (layer ID) is listed as compatable
 * for that projection.
 *
 * @param projection
 *   Projection to filter on.
 * @param domInputObject
 *   Checkbox or radio DOM element to check.
 */
OL.layerCheckProjection = function(projection, domInputObject) {
  $(domInputObject).parent().parent().css('display','none');
 
  var projectionMatch = false
  for (var l in Drupal.settings.openlayersForm.projectionLayers[projection]) {
    if ($(domInputObject).val() == Drupal.settings.openlayersForm.projectionLayers[projection][l]) {
      projectionMatch = true;
    }
  }
  
  if (projectionMatch){
    $(domInputObject).parent().parent().css('display','block');
  }
  else{
    $(domInputObject).removeAttr('checked');
  }
}

/**
 * Update the center of the helpmap using the values from the form
 *
 * Take the center lat, lon and zoom values from the form and update
 * the helper map.
 */
OL.updateHelpmapCenter = function() {
  var projection = $('.openlayers-form-projection').val();
  var zoom = $('.openlayers-form-zoom').val();
  var lat = $('.openlayers-form-lat').val();
  var lon = $('.openlayers-form-lon').val();
  
  if (lat != '' && lon != '') {
    var center = new OpenLayers.LonLat(lon, lat);
    center.transform(new OpenLayers.Projection('EPSG:' + projection), new OpenLayers.Projection('EPSG:4326'));
    
    OL.maps['openlayers-center-helpmap'].map.setCenter(center, zoom);  
  }
}

/**
 * Update the values from the form using center of the helpmap.
 *
 * When a user pans and zooms our helper map, update the form values.
 */
OL.updateCenterFormValues = function() {
  var helpmap = OL.maps['openlayers-center-helpmap'].map;
  var projection = $('.openlayers-form-projection').val();
  var zoom = helpmap.getZoom();
  
  var center = helpmap.getCenter();
  center.transform(new OpenLayers.Projection('EPSG:4326'),new OpenLayers.Projection('EPSG:' + projection));
  
  var lat = center.lat;
  var lon = center.lon;
  
  $('.openlayers-form-zoom').val(zoom);
  $('.openlayers-form-lat').val(lat);
  $('.openlayers-form-lon').val(lon);
}