$(window).on("load", function () {

    "use strict";
    var urls = new URL(window.location.href);
    var olduser = JSON.parse(sessionStorage.userData)[0];
    var id = urls.searchParams.get("id");
    var uploadtitle
    var user_data
    var url = globals.URL;
    var ipfsurl = globals.IPFS_URL;

    var districts;
    // $.when($.get('/getRegions')).done(function (_res) {

    // })


    /*============================================
                REGION, WARD, DISTRICT FUNCTIONS
    =============================================*/

    $.when($.get('/getRegions')).done(function (_res) {
        var regions = _res.data;
        console.log()
        regions.map(function (region) {
            $('<option>').val(region.id).text(region.name).appendTo('#region');
        })
        callAPI()
    })

    $('#district').attr('disabled', true)
    $('#ward').attr('disabled', true)

    $('#region').change(function () {
        $('#district').find('option').remove();
        $('#ward').find('option').remove();
        $('#ward').attr('disabled', true)
        $('<option>').val("").text("Select Ward").appendTo('#ward');
        $('<option>').val("").text("Select District").appendTo('#district');
        var region = $(this).val()
        var districts_arr = []
        $.when($.get('/getDistricts?id=' + region)).done(function (_res) {
            var districts = _res.data
            districts.map(function (district) {
                if (district.region_id == region) {
                    districts_arr.push(district)
                }
            })

            if (region != "") {
                $('#district').removeAttr('disabled')

                districts_arr.map(function (district) {
                    $('<option>').val(district.id).text(district.name).appendTo('#district');
                })
            } else {
                $('#ward').attr('disabled', true)
                $('#district').attr('disabled', true)
            }
        })




    })

    function setDistrict(data) {
        var region = data.region
        var districts_arr = []
        $.when($.get('/getDistricts?id=' + region)).done(function (_res) {
            var districts = _res.data
            districts.map(function (district) {
                if (district.region_id == region) {
                    districts_arr.push(district)
                }
            })

            if (region != "") {
                $('#district').removeAttr('disabled')

                districts_arr.map(function (district) {
                    $('<option>').val(district.id).text(district.name).appendTo('#district');
                })
            } else {
                $('#ward').attr('disabled', true)
                $('#district').attr('disabled', true)
            }
            $("#district").val(data.district)
        })
    }

    function setWard(data) {
        var district = data.district
        var wards_arr = []
        $.when($.get('/getWards?id=' + district)).done(function (_res) {
            var wards = _res.data
            wards.map(function (ward) {
                if (ward.district_id == district) {
                    wards_arr.push(ward)
                }
            })

            if (district != "") {
                $('#ward').removeAttr('disabled')

                wards_arr.map(function (ward) {
                    $('<option>').val(ward.id).text(ward.name).appendTo('#ward');
                })
            } else {
                $('#ward').attr('disabled', true)
            }
            $("#ward").val(data.ward_no)
        })
    }

    $('#district').change(function () {
        $('#ward').find('option').remove();
        $('<option>').val("").text("Select Ward").appendTo('#ward');
        var district = $(this).val()
        var wards_arr = []

        $.when($.get('/getWards?id=' + district)).done(function (_res) {
            var wards = _res.data
            wards.map(function (ward) {
                if (ward.district_id == district) {
                    wards_arr.push(ward)
                }
            })

            if (district != "") {
                $('#ward').removeAttr('disabled')

                wards_arr.map(function (ward) {
                    $('<option>').val(ward.id).text(ward.name).appendTo('#ward');
                })
            } else {
                $('#ward').attr('disabled', true)
            }

        })

    })


    $('#leasedate, #leasedate_validate').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100y:c+nn',
        maxDate: '-1d'
    });

    $('input[name^=birthdate], input[name^=birthdate_text],input[name^=guard_birthdate],input[name^=minor_birthdate],input[name^=applicant_birthdate],input[name^=spouse_birthdate]').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-100y:c+nn',
        maxDate: '-1d'
    });

    hidegenProgress();
    $(".cloning_demographic").hide();
    $(".cloning_btn").hide();
    $(".close_div").hide();
    $("#resedential_drpdwn").hide();
    $("#commercial_drpdwn").hide();
    $(".minor").hide();
    $(".spouse").hide();
    $("#certi_bread").hide();

    $(".nondigi_div").hide();
    $(".offerdiv").hide();
    $("#term_div").hide();
    $(".hideadd").hide();
    $("#occupancy_term").hide();
    $('.commer_type').hide();
    $('.resi_type').hide();
    $('.address_similar_hide').hide();
    $(".features-dv form ul li input:checkbox").on("click", function () { return false; });

    function callAPI(params) {
        $.when($.get('/getSingalLand?id=' + id)).done(function (_res) {
            var data = _res.data[0];
            console.log(data);
            user_data = _res.data[0]
            uploadtitle = data.upload_title

            if (uploadtitle == null) {
                $('#upload_file_table').hide()
            }

            var thtml = ''
            console.log("m", data.upload_title)
            if (data.upload_title != null) {
                data.upload_title.map(function (title, index) {
                    thtml += '<tr>\
                    <th scope="row">'+ (index + 1) + '</th>\
                    <td>'+ title.filename + '</td>\
                    <td>'+ title.filehash + '</td>\
                    <td>\
                        <a title="Delete" data-file="'+ index + '" id="delete_upload_file" class="btn btn-sm btn-clean btn-icon btn-icon-md">\
                        <i class="la la-trash"></i>\
                        </a>\
                    </td>\
                </tr>'
                })
            } else {
                $('#upload_file_table').hide()
            }



            $('#upload_file_table_body').on('click', 'tr #delete_upload_file', function (e) {
                e.preventDefault();
                data.upload_title.splice($(this).data('file'), 1);
                uploadtitle.splice($(this).data('file'), 1);
                $(this).parents('tr').remove()

            });

            $('#upload_file_table_body').html(thtml)

            $('#certificate_type').val(data.certificate_type).trigger('change')
            if (data.certificate_type == 0 || data.certificate_type == 3 || data.certificate_type == 4) {
                $("input[name=certificate_que][value=" + data.isExtraApprovalRequired + "]").attr('checked', true).trigger('change');
            }
            $("#certificate_no").val(data.certificate_no)

            // var dist_data,rgn_data,ward_data;
            //     $.when($.get('/getSingleRegion?id='+data.region)).done(function(_res){
            //         rgn_data = _res.data[0];
            //         $('#region').val(rgn_data.name).trigger('change')
            //     })

            //     $.when($.get('/getSingleDistrict?id='+data.district)).done(function(_res){
            //         dist_data = _res.data[0];
            //         $('#district').html(dist_data.name).trigger('change')
            //     })

            //     $.when($.get('/getSingleWard?id='+data.ward_no)).done(function(_res){
            //         ward_data = _res.data[0];
            //         console.log(ward_data);
            //         $('#preview_ward_no').html(ward_data.name)
            //     })

            $("#region").val(data.region)
            setDistrict(data)
            setWard(data)
            // 
            $("#location").val(data.location)
            $("#block").val(data.block_no).trigger('change')
            $("#plot").val(data.plot_no).trigger('change')

            $("#village").val(data.village).trigger('change')
            $("#kitongoji").val(data.kitongoji).trigger('change')
            $("#address").val(data.address)
            $("#land_distict_feature").val(data.land_feature)

            $("#np_north").val(data.npnorth)
            $("#np_south").val(data.npsouth)
            $("#np_east").val(data.npeast)
            $("#np_west").val(data.npwest)

            $("#landheight").val(data.land_height)
            $("#landwidth").val(data.land_width)
            $("#landarea").val(data.land_area)

            $("#lat").val(data.land_lat);
            $("#long").val(data.land_long).trigger('change')
            document.getElementById('map_zoom').value = data.zoom_level
            $("#array_lat_lng").val(JSON.stringify(data.land_markers)).trigger('change')

            $("input[name=purpose_select][value=" + data.land_purpose_type + "]").attr('checked', true).trigger('change')
            if (data.land_purpose_type == 0) { $("#residential_select").val(data.land_purpose) } else { $("#commercial_select").val(data.land_purpose) }

            $("input[name=ownership_type][value=" + data.ownership_type + "]").attr('checked', true).trigger('change')
            if (data.ownership_type == 0) {
                if (data.users_profile[0].isapplicant == 1) {
                    fillowners(0, 0, 1)
                } else {
                    fillowners(0, 1, 0)
                }
            } else if (data.ownership_type == 4) {
                if (data.users_profile[0].isguardian == 1) {
                    fillowners(4, 0, 1)
                } else {
                    fillowners(4, 1, 0)
                }
            } else {
                fillowners(5, 0, 0)
            }
            //$("#lease_term").val(data.lease_term);
            $("#lease_term option:contains(" + data.lease_term + ")").attr('selected', 'selected');
            $("#leaseterm_select").val(data.lease_term_type).trigger('change');
            $("#term").val(data.lease_term.split(" ")[0])
            $("#occupancy_term").val(data.lease_term.split(" ")[0])
            $('#leasedate').datepicker("setDate", new Date(data.lease_start_date));


            function fillowners(owner, app_index, co_owner_index) {
                if (owner == 0) {
                    $("#applicant_firstname").val(olduser.firstname)
                    $("#applicant_lastname").val(olduser.lastname)
                    $("#applicant_middlename").val(olduser.middlename)
                    $("#applicant_leveledu").val(olduser.education)
                    $("input[name=applicant_gender_type][value=" + olduser.gender + "]").attr('checked', true)
                    $("input[name=applicant_maritial_status][value=" + olduser.maritial_status + "]").attr('checked', true).trigger('change')
                    $('#applicant_birthdate').datepicker("setDate", new Date(olduser.birthdate));
                    $("#applicant_employment").val(olduser.employment)
                    $("#applicant_residence").val(olduser.address)
                    $("input[name=applicant_nationality_select][value=" + olduser.nationality_select + "]").attr('checked', true).trigger('change')
                    $("#applicant_nationality_id").val(olduser.uniqueId)
                    $("#applicant_phone_no").val(olduser.mobile)

                    $("#applicant_firstname").attr("disabled", "")
                    $("#applicant_lastname").attr("disabled", "")
                    $("#applicant_middlename").attr("disabled", "")
                    $("#applicant_leveledu").attr("disabled", "")
                    $(".applicant_nationality_select").attr("disabled", "");
                    $(".applicant_gender_type").attr("disabled", "");
                    $(".applicant_maritial_status").attr("disabled", "");
                    $('#applicant_birthdate').attr("disabled", "");
                    $("#applicant_employment").attr("disabled", "")
                    $("#applicant_residence").attr("disabled", "")
                    $("#applicant_nationality_id").attr("disabled", "")
                    $("#applicant_phone_no").attr("disabled", "")
                    if (data.users_profile[co_owner_index]) {
                        $("#spouse_firstname").val(data.users_profile[co_owner_index].firstname)
                        $("#spouse_lastname").val(data.users_profile[co_owner_index].lastname)
                        $("#spouse_middlename").val(data.users_profile[co_owner_index].middlename)
                        $("#spouse_leveledu").val(data.users_profile[co_owner_index].leveledu)
                        $("input[name=spouse_gender_type][value=" + data.users_profile[co_owner_index].gender + "]").attr('checked', true)
                        $('#spouse_birthdate').datepicker("setDate", new Date(data.users_profile[co_owner_index].birthdate));
                        $("#spouse_employment").val(data.users_profile[co_owner_index].employment)
                        $("input[name=spouse_nationality_select][value=" + data.users_profile[co_owner_index].nationality_select + "]").attr('checked', true).trigger('change')
                        $("#spouse_nationality_id").val(data.users_profile[co_owner_index].unique_id)
                        $("#spouse_phone_no").val(data.users_profile[co_owner_index].phone_no)
                    }
                } else if (owner == 4) {
                    $("#guard_firstname").val(olduser.firstname)
                    $("#guard_lastname").val(olduser.lastname)
                    $("#guard_middlename").val(olduser.middlename)
                    $("#guard_leveledu").val(olduser.education)
                    $("input[name=guard_gender_type][value=" + olduser.gender + "]").attr('checked', true)
                    $("input[name=guard_maritial_status][value=" + olduser.maritial_status + "]").attr('checked', true).trigger('change')
                    $('#guard_birthdate').datepicker("setDate", new Date(olduser.birthdate));
                    $("#guard_employment").val(olduser.employment)
                    $("#guard_residence").val(olduser.address)
                    $("input[name=guard_nationality_select][value=" + olduser.nationality_select + "]").attr('checked', true).trigger('change')
                    $("#guard_nationality_id").val(olduser.uniqueId)
                    $("#guard_phone_no").val(olduser.mobile)

                    $(".guard_nationality_select").attr("disabled", "");
                    $(".guard_gender_type").attr("disabled", "");
                    $(".guard_maritial_status").attr("disabled", "");
                    $("#guard_nationality_id").attr("disabled", "");
                    $("#guard_phone_no").attr("disabled", "");
                    $("#guard_firstname").attr("disabled", "");
                    $("#guard_middlename").attr("disabled", "");
                    $("#guard_lastname").attr("disabled", "");
                    $("#guard_leveledu").attr("disabled", "");
                    $("#guard_birthdate").attr("disabled", "");
                    $("#guard_employment").attr("disabled", "");
                    $("#guard_residence").attr("disabled", "");

                    $("#minor_firstname").val(data.users_profile[co_owner_index].firstname)
                    $("#minor_lastname").val(data.users_profile[co_owner_index].lastname)
                    $("#minor_middlename").val(data.users_profile[co_owner_index].middlename)
                    $("#minor_leveledu").val(data.users_profile[co_owner_index].leveledu)
                    $("input[name=minor_gender_type][value=" + data.users_profile[co_owner_index].gender + "]").attr('checked', true)
                    $('#minor_birthdate').datepicker("setDate", new Date(data.users_profile[co_owner_index].birthdate));
                    $("#minor_residence").val(data.users_profile[co_owner_index].residence)
                    $("input[name=minor_nationality_select][value=" + data.users_profile[co_owner_index].nationality_select + "]").attr('checked', true).trigger('change')
                    $("#minor_nationality_id").val(data.users_profile[co_owner_index].unique_id)
                    $("#minor_phone_no").val(data.users_profile[co_owner_index].phone_no)
                } else {
                    data.users_profile.map(function (user, index) {
                        if (index > 0) {
                            $('#add_menber_btn').click()
                        }
                    })
                    $('.owner_user').each(function (index) {
                        if (index == 0) {
                            $(this).find("#firstname").val(olduser.firstname)
                            $(this).find("#lastname").val(olduser.lastname)
                            $(this).find("#middlename").val(olduser.middlename)
                            $(this).find("#leveledu").val(olduser.education)
                            $(this).find("input[id=gender_type][value=" + olduser.gender + "]").attr('checked', true)
                            $(this).find("input[class=maritial_status][value=" + olduser.maritial_status + "]").attr('checked', true)
                            $(this).find('.birthdate').val(olduser.birthdate);
                            $(this).find("#employment").val(olduser.employment)
                            $(this).find("#residence").val(olduser.address)
                            $(this).find("input[name=nationality_select][value=" + olduser.nationality_select + "]").attr('checked', true)
                            $(this).find("#nationality_id").val(olduser.uniqueId)
                            $(this).find("#share_value").val(data.users_profile[index].share_value)
                            $(this).find("#phone_no").val(olduser.mobile)
                            $(this).find(".nationality_select").attr("disabled", "");
                            $(this).find(".gender_type").attr("disabled", "");
                            $(this).find(".maritial_status").attr("disabled", "");
                            $(this).find("#nationality_id").attr("disabled", "");
                            $(this).find("#firstname").attr("disabled", "");
                            $(this).find("#lastname").attr("disabled", "");
                            $(this).find("#middlename").attr("disabled", "");
                            $(this).find("#leveledu").attr("disabled", "");
                            $(this).find(".birthdate").attr("disabled", "");
                            $(this).find("#phone_no").attr("disabled", "");
                            $(this).find("#employment").attr("disabled", "");
                            $(this).find("#residence").attr("disabled", "");
                        } else {
                            $(this).find("#firstname").val(data.users_profile[index].firstname)
                            $(this).find("#lastname").val(data.users_profile[index].lastname)
                            $(this).find("#middlename").val(data.users_profile[index].middlename)
                            $(this).find("#leveledu").val(data.users_profile[index].leveledu)
                            $(this).find("input[id=gender_type][value=" + data.users_profile[index].gender + "]").attr('checked', true)
                            $(this).find("input[class=maritial_status][value=" + data.users_profile[index].maritial_status + "]").attr('checked', true)
                            $(this).find('#birthdate').datepicker("setDate", new Date(data.users_profile[index].birthdate));
                            $(this).find("#employment").val(data.users_profile[index].employment)
                            $(this).find("#residence").val(data.users_profile[index].residence)
                            $(this).find("input[name=nationality_select][value=" + data.users_profile[index].nationality_select + "]").attr('checked', true)
                            $(this).find("#nationality_id").val(data.users_profile[index].unique_id)
                            $(this).find("#share_value").val(data.users_profile[index].share_value)
                            $(this).find("#phone_no").val(data.users_profile[index].phone_no)
                        }

                    })
                }

            }



        })
    }




    /*==============================================
                      SETTING HEIGHT OF DIVS
    ===============================================*/

    var ab_height = $(".agent-info").outerHeight();
    $(".agent-img").css({
        "height": ab_height
    });




    /*==============================================
                    SMOOTH SCROLLING
    ===============================================*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // document.querySelector(this.getAttribute('href')).scrollIntoView({
            //         behavior: 'smooth'
            //     });
        });
    });

    /*==============================================
                      DROPDOWN EFFECT
    ===============================================*/


    $('.dropdown').on('show.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
    });

    $('.dropdown').on('hide.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
    });


    /*==============================================
                      ALERT FUNCTIONS
    ===============================================*/



    $(".popular-listing .card .card-footer a .la-heart-o").on("click", function () {
        $(".alert-success").addClass("active");
        return false;
    });
    $(".popular-listing .card .card-footer a .la-heart-o, .alert-success").on("click", function (e) {
        e.stopPropagation();
    });

    $(".close-alert").on("click", function () {
        $(".alert-success").removeClass("active");
        return false;
    });

    function showgenProgress() {
        $('#loader-gen-wrapper').show();
    }

    function hidegenProgress() {
        $('#loader-gen-wrapper').hide();
    }

    // function showProgress() {
    //     $('.display-loader').addClass('show');
    // }

    // function hideProgress() {
    //     $('.display-loader').removeClass('show');
    // }

    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    $("#landwidth").change(function () {
        calculateArea()
    })

    $("#landheight").change(function () {
        calculateArea()
    })

    function calculateArea() {
        if ($("#landwidth").val() && $("#landheight").val()) {
            var area = $("#landwidth").val() * $("#landheight").val() + ' sq.m';
            $("#landarea").val(area)
        } else {
            $("#landarea").val('')
        }
    }

    function prefillDataOfUser() {
        // $('.owner_user').each(function (index) {
        // if(index == 0) {
        $("#firstname").val(olduser.firstname)
        $("#lastname").val(olduser.lastname)
        $("#middlename").val(olduser.middlename)
        $("#leveledu").val(olduser.education)
        $("input[id=gender_type][value=" + olduser.gender + "]").attr('checked', true)
        $("input[class=maritial_status][value=" + olduser.maritial_status + "]").attr('checked', true)
        $('.birthdate').val(olduser.birthdate);
        $("#employment").val(olduser.employment)
        $("#residence").val(olduser.address)
        $("input[name=nationality_select][value=" + olduser.nationality_select + "]").attr('checked', true)
        $("#nationality_id").val(olduser.uniqueId)
        $("#phone_no").val(olduser.mobile)
        $(".nationality_select").attr("disabled", "");
        $(".gender_type").attr("disabled", "");
        $(".maritial_status").attr("disabled", "");
        //document.getElementById('nationality_id').disabled = true;
        // $("#nationality_id").attr("disabled", "");
        $("#firstname").attr("disabled", "");
        $("#lastname").attr("disabled", "");
        $("#middlename").attr("disabled", "");
        $("#leveledu").attr("disabled", "");
        $(".birthdate").attr("disabled", "");
        $("#phone_no").attr("disabled", "");
        $("#employment").attr("disabled", "");
        $("#residence").attr("disabled", "");
        // } 
        // })
    }

    $('input[type=radio][name=ownership_type]').change(function () {
        //alert(this.value);
        if (this.value == 1) {
            $(".cloning_demographic").show()
            $(".husband_wife").hide()
            $(".spouse").hide();
            $(".minor").hide()
            $(".cloning_btn").show()
            $(".close_div").hide();
            $("#nationality_id").removeAttr("disabled");
            prefillDataOfUser()
        }
        else if (this.value == 2) {
            $(".cloning_demographic").show()
            $(".minor").hide()
            $(".husband_wife").hide()
            $(".spouse").hide();
            $(".cloning_btn").show()
            $(".close_div").show();
            $("#nationality_id").removeAttr("disabled");
            prefillDataOfUser()
        } else if (this.value == 0) {
            $(".husband_wife").show();
            $(".cloning_demographic").hide()
            $(".minor").hide()
            $(".cloning_btn").hide()
            $(".close_div").hide();
            // Fil the data
            $("#applicant_firstname").val(olduser.firstname)
            $("#applicant_lastname").val(olduser.lastname)
            $("#applicant_middlename").val(olduser.middlename)
            $("#applicant_leveledu").val(olduser.education)
            $("input[name=applicant_gender_type][value=" + olduser.gender + "]").attr('checked', true)
            $("input[name=applicant_maritial_status][value=" + olduser.maritial_status + "]").attr('checked', true).trigger('change')
            $('#applicant_birthdate').datepicker("setDate", new Date(olduser.birthdate));
            $("#applicant_employment").val(olduser.employment)
            $("#applicant_residence").val(olduser.address)
            $("input[name=applicant_nationality_select][value=" + olduser.nationality_select + "]").attr('checked', true).trigger('change')
            $("#applicant_nationality_id").val(olduser.uniqueId)
            $("#applicant_phone_no").val(olduser.mobile)

            $("#applicant_firstname").attr("disabled", "")
            $("#applicant_lastname").attr("disabled", "")
            $("#applicant_middlename").attr("disabled", "")
            $("#applicant_leveledu").attr("disabled", "")
            $(".applicant_nationality_select").attr("disabled", "");
            $(".applicant_gender_type").attr("disabled", "");
            $(".applicant_maritial_status").attr("disabled", "");
            $('#applicant_birthdate').attr("disabled", "");
            $("#applicant_employment").attr("disabled", "")
            $("#applicant_residence").attr("disabled", "")
            $("#applicant_nationality_id").attr("disabled", "")
            $("#applicant_phone_no").attr("disabled", "")
        } else if (this.value == 3 || this.value == 5) {
            $(".cloning_demographic").show()
            $(".husband_wife").hide()
            $(".spouse").hide();
            $(".minor").hide()
            $(".cloning_btn").hide()
            $(".close_div").hide();
            $("#nationality_id").attr("disabled", "");
            prefillDataOfUser()
        } else if (this.value == 4) {
            $(".cloning_demographic").hide()
            $(".husband_wife").hide()
            $(".spouse").hide();
            $(".minor").show()

            // fill the data
            $("#guard_firstname").val(olduser.firstname)
            $("#guard_lastname").val(olduser.lastname)
            $("#guard_middlename").val(olduser.middlename)
            $("#guard_leveledu").val(olduser.education)
            $("input[name=guard_gender_type][value=" + olduser.gender + "]").attr('checked', true)
            $("input[name=guard_maritial_status][value=" + olduser.maritial_status + "]").attr('checked', true).trigger('change')
            $('#guard_birthdate').datepicker("setDate", new Date(olduser.birthdate));
            $("#guard_employment").val(olduser.employment)
            $("#guard_residence").val(olduser.address)
            $("input[name=guard_nationality_select][value=" + olduser.nationality_select + "]").attr('checked', true).trigger('change')
            $("#guard_nationality_id").val(olduser.uniqueId)
            $("#guard_phone_no").val(olduser.mobile)

            $(".guard_nationality_select").attr("disabled", "");
            $(".guard_gender_type").attr("disabled", "");
            $(".guard_maritial_status").attr("disabled", "");
            $("#guard_nationality_id").attr("disabled", "");
            $("#guard_phone_no").attr("disabled", "");
            $("#guard_firstname").attr("disabled", "");
            $("#guard_middlename").attr("disabled", "");
            $("#guard_lastname").attr("disabled", "");
            $("#guard_leveledu").attr("disabled", "");
            $("#guard_birthdate").attr("disabled", "");
            $("#guard_employment").attr("disabled", "");
            $("#guard_residence").attr("disabled", "");
        }

    });
    $(".nationality_select").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".nationality_select:checked").val() == 1) {
            $("#nationality_id").attr("placeholder", "Enter Invester ID");
            $('#lbl_nationality_id').html('Invester ID: <span class="astrick_color">*</span>')
        } else {
            $("#nationality_id").attr("placeholder", "Enter Nationality ID");
            $('#lbl_nationality_id').html('Nationality ID: <span class="astrick_color">*</span>')
        }

    });

    $(".certificate_que").change(function () {
        if ($(".certificate_que:checked").val() == 1) {
            $(".certi_div").show();
        } else {
            $(".certi_div").hide();
        }
    });
    /*===================For guardian =======================*/
    $(".guard_nationality_select").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".guard_nationality_select:checked").val() == 1) {
            $("#guard_nationality_id").attr("placeholder", "Enter Invester ID");
            $('#lbl_guard_nationality_id').html('Invester ID: <span class="astrick_color">*</span>')
        } else {
            $("#guard_nationality_id").attr("placeholder", "Enter Nationality ID");
            $('#lbl_guard_nationality_id').html('Nationality ID: <span class="astrick_color">*</span>')
        }

    });
    /*===================For Minor =======================*/
    $(".minor_nationality_select").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".minor_nationality_select:checked").val() == 1) {
            $("#minor_nationality_id").attr("placeholder", "Enter Invester ID");
            $('#lbl_minor_nationality_id').html('Invester ID: <span class="astrick_color">*</span>')
        } else {
            $('#lbl_minor_nationality_id').html('Nationality ID: <span class="astrick_color">*</span>')
            $("#minor_nationality_id").attr("placeholder", "Enter Nationality ID");
        }

    });

    /*=========================Husband/wife================================*/
    $(".applicant_maritial_status").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".applicant_maritial_status:checked").val() == 1) {
            $(".spouse").show();
        } else {
            $(".spouse").hide();
        }

    });
    /*===================For Applicant =======================*/
    $(".applicant_nationality_select").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".applicant_nationality_select:checked").val() == 1) {
            $("#applicant_nationality_id").attr("placeholder", "Enter Invester ID");
            $('#lbl_applicant_nationality_id').html('Invester ID: <span class="astrick_color">*</span>')
        } else {
            $("#applicant_nationality_id").attr("placeholder", "Enter Nationality ID");
            $('#lbl_applicant_nationality_id').html('Nationality ID: <span class="astrick_color">*</span>')
        }

    });
    /*===================For Spouse =======================*/
    $(".spouse_nationality_select").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".spouse_nationality_select:checked").val() == 1) {
            $("#spouse_nationality_id").attr("placeholder", "Enter Invester ID");
            $('#lbl_spouse_nationality_id').html('Invester ID: <span class="astrick_color">*</span>')
        } else {
            $("#spouse_nationality_id").attr("placeholder", "Enter Nationality ID");
            $('#lbl_spouse_nationality_id').html('Nationality ID: <span class="astrick_color">*</span>')
        }

    });

    $(".cowner_que").change(function () {
        if ($(".cowner_que:checked").val() == 1) {
            $(".cowner_hide").show();
        } else {
            $(".cowner_hide").hide();
        }
    });

    $(".address_similar").change(function () {
        if ($(".address_similar:checked").val() == 0) {
            $(".address_similar_hide").show();
            $('#minor_residence').val('')
        } else {
            $('#minor_residence').attr('value', $('#guard_residence').val());
            $(".address_similar_hide").hide();
        }
    });

    $('#guard_residence').change(function () {
        if ($(".address_similar:checked").val() == 1) {
            $('#minor_residence').attr('value', $('#guard_residence').val());
        }
    })

    /*=========================End Husband/wife================================*/

    $(".purpose_select").change(function () {
        //alert($(".nationality_select:checked").val())
        if ($(".purpose_select:checked").val() == 0) {
            $("#resedential_drpdwn").show();
            $("#commercial_drpdwn").hide();
        } else {
            $("#resedential_drpdwn").hide();
            $("#commercial_drpdwn").show();
        }

    });

    $("#leaseterm_select").change(function () {
        $("#term").val('');
        if (this.value == 0) {
            $("#term_div").show();
        } else {
            $("#term_div").hide();
        }

    });

    $(".choose_certificate").change(function () {
        $("#occupancy_term").hide();
        if ($(".choose_certificate:checked").val() == 2) {
            $("#lease_term").hide();
            $("#occupancy_term").show();
        } else {
            $("#occupancy_term").hide();
            $("#lease_term").show();
        }
    });

    $("#plot").change(function () {
        fill_landdescription();

    });
    $("#block").change(function () {
        fill_landdescription();

    });
    $("#location").change(function () {
        fill_landdescription();

    });
    $("#district").change(function () {
        fill_landdescription();
    });
    $("#ward").change(function () {
        fill_landdescription();
    });
    $("#kitongoji").change(function () {
        //alert(this.value)
        fill_landdescription();
        //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+this.value+" District, "+$("#region").val())
    })
    $("#region").change(function () {
        fill_landdescription();//$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District , "+$("#region").val())
    });

    function fill_landdescription() {
        if ($("#certificate_type").val() == 2) {
            //alert("");
            $("#land_description").val("Kitongoji: " + $("#kitongoji").val() + ", Village: " + $("#village").val() + ", Ward: " + $("#ward option:selected").text() + ", District: " + $("#district option:selected").text() + ", Region: " + $("#region option:selected").text())
        } else {
            //alert("jhjhjhhjj");
            $("#land_description").val("Plot No: " + $("#plot").val() + ", Block '" + $("#block").val() + "', " + $("#location").val() + ", " + $("#ward option:selected").text() + ", " + $("#district option:selected").text() + " District , " + $("#region option:selected").text())
        }

    }

    $(".land_secure").change(function () {
        $("#heritage_doc").hide();
        if ($(".land_secure:checked").val() == 0) {
            $("#purchased_doc").show();
            $("#heritage_doc").hide();
        } else {
            $("#purchased_doc").hide();
            $("#heritage_doc").show();
        }
    });

    $("#filetype").change(function () {
        if (this.value == '') {
            $("#doc_upload").hide();
        } else {
            $("#doc_upload").show();
        }
    });

    $("#filetype").change(function () {
        var action = '/addLandRecords?type=' + $(this).val() + '&class=file_hash&name=file_name';

        $('.my_dropzone').attr('action', action)
        var mydrop = $('.my_dropzone')[0].dropzone;
        mydrop.destroy();
        $('.my_dropzone').dropzone({
            url: action,
            addRemoveLinks: true,
        })
    })

    $('#certificate_type').on('change', function () {
        $("#lease_term").show();
        $("#occupancy_term").hide();
        $(".nondigital").show();
        //alert( this.value );
        $(".hideadd").hide();
        $(".offerdiv").hide();
        if (this.value == 2) {
            $("#certi_bread").html('Certificate of Customary Right of Ownership');
            $("#certi_bread").show();
            $("#lbl_certificate_no").text("CCRO No. :");
            $("#certificate_no").attr("placeholder", "Enter CCRO No. ");
            $("#village").attr("required");
            $("#kitongoji").attr("required");
            $("#north").attr("required");
            $("#south").attr("required");
            $("#east").attr("required");
            $("#west").attr("required");
            $("#np_north").attr("required");
            $("#np_south").attr("required");
            $("#np_east").attr("required");
            $("#np_west").attr("required");
            $("#term").attr("required");

            $("#address").removeAttr("required");
            $("#block").removeAttr("required");
            $("#plot").removeAttr("required");
            $(".nondigi_div").show();
            $(".digi_div").hide();
            $(".hideadd").show();
            $(".offerdiv").show();
            $(".nondigital").show();
            $('#lbl_upload_file_name').html('File Name <span class="astrick_color">*</span>')
        } else if (this.value == 1) {
            $("#certi_bread").html('Digital Land Title Certificate');
            $("#certi_bread").show();
            $('#lbl_upload_file_name').html('Upload Title <span class="astrick_color">*</span>')
            $("#lbl_certificate_no").text("Certificate No. :");
            $("#certificate_no").attr("placeholder", "Enter Certificate No. ");
            $("#address").attr("required");
            $("#block").attr("required");
            $("#plot").attr("required");
            $("#village").removeAttr("required");
            $("#kitongoji").removeAttr("required");
            $("#north").removeAttr("required");
            $("#south").removeAttr("required");
            $("#east").removeAttr("required");
            $("#west").removeAttr("required");
            $("#np_north").removeAttr("required");
            $("#np_south").removeAttr("required");
            $("#np_east").removeAttr("required");
            $("#np_west").removeAttr("required");
            $("#term").removeAttr("required");
            $(".nondigi_div").hide();
            $(".digi_div").show();
            $(".hideadd").hide();
            $(".offerdiv").hide();
            $(".nondigital").hide();
        } else {
            $(".nondigital").show();
            if (this.value == 4) {
                $("#lease_term").hide();
                $("#occupancy_term").show();
            } else {
                $("#lease_term").show();
                $("#occupancy_term").hide();
            }

            if (this.value == 0) {
                $("#certi_bread").html('Offer Letter');
                $("#certi_bread").show();
                $('#lbl_certificate_no').text('Offer Letter No. :')
                $("#certificate_no").attr("placeholder", "Enter Offer Letter No.")
            } else if (this.value == 3) {
                $("#certi_bread").html('Non Digital Land Title Certificate');
                $("#certi_bread").show();
                $('#lbl_certificate_no').text('Non Digital Land Title Certificate No. :')
                $('#certificate_no').attr('placeholder', "Enter Non Digital Land Title Certificate No.")
            } else if (this.value == 4) {
                $("#certi_bread").html(globals.RL);
                $("#certi_bread").show();
                $('#lbl_certificate_no').html(globals.RL + ' No. :')
                $('#certificate_no').attr('placeholder', "Enter " + globals.RL + " No.")
            } else {
                $('#lbl_certificate_no').html('Certificate No. :')
                $('#certificate_no').attr('placeholder', "Enter Certificate No.")
            }
            $(".offerdiv").show();
            // $("#lbl_certificate_no").text("Certificate No");
            // $("#certificate_no").attr("placeholder", "Enter Certificate No");
            $("#address").attr("required");
            $("#block").attr("required");
            $("#plot").attr("required");
            $("#village").removeAttr("required");
            $("#kitongoji").removeAttr("required");
            $("#north").removeAttr("required");
            $("#south").removeAttr("required");
            $("#east").removeAttr("required");
            $("#west").removeAttr("required");
            $("#np_north").removeAttr("required");
            $("#np_south").removeAttr("required");
            $("#np_east").removeAttr("required");
            $("#np_west").removeAttr("required");
            $("#term").removeAttr("required");
            $(".nondigi_div").hide();
            $(".digi_div").show();
            $(".hideadd").hide();
            $('#lbl_upload_file_name').html('File Name <span class="astrick_color">*</span>')
        }
    });


    /*===============================================Submit land record==========================================*/

    $("#land_record_submit").on('click', function (e) {
        e.preventDefault();
        showgenProgress();
        var landpurpose = '';
        var landpurpose_type = '';
        var leaseterm = ''
        if ($("#certificate_type").val == 1 || $("#certificate_type").val == 0 || $("#certificate_type").val == 3) {
            var select_term = $('#lease_term').val()
            if (select_term == 0) {
                leaseterm = '33 years';
            } else if (select_term == 1) {
                leaseterm = '66 years';
            } else if (select_term == 2) {
                leaseterm = '99 years';
            }

        } else if ($("#certificate_type").val == 2) {
            leaseterm = $("#term").val() + ' years';
        } else if ($("#certificate_type").val == 4) {
            leaseterm = $("#occupancy_term").val() + ' months';
        }
        var ownertype = $("input:radio[name=ownership_type]:checked").val();
        var ownerdetails = [];
        if (ownertype == 0) {
            var applicant = {
                'isguardian': 2,
                'isapplicant': 1,
                'firstname': $('#applicant_firstname').val(),
                'middlename': $("#applicant_middlename").val(),
                'lastname': $("#applicant_lastname").val(),
                'leveledu': $("#applicant_leveledu").val(),
                'gender': $(".applicant_gender_type:checked").val(),
                'birthdate': $("#applicant_birthdate").val(),
                'maritial_status': $(".applicant_maritial_status:checked").val(),
                'employment': $("#applicant_employment").val(),
                'residence': $("#applicant_residence").val(),
                'nationality_select': $(".applicant_nationality_select:checked").val(),
                'unique_id': $("#applicant_nationality_id").val(),
                'phone_no': $("#applicant_phone_no").val(),
            };
            var spouse = {
                'isguardian': 2,
                'isapplicant': 0,
                'firstname': $('#spouse_firstname').val(),
                'middlename': $("#spouse_middlename").val(),
                'lastname': $("#spouse_lastname").val(),
                'leveledu': $("#spouse_leveledu").val(),
                'gender': $(".spouse_gender_type:checked").val(),
                'birthdate': $("#spouse_birthdate").val(),
                'maritial_status': $(".spouse_maritial_status:checked").val(),
                'employment': $("#spouse_employment").val(),
                'residence': $("#spouse_residence").val(),
                'nationality_select': $(".spouse_nationality_select:checked").val(),
                'unique_id': $("#spouse_nationality_id").val(),
                'phone_no': $("#spouse_phone_no").val(),
            };



            if (user_data.users_profile[0].isapplicant == 1) {
                applicant._id = user_data.users_profile[0]._id
                if (user_data.users_profile[0].maritial_status == 1) {
                    spouse._id = user_data.users_profile[1]._id
                    ownerdetails.push(applicant, spouse);
                } else {
                    ownerdetails.push(applicant);
                }

            } else {
                applicant._id = user_data.users_profile[1]._id
                if (user_data.users_profile[1].maritial_status == 1) {
                    spouse._id = user_data.users_profile[0]._id
                    ownerdetails.push(applicant, spouse);
                } else {
                    ownerdetails.push(applicant);
                }
            }

            //ownerdetails.push(applicant, spouse);

        } else if (ownertype == 4) {
            var user =
            {
                'isguardian': 1,
                'isapplicant': 2,
                'firstname': $('#guard_firstname').val(),
                'middlename': $("#guard_middlename").val(),
                'lastname': $("#guard_lastname").val(),
                'leveledu': $("#guard_leveledu").val(),
                'gender': $(".guard_gender_type:checked").val(),
                'birthdate': $("#guard_birthdate").val(),
                'maritial_status': $(".guard_maritial_status:checked").val(),
                'employment': $("#guard_employment").val(),
                'residence': $("#guard_residence").val(),
                'nationality_select': $(".guard_nationality_select:checked").val(),
                'unique_id': $("#guard_nationality_id").val(),
                'phone_no': $("#guard_phone_no").val(),
            };
            var user2 = {
                'isguardian': 0,
                'isapplicant': 2,
                'firstname': $('#minor_firstname').val(),
                'middlename': $("#minor_middlename").val(),
                'lastname': $("#minor_lastname").val(),
                'leveledu': $("#minor_leveledu").val(),
                'gender': $(".minor_gender_type:checked").val(),
                'birthdate': $("#minor_birthdate").val(),
                'residence': $("#minor_residence").val(),
                'nationality_select': $(".minor_nationality_select:checked").val(),
                'unique_id': $("#minor_nationality_id").val(),
                'phone_no': $("#minor_phone_no").val(),
            };

            if (user_data.users_profile[0].isguardian == 1) {
                user._id = user_data.users_profile[0]._id
                user2._id = user_data.users_profile[1]._id
            } else {
                user._id = user_data.users_profile[1]._id
                user2._id = user_data.users_profile[0]._id
            }

            ownerdetails.push(user2, user);
        } else {
            console.log("My User", user_data)
            $('.owner_user').each(function (index) {
                var user = {}

                user.isguardian = 2;
                user.isapplicant = 2;
                user._id = user_data.users_profile[index]._id;
                user.firstname = $(this).find('#firstname').val();
                user.middlename = $(this).find("#middlename").val();
                user.lastname = $(this).find("#lastname").val();
                user.leveledu = $(this).find("#leveledu").val();
                user.gender = $(this).find(".gender_type:checked").val();
                user.birthdate = $(this).find(".birthdate").val();
                user.maritial_status = $(this).find(".maritial_status:checked").val();
                user.employment = $(this).find("#employment").val();
                user.residence = $(this).find("#residence").val();
                user.nationality_select = $(this).find(".nationality_select:checked").val();
                user.unique_id = $(this).find("#nationality_id").val();
                user.phone_no = $(this).find("#phone_no").val();
                if (ownertype == 2) {
                    user.share_value = $("#share_value").val();
                }
                ownerdetails.push(user)
            });
        }
        //  if(ownertype != 4){

        //  }else{

        //  }

        console.log(ownerdetails);
        var uploaddetails = [];
        console.log(uploadtitle)
        if (uploadtitle != null) {
            if (uploadtitle.length > 0) {
                uploadtitle.map(function (title) {
                    uploaddetails.push(title)
                })
            }
        }

        console.log(uploaddetails)
        $('.upload_user').each(function () {
            var files = {}
            if ($(this).find("#file_hash").val()) {
                files.filename = $(this).find('#file_name').val();
                files.filehash = $(this).find("#file_hash").val();
                uploaddetails.push(files)
            }

        })

        //  console.log();


        if ($(".purpose_select:checked").val() == 0) {
            landpurpose = $("#residential_select").val()
        } else {
            landpurpose = $("#commercial_select").val()
        }
        var markers = JSON.parse($('#array_lat_lng').val())
        var details = {
            stepone: {
                'userid': JSON.parse(sessionStorage.userData)[0]._id,
                'user_email': JSON.parse(sessionStorage.userData)[0].email,
                'user_type': JSON.parse(sessionStorage.userData)[0].userType,
                'land_id': id,
                'certificateType': $("#certificate_type").val(),
                'action': 'submit'
            },
            steptwo: {
                'has_certificate': $("input:radio[name=certificate_que]:checked").val(),
                'certificate_no': $("#certificate_no").val(),
            },
            stepthree: {
                'region': $("#region").val(),
                'ward': $("#ward").val(),
                'block': $("#block").val(),
                'plot': $("#plot").val(),
                'district': $("#district").val(),
                'location': $("#location").val(),
                'address': $("#address").val(),
                'landfeature': $("#land_distict_feature").val(),
                'village': $("#village").val(),
                'kitongi': $("#kitongoji").val(),
                'npnorth': $("#np_north").val(),
                'npsouth': $("#np_south").val(),
                'npeast': $("#np_east").val(),
                'npwest': $("#np_west").val(),
                'landheight': $("#landheight").val(),
                'landwidth': $("#landwidth").val(),
                'landarea': $("#landarea").val(),
                'markedarea': $("#area_as_per_marking").val(),
                'zoom_level': $("#map_zoom").val(),
                'lat': $("#lat").val(),
                'long': $("#long").val(),
                'land_markers': markers
            },
            stepfour: {
                'landpurpose_type': $(".purpose_select:checked").val(),
                'land_purpose': landpurpose,
            },
            stepfive: {
                'ownership_type': $("input:radio[name=ownership_type]:checked").val(),
                'users': ownerdetails,
                'lease_term': leaseterm,
                'leasedate': $("#leasedate").val(),
                'lease_type': $("#leaseterm_select").val(),
            },
            stepsix: {
                'secure_land': $("input:radio[name=land_secure]:checked").val(),
                'upload_title': uploaddetails
            }


        }

        $.when($.post('/updateLandRecord', details)).done(function (_res) {
            if (_res.code == 200) {
                var olduser = JSON.parse(sessionStorage.userData)
                if (!olduser[0].owner_demographic) {
                    olduser[0].owner_demographic = ownerdetails[0];
                    sessionStorage.setItem("userData", JSON.stringify(olduser))
                }

                PNotify.success({
                    title: 'Success!',
                    text: 'Land Updated successfully!'
                });
                hidegenProgress();
                location.href = url + "/dashboard/dashboards/landlist.html"
            } else {
                PNotify.error({
                    title: 'Error',
                    text: _res.msg
                });
                hidegenProgress();
            }
        })

        console.log(details);
    });

    /*===============================================Save land record==========================================*/

    $("#land_record_save").on('click', function (e) {
        e.preventDefault();
        showgenProgress();
        var landpurpose = '';
        var landpurpose_type = '';
        var leaseterm = ''
        if ($("#certificate_type").val == 1 || $("#certificate_type").val == 0 || $("#certificate_type").val == 3) {
            var select_term = $('#lease_term').val()
            if (select_term == 0) {
                leaseterm = '33 years';
            } else if (select_term == 1) {
                leaseterm = '66 years';
            } else if (select_term == 2) {
                leaseterm = '99 years';
            }

        } else if ($("#certificate_type").val == 2) {
            leaseterm = $("#term").val() + ' years';
        } else if ($("#certificate_type").val == 4) {
            leaseterm = $("#occupancy_term").val() + ' months';
        }
        var ownertype = $("input:radio[name=ownership_type]:checked").val();
        var ownerdetails = [];
        if (ownertype == 0) {
            var applicant = {
                'isguardian': 2,
                'isapplicant': 1,
                'firstname': $('#applicant_firstname').val(),
                'middlename': $("#applicant_middlename").val(),
                'lastname': $("#applicant_lastname").val(),
                'leveledu': $("#applicant_leveledu").val(),
                'gender': $(".applicant_gender_type:checked").val(),
                'birthdate': $("#applicant_birthdate").val(),
                'maritial_status': $(".applicant_maritial_status:checked").val(),
                'employment': $("#applicant_employment").val(),
                'residence': $("#applicant_residence").val(),
                'nationality_select': $(".applicant_nationality_select:checked").val(),
                'unique_id': $("#applicant_nationality_id").val(),
                'phone_no': $("#applicant_phone_no").val(),
            };
            var spouse = {
                'isguardian': 2,
                'isapplicant': 0,
                'firstname': $('#spouse_firstname').val(),
                'middlename': $("#spouse_middlename").val(),
                'lastname': $("#spouse_lastname").val(),
                'leveledu': $("#spouse_leveledu").val(),
                'gender': $(".spouse_gender_type:checked").val(),
                'birthdate': $("#spouse_birthdate").val(),
                'maritial_status': $(".spouse_maritial_status:checked").val(),
                'employment': $("#spouse_employment").val(),
                'residence': $("#spouse_residence").val(),
                'nationality_select': $(".spouse_nationality_select:checked").val(),
                'unique_id': $("#spouse_nationality_id").val(),
                'phone_no': $("#spouse_phone_no").val(),
            };



            if (user_data.users_profile[0].isapplicant == 1) {
                applicant._id = user_data.users_profile[0]._id
                if (user_data.users_profile[0].maritial_status == 1) {
                    spouse._id = user_data.users_profile[1]._id
                    ownerdetails.push(applicant, spouse);
                } else {
                    ownerdetails.push(applicant);
                }

            } else {
                applicant._id = user_data.users_profile[1]._id
                if (user_data.users_profile[1].maritial_status == 1) {
                    spouse._id = user_data.users_profile[0]._id
                    ownerdetails.push(applicant, spouse);
                } else {
                    ownerdetails.push(applicant);
                }
            }

            //ownerdetails.push(applicant, spouse);

        } else if (ownertype == 4) {
            var user =
            {
                'isguardian': 1,
                'isapplicant': 2,
                'firstname': $('#guard_firstname').val(),
                'middlename': $("#guard_middlename").val(),
                'lastname': $("#guard_lastname").val(),
                'leveledu': $("#guard_leveledu").val(),
                'gender': $(".guard_gender_type:checked").val(),
                'birthdate': $("#guard_birthdate").val(),
                'maritial_status': $(".guard_maritial_status:checked").val(),
                'employment': $("#guard_employment").val(),
                'residence': $("#guard_residence").val(),
                'nationality_select': $(".guard_nationality_select:checked").val(),
                'unique_id': $("#guard_nationality_id").val(),
                'phone_no': $("#guard_phone_no").val(),
            };
            var user2 = {
                'isguardian': 0,
                'isapplicant': 2,
                'firstname': $('#minor_firstname').val(),
                'middlename': $("#minor_middlename").val(),
                'lastname': $("#minor_lastname").val(),
                'leveledu': $("#minor_leveledu").val(),
                'gender': $(".minor_gender_type:checked").val(),
                'birthdate': $("#minor_birthdate").val(),
                'residence': $("#minor_residence").val(),
                'nationality_select': $(".minor_nationality_select:checked").val(),
                'unique_id': $("#minor_nationality_id").val(),
                'phone_no': $("#minor_phone_no").val(),
            };

            if (user_data.users_profile[0].isguardian == 1) {
                user._id = user_data.users_profile[0]._id
                user2._id = user_data.users_profile[1]._id
            } else {
                user._id = user_data.users_profile[1]._id
                user2._id = user_data.users_profile[0]._id
            }

            ownerdetails.push(user2, user);
        } else {
            console.log("My User", user_data)
            $('.owner_user').each(function (index) {
                var user = {}

                user.isguardian = 2;
                user.isapplicant = 2;
                user._id = user_data.users_profile[index]._id;
                user.firstname = $(this).find('#firstname').val();
                user.middlename = $(this).find("#middlename").val();
                user.lastname = $(this).find("#lastname").val();
                user.leveledu = $(this).find("#leveledu").val();
                user.gender = $(this).find(".gender_type:checked").val();
                user.birthdate = $(this).find(".birthdate").val();
                user.maritial_status = $(this).find(".maritial_status:checked").val();
                user.employment = $(this).find("#employment").val();
                user.residence = $(this).find("#residence").val();
                user.nationality_select = $(this).find(".nationality_select:checked").val();
                user.unique_id = $(this).find("#nationality_id").val();
                user.phone_no = $(this).find("#phone_no").val();
                if (ownertype == 2) {
                    user.share_value = $("#share_value").val();
                }
                ownerdetails.push(user)
            });
        }
        //  if(ownertype != 4){

        //  }else{

        //  }

        console.log(ownerdetails);
        var uploaddetails = [];
        console.log(uploadtitle)
        if (uploadtitle != null) {
            if (uploadtitle.length > 0) {
                uploadtitle.map(function (title) {
                    uploaddetails.push(title)
                })
            }
        }

        console.log(uploaddetails)
        $('.upload_user').each(function () {
            var files = {}
            if ($(this).find("#file_hash").val()) {
                files.filename = $(this).find('#file_name').val();
                files.filehash = $(this).find("#file_hash").val();
                uploaddetails.push(files)
            }

        })

        //  console.log();


        if ($(".purpose_select:checked").val() == 0) {
            landpurpose = $("#residential_select").val()
        } else {
            landpurpose = $("#commercial_select").val()
        }
        var markers = JSON.parse($('#array_lat_lng').val())
        var details = {
            stepone: {
                'userid': JSON.parse(sessionStorage.userData)[0]._id,
                'user_email': JSON.parse(sessionStorage.userData)[0].email,
                'user_type': JSON.parse(sessionStorage.userData)[0].userType,
                'land_id': id,
                'certificateType': $("#certificate_type").val(),
                'action': 'save'
            },
            steptwo: {
                'has_certificate': $("input:radio[name=certificate_que]:checked").val(),
                'certificate_no': $("#certificate_no").val(),
            },
            stepthree: {
                'region': $("#region").val(),
                'ward': $("#ward").val(),
                'block': $("#block").val(),
                'plot': $("#plot").val(),
                'district': $("#district").val(),
                'location': $("#location").val(),
                'address': $("#address").val(),
                'landfeature': $("#land_distict_feature").val(),
                'village': $("#village").val(),
                'kitongi': $("#kitongoji").val(),
                'npnorth': $("#np_north").val(),
                'npsouth': $("#np_south").val(),
                'npeast': $("#np_east").val(),
                'npwest': $("#np_west").val(),
                'landheight': $("#landheight").val(),
                'landwidth': $("#landwidth").val(),
                'landarea': $("#landarea").val(),
                'markedarea': $("#area_as_per_marking").val(),
                'zoom_level': $("#map_zoom").val(),
                'lat': $("#lat").val(),
                'long': $("#long").val(),
                'land_markers': markers
            },
            stepfour: {
                'landpurpose_type': $(".purpose_select:checked").val(),
                'land_purpose': landpurpose,
            },
            stepfive: {
                'ownership_type': $("input:radio[name=ownership_type]:checked").val(),
                'users': ownerdetails,
                'lease_term': leaseterm,
                'leasedate': $("#leasedate").val(),
                'lease_type': $("#leaseterm_select").val(),
            },
            stepsix: {
                'secure_land': $("input:radio[name=land_secure]:checked").val(),
                'upload_title': uploaddetails
            }


        }

        $.when($.post('/updateLandRecord', details)).done(function (_res) {
            if (_res.code == 200) {
                var olduser = JSON.parse(sessionStorage.userData)
                if (!olduser[0].owner_demographic) {
                    olduser[0].owner_demographic = ownerdetails[0];
                    sessionStorage.setItem("userData", JSON.stringify(olduser))
                }

                PNotify.success({
                    title: 'Success!',
                    text: 'Land Updated successfully!'
                });
                hidegenProgress();
                location.href = url + "/dashboard/dashboards/landlist.html"
            } else {
                PNotify.error({
                    title: 'Error',
                    text: _res.msg
                });
                hidegenProgress();
            }
        })

        console.log(details);
    });

    //============================================Preview===============================================

    $('#preview_row').hide()
    $(".preview_show_btn").hide()
    // $("#preview_btn").on('click', function () {
    //     $(".preview_show_btn").hide()
    //     $('#preview_row').show()
    //     fillPreview()
    // })
    $("#next_btn").on('click', function () {
        hidepreview();
    });
    $("#pre_btn").on('click', function () {
        hidepreview();
    });

    $("#preview_click").on('click', function () {
        hidepreview();
    });

    function hidepreview() {
        var one = document.getElementById("one");
        var two = document.getElementById("two");
        var three = document.getElementById("three");
        var four = document.getElementById("four");
        var five = document.getElementById("five");

        var collapseOne3 = document.getElementById("collapseOne3");
        var collapseTwo3 = document.getElementById("collapseTwo3");
        var collapseThree3 = document.getElementById("collapseThree3");
        var collapseFour3 = document.getElementById("collapseFour3");
        var collapseFive3 = document.getElementById("collapseFive3");


        one.classList.add("collapsed");
        two.classList.add("collapsed");
        three.classList.add("collapsed");
        four.classList.add("collapsed");
        five.classList.add("collapsed");


        collapseOne3.classList.remove("show");
        collapseTwo3.classList.remove("show");
        collapseThree3.classList.remove("show");
        collapseFour3.classList.remove("show");
        collapseFive3.classList.remove("show");
    }

    $("#headingOne3").on('click', function () {
        var c_type = $('#certificate_type').val()
        if (c_type == 0) {
            $('#preview_certificate_type').html('Offer Letter')
        } else if (c_type == 3) {
            $('#preview_certificate_type').html('Non Digital Land Title Certificate')
        } else if (c_type == 4) {
            $('#preview_certificate_type').html(globals.RL)
        } else if (c_type == 1) {
            $('#preview_certificate_type').html('Digital Land Title Certificate')
        } else if (c_type == 2) {
            $('#preview_certificate_type').html('Certificate of Customary Right of Ownership')
        }

        var has_certi = $("input:radio[name=certificate_que]:checked").val()
        if (has_certi == 0) {
            $('#preview_has_certificate').html('No')
        } else if (has_certi == 1) {
            $('#preview_has_certificate').html('Yes')
        }

        var c_no = $("#certificate_no").val()
        $('#preview_certificate_no').html(c_no)
    })

    $("#headingTwo3").on('click', function () {
        $('#preview_region').html($("#region option:selected").text())
        $('#preview_block_no').html($("#block").val())
        $('#preview_district').html($("#district option:selected").text())
        $('#preview_ward_no').html($("#ward option:selected").text())
        $('#preview_plot_no').html($("#plot").val())
        $('#preview_location').html($("#location").val())
        $('#preview_address').html($("#address").val())
        $('#preview_feature').html($("#land_distict_feature").val())
        $('#preview_height').html($("#landheight").val())
        $('#preview_width').html($("#landwidth").val())
        $('#preview_area').html($("#landarea").val())
        $('#preview_lat').html($("#lat").val())
        $('#preview_long').html($("#long").val())
        $('#preview_marked_area').html($("#area_as_per_marking").val())
        $('#preview_village').html($("#village").val())
        $('#preview_kitongoji').html($("#kitongoji").val())
        $('#preview_north').html($("#north").val())
        $('#preview_south').html($("#south").val())
        $('#preview_east').html($("#east").val())
        $('#preview_west').html($("#west").val())
        $('#preview_npnorth').html($("#np_north").val())
        $('#preview_npsouth').html($("#np_south").val())
        $('#preview_npeast').html($("#np_east").val())
        $('#preview_npwest').html($("#np_west").val())
    })

    $("#headingThree3").on('click', function () {
        $('.commer_type').hide();
        $('.resi_type').hide();
        //$('#preview_purpose_type').html($(".purpose_select:checked").val())

        if ($(".purpose_select:checked").val() == 0) {
            $('#preview_purpose_type').html('Residential');
            var r_type = $("#residential_select").val()
            $('.resi_type').show();
            if (r_type == 0) {
                $('#preview_residence_type').html('Public Housing')
            } else if (r_type == 1) {
                $('#preview_residence_type').html('Private Housing')
            } else if (r_type == 2) {
                $('#preview_residence_type').html('Housing/Farming')
            }

        } else {
            $('.resi_type').hide();
            $('.commer_type').show();
        }
        if ($(".purpose_select:checked").val() == 1) {
            $('#preview_purpose_type').html('Commercial');
            var co_type = $("#commercial_select").val()
            $('.commer_type').show();
            if (co_type == 0) {
                $('#preview_commercial_type').html('Public/Industries')
            } else if (co_type == 1) {
                $('#preview_commercial_type').html('Forest/Farm')
            } else if (co_type == 2) {
                $('#preview_commercial_type').html('Mineral Areas')
            } else if (co_type == 3) {
                $('#preview_commercial_type').html('Parks/Recreation/Amusement')
            }
        } else {
            $('.commer_type').hide();
            $('.resi_type').show();
        }
    })

    $("#headingFour3").on('click', function () {
        var o_type = $("input:radio[name=ownership_type]:checked").val()
        var display_share = 'display:none';
        if (o_type == 0) {
            $('#preview_ownership_type').html('Owner/Applicant')
        } else if (o_type == 1) {
            $('#preview_ownership_type').html('Group')
        } else if (o_type == 2) {
            $('#preview_ownership_type').html('Group with shares')
            display_share = 'display:block';
        } else if (o_type == 3) {
            $('#preview_ownership_type').html('Corporation')
        } else if (o_type == 4) {
            $('#preview_ownership_type').html('Owner with guardian')
        } else if (o_type == 5) {
            $('#preview_ownership_type').html('Customary')
        }

        var c_type = $('#certificate_type').val()
        if (c_type == 4) {
            $('#preview_lease_term').html($('#occupancy_term').val() + ' months')
        } else if (c_type == 2) {
            $('#preview_term_years').html($('#term').val() + ' years')
        } else {
            var l_term = $("#lease_term").val()
            if (l_term == 0) {
                $('#preview_lease_term').html('33 years')
            } else if (l_term == 1) {
                $('#preview_lease_term').html('66 years')
            } else if (l_term == 2) {
                $('#preview_lease_term').html('99 years')
            }
        }



        var l_type = $("#leaseterm_select").val()
        if (l_type == 0) {
            $('#preview_lease_type').html('Mda Maalumu')
        } else if (l_type == 1) {
            $('#preview_lease_type').html('Hakuna Mda Maalumu')
            $('#preview_term_years').html(' N/A')
        }



        $('#preview_lease_start_date').html($('#leasedate').val())

        if (o_type == 0) {
            var html = ''

            var genderapplicant = $(".applicant_gender_type:checked").val()
            var gender_applicant_val = ''
            if (genderapplicant == 0) {
                gender_applicant_val = 'Male'
            } else if (genderapplicant == 1) {
                gender_applicant_val = 'Female'
            } else if (genderapplicant == 2) {
                gender_applicant_val = 'Other'
            }

            var genderspouse = $(".spouse_gender_type:checked").val()
            var gender_spouse_val = ''
            if (genderspouse == 0) {
                gender_spouse_val = 'Male'
            } else if (genderspouse == 1) {
                gender_spouse_val = 'Female'
            } else if (genderspouse == 2) {
                gender_spouse_val = 'Other'
            }

            var maritialapplicant = $(".applicant_maritial_status:checked").val()
            var maritial_applicant_val = ''
            if (maritialapplicant == 0) {
                maritial_applicant_val = 'Single'
            } else if (maritialapplicant == 1) {
                maritial_applicant_val = 'Married'
            } else if (maritialapplicant == 2) {
                maritial_applicant_val = 'Divorced'
            }
            var appli_id = '';
            var nationalityapplicant = $(".applicant_nationality_select:checked").val()
            var nationality_applicant_val = ''
            if (nationalityapplicant == 0) {
                appli_id = 'Nationality ID';
                nationality_applicant_val = 'Tanzanian'
            } else if (nationalityapplicant == 1) {
                nationality_applicant_val = 'Non-Tanzanian'
                appli_id = 'Investor ID';
            }
            var spouse_id = '';
            var nationalityspouse = $(".spouse_nationality_select:checked").val()
            var nationality_spouse_val = ''
            if (nationalityspouse == 0) {
                spouse_id = 'Nationality ID';
                nationality_spouse_val = 'Tanzanian'
            } else if (nationalityspouse == 1) {
                nationality_spouse_val = 'Non-Tanzanian'
                spouse_id = 'Investor ID';
            }

            html += ' <div class="kt-heading kt-heading--md">Applicant</div>\
            <div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">'+ $('#applicant_firstname').val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">'+ $("#applicant_middlename").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">'+ $("#applicant_lastname").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">'+ $("#applicant_leveledu").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">'+ gender_applicant_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">'+ $("#applicant_birthdate").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Maritial Status:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_maritail_status">'+ maritial_applicant_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">'+ $("#applicant_employment").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">'+ $("#applicant_residence").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">'+ nationality_applicant_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">'+ appli_id + ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">'+ $("#applicant_nationality_id").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                   <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">'+ $("#applicant_phone_no").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
            </div>'
            if (maritialapplicant == 1) {
                html += ' <div class="kt-heading kt-heading--md spousepre">Spouse</div>\<div class="row spousepre">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">'+ $('#spouse_firstname').val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">'+ $("#spouse_middlename").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">'+ $("#spouse_lastname").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">'+ $("#spouse_leveledu").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">'+ gender_spouse_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">'+ $("#spouse_birthdate").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">'+ $("#spouse_employment").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">'+ $("#spouse_residence").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">'+ nationality_spouse_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">'+ spouse_id + ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">'+ $("#spouse_nationality_id").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                  <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">'+ $("#spouse_phone_no").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
            </div>'
            }
            $(".preview_user_data").html(html)
        } else if (o_type == 4) {
            var html = ''

            var genderguard = $(".guard_gender_type:checked").val()
            var gender_guard_val = ''
            if (genderguard == 0) {
                gender_guard_val = 'Male'
            } else if (genderguard == 1) {
                gender_guard_val = 'Female'
            } else if (genderguard == 2) {
                gender_guard_val = 'Other'
            }

            var genderminor = $(".minor_gender_type:checked").val()
            var gender_minor_val = ''
            if (genderminor == 0) {
                gender_minor_val = 'Male'
            } else if (genderminor == 1) {
                gender_minor_val = 'Female'
            } else if (genderminor == 2) {
                gender_minor_val = 'Other'
            }

            var maritialguard = $(".guard_maritial_status:checked").val()
            var maritial_guard_val = ''
            if (maritialguard == 0) {
                maritial_guard_val = 'Single'
            } else if (maritialguard == 1) {
                maritial_guard_val = 'Married'
            } else if (maritialguard == 2) {
                maritial_guard_val = 'Divorced'
            }

            var maritialminor = $(".minor_maritial_status:checked").val()
            var maritial_minor_val = ''
            if (maritialminor == 0) {
                maritial_minor_val = 'Single'
            } else if (maritialminor == 1) {
                maritial_minor_val = 'Married'
            } else if (maritialminor == 2) {
                maritial_minor_val = 'Divorced'
            }

            var nationalityguard = $(".guard_nationality_select:checked").val()
            var guard_Id, minor_Id;
            var nationality_guard_val = ''
            if (nationalityguard == 0) {
                guard_Id = "Nationality ID"
                nationality_guard_val = 'Tanzanian'
            } else if (nationalityguard == 1) {
                guard_Id = "Investment ID"
                nationality_guard_val = 'Non-Tanzanian'
            }

            var nationalityminor = $(".minor_nationality_select:checked").val()
            var nationality_minor_val = ''
            if (nationalityminor == 0) {
                minor_Id = "Nationality ID"
                nationality_minor_val = 'Tanzanian'
            } else if (nationalityminor == 1) {
                minor_Id = "Investment ID"
                nationality_minor_val = 'Non-Tanzanian'
            }

            html += ' <div class="kt-heading kt-heading--md">Guardian</div>\<div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">'+ $('#guard_firstname').val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                    <div class="lbl_width">\
                        <label class="preview_heading">Middle Name:</label>\
                    </div>\
                    <div class="spn_width">\
                        <span class="preview_content" id="preview_middle_name">'+ $("#guard_middlename").val() + '</span>\
                    </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">'+ $("#guard_lastname").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">'+ $("#guard_leveledu").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">'+ gender_guard_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">'+ $("#guard_birthdate").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Maritial Status:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_maritail_status">'+ maritial_guard_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">'+ $("#guard_employment").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">'+ $("#guard_residence").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">'+ nationality_guard_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">'+ guard_Id + ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">'+ $("#guard_nationality_id").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">'+ $("#guard_phone_no").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
            </div>'

            html += ' <div class="kt-heading kt-heading--md">Owner</div>\<div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">'+ $('#minor_firstname').val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">'+ $("#minor_middlename").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">'+ $("#minor_lastname").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">'+ $("#minor_leveledu").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">'+ gender_minor_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">'+ $("#minor_birthdate").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">'+ $("#minor_residence").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">'+ nationality_minor_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">'+ minor_Id + ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">'+ $("#minor_nationality_id").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">'+ $("#minor_phone_no").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
            </div>'
            $(".preview_user_data").html(html)
        } else {
            var html = ''
            var count = 0;
            $('.owner_user').each(function () {
                var gender = $(this).find(".gender_type:checked").val()
                var gender_val = ''
                if (gender == 0) {
                    gender_val = 'Male'
                } else if (gender == 1) {
                    gender_val = 'Female'
                } else if (gender == 2) {
                    gender_val = 'Other'
                }

                var maritial = $(this).find(".maritial_status:checked").val()
                var maritial_val = ''
                if (maritial == 0) {
                    maritial_val = 'Single'
                } else if (maritial == 1) {
                    maritial_val = 'Married'
                } else if (maritial == 2) {
                    maritial_val = 'Divorced'
                }

                var nationality = $(this).find(".nationality_select:checked").val()
                var main_ID;
                var nationality_val = ''
                if (nationality == 0) {
                    main_ID = "Nationality ID"
                    nationality_val = 'Tanzanian'
                } else if (nationality == 1) {
                    main_ID = "Investment ID"
                    nationality_val = 'Non-Tanzanian'
                }

                html += ' <div class="kt-heading kt-heading--md">Owner -' + (++count) + '</div>\<div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">'+ $(this).find('#firstname').val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">'+ $(this).find("#middlename").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">'+ $(this).find("#lastname").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">'+ $(this).find("#leveledu").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">'+ gender_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">'+ $(this).find(".birthdate").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Maritial Status:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_maritail_status">'+ maritial_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">'+ $(this).find("#employment").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">'+ $(this).find("#residence").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">'+ nationality_val + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">'+ main_ID + ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">'+ $(this).find("#nationality_id").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">'+ $(this).find("#phone_no").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6" style='+ display_share + '>\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Share % :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_share_val">'+ $(this).find("#share_value").val() + '</span>\
                        </div>\
                    </div>\
                </div>\
            </div>'
            })
            $(".preview_user_data").html(html)
        }
    })

    $("#headingFive3").on('click', function () {
        var html1 = ''

        uploadtitle.map(function (title) {
            if (title.filehash) {
                html1 += ' <div class="row">\
            <div class="col-lg-12">\
                <div class="form-group">\
                    <label class="preview_heading">Document Name: '+ title.filename + '</label>\
                    <span class="preview_content" id="preview_upload_title"><a href="'+ ipfsurl + '/ipfs/' + title.filehash + '" target="_blank">' + title.filehash + '</a></span>\
                </div>\
            </div>\
            </div>';
            }

        })

        $('.upload_user').each(function () {
            if ($(this).find('#file_hash').val()) {
                html1 += ' <div class="row">\
            <div class="col-lg-12">\
                <div class="form-group">\
                    <label class="preview_heading">Document Name: '+ $(this).find('#file_name').val() + '</label>\
                    <span class="preview_content" id="preview_upload_title"><a href="'+ ipfsurl + '/ipfs/' + $(this).find('#file_hash').val() + '" target="_blank">' + $(this).find('#file_hash').val() + '</a></span>\
                </div>\
            </div>\
            </div>';
            }
        })
        $('.preview_upload_data').html(html1)
        //$('#preview_upload_title').html('<a href="http://localhost:8080/ipfs/'+$('#file_hash').val()+'" target="_blank">'+$('#file_hash').val()+'</a>')
    })

    var current_date = "Date : " + moment(new Date()).format('LLL');
    $('.date_text').html(current_date)

});
