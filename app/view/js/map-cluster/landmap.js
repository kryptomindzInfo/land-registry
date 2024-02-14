$(window).on("load", function () {
    var url = globals.URL
    
    var map = ''
    mapinit()
    // $("#long").change(function () {
    //     mapinit()
    // })

    // $("#lat").change(function () {
    //     mapinit()
    // })

    var lats_lomgs = [];
    var markers = []
    var createpolygon;
    var map_zoom_level = '';

    function makepolygon(map) {
        var lat_lng = JSON.parse($("#array_lat_lng").val())
        var lat_lng_arr=lat_lng[0].split(", ")
        $("#lat").val(lat_lng_arr[0])
        $("#long").val(lat_lng_arr[1])

        console.log('arr', lat_lng)
        var colors = ["green", "brown", "gold", "red", "blue", "yellow", "orange", "purple", "indigo", "grey", "aqua", "lightgreen", "violet", "olive", "salmon", "ultra", "#B22222", "#FD6A02"];
            var triangleCoords = [];
            lat_lng.map(function (lats) {
                var add = lats.split(", ");
                var main_addr = {
                    lat: parseFloat(add[0]),
                    lng: parseFloat(add[1])
                }
                triangleCoords.push(main_addr);

        })

        console.log('cors', triangleCoords)

        createpolygon = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: "green",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: "green",
            fillOpacity: 0.35
        });
        createpolygon.setMap(map);
        var area = google.maps.geometry.spherical.computeArea(createpolygon.getPath());
        $("#area_as_per_marking").val(area.toFixed(4) + ' sq.m')
    }

    function placeMarkerAndPanTo(latLng, map) {
        console.log(lats_lomgs)
        var lats = latLng.toString();
        lats = lats.replace(/[{()}]/g, '');
        console.log(lats)
        lats_lomgs.push(lats);
        var marker = new google.maps.Marker({
            position: latLng,
            draggable:true,
            animation: google.maps.Animation.DROP,
            map: map
        });
        google.maps.event.addListener(marker, 'dragend', function (events) {
            console.log(marker.closure_uid, markers)
            var mark = Object.keys(marker).sort()
            var first = marker[mark[6]]
            //var sec = markers[0][mark[6]]
            console.log(first)
            var lat_lng = []
            markers.map(function(ma, index) {
                var sec = markers[index][mark[6]]
                var lat
                lat = ma.position.toString()
                lat = lat.replace(/[{()}]/g, '')
                if(first == sec) {
                    // markers[index] = marker
                    lat = marker.position.toString()
                    lat = lat.replace(/[{()}]/g, '')
                } 
                    
                // }
                lat_lng.push(lat)
            })


            document.getElementById('array_lat_lng').value = JSON.stringify(lat_lng)
            document.getElementById('map_zoom').value = map.getZoom()
            lats_lomgs = lat_lng
            console.log(lat_lng)
            if(createpolygon){
                createpolygon.setMap(null)
            }
            
            makepolygon(map)
            //console.log(marker.internalPosition.lat(), marker.position.lat())
        });
        google.maps.event.addListener(marker, "rightclick", function (point) {delMarker(marker)});

        var delMarker = function (markerPar) {
            // console.log(markerPar.position.lat(), lats_lomgs)
            var lat = markerPar.position.toString()
            lat = lat.replace(/[{()}]/g, '');
            lats_lomgs.map(function (lat_lngs, index) {
                if(lat_lngs == lat) {
                    lats_lomgs.splice(index, 1)
                }
            })

            markers.map(function (marker, index) {
               // console.log(marker.position.toString(), lat)
                var lt_lng = marker.position.toString()
                lt_lng = lt_lng.replace(/[{()}]/g, '')
                if(lat == lt_lng) {
                    markers.splice(index, 1)
                }
            })

            console.log(markers)

            document.getElementById('array_lat_lng').value = JSON.stringify(lats_lomgs)
            document.getElementById('map_zoom').value = map.getZoom()
            // console.log(lats_lomgs)
            markerPar.setMap(null);

            if(createpolygon){
                createpolygon.setMap(null)
            }
            
            makepolygon(map)

        }

        markers.push(marker);
        document.getElementById('array_lat_lng').value = JSON.stringify(lats_lomgs)
        document.getElementById('map_zoom').value = map.getZoom()
        map.panTo(latLng)
        map_zoom_level = map.getZoom();
    }

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

    function clearMarkers() {
        setMapOnAll(null);
    }

    function mapinit() {
        var infowindow = new google.maps.InfoWindow();
        var map = new google.maps.Map(document.getElementById('map-marker'), {
            center: {lat: -33.86888, lng: 151.213123},
            zoom: 16,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeId: google.maps.MapTypeId.HYBRID
        })

        var legend = document.getElementById('legend');
        var div = document.createElement('div');
        div.innerHTML = '<img style="width: 40px; height: 45px;" src="' + url + '/images/compass_icon_2.png"> '
        legend.appendChild(div);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

        map.addListener('click', function (e) {            
            placeMarkerAndPanTo(e.latLng, map)
            if(createpolygon){
                createpolygon.setMap(null)
            }
            
            makepolygon(map)
        })

        

        $('#remove_marker_btn').click(function () {
            $("#area_as_per_marking").val('')
            clearMarkers()
            markers = []
            createpolygon.setMap(null)
            lats_lomgs = []
            $("#array_lat_lng").val('')
            document.getElementById('map_zoom').value = ''
            console.log(markers)
        })

        $('#ward').change(function() {
            var request = {
                query: $("#ward option:selected").text() + ', ' + $("#region option:selected").text() +  ', Tanzania',
                fields: ['name', 'geometry'],
            };
      
              service = new google.maps.places.PlacesService(map);
      
              service.findPlaceFromQuery(request, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                //   for (var i = 0; i < results.length; i++) {
                //     createMarker(results[i]);
                //   }
                //   console.log(results)
                  map.setCenter(results[0].geometry.location);
                  map.setZoom(15)
                } else {
                    alert("The selected ward is not tagged on google! search for the address nearby.")
                }
              });
        })

      

        $('#save_marker_btn').click(function () {
            clearMarkers()
            markers = []
            var lat_lng = JSON.parse($("#array_lat_lng").val())
            var lat_lng_arr=lat_lng[0].split(", ")
            $("#lat").val(lat_lng_arr[0])
            $("#long").val(lat_lng_arr[1])

            console.log('arr', lat_lng)
            var colors = ["green", "brown", "gold", "red", "blue", "yellow", "orange", "purple", "indigo", "grey", "aqua", "lightgreen", "violet", "olive", "salmon", "ultra", "#B22222", "#FD6A02"];
                var triangleCoords = [];
                lat_lng.map(function (lats) {
                    var add = lats.split(", ");
                    var main_addr = {
                        lat: parseFloat(add[0]),
                        lng: parseFloat(add[1])
                    }
                    triangleCoords.push(main_addr);

            })

            console.log('cors', triangleCoords)

            createpolygon = new google.maps.Polygon({
                paths: triangleCoords,
                strokeColor: "green",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "green",
                fillOpacity: 0.35
            });
            createpolygon.setMap(map);
            var area = google.maps.geometry.spherical.computeArea(createpolygon.getPath());
            $("#area_as_per_marking").val(area.toFixed(4) + ' sq.m')
            document.getElementById('map_zoom').value = map.getZoom()
        })

        // Create the search box and link it to the UI element.
        var input = document.getElementById('search_address');
        var searchBox = new google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
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
                document.getElementById('lat').value = place.geometry.location.lat()
                document.getElementById('long').value = place.geometry.location.lng()
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            console.log(bounds)
            map.fitBounds(bounds);
            map.setZoom(20)
        });

        // var map = L.map('map-marker').setView([51.505, -0.09], 13);
        //     var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		// 	    maxZoom: 18,
		// 	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		//     });
        //     map.addLayer(tiles);

        // // Create the search box and link it to the UI element.
        // var input = document.getElementById('search_address');
        // var options = {}
        // var autocomplete = new google.maps.places.Autocomplete(input, options)

        // google.maps.event.addListener(autocomplete, 'place_changed', function () {
        //     var place = autocomplete.getPlace()
        //     var lat = place.geometry.location.lat()
        //     var lng = place.geometry.location.lng()
        //     console.log(lat, lng)
        //     map.fitBounds([lat, lng]);
        //     map.setZoom(18);
        //     document.getElementById('lat').value = lat
        //     document.getElementById('long').value = lng
        // })
        // if ($("#long").val() && $("#lat").val()) {
        //     $('.map_div').show()
        //     map = L.map('map-marker').setView([$("#lat").val(), $("#long").val()], 14);
        //     var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //     }).addTo(map);
        //     map.addLayer(tiles);
        //     L.marker([$("#lat").val(), $("#long").val()]).addTo(map);
        // } else {
        //     $('.map_div').hide()
        //     map.off();
        //     map.remove()
        // }
    }

})