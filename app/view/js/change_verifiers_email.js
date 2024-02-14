$(window).on("load", function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    var editTime = new Date(sessionStorage.verifier_editTime)

    $.when($.get('/getVerifiers')).done(function (_res) {
        if (_res.code == 200) {
            var user1 = _res.data[0]
            var user2 = _res.data[1]
            var user3 = _res.data[2]
            var user4 = _res.data[3]

            $("#verifier_one_email_text").val(user1.email)
            $("#verifier_two_email_text").val(user2.email)
            $("#surveyour_email_text").val(user3.email)
            $("#commissioner_email_text").val(user4.email)
            $("#verifier_one_email_text_two").val(user1.email2)
            $("#verifier_two_email_text_two").val(user2.email2)
            $("#surveyour_email_text_two").val(user3.email2)
            $("#commissioner_email_text_two").val(user4.email2)
            $("#verifier_one_user_id").val(user1._id)
            $('#verifier_two_user_id').val(user2._id)
            $('#surveyour_user_id').val(user3._id)
            $('#commissioner_user_id').val(user4._id)
        } else {
            alert('Something went wrong! Please try again.')
        }
    })

    hidegenProgress()

    function showgenProgress() {
        $('#loader-gen-wrapper').show();
    }

    function hidegenProgress() {
        $('#loader-gen-wrapper').hide();
    }

    $('#edit_btn, #verifier_two_edit_btn, #surveyour_edit_btn, #commissioner_edit_btn').click(function () {
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
            sessionStorage.setItem("verifier_editTime", new Date())
            fieldsEnable()
        } else {
            alert("Wrong Authorization code! Please enter valid Authorization Code")
            fieldsDisable()
            hidegenProgress()
        }
    })

    function fieldsEnable() {
        $('#verifier_two_email_text').attr('disabled', false)
        $('#verifier_one_email_text').attr('disabled', false)
        $("#surveyour_email_text").attr('disabled', false)
        $("#commissioner_email_text").attr('disabled', false)
        $('#verifier_two_email_text_two').attr('disabled', false)
        $('#verifier_one_email_text_two').attr('disabled', false)
        $("#surveyour_email_text_two").attr('disabled', false)
        $("#commissioner_email_text_two").attr('disabled', false)
        $('#verifier_two_submit_btn').attr('disabled', false)
        $('#verifier_one_submit_btn').attr('disabled', false)
        $('#surveyour_submit_btn').attr('disabled', false)
        $('#commissioner_submit_btn').attr('disabled', false)
    }

    function fieldsDisable() {
        $('#verifier_two_email_text').attr('disabled', true)
        $('#verifier_one_email_text').attr('disabled', true)
        $("#surveyour_email_text").attr('disabled', true)
        $("#commissioner_email_text").attr('disabled', true)
        $('#verifier_two_email_text_two').attr('disabled', true)
        $('#verifier_one_email_text_two').attr('disabled', true)
        $("#surveyour_email_text_two").attr('disabled', true)
        $("#commissioner_email_text_two").attr('disabled', true)
        $('#verifier_two_submit_btn').attr('disabled', true)
        $('#verifier_one_submit_btn').attr('disabled', true)
        $('#surveyour_submit_btn').attr('disabled', true)
        $('#commissioner_submit_btn').attr('disabled', true)
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
            sessionStorage.removeItem('verifier_editTime');
        }
    } else {
        fieldsDisable()
    }

    $('#verifier_one_form').on('submit', function (e) {
        e.preventDefault()
        showgenProgress()
        let options = {}
        options.user_id = $('#verifier_one_user_id').val()
        options.email = $('#verifier_one_email_text').val()
        options.email2 = $('#verifier_one_email_text_two').val()
        console.log(options)
        $.when($.post('/updateVerifiersEmail', options)).done(async function (_res) {
            console.log(_res)
            hidegenProgress()
            if (_res.code == 200) {
                PNotify.success({
                    title: 'Success!',
                    text: 'Email Updated successfully!'
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

    $('#verifier_two_form').on('submit', function (e) {
        e.preventDefault()
        showgenProgress()
        let options = {}
        options.user_id = $('#verifier_two_user_id').val()
        options.email = $('#verifier_two_email_text').val()
        options.email2 = $('#verifier_two_email_text_two').val()
        console.log(options)
        $.when($.post('/updateVerifiersEmail', options)).done(async function (_res) {
            console.log(_res)
            hidegenProgress()
            if (_res.code == 200) {
                PNotify.success({
                    title: 'Success!',
                    text: 'Email Updated successfully!'
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

    $('#surveyour_form').on('submit', function (e) {
        e.preventDefault()
        showgenProgress()
        let options = {}
        options.user_id = $('#surveyour_user_id').val()
        options.email = $('#surveyour_email_text').val()
        options.email2 = $('#surveyour_email_text_two').val()
        console.log(options)
        $.when($.post('/updateVerifiersEmail', options)).done(async function (_res) {
            console.log(_res)
            hidegenProgress()
            if (_res.code == 200) {
                PNotify.success({
                    title: 'Success!',
                    text: 'Email Updated successfully!'
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

    $('#commissioner_form').on('submit', function (e) {
        e.preventDefault()
        showgenProgress()
        let options = {}
        options.user_id = $('#commissioner_user_id').val()
        options.email = $('#commissioner_email_text').val()
        options.email2 = $('#commissioner_email_text_two').val()
        console.log(options)
        $.when($.post('/updateVerifiersEmail', options)).done(async function (_res) {
            console.log(_res)
            hidegenProgress()
            if (_res.code == 200) {
                PNotify.success({
                    title: 'Success!',
                    text: 'Email Updated successfully!'
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