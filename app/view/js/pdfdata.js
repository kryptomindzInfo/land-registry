$(window).on("load", function () {

    "use strict"
    var urls = new URL(window.location.href);
    var row = urls.searchParams.get("id");
    var ipfsurl = globals.IPFS_URL;

    

    function certificateData(data) {
        var has_certi = data.isExtraApprovalRequired
        if (has_certi == 0) {
            $('#preview_has_certificate_text').html('No')
        } else if (has_certi == 1) {
            $('#preview_has_certificate_text').html('Yes')
        }certificateData

        var c_no = data.certificate_no
        $('#preview_certificate_no_text').html(c_no)
    }

    function certificateDatatwo(data) {
        

        var dist_data,rgn_data,ward_data;
        $.when($.get('/getSingleRegion?id='+data.region)).done(function(_res){
            rgn_data = _res.data[0];
            $('#preview_region_text').html(rgn_data.name)
        })

        $.when($.get('/getSingleDistrict?id='+data.district)).done(function(_res){
            dist_data = _res.data[0];
            $('#preview_district_text').html(dist_data.name)
        })

        $.when($.get('/getSingleWard?id='+data.ward_no)).done(function(_res){
            ward_data = _res.data[0];
            console.log(ward_data);
            $('#preview_ward_no_text').html(ward_data.name)
        })
        
        $('#preview_block_no_text').html(data.block_no)
        $('#preview_plot_no_text').html(data.plot_no)
        $('#preview_location_text').html(data.location)
        $('#preview_address_text').html(data.address)
        $('#preview_feature_text').html(data.land_feature)
        $('#preview_length_text').html(data.land_height)
        $('#preview_breadth_text').html(data.land_width)
        $('#preview_area_text').html(data.land_area)
        $('#preview_marked_area_text').html(data.marked_area)
        $('#preview_village_text').html(data.village)
        $('#preview_kitongoji_text').html(data.kitongoji)
        $('#preview_parcel_north_text').html(data.npnorth)
        $('#preview_parcel_south_text').html(data.npsouth)
        $('#preview_parcel_east_text').html(data.npeast)
        $('#preview_parcel_west_text').html(data.npwest)
    }

    function certificateDataThree(data) {
        if (data.land_purpose == 0) {
            $('#preview_land_purpose_text').html('Housing')
        } else if (data.land_purpose == 1) {
            $('#preview_land_purpose_text').html('Government Farming')
        } else if (data.land_purpose == 2) {
            $('#preview_land_purpose_text').html('Police')
        } else if (data.land_purpose == 3) {
            $('#preview_land_purpose_text').html('Hospital')
        } else if (data.land_purpose == 4) {
            $('#preview_land_purpose_text').html('Forest')
        } else if (data.land_purpose == 5) {
            $('#preview_land_purpose_text').html('National Parks')
        } else if (data.land_purpose == 6) {
            $('#preview_land_purpose_text').html('Mineral Areas')
        } else if (data.land_purpose == 7) {
            $('#preview_land_purpose_text').html('Government Institutions Authorities')
        } else if (data.land_purpose == 8) {
            $('#preview_land_purpose_text').html('Others')
        }
    }

    function certificateDataFive(data) {
        var html1 ='';
        if(data.upload_title){
            if(data.upload_title.length > 0){
                data.upload_title.map(function (upload) {
                    console.log(upload)
                    html1 += ' <div class="row">\
                    <div class="col-lg-12">\
                        <div class="form-group">\
                            <label class="preview_heading">Document Name: '+ upload.filename + '</label>\
                            <span class="preview_content" id="preview_upload_title"><a href="'+ ipfsurl + '/ipfs/' + upload.filehash + '" target="_blank">' + upload.filehash + '</a></span>\
                        </div>\
                    </div>\
                    </div>';
                })
                $('.preview_upload_data, .preview_upload_data_text').html(html1)
            }
        }

        //window.print();
        
    }

    function certificateDataFour(data) {
        $('#preview_ownership_type, #preview_ownership_details_text').html(data.ownership_details)
    }

    
    $.when($.get('/getSingalLand?id='+row)).done(function (_res) {
        var data=_res.data[0];
        console.log(data)
        $("#map_zoom").val(data.zoom_level)
        $("#lat_input_text").val(data.land_lat)
        $("#lng_input_text").val(data.land_long).trigger("change")
        $('#array_lat_lng_text').val(JSON.stringify(data.land_markers)).trigger("change")
        
        certificateData(data)
        certificateDatatwo(data)
        certificateDataThree(data)
        certificateDataFour(data)
        certificateDataFive(data)

        var thtml = ''

        data.land_markers.map(function (lat_lng, index) {
            var lat_lng_arr = lat_lng.split(", ")
            thtml += '<tr>\
                    <th scope="row">'+ (index + 1) + '</th>\
                    <td>'+ lat_lng_arr[0] + '</td>\
                    <td>'+ lat_lng_arr[1] + '</td>\
                </tr>'
        })

        $('#lat_lng_table_body').html(thtml)

         setTimeout(() => {
            window.print()
            window.close();
         }, 3000);
         //$("#preview_print_btn").trigger('click')
        //$(".pdf_content").hide()
        //location.reload();
        
    })

    $('#preview_print_btn').click(function () {
        window.print()
    })


})