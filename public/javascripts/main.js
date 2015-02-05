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

	$('#emailForm').on('submit' , function(e){
		e.preventDefault()
		// console.log($(this).serialize())
		var contactInfo = $(this).serialize()
		console.log(contactInfo)
		$.ajax({
			type: 'POST',
			url : '/email',
			data: contactInfo,
			success : console.log('success')
		})

	})


})
