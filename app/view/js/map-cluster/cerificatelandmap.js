var createpolygon2;
var marker;
var url = globals.URL
function mapinit2() {

    var map = new google.maps.Map(document.getElementById('certificate-map-marker'), {
        center: {lat: -33.86888, lng: 151.213123},
        zoom: 15,
        disableDefaultUI:true,
        mapTypeId: 'roadmap'
    })

    var legend = document.getElementById('legend');
    var div = document.createElement('div');
    div.innerHTML = '<img style="width: 40px; height: 45px;" src="' + url + '/images/compass_icon_2.png"> '
    legend.appendChild(div);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    $('#lng_input_text').change(function () {
        map.panTo({lat: parseFloat(document.getElementById('lat_input_text').value), lng: parseFloat(document.getElementById('lng_input_text').value)})
        var zoom_level = parseInt($("#map_zoom").val())
        map.setZoom(zoom_level-1)
    })

    $('#array_lat_lng_text').change(function () {
        createPolygon2(map)
    })
    
}

function createPolygon2(map) {
    var lat_lng = JSON.parse($("#array_lat_lng_text").val())
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

        createpolygon2 = new google.maps.Polygon({
            paths: triangleCoords,
            strokeColor: "green",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: "green",
            fillOpacity: 0.35
        });
        createpolygon2.setMap(map);
        triangleCoords.map(function (lat_lng_a, index) {
            var alpha = index + 65
            var letter = String.fromCharCode(alpha)
            marker = new google.maps.Marker({
                map: map,
                position: lat_lng_a,
                icon: "http://maps.google.com/mapfiles/marker" + letter + ".png",
                animation: google.maps.Animation.DROP
            });
        })
        
        // map.setCenter(triangleCoords[triangleCoords.length-1])
}   
