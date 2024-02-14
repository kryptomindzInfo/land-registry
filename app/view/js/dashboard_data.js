$(window).on("load", function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    var redirect_endpoint = 'dashboards/verifier_list_record.html?status='
    var redirect_endpoint_two = 'dashboards/verifier_two_list_record.html?status='
    var redirect_endpoint_comm = 'dashboards/commissioner_list_record.html?status='
    var redirect_endpoint_sur = 'dashboards/surveyour_list_record.html?status='
    var redirect_approve_sur = 'dashboards/surveyour_approve_list.html'
    var redirect_approve_two = 'dashboards/verifier_two_approve_list.html'
    var redirect_approve_comm = 'dashboards/commissioner_approve_list.html'
    var redirect_approve = 'dashboards/verifier_approve_list.html'
    var redirect_checklist = 'dashboards/verifier_inprogress_list.html'
    var redirect_checklist_2 = 'dashboards/verifier_two_inprogress_list.html'
    var redirect_checklist_comm = 'dashboards/commissioner_inprogress_list.html'
    var redirect_checklist_sur = 'dashboards/surveyour_inprogress_list.html'
    var redirect_forwarded = 'dashboards/verifier_forward_list.html'

    $.when($.get('/showLandStatus?id=' + user._id)).done(function (_res) {

        var len = _res.data.pending + _res.data.approved + _res.data.rejected + _res.data.saved
        $('.add_total_land_register').html(len)
    })

    $('.pending_tab').click(function () {
        console.log(user)
        if (user.userType == "3") {
            location.href = redirect_endpoint + '0' + "&hash=0"
        } else if (user.userType == "4") {
            location.href = redirect_endpoint_two + '7' + "&hash=0"
        } else if (user.userType == "6") {
            location.href = redirect_endpoint_comm + '4' + "&hash=0"
        } else if (user.userType == "5") {
            location.href = redirect_endpoint_sur + '6' + "&hash=0"
        }

    })

    $('.approved_tab').click(function () {
        if (user.userType == "3") {
            location.href = redirect_approve
        } else if (user.userType == "4") {
            location.href = redirect_approve_two
        } else if (user.userType == "6") {
            location.href = redirect_approve_comm
        } else if (user.userType == "5") {
            location.href = redirect_approve_sur
        }
    })

    $('.rejected_tab').click(function () {
        if (user.userType == "3") {
            location.href = redirect_endpoint + '2' + "&hash=1"
        } else if (user.userType == "4") {
            location.href = redirect_endpoint_two + '2' + "&hash=2"
        } else if (user.userType == "6") {
            location.href = redirect_endpoint_comm + '2' + "&hash=4"
        } else if (user.userType == "5") {
            location.href = redirect_endpoint_sur + '2' + "&hash=3"
        }
    })

    $('.inprogress_tab').click(function () {
        if (user.userType == "3") {
            location.href = redirect_checklist
        } else if (user.userType == "4") {
            location.href = redirect_checklist
        }
    })

    $('.inprogress_two_tab').click(function () {
        if (user.userType == "3") {
            location.href = redirect_checklist_2
        } else if (user.userType == "4") {
            location.href = redirect_checklist_2
        } else if (user.userType == "6") {
            location.href = redirect_checklist_comm
        } else if (user.userType == "5") {
            location.href = redirect_checklist_sur
        }
    })

    // $('.forwarded_tab').click(function () {
    //     if(user.userType == "3") {
    //         location.href = redirect_forwarded
    //     } else if(user.userType == "4") {
    //         location.href = redirect_forwarded
    //     }
    // })

    if (user.userType == "2") {
        $.when($.get('/showAdminLandTypes')).done(function (_res) {
            console.log(_res)

            var total = _res.certificateType.OfferLetter + _res.certificateType.Digital + _res.certificateType.ccro + _res.certificateType.nonDigital + _res.certificateType.residential + _res.certificateType.others
            $('.total_land_register_admin').html(total)

            var data = _res.certificateType

            var html = ''

            html += '<div class="kt-widget-19__bar">\
            <div class="housing kt-widget-19__bar-'+ (data.OfferLetter * 5) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Offer Letter ('+ data.OfferLetter + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="farming kt-widget-19__bar-'+ (data.Digital * 5) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Digital Land Title Certificate ('+ data.Digital + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="police kt-widget-19__bar-'+ (data.ccro * 5) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Certificate of Customary Right of Ownership ('+ data.ccro + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="hospital kt-widget-19__bar-'+ (data.nonDigital * 5) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Non Digital Land Title Certificate ('+ data.nonDigital + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="forest kt-widget-19__bar-'+ (data.residential * 5) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Residential License ('+ data.residential + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="others kt-widget-19__bar-'+ (data.others * 5) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Others ('+ data.others + ')"></div>\
            </div>\
            '


            $('.show_admin_certificate_type').html(html)

        })
    }

    if (user.userType == "1") {
        $.when($.get('/showGovLandTypes?id=' + user._id)).done(function (_res) {
            console.log(_res)

            var data = _res.data

            var html = ''

            html += '<div class="kt-widget-19__bar">\
            <div class="housing kt-widget-19__bar-'+ (data.housing * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Housing ('+ data.housing + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="farming kt-widget-19__bar-'+ (data.govFarming * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Goverment Farming ('+ data.govFarming + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="police kt-widget-19__bar-'+ (data.police * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Police ('+ data.police + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="hospital kt-widget-19__bar-'+ (data.hospital * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Hospital ('+ data.hospital + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="forest kt-widget-19__bar-'+ (data.forest * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Forest ('+ data.forest + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="park kt-widget-19__bar-'+ (data.nationalPark * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="National Park ('+ data.nationalPark + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="mineral kt-widget-19__bar-'+ (data.mineral * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Mineral Area ('+ data.mineral + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="govt kt-widget-19__bar-'+ (data.govAuth * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Government Institutions Authorities ('+ data.govAuth + ')"></div>\
            </div>\
            <div class="kt-widget-19__bar">\
            <div class="others kt-widget-19__bar-'+ (data.others * 20) + '" data-toggle="kt-tooltip"\
                data-skin="brand" data-placement="top" title="Others ('+ data.others + ')"></div>\
            </div>'


            $('.show_gov_land_types').html(html)

        })
    }

})