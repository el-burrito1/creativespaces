$(document).on('ready' , function(){

	// $('.searchColumn').height(($('.resultsList').length)*55) 
	// $('#mainContain').height(690 + (($('.resultAdd').length)*200))

	function initialize() {
	  var mapOptions = {
	    zoom: 18,
	    center: new google.maps.LatLng(34.073603, -118.403993)
	  };

	  var map = new google.maps.Map(document.getElementById('map-canvas'),
	      mapOptions);

	  var marker = new google.maps.Marker({
	      position: new google.maps.LatLng(34.073603, -118.403993),
	      map: map,
	      title: '301 N. Canon'
	  });

	};


	google.maps.event.addDomListener(window, 'load', initialize)

	$('.thumb').on('click' , function(){
		$('.carousel').carousel($(this).data('carousel-number'))
	})

	// function loadStyleSheet(src)
	//     if (document.createStyleSheet){
	//         document.createStyleSheet(src);
	//     }
	//     else {
	//         $("head").append($("<link rel='stylesheet' href='"+src+"' type='text/css' media='screen' />"));
	//     }
	// );

	// loadStyleSheet('/stylesheets/style.css')

})
