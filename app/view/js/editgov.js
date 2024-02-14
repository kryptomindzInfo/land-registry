$(window).on("load", function () {
    "use strict";

    var url = globals.URL;
    var ipfsurl = globals.IPFS_URL;

    /*============================================
                REGION, WARD, DISTRICT FUNCTIONS
    =============================================*/

    $.when($.get('/getRegions')).done(function (_res) {
        var regions = _res.data;
        regions.map(function (region) {
            $('<option>').val(region.id).text(region.name).appendTo('#region');
        })

        callAPI();
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
            $("#district").val(data.district).trigger('change')
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
            $("#ward").val(data.ward_no).trigger('change')
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

    // Loaders
    var getUrl = new URL(window.location.href)
    var id = getUrl.searchParams.get("id")
    var upload_title;

    function callAPI() {
        $.when($.get('/getSingalLand?id=' + id)).done(function (_res) {
            console.log(_res)
            var land = _res.data[0]
            upload_title = land.upload_title

            if (upload_title == null) {
                $('#upload_file_table').hide()
            }

            var thtml = ''
            if (land.upload_title.length > 0) {
                land.upload_title.map(function (title, index) {
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
                land.upload_title.splice($(this).data('file'), 1);
                upload_title.splice($(this).data('file'), 1);
                $(this).parents('tr').remove()

            });

            $('#upload_file_table_body').html(thtml)

            $("input[name='certificate_que'][value=" + land.isExtraApprovalRequired + "]").attr('checked', true).trigger('change');
            $('#certificate_no').val(land.certificate_no)
            $('#region').val(land.region).trigger('change')
            setDistrict(land);
            setWard(land);
            $('#address').val(land.address).trigger('change')
            $('#location').val(land.location).trigger('change')
            $('#block').val(land.block_no).trigger('change')
            $('#plot').val(land.plot_no).trigger('change')
            $('#village').val(land.village).trigger('change')
            $('#kitongoji').val(land.village).trigger('change')
            $('#land_distict_feature').val(land.land_feature).trigger('change')
            $('#north').val(land.npnorth).trigger('change')
            $('#south').val(land.npsouth).trigger('change')
            $('#east').val(land.npeast).trigger('change')
            $('#west').val(land.npwest).trigger('change')
            $('#landheight').val(land.land_height).trigger('change')
            $('#landwidth').val(land.land_width).trigger('change')
            $('#lat').val(land.land_lat)
            $('#long').val(land.land_long).trigger('change')
            $("#map_zoom").val(land.zoom_level),
                $("#array_lat_lng").val(JSON.stringify(land.land_markers)).trigger('change')
            $("input[name='purpose_select'][value=" + land.land_purpose + "]").attr('checked', true).trigger('change');
            $('#ownership_type').val(land.ownership_details).trigger('change')
        })
    }



    function showgenProgress() {
        $('#loader-gen-wrapper').show();
    }

    function hidegenProgress() {
        $('#loader-gen-wrapper').hide();
    }

    function showProgress() {
        $('.display-loader').addClass('show');
    }

    function hideProgress() {
        $('.display-loader').removeClass('show');
    }

    // For Has Certificate Question change check

    $(".certificate_que").change(function () {
        if ($(".certificate_que:checked").val() == 1) {
            $(".certi_div").show();
        } else {
            $(".certi_div").hide();
        }
    });

    // For Land Details Change function with auto fill

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
    $("#region").change(function () {
        fill_landdescription();
    });

    function fill_landdescription() {
        if ($("#certificate_type").val() == 2) {
            $("#land_description").val("Village: " + $("#village").val() + ", " + $("#ward option:selected").text() + ", " + $("#district option:selected").text() + " District , " + $("#region option:selected").text())
        } else {
            $("#land_description").val("Plot No: " + $("#plot").val() + ", Block '" + $("#block").val() + "', " + $("#location").val() + ", " + $("#ward option:selected").text() + ", " + $("#district option:selected").text() + " District , " + $("#region option:selected").text())
        }

    }

    // For Kitons Changes functions and auto fill.

    $("#north").change(function () {
        fill_landfeature();
    });
    $("#south").change(function () {
        fill_landfeature();
    });
    $("#east").change(function () {
        fill_landfeature();

    });
    $("#west").change(function () {
        fill_landfeature();
    });

    function fill_landfeature() {
        $("#land_feature").val("North Parcel No:- " + $("#north").val() + ",\n South Parcel No:- " + $("#south").val() + ",\n East Parcel No:- " + $("#east").val() + ",\n West Parcel No:- " + $("#west").val())
    }

    //Land Dimensions Calculations

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

    // Preview Current Time

    var current_date = "Date : " + moment(new Date()).format('LLL');
    $('.date_text').html(current_date)

    // Upload File 

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

    // Preview Certificate Texts

    $("#headingOne3").on('click', function () {
        var has_certi = $("input:radio[name=certificate_que]:checked").val()
        if (has_certi == 0) {
            $('#preview_has_certificate').html('No')
        } else if (has_certi == 1) {
            $('#preview_has_certificate').html('Yes')
        }

        var c_no = $("#certificate_no").val()
        $('#preview_certificate_no').html(c_no)
    })

    // Preview Land Details

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
        $('#preview_north').html($("#north_d").val())
        $('#preview_south').html($("#south_d").val())
        $('#preview_east').html($("#east_d").val())
        $('#preview_west').html($("#west_d").val())
        $('#preview_npnorth').html($("#north").val())
        $('#preview_npsouth').html($("#south").val())
        $('#preview_npeast').html($("#east").val())
        $('#preview_npwest').html($("#west").val())
    })

    // Preview Land Purpose

    $("#headingThree3").on('click', function () {
        if ($(".purpose_select:checked").val() == 0) {
            $('#preview_purpose_type').html('Housing')
        } else if ($(".purpose_select:checked").val() == 1) {
            $('#preview_purpose_type').html('Government Farming')
        } else if ($(".purpose_select:checked").val() == 2) {
            $('#preview_purpose_type').html('Police')
        } else if ($(".purpose_select:checked").val() == 3) {
            $('#preview_purpose_type').html('Hospital')
        } else if ($(".purpose_select:checked").val() == 4) {
            $('#preview_purpose_type').html('Forest')
        } else if ($(".purpose_select:checked").val() == 5) {
            $('#preview_purpose_type').html('National Parks')
        } else if ($(".purpose_select:checked").val() == 6) {
            $('#preview_purpose_type').html('Mineral Areas')
        } else if ($(".purpose_select:checked").val() == 7) {
            $('#preview_purpose_type').html('Government Institutions Authorities')
        } else if ($(".purpose_select:checked").val() == 8) {
            $('#preview_purpose_type').html('Others')
        }
    })

    // Preview Ownership Type

    $("#headingFour3").on('click', function () {
        $('#preview_ownership_type').html($('#ownership_type').val())
    })

    // Preview Upload File 

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

    $("#headingFive3").on('click', function () {
        var html1 = ''
        if (upload_title.length > 0) {
            upload_title.map(function (title) {
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

        }

        $('.upload_user').each(function () {
            console.log($(this))
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

    /*======================================Submit land record=====================================*/

    $("#land_record_submit").on('click', function (e) {
        e.preventDefault();
        showgenProgress();
        var landpurpose = '';
        var landpurpose_type = '';
        var leaseterm = ''
        var ownerdetails = $('#ownership_type').val();
        var uploaddetails = [];
        if (upload_title != null) {
            if (upload_title.length > 0) {
                upload_title.map(function (title) {
                    uploaddetails.push(title)
                })
            }
        }

        $('.upload_user').each(function () {
            var files = {}
            if ($(this).find("#file_hash").val()) {
                files.filename = $(this).find('#file_name').val();
                files.filehash = $(this).find("#file_hash").val();
                uploaddetails.push(files)
            }
        })

        console.log(uploaddetails, upload_title)

        landpurpose = $(".purpose_select:checked").val()
        var markers = [];
        if ($('#array_lat_lng').val()) {
            markers = JSON.parse($('#array_lat_lng').val())
        }
        console.log(markers)
        var details = {
            stepone: {
                'userid': JSON.parse(sessionStorage.userData)[0]._id,
                'land_id': id,
                'user_email': JSON.parse(sessionStorage.userData)[0].email,
                'user_type': JSON.parse(sessionStorage.userData)[0].userType,
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
                'kitongi': $("#kitongoji").val(),
                'village': $("#village").val(),
                'npnorth': $("#north").val(),
                'npsouth': $("#south").val(),
                'npeast': $("#east").val(),
                'npwest': $("#west").val(),
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
                'land_purpose': landpurpose,
            },
            stepfive: {
                'ownership_details': ownerdetails
            },
            stepsix: {
                'upload_title': uploaddetails
            }
        }

        $.when($.post('/updateGovLandRecord', details)).done(function (_res) {
            if (_res.code == 200) {
                // var olduser = JSON.parse(sessionStorage.userData)
                // if (!olduser[0].owner_demographic) {
                //     olduser[0].owner_demographic = ownerdetails[0];
                //     sessionStorage.setItem("userData", JSON.stringify(olduser))
                // }

                PNotify.success({
                    title: 'Success!',
                    text: 'Land Registered successfully!'
                });
                hidegenProgress();
                location.href = url + "/dashboard/dashboards/govlandlist.html"
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

    /*======================================Save land record=====================================*/

    $("#land_record_save").on('click', function (e) {
        e.preventDefault();
        showgenProgress();
        var landpurpose = '';
        var landpurpose_type = '';
        var leaseterm = ''
        var ownerdetails = $('#ownership_type').val();
        var uploaddetails = [];
        if (upload_title != null) {
            if (upload_title.length > 0) {
                upload_title.map(function (title) {
                    uploaddetails.push(title)
                })
            }
        }

        $('.upload_user').each(function () {
            var files = {}
            if ($(this).find("#file_hash").val()) {
                files.filename = $(this).find('#file_name').val();
                files.filehash = $(this).find("#file_hash").val();
                uploaddetails.push(files)
            }
        })

        console.log(uploaddetails, upload_title)

        landpurpose = $(".purpose_select:checked").val()
        var markers = [];
        if ($('#array_lat_lng').val()) {
            markers = JSON.parse($('#array_lat_lng').val())
        }
        console.log(markers)
        var details = {
            stepone: {
                'userid': JSON.parse(sessionStorage.userData)[0]._id,
                'land_id': id,
                'user_email': JSON.parse(sessionStorage.userData)[0].email,
                'user_type': JSON.parse(sessionStorage.userData)[0].userType,
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
                'kitongi': $("#kitongoji").val(),
                'village': $("#village").val(),
                'npnorth': $("#north").val(),
                'npsouth': $("#south").val(),
                'npeast': $("#east").val(),
                'npwest': $("#west").val(),
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
                'land_purpose': landpurpose,
            },
            stepfive: {
                'ownership_details': ownerdetails
            },
            stepsix: {
                'upload_title': uploaddetails
            }
        }

        $.when($.post('/updateGovLandRecord', details)).done(function (_res) {
            if (_res.code == 200) {
                // var olduser = JSON.parse(sessionStorage.userData)
                // if (!olduser[0].owner_demographic) {
                //     olduser[0].owner_demographic = ownerdetails[0];
                //     sessionStorage.setItem("userData", JSON.stringify(olduser))
                // }

                PNotify.success({
                    title: 'Success!',
                    text: 'Land Registered successfully!'
                });
                hidegenProgress();
                location.href = url + "/dashboard/dashboards/govlandlist.html"
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
})