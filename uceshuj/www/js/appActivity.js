function menuClicked(){
	alert("You clicked the menu");
}

function replaceGraphs(){
	document.getElementById("graphdiv").innerHTML="<img src='images/ucl.png'>"
}

// create functions for getting and loading both earthquake and bus-stop data //
var earthquakes;
var busstops;
var client;
	function loadEarthquakeData() {
		// call the getEarthquakes code
		// keep the alert message so that we know something is happening
		alert("Loading Earthquakes");
		getData("earthquakes");
	}
	function loadBusstopData() {
		// call the getEarthquakes code
		// keep the alert message so that we know something is happening
		alert("Loading Busstops");
		getData("busstops");
	}
// create a variable for each of the layers we want to load/remove
var earthquakelayer;
var busstoplayer;// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable

	// create the code to get the data using an XMLHttpRequest
	function getData(layername) {
		client = new XMLHttpRequest();
		// depending on the layername we get different URLs
		var url;
		if (layername =="earthquakes") {
			url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
			}
		if (layername == "busstops") {
			url = "https://developer.cege.ucl.ac.uk:31082/week2/busstops.geojson"
			}
		client.open('GET',url);
		client.onreadystatechange = dataResponse;
		client.send();
	}
	// create the code to wait for the response from the data server, and process the response once it is received
	function dataResponse() {
		// this function listens out for the server to say that the data is ready - i.e. has state 4
		if (client.readyState == 4) {
			// once the data is ready, process the data
			var geoJSONData = client.responseText;
			loadLayer(geoJSONData);
			}
	}
	// convert the received data - which is text - to JSON format and add it to the map
	function loadLayer(geoJSONData) {
		// which layer did we actually load?
		if (geoJSONData.indexOf("earthquake") > 0) {
			var loadingEarthquakes = true;
			}
		if (geoJSONData.indexOf("IIT_METHOD") > 0) {
			var loadingBusstops = true;
			}
		// convert the text to JSON
		var json = JSON.parse(geoJSONData);
		// add the JSON layer onto the map - it will appear using the default icons
		if (loadingEarthquakes === true){
			earthquakelayer = L.geoJson(json).addTo(mymap);
			mymap.fitBounds(earthquakelayer.getBounds());
			}
		if (loadingBusstops === true){
			busstoplayer = L.geoJson(json).addTo(mymap);
			mymap.fitBounds(busstoplayer.getBounds());
			}
	}
	function removeEarthquakeData() {
		alert("remove the earthquake data here");
		mymap.removeLayer(earthquakelayer);
		}
	function removeBusstopData() {
		alert("remove the busstop data here");
		mymap.removeLayer(busstoplayer);
		}

	
// load the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
// load the tiles
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,'+
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
	}).addTo(mymap);
		
// create a custom popup
var popup = L.popup();
// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you

function onMapClick(e) {
	popup
	.setLatLng(e.latlng)
	.setContent("You clicked the map at " + e.latlng.toString())
	.openOn(mymap);
}

// now add the click event detector to the map
mymap.on('click', onMapClick);
	




function addPoint(){
// add a point
L.marker([51.5, -0.09]).addTo(mymap)
.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// add a circle
L.circle([51.508, -0.11], 500, {
color: 'red',
fillColor: '#f03',
fillOpacity: 0.5
}).addTo(mymap).bindPopup("I am a circle.");
}

function addPolygon(){
	// add a polygon with 3 end points (i.e. a triangle)
var myPolygon = L.polygon([
[51.509, -0.08],
[51.503, -0.06],
[51.51, -0.047]
],{
color: 'red',
fillColor: '#f03',
fillOpacity: 0.5
}).addTo(mymap).bindPopup("I am a polygon.");
}

var dist_destination;

function getDistance() {
	alert('getting distance');
	// getDistanceFromPoint is the function called once the distance has been found
	navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
}

function getDistanceFromPoint(position) {
	// find the coordinates of a point using this website:
	// these are the coordinates for Warren Street
	var lat = 51.5444689;
	var lng = -0.1357724;
	// return the distance in kilometers
	dist_destination = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	document.getElementById('showDistance').innerHTML = "Distance: " + dist_destination;
}

// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
	// where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
	return dist;
}




// create functions for tracking user's Location
function trackLocation() {
	if (navigator.geolocation) {
	navigator.geolocation.watchPosition(showPosition);
 } else {
	document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
 }
}

function showPosition(position) {
	// create a geoJSON feature -
	var geojsonFeature = {
		"type": "Feature",
		"properties": {
		"name": "Your Location",
		"popupContent": [position.coords.longitude, position.coords.latitude]
		},
		"geometry": {
		"type": "Point",
		"coordinates": [position.coords.longitude, position.coords.latitude]
		}
	};		
	// create Maker icon 
	var testMarkerPink = L.AwesomeMarkers.icon({
		icon: 'play',
		markerColor: 'pink'
	});	
	
	if (dist_destination < 0.05){
		// and add it to the map
		currentlocationlayer = L.geoJSON(geojsonFeature, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon:testMarkerPink});
			}
		}).addTo(mymap).bindPopup("<b>"+geojsonFeature.properties.name+" "+
		geojsonFeature.properties.popupContent+"<b>");		
		mymap.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:16});
	}
		
	else{
		currentlocationlayer = L.geoJSON(geojsonFeature, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon:testMarkerPink});
			}
		}).addTo(mymap).bindPopup("Your Destination is within 50m");		
		mymap.flyToBounds(currentlocationlayer.getBounds(),{maxZoom:16});
	}
}


	