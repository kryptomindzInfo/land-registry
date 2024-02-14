$(window).on("load", function () {

    "use strict"
    var urls = new URL(window.location.href);
    var row = urls.searchParams.get("id");

    function detailsone(data){
        var c_type = data.certificate_type
        var c_val = ''
        if(c_type == 0) {
            $('#preview_certificate_type, #preview_certificate_type_text').html('Offer Letter')
        } else if (c_type == 1) {
            $('#preview_certificate_type, #preview_certificate_type_text').html('Digital Land Title Certificate')
        } else if (c_type == 2) {       
            $('#preview_certificate_type, #preview_certificate_type_text').html('Certificate of Customary Right of Ownership')
        } else if (c_type == 3) {       
            $('#preview_certificate_type, #preview_certificate_type_text').html('Non Digital Land Title Certificate')
        } else if (c_type == 4) {       
            $('#preview_certificate_type, #preview_certificate_type_text').html(globals.RL)
        }


        var has_certi = data.isExtraApprovalRequired
        if (has_certi == 0) {
            $('#preview_has_certificate, #preview_has_certificate_text').html('No')
        } else if (has_certi == 1) {
            $('#preview_has_certificate, #preview_has_certificate_text').html('Yes')
        }

        var c_no = data.certificate_no
        $('#preview_certificate_no, #preview_certificate_no_text').html(c_no)
    }

    function detailstwo(data){
        $('#preview_block_no,#preview_block_no_text').html(data.block_no)
                
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
    function detailsthree(data){
        $('.commer_type').hide();
        $('.resi_type').hide();
        //$('#preview_purpose_type').html($(".purpose_select:checked").val())

        if (data.land_purpose_type == 0) {
            $('#preview_land_purpose_text').html('Residential');
            var r_type = data.land_purpose
            $('.resi_type').show();
            if (r_type == 0) {
                $('#preview_residence_type_text').html('Public Housing')
            } else if (r_type == 1) {
                $('#preview_residence_type_text').html('Private Housing')
            } else if (r_type == 2) {
                $('#preview_residence_type_text').html('Housing/Farming')
            }

        } else {
            $('.resi_type').hide();
            $('.commer_type').show();
        }
        if (data.land_purpose_type == 1) {
            $('.commer_type').show();
            $('#preview_land_purpose_text').html('Commercial');
            var co_type = data.land_purpose
            
            if (co_type == 0) {
                $('#preview_commercial_type_text').html('Public/Industries')
            } else if (co_type == 1) {
                $('#preview_commercial_type_text').html('Forest/Farm')
            } else if (co_type == 2) {
                $('#preview_commercial_type_text').html('Mineral Areas')
            } else if (co_type == 3) {
                $('#preview_commercial_type_text').html('Parks/Recreation/Amusement')
            }
        } else {
            $('.commer_type').hide();
            $('.resi_type').show();
        }
    }
    function detailsfour(data){
        var o_type = data.ownership_type
        if (o_type == 0) {
            $('#preview_ownership_type_text').html('Owner/Applicant')
        } else if (o_type == 1) {
            $('#preview_ownership_type_text').html('Group')
        } else if (o_type == 2) {
            $('#preview_ownership_type_text').html('Group with shares')
        } else if (o_type == 3) {
            $('#preview_ownership_type_text').html('Corporation')
        } else if (o_type == 4) {
            $('#preview_ownership_type_text').html('Owner with guardian')
        } else if (o_type == 5) {
            $('#preview_ownership_type_text').html('Customary')
        }

        var c_type = data.certificate_type
        if (c_type == 4) {
            $('#preview_lease_term_text').html(data.lease_term)
        }else if(c_type == 2){
            $('#preview_lease_term_text').html(data.lease_term)
        } else {
            var l_term = data.lease_term
            $('#preview_lease_term_text').html(data.lease_term)
            // if (l_term == 0) {
            //     
            // } else if (l_term == 1) {
            //     $('#preview_lease_term_text').html('66 years')
            // } else if (l_term == 2) {
            //     $('#preview_lease_term_text').html('99 years')
            // }else if(l_term == ''){
            //     $('#preview_lease_term_text').html('')
            // }
        }

        var l_type = data.lease_term_type
        if (l_type == 0) {
            $('#preview_lease_type_text').html('Mda Maalumu')
            $('#preview_term_years_text').html(data.lease_term)
        } else if (l_type == 1) {
            $('#preview_lease_type_text').html('Hakuna Mda Maalumu')
            $('#preview_term_years_text').html(data.lease_term)
        }

        $('#preview_lease_start_date_text').html(data.lease_start_date)
        var html2 = ''
        data.users_profile.map(function (users, index) {
            console.log()
            var genderapplicant = users.gender
                var gender_applicant_val = ''
                if (genderapplicant == 0) {
                    gender_applicant_val = 'Male'
                } else if (genderapplicant == 1) {
                    gender_applicant_val = 'Female'
                } else if (genderapplicant == 2) {
                    gender_applicant_val = 'Other'
                }
    
                var maritialapplicant = users.maritial_status
                var maritial_applicant_val = ''
                if (maritialapplicant == 0) {
                    maritial_applicant_val = 'Single'
                } else if (maritialapplicant == 1) {
                    maritial_applicant_val = 'Married'
                } else if (maritialapplicant == 2) {
                    maritial_applicant_val = 'Divorced'
                }
                var appli_id='';
                var nationalityapplicant = users.nationality_select
                var nationality_applicant_val = ''
                if (nationalityapplicant == 0) {
                    appli_id = 'Nationality ID';
                    nationality_applicant_val = 'Tanzanian'
                } else if (nationalityapplicant == 1) {
                    nationality_applicant_val = 'Non-Tanzanian'
                    appli_id = 'Investor ID';
                }
            if(o_type == 0) {
                

                

                var heading_text = ''

                if(index == 0) {
                    heading_text = 'Applicant'
                } else {
                    heading_text = 'Spouse'
                }
                var display = ''
                if(index == 1) {
                    display = 'display: none;'
                } else {
                    display = 'display: block;'
                }                    

                html2 += ' <div class="kt-heading kt-heading--md">Owner -' + heading_text + '</div>\
                <div class="row">\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">First Name : </label>\
                        <span class="form-control" id="preview_land_firstname_text">'+ users.firstname + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Middle Name : </label>\
                        <span class="form-control" id="preview_land_middlename_text">'+ users.middlename + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Last Name : </label>\
                        <span class="form-control" id="preview_land_lastname_text">'+ users.lastname + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Gender : </label>\
                        <span class="form-control" id="preview_land_gender_text">'+ gender_applicant_val + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Date Of Birth : </label>\
                        <span class="form-control" id="preview_land_birthdate_text">'+ users.birthdate + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 " style="'+ display +'">\
                        <label class=" col-form-label">Maritial Status : </label>\
                        <span class="form-control" id="preview_land_maritialstatus_text">'+ maritial_applicant_val + '</span>\
                    </div>\
                </div>\
                <div class="kt-heading kt-heading--md border_line">Professional Details</div>\
                <div class="row">\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Level of Education : </label>\
                        <span class="form-control" id="preview_land_leveledu_text">'+ users.leveledu + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Employment : </label>\
                        <span class="form-control" id="preview_land_employment_text">'+ users.employment + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Current Address : </label>\
                        <span class="form-control" id="preview_land_currentaddress_text">'+ users.residence + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Nationality : </label>\
                        <span class="form-control" id="preview_land_nationality_text">'+ nationality_applicant_val + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">'+ appli_id +' : </label>\
                        <span class="form-control" id="preview_land_uniqueid_text">'+ users.unique_id + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Phone No : </label>\
                        <span class="form-control" id="preview_land_phone_no_text">'+ users.phone_no + '</span>\
                    </div>\
                </div>\
                '

            } else if (o_type == 4) {
                var heading_text = ''
                if(index == 0) {
                    heading_text = "Owner"
                } else {
                    heading_text = "Guardian"
                }

                var display = ''
                if(index == 0) {
                    display = 'display: none;'
                } else {
                    display = 'display: block;'
                }

                html2 += ' <div class="kt-heading kt-heading--md">Owner -' + heading_text + '</div>\
                <div class="row">\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">First Name : </label>\
                        <span class="form-control" id="preview_land_firstname_text">'+ users.firstname + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Middle Name : </label>\
                        <span class="form-control" id="preview_land_middlename_text">'+ users.middlename + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Last Name : </label>\
                        <span class="form-control" id="preview_land_lastname_text">'+ users.lastname + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Gender : </label>\
                        <span class="form-control" id="preview_land_gender_text">'+ gender_applicant_val + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Date Of Birth : </label>\
                        <span class="form-control" id="preview_land_birthdate_text">'+ users.birthdate + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 " style="'+ display +'">\
                        <label class=" col-form-label">Maritial Status : </label>\
                        <span class="form-control" id="preview_land_maritialstatus_text">'+ maritial_applicant_val + '</span>\
                    </div>\
                </div>\
                <div class="kt-heading kt-heading--md border_line">Professional Details</div>\
                <div class="row">\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Level of Education : </label>\
                        <span class="form-control" id="preview_land_leveledu_text">'+ users.leveledu + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Employment : </label>\
                        <span class="form-control" id="preview_land_employment_text">'+ users.employment + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Current Address : </label>\
                        <span class="form-control" id="preview_land_currentaddress_text">'+ users.residence + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Nationality : </label>\
                        <span class="form-control" id="preview_land_nationality_text">'+ nationality_applicant_val + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">'+ appli_id +' : </label>\
                        <span class="form-control" id="preview_land_uniqueid_text">'+ users.unique_id + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Phone No : </label>\
                        <span class="form-control" id="preview_land_phone_no_text">'+ users.phone_no + '</span>\
                    </div>\
                </div>\
                '     
            } else { 

                html2 += ' <div class="kt-heading kt-heading--md">Owner -' + (index+1) + '</div>\
                <div class="row">\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">First Name : </label>\
                        <span class="form-control" id="preview_land_firstname_text">'+ users.firstname + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Middle Name : </label>\
                        <span class="form-control" id="preview_land_middlename_text">'+ users.middlename + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Last Name : </label>\
                        <span class="form-control" id="preview_land_lastname_text">'+ users.lastname + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Gender : </label>\
                        <span class="form-control" id="preview_land_gender_text">'+ gender_applicant_val + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Date Of Birth : </label>\
                        <span class="form-control" id="preview_land_birthdate_text">'+ users.birthdate + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Maritial Status : </label>\
                        <span class="form-control" id="preview_land_maritialstatus_text">'+ maritial_applicant_val + '</span>\
                    </div>\
                </div>\
                <div class="kt-heading kt-heading--md border_line">Professional Details</div>\
                <div class="row">\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Level of Education : </label>\
                        <span class="form-control" id="preview_land_leveledu_text">'+ users.leveledu + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Employment : </label>\
                        <span class="form-control" id="preview_land_employment_text">'+ users.employment + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Current Address : </label>\
                        <span class="form-control" id="preview_land_currentaddress_text">'+ users.residence + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Nationality : </label>\
                        <span class="form-control" id="preview_land_nationality_text">'+ nationality_applicant_val + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">'+ appli_id +' : </label>\
                        <span class="form-control" id="preview_land_uniqueid_text">'+ users.unique_id + '</span>\
                    </div>\
                    <div class="form-group col-md-4 col-lg-4 col-sm-12 ">\
                        <label class=" col-form-label">Phone No : </label>\
                        <span class="form-control" id="preview_land_phone_no_text">'+ users.phone_no + '</span>\
                    </div>\
                </div>\
                '     
            }

            
        })

        $(".preview_owner_data_text").html(html2)
        
    }
    function detailsfive(data){
        var html1 ='';
        if(data.upload_title){
            if(data.upload_title.length > 0){
        data.upload_title.map(function (upload) {
            console.log(upload)
            html1 += ' <div class="row">\
            <div class="col-lg-12">\
                <div class="form-group">\
                    <label class="preview_heading">Document Name: '+ upload.filename + '</label>\
                    <span class="preview_content" id="preview_upload_title"><a href="'+ globals.IPFS_URL + '/ipfs/' + upload.filehash + '" target="_blank">' + upload.filehash + '</a></span>\
                </div>\
            </div>\
            </div>';
        })
        $('.preview_upload_data_text').html(html1)
        }
    }
        
    }

    $.when($.get('/getSingalLand?id='+row)).done(function (_res) {
        var data=_res.data[0];
        console.log(data)
        $("#map_zoom").val(data.zoom_level)
        $("#lat_input_text").val(data.land_lat)
        $("#lng_input_text").val(data.land_long).trigger("change")
        $('#array_lat_lng_text').val(JSON.stringify(data.land_markers)).trigger("change")
        var c_type = data.certificate_type

        if(c_type == 0) {
            $('.digi_div').show()
            $('.nondigi_div').hide()
        } else if (c_type == 1) {
            $('.digi_div').show()
            $('.nondigi_div').hide()
        } else if (c_type == 2) {       
            $('.digi_div').hide()
            $('.nondigi_div').show()
        } else if (c_type == 3) {       
            $('.digi_div').show()
            $('.nondigi_div').hide()
        } else if (c_type == 4) {       
            $('.digi_div').show()
            $('.nondigi_div').hide()
        }
        detailsone(data)
        detailstwo(data)
        detailsthree(data)
        detailsfour(data)
        detailsfive(data)

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
})