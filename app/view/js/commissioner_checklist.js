jQuery(document).ready(function () {
  var urls = new URL(window.location.href);
  var application_id = urls.searchParams.get("id");
  var user_id = urls.searchParams.get("user");
  var certificate_no = urls.searchParams.get("certi");
  var user = JSON.parse(sessionStorage.userData)[0];
  var reduce_all = 0;
  var block_data;
  var left_count = 0;

  function showgenProgress() {
    $("#loader-gen-wrapper").show();
  }

  function hidegenProgress() {
    $("#loader-gen-wrapper").hide();
  }

  $(".application_id_text").append(application_id);
  $(".certificate_id_text").append(certificate_no);

  $("#cancel_btn").click(function () {
    location.href = "../index.html";
  });

  var html2 = "";

  $.each(globals.COMMISSIONER, (key, value) => {
    html2 +=
      '<li>\
    <div class="row">\
        <div class="col-lg-9">\
            <h6 class="kt-section__title kt-section__title-sm quesion_' +
      key +
      '_text">\
                ' +
      value +
      '\
            </h6>\
        </div>\
        <div class="col-lg-3 checkbox_div">\
            <label class="kt-checkbox">\
                <input id="question_' +
      key +
      '" name="question_' +
      key +
      '" type="checkbox">\
                <span></span>\
            </label>\
        </div>\
    </div>\
</li>';
  });

  $(".questions_ol").html(html2);

  function div_unclick() {
    $("#block_details_show_modal").modal("toggle");
  }

  function div_click() {
    $("#block_details_show_modal").modal("toggle");
    $("#heading_text").html(
      "Trusted Block Ledger " /* + $(this).data("blockno") */
    );
    // $("#block_no_text").html($(this).data("blockno"));
    $("#transaction_id_text").html($(this).data("txid"));
    // $("#current_hash_text").html($(this).data("blockhash"));
    $("#time_stamp_text").html(
      moment.unix($(this).data("timestamp")).format("LLLL")
    );
    $("#expires_text").html(
      "Expires: " +
        moment.unix($(this).data("timestamp")).add(10, "years").format("LLLL")
    );
    var status = $(this).data("status_app");
    var bytext;
    var t_no = $(this).data("txno");
    if (t_no == 0) {
      status_text = "Land Details Added By User";
      $(".certificate_div").hide();
      $("#endorser_text").html("N/A");
    } else {
      $(".certificate_div").show();
      if (status == 1) {
        status_text = "Approved By Registrar";
        bytext = "Registrar";
        $("#endorser_text").html($(this).data("rcomment"));
      }
      if (status == 6) {
        status_text = "Approved By Town Planner";
        bytext = "Town Planner";
        $("#endorser_text").html($(this).data("tcomment"));
      }
      if (status == 7) {
        status_text = "Approved By Surveyor";
        bytext = "Surveyor";
        $("#endorser_text").html($(this).data("scomment"));
      }
      if (status == 4) {
        status_text = "Approved By Land Officer";
        bytext = "Land Officer";
        $("#endorser_text").html($(this).data("lcomment"));
      }
    }
    $("#app_status_text").html(status_text);
    $("#cert_issue_text").html(bytext);
  }

  $.when($.get("/getHistoryForLand?land_id=" + application_id)).done(function (
    _res
  ) {
    console.log(_res);
    block_data = _res.data;
    var html = "";
    var status_text;
    block_data.map(function (block, index) {
      if (index == 0) {
        status_text = "Land Added";
        $(".certificate_div").hide();
        $("#endorser_text").html("N/A");
      } else {
        $(".certificate_div").show();
        if (block.Value.approval_status.status == 1) {
          status_text = "Approved By Registrar";
        }
        if (block.Value.approval_status.status == 6) {
          status_text = "Approved By Town Planner";
        }
        if (block.Value.approval_status.status == 7) {
          status_text = "Approved By Surveyor";
        }
        if (block.Value.approval_status.status == 4) {
          status_text = "Approved By Land Officer";
        }
      }
      if (block_data.length - 1 == index) {
        html +=
          '<div class="column_block col_' +
          index +
          ' curr_div" data-blockhash="' +
          block.CurrHash +
          '" data-prehash="' +
          block.PrevHash +
          '" data-blockno="' +
          block.BlockNo +
          '" data-timestamp="' +
          block.Timestamp +
          '" data-txid="' +
          block.TxId +
          '" data-status_app="' +
          block.Value.approval_status.status +
          '" data-txno="' +
          index +
          '" data-rcomment="' +
          block.Value.approval_status.commissioner_comment +
          '" data-tcomment="' +
          block.Value.approval_status.verifier1_comment +
          '" data-lcomment="' +
          block.Value.approval_status.verifier2_comment +
          '" data-scomment="' +
          block.Value.approval_status.surveyor_comment +
          '"  style=" left:' +
          left_count +
          '%" >' +
          "<p>Transaction Id</p><p>" +
          block.TxId +
          '</p> <p class="status_p">' +
          status_text +
          "</p></div>";
      } else {
        html +=
          '<div class="column_block col_' +
          index +
          '" data-blockhash="' +
          block.CurrHash +
          '" data-prehash="' +
          block.PrevHash +
          '" data-blockno="' +
          block.BlockNo +
          '" data-status_app="' +
          block.Value.approval_status.status +
          '" data-timestamp="' +
          block.Timestamp +
          '" data-txno="' +
          index +
          '"  data-rcomment="' +
          block.Value.approval_status.commissioner_comment +
          '" data-tcomment="' +
          block.Value.approval_status.verifier1_comment +
          '" data-lcomment="' +
          block.Value.approval_status.verifier2_comment +
          '" data-scomment="' +
          block.Value.approval_status.surveyor_comment +
          '" data-txid="' +
          block.TxId +
          '" style=" left:' +
          left_count +
          '%" >' +
          "<p>Transaction Id</p><p>" +
          block.TxId +
          '</p> <p class="status_p">' +
          status_text +
          "</p></div>";
      }

      left_count = left_count + 7;
    });
    $("#block_footer_div").html(html);
    $(".column_block").mouseover(div_click);
    $(".column_block").mouseout(div_unclick);
  });

  function hideButtons() {
    $("#cancel_btn").attr("disabled", true);
    $("#save_draft_btn").attr("disabled", true);
    $("#reject_btn").attr("disabled", true);
    $("#submit_btn").attr("disabled", true);
    $("#review_drawing_btn").attr("disabled", true);
    $("#review_parcel_btn").attr("disabled", true);
  }

  function showButtons() {
    $("#cancel_btn").attr("disabled", false);
    $("#save_draft_btn").attr("disabled", false);
    $("#reject_btn").attr("disabled", false);
    $("#submit_btn").attr("disabled", false);
    $("#review_drawing_btn").attr("disabled", false);
    $("#review_parcel_btn").attr("disabled", false);
  }

  $.when($.get("/getSingalLand?id=" + application_id)).done(function (_res) {
    var land = _res.data[0];
    console.log(land);
    if (land.approvalStatus == 1 || land.approvalStatus == 2) {
      hideButtons();
    } else {
      showButtons();
      $.when(
        $.get(
          "/getSingleChecklist?verifier_id=" +
            user._id +
            "&application_id=" +
            application_id
        )
      ).done(function (_res) {
        console.log(_res);
        if (_res.code == 200) {
          if (_res.data.length > 0) {
            $.each(globals.COMMISSIONER, (key, value) => {
              $("#question_" + key).attr(
                "checked",
                _res.data[0]["question_" + key]
              );
            });
          } else {
            let options = {};
            options.que_one = false;
            options.que_two = false;
            options.application_id = application_id;
            options.land_user = user_id;
            options.verifier_id = user._id;
            options.isSurvey = 0;
            options.approvalStatus = 5;
            options.progressIn = 4;
            $.when($.post("/saveChecklistAsDraft", options)).done(function (
              _res
            ) {
              console.log(_res);
            });
          }
        }
      });
    }
  });

  $("#select_all_questions").change(function () {
    // alert($("#select_all_questions").prop("checked"))
    if ($("#select_all_questions").prop("checked")) {
      $("input:checkbox").prop("checked", true);
      reduce_all = 1;
    } else {
      $("input:checkbox").prop("checked", false);
      reduce_all = 0;
    }
  });

  $("#checklist_form").on("submit", function (e) {
    e.preventDefault();
    var questions_check = $("input[type=checkbox]:checked").length - reduce_all;
    console.log(questions_check);
    if (questions_check == globals.COMMISSIONER_QUESTIONS) {
      $("#comment_submit_modal").modal("toggle");
    } else {
      PNotify.notice({
        title: "Notice",
        text: "All question are not checked! please check all questions.",
      });
    }
  });

  $("#save_draft_btn").click(function () {
    let options = {};
    options.questions = {};
    $.each(globals.COMMISSIONER, (key, value) => {
      options.questions["question_" + key] = $("#question_" + key).prop(
        "checked"
      );
    });
    options.application_id = application_id;
    options.land_user = user_id;
    options.verifier_id = user._id;
    options.isSurvey = 0;
    options.approvalStatus = 5;
    options.progressIn = 4;
    $.when($.post("/saveChecklistAsDraft", options)).done(function (_res) {
      if (_res.code == 200) {
        PNotify.success({
          title: "Success!",
          text: _res.msg,
        });
      } else {
        PNotify.error({
          title: _res.msg,
          text: _res.err,
        });
      }
    });
  });

  $("#reject_btn").click(function () {
    $("#comment_modal").modal("toggle");
  });

  $("#forward_to_btn").click(function () {
    $("#comment_forward_modal").modal("toggle");
  });

  $("#comment_reject_form").on("submit", function (e) {
    e.preventDefault();

    let options = {};
    options.application_id = application_id;
    options.by = 4;
    options.user_id = user_id;
    options.verifier_id = user._id;
    options.comment = $("#reject_comment_text").val();
    $.when($.post("/rejectLandRecord", options)).done(function (_res) {
      hidegenProgress();
      if (_res.code == 200) {
        PNotify.success({
          title: "Success!",
          text: "Application Rejected Successfully!",
        });
        // window.history.back()
        location.href = "../index.html";
      } else {
        PNotify.error({
          title: _res.msg,
          text: _res.err,
        });
      }
    });
  });

  $("#comment_submit_form").on("submit", function (e) {
    e.preventDefault();
    showProgress();
    $("#comment_submit_modal").modal("toggle");
    let options = {};
    options.application_id = application_id;
    options.status = 1;
    options.user_id = user_id;
    options.verifier_id = user._id;
    options.send_verifier_id = "registrar";
    options.by = "registrar";
    options.from = 4;
    options.certificate_no = certificate_no;
    options.comment = $("#submit_comment_text").val();
    $.when($.post("/submitChecklist", options)).done(function (_res) {
      hideProgress();
      if (_res.code == 200) {
        PNotify.success({
          title: "Success!",
          text: "Application Approved Successfully!",
        });
        hideButtons();
        $.when($.get("/getHistoryForLand?land_id=" + application_id)).done(
          function (_res) {
            var data = _res.data[_res.data.length - 1];
            console.log(data);

            block_data.push(data);
            var status_text;
            if (data.Value.approval_status.status == 1) {
              status_text = "Approved By Registrar";
            }
            if (data.Value.approval_status.status == 6) {
              status_text = "Approved By Town Planner";
            }
            if (data.Value.approval_status.status == 7) {
              status_text = "Approved By Surveyor";
            }
            if (data.Value.approval_status.status == 4) {
              status_text = "Approved By Land Officer";
            }
            $("#block_footer_div").append(
              '<div class="column_block col_' +
                (block_data.length - 1) +
                '" data-blockhash="' +
                data.CurrHash +
                '" data-prehash="' +
                data.PrevHash +
                '" data-txid="' +
                data.TxId +
                '" data-timestamp="' +
                data.Timestamp +
                '" data-status_app="' +
                data.Value.approval_status.status +
                '"  data-rcomment="' +
                data.Value.approval_status.commissioner_comment +
                '" data-tcomment="' +
                data.Value.approval_status.verifier1_comment +
                '" data-lcomment="' +
                data.Value.approval_status.verifier2_comment +
                '" data-scomment="' +
                data.Value.approval_status.surveyor_comment +
                '" data-txno="' +
                (block_data.length - 1) +
                '" data-blockno="' +
                data.BlockNo +
                '">' +
                "<p>Transaction Id</p><p>" +
                data.TxId +
                '</p> <p class="status_p">' +
                status_text +
                "</p></div>"
            );

            $(".col_" + (block_data.length - 1)).animate(
              { left: left_count + "%" },
              2500,
              () => {
                $(".col_" + (block_data.length - 2)).removeClass("curr_div");
                // console.log($(this), i)
                $(".col_" + (block_data.length - 1)).addClass("curr_div");
                left_count += 7;
                location.href =
                  "certificate.html?id=" +
                  user_id +
                  "&app_id=" +
                  application_id;
                // window.open('certificate.html?id=' + user_id + '&app_id=' + application_id, "_blank")
              }
            );
            $(".column_block").unbind("mouseover");
            $(".column_block").unbind("mouseout");
            $(".column_block").mouseover(div_click);
            $(".column_block").mouseout(div_unclick);
          }
        );
        // window.history.back()
        // location.href = 'verifier_inprogress_list.html?re=1'
        // location.href = 'certificate.html?id='+ user_id + '&app_id='+ application_id
        // location.href = '../index.html'
      } else {
        PNotify.error({
          title: _res.msg,
          text: _res.err,
        });
      }
    });
  });

  hidegenProgress();

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
});
