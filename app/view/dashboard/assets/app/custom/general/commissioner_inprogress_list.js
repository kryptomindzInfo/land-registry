jQuery(document).ready(function () {
    var domain = globals.URL;
    var ipfsurl = globals.IPFS_URL;
    var urls = new URL(window.location.href);
    var approvalStatus = urls.searchParams.get("status");
    var hash = urls.searchParams.get("hash");
    var redirect = urls.searchParams.get("re");

    if (redirect) {
        location.href = 'verifier_inprogress_list.html'
    } else {

    }

    // if(approvalStatus == "0") {
    //     $(".add_breadCrum").html('Pending Lands')
    // } else if(approvalStatus == "3") {
    //     $(".add_breadCrum").html('Approved Lands')
    // } else if(approvalStatus == "2") {
    //     $(".add_breadCrum").html('Rejected Lands')
    // }

    $(".add_breadCrum").html('In Progress Checklist')

    verifier_land_init();

    function verifier_land_init() {
        var user = JSON.parse(sessionStorage.userData)[0];
        if ($('#show_land_records_verifier').length === 0) {
            return;
        }

        var datatable = $('#show_land_records_verifier').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: domain + '/showInProgressChecklist?verifier_id=' + user._id,
                        method: 'GET'
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: true
            },

            // layout definition
            layout: {
                scroll: true,
                footer: false,
                height: 430
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#kt_search'),
            },

            // columns definition
            columns: [{
                field: 'id',
                title: '#',
                sortable: false,
                width: 20,
                type: 'number',
                selector: { class: 'kt-checkbox--solid' },
                textAlign: 'center',
            }, {
                field: 'application_id',
                title: 'Application ID',
                width: 150,
                template: function (row) {
                    return '<span class="kt-label-font-color-3 kt-font-bold">' + row.land_id + '</span>';
                },
            }, {
                field: 'certificate_id',
                title: 'Certificate ID',
                width: 100,
                template: function (row) {
                    var certi_no
                    if (row.land_details.certificate_no != '') {
                        certi_no = row.land_details.certificate_no
                    } else {
                        certi_no = 'To be Generated'
                    }
                    return '<span class="kt-label-font-color-3 kt-font-bold">' + certi_no + '</span>';
                },
            }, {
                field: 'status',
                title: 'Status',
                width: 80,
                template: function (row) {
                    return '<span class="kt-label-font-color-3 kt-font-bold">In Progress</span>';
                },
            },
            {
                field: 'application_date',
                title: 'Application Date',
                width: 180,
                template: function (row) {
                    return '<span class="kt-label-font-color-3 kt-font-bold">' + moment(row.land_details.time_stamp).format('llll'); + '</span>';
                },
            },
            {
                field: 'view_verifier_one_question',
                title: 'Show Verified Details',
                width: 100,
                sortable: false,
                autoHide: false,
                overflow: 'visible',
                textAlign: 'center',
                template: function (row) {
                    var filename, filehash, filehash1, filename1, filehash2, filename2
                    if (row.land_details.hasOwnProperty('extraDocs')) {
                        filename = row.land_details.extraDocs.file_name
                        filehash = row.land_details.extraDocs.file_hash
                    } else {
                        filename = ''
                        filehash = ''
                    }
                    if (row.land_details.hasOwnProperty('extraDocs1')) {
                        filename1 = row.land_details.extraDocs1.file_name
                        filehash1 = row.land_details.extraDocs1.file_hash
                    } else {
                        filename1 = ''
                        filehash1 = ''
                    }
                    if (row.hasOwnProperty('extraDocs2')) {
                        filename2 = row.land_details.extraDocs2.file_name
                        filehash2 = row.land_details.extraDocs2.file_hash
                    } else {
                        filename2 = ''
                        filehash2 = ''
                    }
                    return '<div class="row action_btn_row">\
                                <a data-id="'+ row._id + '" data-status="' + row.isSurveyApproved + '" data-comment="' + row.land_details.comment + '"  data-comment2="' + row.land_details.comment2 + '" data-comment3="' + row.land_details.comment3 + '" data-fileHash="' + filehash + '" data-fileName="' + filename + '" data-fileHash1="' + filehash1 + '" data-fileName1="' + filename1 + '" data-fileHash2="' + filehash2 + '" data-fileName2="' + filename2 + '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_verified_question" title="View Verified Details">\
                                    <i class="la la-book"></i>\
                                </a>\
                            </div>\
                    ';
                },
            },
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 80,
                overflow: 'visible',
                textAlign: 'center',
                autoHide: false,
                template: function (row) {
                    console.log(row)
                    return '<div class="row action_btn_row">\
                                <a data-id="'+ row.land_details._id + '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details">\
                                    <i class="la la-eye"></i>\
                                </a>\
                                <a  data-id="'+ row.land_id + '" data-userid="' + row.land_user + '" data-certificateno="' + row.land_details.certificate_no + '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="edit_draft_application" title="Edit Details">\
                                    <i class="la la-pencil"></i>\
                                </a>\
                            </div>\
                    ';
                }
            }]
        });

        $("#show_land_records_verifier").on("click", 'tbody #edit_draft_application', function (e) {
            var row = $(this).data('id');
            location.href = 'commissioner_checklist.html?id=' + row + '&user=' + $(this).data('userid') + '&certi=' + $(this).data('certificateno')
        })

        $("#show_land_records_verifier").on("click", 'tbody #view_verified_question', function (e) {
            var row = $(this).data('id');
            var html = '', html2 = '';
            $.each(globals.VERIFIER_ONE, (key, value) => {
                html += '<li>\
            <div class="row">\
                <div class="col-lg-9">\
                    <h6 class="kt-section__title kt-section__title-sm quesion_' + key + '_text">\
                        '+ value + '\
                    </h6>\
                </div>\
                <div class="col-lg-3 checkbox_div">\
                    <label class="kt-checkbox">\
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
            })

            $.each(globals.VERIFIER_TWO, (key, value) => {
                html2 += '<li>\
            <div class="row">\
                <div class="col-lg-9">\
                    <h6 class="kt-section__title kt-section__title-sm quesion_' + key + '_text">\
                        '+ value + '\
                    </h6>\
                </div>\
                <div class="col-lg-3 checkbox_div">\
                    <label class="kt-checkbox">\
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
            })

            if ($(this).data('status') == '0') {
                $(".hide_class").hide()
            } else if ($(this).data('status') == '1') {
                $(".hide_class").show()
            } else {
                $(".hide_class").hide()
            }
            console.log($(this).data('filehash'))
            if ($(this).data('filehash') != '') {
                $('.verifier_two_hide_file').show()
            } else {
                $('.verifier_two_hide_file').hide()
            }

            $("#file_name").html($(this).data('filename'))
            $("#file_url").html('<a href="' + ipfsurl + '/ipfs/' + $(this).data('filehash') + '" target="_blank">' + $(this).data('filehash') + '</a>')

            if ($(this).data('filehash1') != '') {
                $('.verifier_one_hide_file').show()
            } else {
                $('.verifier_one_hide_file').hide()
            }

            $("#file_name_one").html($(this).data('filename1'))
            $("#file_url_one").html('<a href="' + ipfsurl + '/ipfs/' + $(this).data('filehash1') + '" target="_blank">' + $(this).data('filehash1') + '</a>')

            if ($(this).data('filehash2') != '') {
                $('.surveyor_hide_file').show()
            } else {
                $('.surveyor_hide_file').hide()
            }

            $("#file_name_two").html($(this).data('filename2'))
            $("#file_url_two").html('<a href="' + ipfsurl + '/ipfs/' + $(this).data('filehash2') + '" target="_blank">' + $(this).data('filehash2') + '</a>')

            $("#survey_comment_text").val($(this).data('comment3'))

            $('#comment_text').val($(this).data('comment'))
            $('#comment_two_text').val($(this).data('comment2'))
            $(".questions_ol").html(html)
            $(".questions_ol_two").html(html2)
            $('#show_verifier_modal').modal('toggle')
        })

        $('#preview_details').click(function () {
            hidepreview()
        })

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

        function certificateData(data) {

            if (data.hasOwnProperty('certificate_type')) {
                var c_type = data.certificate_type
                var c_val = ''
                if (c_type == 0) {
                    $('#preview_certificate_type').html('Offer Letter')
                } else if (c_type == 1) {
                    $('#preview_certificate_type').html('Digital Land Title Certificate')
                } else if (c_type == 2) {
                    $('#preview_certificate_type').html('Certificate of Customary Right of Ownership')

                } else if (c_type == 3) {
                    $('#preview_certificate_type').html('Non Digital Land Title Certificate')
                } else if (c_type == 4) {
                    $('#preview_certificate_type').html(globals.RL)
                }
            }

            var has_certi = data.isExtraApprovalRequired
            if (has_certi == 0) {
                $('#preview_has_certificate').html('No')
            } else if (has_certi == 1) {
                $('#preview_has_certificate').html('Yes')
            } certificateData

            var c_no = data.certificate_no
            $('#preview_certificate_no').html(c_no)
        }

        function certificateDatatwo(data) {
            var dist_data, rgn_data, ward_data;
            $.when($.get('/getSingleRegion?id=' + data.region)).done(function (_res) {
                rgn_data = _res.data[0];
                $('#preview_region').html(rgn_data.name)
            })

            $.when($.get('/getSingleDistrict?id=' + data.district)).done(function (_res) {
                dist_data = _res.data[0];
                $('#preview_district').html(dist_data.name)
            })

            $.when($.get('/getSingleWard?id=' + data.ward_no)).done(function (_res) {
                ward_data = _res.data[0];
                console.log(ward_data);
                $('#preview_ward_no').html(ward_data.name)
            })


            // $('#preview_region').html(rgn_data.name)
            $('#preview_block_no').html(data.block_no)
            // $('#preview_district').html(dist_data.name)
            // $('#preview_ward_no').html(ward_data.name)
            $('#preview_plot_no').html(data.plot_no)
            $('#preview_location').html(data.location)
            $('#preview_address').html(data.address)
            $('#preview_feature').html(data.land_feature)
            $('#preview_height').html(data.land_height)
            $('#preview_width').html(data.land_width)
            $('#preview_area').html(data.land_area)
            $('#preview_lat').html(data.land_lat)
            $('#preview_long').html(data.land_long)
            $('#preview_marked_area').html(data.marked_area)
            $('#preview_village').html(data.village)
            $('#preview_kitongoji').html(data.kitongoji)
            $('#preview_npnorth').html(data.npnorth)
            $('#preview_npsouth').html(data.npsouth)
            $('#preview_npeast').html(data.npeast)
            $('#preview_npwest').html(data.npwest)
        }

        function certificateDataThree(data) {
            if (data.hasOwnProperty('certificate_type')) {
                $('.commer_type').hide();
                $('.resi_type').hide();
                //$('#preview_purpose_type').html($(".purpose_select:checked").val())

                if (data.land_purpose_type == 0) {
                    $('#preview_purpose_type').html('Residential');
                    var r_type = data.land_purpose
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

                if (data.land_purpose_type == 1) {
                    $('.commer_type').show();
                    $('#preview_purpose_type').html('Commercial');
                    var co_type = data.land_purpose

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
            } else {
                $(".resi_type").hide()
                $(".commer_type").hide()
                if (data.land_purpose == 0) {
                    $('#preview_purpose_type').html('Housing')
                } else if (data.land_purpose == 1) {
                    $('#preview_purpose_type').html('Government Farming')
                } else if (data.land_purpose == 2) {
                    $('#preview_purpose_type').html('Police')
                } else if (data.land_purpose == 3) {
                    $('#preview_purpose_type').html('Hospital')
                } else if (data.land_purpose == 4) {
                    $('#preview_purpose_type').html('Forest')
                } else if (data.land_purpose == 5) {
                    $('#preview_purpose_type').html('National Parks')
                } else if (data.land_purpose == 6) {
                    $('#preview_purpose_type').html('Mineral Areas')
                } else if (data.land_purpose == 7) {
                    $('#preview_purpose_type').html('Government Institutions Authorities')
                } else if (data.land_purpose == 8) {
                    $('#preview_purpose_type').html('Others')
                }
            }
        }

        function certificateDataFive(data) {
            var html1 = '';
            if (data.upload_title) {
                if (data.upload_title.length > 0) {
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
                    $('.preview_upload_data').html(html1)
                }
            }

        }

        function certificateDataFour(data) {
            if (data.hasOwnProperty('certificate_type')) {
                var o_type = data.ownership_type
                if (o_type == 0) {
                    $('#preview_ownership_type').html('Owner/Applicant')
                } else if (o_type == 1) {
                    $('#preview_ownership_type').html('Group')
                } else if (o_type == 2) {
                    $('#preview_ownership_type').html('Group with shares')
                } else if (o_type == 3) {
                    $('#preview_ownership_type').html('Corporation')
                } else if (o_type == 4) {
                    $('#preview_ownership_type').html('Owner with guardian')
                } else if (o_type == 5) {
                    $('#preview_ownership_type').html('Customary')
                }

                var c_type = data.certificate_type
                if (c_type == 4) {
                    $('#preview_lease_term').html(data.lease_term)
                } else if (c_type == 2) {
                    $('#preview_lease_term').html(data.lease_term)
                } else {
                    var l_term = data.lease_term
                    $('#preview_lease_term').html(data.lease_term)
                    // if (l_term == 0) {
                    //     $('#preview_lease_term').html('33 years')
                    // } else if (l_term == 1) {
                    //     $('#preview_lease_term').html('66 years')
                    // } else if (l_term == 2) {
                    //     $('#preview_lease_term').html('99 years')
                    // }else if(l_term == ''){
                    //     $('#preview_lease_term').html('')
                    // }
                }

                var l_type = data.lease_term_type
                if (l_type == 0) {
                    $('#preview_lease_type').html('Mda Maalumu')
                    $('#preview_term_years').html(data.lease_term)
                } else if (l_type == 1) {
                    $('#preview_lease_type,').html('Hakuna Mda Maalumu')
                    $('#preview_term_years').html('N/A')
                }

                $('#preview_lease_start_date').html(data.lease_start_date)
                var html = ''
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
                    var appli_id = '';
                    var nationalityapplicant = users.nationality_select
                    var nationality_applicant_val = ''
                    if (nationalityapplicant == 0) {
                        appli_id = 'Nationality ID';
                        nationality_applicant_val = 'Tanzanian'
                    } else if (nationalityapplicant == 1) {
                        nationality_applicant_val = 'Non-Tanzanian'
                        appli_id = 'Investor ID';
                    }
                    if (o_type == 0) {




                        var heading_text = ''

                        if (index == 0) {
                            heading_text = 'Applicant'
                        } else {
                            heading_text = 'Spouse'
                        }
                        var display = ''
                        if (index == 1) {
                            display = 'display: none;'
                        } else {
                            display = 'display: block;'
                        }



                        html += ' <div class="kt-heading kt-heading--md">' + heading_text + '</div>\
                <div class="row">\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">First Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_first_name">'+ users.firstname + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Middle Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_middle_name">'+ users.middlename + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Last Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_last_name">'+ users.lastname + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Education:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_lvledu">'+ users.leveledu + '</span>\
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
                                <span class="preview_content" id="preview_dob">'+ users.birthdate + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6" style="'+ display + ' ">\
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
                                <span class="preview_content" id="preview_employment">'+ users.employment + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Residence:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_residence">'+ users.residence + '</span>\
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
                                <span class="preview_content" id="preview_unique_id">'+ users.unique_id + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                       <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Phone No. :</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_phone_no">'+ users.phone_no + '</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>'
                    } else if (o_type == 4) {
                        var heading_text = ''
                        if (index == 0) {
                            heading_text = "Owner"
                        } else {
                            heading_text = "Guardian"
                        }

                        var display = ''
                        if (index == 0) {
                            display = 'display: none;'
                        } else {
                            display = 'display: block;'
                        }


                        html += ' <div class="kt-heading kt-heading--md">' + heading_text + '</div>\<div class="row">\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">First Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_first_name">'+ users.firstname + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">'+ users.middlename + '</span>\
                        </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Last Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_last_name">'+ users.lastname + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Education:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_lvledu">'+ users.leveledu + '</span>\
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
                                <span class="preview_content" id="preview_dob">'+ users.birthdate + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6" style="'+ display + '">\
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
                                <span class="preview_content" id="preview_employment">'+ users.employment + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Residence:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_residence">'+ users.residence + '</span>\
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
                                <span class="preview_content" id="preview_unique_id">'+ users.unique_id + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Phone No. :</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_phone_no">'+ users.phone_no + '</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>'
                    } else {



                        html += ' <div class="kt-heading kt-heading--md">Owner -' + (index + 1) + '</div>\<div class="row">\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">First Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_first_name">'+ users.firstname + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Middle Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_middle_name">'+ users.middlename + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Last Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_last_name">'+ users.lastname + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Education:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_lvledu">'+ users.leveledu + '</span>\
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
                                <span class="preview_content" id="preview_dob">'+ users.birthdate + '</span>\
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
                                <span class="preview_content" id="preview_employment">'+ users.employment + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Residence:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_residence">'+ users.residence + '</span>\
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
                                <span class="preview_content" id="preview_unique_id">'+ users.unique_id + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">Phone No. :</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_phone_no">'+ users.phone_no + '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6" style='+ display_share + '>\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Share % :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_share_val">'+ users.share_value + '</span>\
                        </div>\
                    </div>\
                </div>\
                </div>'
                    }


                })
                $(".preview_user_data").html(html)
            } else {
                $('#preview_ownership_type').html(data.ownership_details)
            }

        }



        $("#show_land_records_verifier").on("click", 'tbody #view_full_details', function (e) {
            e.preventDefault()
            var row = $(this).data('id');
            console.log(row)
            $.when($.get('/getSingalLand?id=' + row)).done(function (_res) {
                var data = _res.data[0];
                // console.log(_res.data[0].address);
                if (data.hasOwnProperty('certificate_type')) {
                    $(".resi_type").show()
                    $(".commer_type").show()
                    $(".normal_div").show()
                    $(".preview_user_data").show()
                    $("#preview_certificate_type_div").show()
                    var c_type = data.certificate_type

                    if (c_type == 0) {
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
                } else {
                    $("#preview_certificate_type_div").hide()
                    $(".resi_type").hide()
                    $(".commer_type").hide()
                    $(".normal_div").hide()
                    $(".preview_user_data").hide()
                }
                console.log(_res.data[0]);
                $("#preview_user_data").val(JSON.stringify(data))
                $("#preview_user_id").val(data._id)
                $("#map_zoom").val(data.zoom_level)
                $("#lat_input,#lat_input_text").val(data.land_lat)
                $("#lng_input,#lng_input_text").val(data.land_long).trigger("change")
                $('#array_lat_lng,#array_lat_lng_text').val(JSON.stringify(data.land_markers)).trigger("change")
                $("#headingOne3").on('click', function () {
                    certificateData(data)
                })

                $('#preview_print_btn').click(function () {
                    window.open("pdfdetails.html?id=" + row, "_blank");
                })

                $("#headingTwo3").on('click', function () {
                    certificateDatatwo(data)
                })

                $("#headingThree3").on('click', function () {
                    certificateDataThree(data)
                })

                $("#headingFour3").on('click', function () {
                    certificateDataFour(data)
                })

                $("#headingFive3").on('click', function () {
                    certificateDataFive(data)
                })

                $('#preview_details').modal('toggle')
            })

        })

        $('#kt_form_status').on('change', function () {
            //alert($(this).val());
            datatable.search($(this).val(), 'status');
            //datatable.reload();
        });

        $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

        // Reload datatable layout on aside menu toggle
        if (KTLayout.getAsideSecondaryToggler && KTLayout.getAsideSecondaryToggler()) {
            KTLayout.getAsideSecondaryToggler().on('toggle', function () {
                datatable.redraw();
            });
        }

        // Fix datatable layout in tabs
        datatable.closest('.kt-content__body').find('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            datatable.redraw();
        });
    };

});