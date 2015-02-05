$(document).on('ready' , function(){

	// $('.searchColumn').height(($('.resultsList').length)*55) 
	// $('#mainContain').height(690 + (($('.resultAdd').length)*200))


	function initialize() {
	  var mapOptions = {
	    zoom: 17,
	    center: new google.maps.LatLng(33.977509, -118.425329)
	  };

	  var map = new google.maps.Map(document.getElementById('map-canvas'),
	      mapOptions);

	  var marker = new google.maps.Marker({
	      position: new google.maps.LatLng(33.977509, -118.425329),
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
		$('#spinner').addClass('fa fa-spinner fa-spin')
		var contactInfo = $(this).serialize()
		console.log(contactInfo)

		var success = function(){
			setTimeout(function(){
				$('#button').text('Thanks!')
			},1000)
		}

		$.ajax({
			type: 'POST',
			url : '/email',
			data: contactInfo,
			success : success()
		})

	})


})
