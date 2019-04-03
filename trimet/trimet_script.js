/**
 * Created by ashley on 3/29/17.
 */

// TRIMET API KEY: 823A27BED3E0A66DABBD63446
// GEOCODING API KEY: AIzaSyA28LpFT1-wDRuxm6BDHgOrQR_OqWHDLcU
// GOOGLE MAPS API KEY: AIzaSyChbXbkzaHalcSQKx6vLOXCBDHmLLFX8pg


$(document).ready(function(){

// Loads initial map
initMap();

// Adds multiple markers of bus stops nearby to map based on input
function addMarker(markers, latitude, longitude, info) {

    var map = new google.maps.Map(document.getElementById('googleMap'), {
      zoom: 16,
      // Centers map around latitude and longitude entered
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();


    var marker, i;

    // Loops through list of latitude and longitude to place markers
    for (i = 0; i < markers[0].length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(markers[0][i], markers[1][i]),
        map: map

      });

      google.maps.event.addListener(marker, 'click',(function(marker, i) {
        return function() {
          infowindow.setContent(info[i].toString());
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

        }


function getStops(latitude, longitude){
    $.ajax({
        type: 'GET',
        url: 'https://developer.trimet.org/ws/V1/stops?ll=' + longitude + ',' + latitude + '&meters=500&appID=823A27BED3E0A66DABBD63446&json=true',
        success: function(response) {
            var myLoc = response.resultSet.location;
            var lat = [];
            var lng = [];
            var markers = [];
            var info = [];
            $.each(myLoc, function (i) {
                // Add latitude to array
                lat.push(myLoc[i].lat);
                // Add longitude to array
                lng.push(myLoc[i].lng);
                info.push(myLoc[i].desc);
            });
            // Adds latitude and longitude to array
            markers.push(lat, lng);
            // Adds markers to map
            addMarker(markers, latitude, longitude, info);
            // Console logs latitude and longitude
            console.log(markers);
        },
        error: function () {
            alert('Error loading page request');
        }
    });
}



    $('#submit').on('click', function(){
        // Takes user input to get address
        var $address = $('#address').val();
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + $address + '&key=AIzaSyA28LpFT1-wDRuxm6BDHgOrQR_OqWHDLcU';
        $.ajax({
            type: 'GET',
            url: url,
            success: function(response){
                // Gets latitude and longitude
                var lat = response.results[0].geometry.location.lat;
                var long = response.results[0].geometry.location.lng;
                // Plugs latitude and longitude into function
                getStops(lat,long);
            }
        });
    });


});


function initMap() {
    // Shows map centered on Portland, OR
    var portland = {lat: 45.5231, lng: -122.6765};
    var map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 10,
        center: portland
    });
    var marker = new google.maps.Marker({
        position: portland,
        map: map

    });

}

