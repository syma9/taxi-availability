var xhr = new XMLHttpRequest();
var map = L.map('map').setView([1.35, 103.83], 13);
var hexLayer;
window.toggle = false;

L.tileLayer('http://maps-{s}.onemap.sg/v2/Grey/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://docs.onemap.sg/">OneMap</a>',
    maxZoom: 15,
    minZoom: 12,
}).addTo(map);

$.ajax({
  type: "GET",
  url: "https://api.data.gov.sg/v1/transport/taxi-availability",
  dataType: "json",
  beforeSend: function(xhr) {
        xhr.setRequestHeader("accept", "application/json")
     },
  success: result,
  error: function () {alert("Network error.");}
})

function result(data) {

	cabsArray = data["features"][0]["geometry"]["coordinates"];
	console.log(cabsArray[1]);
	for(var i in cabsArray) {
      var arrayflip = cabsArray[i][0];
	  cabsArray[i][0] = cabsArray[i][1];
      cabsArray[i][0] = arrayflip;
	}
	console.log(arrayflip);

	    var firefoxIcon = L.icon({
        iconUrl: 'marker.png',
        iconSize: [10, 10], // size of the icon
        });
	
		var markers = L.markerClusterGroup({ chunkedLoading: true });

		var markerList = [];

		//console.log('start creating markers: ' + window.performance.now());

		for (var i = 0; i < cabsArray.length; i++) {
			var a = cabsArray[i];
			var marker = L.marker(L.latLng(a[1], a[0]), {icon: firefoxIcon});
			markerList.push(marker);
		}
		//console.log('start clustering: ' + window.performance.now());

		markers.addLayers(markerList);
		map.addLayer(markers);

		//console.log('end clustering: ' + window.performance.now());


  if(data['features'] === undefined) { location.reload(); }

  var timedate1 = data["features"][0]["properties"]["timestamp"];
  var timedate2 = timedate1.replace('T','x').replace('+','x').split("x");
  var date = timedate2[0];
  var time = timedate2[1];

  document.getElementById("taxi-count").innerHTML = data["features"][0]["properties"]["taxi_count"];
  document.getElementById("date-count").innerHTML = date;
  document.getElementById("time-count").innerHTML = time;



};


