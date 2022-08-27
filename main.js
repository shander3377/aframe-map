var latitude, longitude, destination;

$(document).ready(function () {
	alert("Please allow the browser to know your location");
	initGeoLocation();
});
function initGeoLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success);
	} else {
		alert("Sorry! Your browser doesn't support geolcoation serices.");
	}
}
$(function () {
$("#navigate-button").click(function () {
	window.location.href = `ar_navigation.html?source=${latitude};${longitude}&destination=${destination.lat};${destination.lng}`;
});
})
function success(position) {
	console.log(position);
	longitude = position.coords.longitude;
	latitude = position.coords.latitude;

	mapboxgl.accessToken =
		"pk.eyJ1IjoicG9vamFjaGhpa2FyYWRhaGl5YSIsImEiOiJja25lZmJseGIwM3FuMnltZXEwODViZzlqIn0.0D5qwe7i_qXTqR193jgrGw";

	var map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		center: [latitude, longitude],
		zoom: 15,
	});

	map.addControl(
		new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: false,
			},
			trackUserLocation: true,
		})
	);

	map.addControl(
		new MapboxDirections({
			accessToken: mapboxgl.accessToken,
		}),
		"top-left"
	);

	map.on("click", function (e) {
		destination = e.lngLat;
		console.log(destination);
	});
}
