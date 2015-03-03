$(document).on('ready' , function(){
	function initialize() {
	  var mapOptions = {
	    zoom: 17,
	    center: new google.maps.LatLng($('#latitude'), $('#longitude'))
	  };

	  var map = new google.maps.Map(document.getElementById('map-canvas'),
	      mapOptions);

	  var marker = new google.maps.Marker({
	      position: new google.maps.LatLng($('#latitude'), $('#longitude')),
	      map: map,
	      title: '301 N. Canon'
	  });

	};


	google.maps.event.addDomListener(window, 'load', initialize)
})