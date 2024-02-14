//
// Dashboard
//

// Class definition
var KTDashboard = (function () {
  var domain = globals.URL;
  var ipfsurl = globals.IPFS_URL;

  var mediumCharts = function () {
    KTLib.initMediumChart(
      "kt_widget_mini_chart_1",
      [20, 45, 20, 10, 20, 35, 20, 25, 10, 10],
      70,
      KTApp.getStateColor("brand")
    );
    KTLib.initMediumChart(
      "kt_widget_mini_chart_2",
      [10, 15, 25, 45, 15, 30, 10, 40, 15, 25],
      70,
      KTApp.getStateColor("danger")
    );
    KTLib.initMediumChart(
      "kt_widget_mini_chart_3",
      [22, 15, 40, 10, 35, 20, 30, 50, 15, 10],
      70,
      KTApp.getBaseColor("shape", 4)
    );
  };

  var latestProductsMiniCharts = function () {
    KTLib.initMiniChart(
      $("#kt_widget_latest_products_chart_1"),
      [6, 12, 9, 18, 15, 9, 11, 8],
      KTApp.getStateColor("info"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_latest_products_chart_2"),
      [8, 6, 13, 16, 9, 6, 11, 14],
      KTApp.getStateColor("warning"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_latest_products_chart_3"),
      [8, 6, 13, 16, 9, 6, 11, 14],
      KTApp.getStateColor("warning"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_latest_products_chart_4"),
      [3, 9, 9, 18, 15, 9, 11, 8],
      KTApp.getStateColor("success"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_latest_products_chart_5"),
      [5, 7, 9, 18, 15, 9, 11, 8],
      KTApp.getStateColor("brand"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_latest_products_chart_6"),
      [3, 9, 5, 18, 15, 7, 11, 6],
      KTApp.getStateColor("danger"),
      2,
      false,
      false
    );
  };

  var generalStatistics = function () {
    // Mini charts
    KTLib.initMiniChart(
      $("#kt_widget_general_statistics_chart_1"),
      [6, 8, 3, 18, 15, 7, 11, 7],
      KTApp.getStateColor("warning"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_general_statistics_chart_2"),
      [8, 6, 9, 18, 15, 7, 11, 16],
      KTApp.getStateColor("brand"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_general_statistics_chart_3"),
      [4, 12, 9, 18, 15, 7, 11, 12],
      KTApp.getStateColor("danger"),
      2,
      false,
      false
    );
    KTLib.initMiniChart(
      $("#kt_widget_general_statistics_chart_4"),
      [3, 14, 5, 12, 15, 8, 14, 16],
      KTApp.getStateColor("success"),
      2,
      false,
      false
    );

    // Main chart
    if (!document.getElementById("kt_widget_general_statistics_chart_main")) {
      return;
    }

    var ctx = document
      .getElementById("kt_widget_general_statistics_chart_main")
      .getContext("2d");

    var gradient1 = ctx.createLinearGradient(0, 0, 0, 350);
    gradient1.addColorStop(
      0,
      Chart.helpers.color(KTApp.getStateColor("brand")).alpha(0.3).rgbString()
    );
    gradient1.addColorStop(
      1,
      Chart.helpers.color(KTApp.getStateColor("brand")).alpha(0).rgbString()
    );

    var gradient2 = ctx.createLinearGradient(0, 0, 0, 350);
    gradient2.addColorStop(
      0,
      Chart.helpers.color(KTApp.getStateColor("danger")).alpha(0.3).rgbString()
    );
    gradient2.addColorStop(
      1,
      Chart.helpers.color(KTApp.getStateColor("danger")).alpha(0).rgbString()
    );

    var mainConfig = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
        ],
        datasets: [
          {
            label: "Sales",
            borderColor: KTApp.getStateColor("brand"),
            borderWidth: 2,
            backgroundColor: gradient1,
            pointBackgroundColor: KTApp.getStateColor("brand"),
            data: [30, 60, 25, 7, 5, 15, 30, 20, 15, 10],
          },
          {
            label: "Orders",
            borderWidth: 1,
            borderColor: KTApp.getStateColor("danger"),
            backgroundColor: gradient2,
            pointBackgroundColor: KTApp.getStateColor("danger"),
            data: [10, 15, 25, 35, 15, 30, 55, 40, 65, 40],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: "",
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor("brand"),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false,
          },
        },
        hover: {
          mode: "index",
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              ticks: {
                display: false,
                beginAtZero: true,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              stacked: false,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                color: "#eef2f9",
                drawBorder: false,
                offsetGridLines: true,
                drawTicks: false,
              },
              ticks: {
                display: false,
                beginAtZero: true,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
            borderWidth: 0,
            hoverRadius: 0,
            hoverBorderWidth: 0,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
    };

    var chart = new Chart(ctx, mainConfig);

    // Update chart on window resize
    KTUtil.addResizeHandler(function () {
      chart.update();
    });
  };

  var widgetTechnologiesChartGov = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    var statusdata = [];
    $.when($.get("/showLandStatus?id=" + user._id)).done(function (_res) {
      console.log(_res.data);
      statusdata.push(
        _res.data.approved,
        _res.data.rejected,
        _res.data.pending,
        _res.data.saved
      );
      if ($("#kt_widget_technologies_chart_gov").length == 0) {
        return;
      }

      var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
      };

      var config = {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: statusdata,
              backgroundColor: ["#1fb53a", "#f50808", "#02c3f3", "#ffb822"],
            },
          ],
          labels: ["Approved", "Rejected", "Pending", "Saved"],
        },
        options: {
          cutoutPercentage: 75,
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
            position: "top",
          },
          title: {
            display: false,
            text: "Technology",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          tooltips: {
            enabled: true,
            intersect: false,
            mode: "nearest",
            bodySpacing: 5,
            yPadding: 10,
            xPadding: 10,
            caretPadding: 0,
            displayColors: false,
            backgroundColor: KTApp.getStateColor("brand"),
            titleFontColor: "#ffffff",
            cornerRadius: 4,
            footerSpacing: 0,
            titleSpacing: 0,
          },
        },
      };

      var ctx = document
        .getElementById("kt_widget_technologies_chart_gov")
        .getContext("2d");
      var myDoughnut = new Chart(ctx, config);
    });
  };

  var widgetTechnologiesChart = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    var statusdata = [];
    $.when($.get("/showLandStatus?id=" + user._id)).done(function (_res) {
      statusdata.push(
        _res.data.approved,
        _res.data.rejected,
        _res.data.pending,
        _res.data.saved
      );
      if ($("#kt_widget_technologies_chart").length == 0) {
        return;
      }

      var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
      };

      var config = {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: statusdata,
              backgroundColor: ["#1fb53a", "#f50808", "#02c3f3", "#ffb822"],
            },
          ],
          labels: ["Approved", "Rejected", "Pending", "Saved"],
        },
        options: {
          cutoutPercentage: 75,
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
            position: "top",
          },
          title: {
            display: false,
            text: "Technology",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          tooltips: {
            enabled: true,
            intersect: false,
            mode: "nearest",
            bodySpacing: 5,
            yPadding: 10,
            xPadding: 10,
            caretPadding: 0,
            displayColors: false,
            backgroundColor: KTApp.getStateColor("brand"),
            titleFontColor: "#ffffff",
            cornerRadius: 4,
            footerSpacing: 0,
            titleSpacing: 0,
          },
        },
      };

      var ctx = document
        .getElementById("kt_widget_technologies_chart")
        .getContext("2d");
      var myDoughnut = new Chart(ctx, config);
    });
  };

  var widgetTechnologiesChartAdminPending = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "2") {
      $.when($.get("/showAdminLandStatus")).done(function (_res) {
        console.log(_res, "my");
        var total =
          _res.status.pending.tp +
          _res.status.pending.la +
          _res.status.pending.s +
          _res.status.pending.r;
        $(".total_pending_lands_admin").text(total);
        statusdata.push(
          _res.status.pending.tp,
          _res.status.pending.la,
          _res.status.pending.s,
          _res.status.pending.r
        );
        if ($("#kt_widget_technologies_chart_pending_admin").length == 0) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#1fb53a", "#5578eb", "#ffb822", "#fd397a"],
              },
            ],
            labels: ["Town Planner", "Land Officer", "Surveyor", "Registrar"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_pending_admin")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartAdminApproved = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "2") {
      $.when($.get("/showAdminLandStatus")).done(function (_res) {
        var total = _res.status.approved + _res.status.rejected;
        $(".total_approved_lands_admin").text(total);
        statusdata.push(_res.status.approved, _res.status.rejected);
        if ($("#kt_widget_technologies_chart_approved_admin").length == 0) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: [
                  "#1fb53a",
                  // '#5578eb',
                  // '#ffb822',
                  "#fd397a",
                ],
              },
            ],
            labels: [
              "Approved",
              "Rejected",
              // 'Surveyour',
              // 'Registrar'
            ],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_approved_admin")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartVerifierOnePending = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "3") {
      $.when($.get("/showVerifierLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total =
            _res.data.approved + _res.data.rejected + _res.data.pending;
          $(".total_pending_land_for_verifier_one").text(_res.data.pending);
          statusdata.push(_res.data.pending);
          if (
            $("#kt_widget_technologies_chart_pending_verifier_one").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#02c3f3"],
                },
              ],
              labels: ["Pending"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById("kt_widget_technologies_chart_pending_verifier_one")
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierOneApproved = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "3") {
      $.when($.get("/showVerifierLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total =
            _res.data.approved + _res.data.rejected + _res.data.pending;
          $(".total_approved_land_for_verifier_one").text(_res.data.approved);
          statusdata.push(_res.data.approved);
          if (
            $("#kt_widget_technologies_chart_approved_verifier_one").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#1fb53a"],
                },
              ],
              labels: ["Approved"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_approved_verifier_one"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierOneRejected = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "3") {
      $.when($.get("/showVerifierLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total =
            _res.data.approved + _res.data.rejected + _res.data.pending;
          $(".total_rejected_land_for_verifier_one").text(_res.data.rejected);
          statusdata.push(_res.data.rejected);
          if (
            $("#kt_widget_technologies_chart_rejected_verifier_one").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#f50808"],
                },
              ],
              labels: ["Rejected"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_rejected_verifier_one"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierOneProgress = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "3") {
      $.when($.get("/showInProgressChecklist?verifier_id=" + user._id)).done(
        function (_res) {
          $(".total_in_progress_land_for_verifier_one").text(_res.data.length);
          statusdata.push(_res.data.length);
          if (
            $("#kt_widget_technologies_chart_in_progress_verifier_one")
              .length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#ffb822"],
                },
              ],
              labels: ["In Progress"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_in_progress_verifier_one"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierTwoPending = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "4") {
      $.when($.get("/VerifierTwoLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total =
            _res.data.approved + _res.data.rejected + _res.data.pending;
          $(".total_pending_land_for_verifier_two").text(_res.data.pending);
          statusdata.push(_res.data.pending);
          if (
            $("#kt_widget_technologies_chart_pending_verifier_two").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#02c3f3"],
                },
              ],
              labels: ["Pending"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById("kt_widget_technologies_chart_pending_verifier_two")
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierTwoProgress = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "4") {
      $.when($.get("/showInProgressChecklist?verifier_id=" + user._id)).done(
        function (_res) {
          $(".total_in_progress_land_for_verifier_two").text(_res.data.length);
          statusdata.push(_res.data.length);
          if (
            $("#kt_widget_technologies_chart_in_progress_verifier_two")
              .length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#ffb822"],
                },
              ],
              labels: ["In Progress"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_in_progress_verifier_two"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierTwoApproved = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "4") {
      $.when($.get("/VerifierTwoLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total =
            _res.data.approved + _res.data.rejected + _res.data.pending;
          $(".total_approved_land_for_verifier_two").text(_res.data.approved);
          statusdata.push(_res.data.approved);
          if (
            $("#kt_widget_technologies_chart_approved_verifier_two").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#1fb53a"],
                },
              ],
              labels: ["Approved"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_approved_verifier_two"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierTwoRejected = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "4") {
      $.when($.get("/VerifierTwoLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total =
            _res.data.approved + _res.data.rejected + _res.data.pending;
          $(".total_rejected_land_for_verifier_two").text(_res.data.rejected);
          statusdata.push(_res.data.rejected);
          if (
            $("#kt_widget_technologies_chart_rejected_verifier_two").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#f50808"],
                },
              ],
              labels: ["Rejected"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_rejected_verifier_two"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartVerifierTwoForwared = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "4") {
      $.when($.get("/VerifierTwoLandStatus?region_id=" + user.region_id)).done(
        function (_res) {
          var total = _res.data.forwarded + _res.data.survey_done;
          $(".total_forwarded_land_for_verifier_two").text(total);
          statusdata.push(_res.data.forwarded, _res.data.survey_done);
          if (
            $("#kt_widget_technologies_chart_forwarded_verifier_two").length ==
            0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#5578eb", "#1fb53a"],
                },
              ],
              labels: ["Pending", "Approved"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_forwarded_verifier_two"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartCommissionerPending = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "6") {
      $.when($.get("/commissionerLandStatus")).done(function (_res) {
        var total = _res.data.approved + _res.data.rejected + _res.data.pending;
        $(".total_pending_land_for_commissioner").text(_res.data.pending);
        statusdata.push(_res.data.pending);
        if (
          $("#kt_widget_technologies_chart_pending_commissioner").length == 0
        ) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#02c3f3"],
              },
            ],
            labels: ["Pending"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_pending_commissioner")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartCommissionerProgress = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "6") {
      $.when($.get("/showInProgressChecklist?verifier_id=" + user._id)).done(
        function (_res) {
          $(".total_in_progress_land_for_commissioner").text(_res.data.length);
          statusdata.push(_res.data.length);
          if (
            $("#kt_widget_technologies_chart_in_progress_commissioner")
              .length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#ffb822"],
                },
              ],
              labels: ["In Progress"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_in_progress_commissioner"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartCommissionerApproved = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "6") {
      $.when($.get("/commissionerLandStatus")).done(function (_res) {
        var total = _res.data.approved + _res.data.rejected + _res.data.pending;
        $(".total_approved_land_for_commissioner").text(_res.data.approved);
        statusdata.push(_res.data.approved);
        if (
          $("#kt_widget_technologies_chart_approved_commissioner").length == 0
        ) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#1fb53a"],
              },
            ],
            labels: ["Approved"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_approved_commissioner")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartCommissionerRejected = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "6") {
      $.when($.get("/commissionerLandStatus")).done(function (_res) {
        var total = _res.data.approved + _res.data.rejected + _res.data.pending;
        $(".total_rejected_land_for_commissioner").text(_res.data.rejected);
        statusdata.push(_res.data.rejected);
        if (
          $("#kt_widget_technologies_chart_rejected_commissioner").length == 0
        ) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#f50808"],
              },
            ],
            labels: ["Rejected"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_rejected_commissioner")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartSurveyourPending = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "5") {
      $.when($.get("/surveyourLandStatus")).done(function (_res) {
        var total = _res.data.approved + _res.data.rejected + _res.data.pending;
        $(".total_pending_land_for_surveyour").text(_res.data.pending);
        statusdata.push(_res.data.pending);
        if ($("#kt_widget_technologies_chart_pending_surveyour").length == 0) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#02c3f3"],
              },
            ],
            labels: ["Pending"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_pending_surveyour")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartSurveyourProgress = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "5") {
      $.when($.get("/showInProgressChecklist?verifier_id=" + user._id)).done(
        function (_res) {
          $(".total_in_progress_land_for_surveyour").text(_res.data.length);
          statusdata.push(_res.data.length);
          if (
            $("#kt_widget_technologies_chart_in_progress_surveyour").length == 0
          ) {
            return;
          }

          var randomScalingFactor = function () {
            return Math.round(Math.random() * 100);
          };

          var config = {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: statusdata,
                  backgroundColor: ["#ffb822"],
                },
              ],
              labels: ["In Progress"],
            },
            options: {
              cutoutPercentage: 75,
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: "top",
              },
              title: {
                display: false,
                text: "Technology",
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
                intersect: false,
                mode: "nearest",
                bodySpacing: 5,
                yPadding: 10,
                xPadding: 10,
                caretPadding: 0,
                displayColors: false,
                backgroundColor: KTApp.getStateColor("brand"),
                titleFontColor: "#ffffff",
                cornerRadius: 4,
                footerSpacing: 0,
                titleSpacing: 0,
              },
            },
          };

          var ctx = document
            .getElementById(
              "kt_widget_technologies_chart_in_progress_surveyour"
            )
            .getContext("2d");
          var myDoughnut = new Chart(ctx, config);
        }
      );
    }
  };

  var widgetTechnologiesChartSurveyourApproved = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "5") {
      $.when($.get("/surveyourLandStatus")).done(function (_res) {
        var total = _res.data.approved + _res.data.rejected + _res.data.pending;
        $(".total_approved_land_for_surveyour").text(_res.data.approved);
        statusdata.push(_res.data.approved);
        if ($("#kt_widget_technologies_chart_approved_surveyour").length == 0) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#1fb53a"],
              },
            ],
            labels: ["Approved"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_approved_surveyour")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartSurveyourRejected = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    // console.log(user)
    var statusdata = [];
    if (user.userType == "6") {
      $.when($.get("/surveyourLandStatus")).done(function (_res) {
        var total = _res.data.approved + _res.data.rejected + _res.data.pending;
        $(".total_rejected_land_for_surveyour").text(_res.data.rejected);
        statusdata.push(_res.data.rejected);
        if ($("#kt_widget_technologies_chart_rejected_surveyour").length == 0) {
          return;
        }

        var randomScalingFactor = function () {
          return Math.round(Math.random() * 100);
        };

        var config = {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: statusdata,
                backgroundColor: ["#f50808"],
              },
            ],
            labels: ["Rejected"],
          },
          options: {
            cutoutPercentage: 75,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
              position: "top",
            },
            title: {
              display: false,
              text: "Technology",
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
            tooltips: {
              enabled: true,
              intersect: false,
              mode: "nearest",
              bodySpacing: 5,
              yPadding: 10,
              xPadding: 10,
              caretPadding: 0,
              displayColors: false,
              backgroundColor: KTApp.getStateColor("brand"),
              titleFontColor: "#ffffff",
              cornerRadius: 4,
              footerSpacing: 0,
              titleSpacing: 0,
            },
          },
        };

        var ctx = document
          .getElementById("kt_widget_technologies_chart_rejected_surveyour")
          .getContext("2d");
        var myDoughnut = new Chart(ctx, config);
      });
    }
  };

  var widgetTechnologiesChartuser = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    var typedata = [];
    $.when($.get("/showLandStatus?id=" + user._id)).done(function (_res) {
      typedata.push(_res.data2.residential, _res.data2.commercial);
      if ($("#kt_widget_technologies_chart_type").length == 0) {
        return;
      }

      var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
      };

      var config = {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: typedata,
              backgroundColor: [
                "#1fb53a",
                //KTApp.getBaseColor('shape', 4),
                "#f50808",
              ],
            },
          ],
          labels: ["Residential", "Commercial"],
        },
        options: {
          cutoutPercentage: 75,
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
            position: "top",
          },
          title: {
            display: false,
            text: "Technology",
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          tooltips: {
            enabled: true,
            intersect: false,
            mode: "nearest",
            bodySpacing: 5,
            yPadding: 10,
            xPadding: 10,
            caretPadding: 0,
            displayColors: false,
            backgroundColor: KTApp.getStateColor("brand"),
            titleFontColor: "#ffffff",
            cornerRadius: 4,
            footerSpacing: 0,
            titleSpacing: 0,
          },
        },
      };

      var ctx = document
        .getElementById("kt_widget_technologies_chart_type")
        .getContext("2d");
      var myDoughnut = new Chart(ctx, config);
    });
  };

  var widgetTechnologiesChart2 = function () {
    if ($("#kt_widget_technologies_chart_2").length == 0) {
      return;
    }

    var randomScalingFactor = function () {
      return Math.round(Math.random() * 100);
    };

    var config = {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [35, 30, 35],
            backgroundColor: [
              KTApp.getStateColor("warning"),
              KTApp.getStateColor("brand"),
              KTApp.getStateColor("success"),
            ],
          },
        ],
        labels: ["CSS", "Angular", "HTML"],
      },
      options: {
        cutoutPercentage: 75,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: "top",
        },
        title: {
          display: false,
          text: "Technology",
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor("brand"),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
      },
    };

    var ctx = document
      .getElementById("kt_widget_technologies_chart_2")
      .getContext("2d");
    var myDoughnut = new Chart(ctx, config);
  };

  var widgetTotalOrdersChart = function () {
    if (!document.getElementById("kt_widget_total_orders_chart")) {
      return;
    }

    // Main chart
    var max = 80;
    var color = KTApp.getStateColor("brand");
    var ctx = document
      .getElementById("kt_widget_total_orders_chart")
      .getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, Chart.helpers.color(color).alpha(0.3).rgbString());
    gradient.addColorStop(1, Chart.helpers.color(color).alpha(0).rgbString());

    var data = [30, 35, 45, 65, 35, 50, 40, 60, 35, 45];

    var mainConfig = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
        ],
        datasets: [
          {
            label: "Orders",
            borderColor: color,
            borderWidth: 3,
            backgroundColor: gradient,
            pointBackgroundColor: KTApp.getStateColor("brand"),
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: false,
          text: "Stacked Area",
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor("brand"),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false,
          },
        },
        hover: {
          mode: "index",
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              ticks: {
                display: false,
                beginAtZero: true,
              },
            },
          ],
          yAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                color: "#eef2f9",
                drawBorder: false,
                offsetGridLines: true,
                drawTicks: false,
              },
              ticks: {
                max: max,
                display: false,
                beginAtZero: true,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
            borderWidth: 0,
            hoverRadius: 0,
            hoverBorderWidth: 0,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
    };

    var chart = new Chart(ctx, mainConfig);

    // Update chart on window resize
    KTUtil.addResizeHandler(function () {
      chart.update();
    });
  };

  var widgetTotalOrdersChart2 = function () {
    if (!document.getElementById("kt_widget_total_orders_chart_2")) {
      return;
    }

    // Main chart
    var max = 80;
    var color = KTApp.getStateColor("danger");
    var ctx = document
      .getElementById("kt_widget_total_orders_chart_2")
      .getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, Chart.helpers.color(color).alpha(0.3).rgbString());
    gradient.addColorStop(1, Chart.helpers.color(color).alpha(0).rgbString());

    var data = [30, 35, 45, 65, 35, 50, 40, 60, 35, 45];

    var mainConfig = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
        ],
        datasets: [
          {
            label: "Orders",
            borderColor: color,
            borderWidth: 3,
            backgroundColor: gradient,
            pointBackgroundColor: KTApp.getStateColor("brand"),
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: false,
          text: "Stacked Area",
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor("brand"),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false,
          },
        },
        hover: {
          mode: "index",
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              ticks: {
                display: false,
                beginAtZero: true,
              },
            },
          ],
          yAxes: [
            {
              display: false,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                color: "#eef2f9",
                drawBorder: false,
                offsetGridLines: true,
                drawTicks: false,
              },
              ticks: {
                max: max,
                display: false,
                beginAtZero: true,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
            borderWidth: 0,
            hoverRadius: 0,
            hoverBorderWidth: 0,
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
    };

    var chart = new Chart(ctx, mainConfig);

    // Update chart on window resize
    KTUtil.addResizeHandler(function () {
      chart.update();
    });
  };

  var widgetSalesStatisticsChart = function () {
    if (!document.getElementById("kt_chart_sales_statistics")) {
      return;
    }

    var MONTHS = [
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
      "5 Aug",
      "6 Aug",
      "7 Aug",
    ];

    var color = Chart.helpers.color;
    var barChartData = {
      labels: ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 Aug"],
      datasets: [
        {
          label: "Sales",
          backgroundColor: color(KTApp.getStateColor("brand"))
            .alpha(1)
            .rgbString(),
          borderWidth: 0,
          data: [20, 30, 40, 35, 45, 55, 45],
        },
        {
          label: "Orders",
          backgroundColor: color(KTApp.getBaseColor("shape", 1))
            .alpha(1)
            .rgbString(),
          borderWidth: 0,
          data: [25, 35, 45, 40, 50, 60, 50],
        },
      ],
    };

    var ctx = document
      .getElementById("kt_chart_sales_statistics")
      .getContext("2d");
    var myBar = new Chart(ctx, {
      type: "bar",
      data: barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              gridLines: false,
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: KTApp.getBaseColor("shape", 3),
                fontSize: 13,
                padding: 10,
              },
            },
          ],
          yAxes: [
            {
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                color: KTApp.getBaseColor("shape", 2),
                drawBorder: false,
                offsetGridLines: false,
                drawTicks: false,
                borderDash: [3, 4],
                zeroLineWidth: 1,
                zeroLineColor: KTApp.getBaseColor("shape", 2),
                zeroLineBorderDash: [3, 4],
              },
              ticks: {
                max: 70,
                stepSize: 10,
                display: true,
                beginAtZero: true,
                fontColor: KTApp.getBaseColor("shape", 3),
                fontSize: 13,
                padding: 10,
              },
            },
          ],
        },
        title: {
          display: false,
        },
        hover: {
          mode: "index",
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor("brand"),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5,
          },
        },
      },
    });
  };

  var widgetRevenueGrowthChart = function () {
    if (!document.getElementById("kt_chart_revenue_growth")) {
      return;
    }

    var color = Chart.helpers.color;
    var barChartData = {
      labels: [
        "1 Aug",
        "2 Aug",
        "3 Aug",
        "4 Aug",
        "5 Aug",
        "6 Aug",
        "7 Aug",
        "8 Aug",
        "9 Aug",
        "10 Aug",
        "11 Aug",
        "12 Aug",
      ],
      datasets: [
        {
          label: "Sales",
          backgroundColor: color(KTApp.getStateColor("brand"))
            .alpha(1)
            .rgbString(),
          borderWidth: 0,
          data: [10, 40, 20, 40, 40, 60, 40, 80, 40, 70, 40, 70],
          borderColor: KTApp.getStateColor("brand"),
          borderWidth: 3,
          backgroundColor: color(KTApp.getStateColor("brand"))
            .alpha(0.07)
            .rgbString(),
          //pointBackgroundColor: KTApp.getStateColor('brand'),
          fill: true,
        },
      ],
    };

    var ctx = document
      .getElementById("kt_chart_revenue_growth")
      .getContext("2d");
    var myBar = new Chart(ctx, {
      type: "line",
      data: barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              gridLines: false,
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: KTApp.getBaseColor("shape", 3),
                fontSize: 13,
                padding: 10,
              },
            },
          ],
          yAxes: [
            {
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                color: KTApp.getBaseColor("shape", 2),
                drawBorder: false,
                offsetGridLines: false,
                drawTicks: false,
                borderDash: [3, 4],
                zeroLineWidth: 1,
                zeroLineColor: KTApp.getBaseColor("shape", 2),
                zeroLineBorderDash: [3, 4],
              },
              ticks: {
                max: 100,
                stepSize: 20,
                display: true,
                beginAtZero: true,
                fontColor: KTApp.getBaseColor("shape", 3),
                fontSize: 13,
                padding: 10,
              },
            },
          ],
        },
        title: {
          display: false,
        },
        hover: {
          mode: "index",
        },
        elements: {
          line: {
            tension: 0.5,
          },
          point: {
            radius: 0,
          },
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: KTApp.getStateColor("brand"),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5,
          },
        },
      },
    });
  };

  var daterangepickerInit = function () {
    if ($("#kt_dashboard_daterangepicker").length == 0) {
      return;
    }

    var picker = $("#kt_dashboard_daterangepicker");
    var start = moment();
    var end = moment();

    function cb(start, end, label) {
      var title = "";
      var range = "";

      if (end - start < 100 || label == "Today") {
        title = "Today:";
        range = start.format("MMM D");
      } else if (label == "Yesterday") {
        title = "Yesterday:";
        range = start.format("MMM D");
      } else {
        range = start.format("MMM D") + " - " + end.format("MMM D");
      }

      picker.find("#kt_dashboard_daterangepicker_date").html(range);
      picker.find("#kt_dashboard_daterangepicker_title").html(title);
    }

    picker.daterangepicker(
      {
        direction: KTUtil.isRTL(),
        startDate: start,
        endDate: end,
        opens: "left",
        applyClass: "btn btn-sm btn-primary",
        cancelClass: "btn btn-sm btn-secondary",
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
      },
      cb
    );

    cb(start, end, "");
  };

  var recentOrdersInit = function () {
    if ($("#kt_recent_orders").length === 0) {
      return;
    }

    var datatable = $("#kt_recent_orders").KTDatatable({
      // datasource definition
      data: {
        type: "remote",
        source: {
          read: {
            url: domain + "/listUnApprovedUser",
            method: "GET",
          },
        },
        pageSize: 10,
        serverPaging: true,
        serverFiltering: false,
        serverSorting: true,
      },

      // layout definition
      layout: {
        scroll: true,
        footer: false,
        height: 430,
      },

      // column sorting
      sortable: true,

      pagination: true,

      search: {
        input: $("#kt_search"),
      },

      // columns definition
      columns: [
        {
          field: "id",
          title: "#",
          sortable: false,
          width: 20,
          type: "number",
          selector: { class: "kt-checkbox--solid" },
          textAlign: "center",
        },
        {
          field: "username",
          title: "Name",
          width: 90,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row.firstname +
              " " +
              row.lastname +
              "</span>"
            );
          },
        },
        {
          field: "email",
          title: "Email",
          width: 160,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row.email +
              "</span>"
            );
          },
        },
        {
          field: "department",
          title: "Department",
          width: 100,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row.department +
              "</span>"
            );
          },
        },
        {
          field: "designation",
          title: "Designation",
          width: 80,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row.designation +
              "</span>"
            );
          },
        },
        {
          field: "mobile",
          title: "Mobile No.",
          width: 110,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row.mobile +
              "</span>"
            );
          },
        },
        {
          field: "status",
          title: "Status",
          width: 100,
          template: function (row) {
            if (row.approvalStatus == 0) {
              return '<span class="kt-label-font-color-3 kt-font-bold">Pending</span>';
            } else {
              return '<span class="kt-label-font-color-3 kt-font-bold">Approved</span>';
            }
          },
        },
        {
          field: "Actions",
          title: "Actions",
          sortable: false,
          width: 80,
          overflow: "visible",
          textAlign: "center",
          autoHide: false,
          template: function (row) {
            if (row.approvalStatus == 0) {
              return (
                '<div class="row action_btn_row">\
                                <a data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="approve_btn" title="Approve User">\
                                    <i class="la la-check"></i>\
                                </a>\
                                <a data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="reject_btn" title="Reject User">\
                                    <i class="la la-close"></i>\
                                </a>\
                            </div>\
                    '
              );
            } else {
              return "";
            }
          },
        },
      ],
    });

    $("#kt_form_status").on("change", function () {
      //alert($(this).val());
      datatable.search("Pending", "status");
      //datatable.reload();
    });

    function approveUser(row) {
      //console.log(row)
    }

    function showProgress() {
      $(".display-loader").addClass("show");
    }

    function hideProgress() {
      $(".display-loader").removeClass("show");
    }

    $("#kt_recent_orders").on("click", "tbody #approve_btn", function (e) {
      $.confirm({
        title: "Approve user?",
        boxWidth: "40%",
        content: "Are you sure you want to do this?",
        autoClose: "cancelAction|8000",
        buttons: {
          deleteUser: {
            text: "Yes",
            action: function () {
              showProgress();
              let id = e.currentTarget.getAttribute("data-id");
              let options = {};
              options.id = id;
              $.when($.post("/approveUser", options)).done(function (_res) {
                //console.log(_res)
                hideProgress();
                if (_res.result == "success") {
                  PNotify.success({
                    title: "Success!",
                    text: "User Approved Successfully!",
                  });
                  datatable.reload();
                  //   location.reload()
                } else {
                  PNotify.error({
                    title: "Error",
                    text: _res.msg,
                  });
                }
              });
            },
          },
          cancelAction: function () {
            PNotify.notice({
              title: "Notice",
              text: "User has cancelled the request",
            });
          },
        },
      });
    });

    // $("#approve_btn").on("click", function (e) {
    //     e.preventDefault()
    //     console.log(e)
    // })

    $("#kt_form_type").on("change", function () {
      datatable.search($(this).val().toLowerCase(), "type");
    });

    $("#kt_form_status,#kt_form_type").selectpicker();

    // Reload datatable layout on aside menu toggle
    if (
      KTLayout.getAsideSecondaryToggler &&
      KTLayout.getAsideSecondaryToggler()
    ) {
      KTLayout.getAsideSecondaryToggler().on("toggle", function () {
        datatable.redraw();
      });
    }

    // Fix datatable layout in tabs
    datatable
      .closest(".kt-content__body")
      .find('[data-toggle="tab"]')
      .on("shown.bs.tab", function (e) {
        datatable.redraw();
      });
  };

  var landRecordsInit = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    if ($("#show_land_records").length === 0) {
      return;
    }

    var datatable = $("#show_land_records").KTDatatable({
      // datasource definition
      data: {
        type: "remote",
        source: {
          read: {
            url: domain + "/listLandRecords?id=" + user._id,
            method: "GET",
          },
        },
        pageSize: 10,
        serverPaging: true,
        serverFiltering: false,
        serverSorting: true,
      },

      // layout definition
      layout: {
        scroll: true,
        footer: false,
        height: 430,
      },

      // column sorting
      sortable: true,

      pagination: true,

      search: {
        input: $("#kt_search"),
      },

      // columns definition
      columns: [
        {
          field: "id",
          title: "#",
          sortable: false,
          width: 20,
          type: "number",
          selector: { class: "kt-checkbox--solid" },
          textAlign: "center",
        },
        {
          field: "application_id",
          title: "Application ID",
          width: 120,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row._id +
              "</span>"
            );
          },
        },
        {
          field: "certificate_type",
          title: "Certificate Type",
          width: 150,
          template: function (row) {
            console.log(row);
            var c_type = row.certificate_type;
            var c_val = "";
            if (c_type == 0) {
              c_val = "Offer Letter";
            } else if (c_type == 1) {
              c_val = "Digital Land Title Certificate";
            } else if (c_type == 2) {
              c_val = "Certificate of Customary Right of Ownership";
            } else if (c_type == 3) {
              c_val = "Non Digital Land Title Certificate";
            } else if (c_type == 4) {
              c_val = globals.RL;
            }
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              c_val +
              "</span>"
            );
          },
        },
        {
          field: "certificate_id",
          title: "Certificate ID",
          width: 120,
          template: function (row) {
            var certi_no;
            if (row.certificate_no != "") {
              certi_no = row.certificate_no;
            } else {
              certi_no = "To be Generated";
            }
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              certi_no +
              "</span>"
            );
          },
        },
        {
          field: "owner_name",
          title: "Owner Name",
          width: 140,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              user.firstname +
              " " +
              user.middlename +
              " " +
              user.lastname +
              "</span>"
            );
          },
        },
        {
          field: "status",
          title: "Status",
          width: 100,
          template: function (row) {
            var status = "";
            if (row.approvalStatus == 0) {
              status = "Pending for Town Planner";
            } else if (row.approvalStatus == 2) {
              if (row.by == 1) {
                status = "Rejected by Town Planner";
              } else if (row.by == 2) {
                status = "Rejected by Land Officer";
              } else if (row.by == 3) {
                status = "Rejected by Surveyor";
              } else if (row.by == 4) {
                status = "Rejected by Registrar";
              }
            } else if (row.approvalStatus == 1) {
              status = "Approved";
            } else if (row.approvalStatus == 3) {
              status = "Pending for Land Officer";
            } else if (row.approvalStatus == 4) {
              status = "Pending for Registrar";
            } else if (row.approvalStatus == 6) {
              status = "Forward for Survey";
            } else if (row.approvalStatus == 7) {
              status = "Pending for Land Officer";
            } else if (row.approvalStatus == -1) {
              status = "Save as Draft";
            } else if (row.approvalStatus == 5) {
              if (row.progressIn == 1) {
                status = "InProgress - Town Planner";
              } else if (row.progressIn == 2) {
                status = "InProgress - Land Officer";
              } else if (row.progressIn == 3) {
                status = "InProgress - Surveyor";
              } else if (row.progressIn == 4) {
                status = "InProgress - Registrar";
              }
            } else {
              status = "Pending";
            }

            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              status +
              "</span>"
            );
          },
        },
        {
          field: "created_at",
          title: "Created At",
          width: 200,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              moment(row.time_stamp).format("llll")
            );
            +"</span>";
          },
        },
        {
          field: "Actions",
          title: "Actions",
          sortable: false,
          width: 80,
          overflow: "visible",
          textAlign: "center",
          autoHide: false,
          template: function (row) {
            var id = row._id;
            console.log();
            if (row.approvalStatus == -1) {
              return (
                '<div class="row action_btn_row">\
                                <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                    <i class="la la-eye"></i>\
                                </a>\
                                <a  data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="edit_land_record" title="Edit Details">\
                                    <i class="la la-pencil"></i>\
                                </a>\
                            </div>\
                    '
              );
            } else if (row.approvalStatus == 1) {
              return (
                '<div class="row action_btn_row">\
                            <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                <i class="la la-eye"></i>\
                            </a>\
                            <a data-id="' +
                row._id +
                '" data-by="' +
                row.by +
                '" data-isSurvey="' +
                row.isSurveyApproved +
                '" data-comment="' +
                row.comment +
                '" data-comment2="' +
                row.comment2 +
                '" data-comment3="' +
                row.comment3 +
                '" data-comment4="' +
                row.comment4 +
                '" data-status="' +
                row.approvalStatus +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="show_comment" title="Show Comment">\
                        <i class="la la-comments"></i>\
                    </a>\
                    <a download href="' +
                domain +
                "/" +
                row.certificate_details?.file_path +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="download_cert" title="Download Certificate">\
                        <i class="la la-certificate"></i>\
                    </a>\
                        </div>\
                    '
              );
            } else if (row.approvalStatus == 2) {
              return (
                '<div class="row action_btn_row">\
                        <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                            <i class="la la-eye"></i>\
                        </a>\
                        <a data-id="' +
                row._id +
                '" data-by="' +
                row.by +
                '" data-isSurvey="' +
                row.isSurveyApproved +
                '" data-comment="' +
                row.comment +
                '" data-comment2="' +
                row.comment2 +
                '" data-comment3="' +
                row.comment3 +
                '" data-comment4="' +
                row.comment4 +
                '" data-status="' +
                row.approvalStatus +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="show_comment" title="Show Comment">\
                    <i class="la la-comments"></i>\
                </a>\
                    </div>\
            '
              );
            } else {
              return (
                '<div class="row action_btn_row">\
                                <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                    <i class="la la-eye"></i>\
                                </a>\
                            </div>\
                    '
              );
            }
          },
        },
      ],
    });

    $("#show_land_records").on("click", "tbody #show_comment", function (e) {
      var row = $(this).data("comment");
      var status = $(this).data("status");
      var by = $(this).data("by");
      var isSurvey = $(this).data("isSurvey");
      if (status == 2) {
        $("#preview_details_title").html("Comments");
        if (by == 1) {
          $(".commissioner_hide").hide();
          $(".surveyour_hide").hide();
          $(".verifier_two_hide").hide();
          $(".verifier_show_hide").show();
        } else if (by == 2) {
          $(".commissioner_hide").hide();
          $(".surveyour_hide").hide();
          $(".verifier_two_hide").show();
          $(".verifier_show_hide").show();
        } else if (by == 3) {
          $(".commissioner_hide").hide();
          $(".surveyour_hide").show();
          $(".verifier_two_hide").show();
          $(".verifier_show_hide").show();
        } else if (by == 4) {
          if (isSurvey == 1) {
            $(".commissioner_hide").show();
            $(".surveyour_hide").show();
            $(".verifier_two_hide").show();
            $(".verifier_show_hide").show();
          } else {
            $(".commissioner_hide").show();
            $(".surveyour_hide").hide();
            $(".verifier_two_hide").show();
            $(".verifier_show_hide").show();
          }
        }
      } else {
        $("#preview_details_title").html("Comments");
      }

      var row = $(this).data("id");
      var html = "",
        html2 = "",
        html3 = "";
      $.each(globals.VERIFIER_ONE, (key, value) => {
        html +=
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
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
      });

      $.each(globals.VERIFIER_TWO, (key, value) => {
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
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
      });

      $.each(globals.COMMISSIONER, (key, value) => {
        html3 +=
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
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
      });
      $(".questions_ol").html(html);
      $(".questions_ol_two").html(html2);
      $(".questions_ol_three").html(html3);
      if ($(this).data("comment") == "undefined") {
        $(".verifier_one_hide").hide();
      } else {
        $(".verifier_one_hide").show();
      }
      if ($(this).data("comment2") == "undefined") {
        $(".verifier_two_hide").hide();
      } else {
        $(".verifier_two_hide").show();
      }
      if ($(this).data("comment3") == "undefined") {
        $(".surveyour_hide").hide();
      } else {
        $(".surveyour_hide").show();
      }
      if ($(this).data("comment4") == "undefined") {
        $(".commissioner_hide").hide();
      } else {
        $(".commissioner_hide").show();
      }
      $("#comment_text").val($(this).data("comment"));
      $("#comment_two_text").val($(this).data("comment2"));
      $("#survey_comment_text").val($(this).data("comment3"));
      $("#comment_three_text").val($(this).data("comment4"));
      $("#reject_comment_text").val(row);
      $("#comment_modal").modal("toggle");
    });

    function detailsone(data) {
      var c_type = data.certificate_type;
      var c_val = "";
      if (c_type == 0) {
        $("#preview_certificate_type").html("Offer Letter");
      } else if (c_type == 1) {
        $("#preview_certificate_type").html("Digital Land Title Certificate");
      } else if (c_type == 2) {
        $("#preview_certificate_type").html(
          "Certificate of Customary Right of Ownership"
        );
      } else if (c_type == 3) {
        $("#preview_certificate_type").html(
          "Non Digital Land Title Certificate"
        );
      } else if (c_type == 4) {
        $("#preview_certificate_type").html(globals.RL);
      }

      var has_certi = data.isExtraApprovalRequired;
      if (has_certi == 0) {
        $("#preview_has_certificate, #preview_has_certificate_text").html("No");
      } else if (has_certi == 1) {
        $("#preview_has_certificate, #preview_has_certificate_text").html(
          "Yes"
        );
      }

      var c_no = data.certificate_no;
      $("#preview_certificate_no, #preview_certificate_no_text").html(c_no);
    }

    function detailstwo(data) {
      $("#preview_block_no").html(data.block_no);

      var dist_data, rgn_data, ward_data;
      $.when($.get("/getSingleRegion?id=" + data.region)).done(function (_res) {
        rgn_data = _res.data[0];
        $("#preview_region").html(rgn_data.name);
      });

      $.when($.get("/getSingleDistrict?id=" + data.district)).done(function (
        _res
      ) {
        dist_data = _res.data[0];
        $("#preview_district").html(dist_data.name);
      });

      $.when($.get("/getSingleWard?id=" + data.ward_no)).done(function (_res) {
        ward_data = _res.data[0];
        console.log(ward_data);
        $("#preview_ward_no").html(ward_data.name);
      });

      $("#preview_plot_no").html(data.plot_no);
      $("#preview_location").html(data.location);
      $("#preview_address").html(data.address);
      $("#preview_feature").html(data.land_feature);
      $("#preview_height").html(data.land_height);
      $("#preview_width").html(data.land_width);
      $("#preview_area").html(data.land_area);
      $("#preview_lat").html(data.land_lat);
      $("#preview_long").html(data.land_long);
      $("#preview_marked_area").html(data.marked_area);
      $("#preview_village").html(data.village);
      $("#preview_kitongoji").html(data.kitongoji);
      $("#preview_npnorth").html(data.npnorth);
      $("#preview_npsouth").html(data.npsouth);
      $("#preview_npeast").html(data.npeast);
      $("#preview_npwest").html(data.npwest);
    }
    function detailsthree(data) {
      $(".commer_type").hide();
      $(".resi_type").hide();
      //$('#preview_purpose_type').html($(".purpose_select:checked").val())

      if (data.land_purpose_type == 0) {
        $("#preview_purpose_type").html("Residential");
        var r_type = data.land_purpose;
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
      if (data.land_purpose_type == 1) {
        $(".commer_type").show();
        $("#preview_purpose_type").html("Commercial");
        var co_type = data.land_purpose;

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
    }
    function detailsfour(data) {
      var o_type = data.ownership_type;
      if (o_type == 0) {
        $("#preview_ownership_type").html("Owner/Applicant");
      } else if (o_type == 1) {
        $("#preview_ownership_type").html("Group");
      } else if (o_type == 2) {
        $("#preview_ownership_type").html("Group with shares");
      } else if (o_type == 3) {
        $("#preview_ownership_type").html("Corporation");
      } else if (o_type == 4) {
        $("#preview_ownership_type").html("Owner with guardian");
      } else if (o_type == 5) {
        $("#preview_ownership_type").html("Customary");
      }

      var c_type = data.certificate_type;
      if (c_type == 4) {
        $("#preview_lease_term").html(data.lease_term);
      } else if (c_type == 2) {
        $("#preview_lease_term").html(data.lease_term);
      } else {
        var l_term = data.lease_term;
        $("#preview_lease_term").html(data.lease_term);
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

      var l_type = data.lease_term_type;
      if (l_type == 0) {
        $("#preview_lease_type").html("Mda Maalumu");
        $("#preview_term_years").html(data.lease_term);
      } else if (l_type == 1) {
        $("#preview_lease_type").html("Hakuna Mda Maalumu");
        $("#preview_term_years").html("N/A");
      }

      $("#preview_lease_start_date").html(data.lease_start_date);
      var html = "";
      data.users_profile.map(function (users, index) {
        console.log();
        var genderapplicant = users.gender;
        var gender_applicant_val = "";
        if (genderapplicant == 0) {
          gender_applicant_val = "Male";
        } else if (genderapplicant == 1) {
          gender_applicant_val = "Female";
        } else if (genderapplicant == 2) {
          gender_applicant_val = "Other";
        }

        var maritialapplicant = users.maritial_status;
        var maritial_applicant_val = "";
        if (maritialapplicant == 0) {
          maritial_applicant_val = "Single";
        } else if (maritialapplicant == 1) {
          maritial_applicant_val = "Married";
        } else if (maritialapplicant == 2) {
          maritial_applicant_val = "Divorced";
        }
        var appli_id = "";
        var nationalityapplicant = users.nationality_select;
        var nationality_applicant_val = "";
        if (nationalityapplicant == 0) {
          appli_id = "Nationality ID";
          nationality_applicant_val = "Tanzanian";
        } else if (nationalityapplicant == 1) {
          nationality_applicant_val = "Non-Tanzanian";
          appli_id = "Investor ID";
        }
        if (o_type == 0) {
          var heading_text = "";

          if (index == 0) {
            heading_text = "Applicant";
          } else {
            heading_text = "Spouse";
          }
          var display = "";
          if (index == 1) {
            display = "display: none;";
          } else {
            display = "display: block;";
          }

          html +=
            ' <div class="kt-heading kt-heading--md">' +
            heading_text +
            '</div>\
                <div class="row">\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">First Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_first_name">' +
            users.firstname +
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
            users.middlename +
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
            users.lastname +
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
            users.leveledu +
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
            users.birthdate +
            '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6" style="' +
            display +
            ' ">\
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
            users.employment +
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
            users.residence +
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
            users.unique_id +
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
            users.phone_no +
            "</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>";
        } else if (o_type == 4) {
          var heading_text = "";
          if (index == 0) {
            heading_text = "Owner";
          } else {
            heading_text = "Guardian";
          }

          var display = "";
          if (index == 0) {
            display = "display: none;";
          } else {
            display = "display: block;";
          }

          html +=
            ' <div class="kt-heading kt-heading--md">' +
            heading_text +
            '</div><div class="row">\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">First Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_first_name">' +
            users.firstname +
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
            users.middlename +
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
            users.lastname +
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
            users.leveledu +
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
            users.birthdate +
            '</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-lg-6" style="' +
            display +
            '">\
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
            users.employment +
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
            users.residence +
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
            users.unique_id +
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
            users.phone_no +
            "</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>";
        } else {
          html +=
            ' <div class="kt-heading kt-heading--md">Owner -' +
            (index + 1) +
            '</div><div class="row">\
                    <div class="col-lg-6">\
                        <div class="form-group row">\
                            <div class="lbl_width">\
                                <label class="preview_heading">First Name:</label>\
                            </div>\
                            <div class="spn_width">\
                                <span class="preview_content" id="preview_first_name">' +
            users.firstname +
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
            users.middlename +
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
            users.lastname +
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
            users.leveledu +
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
            users.birthdate +
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
            users.employment +
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
            users.residence +
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
            users.unique_id +
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
            users.phone_no +
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
            users.share_value +
            "</span>\
                        </div>\
                    </div>\
                </div>\
                </div>";
        }
      });
      $(".preview_user_data").html(html);
    }
    function detailsfive(data) {
      var html1 = "";
      if (data.upload_title) {
        if (data.upload_title.length > 0) {
          data.upload_title.map(function (upload) {
            console.log(upload);
            html1 +=
              ' <div class="row">\
                <div class="col-lg-12">\
                    <div class="form-group">\
                        <label class="preview_heading">Document Name: ' +
              upload.filename +
              '</label>\
                        <span class="preview_content" id="preview_upload_title"><a href="' +
              ipfsurl +
              "/ipfs/" +
              upload.filehash +
              '" target="_blank">' +
              upload.filehash +
              "</a></span>\
                    </div>\
                </div>\
                </div>";
          });
          $(".preview_upload_data").html(html1);
        }
      }
    }

    $("#show_land_records").on(
      "click",
      "tbody #view_full_details",
      function (e) {
        e.preventDefault();
        var id = e.currentTarget.getAttribute("data-id");
        $("#land_id_s").val(id);
        $.when($.get("/getSingalLand?id=" + id)).done(function (_res) {
          var data = _res.data[0];
          // console.log(_res.data[0].address);
          console.log(_res.data[0]);
          $("#preview_user_data").val(JSON.stringify(_res.data));
          $("#preview_user_id").val(data._id);
          $("#map_zoom").val(data.zoom_level);
          $("#lat_input").val(data.land_lat);
          $("#lng_input").val(data.land_long).trigger("change");
          $("#array_lat_lng")
            .val(JSON.stringify(data.land_markers))
            .trigger("change");
          var c_type = data.certificate_type;

          if (c_type == 0) {
            $(".digi_div").show();
            $(".nondigi_div").hide();
          } else if (c_type == 1) {
            $(".digi_div").show();
            $(".nondigi_div").hide();
          } else if (c_type == 2) {
            $(".digi_div").hide();
            $(".nondigi_div").show();
          } else if (c_type == 3) {
            $(".digi_div").show();
            $(".nondigi_div").hide();
          } else if (c_type == 4) {
            $(".digi_div").show();
            $(".nondigi_div").hide();
          }

          $("#headingOne3").on("click", function () {
            detailsone(data);
          });

          $("#headingTwo3").on("click", function () {
            detailstwo(data);
          });

          $("#headingThree3").on("click", function () {
            detailsthree(data);
          });

          $("#headingFour3").on("click", function () {
            detailsfour(data);
          });

          $("#headingFive3").on("click", function () {
            detailsfive(data);
          });

          $("#preview_details").modal("toggle");
          $("#preview_print_btn").click(function () {
            var land_id = $("#land_id_s").val();
            window.open("pdfdetailsgeneral.html?id=" + land_id, "_blank");
          });
        });
      }
    );

    $("#show_land_records").on(
      "click",
      "tbody #edit_land_record",
      function (e) {
        e.preventDefault();
        let id = e.currentTarget.getAttribute("data-id");
        location.href = "editgeneral.html?id=" + id;
      }
    );

    $("#kt_form_status").on("change", function () {
      //alert($(this).val());
      datatable.search($(this).val(), "status");
      //datatable.reload();
    });

    function approveUser(row) {
      //console.log(row)
    }

    function showProgress() {
      $(".display-loader").addClass("show");
    }

    function hideProgress() {
      $(".display-loader").removeClass("show");
    }

    $("#kt_form_type").on("change", function () {
      datatable.search($(this).val().toLowerCase(), "type");
    });

    $("#kt_form_status,#kt_form_type").selectpicker();

    // Reload datatable layout on aside menu toggle
    if (
      KTLayout.getAsideSecondaryToggler &&
      KTLayout.getAsideSecondaryToggler()
    ) {
      KTLayout.getAsideSecondaryToggler().on("toggle", function () {
        datatable.redraw();
      });
    }

    // Fix datatable layout in tabs
    datatable
      .closest(".kt-content__body")
      .find('[data-toggle="tab"]')
      .on("shown.bs.tab", function (e) {
        datatable.redraw();
      });
  };

  var govlandRecordsInit = function () {
    var user = JSON.parse(sessionStorage.userData)[0];
    if ($("#show_gov_land_records").length === 0) {
      return;
    }

    var datatable = $("#show_gov_land_records").KTDatatable({
      // datasource definition
      data: {
        type: "remote",
        source: {
          read: {
            url: domain + "/listLandRecords?id=" + user._id,
            method: "GET",
          },
        },
        pageSize: 10,
        serverPaging: true,
        serverFiltering: false,
        serverSorting: true,
      },

      // layout definition
      layout: {
        scroll: true,
        footer: false,
        height: 430,
      },

      // column sorting
      sortable: true,

      pagination: true,

      search: {
        input: $("#kt_search"),
      },

      // columns definition
      columns: [
        {
          field: "id",
          title: "#",
          sortable: false,
          width: 20,
          type: "number",
          selector: { class: "kt-checkbox--solid" },
          textAlign: "center",
        },
        {
          field: "application_id",
          title: "Application ID",
          width: 160,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              row._id +
              "</span>"
            );
          },
        },
        {
          field: "certificate_id",
          title: "Certificate ID",
          width: 150,
          template: function (row) {
            var certi_no;
            if (row.certificate_no != "") {
              certi_no = row.certificate_no;
            } else {
              certi_no = "To be Generated";
            }
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              certi_no +
              "</span>"
            );
          },
        },
        {
          field: "status",
          title: "Status",
          width: 130,
          template: function (row) {
            var status = "";
            if (row.approvalStatus == 0) {
              status = "Pending for Town Planner";
            } else if (row.approvalStatus == 2) {
              if (row.by == 1) {
                status = "Rejected by Town Planner";
              } else if (row.by == 2) {
                status = "Rejected by Land Officer";
              } else if (row.by == 3) {
                status = "Rejected by Surveyor";
              } else if (row.by == 4) {
                status = "Rejected by Registrar";
              }
            } else if (row.approvalStatus == 1) {
              status = "Approved";
            } else if (row.approvalStatus == 3) {
              status = "Pending for Land Officer";
            } else if (row.approvalStatus == 4) {
              status = "Pending for Registrar";
            } else if (row.approvalStatus == 6) {
              status = "Forward for Survey";
            } else if (row.approvalStatus == 7) {
              status = "Pending for Land Officer";
            } else if (row.approvalStatus == -1) {
              status = "Save as Draft";
            } else if (row.approvalStatus == 5) {
              if (row.progressIn == 1) {
                status = "InProgress - Town Planner";
              } else if (row.progressIn == 2) {
                status = "InProgress - Land Officer";
              } else if (row.progressIn == 3) {
                status = "InProgress - Surveyor";
              } else if (row.progressIn == 4) {
                status = "InProgress - Registrar";
              }
            } else {
              status = "Pending";
            }

            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              status +
              "</span>"
            );
          },
        },
        {
          field: "created_at",
          title: "Created At",
          width: 200,
          template: function (row) {
            return (
              '<span class="kt-label-font-color-3 kt-font-bold">' +
              moment(row.time_stamp).format("llll")
            );
            +"</span>";
          },
        },
        {
          field: "Actions",
          title: "Actions",
          sortable: false,
          width: 80,
          overflow: "visible",
          textAlign: "center",
          autoHide: false,
          template: function (row) {
            if (row.approvalStatus == -1) {
              return (
                '<div class="row action_btn_row">\
                                <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                    <i class="la la-eye"></i>\
                                </a>\
                                <a  data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="edit_land_record" title="Edit Details">\
                                    <i class="la la-pencil"></i>\
                                </a>\
                            </div>\
                    '
              );
            } else if (row.approvalStatus == 1) {
              return (
                '<div class="row action_btn_row">\
                                <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                    <i class="la la-eye"></i>\
                                </a>\
                                <a data-id="' +
                row._id +
                '" data-by="' +
                row.by +
                '" data-isSurvey="' +
                row.isSurveyApproved +
                '" data-comment="' +
                row.comment +
                '" data-comment2="' +
                row.comment2 +
                '" data-comment3="' +
                row.comment3 +
                '" data-comment4="' +
                row.comment4 +
                '" data-status="' +
                row.approvalStatus +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="show_comment" title="Show Comment">\
                            <i class="la la-comments"></i>\
                        </a>\
                        <a download href="' +
                domain +
                "/" +
                row.certificate_details?.file_path +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="download_cert" title="Download Certificate">\
                        <i class="la la-certificate"></i>\
                    </a>\
                            </div>\
                    '
              );
            } else if (row.approvalStatus == 2) {
              return (
                '<div class="row action_btn_row">\
                                <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                    <i class="la la-eye"></i>\
                                </a>\
                                <a data-id="' +
                row._id +
                '" data-by="' +
                row.by +
                '" data-isSurvey="' +
                row.isSurveyApproved +
                '" data-comment="' +
                row.comment +
                '" data-comment2="' +
                row.comment2 +
                '" data-comment3="' +
                row.comment3 +
                '" data-comment4="' +
                row.comment4 +
                '" data-status="' +
                row.approvalStatus +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="show_comment" title="Show Comment">\
                            <i class="la la-comments"></i>\
                        </a>\
                            </div>\
                    '
              );
            } else {
              return (
                '<div class="row action_btn_row">\
                                <a data-all= "' +
                row +
                '" data-id="' +
                row._id +
                '" class="btn btn-clean btn-icon btn-sm btn-icon-md"  id="view_full_details" title="View Full Details" >\
                                    <i class="la la-eye"></i>\
                                </a>\
                            </div>\
                    '
              );
            }
          },
        },
      ],
    });

    $("#show_gov_land_records").on(
      "click",
      "tbody #edit_land_record",
      function (e) {
        var row = $(this).data("id");
        location.href = "editgov.html?id=" + row;
      }
    );

    $("#show_gov_land_records").on(
      "click",
      "tbody #show_comment",
      function (e) {
        var row = $(this).data("comment");
        var status = $(this).data("status");
        var by = $(this).data("by");
        var isSurvey = $(this).data("isSurvey");
        if (status == 2) {
          $("#preview_details_title").html("Comments");
          if (by == 1) {
            $(".commissioner_hide").hide();
            $(".surveyour_hide").hide();
            $(".verifier_two_hide").hide();
            $(".verifier_show_hide").show();
          } else if (by == 2) {
            $(".commissioner_hide").hide();
            $(".surveyour_hide").hide();
            $(".verifier_two_hide").show();
            $(".verifier_show_hide").show();
          } else if (by == 3) {
            $(".commissioner_hide").hide();
            $(".surveyour_hide").show();
            $(".verifier_two_hide").show();
            $(".verifier_show_hide").show();
          } else if (by == 4) {
            if (isSurvey == 1) {
              $(".commissioner_hide").show();
              $(".surveyour_hide").show();
              $(".verifier_two_hide").show();
              $(".verifier_show_hide").show();
            } else {
              $(".commissioner_hide").show();
              $(".surveyour_hide").hide();
              $(".verifier_two_hide").show();
              $(".verifier_show_hide").show();
            }
          }
        } else {
          $("#preview_details_title").html("Comments");
        }

        var row = $(this).data("id");
        var html = "",
          html2 = "",
          html3 = "";
        $.each(globals.VERIFIER_ONE, (key, value) => {
          html +=
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
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
        });

        $.each(globals.VERIFIER_TWO, (key, value) => {
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
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
        });

        $.each(globals.COMMISSIONER, (key, value) => {
          html3 +=
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
                        <input id="certificate_no_question" checked disabled name="question_check" type="checkbox">\
                        <span></span>\
                    </label>\
                </div>\
            </div>\
        </li>';
        });
        $(".questions_ol").html(html);
        $(".questions_ol_two").html(html2);
        $(".questions_ol_three").html(html3);
        $("#comment_text").val($(this).data("comment"));
        $("#comment_two_text").val($(this).data("comment2"));
        $("#survey_comment_text").val($(this).data("comment3"));
        $("#comment_three_text").val($(this).data("comment4"));
        $("#reject_comment_text").val(row);
        $("#comment_modal").modal("toggle");
      }
    );

    function certificateData(data) {
      var has_certi = data.isExtraApprovalRequired;
      if (has_certi == 0) {
        $("#preview_has_certificate").html("No");
      } else if (has_certi == 1) {
        $("#preview_has_certificate").html("Yes");
      }
      certificateData;

      var c_no = data.certificate_no;
      $("#preview_certificate_no").html(c_no);
    }

    function certificateDatatwo(data) {
      var dist_data, rgn_data, ward_data;
      $.when($.get("/getSingleRegion?id=" + data.region)).done(function (_res) {
        rgn_data = _res.data[0];
        $("#preview_region").html(rgn_data.name);
      });

      $.when($.get("/getSingleDistrict?id=" + data.district)).done(function (
        _res
      ) {
        dist_data = _res.data[0];
        $("#preview_district").html(dist_data.name);
      });

      $.when($.get("/getSingleWard?id=" + data.ward_no)).done(function (_res) {
        ward_data = _res.data[0];
        console.log(ward_data);
        $("#preview_ward_no").html(ward_data.name);
      });

      // $('#preview_region').html(rgn_data.name)
      $("#preview_block_no").html(data.block_no);
      // $('#preview_district').html(dist_data.name)
      // $('#preview_ward_no').html(ward_data.name)
      $("#preview_plot_no").html(data.plot_no);
      $("#preview_location").html(data.location);
      $("#preview_address").html(data.address);
      $("#preview_feature").html(data.land_feature);
      $("#preview_height").html(data.land_height);
      $("#preview_width").html(data.land_width);
      $("#preview_area").html(data.land_area);
      $("#preview_lat").html(data.land_lat);
      $("#preview_long").html(data.land_long);
      $("#preview_marked_area").html(data.marked_area);
      $("#preview_village").html(data.village);
      $("#preview_kitongoji").html(data.kitongoji);
      $("#preview_npnorth").html(data.npnorth);
      $("#preview_npsouth").html(data.npsouth);
      $("#preview_npeast").html(data.npeast);
      $("#preview_npwest").html(data.npwest);
    }

    function certificateDataThree(data) {
      if (data.land_purpose == 0) {
        $("#preview_purpose_type").html("Housing");
      } else if (data.land_purpose == 1) {
        $("#preview_purpose_type").html("Government Farming");
      } else if (data.land_purpose == 2) {
        $("#preview_purpose_type").html("Police");
      } else if (data.land_purpose == 3) {
        $("#preview_purpose_type").html("Hospital");
      } else if (data.land_purpose == 4) {
        $("#preview_purpose_type").html("Forest");
      } else if (data.land_purpose == 5) {
        $("#preview_purpose_type").html("National Parks");
      } else if (data.land_purpose == 6) {
        $("#preview_purpose_type").html("Mineral Areas");
      } else if (data.land_purpose == 7) {
        $("#preview_purpose_type").html("Government Institutions Authorities");
      } else if (data.land_purpose == 8) {
        $("#preview_purpose_type").html("Others");
      }
    }

    function certificateDataFive(data) {
      var html1 = "";
      if (data.upload_title) {
        if (data.upload_title.length > 0) {
          data.upload_title.map(function (upload) {
            console.log(upload);
            html1 +=
              ' <div class="row">\
                        <div class="col-lg-12">\
                            <div class="form-group">\
                                <label class="preview_heading">Document Name: ' +
              upload.filename +
              '</label>\
                                <span class="preview_content" id="preview_upload_title"><a href="' +
              ipfsurl +
              "/ipfs/" +
              upload.filehash +
              '" target="_blank">' +
              upload.filehash +
              "</a></span>\
                            </div>\
                        </div>\
                        </div>";
          });
          $(".preview_upload_data").html(html1);
        }
      }
    }

    function certificateDataFour(data) {
      $("#preview_ownership_type").html(data.ownership_details);
    }

    $("#show_gov_land_records").on(
      "click",
      "tbody #view_full_details",
      function (e) {
        e.preventDefault();
        var row = $(this).data("id");
        console.log(row);
        $.when($.get("/getSingalLand?id=" + row)).done(function (_res) {
          var data = _res.data[0];
          // console.log(_res.data[0].address);
          console.log(_res.data[0]);
          $("#preview_user_data").val(JSON.stringify(data));
          $("#preview_user_id").val(data._id);
          $("#map_zoom").val(data.zoom_level);
          $("#lat_input,#lat_input_text").val(data.land_lat);
          $("#lng_input,#lng_input_text").val(data.land_long).trigger("change");
          $("#array_lat_lng,#array_lat_lng_text")
            .val(JSON.stringify(data.land_markers))
            .trigger("change");
          $("#headingOne3").on("click", function () {
            certificateData(data);
          });

          $("#preview_print_btn").click(function () {
            window.open("pdfdetails.html?id=" + row, "_blank");
          });

          $("#headingTwo3").on("click", function () {
            certificateDatatwo(data);
          });

          $("#headingThree3").on("click", function () {
            certificateDataThree(data);
          });

          $("#headingFour3").on("click", function () {
            certificateDataFour(data);
          });

          $("#headingFive3").on("click", function () {
            certificateDataFive(data);
          });

          $("#preview_details").modal("toggle");
        });
      }
    );

    $("#kt_form_status").on("change", function () {
      //alert($(this).val());
      datatable.search($(this).val(), "status");
      //datatable.reload();
    });

    function approveUser(row) {
      //console.log(row)
    }

    function showProgress() {
      $(".display-loader").addClass("show");
    }

    function hideProgress() {
      $(".display-loader").removeClass("show");
    }

    // $('#kt_recent_orders').on('click', 'tbody #approve_btn', function (e) {

    //     $.confirm({
    //       title: 'Approve user?',
    //       boxWidth: '40%',
    //       content: 'Are you sure you want to do this?',
    //       autoClose: 'cancelAction|8000',
    //       buttons: {
    //         deleteUser: {
    //           text: 'Yes',
    //           action: function () {
    //             showProgress();
    //             let id = e.currentTarget.getAttribute('data-id');
    //               let options = {};
    //               options.id= id;
    //               $.when($.post('/approveUser', options)).done(function (_res) {
    //                   console.log(_res)
    //                   hideProgress();
    //                   if(_res.result == "success"){
    //                       PNotify.success({
    //                         title: 'Success!',
    //                         text: 'User Approved Successfully!'
    //                       });
    //                       datatable.reload()
    //                     //   location.reload()
    //                   } else {
    //                     PNotify.error({
    //                         title: 'Error',
    //                         text: _res.msg
    //                     });
    //                   }
    //               })
    //           }
    //         },
    //         cancelAction: function () {
    //             PNotify.notice({
    //                 title: 'Notice',
    //                 text: 'User has cancelled the request'
    //             });
    //         }
    //       }
    //     });
    // })

    // $("#approve_btn").on("click", function (e) {
    //     e.preventDefault()
    //     console.log(e)
    // })

    $("#kt_form_type").on("change", function () {
      datatable.search($(this).val().toLowerCase(), "type");
    });

    $("#kt_form_status,#kt_form_type").selectpicker();

    // Reload datatable layout on aside menu toggle
    if (
      KTLayout.getAsideSecondaryToggler &&
      KTLayout.getAsideSecondaryToggler()
    ) {
      KTLayout.getAsideSecondaryToggler().on("toggle", function () {
        datatable.redraw();
      });
    }

    // Fix datatable layout in tabs
    datatable
      .closest(".kt-content__body")
      .find('[data-toggle="tab"]')
      .on("shown.bs.tab", function (e) {
        datatable.redraw();
      });
  };

  return {
    init: function () {
      mediumCharts();

      latestProductsMiniCharts();
      daterangepickerInit();
      generalStatistics();
      recentOrdersInit();
      landRecordsInit();
      govlandRecordsInit();

      widgetTechnologiesChart();
      widgetTechnologiesChartGov();
      widgetTechnologiesChartuser();
      widgetTechnologiesChartAdminPending();
      widgetTechnologiesChartAdminApproved();
      widgetTechnologiesChartVerifierOnePending();
      widgetTechnologiesChartVerifierOneApproved();
      widgetTechnologiesChartVerifierOneRejected();
      widgetTechnologiesChartVerifierOneProgress();
      widgetTechnologiesChartVerifierTwoPending();
      widgetTechnologiesChartVerifierTwoApproved();
      widgetTechnologiesChartVerifierTwoRejected();
      widgetTechnologiesChartVerifierTwoProgress();
      widgetTechnologiesChartVerifierTwoForwared();
      widgetTechnologiesChartCommissionerPending();
      widgetTechnologiesChartCommissionerProgress();
      widgetTechnologiesChartCommissionerApproved();
      widgetTechnologiesChartCommissionerRejected();
      widgetTechnologiesChartSurveyourPending();
      widgetTechnologiesChartSurveyourProgress();
      widgetTechnologiesChartSurveyourApproved();
      widgetTechnologiesChartSurveyourRejected();
      widgetTechnologiesChart2();
      widgetTotalOrdersChart();
      widgetTotalOrdersChart2();

      widgetSalesStatisticsChart();
      widgetRevenueGrowthChart();
    },
  };
})();

// Class initialization
jQuery(document).ready(function () {
  KTDashboard.init();
});
