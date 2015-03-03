$(document).on('ready' , function(){

	// function initialize() {
	//   var mapOptions = {
	//     zoom: 17,
	//     center: new google.maps.LatLng($('#latitude'), $('#longitude'))
	//   };

	//   var map = new google.maps.Map(document.getElementById('map-canvas'),
	//       mapOptions);

	//   var marker = new google.maps.Marker({
	//       position: new google.maps.LatLng($('#latitude'), $('#longitude')),
	//       map: map,
	//       title: '301 N. Canon'
	//   });

	// };


	// google.maps.event.addDomListener(window, 'load', initialize)

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

		$(this)[0].reset()

	})

	$('#resultForm').on('submit' , function(e){
		e.preventDefault()
		var resultData = $(this).serialize()
		$.ajax({
			type: 'POST',
			url:  '/createresult',
			data: resultData,
			success : function(){console.log('result created')}
		})
		$(this)[0].reset()
	})

	$('#listingForm').on('submit' , function(e){
		e.preventDefault()
		var listingData = $(this).serialize()
		$.ajax({
			type: 'POST',
			url:  '/createlisting',
			data: listingData,
			success : function(){console.log('listing created')}
		})
		$(this)[0].reset()
	})

	var photoLength = parseFloat($('#photosLength').text())
	console.log(photoLength)

	if($('#photosLength').text() > 4){
		console.log('yew')
		$('#photo-container-height-adjust').css('height' , '508px')
	}

	console.log($('#photosLength').text())
	
})
