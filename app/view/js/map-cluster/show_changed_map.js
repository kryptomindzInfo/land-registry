$(window).on("load", function () {
    mapinit();
    var url = globals.URL
    var createpolygon;
    function mapinit() {

        var map = new google.maps.Map(document.getElementById('show-map-marker'), {
            center: {lat: -33.86888, lng: 151.213123},
            zoom: 15,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeId: 'roadmap'
        })

        var legend = document.getElementById('legend');
        var div = document.createElement('div');
        div.innerHTML = '<img style="width: 40px; height: 45px;" src="' + url + '/images/compass_icon_2.png"> '
        legend.appendChild(div);
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

        $("#my_view_close_btn").click(function () {
            createpolygon.setMap(null)
        })

        $('#lng_input_show').change(function () {
            map.panTo({lat: parseFloat(document.getElementById('lat_input_show').value), lng: parseFloat(document.getElementById('lng_input_show').value)})
            map.setZoom(15)
        })

        $('#array_lat_lng_show').change(function () {
            createPolygon(map)
        })
    }

    

    function createPolygon(map) {
        var lat_lng = JSON.parse($("#array_lat_lng_show").val())
            console.log('arr', lat_lng)
            var colors = ["green", "brown", "gold", "red", "blue", "yellow", "orange", "purple", "indigo", "grey", "aqua", "lightgreen", "violet", "olive", "salmon", "ultra", "#B22222", "#FD6A02"];
                var triangleCoords = [];
                lat_lng.map(function (lats, index) {
                    var add = lats.split(", ");
                    var main_addr = {
                        lat: parseFloat(add[0]),
                        lng: parseFloat(add[1])
                    }
                    triangleCoords.push(main_addr);

                    if(index == 0) {
                        $("#lat_input_show").val(add[0])
                        $("#lng_input_show").val(add[1]).trigger("change")
                    }

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
    }

   
})