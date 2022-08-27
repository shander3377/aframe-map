let coords = {};
$(document).ready(function () {
	getCoords();
	renderElement();
});
function getCoords() {
	var searchParam = new URLSearchParams(window.location.search);
	console.log(searchParam);
	if (searchParam.has("source") && searchParam.has("destination")) {
		var source = searchParam.get("source");
		var destination = searchParam.get("destination");

		coords.source_lat = source.split(";")[0];
		coords.source_long = source.split(";")[1];
		coords.destination_lat = destination.split(";")[0];
		coords.destination_long = destination.split(";")[1];
		console.log(coords);
	} else {
		alert("Please provide the coordinations");
		window.history.back();
	}
}
function renderElement() {
	$.ajax({
		url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coords.source_long}%2C${coords.source_lat}%3B${coords.destination_long}%2C${coords.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
		type: "get",
		success: function (response) {
			console.log(response);
			var imgObj = {
				turn_right: "ar_right.png",
				turn_left: "ar_left.png",
				slight_right: "ar_slight_right.png",
				slight_left: "ar_slight_left.png",
				straight: "ar_straight.png",
				start: "ar_start.png",
			};
			var steps = response.routes[0].legs[0].steps;

			for (var i = 0; i < steps.length; i++) {
				var img;
				var distance = steps[i].distance;
				var instruction = steps[i].maneuver.instruction;

				if (instruction.includes("Turn right")) {
					img = "turn_right";
				} else if (instruction.includes("Turn left")) {
					img = "turn_left";
				}
				if (i > 0) {
					$("#scene_container").append(
						`
<a-entity gps-entity-place="latitude: ${
							steps[i].maneuver.location[1]
						}; longitude:  ${steps[i].maneuver.location[0]};">
<a-image name="${instruction}" src="./assets/${imgObj[img]}" look-at="#step_${
							i - 1
						}" scale="5 5 5" id="step_${i}" position="0 0 0">
</a-image>
<a-entity>
<a-text height="50" value="${instruction} (${distance}m)" >
</a-text>
</a-entity>
</a-entity>

`
					);
				} else {
					$("#scene_container").append(
						`
<a-entity gps-entity-place="latitude: ${
							steps[i].maneuver.location[1]
						}; longitude:  ${steps[i].maneuver.location[0]};">
<a-image name="${instruction}" src="./assets/ar_start.png" look-at="#step_${
							i + 1
						}" scale="5 5 5" id="step_${i}" position="0 0 0">
</a-image>
<a-entity>
<a-text height="50" value="${instruction} (${distance}m)" >
</a-text>
</a-entity>
</a-entity>

`
					);
				}
			}
		},
	});
}
