$(window).on("load", function () {
	"use strict";
	// $("#submit_listing_a").on('click', function () {
	//     openNav()
	// })

	$("#nav_close_btn").on('click', function () {
		closeNav()
	})

	function openNav() {
		document.getElementById("mySidenav").style.width = "30%";
	}

	function closeNav() {
		document.getElementById("mySidenav").style.width = "0";
	}
	// var mapboxAccessToken = 'pk.eyJ1IjoieWFoeWEwNyIsImEiOiJjanphc2g3N2owMHV2M21tcnd3bnM1YnNiIn0.4rA0H5CUs8oZ5ZlAn6XfSg';
	// var map = L.map('mapid').setView([-6.173138,38.8463575], 6);
	// // 		var mapOptions = {
	// //  center: [6.3690, 34.8888],
	// //  zoom: 8
	// // }
	// // var map = new L.map('mapid', mapOptions);
	// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+ mapboxAccessToken, {
	// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	// id: 'mapbox.light',
	// }).addTo(map);

	//initialize();
	// initializeMap();

	// function initialize() {
	// 	var input = document.getElementById('autocomplete_search');
	// 	var autocomplete = new google.maps.places.Autocomplete(input);
	// 	autocomplete.addListener('place_changed', function () {
	// 	var place = autocomplete.getPlace();
	// 	// place variable will have all the information you are looking for.
	// 	$('#lat').val(place.geometry['location'].lat());
	// 	$('#long').val(place.geometry['location'].lng());
	//   });
	// }
	$('#drawer-btn-container').click(function () {
		var x = document.getElementById("listing");
		if (x.style.display === "none") {
			$("#maincontainer").removeClass("col-xl-12");
			$("#maincontainer").toggleClass("col-xl-8");
			$(".half-map-sec #map-container.fullwidth-home-map").css('width', '67%')

			x.style.display = "block";
		} else {
			x.style.display = "none";
			$("#maincontainer").removeClass("col-xl-8");
			$("#maincontainer").toggleClass("col-xl-12");
			$(".half-map-sec #map-container.fullwidth-home-map").css('width', '100%')

		}
	});
	var map = '';

	var geom = {
		"type": "Polygon", "coordinates": [[[33.903711, -0.95], [34.07262, -1.05982], [37.69869, -3.09699], [37.7669, -3.67712], [39.20222, -4.67677], [38.74054, -5.90895], [38.79977, -6.47566], [39.44, -6.84], [39.47, -7.1], [39.19469, -7.7039], [39.25203, -8.00781], [39.18652, -8.48551], [39.53574, -9.11237], [39.9496, -10.0984], [40.31659, -10.3171], [39.521, -10.89688], [38.427557, -11.285202], [37.82764, -11.26879], [37.47129, -11.56876], [36.775151, -11.594537], [36.514082, -11.720938], [35.312398, -11.439146], [34.559989, -11.52002], [34.28, -10.16], [33.940838, -9.693674], [33.73972, -9.41715], [32.759375, -9.230599], [32.191865, -8.930359], [31.556348, -8.762049], [31.157751, -8.594579], [30.74, -8.34], [30.2, -7.08], [29.62, -6.52], [29.419993, -5.939999], [29.519987, -5.419979], [29.339998, -4.499983], [29.753512, -4.452389], [30.11632, -4.09012], [30.50554, -3.56858], [30.75224, -3.35931], [30.74301, -3.03431], [30.52766, -2.80762], [30.46967, -2.41383], [30.758309, -2.28725], [30.816135, -1.698914], [30.419105, -1.134659], [30.76986, -1.01455], [31.86617, -1.02736], [33.903711, -0.95]]
		]
	};

	map = L.map('mapid', { zoomSnap: 0.1 }).setView([-6.173138, 35.8463575], 5);
	var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors';
	var osm = L.TileLayer.boundaryCanvas(osmUrl, {
		boundary: geom,
		attribution: osmAttribution,
		trackAttribution: true,
	}).addTo(map);

	var input = document.getElementById('autocomplete_search');
	var searchBox = new google.maps.places.SearchBox(input);

	searchBox.addListener('places_changed', function () {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		// console.log(bounds)
		places.forEach(function (place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}
			// document.getElementById('lat').value = place.geometry.location.lat()
			// document.getElementById('long').value = place.geometry.location.lng()
			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		var lat_lng = [places[0].geometry.location.lat(), places[0].geometry.location.lng()]
		// console.log(bounds)
		map.fitBounds([lat_lng]);
		map.setZoom(10)
	});

	$.when($.get('/getAllApprovedLand')).done(function (_res) {
		var lands = _res.data

		$.each(lands, function (index, land) {
			var lats_lngs = land.land_markers
			var lats_lngs_arr = []
			lats_lngs.map(function (lat_lng) {
				var lat_lng_arr = lat_lng.split(", ").map(function (item) {
					return parseFloat(item);
				});
				lats_lngs_arr.push(lat_lng_arr)
			})

			var colors = ["red", "yellow", "green", "blue", "orange", "pink", "grey", "brown", "violet"]

			var selectedColor = colors[Math.floor(Math.random() * colors.length)]

			// console.log(selectedColor)

			var polygon = L.polygon(lats_lngs_arr, { color: 'blue' });
			polygon.addTo(map);
			polygon.on('click', function (events) {
				// console.log(events, land)
				closeNav()
				openNav()
				$.when($.get('/getSingleUser?id=' + land.user_id)).done(function (_res) {
					// console.log(_res)
					var user = _res.data[0]
					$('#owner_name_text').html(user.firstname + ' ' + user.middlename + ' ' + user.lastname)
					$('#certificate_no_text').html(land.certificate_no)
					$('#lease_term_text').html(land.lease_term)
					$('#plot_no_text').html(land.plot_no)
					var c_type = land.certificate_type
					$('.plot_div').show()
					if (c_type == 0) {
						$('#certificate_type_text').html('Offer Letter')
					} else if (c_type == 1) {
						$('#certificate_type_text').html('Digital Land Title Certificate')
					} else if (c_type == 2) {
						$('#certificate_type_text').html('Certificate of Customary Right of Ownership')
						$('.plot_div').hide()
					} else if (c_type == 3) {
						$('#certificate_type_text').html('Non Digital Land Title Certificate')
					} else if (c_type == 4) {
						$('#certificate_type_text').html(globals.RL)
					}
					$('#marked_area_text').html(land.marked_area.replace(/\\\"/g, '"').replace(/(^"|"$)/g, ''))
				})
			})
			// console.log(lats_lngs_arr)
		})
	})

	// var markerClusters = L.markerClusterGroup({
	// 	chunkedLoading: true,
	// 	//singleMarkerMode: true,
	// 	spiderfyOnMaxZoom: false
	//   });

	//   for ( var i = 0; i < markers.length; ++i )
	//   {
	// 	var m = L.marker( [markers[i].lat, markers[i].lng] );
	// 	markerClusters.addLayer( m );
	//   }

	//   map.addLayer( markerClusters );

	map.on('click', function (e) {
		console.log(Object.values(e.latlng));
		//console.log(e.latlng);
		// arrlatlonf.push(Object.values(e.latlng));
		// console.log(arrlatlonf)
		//L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
	});

	var zone1 = L.divIcon({
		className: 'custom-div-icon',
		html: "<div style='background-color:rgba(50, 164, 220, 0.43);' class='marker-pin'></div><i class='material-icons'>1</i>",
	});

	var zone2 = L.divIcon({
		className: 'custom-div-icon',
		html: "<div style='background-color:rgba(50, 164, 220, 0.43);' class='marker-pin'></div><i class='material-icons'>2</i>",
	});

	var zone3 = L.divIcon({
		className: 'custom-div-icon',
		html: "<div style='background-color:rgba(50, 164, 220, 0.43);' class='marker-pin'></div><i class='material-icons'>3</i>",
	});

	var zone4 = L.divIcon({
		className: 'custom-div-icon',
		html: "<div style='background-color:rgba(50, 164, 220, 0.43);' class='marker-pin'></div><i class='material-icons'>4</i>",
	});

	var zone5 = L.divIcon({
		className: 'custom-div-icon',
		html: "<div style='background-color:rgba(50, 164, 220, 0.43);' class='marker-pin'></div><i class='material-icons'>5</i>",
	});

	var zone6 = L.divIcon({
		className: 'custom-div-icon',
		html: "<div style='background-color:rgba(50, 164, 220, 0.43);' class='marker-pin'></div><i class='material-icons'>6</i>",
	});

	L.marker([-6.185652581536974, 35.750358913553434], { icon: zone1 }).addTo(map);
	L.marker([-2.542774541875029, 32.73309814184519], { icon: zone2 }).addTo(map);
	L.marker([-3.650249885304413, 36.14158877840072], { icon: zone3 }).addTo(map);
	L.marker([-5.806876089280914, 32.24617090805153], { icon: zone4 }).addTo(map);
	L.marker([-8.46398921952091, 36.84492811610262], { icon: zone5 }).addTo(map);
	L.marker([-8.115994708460544, 38.630327973346006], { icon: zone6 }).addTo(map);



	// var polygon1 = L.polygon([[-6.18536368086916, 35.749751311210915], [-6.185416208275049, 35.75034570480686], [-6.185652581536974, 35.750358913553434], [-6.1855212630711796, 35.749751311210915]], { color: 'red' }).bindPopup("hvhghgh").addTo(map);

	// var polygon2 = L.polygon([[-3.667438982924977, 33.42650450212175], [-3.667438982924977, 33.42671584206698], [-3.667742161899715, 33.42626674468338], [-3.667887160503452, 33.42633278841626]], { color: 'blue' }).addTo(map);

	$("#card1").on("click", function (e) {
		L.popup({
			closeButton: true,
			autoClose: true
		})
			.setLatLng([-6.185652581536974, 35.750358913553434])
			.setContent('<div class="map-box"><a href="24_Property_Single.html" class="listing-img-container"><img src="../../images/card0.png" alt=""><div class="listing-item-content"><h3>Traditional Apartments</h3><span><i class="la la-map-marker"></i>212 5th Ave, New York</span><br><span><i class="fa fa-bath"></i>2 Bath</span><br><span><i class="la la-bed"></i>2 Beds</span><br><span><i class="fa fa-building"></i>Area 555 Sq Ft</span></div></a></div>')
			.openOn(map)
		map.fitBounds([[-6.18536368086916, 35.749751311210915], [-6.185416208275049, 35.75034570480686], [-6.185652581536974, 35.750358913553434], [-6.1855212630711796, 35.749751311210915]]);
	})
	$("#card2").on("click", function (e) {
		L.popup({
			closeButton: true,
			autoClose: true
		})
			.setLatLng([-3.667887160503452, 33.42633278841626])
			.setContent('<div class="map-box"><a href="24_Property_Single.html" class="listing-img-container"><img src="../../images/card0.png" alt=""><div class="listing-item-content"><h3>Traditional Apartments</h3><span><i class="la la-map-marker"></i>212 5th Ave, New York</span><br><span><i class="fa fa-bath"></i>2 Bath</span><br><span><i class="la la-bed"></i>2 Beds</span><br><span><i class="fa fa-building"></i>Area 555 Sq Ft</span></div></a></div>')
			.openOn(map)
		map.fitBounds([[-3.667438982924977, 33.42650450212175], [-3.667438982924977, 33.42671584206698], [-3.667742161899715, 33.42626674468338], [-3.667887160503452, 33.42633278841626]]);
	})



	var geojson;

	// return d == 1 ? '#800026' :
	// d == 2  ? '#BD0026' :
	// d == 3  ? '#E31A1C' :
	// d == 4  ? '#FC4E2A' :
	// d == 5  ? '#FD8D3C' :
	// d == 6  ? '#FEB24C' :
	// d == 7  ? '#FED976' :
	// d == 8  ? '#c62828' :
	// d == 9  ? '#b71c1c' :
	// d == 10  ? '#ff8a80' :'black'
	// ;

	function getColor(d) {
		//console.log(d);
		return d == 1 ? '#258544' :
			d == 3 ? '#C2E79A' :
				d == 15 ? '#78C77C' :
					d == 5 ? '#FFFFCB' :
						d == 11 ? '#92C2A1' :
							d == 14 ? '#36C163' : 'transparent'
			;
	}

	function style(feature) {
		//console.log(feature)
		return {
			fillColor: getColor(feature.properties.ID_1),
			weight: 2,
			opacity: 0.1,
			color: 'transparent',
			//dashArray: '1',
			fillOpacity: 0.5
		};
	}



	L.geoJson(statesData, { style: style }).addTo(map);

	L.geoJson(zoneone, { style: style }).addTo(map);

	L.geoJson(zonetwo, { style: style }).addTo(map);

	L.geoJson(zonethree, { style: style }).addTo(map);

	L.geoJson(zonefour, { style: style }).addTo(map);

	L.geoJson(zonefive, { style: style }).addTo(map);

});
