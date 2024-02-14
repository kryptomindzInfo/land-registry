$(window).on("load", function () {
  "use strict";
  //alert(window.innerWidth)
  var url = globals.URL;
  var ipfsurl = globals.IPFS_URL;
  hidegenProgress();

  var today = new Date();
  $("#demo_birthdate, #leasedate, #leasedate_validate").datepicker({
    dateFormat: "dd/mm/yy",
    changeMonth: true,
    changeYear: true,
    yearRange: "-100y:c+nn",
    maxDate: "-1d",
  });

  $(
    "input[name^=birthdate], input[name^=birthdate_text],input[name^=guard_birthdate],input[name^=minor_birthdate],input[name^=applicant_birthdate],input[name^=spouse_birthdate]"
  ).datepicker({
    dateFormat: "dd/mm/yy",
    changeMonth: true,
    changeYear: true,
    yearRange: "-100y:c+nn",
    maxDate: "-1d",
  });

  $(".date_today").html(moment(today).format("ll"));

  $(".cloning_demographic").hide();
  $(".cloning_btn").hide();
  $(".close_div").hide();
  $("#resedential_drpdwn").hide();
  $("#commercial_drpdwn").hide();
  $(".minor").hide();
  if ($(".applicant_maritial_status:checked").val() == 1) {
    $(".spouse").show();
  } else {
    $(".spouse").hide();
  }
  $("#certi_bread").hide();

  $(".nondigi_div").hide();
  $(".offerdiv").hide();
  $("#term_div").hide();
  $(".hideadd").hide();
  $("#occupancy_term").hide();
  $(".commer_type").hide();
  $(".resi_type").hide();
  $(".address_similar_hide").hide();
  $(".features-dv form ul li input:checkbox").on("click", function () {
    return false;
  });

  $(".rtl-select").on("click", function () {
    window.location.href = "17_Features_Example_Alt_Titlebar.rtl.html";
  });
  $(".eng-select").on("click", function () {
    window.location.href = "17_Features_Example_Alt_Titlebar.html";
  });

  /*==============================================
                      Custom Dropdown
    ===============================================*/

  $(".drop-menu").on("click", function () {
    $(this).attr("tabindex", 1).focus();
    $(this).toggleClass("active");
    $(this).find(".dropeddown").slideToggle(300);
  });
  $(".drop-menu").on("focusout", function () {
    $(this).removeAttr("tabindex", 1).focus();
    $(this).removeClass("active");
    $(this).find(".dropeddown").slideUp(300);
  });
  $(".drop-menu .dropeddown li").on("click", function () {
    $(this).parents(".drop-menu").find("span").text($(this).text());
    $(this).parents(".drop-menu").find("span").addClass("selected");
    $(this)
      .parents(".drop-menu")
      .find("input")
      .attr("value", $(this).attr("id"));
  });

  /*==============================================
                      POPUP FUNCTIONS
    ===============================================*/

  $(".signin-op").on("click", function () {
    $("#sign-popup").toggleClass("active");
    $("#register-popup").removeClass("active");
    $(".wrapper").addClass("overlay-bgg");
  });
  $("#close_btn").on("click", function () {
    $("#sign-popup").removeClass("active");
    $("#authsign-popup").removeClass("active");
    $("#otp-popup").removeClass("active");
    $("#status-popup").removeClass("active");
    $("#demographic-popup").removeClass("active");
    $("#loginotp").val("");
    $(".wrapper").removeClass("overlay-bgg");
  });
  $("#forget_close_btn").on("click", function () {
    $("#sign-popup").removeClass("active");
    $("#authsign-popup").removeClass("active");
    $("#otp-popup").removeClass("active");
    $("#status-popup").removeClass("active");
    $("#forgetpassword-popup").removeClass("active");
    $("#loginotp").val("");
    $(".wrapper").removeClass("overlay-bgg");
  });
  $("#close_btn_register").on("click", function () {
    $("#register-popup").removeClass("active");
    $("#otp-popup").removeClass("active");
    $("#status-popup").removeClass("active");
    $("#demographic-popup").removeClass("active");
    $("#otp").val("");
    $(".wrapper").removeClass("overlay-bgg");
  });

  $("#close_btn_auth").on("click", function () {
    $("#authsign-popup").removeClass("active");
    $("#register-popup").removeClass("active");
    $("#otp-popup").removeClass("active");
    $("#status-popup").removeClass("active");
    $("#demographic-popup").removeClass("active");
    $("#otp").val("");
    $(".wrapper").removeClass("overlay-bgg");
  });

  $("#forget_password_btn").on("click", function () {
    $("#forgetpassword-popup").toggleClass("active");
    $("#forget_pass_status_span").hide();
    $("#sign-popup").removeClass("active");
    $(".wrapper").addClass("overlay-bgg");
  });

  $("#close_btn_2").on("click", function () {
    $("#register-popup").removeClass("active");
    $("#otp-popup").removeClass("active");
    $("#status-popup").removeClass("active");
    $("#demographic-popup").removeClass("active");
    $("#otp").val("");
    $(".wrapper").removeClass("overlay-bgg");
  });
  $("#close_btn_3").on("click", function () {
    $("#register-popup").removeClass("active");
    $("#otp-popup").removeClass("active");
    $("#status-popup").removeClass("active");
    $("#demographic-popup").removeClass("active");
    $("#otp").val("");
    $(".wrapper").removeClass("overlay-bgg");
  });

  $(".signin-op, .popup").on("click", function (e) {
    e.stopPropagation();
  });

  $(".reg-op").on("click", function () {
    $("#register-popup").toggleClass("active");
    //$("#demographic-popup").toggleClass("active");
    $(".wrapper").addClass("overlay-bgg");
    $("#sign-popup").removeClass("active");
  });
  // $("html").on("click", function () {
  //     $("#register-popup").removeClass("active");
  //     $("#otp-popup").removeClass("active");
  //     $("#status-popup").removeClass("active");
  //     $("#demographic-popup").removeClass("active");
  //     $(".wrapper").removeClass("overlay-bgg");
  // });
  $(".reg-op, .popup").on("click", function (e) {
    e.stopPropagation();
  });

  $("#home_btn").on("click", function (e) {
    $("#status-popup").removeClass("active");
    $(".wrapper").removeClass("overlay-bgg");
  });

  $("#signin_btn").on("click", function (e) {
    $("#status-popup").removeClass("active");
    $("#sign-popup").toggleClass("active");
    $(".wrapper").addClass("overlay-bgg");
  });

  $("#open_auth_popup").on("click", function (e) {
    e.preventDefault();
    $("#forgetpassword-popup").removeClass("active");
    $("#authsign-popup").toggleClass("active");
    $(".wrapper").addClass("overlay-bgg");
  });

  /*============================================
                REGION, WARD, DISTRICT FUNCTIONS
    =============================================*/

  $.when($.get("/getRegions")).done(function (_res) {
    var regions = _res.data;
    regions.map(function (region) {
      $("<option>").val(region.id).text(region.name).appendTo("#region");
    });
  });

  $("#district").attr("disabled", true);
  $("#ward").attr("disabled", true);

  $("#region").change(function () {
    $("#district").find("option").remove();
    $("#ward").find("option").remove();
    $("#ward").attr("disabled", true);
    $("<option>").val("").text("Select Ward").appendTo("#ward");
    $("<option>").val("").text("Select District").appendTo("#district");
    var region = $(this).val();
    var districts_arr = [];
    $.when($.get("/getDistricts?id=" + region)).done(function (_res) {
      var districts = _res.data;
      districts.map(function (district) {
        if (district.region_id == region) {
          districts_arr.push(district);
        }
      });

      if (region != "") {
        $("#district").removeAttr("disabled");

        districts_arr.map(function (district) {
          $("<option>")
            .val(district.id)
            .text(district.name)
            .appendTo("#district");
        });
      } else {
        $("#ward").attr("disabled", true);
        $("#district").attr("disabled", true);
      }
    });
  });

  $("#district").change(function () {
    $("#ward").find("option").remove();
    $("<option>").val("").text("Select Ward").appendTo("#ward");
    var district = $(this).val();
    var wards_arr = [];

    $.when($.get("/getWards?id=" + district)).done(function (_res) {
      var wards = _res.data;
      wards.map(function (ward) {
        if (ward.district_id == district) {
          wards_arr.push(ward);
        }
      });

      if (district != "") {
        $("#ward").removeAttr("disabled");

        wards_arr.map(function (ward) {
          $("<option>").val(ward.id).text(ward.name).appendTo("#ward");
        });
      } else {
        $("#ward").attr("disabled", true);
      }
    });
  });

  /*==============================================
                FEATURES TOGGLE FUNCTION
    ===============================================*/

  $(".more-feat > h3").on("click", function () {
    $(".features_list").slideToggle();
  });

  /*==============================================
                    HALF MAP POSITIONING
    ===============================================*/

  var hd_height = $("header").innerHeight();
  $(".half-map-sec #map-container.fullwidth-home-map").css({
    top: hd_height,
  });
  $(".half-map-sec").css({
    "margin-top": hd_height,
  });

  /*==============================================
        SETTING POSITION ACRD TO CONTAINER
    ===============================================*/

  // var offy = $(".container").offset().left;
  // $(".banner_text").css({
  //   "left": offy
  // });

  // $(".banner_text.fr").css({
  //   "right": offy
  // });

  if ($(window).width() > 768) {
    var aprt_img = $(".apartment-sec .card_bod_full").innerHeight();
    $(".apartment-sec .img-block").css({
      height: aprt_img,
    });
  }

  $(".close-menu").on("click", function () {
    $(".navbar-collapse").removeClass("show");
    return false;
  });

  /*==============================================
                      SETTING HEIGHT OF DIVS
    ===============================================*/

  var ab_height = $(".agent-info").outerHeight();
  $(".agent-img").css({
    height: ab_height,
  });

  /*==============================================
                    SMOOTH SCROLLING
    ===============================================*/

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // document.querySelector(this.getAttribute('href')).scrollIntoView({
      //         behavior: 'smooth'
      //     });
    });
  });

  /*==============================================
                      DROPDOWN EFFECT
    ===============================================*/

  $(".dropdown").on("show.bs.dropdown", function (e) {
    $(this).find(".dropdown-menu").first().stop(true, true).slideDown(300);
  });

  $(".dropdown").on("hide.bs.dropdown", function (e) {
    $(this).find(".dropdown-menu").first().stop(true, true).slideUp(200);
  });

  /*==============================================
                      ALERT FUNCTIONS
    ===============================================*/

  $(".popular-listing .card .card-footer a .la-heart-o").on(
    "click",
    function () {
      $(".alert-success").addClass("active");
      return false;
    }
  );
  $(".popular-listing .card .card-footer a .la-heart-o, .alert-success").on(
    "click",
    function (e) {
      e.stopPropagation();
    }
  );

  $(".close-alert").on("click", function () {
    $(".alert-success").removeClass("active");
    return false;
  });

  /*==============================================
                      EVENTS FUNCTIONS
    ===============================================*/

  $("#genmobile,#govmobile").keypress(function (e) {
    console.log(e.which);
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }

    var curchr = this.value.length;
    var curval = $(this).val();
    if (curchr == 4 && curval.indexOf("(") <= -1) {
      $(this).val("(" + curval + ")" + " ");
    } else if (curchr == 9) {
      $(this).attr("maxlength", "13");
    }
  });

  $(".gov").hide();

  $("#usertype").change(function () {
    let type = $(this).val();
    if (type == 0) {
      $(".gov").hide();
      $(".gen").show();
      $(".rd1").show();
    } else if (type == 1) {
      $(".gen").hide();
      $(".gov").show();
      $(".rd1").hide();
    } else {
      $(".gov").hide();
      $(".gen").show();
      $(".rd1").show();
    }
  });

  $(".nontanzani").hide();
  $("#govemaildomainspan").hide();
  $("input[type=radio][name=citizen]").change(function () {
    if (this.value == 0) {
      $(".tanzani").show();
      $(".nontanzani").hide();
    } else if (this.value == 1) {
      $(".tanzani").hide();
      $(".nontanzani").show();
    } else {
      $(".tanzani").show();
      $(".nontanzani").hide();
    }
  });

  function showgenProgress() {
    $("#loader-gen-wrapper").show();
  }

  function hidegenProgress() {
    $("#loader-gen-wrapper").hide();
  }

  function showProgress() {
    $(".display-loader").addClass("show");
  }

  function hideProgress() {
    $(".display-loader").removeClass("show");
  }

  $("#basicForm").on("submit", function (e) {
    e.preventDefault();
    $("#genemailspan").hide();
    $("#genmobilespan").hide();
    $("#useridspan").hide();

    $("#govemailspan").hide();
    $("#govmobspan").hide();
    $("#govdepspan").hide();
    $("#govdesigspan").hide();
    // $("#govpassspan").hide();

    let options = {};
    var email = $("#genemail").val().toLowerCase();
    if ($("#user_id").val() !== "") {
      $("#errorstatus").val(0);
      $("#useridspan").hide();
      if ($("#usertype").val() == 0) {
        email = $("#genemail").val();
        if ($("#genemail").val() != "") {
          $("#errorstatus").val(0);
          $("#genemailspan").hide();
          if ($("#genmobile").val() != "") {
            $("#errorstatus").val(0);
            $("#genmobilespan").hide();
            if ($("#password").val() != "") {
              $("#errorstatus").val(0);
              $("#passwordspan").hide();
              submitDetails();
            } else {
              $("#passwordspan").html("Password is a mandatory Field");
              $("#passwordspan").show();
              $("#errorstatus").val(1);
            }
          } else {
            $("#genmobilespan").html("Mobile No is a mandatory Field");
            $("#genmobilespan").show();
            $("#errorstatus").val(1);
          }
        } else {
          $("#genemailspan").html("Email is a mandatory Field");
          $("#genemailspan").show();
          $("#errorstatus").val(1);
        }
      } else if ($("#usertype").val() == 1) {
        email = $("#govemail").val().toLowerCase();
        if ($("#govemail").val() != "") {
          $("#errorstatus").val(0);
          $("#govemailspan").hide();
          var email_str = $("#govemail").val().toLowerCase();
          email_str = email_str.split("@").slice(1);
          var notallowedDomains = [
            "gmail.com",
            "googlemail.com",
            "yahoo.com",
            "yahoo.com",
            "yahoo.in",
            "outlook.com",
            "hotmail.com",
            "gmx.com",
            "gmx.us",
            "protonmail.com",
            "protonmail.ch",
            "aol.com",
            "aim.com",
            "zoho.com",
            "icloud.com",
            "yandex.com",
          ];
          if ($.inArray(email_str[0], notallowedDomains) == -1) {
            $("#errorstatus").val(1);
            $("#govemailspan").hide();
            if ($("#govmobile").val() != "") {
              $("#errorstatus").val(0);
              $("#govmobspan").hide();
              if ($("#govdepartment").val() != "") {
                $("#errorstatus").val(0);
                $("#govdepspan").hide();
                if ($("#govdesignation").val() != "") {
                  $("#errorstatus").val(0);
                  $("#govdesigspan").hide();
                  if ($("#password").val() != "") {
                    $("#errorstatus").val(0);
                    $("#passspan").hide();
                    submitDetails();
                  } else {
                    $("#passspan").html("Password is a mandatory Field");
                    $("#passspan").show();
                    $("#errorstatus").val(1);
                  }
                } else {
                  $("#govdesigspan").html("Designation is a mandatory Field");
                  $("#govdesigspan").show();
                  $("#errorstatus").val(1);
                }
              } else {
                $("#govdepspan").html("Department is a mandatory Field");
                $("#govdepspan").show();
                $("#errorstatus").val(1);
              }
            } else {
              $("#govmobspan").html("Mobile No is a mandatory Field");
              $("#govmobspan").show();
              $("#errorstatus").val(1);
            }
          } else {
            $("#govemailspan").html("Email with this domain is not allowed");
            $("#govemailspan").show();
            $("#errorstatus").val(1);
          }
        } else {
          $("#govemailspan").html("Email is a mandatory Field");
          $("#govemailspan").show();
          $("#errorstatus").val(1);
        }
      }
    } else {
      $("#useridspan").html("User ID is a mandatory Field");
      $("#useridspan").show();
      $("#errorstatus").val(1);
    }

    function submitDetails() {
      if ($("#errorstatus").val() == 0) {
        //showProgress();
        showgenProgress();
        options.email = email;
        options.user_id = $("#user_id").val().toLowerCase();
        $.when($.post("/validateAndSendEMail", options)).done(function (_res) {
          //hideProgress();
          hidegenProgress();
          let val = _res.result;
          if (_res.result == "failure") {
            alert(_res.msg);
            $("#register-popup").removeClass("active");
            $(".wrapper").removeClass("overlay-bgg");
          } else {
            console.log("....", _res.otp);
            $("#serverOtp").val(_res.otp);
            $("#register-popup").removeClass("active");
            $("#otp-popup").toggleClass("active");
            $(".wrapper").addClass("overlay-bgg");
          }
        });
      }
    }
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  $("#verifyOtpForm").on("submit", async function (e) {
    e.preventDefault();
    //showProgress()
    showgenProgress();
    await sleep(2000);
    var otp = parseInt($("#otp").val());
    var serverOpt = parseInt($("#serverOtp").val());
    console.log(otp, serverOpt);
    if (otp === serverOpt || otp == globals.MASTER_OTP) {
      //hideProgress()
      hidegenProgress();
      $("#otp-popup").removeClass("active");
      $("#demographic-popup").toggleClass("active");
      $(".wrapper").addClass("overlay-bgg");
    } else {
      alert("Wrong Authorization code! Please enter valid Authorization Code");
      //hideProgress()
      hidegenProgress();
    }
  });

  $("#demographicForm").on("submit", async function (e) {
    e.preventDefault();
    var citizenValue = "";
    $("#demofnspan").hide();
    $("#demomnspan").hide();
    $("#demolnspan").hide();
    $("#demonationalspan").hide();
    $("#demoinvestspan").hide();
    $("#demoaddressspan").hide();
    if ($("#demo_firstname").val() !== "") {
      $("#errorstatus").val(0);
      $("#demofnspan").hide();
      if ($("#demo_middlename").val() !== "") {
        $("#errorstatus").val(0);
        $("#demomnspan").hide();
        if ($("#demo_lastname").val() !== "") {
          $("#errorstatus").val(0);
          $("#demolnspan").hide();
          if ($("#demo_birthdate").val() !== "") {
            $("#errorstatus").val(0);
            $("#demodobspan").hide();
            if ($("#demo_education").val() !== "") {
              $("#errorstatus").val(0);
              $("#demoeduspan").hide();
              if ($("#demo_employment").val() !== "") {
                $("#errorstatus").val(0);
                $("#demoempspan").hide();
                if ($("#address").val() !== "") {
                  $("#errorstatus").val(0);
                  $("#demoaddressspan").hide();
                  citizenValue = $("input[name='citizen']:checked").val();
                  if (citizenValue == 0) {
                    if ($("#nationalityid").val() !== "") {
                      $("#errorstatus").val(0);
                      $("#demonationalspan").hide();
                      submitDetail();
                    } else {
                      $("#demonationalspan").html(
                        "Nationality ID is a mandatory Field"
                      );
                      $("#demonationalspan").show();
                      $("#errorstatus").val(1);
                    }
                  } else {
                    if ($("#investmentlic").val() !== "") {
                      $("#errorstatus").val(0);
                      $("#demoinvestspan").hide();
                      submitDetail();
                    } else {
                      $("#demoinvestspan").html(
                        "Investment License is a mandatory Field"
                      );
                      $("#demoinvestspan").show();
                      $("#errorstatus").val(1);
                    }
                  }
                } else {
                  $("#demoaddressspan").html("Address is a mandatory Field");
                  $("#demoaddressspan").show();
                  $("#errorstatus").val(1);
                }
              } else {
                $("#demoempspan").html("Employment is a mandatory Field");
                $("#demoempspan").show();
                $("#errorstatus").val(1);
              }
            } else {
              $("#demoeduspan").html("Education is a mandatory Field");
              $("#demoeduspan").show();
              $("#errorstatus").val(1);
            }
          } else {
            $("#demodobspan").html("Date Of Birth is a mandatory Field");
            $("#demodobspan").show();
            $("#errorstatus").val(1);
          }
        } else {
          $("#demolnspan").html("Last Name is a mandatory Field");
          $("#demolnspan").show();
          $("#errorstatus").val(1);
        }
      } else {
        $("#demomnspan").html("Middle Name is a mandatory Field");
        $("#demomnspan").show();
        $("#errorstatus").val(1);
      }
    } else {
      $("#demofnspan").html("First Name is a mandatory Field");
      $("#demofnspan").show();
      $("#errorstatus").val(1);
    }

    function submitDetail() {
      if ($("#errorstatus").val() == 0) {
        let options = {};
        options.user_id = $("#user_id").val().toLowerCase();
        options.userType = $("#usertype").val();
        options.firstname = $("#demo_firstname").val();
        options.middlename = $("#demo_middlename").val();
        options.lastname = $("#demo_lastname").val();
        options.education = $("#demo_education").val();
        options.employment = $("#demo_employment").val();
        options.birthdate = $("#demo_birthdate").val();
        options.gender = $("input[name='demo_gender']:checked").val();
        options.maritial_status = $(
          "input[name='demo_marry_status']:checked"
        ).val();
        options.citizenType = citizenValue;
        options.address = $("#address").val();
        options.password = $("#password").val();
        if (citizenValue == 0) {
          options.uniqueId = $("#nationalityid").val();
        } else {
          options.uniqueId = $("#investmentlic").val();
        }

        if ($("#usertype").val() == 0) {
          showProgress();
          options.email = $("#genemail").val();
          options.mobile = $("#genmobile").val();
        } else {
          showgenProgress();
          options.govEmail = $("#govemail").val().toLowerCase();
          options.govMobile = $("#govmobile").val();
          options.govDepartment = $("#govdepartment").val();
          options.govDesignation = $("#govdesignation").val();
        }
        console.log("test", options);
        $.when($.post("/registerUser", options)).done(function (_res) {
          hidegenProgress();
          console.log("....", _res);
          if (_res.result == "success") {
            if (options.userType == 0) {
              var newOption = {};
              newOption.email = $("#genemail").val();
              newOption.otp = parseInt($("#otp").val());
              $.when($.post("/login", newOption)).done(function (_res) {
                sessionStorage.setItem("usertoken", _res.token);
                sessionStorage.setItem(
                  "userData",
                  JSON.stringify(_res.userData)
                );
                location.href = url + "/dashboard";

                $("#status_email_text").html(
                  'Now you can Register Your Land in Land Registry System<span class="landreg_text">Land Registry Demo</span>\
                            system.<br><br>\
    \
                            Thankyou!'
                );
                hideProgress();
              });
            } else {
              hideProgress();
              $("#status_text").html(
                '<i class="la la-check check_cla"></i> Registered Successfully!'
              );
              $("#demographic-popup").removeClass("active");
              $("#status-popup").addClass("active");
              $(".wrapper").addClass("overlay-bgg");

              clearForm();
            }
          } else {
            hideProgress();
            alert(_res.msg);
            $("#demographic-popup").removeClass("active");
            $(".wrapper").removeClass("overlay-bgg");
          }
        });
      }
    }
  });

  $("#getOtp_btn").on("click", function (e) {
    e.preventDefault();
    //showProgress();
    showgenProgress();
    let options = {};
    options.email = $("#login_email_auth").val().toLowerCase();
    $.when($.post("/validateAndGenerateOtp", options)).done(function (_res) {
      //hideProgress();
      hidegenProgress();
      console.log("....", _res);
      if (_res.code == 200) {
        $("#login_email_auth").hide();
        $("#getOtp_btn").hide();
        $(".otpField").show();
        $("#loginotpserver").val(_res.otp);
        $(".signinBtn").show();
      } else {
        alert("User is not registered!");
        hidegenProgress();
      }
    });
  });

  $("#direct_signInBtn").on("click", async function (e) {
    e.preventDefault();
    // showProgress();

    // var serverotp = parseInt($('#loginotpserver').val())
    // var otp = parseInt($('#loginotp').val())
    let options = {};
    // if (otp == serverotp) {
    //hideProgress()
    if ($("#login_email").val().toLowerCase() != "") {
      if ($("#login_password").val() != "") {
        showgenProgress();
        await sleep(2000);
        options.user_id = $("#login_email").val().toLowerCase();
        options.otp = $("#login_password").val();
        // if($("#login_password").val() == globals.MASTER_OTP) {
        $.when($.post("/passwordLogin", options)).done(function (_res) {
          console.log(_res);
          if (_res.result == "success") {
            if (typeof Storage !== "undefined") {
              console.log(_res.userData[0]);
              if (_res.userData[0].userType == 1) {
                if (_res.userData[0].approvalStatus == 1) {
                  sessionStorage.setItem("usertoken", _res.token);
                  sessionStorage.setItem(
                    "userData",
                    JSON.stringify(_res.userData)
                  );
                  location.href = url + "/dashboard";
                } else {
                  alert(
                    "User is not approved! Please wait until it is approved."
                  );
                  hidegenProgress();
                }
              } else {
                sessionStorage.setItem("usertoken", _res.token);
                sessionStorage.setItem(
                  "userData",
                  JSON.stringify(_res.userData)
                );
                location.href = url + "/dashboard";
              }
            } else {
              alert("Storage not available");
              hidegenProgress();
            }
          } else if (_res.code == 101) {
            alert("Invalid Credentials");
            hidegenProgress();
          } else if (_res.code == 100) {
            alert(_res.msg);
            hidegenProgress();
          }
        });
        // } else {
        //     alert("Incorrect Password");
        //     //hideProgress()
        //     hidegenProgress()
        // }
      } else {
        alert("Password is required!");
        //hideProgress()
        hidegenProgress();
      }
    } else {
      alert("Email is required!");
      //hideProgress()
      hidegenProgress();
    }
  });

  $("#loginForm").on("submit", async function (e) {
    e.preventDefault();
    // showProgress();
    showgenProgress();
    await sleep(2000);
    var serverotp = parseInt($("#loginotpserver").val());
    var otp = parseInt($("#loginotp").val());
    let options = {};
    if (otp == serverotp) {
      //hideProgress()
      options.email = $("#login_email_auth").val().toLowerCase();
      options.otp = otp;
      $.when($.post("/login", options)).done(function (_res) {
        if (_res.result == "success") {
          if (typeof Storage !== "undefined") {
            console.log(_res.userData[0]);
            if (_res.userData[0].userType == 1) {
              if (_res.userData[0].approvalStatus == 1) {
                sessionStorage.setItem("usertoken", _res.token);
                sessionStorage.setItem(
                  "userData",
                  JSON.stringify(_res.userData)
                );
                location.href = url + "/dashboard";
              } else {
                alert(
                  "User is not approved! Please wait until it is approved."
                );
                hidegenProgress();
              }
            } else {
              sessionStorage.setItem("usertoken", _res.token);
              sessionStorage.setItem("userData", JSON.stringify(_res.userData));
              location.href = url + "/dashboard";
            }
          } else {
            alert("Storage not available");
            hidegenProgress();
          }
        } else {
          hidegenProgress();
        }
      });
    } else {
      alert("Wrong Authorization code! Please enter valid Authorization Code");
      //hideProgress()
      hidegenProgress();
    }
  });

  function clearForm() {
    document.getElementById("basicForm").reset();
    document.getElementById("verifyOtpForm").reset();
    document.getElementById("demographicForm").reset();
    return true;
  }

  //======================================= Register Land Scripts ==================================

  // $( "#first_step_Form" ).on('submit', function( e ) {
  //     e.preventDefault()
  //     var details = {
  //         'certificate_no': $("#certificate_no").val(),
  //         'region': $("#region").val(),
  //         'district': $("#district").val(),
  //         'ward': $("#ward").val(),
  //         'location': $("#location").val(),
  //         'block': $("#block").val(),
  //         'plot': $("#plot").val(),
  //         'north_feature': $("#northfeature").val(),
  //         'south_feature': $("#southfeature").val(),
  //         'east_feature': $("#eastfeature").val(),
  //         'west_feature': $("#westfeature").val(),
  //         'lat_lng': $("#gpspin").val()
  //     }

  //     console.log(details);

  // })

  $("#landwidth").change(function () {
    calculateArea();
  });

  $("#landheight").change(function () {
    calculateArea();
  });

  function calculateArea() {
    if ($("#landwidth").val() && $("#landheight").val()) {
      var area = $("#landwidth").val() * $("#landheight").val() + " sq.m";
      $("#landarea").val(area);
    } else {
      $("#landarea").val("");
    }
  }

  $("input[type=radio][name=ownership_type]").change(function () {
    //alert(this.value);
    // $(".spouse").hide();
    // if (this.value == 1) {
    //     //alert("");
    //     //$(".spouse").css("display", "none !important");
    //     //$(".spouse").hide();
    //     $(".cloning_demographic").show()
    //     $(".husband_wife").hide()
    //     $(".minor").hide();
    //     $(".cloning_btn").show()
    //     $(".close_div").hide();
    //     $(".spouse").hide();
    // }
    // else
    if (this.value == 2) {
      $(".cloning_demographic").show();
      $(".minor").hide();
      $(".cloning_btn").show();
      $(".close_div").show();
      $(".husband_wife").hide();
      $(".spouse").hide();
    } else if (this.value == 0) {
      $(".husband_wife").show();
      if ($(".applicant_maritial_status:checked").val() == 1) {
        $(".spouse").show();
      } else {
        $(".spouse").hide();
      }
      $(".cloning_demographic").hide();
      $(".minor").hide();
      $(".cloning_btn").hide();
      $(".close_div").hide();
    } else if (this.value == 3 || this.value == 5) {
      $(".cloning_demographic").show();
      $(".husband_wife").hide();
      $(".minor").hide();
      $(".cloning_btn").hide();
      $(".close_div").hide();
      $(".spouse").hide();
    } else if (this.value == 4) {
      $(".cloning_demographic").hide();
      $(".husband_wife").hide();
      $(".minor").show();
      $(".spouse").hide();
    } else {
      //alert("ll")
      $(".cloning_demographic").show();
      $(".husband_wife").hide();
      $(".minor").hide();
      $(".cloning_btn").show();
      $(".close_div").hide();
      $(".spouse").hide();
    }
  });
  $(".nationality_select").change(function () {
    //alert($(".nationality_select:checked").val())
    if ($(".nationality_select:checked").val() == 1) {
      $("#nationality_id").attr("placeholder", "Enter Invester ID");
      $("#lbl_nationality_id").html(
        'Invester ID: <span class="astrick_color">*</span>'
      );
    } else {
      $("#nationality_id").attr("placeholder", "Enter Nationality ID");
      $("#lbl_nationality_id").html(
        'Nationality ID: <span class="astrick_color">*</span>'
      );
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
      $("#lbl_guard_nationality_id").html(
        'Invester ID: <span class="astrick_color">*</span>'
      );
    } else {
      $("#guard_nationality_id").attr("placeholder", "Enter Nationality ID");
      $("#lbl_guard_nationality_id").html(
        'Nationality ID: <span class="astrick_color">*</span>'
      );
    }
  });
  /*===================For Minor =======================*/
  $(".minor_nationality_select").change(function () {
    //alert($(".nationality_select:checked").val())
    if ($(".minor_nationality_select:checked").val() == 1) {
      $("#minor_nationality_id").attr("placeholder", "Enter Invester ID");
      $("#lbl_minor_nationality_id").html(
        'Invester ID: <span class="astrick_color">*</span>'
      );
    } else {
      $("#lbl_minor_nationality_id").html(
        'Nationality ID: <span class="astrick_color">*</span>'
      );
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
      $("#lbl_applicant_nationality_id").html(
        'Invester ID: <span class="astrick_color">*</span>'
      );
    } else {
      $("#applicant_nationality_id").attr(
        "placeholder",
        "Enter Nationality ID"
      );
      $("#lbl_applicant_nationality_id").html(
        'Nationality ID: <span class="astrick_color">*</span>'
      );
    }
  });
  /*===================For Spouse =======================*/
  $(".spouse_nationality_select").change(function () {
    //alert($(".nationality_select:checked").val())
    if ($(".spouse_nationality_select:checked").val() == 1) {
      $("#spouse_nationality_id").attr("placeholder", "Enter Invester ID");
      $("#lbl_spouse_nationality_id").html(
        'Invester ID: <span class="astrick_color">*</span>'
      );
    } else {
      $("#spouse_nationality_id").attr("placeholder", "Enter Nationality ID");
      $("#lbl_spouse_nationality_id").html(
        'Nationality ID: <span class="astrick_color">*</span>'
      );
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
      $("#minor_residence").val("");
    } else {
      $("#minor_residence").attr("value", $("#guard_residence").val());
      $(".address_similar_hide").hide();
    }
  });

  $("#guard_residence").change(function () {
    if ($(".address_similar:checked").val() == 1) {
      $("#minor_residence").attr("value", $("#guard_residence").val());
    }
  });

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
    $("#term").val("");
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
    //alert(this.value)
    fill_landdescription();
    //$("#land_description").val("Plot No: "+this.value+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District, "+$("#region").val())
  });
  $("#block").change(function () {
    //alert(this.value)
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+this.value+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District, "+$("#region").val())
  });
  $("#location").change(function () {
    //alert(this.value)
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District, "+$("#region").val())
  });
  $("#district").change(function () {
    //alert(this.value)
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District, "+$("#region").val())
  });
  $("#ward").change(function () {
    //alert(this.value)
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+this.value+" District, "+$("#region").val())
  });
  $("#kitongoji").change(function () {
    //alert(this.value)
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+this.value+" District, "+$("#region").val())
  });
  $("#region").change(function () {
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District , "+$("#region").val())
  });

  $("#village").change(function () {
    fill_landdescription();
    //$("#land_description").val("Plot No: "+$("#plot").val()+", Block '"+$("#block").val()+"', "+$("#location").val()+", "+$("#ward").val()+", "+$("#district").val()+" District , "+$("#region").val())
  });

  function fill_landdescription() {
    if ($("#certificate_type").val() == 2) {
      //alert("");
      $("#land_description").val(
        "Kitongoji: " +
          $("#kitongoji").val() +
          ", Village: " +
          $("#village").val() +
          ", Ward: " +
          $("#ward option:selected").text() +
          ", District: " +
          $("#district option:selected").text() +
          ", Region: " +
          $("#region option:selected").text()
      );
    } else {
      //alert("jhjhjhhjj");
      $("#land_description").val(
        "Plot No: " +
          $("#plot").val() +
          ", Block '" +
          $("#block").val() +
          "', " +
          $("#location").val() +
          ", " +
          $("#ward option:selected").text() +
          ", " +
          $("#district option:selected").text() +
          " District , " +
          $("#region option:selected").text()
      );
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
    if (this.value == "") {
      $("#doc_upload").hide();
    } else {
      $("#doc_upload").show();
    }
  });

  $("#filetype").change(function () {
    var action =
      "/addLandRecords?type=" +
      $(this).val() +
      "&class=file_hash&name=file_name";

    $(".my_dropzone").attr("action", action);
    var mydrop = $(".my_dropzone")[0].dropzone;
    mydrop.destroy();
    $(".my_dropzone").dropzone({
      url: action,
      addRemoveLinks: true,
    });
  });

  $("#certificate_type").on("change", function () {
    //console.log(this.value)

    $("#lease_term").show();
    $("#occupancy_term").hide();
    $(".nondigital").show();
    //alert( this.value );
    $(".hideadd").hide();
    $(".offerdiv").hide();
    if (this.value == 2) {
      $("#certi_bread").html("Certificate of Customary Right of Ownership");
      $("#certi_bread").show();
      $("#lbl_certificate_no").text("CCRO No. :");
      $("#certificate_no").attr("placeholder", "Enter CCRO No. ");
      $("#village").attr("required");
      $("#kitongoji").attr("required");

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
      $("#lbl_upload_file_name").html(
        'File Name <span class="astrick_color">*</span>'
      );
    } else if (this.value == 1) {
      $("#certi_bread").html("Digital Land Title Certificate");
      $("#certi_bread").show();
      $("#lbl_upload_file_name").html(
        'Upload Title <span class="astrick_color">*</span>'
      );
      $("#lbl_certificate_no").text("Certificate No. :");
      $("#certificate_no").attr("placeholder", "Enter Certificate No. ");
      $("#address").attr("required");
      $("#block").attr("required");
      $("#plot").attr("required");
      $("#village").removeAttr("required");
      $("#kitongoji").removeAttr("required");

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
        $("#certi_bread").html("Offer Letter");
        $("#certi_bread").show();
        $("#lbl_certificate_no").text("Offer Letter No. :");
        $("#certificate_no").attr("placeholder", "Enter Offer Letter No.");
      } else if (this.value == 3) {
        $("#certi_bread").html("Non Digital Land Title Certificate");
        $("#certi_bread").show();
        $("#lbl_certificate_no").text(
          "Non Digital Land Title Certificate No. :"
        );
        $("#certificate_no").attr(
          "placeholder",
          "Enter Non Digital Land Title Certificate No."
        );
      } else if (this.value == 4) {
        $("#certi_bread").html(globals.RL);
        $("#certi_bread").show();
        $("#lbl_certificate_no").html(globals.RL + " No. :");
        $("#certificate_no").attr(
          "placeholder",
          "Enter " + globals.RL + " No."
        );
      } else {
        $("#lbl_certificate_no").html("Certificate No. :");
        $("#certificate_no").attr("placeholder", "Enter Certificate No.");
      }
      $(".offerdiv").show();
      // $("#lbl_certificate_no").text("Certificate No");
      // $("#certificate_no").attr("placeholder", "Enter Certificate No");
      $("#address").attr("required");
      $("#block").attr("required");
      $("#plot").attr("required");
      $("#village").removeAttr("required");
      $("#kitongoji").removeAttr("required");

      $("#np_north").removeAttr("required");
      $("#np_south").removeAttr("required");
      $("#np_east").removeAttr("required");
      $("#np_west").removeAttr("required");
      $("#term").removeAttr("required");
      $(".nondigi_div").hide();
      $(".digi_div").show();
      $(".hideadd").hide();
      $("#lbl_upload_file_name").html(
        'File Name <span class="astrick_color">*</span>'
      );
    }
  });

  /*===============================================Submit land record==========================================*/

  $("#land_record_submit").on("click", function (e) {
    if ($("#area_as_per_marking").val() != "") {
      if ($("#file_hash").val() != "" && $("#file_name").val() != "") {
        e.preventDefault();
        showgenProgress();
        var landpurpose = "";
        var landpurpose_type = "";
        var leaseterm = "";
        if (
          $("#certificate_type").val() == 1 ||
          $("#certificate_type").val() == 0 ||
          $("#certificate_type").val() == 3
        ) {
          var select_term = $("#lease_term").val();
          console.log(select_term);
          if (select_term == 0) {
            leaseterm = "33 years";
          } else if (select_term == 1) {
            leaseterm = "66 years";
          } else if (select_term == 2) {
            leaseterm = "99 years";
          }
        } else if ($("#certificate_type").val() == 2) {
          leaseterm = $("#term").val() + " years";
        } else if ($("#certificate_type").val() == 4) {
          leaseterm = $("#occupancy_term").val() + " months";
        }

        console.log(leaseterm);
        var ownertype = $("input:radio[name=ownership_type]:checked").val();
        var ownerdetails = [];
        if (ownertype == 0) {
          var applicant = {
            isguardian: 2,
            isapplicant: 1,
            firstname: $("#applicant_firstname").val(),
            middlename: $("#applicant_middlename").val(),
            lastname: $("#applicant_lastname").val(),
            leveledu: $("#applicant_leveledu").val(),
            gender: $(".applicant_gender_type:checked").val(),
            birthdate: $("#applicant_birthdate").val(),
            maritial_status: $(".applicant_maritial_status:checked").val(),
            employment: $("#applicant_employment").val(),
            residence: $("#applicant_residence").val(),
            nationality_select: $(
              ".applicant_nationality_select:checked"
            ).val(),
            unique_id: $("#applicant_nationality_id").val(),
            phone_no: $("#applicant_phone_no").val(),
          };
          var spouse = {
            isguardian: 2,
            isapplicant: 0,
            firstname: $("#spouse_firstname").val(),
            middlename: $("#spouse_middlename").val(),
            lastname: $("#spouse_lastname").val(),
            leveledu: $("#spouse_leveledu").val(),
            gender: $(".spouse_gender_type:checked").val(),
            birthdate: $("#spouse_birthdate").val(),
            maritial_status: $(".spouse_maritial_status:checked").val(),
            employment: $("#spouse_employment").val(),
            residence: $("#spouse_residence").val(),
            nationality_select: $(".spouse_nationality_select:checked").val(),
            unique_id: $("#spouse_nationality_id").val(),
            phone_no: $("#spouse_phone_no").val(),
          };

          if ($(".applicant_maritial_status:checked").val() == 1) {
            ownerdetails.push(applicant, spouse);
          } else {
            ownerdetails.push(applicant);
          }
        } else if (ownertype == 4) {
          var user = {
            isguardian: 1,
            isapplicant: 2,
            firstname: $("#guard_firstname").val(),
            middlename: $("#guard_middlename").val(),
            lastname: $("#guard_lastname").val(),
            leveledu: $("#guard_leveledu").val(),
            gender: $(".guard_gender_type:checked").val(),
            birthdate: $("#guard_birthdate").val(),
            maritial_status: $(".guard_maritial_status:checked").val(),
            employment: $("#guard_employment").val(),
            residence: $("#guard_residence").val(),
            nationality_select: $(".guard_nationality_select:checked").val(),
            unique_id: $("#guard_nationality_id").val(),
            phone_no: $("#guard_phone_no").val(),
          };
          var user2 = {
            isguardian: 0,
            isapplicant: 2,
            firstname: $("#minor_firstname").val(),
            middlename: $("#minor_middlename").val(),
            lastname: $("#minor_lastname").val(),
            leveledu: $("#minor_leveledu").val(),
            gender: $(".minor_gender_type:checked").val(),
            birthdate: $("#minor_birthdate").val(),
            residence: $("#minor_residence").val(),
            nationality_select: $(".minor_nationality_select:checked").val(),
            unique_id: $("#minor_nationality_id").val(),
            phone_no: $("#minor_phone_no").val(),
          };

          ownerdetails.push(user, user2);
        } else {
          $(".owner_user").each(function () {
            var user = {};
            user.isguardian = 2;
            user.isapplicant = 2;
            user.firstname = $(this).find("#firstname").val();
            user.middlename = $(this).find("#middlename").val();
            user.lastname = $(this).find("#lastname").val();
            user.leveledu = $(this).find("#leveledu").val();
            user.gender = $(this).find(".gender_type:checked").val();
            user.birthdate = $(this).find(".birthdate").val();
            user.maritial_status = $(this)
              .find(".maritial_status:checked")
              .val();
            user.employment = $(this).find("#employment").val();
            user.residence = $(this).find("#residence").val();
            user.nationality_select = $(this)
              .find(".nationality_select:checked")
              .val();
            user.unique_id = $(this).find("#nationality_id").val();
            user.phone_no = $(this).find("#phone_no").val();
            user.share_per = $(this).find("#share_value").val();
            if (ownertype == 2) {
              user.share_value = $("#share_value").val();
            }
            ownerdetails.push(user);
          });
        }
        //  if(ownertype != 4){

        //  }else{

        //  }

        //console.log(olduser);
        var uploaddetails = [];
        $(".upload_user").each(function () {
          if ($(this).find("#file_hash").val()) {
            var files = {};
            files.filename = $(this).find("#file_name").val();
            files.filehash = $(this).find("#file_hash").val();
            uploaddetails.push(files);
          }
        });

        //  console.log();

        if ($(".purpose_select:checked").val() == 0) {
          landpurpose = $("#residential_select").val();
        } else {
          landpurpose = $("#commercial_select").val();
        }
        var markers = JSON.parse($("#array_lat_lng").val());
        var details = {
          stepone: {
            userid: JSON.parse(sessionStorage.userData)[0]._id,
            user_email: JSON.parse(sessionStorage.userData)[0].email,
            user_type: JSON.parse(sessionStorage.userData)[0].userType,
            certificateType: $("#certificate_type").val(),
            action: "submit",
          },
          steptwo: {
            has_certificate: $(
              "input:radio[name=certificate_que]:checked"
            ).val(),
            certificate_no: $("#certificate_no").val(),
          },
          stepthree: {
            region: $("#region").val(),
            ward: $("#ward").val(),
            block: $("#block").val(),
            plot: $("#plot").val(),
            district: $("#district").val(),
            location: $("#location").val(),
            address: $("#address").val(),
            landfeature: $("#land_distict_feature").val(),
            village: $("#village").val(),
            kitongoji: $("#kitongoji").val(),
            npnorth: $("#np_north").val(),
            npsouth: $("#np_south").val(),
            npeast: $("#np_east").val(),
            npwest: $("#np_west").val(),
            landheight: $("#landheight").val(),
            landwidth: $("#landwidth").val(),
            landarea: $("#landarea").val(),
            markedarea: $("#area_as_per_marking").val(),
            zoom_level: $("#map_zoom").val(),
            lat: $("#lat").val(),
            long: $("#long").val(),
            land_markers: markers,
          },
          stepfour: {
            landpurpose_type: $(".purpose_select:checked").val(),
            land_purpose: landpurpose,
          },
          stepfive: {
            ownership_type: $("input:radio[name=ownership_type]:checked").val(),
            users: ownerdetails,
            lease_term: leaseterm,
            leasedate: $("#leasedate").val(),
            lease_type: $("#leaseterm_select").val(),
          },
          stepsix: {
            secure_land: $("input:radio[name=land_secure]:checked").val(),
            upload_title: uploaddetails,
          },
        };
        console.log("owner_details", ownerdetails);

        $.when($.post("/uploadLandRecords", details)).done(function (_res) {
          console.log("sdasd", _res);
          if (_res.code == 200) {
            var olduser = JSON.parse(sessionStorage.userData);
            olduser[0].owner_demographic = ownerdetails[0];
            if (ownerdetails[0].isapplicant == 1) {
              olduser[0].owner_demographic.spouse_details = ownerdetails[1];
            }
            sessionStorage.setItem("userData", JSON.stringify(olduser));

            PNotify.success({
              title: "Success!",
              text: "Land Registered successfully!",
            });
            hidegenProgress();
            location.href = url + "/dashboard/dashboards/landlist.html";
          } else {
            PNotify.error({
              title: "Error",
              text: _res.msg,
            });
            hidegenProgress();
          }
        });
      } else {
        alert("Please upload a Document before submitting!");
      }
    } else {
      alert("Please Draw a land before submitting!");
    }

    console.log(details);
  });

  /*===============================================Save Land Record======================================*/

  $("#land_record_save").on("click", function (e) {
    if ($("#area_as_per_marking").val() != "") {
      if ($("#file_hash").val() != "" && $("#file_name").val() != "") {
        e.preventDefault();
        showgenProgress();
        var landpurpose = "";
        var landpurpose_type = "";
        var leaseterm = "";
        if (
          $("#certificate_type").val() == 1 ||
          $("#certificate_type").val() == 0 ||
          $("#certificate_type").val() == 3
        ) {
          var select_term = $("#lease_term").val();
          console.log(select_term);
          if (select_term == 0) {
            leaseterm = "33 years";
          } else if (select_term == 1) {
            leaseterm = "66 years";
          } else if (select_term == 2) {
            leaseterm = "99 years";
          }
        } else if ($("#certificate_type").val() == 2) {
          leaseterm = $("#term").val() + " years";
        } else if ($("#certificate_type").val() == 4) {
          leaseterm = $("#occupancy_term").val() + " months";
        }

        console.log(leaseterm);
        var ownertype = $("input:radio[name=ownership_type]:checked").val();
        var ownerdetails = [];
        if (ownertype == 0) {
          var applicant = {
            isguardian: 2,
            isapplicant: 1,
            firstname: $("#applicant_firstname").val(),
            middlename: $("#applicant_middlename").val(),
            lastname: $("#applicant_lastname").val(),
            leveledu: $("#applicant_leveledu").val(),
            gender: $(".applicant_gender_type:checked").val(),
            birthdate: $("#applicant_birthdate").val(),
            maritial_status: $(".applicant_maritial_status:checked").val(),
            employment: $("#applicant_employment").val(),
            residence: $("#applicant_residence").val(),
            nationality_select: $(
              ".applicant_nationality_select:checked"
            ).val(),
            unique_id: $("#applicant_nationality_id").val(),
            phone_no: $("#applicant_phone_no").val(),
          };
          var spouse = {
            isguardian: 2,
            isapplicant: 0,
            firstname: $("#spouse_firstname").val(),
            middlename: $("#spouse_middlename").val(),
            lastname: $("#spouse_lastname").val(),
            leveledu: $("#spouse_leveledu").val(),
            gender: $(".spouse_gender_type:checked").val(),
            birthdate: $("#spouse_birthdate").val(),
            maritial_status: $(".spouse_maritial_status:checked").val(),
            employment: $("#spouse_employment").val(),
            residence: $("#spouse_residence").val(),
            nationality_select: $(".spouse_nationality_select:checked").val(),
            unique_id: $("#spouse_nationality_id").val(),
            phone_no: $("#spouse_phone_no").val(),
          };

          if ($(".applicant_maritial_status:checked").val() == 1) {
            ownerdetails.push(applicant, spouse);
          } else {
            ownerdetails.push(applicant);
          }
        } else if (ownertype == 4) {
          var user = {
            isguardian: 1,
            isapplicant: 2,
            firstname: $("#guard_firstname").val(),
            middlename: $("#guard_middlename").val(),
            lastname: $("#guard_lastname").val(),
            leveledu: $("#guard_leveledu").val(),
            gender: $(".guard_gender_type:checked").val(),
            birthdate: $("#guard_birthdate").val(),
            maritial_status: $(".guard_maritial_status:checked").val(),
            employment: $("#guard_employment").val(),
            residence: $("#guard_residence").val(),
            nationality_select: $(".guard_nationality_select:checked").val(),
            unique_id: $("#guard_nationality_id").val(),
            phone_no: $("#guard_phone_no").val(),
          };
          var user2 = {
            isguardian: 0,
            isapplicant: 2,
            firstname: $("#minor_firstname").val(),
            middlename: $("#minor_middlename").val(),
            lastname: $("#minor_lastname").val(),
            leveledu: $("#minor_leveledu").val(),
            gender: $(".minor_gender_type:checked").val(),
            birthdate: $("#minor_birthdate").val(),
            residence: $("#minor_residence").val(),
            nationality_select: $(".minor_nationality_select:checked").val(),
            unique_id: $("#minor_nationality_id").val(),
            phone_no: $("#minor_phone_no").val(),
          };

          ownerdetails.push(user, user2);
        } else {
          $(".owner_user").each(function () {
            var user = {};
            user.isguardian = 2;
            user.isapplicant = 2;
            user.firstname = $(this).find("#firstname").val();
            user.middlename = $(this).find("#middlename").val();
            user.lastname = $(this).find("#lastname").val();
            user.leveledu = $(this).find("#leveledu").val();
            user.gender = $(this).find(".gender_type:checked").val();
            user.birthdate = $(this).find(".birthdate").val();
            user.maritial_status = $(this)
              .find(".maritial_status:checked")
              .val();
            user.employment = $(this).find("#employment").val();
            user.residence = $(this).find("#residence").val();
            user.nationality_select = $(this)
              .find(".nationality_select:checked")
              .val();
            user.unique_id = $(this).find("#nationality_id").val();
            user.phone_no = $(this).find("#phone_no").val();
            user.share_per = $(this).find("#share_value").val();
            if (ownertype == 2) {
              user.share_value = $("#share_value").val();
            }
            ownerdetails.push(user);
          });
        }
        //  if(ownertype != 4){

        //  }else{

        //  }

        //console.log(olduser);
        var uploaddetails = [];
        $(".upload_user").each(function () {
          if ($(this).find("#file_hash").val()) {
            var files = {};
            files.filename = $(this).find("#file_name").val();
            files.filehash = $(this).find("#file_hash").val();
            uploaddetails.push(files);
          }
        });

        //  console.log();

        if ($(".purpose_select:checked").val() == 0) {
          landpurpose = $("#residential_select").val();
        } else {
          landpurpose = $("#commercial_select").val();
        }
        var markers = JSON.parse($("#array_lat_lng").val());
        var details = {
          stepone: {
            userid: JSON.parse(sessionStorage.userData)[0]._id,
            user_email: JSON.parse(sessionStorage.userData)[0].email,
            user_type: JSON.parse(sessionStorage.userData)[0].userType,
            certificateType: $("#certificate_type").val(),
            action: "save",
          },
          steptwo: {
            has_certificate: $(
              "input:radio[name=certificate_que]:checked"
            ).val(),
            certificate_no: $("#certificate_no").val(),
          },
          stepthree: {
            region: $("#region").val(),
            ward: $("#ward").val(),
            block: $("#block").val(),
            plot: $("#plot").val(),
            district: $("#district").val(),
            location: $("#location").val(),
            address: $("#address").val(),
            landfeature: $("#land_distict_feature").val(),
            village: $("#village").val(),
            kitongoji: $("#kitongoji").val(),
            npnorth: $("#np_north").val(),
            npsouth: $("#np_south").val(),
            npeast: $("#np_east").val(),
            npwest: $("#np_west").val(),
            landheight: $("#landheight").val(),
            landwidth: $("#landwidth").val(),
            landarea: $("#landarea").val(),
            markedarea: $("#area_as_per_marking").val(),
            zoom_level: $("#map_zoom").val(),
            lat: $("#lat").val(),
            long: $("#long").val(),
            land_markers: markers,
          },
          stepfour: {
            landpurpose_type: $(".purpose_select:checked").val(),
            land_purpose: landpurpose,
          },
          stepfive: {
            ownership_type: $("input:radio[name=ownership_type]:checked").val(),
            users: ownerdetails,
            lease_term: leaseterm,
            leasedate: $("#leasedate").val(),
            lease_type: $("#leaseterm_select").val(),
          },
          stepsix: {
            secure_land: $("input:radio[name=land_secure]:checked").val(),
            upload_title: uploaddetails,
          },
        };

        $.when($.post("/uploadLandRecords", details)).done(function (_res) {
          if (_res.code == 200) {
            var olduser = JSON.parse(sessionStorage.userData);
            olduser[0].owner_demographic = ownerdetails[0];
            if (ownerdetails[0].isapplicant == 1) {
              olduser[0].owner_demographic.spouse_details = ownerdetails[1];
            }
            sessionStorage.setItem("userData", JSON.stringify(olduser));

            PNotify.success({
              title: "Success!",
              text: "Land Registered successfully!",
            });
            hidegenProgress();
            location.href = url + "/dashboard/dashboards/landlist.html";
          } else {
            PNotify.error({
              title: "Error",
              text: _res.msg,
            });
            hidegenProgress();
          }
        });
      } else {
        alert("Please upload a Document before submitting!");
      }
    } else {
      alert("Please Draw a land before submitting!");
    }

    console.log(details);
  });

  //============================================Preview===============================================

  $("#preview_row").hide();
  $(".preview_show_btn").hide();
  $("#preview_btn").on("click", function () {
    $(".preview_show_btn").hide();
    $("#preview_row").show();
    fillPreview();
  });
  $("#next_btn").on("click", function () {
    hidepreview();
  });
  $("#pre_btn").on("click", function () {
    hidepreview();
  });

  $("#preview_click").on("click", function () {
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

  $("#headingOne3").on("click", function () {
    var c_type = $("#certificate_type").val();
    if (c_type == 0) {
      $("#preview_certificate_type").html("Offer Letter");
    } else if (c_type == 3) {
      $("#preview_certificate_type").html("Non Digital Land Title Certificate");
    } else if (c_type == 4) {
      $("#preview_certificate_type").html(globals.RL);
    } else if (c_type == 1) {
      $("#preview_certificate_type").html("Digital Land Title Certificate");
    } else if (c_type == 2) {
      $("#preview_certificate_type").html(
        "Certificate of Customary Right of Ownership"
      );
    }

    var has_certi = $("input:radio[name=certificate_que]:checked").val();
    if (has_certi == 0) {
      $("#preview_has_certificate").html("No");
    } else if (has_certi == 1) {
      $("#preview_has_certificate").html("Yes");
    }

    var c_no = $("#certificate_no").val();
    $("#preview_certificate_no").html(c_no);
  });

  $("#headingTwo3").on("click", function () {
    $("#preview_region").html($("#region option:selected").text());
    $("#preview_block_no").html($("#block").val());
    $("#preview_district").html($("#district option:selected").text());
    $("#preview_ward_no").html($("#ward option:selected").text());
    $("#preview_plot_no").html($("#plot").val());
    $("#preview_location").html($("#location").val());
    $("#preview_address").html($("#address").val());
    $("#preview_feature").html($("#land_distict_feature").val());
    $("#preview_height").html($("#landheight").val());
    $("#preview_width").html($("#landwidth").val());
    $("#preview_area").html($("#landarea").val());
    $("#preview_lat").html($("#lat").val());
    $("#preview_long").html($("#long").val());
    $("#preview_marked_area").html($("#area_as_per_marking").val());
    $("#preview_village").html($("#village").val());
    $("#preview_kitongoji").html($("#kitongoji").val());
    $("#preview_npnorth").html($("#np_north").val());
    $("#preview_npsouth").html($("#np_south").val());
    $("#preview_npeast").html($("#np_east").val());
    $("#preview_npwest").html($("#np_west").val());
  });

  $("#headingThree3").on("click", function () {
    $(".commer_type").hide();
    $(".resi_type").hide();
    //$('#preview_purpose_type').html($(".purpose_select:checked").val())

    if ($(".purpose_select:checked").val() == 0) {
      $("#preview_purpose_type").html("Residential");
      var r_type = $("#residential_select").val();
      $(".resi_type").show();
      if (r_type == 0) {
        $("#preview_residence_type").html("Public Housing");
      } else if (r_type == 1) {
        $("#preview_residence_type").html("Private Housing");
      } else if (r_type == 2) {
        $("#preview_residence_type").html("Housing/Farming");
      }
    } else {
      $(".resi_type").hide();
      $(".commer_type").show();
    }
    if ($(".purpose_select:checked").val() == 1) {
      $("#preview_purpose_type").html("Commercial");
      var co_type = $("#commercial_select").val();
      $(".commer_type").show();
      if (co_type == 0) {
        $("#preview_commercial_type").html("Public/Industries");
      } else if (co_type == 1) {
        $("#preview_commercial_type").html("Forest/Farm");
      } else if (co_type == 2) {
        $("#preview_commercial_type").html("Mineral Areas");
      } else if (co_type == 3) {
        $("#preview_commercial_type").html("Parks/Recreation/Amusement");
      }
    } else {
      $(".commer_type").hide();
      $(".resi_type").show();
    }
  });

  $("#headingFour3").on("click", function () {
    var o_type = $("input:radio[name=ownership_type]:checked").val();
    var display_share = "display:none";
    if (o_type == 0) {
      $("#preview_ownership_type").html("Owner/Applicant");
    } else if (o_type == 1) {
      $("#preview_ownership_type").html("Group");
    } else if (o_type == 2) {
      $("#preview_ownership_type").html("Group with shares");
      display_share = "display:block";
    } else if (o_type == 3) {
      $("#preview_ownership_type").html("Corporation");
    } else if (o_type == 4) {
      $("#preview_ownership_type").html("Owner with guardian");
    } else if (o_type == 5) {
      $("#preview_ownership_type").html("Customary");
    }

    var c_type = $("#certificate_type").val();
    if (c_type == 4) {
      $("#preview_lease_term").html($("#occupancy_term").val() + " months");
    } else if (c_type == 2) {
      $("#preview_term_years").html($("#term").val() + " years");
    } else {
      var l_term = $("#lease_term").val();
      if (l_term == 0) {
        $("#preview_lease_term").html("33 years");
      } else if (l_term == 1) {
        $("#preview_lease_term").html("66 years");
      } else if (l_term == 2) {
        $("#preview_lease_term").html("99 years");
      }
    }

    var l_type = $("#leaseterm_select").val();
    if (l_type == 0) {
      $("#preview_lease_type").html("Mda Maalumu");
    } else if (l_type == 1) {
      $("#preview_lease_type").html("Hakuna Mda Maalumu");
      $("#preview_term_years").html(" N/A");
    }

    $("#preview_lease_start_date").html($("#leasedate").val());

    if (o_type == 0) {
      var html = "";

      var genderapplicant = $(".applicant_gender_type:checked").val();
      var gender_applicant_val = "";
      if (genderapplicant == 0) {
        gender_applicant_val = "Male";
      } else if (genderapplicant == 1) {
        gender_applicant_val = "Female";
      } else if (genderapplicant == 2) {
        gender_applicant_val = "Other";
      }

      var genderspouse = $(".spouse_gender_type:checked").val();
      var gender_spouse_val = "";
      if (genderspouse == 0) {
        gender_spouse_val = "Male";
      } else if (genderspouse == 1) {
        gender_spouse_val = "Female";
      } else if (genderspouse == 2) {
        gender_spouse_val = "Other";
      }

      var maritialapplicant = $(".applicant_maritial_status:checked").val();
      var maritial_applicant_val = "";
      if (maritialapplicant == 0) {
        maritial_applicant_val = "Single";
      } else if (maritialapplicant == 1) {
        maritial_applicant_val = "Married";
      } else if (maritialapplicant == 2) {
        maritial_applicant_val = "Divorced";
      }
      var appli_id = "";
      var nationalityapplicant = $(
        ".applicant_nationality_select:checked"
      ).val();
      var nationality_applicant_val = "";
      if (nationalityapplicant == 0) {
        appli_id = "Nationality ID";
        nationality_applicant_val = "Tanzanian";
      } else if (nationalityapplicant == 1) {
        nationality_applicant_val = "Non-Tanzanian";
        appli_id = "Investor ID";
      }
      var spouse_id = "";
      var nationalityspouse = $(".spouse_nationality_select:checked").val();
      var nationality_spouse_val = "";
      if (nationalityspouse == 0) {
        spouse_id = "Nationality ID";
        nationality_spouse_val = "Tanzanian";
      } else if (nationalityspouse == 1) {
        nationality_spouse_val = "Non-Tanzanian";
        spouse_id = "Investor ID";
      }

      html +=
        ' <div class="kt-heading kt-heading--md">Applicant</div>\
            <div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">' +
        $("#applicant_firstname").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">' +
        $("#applicant_middlename").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">' +
        $("#applicant_lastname").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">' +
        $("#applicant_leveledu").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">' +
        gender_applicant_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">' +
        $("#applicant_birthdate").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Maritial Status:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_maritail_status">' +
        maritial_applicant_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">' +
        $("#applicant_employment").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">' +
        $("#applicant_residence").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">' +
        nationality_applicant_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">' +
        appli_id +
        ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">' +
        $("#applicant_nationality_id").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                   <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">' +
        $("#applicant_phone_no").val() +
        "</span>\
                        </div>\
                    </div>\
                </div>\
            </div>";
      if (maritialapplicant == 1) {
        html +=
          ' <div class="kt-heading kt-heading--md spousepre">Spouse</div><div class="row spousepre">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">' +
          $("#spouse_firstname").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">' +
          $("#spouse_middlename").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">' +
          $("#spouse_lastname").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">' +
          $("#spouse_leveledu").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">' +
          gender_spouse_val +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">' +
          $("#spouse_birthdate").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">' +
          $("#spouse_employment").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">' +
          $("#spouse_residence").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">' +
          nationality_spouse_val +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">' +
          spouse_id +
          ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">' +
          $("#spouse_nationality_id").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                  <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">' +
          $("#spouse_phone_no").val() +
          "</span>\
                        </div>\
                    </div>\
                </div>\
            </div>";
      }
      $(".preview_user_data").html(html);
    } else if (o_type == 4) {
      var html = "";

      var genderguard = $(".guard_gender_type:checked").val();
      var gender_guard_val = "";
      if (genderguard == 0) {
        gender_guard_val = "Male";
      } else if (genderguard == 1) {
        gender_guard_val = "Female";
      } else if (genderguard == 2) {
        gender_guard_val = "Other";
      }

      var genderminor = $(".minor_gender_type:checked").val();
      var gender_minor_val = "";
      if (genderminor == 0) {
        gender_minor_val = "Male";
      } else if (genderminor == 1) {
        gender_minor_val = "Female";
      } else if (genderminor == 2) {
        gender_minor_val = "Other";
      }

      var maritialguard = $(".guard_maritial_status:checked").val();
      var maritial_guard_val = "";
      if (maritialguard == 0) {
        maritial_guard_val = "Single";
      } else if (maritialguard == 1) {
        maritial_guard_val = "Married";
      } else if (maritialguard == 2) {
        maritial_guard_val = "Divorced";
      }

      var maritialminor = $(".minor_maritial_status:checked").val();
      var maritial_minor_val = "";
      if (maritialminor == 0) {
        maritial_minor_val = "Single";
      } else if (maritialminor == 1) {
        maritial_minor_val = "Married";
      } else if (maritialminor == 2) {
        maritial_minor_val = "Divorced";
      }

      var nationalityguard = $(".guard_nationality_select:checked").val();
      var guard_Id, minor_Id;
      var nationality_guard_val = "";
      if (nationalityguard == 0) {
        guard_Id = "Nationality ID";
        nationality_guard_val = "Tanzanian";
      } else if (nationalityguard == 1) {
        guard_Id = "Investment ID";
        nationality_guard_val = "Non-Tanzanian";
      }

      var nationalityminor = $(".minor_nationality_select:checked").val();
      var nationality_minor_val = "";
      if (nationalityminor == 0) {
        minor_Id = "Nationality ID";
        nationality_minor_val = "Tanzanian";
      } else if (nationalityminor == 1) {
        minor_Id = "Investment ID";
        nationality_minor_val = "Non-Tanzanian";
      }

      html +=
        ' <div class="kt-heading kt-heading--md">Guardian</div><div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">' +
        $("#guard_firstname").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                    <div class="lbl_width">\
                        <label class="preview_heading">Middle Name:</label>\
                    </div>\
                    <div class="spn_width">\
                        <span class="preview_content" id="preview_middle_name">' +
        $("#guard_middlename").val() +
        '</span>\
                    </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">' +
        $("#guard_lastname").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">' +
        $("#guard_leveledu").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">' +
        gender_guard_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">' +
        $("#guard_birthdate").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Maritial Status:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_maritail_status">' +
        maritial_guard_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">' +
        $("#guard_employment").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">' +
        $("#guard_residence").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">' +
        nationality_guard_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">' +
        guard_Id +
        ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">' +
        $("#guard_nationality_id").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">' +
        $("#guard_phone_no").val() +
        "</span>\
                        </div>\
                    </div>\
                </div>\
            </div>";

      html +=
        ' <div class="kt-heading kt-heading--md">Owner</div><div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">' +
        $("#minor_firstname").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">' +
        $("#minor_middlename").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">' +
        $("#minor_lastname").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">' +
        $("#minor_leveledu").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">' +
        gender_minor_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">' +
        $("#minor_birthdate").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">' +
        $("#minor_residence").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">' +
        nationality_minor_val +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">' +
        minor_Id +
        ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">' +
        $("#minor_nationality_id").val() +
        '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">' +
        $("#minor_phone_no").val() +
        "</span>\
                        </div>\
                    </div>\
                </div>\
            </div>";
      $(".preview_user_data").html(html);
    } else {
      var html = "";
      var count = 0;
      $(".owner_user").each(function () {
        var gender = $(this).find(".gender_type:checked").val();
        var gender_val = "";
        if (gender == 0) {
          gender_val = "Male";
        } else if (gender == 1) {
          gender_val = "Female";
        } else if (gender == 2) {
          gender_val = "Other";
        }

        var maritial = $(this).find(".maritial_status:checked").val();
        var maritial_val = "";
        if (maritial == 0) {
          maritial_val = "Single";
        } else if (maritial == 1) {
          maritial_val = "Married";
        } else if (maritial == 2) {
          maritial_val = "Divorced";
        }

        var nationality = $(this).find(".nationality_select:checked").val();
        var main_ID;
        var nationality_val = "";
        if (nationality == 0) {
          main_ID = "Nationality ID";
          nationality_val = "Tanzanian";
        } else if (nationality == 1) {
          main_ID = "Investment ID";
          nationality_val = "Non-Tanzanian";
        }

        html +=
          ' <div class="kt-heading kt-heading--md">Owner -' +
          ++count +
          '</div><div class="row">\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">First Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_first_name">' +
          $(this).find("#firstname").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Middle Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_middle_name">' +
          $(this).find("#middlename").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Last Name:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_last_name">' +
          $(this).find("#lastname").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Education:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_lvledu">' +
          $(this).find("#leveledu").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Gender:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_gender">' +
          gender_val +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">DOB:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_dob">' +
          $(this).find(".birthdate").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Maritial Status:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_maritail_status">' +
          maritial_val +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Employment:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_employment">' +
          $(this).find("#employment").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Residence:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_residence">' +
          $(this).find("#residence").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Nationality:</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_nationality">' +
          nationality_val +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">' +
          main_ID +
          ':</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_unique_id">' +
          $(this).find("#nationality_id").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6">\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Phone No. :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_phone_no">' +
          $(this).find("#phone_no").val() +
          '</span>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-lg-6" style=' +
          display_share +
          '>\
                    <div class="form-group row">\
                        <div class="lbl_width">\
                            <label class="preview_heading">Share % :</label>\
                        </div>\
                        <div class="spn_width">\
                            <span class="preview_content" id="preview_share_val">' +
          $(this).find("#share_value").val() +
          "</span>\
                        </div>\
                    </div>\
                </div>\
            </div>";
      });
      $(".preview_user_data").html(html);
    }
  });

  $("#headingFive3").on("click", function () {
    var html1 = "";

    $(".upload_user").each(function () {
      if ($(this).find("#file_hash").val()) {
        html1 +=
          ' <div class="row">\
                <div class="col-lg-12">\
                    <div class="form-group">\
                        <label class="preview_heading">Document Name: ' +
          $(this).find("#file_name").val() +
          '</label>\
                        <span class="preview_content" id="preview_upload_title"><a href="' +
          ipfsurl +
          "/ipfs/" +
          $(this).find("#file_hash").val() +
          '" target="_blank">' +
          $(this).find("#file_hash").val() +
          "</a></span>\
                    </div>\
                </div>\
                </div>";
      }
    });
    $(".preview_upload_data").html(html1);
    //$('#preview_upload_title').html('<a href="http://localhost:8080/ipfs/'+$('#file_hash').val()+'" target="_blank">'+$('#file_hash').val()+'</a>')
  });

  $("#reset_password_btn").on("click", function (e) {
    e.preventDefault();
    showgenProgress();
    var forget_email = $("#forget_email").val().toLowerCase();
    var options = {};
    if (forget_email) {
      options.email = forget_email;
      $.when($.post("/resetPassword", options)).done(function (_res) {
        if (_res.code == 200) {
          hidegenProgress();
          $("#forget_pass_status_span").show();
        } else {
          hidegenProgress();
          alert(_res.msg);
        }
      });
    } else {
      alert("Email is required!");
      hidegenProgress();
    }
  });
});
