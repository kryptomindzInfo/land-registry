$(window).on("load", function () {
  var host = window.location.pathname;
  var domain = globals.URL;
  $.ajax({
    type: "POST",
    url: "/jwtTokenAuth",
    headers: { Authorization: "Bearer " + sessionStorage.usertoken },
    beforeSend: function (data) {},
    success: function (data) {
      if (data.result != "success" && host !== "/") {
        location.href = domain;
      }
    },
    error: function (err) {
      if (host !== "/") {
        location.href = domain;
      }
    },
  });
  console.log(sessionStorage.userData);
  var user = JSON.parse(sessionStorage.userData)[0];
  if (user.userType == "2") {
    $(".show_to_admin").show();
    $(".show_to_user").hide();
    $(".show_to_gov_user").hide();
    $(".show_to_verifier_one").hide();
    $(".show_to_commissioner").hide();
    $(".show_to_surveyour").hide();
    $(".show_to_verifier_two").hide();
  } else if (user.userType == "1") {
    $(".show_to_admin").hide();
    $(".show_to_user").hide();
    $(".show_to_gov_user").show();
    $(".show_to_verifier_one").hide();
    $(".show_to_commissioner").hide();
    $(".show_to_surveyour").hide();
    $(".show_to_verifier_two").hide();
  } else if (user.userType == "0") {
    $(".show_to_admin").hide();
    $(".show_to_user").show();
    $(".show_to_verifier_one").hide();
    $(".show_to_gov_user").hide();
    $(".show_to_commissioner").hide();
    $(".show_to_surveyour").hide();
    $(".show_to_verifier_two").hide();
  } else if (user.userType == "3") {
    $(".show_to_admin").hide();
    $(".show_to_user").hide();
    $(".show_to_gov_user").hide();
    $(".show_to_verifier_two").hide();
    $(".show_to_commissioner").hide();
    $(".show_to_surveyour").hide();
    $(".show_to_verifier_one").show();
  } else if (user.userType == "4") {
    $(".show_to_admin").hide();
    $(".show_to_user").hide();
    $(".show_to_gov_user").hide();
    $(".show_to_verifier_one").hide();
    $(".show_to_commissioner").hide();
    $(".show_to_surveyour").hide();
    $(".show_to_verifier_two").show();
  } else if (user.userType == "6") {
    $(".show_to_admin").hide();
    $(".show_to_user").hide();
    $(".show_to_gov_user").hide();
    $(".show_to_verifier_one").hide();
    $(".show_to_verifier_two").hide();
    $(".show_to_surveyour").hide();
    $(".show_to_commissioner").show();
  } else if (user.userType == "5") {
    $(".show_to_admin").hide();
    $(".show_to_user").hide();
    $(".show_to_gov_user").hide();
    $(".show_to_verifier_one").hide();
    $(".show_to_verifier_two").hide();
    $(".show_to_commissioner").hide();
    $(".show_to_surveyour").show();
  }

  $(".admin_name").html(user.firstname + " " + user.lastname);
  $(".admin_email").html(user.email);

  function clearsession() {
    sessionStorage.clear();
    location.href = domain + "/";
  }

  $("#signout_btn").on("click", function (e) {
    clearsession();
  });
});
