$(document).on('ready' , function(){
	$window = $(window);

	$('[data-type]').each(function() {
	  $(this).data('offsetY', parseInt($(this).attr('data-offsetY')));
	  $(this).data('speed', $(this).attr('data-speed'));
	});

	$('section[data-type="background"]').each(function(){

		var $self = $(this),
		    offsetCoords = $self.offset(),
		    topOffset = offsetCoords.top;

		$(window).scroll(function(){

		if ( ($window.scrollTop() + $window.height()) > (topOffset) &&
		( (topOffset + $self.height()) > $window.scrollTop() ) ) {

		  var yPos = -($window.scrollTop() / $self.data('speed'));

		  if ($self.data('offsetY')) {
		    yPos += $self.data('offsetY');
		  }

		  var coords = '50% '+ yPos + 'px';

		
		  $self.css({ backgroundPosition: coords })

		  }

		})
	}); 


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



})