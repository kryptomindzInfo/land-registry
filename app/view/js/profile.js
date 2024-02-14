$(window).on("load", function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    var editTime = new Date(sessionStorage.editTime)

    if(user.user_type == "3") {
        $('.show_this').hide()
    } else {
        $('.show_this').hide()
    }

    $('#birthdate_text').datepicker({
        dateFormat : 'dd/mm/yy',
        changeMonth : true,
        changeYear : true,
        yearRange: '-100y:c+nn',
        maxDate: '-1d'
    });

    hidegenProgress()

    function showgenProgress() {
        $('#loader-gen-wrapper').show();
    }

    function hidegenProgress() {
        $('#loader-gen-wrapper').hide();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (editTime) {
        var time_Diff = new Date() - editTime
        var timeDiff = Math.round((time_Diff / 1000) / 60);

        if (timeDiff < 5) {
            fieldsEnable()
        } else {
            fieldsDisable()
            sessionStorage.removeItem('editTime');
        }
    } else {
        fieldsDisable()
    }

    $.when($.get('/getSingleUser?id=' + user._id)).done(function (_res) {
        var user = _res.data[0]

        // $('#name_text').val(user.username)
        console.log(user)

        $('#firstname_text').val(user.firstname)
        $('#middlename_text').val(user.middlename)
        $('#lastname_text').val(user.lastname)
        $('#education_text').val(user.education)
        $("input[name=gender_text][value=" + user.gender + "]").prop('checked', true);
        $('#birthdate_text').datepicker("setDate", new Date(user.birthdate));
        $("input[name=maritial_status_text][value=" + user.maritial_status + "]").prop('checked', true);
        $("#employment_text").val(user.employment);
        $('#email_text').val(user.email)
        $('#phone_no_text').val(user.mobile)
        $('#address_text').val(user.address)
        $('#uniqueid_text').val(user.uniqueId)
        $('#user_id_text').val(user.user_id)

        if (user.nationality == 0) {
            $(".uniqueid_lbl").html('Nationality ID')
        } else {
            $(".uniqueid_lbl").html('Investor ID')
        }
    })

    $('#edit_btn').click(function () {
        var options = {}
        options.email = user.email
        $.when($.post('/generateOTP', options)).done(function (_res) {
            console.log(_res)
            $("#serverOtp").val(_res.otp)
            $('#auth_code_modal').modal('toggle')
        })
    })

    $("#verifyOtpForm").on('submit', async function (e) {
        e.preventDefault();
        showgenProgress()
        var otp = parseInt($("#otp_text").val());
        var serverOpt = parseInt($("#serverOtp").val());
        console.log(otp, serverOpt)
        if (otp === serverOpt) {
            hidegenProgress()
            $('#auth_code_modal').modal('toggle')
            sessionStorage.setItem("editTime", new Date())
            fieldsEnable()
        } else {
            alert("Wrong Authorization code! Please enter valid Authorization Code")
            fieldsDisable()
            hidegenProgress()
        }
    })

    function fieldsEnable() {
        $('#firstname_text').attr('disabled', false)
        $('#middlename_text').attr('disabled', false)
        $('#lastname_text').attr('disabled', false)
        $('#education_text').attr('disabled', false)
        $('.gender_text').attr('disabled', false)
        $('#birthdate_text').attr('disabled', false)
        $('.maritial_status_text').attr('disabled', false)
        $('#employment_text').attr('disabled', false)
        $('#phone_no_text').attr('disabled', false)
        $('#address_text').attr('disabled', false)
        $('#submit_btn').attr('disabled', false)
    }

    function fieldsDisable() {
        $('#firstname_text').attr('disabled', true)
        $('#middlename_text').attr('disabled', true)
        $('#lastname_text').attr('disabled', true)
        $('#education_text').attr('disabled', true)
        $('.gender_text').attr('disabled', true)
        $('#birthdate_text').attr('disabled', true)
        $('.maritial_status_text').attr('disabled', true)
        $('#employment_text').attr('disabled', true)
        $('#phone_no_text').attr('disabled', true)
        $('#address_text').attr('disabled', true)
        $('#submit_btn').attr('disabled', true)
    }

    $('#profile_edit_form').on('submit', function (e) {
        e.preventDefault()
        showgenProgress()
        let options = {}
        options.firstname = $('#firstname_text').val()
        options.middlename = $('#middlename_text').val()
        options.lastname = $('#lastname_text').val()
        options.education = $('#education_text').val()
        options.gender = $(".gender_text:checked").val()
        options.birthdate = $('#birthdate_text').val()
        options.maritial_status = $(".maritial_status_text:checked").val()
        options.employment = $('#employment_text').val()
        options.mobile = $('#phone_no_text').val()
        options.address = $('#address_text').val()
        options.user_id = user._id
        console.log(options)
        $.when($.post('/updateProfileDetails', options)).done(async function (_res) {
            console.log(_res)
            hidegenProgress()
            if (_res.code == 200) {
                sessionStorage.removeItem('userData')
                sessionStorage.setItem('userData', JSON.stringify(_res.user))
                PNotify.success({
                    title: 'Success!',
                    text: 'Profile Updated successfully!'
                });
                await sleep(2000);
                location.reload()
            } else {
                PNotify.error({
                    title: 'Error',
                    text: "Something went wrong! Please try again."
                });
            }
        })
    })
})