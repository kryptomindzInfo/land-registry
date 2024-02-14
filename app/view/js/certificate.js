$(window).on("load", function () {
  var qrcode = new QRCode("qrcode");
  var url = globals.URL;
  var urls = new URL(window.location.href);
  var application_id = urls.searchParams.get("app_id");
  var user_id = urls.searchParams.get("id");
  showProgress();
  //console.log(new Date())

  // $('#print_btn').click(function () {
  //     //alert($(this).data('url'))
  //     $('#print_btn').attr('href', $(this).data('url'))
  // })
  function showgenProgress() {
    $("#loader-gen-wrapper").show();
  }

  function hidegenProgress() {
    $("#loader-gen-wrapper").hide();
  }

  function showProgress() {
    $(".display-loader").addClass("show");
  }

  function hideProgress() {
    $(".display-loader").removeClass("show");
  }

  $("#go_back_btn").click(function () {
    location.href = "../index.html";
  });

  $.when($.get("/getSingalLand?id=" + application_id)).done(function (_res) {
    console.log("I am into debug mode");
    //console.log(_res)
    $(".border_main").show();
    var land_detail = _res.data[0];
    console.log(land_detail);
    if (land_detail.users_profile.length <= 0) {
      $(".term_row, .expiry_row").hide();
      $.when($.get("/getSingleUser?id=" + land_detail.user_id)).done(function (
        _res
      ) {
        land_detail.users_profile = _res.data;
        if (land_detail.users_profile[0].userType == "1") {
          $(".name_text").html(land_detail.users_profile[0].department);
        } else {
          $(".name_text").html(
            land_detail.users_profile[0].firstname +
              " " +
              land_detail.users_profile[0].middlename +
              " " +
              land_detail.users_profile[0].lastname
          );
        }
      });
    } else {
      $(".term_row, .expiry_row").show();
      if (land_detail.users_profile[0].userType == "1") {
        $(".name_text").html(land_detail.users_profile[0].department);
      } else {
        $(".name_text").html(
          land_detail.users_profile[0].firstname +
            " " +
            land_detail.users_profile[0].middlename +
            " " +
            land_detail.users_profile[0].lastname
        );
      }
      $(".term_text").html(land_detail.lease_term);
      var expiry_date = moment(land_detail.notaryDate).add(
        parseInt(land_detail.lease_term.split(" ")[0]),
        land_detail.lease_term.split(" ")[1]
      );
      $(".expiration_date_text").html(
        moment(expiry_date).format("DD MMM YYYY")
      );
    }
    $(".record_text").html(land_detail._id);
    $(".area_text").html(land_detail.marked_area.replace(/(^"|"$)/g, ""));
    $(".notary_date_text").html(
      moment(land_detail.notaryDate).format("DD MMM YYYY")
    );

    var html = "";
    $.each(land_detail.land_markers, function (index, markers) {
      var alpha = index + 65;
      var lat_lng = markers.split(", ");

      console.log(alpha);
      html +=
        '<tr>\
             <th scope="row">' +
        String.fromCharCode(alpha) +
        "</th>\
             <td>" +
        lat_lng[0] +
        "</td>\
             <td>" +
        lat_lng[1] +
        "</td>\
         </tr>";
    });
    $("#lat_lng_table_body").html(html);
    var lat_lng = land_detail.land_markers[0];
    var lat_lng_arr = lat_lng.split(", ");
    $("#map_zoom").val(land_detail.zoom_level);
    $("#lat_input_text").val(lat_lng_arr[0]).trigger("change");
    $("#lng_input_text").val(lat_lng_arr[1]).trigger("change");
    $("#array_lat_lng_text")
      .val(JSON.stringify(land_detail.land_markers))
      .trigger("change");
    console.log("I am into debug mode of showcertifcate");
    var qr_url = url + "/showCertificate?id=" + application_id;
    qrcode.makeCode(qr_url);

    setTimeout(() => {
      html2canvas($(".cert_div_main"), {
        useCORS: true,
        onrendered: function (canvas) {
          var imgData = canvas.toDataURL("image/pdf");
          var imgdata2 = imgData.replace(/^data:image\/(png|jpg);base64,/, "");
          // console.log(imgdata2)

          var block = imgData.split(";");
          // Get the content type of the image
          var contentType = block[0].split(":")[1]; // In this case "image/gif"
          // get the real base64 content of the file
          var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

          // Convert it to a blob to upload
          var blob = b64toBlob(realData, contentType);

          // Create a FormData and append the file with "image" as parameter name
          var formDataToUpload = new FormData();
          formDataToUpload.append("file", blob);
          formDataToUpload.append("user_id", user_id);
          formDataToUpload.append("app_id", application_id);
          console.log("I am into debug mode before upload");
          $.ajax({
            url: url + "/uploadCertificate",
            contentType: false,
            processData: false,
            cache: false,
            data: formDataToUpload,
            type: "post",
            success: function (response) {
              console.log("I am into debug mode after upload", response);
              console.log(response);
              hideProgress();
              $("#print_btn").attr("href", url + "/" + response.link);
            },
          });
        },
      });
    }, 2000);
  });

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
});
