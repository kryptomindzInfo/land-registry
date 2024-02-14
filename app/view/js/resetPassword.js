$(window).on("load", function () {
    "use strict";
    hidegenProgress();
    var urls = new URL(window.location.href);
    var id = urls.searchParams.get("token");
    var expiry = parseInt(urls.searchParams.get("expiry"));
    var name = urls.searchParams.get("name");

    var currDate = (new Date()).getTime()
    var now = moment(currDate); //todays date
    var end = moment(expiry); // another date
    var duration = moment.duration(now.diff(end));
    var hrs = duration.asHours();
    var username = document.getElementById("welcome_name");
    username.textContent += name;
    //$("#welcome_name").html(name)

    if(hrs > 1) {
        $('#reset_password_btn').attr("disabled", "")
        $("#message_show").show()
    } else {
        $('#reset_password_btn').removeAttr("disabled")
        $("#message_show").hide()
    }

    $('#reset_password_form').on("submit", function (e) {
        e.preventDefault()
        showgenProgress();
        if (hrs < 1) {
            var password = $('#password').val()
            var cnfPassword = $('#cnfpassword').val()
            var options = {}
            options.id = id
            if(password == cnfPassword) {
                options.password = password
                options.expiry_time = hrs
                $.when($.post('/changePassword', options)).done(function (_res) {
                    console.log(_res)
                    if(_res.code == 200) {
                        hidegenProgress();
                        alert(_res.msg)
                        window.location.href=globals.URL
                    } else if(_res.code == 100) {
                        hidegenProgress();
                        alert(_res.msg)
                    } else if(_res.code == 101) {
                        hidegenProgress();
                        alert(_res.msg)
                    }
                })
            } else {
                hidegenProgress();
                alert("Password doesn't match")
            }
        } else {
            hidegenProgress();
            alert("The Link has been expired! please try again")
        }
    })

    function showgenProgress() {
        $('#loader-gen-wrapper').show();
    }

    function hidegenProgress() {
        $('#loader-gen-wrapper').hide();
    }

})