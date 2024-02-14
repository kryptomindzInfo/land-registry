jQuery(document).ready(function () {
  var urls = new URL(window.location.href);
  var application_id = urls.searchParams.get("id");
  var user_id = urls.searchParams.get("user");
  var certificate_no = urls.searchParams.get("certi");
  var user = JSON.parse(sessionStorage.userData)[0];
  var reduce_all = 0;
  var block_data;
  var left_count = 0;

  $(".application_id_text").append(application_id);
  $(".certificate_id_text").append(certificate_no);

  var html2 = "";

  $.each(globals.SURVEYOUR, (key, value) => {
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

  $("#cancel_btn").click(function () {
    location.href = "../index.html";
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
    $("#current_hash_text").html($(this).data("blockhash"));
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

    $("#pnorth").val(land.npnorth),
      $("#psouth").val(land.npsouth),
      $("#peast").val(land.npeast),
      $("#pwest").val(land.npwest);
    if (land.approvalStatus == 7 || land.approvalStatus == 2) {
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
            if (_res.data[0].hasOwnProperty("parcel_data")) {
              $("#pnorth").val(_res.data[0].parcel_data.north),
                $("#psouth").val(_res.data[0].parcel_data.south),
                $("#peast").val(_res.data[0].parcel_data.east),
                $("#pwest").val(_res.data[0].parcel_data.west);
            }
            // var p_que, d_que;
            // if(JSON.parse(_res.data[0].parcel_que) == true) {
            //     p_que = 0
            // } else {
            //     p_que = 1
            // }

            // if(JSON.parse(_res.data[0].draw_que) == true) {
            //     d_que = 0
            // } else {
            //     d_que = 1
            // }

            $.each(globals.SURVEYOUR, (key, value) => {
              $("#question_" + key).attr(
                "checked",
                _res.data[0]["question_" + key]
              );
            });

            // $("input[class=neighbour_parcel_type][value=" + p_que + "]").prop('checked', true);
            // $("input[class=drawing_type][value=" + d_que + "]").prop('checked', true);

            if (_res.data[0].hasOwnProperty("draw_data")) {
              $("#land_markers_array")
                .val(JSON.stringify(_res.data[0].draw_data.land_markers))
                .trigger("change");
              $("#land_markers_area").val(
                JSON.stringify(_res.data[0].draw_data.marked_area)
              );
            } else {
              $("#land_markers_array")
                .val(JSON.stringify(land.land_markers))
                .trigger("change");
              $("#land_markers_area").val(JSON.stringify(land.marked_area));
            }
          } else {
            $("#land_markers_array")
              .val(JSON.stringify(land.land_markers))
              .trigger("change");
            $("#land_markers_area").val(JSON.stringify(land.marked_area));
            let options = {};
            options.que_one = false;
            options.que_two = false;
            options.que_three = false;
            options.que_four = false;
            options.que_five = false;
            options.que_six = false;
            options.que_seven = false;
            options.que_eight = false;
            options.que_nine = false;
            options.que_ten = false;
            options.application_id = application_id;
            options.land_user = user_id;
            options.verifier_id = user._id;
            options.isSurvey = 0;
            options.approvalStatus = 5;
            options.progressIn = 3;
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

  $("#review_drawing_btn").click(function () {
    $("#drawing_modal").modal("toggle");
  });

  $("#review_parcel_btn").click(function () {
    $("#parcel_modal").modal("toggle");
  });

  // $('.neighbour_parcel_type').change(() => {
  //     if ($("input[name='neighbour_parcel_type']:checked").val() == 1) {
  //          $("#parcel_modal").modal('toggle')
  //     }
  // })

  // $('.drawing_type').change(() => {
  //     if ($("input[name='drawing_type']:checked").val() == 1) {
  //          $("#drawing_modal").modal('toggle')
  //     }
  // })

  $("#checklist_form").on("submit", function (e) {
    e.preventDefault();
    // var questions_check = $('input[type=checkbox]:checked').length - reduce_all
    // console.log($("input[name='neighbour_parcel_type']:checked").val())
    var questions_check = $("input[type=checkbox]:checked").length - reduce_all;
    if (questions_check == globals.SURVEYOUR_QUESTIONS) {
      $("#comment_submit_modal").modal("toggle");
    } else {
      PNotify.notice({
        title: "Notice",
        text: "All question are not checked! please check all questions.",
      });
    }
  });

  $("#save_draft_btn, #save_btn").click(function () {
    let options = {};
    // if ($("input[name='neighbour_parcel_type']:checked").val() == 1) {
    //     options.parcel_que = false
    // } else {
    //     options.parcel_que = true
    // }
    // if ($("input[name='drawing_type']:checked").val() == 1) {
    //     options.draw_que = false
    // } else {
    //     options.draw_que = true
    // }
    showgenProgress();
    options.questions = {};
    $.each(globals.SURVEYOUR, (key, value) => {
      options.questions["question_" + key] = $("#question_" + key).prop(
        "checked"
      );
    });
    options.application_id = application_id;
    options.land_user = user_id;
    options.verifier_id = user._id;
    options.isSurvey = 1;
    options.parcel_data = {
      north: $("#pnorth").val(),
      south: $("#psouth").val(),
      east: $("#peast").val(),
      west: $("#pwest").val(),
    };
    options.approvalStatus = 5;
    options.progressIn = 3;
    $.when($.post("/saveChecklistAsDraft", options)).done(function (_res) {
      hidegenProgress();
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

  $("#save_draw_btn").click(function () {
    let options = {};
    // if ($("input[name='neighbour_parcel_type']:checked").val() == 1) {
    //     options.parcel_que = false
    // } else {
    //     options.parcel_que = true
    // }
    // if ($("input[name='drawing_type']:checked").val() == 1) {
    //     options.draw_que = false
    // } else {
    //     options.draw_que = true
    // }
    options.questions = {};
    $.each(globals.SURVEYOUR, (key, value) => {
      options.questions["question_" + key] = $("#question_" + key).prop(
        "checked"
      );
    });
    options.application_id = application_id;
    options.land_user = user_id;
    options.verifier_id = user._id;
    options.isSurvey = 2;
    options.draw_data = {
      land_markers: JSON.parse($("#land_markers_array").val()),
      marked_area: $("#land_markers_area").val(),
    };
    options.approvalStatus = 5;
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
    showgenProgress();
    let options = {};
    options.application_id = application_id;
    options.by = 3;
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
      "&class=file_hash&name=file_name&id=v2";

    $(".my_dropzone").attr("action", action);
    var mydrop = $(".my_dropzone")[0].dropzone;
    mydrop.destroy();
    $(".my_dropzone").dropzone({
      url: action,
      addRemoveLinks: true,
    });
  });

  $("#comment_submit_form").on("submit", function (e) {
    e.preventDefault();
    showProgress();
    $("#comment_submit_modal").modal("toggle");
    let options = {};
    options.application_id = application_id;
    options.status = 7;
    options.user_id = user_id;
    options.verifier_id = user._id;
    options.send_verifier_id = "landofficer";
    options.by = "surveyor";
    if ($("#file_hash").val() != "") {
      options.extraDocs2 = {
        file_name: $("#file_name").val(),
        file_hash: $("#file_hash").val(),
      };
    }
    options.certificate_no = certificate_no;
    options.draw_data = {
      land_markers: JSON.parse($("#land_markers_array").val()),
      marked_area: $("#land_markers_area").val(),
    };
    options.parcel_data = {
      north: $("#pnorth").val(),
      south: $("#psouth").val(),
      east: $("#peast").val(),
      west: $("#pwest").val(),
    };
    options.from = 3;
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
