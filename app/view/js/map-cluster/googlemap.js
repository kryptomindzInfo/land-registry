$(window).on("load", function () {
  "use strict";

  var url = globals.URL;

  // $("#submit_listing_a").on('click', function () {
  //     openNav()
  // })

  // $('#drawer-btn-container').click(function () {
  // 	var x = document.getElementById("listing");
  // 	if (x.style.display === "none") {
  // 		$("#maincontainer").removeClass("col-xl-12");
  // 		$("#maincontainer").toggleClass("col-xl-8");
  // 		$(".half-map-sec #map-container.fullwidth-home-map").css('width', '67%')

  // 		x.style.display = "block";
  // 	} else {
  // 		x.style.display = "none";
  // 		$("#maincontainer").removeClass("col-xl-8");
  // 		$("#maincontainer").toggleClass("col-xl-12");
  // 		$(".half-map-sec #map-container.fullwidth-home-map").css('width', '100%')

  // 	}
  // });

  $("#submit_listing_a").click(function () {
    var x = document.getElementById("feature_details");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  });

  /*==============================================
                      SEARCH HOME PAGE
    ===============================================*/

  $(".openBtn").on("click", function () {
    $("#myOverlay").show();
  });

  $(".closebtn").on("click", function () {
    $("#myOverlay").hide();
  });

  /*==============================================
                      END OF SEARCH HOME PAGE
    ===============================================*/

  $("#nav_close_btn").on("click", function () {
    closeNav();
  });

  $("#search_by_no_form").on("submit", function (e) {
    e.preventDefault();
    closeNav();
    $("#myOverlay").hide();
    var search = $("#search_by_no").val();
    if (search != "") {
      let options = {};
      options.certificate_no = search;
      $.when($.post("/searchApprovedLand", options)).done(function (_res) {
        console.log("as", _res);
        var data = _res.data;
        if (data.length > 0) {
          openNav();
          getDetails(data[0]);
          $("#search_by_no").val("");
        } else {
          closeNav();
          alert("No Land Details Found! Check Certificate No.");
        }
      });
    }
  });

  function openNav() {
    var screenwidth = window.innerWidth;
    if (screenwidth > 768) {
      document.getElementById("mySidenav").style.width = "30%";
    } else {
      document.getElementById("mySidenav").style.width = "70%";
    }
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  function getDetails(land) {
    $.when($.get("/getSingleUser?id=" + land.user_id)).done(function (_res) {
      // console.log(_res)
      var user = _res.data[0];
      console.log();
      $.when($.get("/getHistoryForLand?land_id=" + land._id)).done(function (
        _res
      ) {
        console.log(_res, "sdsf", land);
        var block_data = _res.data.reverse();
        $("#owner_name_text").html(
          user.firstname + " " + user.middlename + " " + user.lastname
        );
        $("#certificate_no_text").html(land.certificate_no);

        $("#plot_no_text").html(land.plot_no);
        var c_type;
        $(".plot_div").show();
        $(".cert_div").show();
        $(".lease_div").show();
        $(".purpose_div").show();
        if (!land.hasOwnProperty("certificate_type")) {
          $(".cert_div").hide();
          $(".lease_div").hide();
          $(".purpose_div").hide();
          if (land.land_purpose == "0") {
            $("#type_text").html("Housing");
          } else if (land.land_purpose == "1") {
            $("#type_text").html("Government Farming");
          } else if (land.land_purpose == "2") {
            $("#type_text").html("Police");
          } else if (land.land_purpose == "3") {
            $("#type_text").html("Hospital");
          } else if (land.land_purpose == "4") {
            $("#type_text").html("Forest");
          } else if (land.land_purpose == "5") {
            $("#type_text").html("National Parks");
          } else if (land.land_purpose == "6") {
            $("#type_text").html("Mineral Areas");
          } else if (land.land_purpose == "7") {
            $("#type_text").html("Government Institutions Authorities");
          } else if (land.land_purpose == "8") {
            $("#type_text").html("Others");
          }
        } else {
          c_type = land.certificate_type;
          $("#lease_term_text").html(land.lease_term);
          if (land.lease_term_type == "1") {
            $("#lease_term_text").html("N/A");
          }
          if (land.land_purpose_type == "0") {
            $("#purpose_text").html("Residential");
            if (land.land_purpose == "0") {
              $("#type_text").html("Public Housing");
            } else if (land.land_purpose == "1") {
              $("#type_text").html("Private Housing");
            } else if (land.land_purpose == "2") {
              $("#type_text").html("Housing/Farming");
            }
          } else if (land.land_purpose_type == "1") {
            $("#purpose_text").html("Commercial");
            if (land.land_purpose == "0") {
              $("#type_text").html("Public/Industries");
            } else if (land.land_purpose == "1") {
              $("#type_text").html("Forest/Farm");
            } else if (land.land_purpose == "2") {
              $("#type_text").html("Mineral Areas");
            } else if (land.land_purpose == "3") {
              $("#type_text").html("Parks/Recreation/Amusement");
            }
          }
        }
        if (c_type == 0) {
          $("#certificate_type_text").html("Offer Letter");
        } else if (c_type == 1) {
          $("#certificate_type_text").html("Digital Land Title Certificate");
        } else if (c_type == 2) {
          $("#certificate_type_text").html(
            "Certificate of Customary Right of Ownership"
          );
          $(".plot_div").hide();
        } else if (c_type == 3) {
          $("#certificate_type_text").html(
            "Non Digital Land Title Certificate"
          );
        } else if (c_type == 4) {
          $("#certificate_type_text").html(globals.RL);
        }
        $("#marked_area_text").html(
          land.marked_area.replace(/\\\"/g, '"').replace(/(^"|"$)/g, "")
        );
        var html = '<h6 class="heading_tx">Block Explorer</h6>';
        block_data.map(function (block, index) {
          var name, image_name, image_style;
          if (block_data.length - index == 1) {
            name = "Land Details Added By User";
            image_name = "vector_man1.png";
            image_style = "height: 50px; width: 50px;";
          } else {
            if (block.Value.approval_status.status == 6) {
              name = "Approved By Town planner";
              image_name = "vector_man2.png";
              image_style = "height: 50px; width: 50px;";
            }
            if (block.Value.approval_status.status == 7) {
              name = "Approved By Surveyor";
              image_name = "surveyor.png";
              image_style = "height: 40px; width: 40px;";
            }
            if (block.Value.approval_status.status == 4) {
              name = "Approved By Land Officer";
              image_name = "land-officer.png";
              image_style = "height: 40px; width: 40px;";
            }
            if (block.Value.approval_status.status == 1) {
              if (land.certificate_type == "2") {
                name = "Approved By Land Officer";
              } else {
                name = "Approved By Registrar";
              }

              image_name = "registarar.png";
              image_style = "height: 40px; width: 40px;";
            }
          }

          html +=
            '<div class="row div_main_tx">\
					<div class="col-lg-1"></div>\
					<div class="w3-card-4 col-lg-10" >\
							<div class="w3-container ">\
								<p class="text_align_center trusted_head">Trusted Block Ledger </p>\
								<div class="row">\
								<div class="col-lg-2 res_center">\
								<img class="w3-left w3-circle" src="./images/' +
            image_name +
            '" style="' +
            image_style +
            '"/>\
								</div>\
							  <div class="col-lg-8 res_center">\
									<p class="name_text_head">' +
            name +
            '</p>\
									<p class="p_details hash_text_head">' +
            block.TxId +
            '</p>\
							  </div>\
							  <div class="col-lg-2 res_center">\
							  <i class="fa fa-check-circle check_icon" aria-hidden="true" data-prevHash="' +
            block.PrevHash +
            '" data-dataHash="' +
            block.CurrHash +
            '" data-blockno="' +
            block.BlockNo +
            '" data-endorser="' +
            block.Endorser +
            '" data-txid="' +
            block.TxId +
            '" data-status_app="' +
            block.Value.approval_status.status +
            '" data-txno="' +
            (block_data.length - index) +
            '"  data-timestamp="' +
            block.Timestamp +
            '" style="font-size: 20px; cursor: pointer;"></i>\
							  </div>\
							</div>\
							</div>\
						  </div>\
						</div>';
        });
        $(".blocks_div").html(html);
        $(".check_icon").click(function () {
          $("#heading_text").html(
            "Trusted Block Ledger " /* + $(this).data("blockno") */
          );
          //   $("#block_no_text").html($(this).data("blockno"));
          $("#transaction_id_text").html($(this).data("txid"));
          // $("#prev_hash_text").html($(this).data("prevhash"));
          //   $("#current_hash_text").html($(this).data("datahash"));
          $("#endorser_text").html($(this).data("endorser"));
          $("#time_stamp_text").html(
            moment.unix($(this).data("timestamp")).format("LLLL")
          );
          $("#expires_text").html(
            "Expires: " +
              moment
                .unix($(this).data("timestamp"))
                .add(10, "years")
                .format("LLLL")
          );
          var status = $(this).data("status_app");
          var status_text, bytext;
          var t_no = $(this).data("txno");
          if (t_no == 1) {
            status_text = "Land Details Added By User";
            $(".certificate_div").hide();
          } else {
            $(".certificate_div").show();
            if (status == 1) {
              if (land.certificate_type == "2") {
                status_text = "Approved By Land Officer";
                bytext = "Land Officer";
              } else {
                status_text = "Approved By Registrar";
                bytext = "Registrar";
              }
            }
            if (status == 6) {
              status_text = "Approved By Town Planner";
              bytext = "Town Planner";
            }
            if (status == 7) {
              status_text = "Approved By Surveyor";
              bytext = "Surveyor";
            }
            if (status == 4) {
              status_text = "Approved By Land Officer";
              bytext = "Land Officer";
            }
          }

          $("#app_status_text").html(status_text);
          $("#cert_issue_text").html(bytext);
          $("#details_show_modal").modal("toggle");
        });
      });
    });
  }

  var myLatlng = new google.maps.LatLng(-6.173138, 35.8463575);
  var myOptions = {
    zoom: 6,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM,
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM,
    },
  };
  var map = new google.maps.Map(document.getElementById("mapid"), myOptions);

  var legend = document.getElementById("legend");
  var div = document.createElement("div");
  div.innerHTML =
    '<img style="width: 40px; height: 45px;" src="' +
    url +
    '/images/compass_icon_2.png"> ';
  legend.appendChild(div);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

  var polygonMask = new google.maps.Polygon({
    map: map,
    // strokeColor: '#000000',
    // strokeOpacity: 0.5,
    strokeWeight: 0,
    fillColor: "#CACACA",
    fillOpacity: 0.8,
    paths: [
      [
        new google.maps.LatLng(-84.918563, 2.894656),
        new google.maps.LatLng(-84.966914, -138.785031),
        new google.maps.LatLng(-84.791962, -136.66467),
        new google.maps.LatLng(-85.295886, -160.392392),
        new google.maps.LatLng(-84.503849, -162.32324),
        new google.maps.LatLng(-83.602715, -164.075559),
        new google.maps.LatLng(-81.566955, -164.053586),
        new google.maps.LatLng(-74.834499, -164.009641),
        new google.maps.LatLng(-37.72599, -165.328),
        new google.maps.LatLng(33.488135, -165.855344),
        new google.maps.LatLng(57.901446, -165.24011),
        new google.maps.LatLng(72.279782, -165.328),
        new google.maps.LatLng(76.54492, -166.250852),
        new google.maps.LatLng(80.40242, -166.470578),
        new google.maps.LatLng(81.491689, -166.932004),
        new google.maps.LatLng(82.818445, -165.98718),
        new google.maps.LatLng(84.947959, -166.206906),
        new google.maps.LatLng(84.868075, 13.441531),
        new google.maps.LatLng(84.930587, -166.675568),
        new google.maps.LatLng(-69.123296, -165.269318),
        new google.maps.LatLng(-85.086978, -164.536918),
        new google.maps.LatLng(-84.887329, 117.445482),
        new google.maps.LatLng(-84.918563, 2.894656),
      ],
      [
        new google.maps.LatLng(-0.95, 33.903711),
        new google.maps.LatLng(-1.02736, 31.86617),
        new google.maps.LatLng(-1.01455, 30.76986),
        new google.maps.LatLng(-1.134659, 30.419105),
        new google.maps.LatLng(-1.698914, 30.816135),
        new google.maps.LatLng(-2.28725, 30.758309),
        new google.maps.LatLng(-2.41383, 30.46967),
        new google.maps.LatLng(-2.80762, 30.52766),
        new google.maps.LatLng(-3.03431, 30.74301),
        new google.maps.LatLng(-3.35931, 30.75224),
        new google.maps.LatLng(-3.56858, 30.50554),
        new google.maps.LatLng(-4.09012, 30.11632),
        new google.maps.LatLng(-4.452389, 29.753512),
        new google.maps.LatLng(-4.499983, 29.339998),
        new google.maps.LatLng(-5.419979, 29.519987),
        new google.maps.LatLng(-5.939999, 29.419993),
        new google.maps.LatLng(-6.52, 29.62),
        new google.maps.LatLng(-7.08, 30.2),
        new google.maps.LatLng(-8.34, 30.74),
        new google.maps.LatLng(-8.594579, 31.157751),
        new google.maps.LatLng(-8.762049, 31.556348),
        new google.maps.LatLng(-8.930359, 32.191865),
        new google.maps.LatLng(-9.230599, 32.759375),
        new google.maps.LatLng(-9.41715, 33.73972),
        new google.maps.LatLng(-10.16, 34.28),
        new google.maps.LatLng(-11.52002, 34.559989),
        new google.maps.LatLng(-11.439146, 35.312398),
        new google.maps.LatLng(-11.720938, 36.514082),
        new google.maps.LatLng(-11.594537, 36.775151),
        new google.maps.LatLng(-11.56876, 37.47129),
        new google.maps.LatLng(-11.26879, 37.82764),
        new google.maps.LatLng(-11.285202, 38.427557),
        new google.maps.LatLng(-10.89688, 39.521),
        new google.maps.LatLng(-10.3171, 40.31659),
        new google.maps.LatLng(-10.0984, 39.9496),
        new google.maps.LatLng(-9.11237, 39.53574),
        new google.maps.LatLng(-8.48551, 39.18652),
        new google.maps.LatLng(-8.00781, 39.25203),
        new google.maps.LatLng(-7.7039, 39.19469),
        new google.maps.LatLng(-7.1, 39.47),
        new google.maps.LatLng(-6.84, 39.44),
        new google.maps.LatLng(-6.47566, 38.79977),
        new google.maps.LatLng(-5.90895, 38.74054),
        new google.maps.LatLng(-4.67677, 39.20222),
        new google.maps.LatLng(-3.67712, 37.7669),
        new google.maps.LatLng(-3.09699, 37.69869),
        new google.maps.LatLng(-1.05982, 34.07262),
        new google.maps.LatLng(-0.95, 33.903711),
        new google.maps.LatLng(-0.95, 33.903711),
      ],
    ],
  });

  polygonMask.setMap(map);

  var input = document.getElementById("autocomplete_search");
  var searchBox = new google.maps.places.SearchBox(input);

  searchBox.addListener("places_changed", function () {
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
    var lat_lng = [
      places[0].geometry.location.lat(),
      places[0].geometry.location.lng(),
    ];
    // console.log(bounds)
    map.fitBounds(bounds);
    map.setZoom(10);
  });
  var createpolygon, marker;
  $.when($.get("/getAllApprovedLand")).done(function (_res) {
    var lands = _res.data;
    //console.log(_res)

    $.each(lands, function (index, land) {
      var lats_lngs = land.land_markers;
      var lats_lngs_arr = [];
      lats_lngs.map(function (lat_lng) {
        var lat_lng_arr = lat_lng.split(", ").map(function (item) {
          return parseFloat(item);
        });
        lats_lngs_arr.push(lat_lng_arr);
      });

      var colors = [
        "red",
        "yellow",
        "green",
        "blue",
        "orange",
        "pink",
        "grey",
        "brown",
        "violet",
      ];

      var selectedColor = colors[Math.floor(Math.random() * colors.length)];

      var lat_lng = land.land_markers;
      var lat_lng_arr = lat_lng[0].split(", ");
      $("#lat").val(lat_lng_arr[0]);
      $("#long").val(lat_lng_arr[1]);

      //console.log('arr', lat_lng)
      var colors = [
        "green",
        "brown",
        "gold",
        "red",
        "blue",
        "yellow",
        "orange",
        "purple",
        "indigo",
        "grey",
        "aqua",
        "lightgreen",
        "violet",
        "olive",
        "salmon",
        "ultra",
        "#B22222",
        "#FD6A02",
      ];
      var triangleCoords = [];
      lat_lng.map(function (lats) {
        var add = lats.split(", ");
        var main_addr = {
          lat: parseFloat(add[0]),
          lng: parseFloat(add[1]),
        };
        triangleCoords.push(main_addr);
      });

      //console.log('cors', triangleCoords)

      createpolygon = new google.maps.Polygon({
        paths: triangleCoords,
        clickable: true,
        strokeColor: "blue",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "blue",
        fillOpacity: 0.35,
        zIndex: 9999,
      });
      createpolygon.setMap(map);

      marker = new google.maps.Marker({
        position: triangleCoords[0],
        draggable: false,
        animation: google.maps.Animation.DROP,
        map: map,
      });

      google.maps.event.addListener(marker, "click", function (event) {
        // console.log('hii', land)
        closeNav();
        openNav();
        getDetails(land);
      });

      google.maps.event.addListener(createpolygon, "click", function (event) {
        // console.log(event, land)
        closeNav();
        openNav();
        getDetails(land);
      });
    });
  });

  // Load GeoJSON.
  map.data.loadGeoJson("./js/map-cluster/boundary.js");
  map.data.loadGeoJson("./js/map-cluster/zoneone.json");
  map.data.loadGeoJson("./js/map-cluster/zonetwo.json");
  map.data.loadGeoJson("./js/map-cluster/zonethree.json");
  map.data.loadGeoJson("./js/map-cluster/zonefour.json");
  map.data.loadGeoJson("./js/map-cluster/zonefive.json");
  map.data.loadGeoJson("./js/map-cluster/states.json");

  map.data.setStyle(function (feature) {
    var color = "transparent";
    var stroke = 0;

    if (feature.getProperty("ID_1") === 2) {
      stroke = 0;
    }
    if (feature.getProperty("ID_1") === 1) {
      color = "#258544";
    }
    if (feature.getProperty("ID_1") === 3) {
      color = "C2E79A";
    }
    if (feature.getProperty("ID_1") === 5) {
      color = "#FFFFCB";
    }
    if (feature.getProperty("ID_1") === 14) {
      color = "#36C163";
    }
    if (feature.getProperty("ID_1") === 15) {
      color = "#78C77C";
    }
    if (feature.getProperty("ID_1") === 11) {
      color = "#92C2A1";
    }

    return /** @type {google.maps.Data.StyleOptions} */ ({
      fillColor: color,
      strokeWeight: stroke,
    });
  });
});
