$(window).on("load", function () {
    mapinit()
    var markers = []
    var lat_lngs = []
    var infoWindow = ''
    var createpolygon;
    var url = globals.URL
    function mapinit() {

        var map = new google.maps.Map(document.getElementById('drawing_map'), {
            center: { lat: -33.86888, lng: 151.213123 },
            zoom: 16,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeId: google.maps.MapTypeId.HYBRID
        })

        var legend = document.getElementById('legend');
        var div = document.createElement('div');
        div.innerHTML = '<img style="width: 40px; height: 45px;" src="../../images/compass_icon_2.png"> '
        legend.appendChild(div);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(map);
            }
          }
    
        function clearMarkers() {
            setMapOnAll(null);
        }

        function makePolygon() {
            var lat_lng = JSON.parse($("#land_markers_array").val())
            var lat_lng_arr=lat_lng[0].split(", ")
            // $("#lat").val(lat_lng_arr[0])
            // $("#long").val(lat_lng_arr[1])

            // console.log('arr', lat_lng)
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

            // console.log('cors', triangleCoords)

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
            $("#land_markers_area").val(area.toFixed(4) + ' sq.m')
        }

        $('#draw_btn').click(function () {
            clearMarkers()
            markers = []
            var lat_lng = JSON.parse($("#land_markers_array").val())
            var lat_lng_arr=lat_lng[0].split(", ")
            // $("#lat").val(lat_lng_arr[0])
            // $("#long").val(lat_lng_arr[1])

            // console.log('arr', lat_lng)
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

            // console.log('cors', triangleCoords)

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
            $("#land_markers_area").val(area.toFixed(4) + ' sq.m')
        })

        $("#land_markers_array").change(() => {
            // console.log('sdjhsd')
            lat_lngs = JSON.parse($("#land_markers_array").val())


            lat_lngs.map(function (lat_long, index) {
                var lat_lng_arr = lat_long.split(", ")
                var latLng = {
                    lat: parseFloat(lat_lng_arr[0]),
                    lng: parseFloat(lat_lng_arr[1])
                }

                if(index == 0) {
                    map.panTo(latLng)
                }

                // console.log(latLng)
                var marker = new google.maps.Marker({
                    position: latLng,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    map: map,
                    title: JSON.stringify(latLng)
                });
                var cata = '<div><p>Latitude:- ' + marker.getPosition().lat() + '</p><p>Latitude:- ' + marker.getPosition().lng() + '</p></div>'
                infoWindow = new google.maps.InfoWindow({
                    content: cata
                })
                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open(map, marker)
                })

                google.maps.event.addListener(marker, 'dragstart', function (events) {
                    infoWindow.close()
                })

                google.maps.event.addListener(marker, 'dragend', function (events) {
                    // console.log(marker.closure_uid, markers)
                    var mark = Object.keys(marker).sort()
                    var first = marker[mark[6]]
                    //var sec = markers[0][mark[6]]
                    // console.log(first)
                    var lat_lng = []
                    var cata = '<div><p>Latitude:- ' + marker.getPosition().lat() + '</p><p>Latitude:- ' + marker.getPosition().lng() + '</p></div>'
                    infoWindow = new google.maps.InfoWindow({
                        content: cata
                    })
                    google.maps.event.addListener(marker, 'click', function () {
                        infoWindow.open(map, marker)
                    })
                    markers.map(function (ma, index) {
                        var sec = markers[index][mark[6]]
                        var lat
                        lat = ma.position.toString()
                        lat = lat.replace(/[{()}]/g, '')
                        if (first == sec) {
                            // markers[index] = marker
                            lat = marker.position.toString()
                            lat = lat.replace(/[{()}]/g, '')
                        }

                        // }
                        lat_lng.push(lat)
                    })


                    document.getElementById('land_markers_array').value = JSON.stringify(lat_lng)
                    if(createpolygon){
                        createpolygon.setMap(null)
                    }
                    
                    makePolygon(map)
                    // console.log(lat_lng)
                    //console.log(marker.internalPosition.lat(), marker.position.lat())
                });

                markers.push(marker);
                if(createpolygon){
                    createpolygon.setMap(null)
                }
                
                makePolygon(map)
            })
        })
    }
})