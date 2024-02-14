$(window).on("load", function () {
    var olduser = JSON.parse(sessionStorage.userData)[0];
    var user = JSON.parse(sessionStorage.userData)[0]['owner_demographic'];
    console.log(olduser);
    var ownertype = $('input[type=radio][name=ownership_type]').val();
    if (ownertype == 0) {
        prefillapplicantdata();
    }
    
    $('input[type=radio][name=ownership_type]').change(function () {
        if (this.value == 4) {
            
            $('#guard_firstname').val(olduser.firstname);
            $("#guard_middlename").val(olduser.middlename);
            $("#guard_lastname").val(olduser.lastname);
            $("#guard_leveledu").val(olduser.education);
            $("input[name=guard_gender_type][value=" + olduser.gender + "]").prop('checked', true);
            $("#guard_birthdate").val(olduser.birthdate);
            $("input[name=guard_maritial_status][value=" + olduser.maritial_status + "]").prop('checked', true);
            $("#guard_employment").val(olduser.employment);
            $("#guard_residence").val(olduser.address);
            
            $("input[name=guard_nationality_select][value=" + olduser.nationality + "]").prop('checked', true).trigger('change');
            $("#guard_nationality_id").val(olduser.uniqueId);
            $("#guard_phone_no").val(olduser.mobile);

            if ($(".address_similar:checked").val() == 0) {
                $(".address_similar_hide").show();
                $('#minor_residence').attr('value', '');
            } else {
                $(".address_similar_hide").hide();
                $('#minor_residence').attr('value', $('#guard_residence').val());
            }

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
        } else if (this.value == 0) {
            prefillapplicantdata();
        } else {
            $('.owner_user').each(function (index) {
                if (index == 0) {
                    $(this).find("input[class=nationality_select][value=" + olduser.nationality + "]").prop('checked', true);
                    $(this).find("#nationality_id").val(olduser.uniqueId);
                    $(this).find("#phone_no").val(olduser.mobile);
                    $(this).find('#firstname').val(olduser.firstname);
                    $(this).find("#middlename").val(olduser.middlename);
                    $(this).find("#lastname").val(olduser.lastname);
                    $(this).find("#leveledu").val(olduser.education);
                    $(this).find("input[name=gender_type][value=" + olduser.gender + "]").prop('checked', true);
                    $(this).find(".birthdate").val(olduser.birthdate);
                    $(this).find("input[name=maritial_status][value=" + olduser.maritial_status + "]").prop('checked', true);
                    $(this).find("#employment").val(olduser.employment);
                    $(this).find("#residence").val(olduser.address);
                    $(".nationality_select").attr("disabled", "");
                    $(".gender_type").attr("disabled", "");
                    $(".maritial_status").attr("disabled", "");
                    $("#nationality_id").attr("disabled", "");
                    $("#firstname").attr("disabled", "");
                    $("#lastname").attr("disabled", "");
                    $("#middlename").attr("disabled", "");
                    $("#leveledu").attr("disabled", "");
                    $(".birthdate").attr("disabled", "");
                    $("#phone_no").attr("disabled", "");
                    $("#employment").attr("disabled", "");
                    $("#residence").attr("disabled", "");
                }
        
            })
        
        }
    })

    function prefillapplicantdata() {
        if (olduser) {
            $('#applicant_firstname').val(olduser.firstname);
            $("#applicant_middlename").val(olduser.middlename);
            $("#applicant_lastname").val(olduser.lastname);
            $("#applicant_leveledu").val(olduser.education);
            $("input[name=applicant_gender_type][value=" + olduser.gender + "]").prop('checked', true);
            $("#applicant_birthdate").val(olduser.birthdate);
            $("input[name=applicant_maritial_status][value=" + olduser.maritial_status + "]").prop('checked', true).trigger('change');
            $("#applicant_employment").val(olduser.employment);
            $("#applicant_residence").val(olduser.address);



            if (olduser.maritial_status == 1) {
                if(user){
                    $("#spouse_firstname").val(user.spouse_details.firstname);
                    $("#spouse_middlename").val(user.spouse_details.middlename);
                    $("#spouse_lastname").val(user.spouse_details.lastname);
                    $("#spouse_leveledu").val(user.spouse_details.leveledu);
                    $("input[name=spouse_gender_type][value=" + user.spouse_details.gender + "]").prop('checked', true);
                    $("#spouse_birthdate").val(user.spouse_details.birthdate);
                    $("#spouse_employment").val(user.spouse_details.employment);
                    $("input[name=spouse_nationality_select][value=" + user.spouse_details.nationality_select + "]").prop('checked', true).trigger('change');
                    $("#spouse_nationality_id").val(user.spouse_details.unique_id);
                    $("#spouse_phone_no").val(user.spouse_details.phone_no);
                }
                //console.log(user.spouse_details.firstname);
                
            }



        }
        $("input[name=applicant_nationality_select][value=" + olduser.nationality + "]").prop('checked', true).trigger('change');
        $("#applicant_nationality_id").val(olduser.uniqueId);
        $("#applicant_phone_no").val(olduser.mobile);

        $(".applicant_nationality_select").attr("disabled", "");
        $("#applicant_nationality_id").attr("disabled", "");
        $("#applicant_phone_no").attr("disabled", "");
        $("#applicant_firstname").attr("disabled", "");
        $("#applicant_lastname").attr("disabled", "");
        $("#applicant_middlename").attr("disabled", "");
        $("#applicant_leveledu").attr("disabled", "");
        $(".applicant_gender_type").attr("disabled", "");
        $(".applicant_maritial_status").attr("disabled", "");
        $("#applicant_birthdate").attr("disabled", "");
        $("#applicant_employment").attr("disabled", "");
        $("#applicant_residence").attr("disabled", "");
    }

    var current_date = "Date : " + moment(new Date()).format('LLL');
    $('.date_text').html(current_date)

})