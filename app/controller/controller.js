"use strict";
const MongoClient = require("mongodb").MongoClient;
const Mongo = require("mongodb");
const assert = require("assert");
const fcntrl = require("./fabric-controller.js");
var { create } = require("ipfs-http-client");
var url = require("url");
const ipfs = create();
var fs = require("fs");
var Buffer = require("buffer/").Buffer;
const PDFDocument = require("pdfkit");
var host = process.env.HOST;
var ipfsHost = process.env.IPFS_HOST;

function connectDatabase() {
  const url = "mongodb://localhost:27017";
  const dbName = "landrecords";
  var db = "";
  console.log("connecting...");
  return new Promise(async (resolve, reject) => {
    try {
      let client = await MongoClient.connect(url);
      console.log("Connected successfully to server");
      db = client.db(dbName);
      resolve(db);
    } catch (err) {
      assert.equal(null, err);
    }
  });
}

// Getting Verifiers for email change

exports.getVerifiers = async function (req, res, next) {
  try {
    let con = await connectDatabase();
    const user = con.collection("users");

    let users = await user
      .find({
        $or: [
          { user_id: "townplanner" },
          { user_id: "landofficer" },
          { user_id: "surveyor" },
          { user_id: "registrar" },
        ],
      })
      .toArray();

    res.send({
      code: 200,
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.send({
      code: 100,
      msg: err,
    });
  }
};

// Forward land application to Surveyor

exports.forwardLandRecord = async function (req, res, next) {
  try {
    const { application_id, comment, user_id, surveyour_id, verifier_id } =
      req.body;
    var id = new Mongo.ObjectId(application_id);
    var userId = new Mongo.ObjectId(user_id);

    let con = await connectDatabase();
    const lands = con.collection("lands");
    const users = con.collection("users");
    const land_checklist = con.collection("land_checklist");

    var record = {
      approvalStatus: 6,
      comment2: comment,
      isSurveyApproved: 0,
    };

    await lands.updateOne({ _id: id }, { $set: record });

    let user = await users
      .find({
        $or: [{ _id: userId }, { user_id: surveyour_id }],
      })
      .toArray();

    var emails = [];
    if (user.length > 0) {
      emails.push(user[0].email, user[1].email, user[1].email2);

      emails.map(function (email, index) {
        var email = email;
        var subject = "Land Registry Demo: Land Application";
        var username, message;

        if (index == 0) {
          username = user[0].firstname + " " + user[0].lastname;
          message =
            "Hi <b>" +
            username +
            "</b><br><br><br> Your Land Application ID: " +
            application_id +
            " has being Sent for survey to Surveyor <br><br> Reason of Survey for this Application is:- <br>" +
            comment;
        } else {
          username = user[1].firstname + " " + user[1].lastname;
          message =
            "Hi <b>" +
            username +
            "</b><br><br><br> The Land Application With Application ID: " +
            application_id +
            " has being sent to take survey by Land Officer <br><br> <b>Reason of Survey for this Application is:-</b> <br>" +
            comment;
        }
        fcntrl.sendEmail(email, subject, message);

        if (index == emails.length - 1) {
          land_checklist.updateOne(
            { land_id: application_id, verifier_id: verifier_id },
            { $set: { status: 1 } }
          );
          res.send({
            code: 200,
            msg: "Application Sent for Survey Successfully",
          });
        }
      });
    }
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

// Reject a Land Record

exports.rejectLandRecord = async function (req, res, next) {
  try {
    const { application_id, by, comment, user_id, verifier_id } = req.body;
    var id = new Mongo.ObjectId(application_id);
    var userId = new Mongo.ObjectId(user_id);
    var verifier;
    if (by == "1") {
      verifier = "Town Planner";
    } else if (by == "2") {
      verifier = "Land Officer";
    } else if (by == "4") {
      verifier = "Registrar";
    } else if (by == "3") {
      verifier = "Surveyor";
    }

    let con = await connectDatabase();
    const lands = con.collection("lands");
    const users = con.collection("users");
    const land_checklist = con.collection("land_checklist");

    var record = {
      approvalStatus: 2,
      by: parseInt(by),
      rejected_date: new Date(),
    };

    if (by == "1") {
      record.comment = comment;
    } else if (by == "2") {
      record.comment2 = comment;
    } else if (by == "4") {
      record.comment4 = comment;
    } else if (by == "3") {
      record.comment3 = comment;
    }

    await lands.updateOne({ _id: id }, { $set: record });

    let user = await users.find({ _id: userId }).toArray();

    var email = user[0].email;
    var subject = "Land Registry Demo: Land Application Rejected";
    var message =
      "Hi " +
      user[0].firstname +
      " " +
      user[0].lastname +
      "<br><br><br> Your Land Application ID: " +
      application_id +
      " has being rejected by the " +
      verifier +
      "<br><br> Reason For Rejection of the Application is:- <br>" +
      comment;
    fcntrl.sendEmail(email, subject, message);
    land_checklist.updateOne(
      { land_id: application_id, verifier_id: verifier_id },
      { $set: { status: 1 } }
    );
    var data = {
      land_id: application_id,
      status: 2,
      comment: comment,
    };
    if (by == "1") {
      fcntrl.rejectedByVerifier1(data).then((result) => {
        res.send({
          code: 200,
          msg: "Application Rejected Successfully",
          result: result,
          approvalStatus: 2,
        });
      });
    } else if (by == "2") {
      fcntrl.rejectedByVerifier2(data).then((result) => {
        res.send({
          code: 200,
          msg: "Application Rejected Successfully",
          result: result,
          approvalStatus: 2,
        });
      });
    } else if (by == "3") {
      fcntrl.rejectedBySurveyor(data).then((result) => {
        res.send({
          code: 200,
          msg: "Application Rejected Successfully",
          result: result,
          approvalStatus: 2,
        });
      });
    } else if (by == "4") {
      fcntrl.rejectedByCommissioner(data).then((result) => {
        res.send({
          code: 200,
          msg: "Application Rejected Successfully",
          result: result,
          approvalStatus: 2,
        });
      });
    } else {
      res.send({
        code: 200,
        msg: "Application Rejected Successfully",
      });
    }
  } catch (error) {
    res.send({
      code: 101,
      msg: "Something went wrong! please try again.",
      err: err,
    });
  }
};

// Submit the application checklist

exports.submitChecklist = async function (req, res, next) {
  try {
    const {
      application_id,
      certificate_no,
      comment,
      status,
      user_id,
      send_verifier_id,
      by,
      verifier_id,
      from,
      draw_data,
      parcel_data,
    } = req.body;
    var id = new Mongo.ObjectId(application_id);
    var userId = new Mongo.ObjectId(user_id);

    let con = await connectDatabase();
    const lands = con.collection("lands");
    const users = con.collection("users");
    const land_checklist = con.collection("land_checklist");

    var record = {
      approvalStatus: parseInt(status),
    };

    var newCertiNo;
    if (from == "1") {
      record.comment = comment;
      record.approvedByone = 1;
      if (req.body.hasOwnProperty("extraDocs1")) {
        record.extraDocs1 = req.body.extraDocs1;
      }
    } else if (from == "2") {
      record.comment2 = comment;
      record.approvedBytwo = 1;
      if (req.body.hasOwnProperty("extraDocs")) {
        record.extraDocs = req.body.extraDocs;
      }
      if (req.body.certificateType == 2) {
        if (certificate_no == "") {
          newCertiNo = "CERT-" + Date.now().toString().substr(-6);
          record.certificate_no = newCertiNo;
        }
      }
    } else if (from == "4") {
      record.approvedByfour = 1;
      record.comment4 = comment;

      if (certificate_no == "") {
        newCertiNo = "CERT-" + Date.now().toString().substr(-6);
        record.certificate_no = newCertiNo;
      }

      record.notaryDate = new Date();
    } else if (from == "3") {
      record.comment3 = comment;
      record.approvedBythree = 1;
      record.marked_area = draw_data.marked_area;
      record.land_markers = draw_data.land_markers;
      record.npnorth = parcel_data.north;
      record.npsouth = parcel_data.south;
      record.npeast = parcel_data.east;
      record.npwest = parcel_data.west;
      record.isSurveyApproved = 1;
      if (req.body.hasOwnProperty("extraDocs2")) {
        record.extraDocs2 = req.body.extraDocs2;
      }
    }

    await lands.updateOne({ _id: id }, { $set: record });

    let user = await users
      .find({
        $or: [{ _id: userId }, { user_id: send_verifier_id }],
      })
      .toArray();

    var emails = [];
    if (user.length > 0) {
      emails.push(user[0].email, user[1].email, user[1].email2);
      emails.map(function (email, index) {
        if (email) {
          var email = email;
          var subject = "Land Record Submission Notification";
          var username, message;

          if (from == "4") {
            if (certificate_no == "") {
              if (index == 0) {
                username = user[0].firstname + " " + user[0].lastname;
                message =
                  "Hi " +
                  username +
                  " Congratulation! <br><br><br> Your application has been approved. Please log into your portal to view and download your certificate. <br><br><b> Land Application ID: " +
                  application_id +
                  "</b><br><br> Truly, <br> Registrar ";
              } else {
                username = user[1].firstname + " " + user[1].lastname;
                message =
                  "Hi " +
                  username +
                  "<br><br><br> The Land Application With Application ID: " +
                  application_id +
                  " has being approved by " +
                  by +
                  "<br><br> <b>Your Generated Certificate No.:-  " +
                  newCertiNo +
                  "</b> <br><br> Reason For Approval of this Application is:- <br>" +
                  comment;
              }
            } else {
              if (index == 0) {
                username = user[0].firstname + " " + user[0].lastname;
                message =
                  "Hi " +
                  username +
                  " Congratulation! <br><br><br> Your application has been approved. Please log into your portal to view and download your certificate. <br><br><b> Land Application ID: " +
                  application_id +
                  "</b><br><br> Truly, <br> Registrar ";
              } else {
                username = user[1].firstname + " " + user[1].lastname;
                message =
                  "Hi " +
                  username +
                  "<br><br><br> The Land Application With Application ID: " +
                  application_id +
                  " has being approved by " +
                  by +
                  "<br><br> Reason For Approval of this Application is:- <br>" +
                  comment;
              }
            }
          } else if (from == "2") {
            if (index == 0) {
              username = user[0].firstname + " " + user[0].lastname;
              if (req.body.certificateType == 2) {
                message =
                  "Hi " +
                  username +
                  " Congratulation! <br><br><br> Your application has been approved. Please log into your portal to view and download your certificate. <br><br><b> Land Application ID: " +
                  application_id +
                  "</b><br><br> Truly, <br> Land Officer ";
              } else {
                message =
                  "Hi " +
                  username +
                  ", <br><br><br> Your application has been processed and submitted. Please log into your portal to view latest status and comments. <br><br> <b> Land Application ID: " +
                  application_id +
                  "</b> <br><br> Truly, <br> Land Officer";
              }
            }
          } else if (from == "3") {
            if (index == 0) {
              username = user[0].firstname + " " + user[0].lastname;
              message =
                "Hi " +
                username +
                ", <br><br><br> Your application has been processed and submitted. Please log into your portal to view latest status and comments. <br><br> <b> Land Application ID: " +
                application_id +
                "</b> <br><br> Truly, <br> Surveyor";
            }
          } else if (from == "1") {
            if (index == 0) {
              username = user[0].firstname + " " + user[0].lastname;
              message =
                "Hi " +
                username +
                ", <br><br><br> Your application has been processed and submitted. Please log into your portal to view latest status and comments. <br><br> <b> Land Application ID: " +
                application_id +
                "</b> <br><br> Truly, <br> Town Planner";
            }
          }
          if (from != "4") {
            if (req.body.certificateType != 2) {
              console.log(email, message, subject);
              fcntrl.sendEmail(email, subject, message);
            }
          }
        }
      });

      land_checklist.updateOne(
        { land_id: application_id, verifier_id: verifier_id },
        { $set: { status: 1 } }
      );
      var data = {
        land_id: application_id,
        status: status,
        comment: comment,
      };
      if (from == "1") {
        fcntrl.updateVerifier1ApprovalInfo(data).then((result) => {
          res.send({
            code: 200,
            msg: "Application Approved Successfully",
            result: result,
            approvalStatus: status,
          });
        });
      } else if (from == "2") {
        fcntrl.updateVerifier2ApprovalInfo(data).then((result) => {
          res.send({
            code: 200,
            msg: "Application Approved Successfully",
            result: result,
            approvalStatus: status,
          });
        });
      } else if (from == "3") {
        fcntrl.updateSurveyorApprovalInfo(data).then((result) => {
          res.send({
            code: 200,
            msg: "Application Approved Successfully",
            result: result,
            approvalStatus: status,
          });
        });
      } else if (from == "4") {
        fcntrl.updateCommissionerApprovalInfo(data).then((result) => {
          res.send({
            code: 200,
            msg: "Application Approved Successfully",
            result: result,
            approvalStatus: status,
          });
        });
      }
    }
  } catch (err) {
    res.send({
      code: 101,
      msg: "Something went wrong! please try again.",
      err: err,
    });
  }
};

// Get Forwarded List

exports.showForwardedList = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  try {
    let con = await connectDatabase();
    const land_checklist = con.collection("land_checklist");
    const lands = con.collection("lands");

    let land = await lands
      .find(
        {
          $or: [{ approvalStatus: 6 }, { approvalStatus: 7 }],
        }.toArray()
      )
      .toArray();

    // check.map(function (list, index) {
    //   var id = new Mongo.ObjectId(list.land_id)
    //   lands.find({ _id: id }).toArray((err, land) => {
    //     list.land_details = land[0]
    //     if(index == (check.length-1)) .toArray(){
    res.send({
      code: 200,
      msg: "Success",
      data: land,
    });
    //     }
    //   })
    // })
  } catch (err) {
    res.send({
      code: 100,
      msg: "Something went wrong! please try again.",
      err: err,
    });
  }
};

// Get In Progress Check list

exports.showInProgressChecklist = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;

    let con = await connectDatabase();
    const land_checklist = con.collection("land_checklist");
    const lands = con.collection("lands");

    let check = await land_checklist
      .find({
        verifier_id: queryData.verifier_id,
        status: 0,
      })
      .toArray();

    check.map(async function (list, index) {
      var id = new Mongo.ObjectId(list.land_id);
      let land = await lands.find({ _id: id }).toArray();
      list.land_details = land[0];
      if (index == check.length - 1) {
        res.send({
          code: 200,
          msg: "Success",
          data: check,
        });
      }
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: "Something went wrong! please try again.",
      err: err,
    });
  }
};

// Get Single Check list as per application and verifier id.

exports.getSingleChecklist = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;

    let con = await connectDatabase();
    const land_checklist = con.collection("land_checklist");

    let check = await land_checklist
      .find({
        verifier_id: queryData.verifier_id,
        land_id: queryData.application_id,
      })
      .toArray();
    res.send({
      code: 200,
      msg: "Success",
      data: check,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: "Something went wrong! please try again.",
      err: err,
    });
  }
};

// Save Application Check list As Draft

exports.saveChecklistAsDraft = async function (req, res, next) {
  const {
    questions,
    application_id,
    verifier_id,
    land_user,
    approvalStatus,
    isSurvey,
    progressIn,
  } = req.body;
  var id = new Mongo.ObjectId(application_id);

  let con = await connectDatabase();
  const land_checklist = con.collection("land_checklist");
  const lands = con.collection("lands");

  var checklist = {
    verifier_id: verifier_id,
    land_id: application_id,
    land_user: land_user,
    status: 0,
  };

  if (isSurvey == "1") {
    checklist.parcel_data = req.body.parcel_data;
  }

  if (isSurvey == "2") {
    checklist.draw_data = req.body.draw_data;
  }

  for (var key in questions) {
    checklist[key] = JSON.parse(questions[key]);
  }

  lands.updateOne(
    { _id: id },
    {
      $set: {
        approvalStatus: parseInt(approvalStatus),
        progressIn: parseInt(progressIn),
      },
    }
  );
  let check = await land_checklist
    .find({
      verifier_id: verifier_id,
      land_id: application_id,
    })
    .toArray();
  if (check.length > 0) {
    var id = check[0]._id;
    land_checklist.updateOne(
      { _id: id },
      { $set: checklist },
      (err, result) => {
        if (!err) {
          res.send({
            code: 200,
            msg: "Application Saved Successfully",
          });
        } else {
          res.send({
            code: 100,
            msg: "Something went wrong! please try again.",
            err: err,
          });
        }
      }
    );
  } else {
    try {
      await land_checklist.insertOne(checklist);

      res.send({
        code: 200,
        msg: "Application Saved Successfully",
      });
    } catch (err) {
      res.send({
        code: 100,
        msg: "Something went wrong! please try again.",
        err: err,
      });
    }
  }
};

//updating verifiers email

exports.updateVerifiersEmail = async function (req, res, next) {
  try {
    const { user_id, email, email2 } = req.body;
    var id = new Mongo.ObjectId(user_id);

    let con = await connectDatabase();
    const users = con.collection("users");

    await users.updateOne(
      { _id: id },
      { $set: { email: email, email2: email2 } }
    );

    res.send({
      code: 200,
      msg: "Email Updated Successfully",
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: "Something went wrong! please try again.",
    });
  }
};

//Getting region list

exports.getRegions = async function (req, res, next) {
  try {
    let con = await connectDatabase();
    const regions = con.collection("region");

    let region = await regions.find().toArray();

    res.send({
      code: 200,
      data: region,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

//Getting District list as per region

exports.getDistricts = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;
    console.log("indestrict", queryData.id);
    let con = await connectDatabase();
    const districts = con.collection("district");

    let dist = await districts
      .find({ region_id: parseInt(queryData.id) })
      .toArray();
    res.send({
      code: 200,
      data: dist,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

//Getting Wards list as per district

exports.getWards = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;
    let con = await connectDatabase();
    const wards = con.collection("ward");

    let ward = await wards
      .find({ district_id: parseInt(queryData.id) })
      .toArray();

    res.send({
      code: 200,
      data: ward,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

//Get Single Region

exports.getSingleRegion = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;
    //console.log('indestrict', queryData.id)
    let con = await connectDatabase();
    const region = con.collection("region");

    let rgn = await region.find({ id: parseInt(queryData.id) }).toArray();
    res.send({
      code: 200,
      data: rgn,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

//Get Single District

exports.getSingleDistrict = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;
    //console.log('indestrict', queryData.id)
    let con = await connectDatabase();
    const district = con.collection("district");

    let dist = await district.find({ id: parseInt(queryData.id) }).toArray();

    res.send({
      code: 200,
      data: dist,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

//Get Single Ward

exports.getSingleWard = async function (req, res, next) {
  try {
    var queryData = url.parse(req.url, true).query;
    //console.log('indestrict', queryData.id)
    let con = await connectDatabase();
    const ward = con.collection("ward");

    let wrd = await ward.find({ id: parseInt(queryData.id) }).toArray();

    res.send({
      code: 200,
      data: wrd,
    });
  } catch (err) {
    res.send({
      code: 100,
      msg: err,
    });
  }
};

// For insert of Govt. user land record.

exports.uploadGovLandRecords = async function (req, res, next) {
  const { stepone, steptwo, stepthree, stepfour, stepfive, stepsix } = req.body;

  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");
  const owner_demographic = con.collection("owner_demographic");

  var landDetails = {
    certificate_no: steptwo.certificate_no,
    region: stepthree.region,
    ward_no: stepthree.ward,
    block_no: stepthree.block,
    plot_no: stepthree.plot,
    district: stepthree.district,
    address: stepthree.address,
    location: stepthree.location,
    land_feature: stepthree.landfeature,
    land_height: stepthree.landheight,
    land_width: stepthree.landwidth,
    land_area: stepthree.landarea,
    land_lat: stepthree.lat,
    land_long: stepthree.long,
    marked_area: stepthree.markedarea,
    zoom_level: stepthree.zoom_level,
    land_markers: stepthree.land_markers,
    land_purpose: stepfour.land_purpose,
    ownership_details: stepfive.ownership_details,
    upload_title: stepsix.upload_title,
    user_id: stepone.userid,
    village: stepthree.village,
    kitongoji: stepthree.kitongi,
    npnorth: stepthree.npnorth,
    npsouth: stepthree.npsouth,
    npeast: stepthree.npeast,
    npwest: stepthree.npwest,
    isExtraApprovalRequired: steptwo.has_certificate,
    time_stamp: new Date(),
  };

  if (stepone.action == "save") {
    landDetails.approvalStatus = -1;
  } else if (stepone.action == "submit") {
    if (steptwo.has_certificate == "1") {
      landDetails.approvalStatus = 6;
    } else {
      landDetails.approvalStatus = 0;
    }
  }

  let land = await lands
    .find({ certificate_no: steptwo.certificate_no })
    .toArray();
  if (steptwo.has_certificate == 1) {
    if (land.length > 0) {
      res.send({
        code: 100,
        msg: "Land With Current Certificate No. already exists! Please change the Certificate No.",
      });
    } else {
      let doc = await lands.insertOne(landDetails);
      console.log(doc);
      var subject = "Registered Land";
      var username = stepone.firstname + " " + stepone.lastname;
      var message =
        "Hi " +
        username +
        " <br><br><br> Your application has been successful submitted. Please log into your portal to view latest status and comments. <br><br><b> Land Application ID: " +
        doc.insertedId +
        "</b><br><br> Truly, <br> Admin";
      fcntrl.sendEmail(stepone.user_email, subject, message);
      if (landDetails.approvalStatus == -1) {
        res.send({
          code: 200,
          msg: "success",
        });
      } else {
        landDetails.user_type = stepone.user_type;
        landDetails.land_id = doc.insertedId;
        fcntrl.addUserLand(landDetails).then((result) => {
          res.send({
            code: 200,
            msg: "success",
            result: result,
          });
        });
      }
    }
  } else {
    let doc = await lands.insertOne(landDetails);
    var subject = "Registered Land";
    var username = stepone.firstname + " " + stepone.lastname;
    var message =
      "Hi " +
      username +
      " <br><br><br> Your application has been successful submitted. Please log into your portal to view latest status and comments. <br><br><b> Land Application ID: " +
      doc.insertedId +
      "</b><br><br> Truly, <br> Admin";
    fcntrl.sendEmail(stepone.user_email, subject, message);
    if (landDetails.approvalStatus == -1) {
      res.send({
        code: 200,
        msg: "success",
      });
    } else {
      landDetails.user_type = stepone.user_type;
      landDetails.land_id = doc.insertedId;
      fcntrl.addUserLand(landDetails).then((result) => {
        res.send({
          code: 200,
          msg: "success",
          result: result,
        });
      });
    }
  }
};

// For insert of normal user land record.

exports.uploadLandRecords = async function (req, res, next) {
  try {
    const { stepone, steptwo, stepthree, stepfour, stepfive, stepsix } =
      req.body;

    let con = await connectDatabase();
    const lands = con.collection("lands");
    const demographic = con.collection("demographic");
    const owner_demographic = con.collection("owner_demographic");

    var landDetails = {
      certificate_type: stepone.certificateType,
      certificate_no: steptwo.certificate_no,
      region: stepthree.region,
      ward_no: stepthree.ward,
      block_no: stepthree.block,
      plot_no: stepthree.plot,
      district: stepthree.district,
      address: stepthree.address,
      location: stepthree.location,
      land_feature: stepthree.landfeature,
      land_height: stepthree.landheight,
      land_width: stepthree.landwidth,
      land_area: stepthree.landarea,
      marked_area: stepthree.markedarea,
      zoom_level: stepthree.zoom_level,
      land_lat: stepthree.lat,
      land_long: stepthree.long,
      land_markers: stepthree.land_markers,
      land_purpose_type: stepfour.landpurpose_type,
      land_purpose: stepfour.land_purpose,
      ownership_type: stepfive.ownership_type,
      land_secure: stepsix.secure_land,
      upload_title: stepsix.upload_title,
      user_id: stepone.userid,
      village: stepthree.village,
      kitongoji: stepthree.kitongoji,
      npnorth: stepthree.npnorth,
      npsouth: stepthree.npsouth,
      npeast: stepthree.npeast,
      npwest: stepthree.npwest,
      lease_term_type: stepfive.lease_type,
      lease_term: stepfive.lease_term,
      lease_start_date: stepfive.leasedate,
      isExtraApprovalRequired: steptwo.has_certificate,
      time_stamp: new Date(),
    };

    if (stepone.action == "save") {
      landDetails.approvalStatus = -1;
    } else if (stepone.action == "submit") {
      if (stepone.certificateType == "2") {
        landDetails.approvalStatus = 6;
      } else {
        if (steptwo.has_certificate == "1") {
          landDetails.approvalStatus = 6;
        } else {
          landDetails.approvalStatus = 0;
        }
      }
    }

    let land = await lands
      .find({ certificate_no: steptwo.certificate_no })
      .toArray();
    if (steptwo.has_certificate == 1) {
      if (land.length > 0) {
        res.send({
          code: 100,
          msg: "Land With Current Certificate No. already exists! Please change the Certificate No.",
        });
      } else {
        let doc = await lands.insertOne(landDetails);
        var subject = "Registered Land";
        var username =
          stepfive.users[0].firstname + " " + stepfive.users[0].lastname;
        var message =
          "Hi " +
          username +
          " <br><br><br> Your application has been successful submitted. Please log into your portal to view latest status and comments. <br><br><b> Land Application ID: " +
          doc.insertedId +
          "</b><br><br> Truly, <br> Admin";
        fcntrl.sendEmail(stepone.user_email, subject, message);
        //console.log(doc.ops[0]._id)
        let owner = await owner_demographic
          .find({ user_id: stepone.userid })
          .toArray();
        console.log("owner details", owner);
        var owner_demo = stepfive.users[0];
        if (stepfive.users[0].isapplicant == 0) {
          owner_demo.spouse_details = stepfive.users[1];
        } else {
          owner_demo.spouse_details = {};
        }
        owner_demo.user_id = stepone.userid;
        console.log("owner details with spouse", owner);
        if (owner.length > 0) {
          console.log("owner hai");
          owner_demographic.updateOne(
            { user_id: stepone.userid },
            { $set: owner_demo }
          );
        } else {
          console.log("owner nhi hai", owner_demo);
          owner_demographic.insertOne(owner_demo);
        }
        stepfive.users.map(function (user) {
          user.land_id = doc.insertedId;
          demographic.insertOne(user);
        });
        if (landDetails.approvalStatus == -1) {
          res.send({
            code: 200,
            msg: "success",
          });
        } else {
          landDetails.user_type = stepone.user_type;
          landDetails.land_id = doc.insertedId;
          fcntrl.addUserLand(landDetails).then((result) => {
            res.send({
              code: 200,
              msg: "success",
              result: result,
            });
          });
        }
      }
    } else {
      let doc = await lands.insertOne(landDetails);
      var subject = "Registered Land";
      var username =
        stepfive.users[0].firstname + " " + stepfive.users[0].lastname;
      var message =
        "Hi " +
        username +
        " <br><br><br> Your application has been successful submitted. Please log into your portal to view latest status and comments. <br><br><b> Land Application ID: " +
        doc.insertedId +
        "</b><br><br> Truly, <br> Admin";
      fcntrl.sendEmail(stepone.user_email, subject, message);
      //console.log(doc.ops[0]._id)
      let owner = await owner_demographic
        .find({ user_id: stepone.userid })
        .toArray();
      console.log("owner details", owner);
      var owner_demo = stepfive.users[0];
      if (stepfive.users[0].isapplicant == 0) {
        owner_demo.spouse_details = stepfive.users[1];
      } else {
        owner_demo.spouse_details = {};
      }
      owner_demo.user_id = stepone.userid;
      console.log("owner details with spouse", owner);
      if (owner.length > 0) {
        console.log("owner hai");
        owner_demographic.updateOne(
          { user_id: stepone.userid },
          { $set: owner_demo }
        );
      } else {
        console.log("owner nhi hai", owner_demo);
        owner_demographic.insertOne(owner_demo);
      }
      stepfive.users.map(function (user) {
        user.land_id = doc.insertedId;
        demographic.insertOne(user);
      });
      if (landDetails.approvalStatus == -1) {
        res.send({
          code: 200,
          msg: "success",
        });
      } else {
        landDetails.user_type = stepone.user_type;
        landDetails.land_id = doc.insertedId;
        fcntrl.addUserLand(landDetails).then((result) => {
          res.send({
            code: 200,
            msg: "success",
            result: result,
          });
        });
      }
    }
  } catch (err) {
    res.send({
      code: 100,
      msg: "failed",
      err: err,
    });
  }
};

// For update of Normal user land record

exports.updateLandRecord = async function (req, res, next) {
  const { stepone, steptwo, stepthree, stepfour, stepfive, stepsix } = req.body;
  var id = new Mongo.ObjectId(stepone.land_id);

  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");
  const owner_demographic = con.collection("owner_demographic");

  var landDetails = {
    certificate_type: stepone.certificateType,
    certificate_no: steptwo.certificate_no,
    region: stepthree.region,
    ward_no: stepthree.ward,
    block_no: stepthree.block,
    plot_no: stepthree.plot,
    district: stepthree.district,
    address: stepthree.address,
    location: stepthree.location,
    land_feature: stepthree.landfeature,
    land_height: stepthree.landheight,
    land_width: stepthree.landwidth,
    land_area: stepthree.landarea,
    land_lat: stepthree.lat,
    land_long: stepthree.long,
    zoom_level: stepthree.zoom_level,
    land_markers: stepthree.land_markers,
    marked_area: stepthree.markedarea,
    land_purpose_type: stepfour.landpurpose_type,
    land_purpose: stepfour.land_purpose,
    ownership_type: stepfive.ownership_type,
    land_secure: stepsix.secure_land,
    upload_title: stepsix.upload_title,
    user_id: stepone.userid,
    village: stepthree.village,
    kitongoji: stepthree.kitongoji,
    npnorth: stepthree.npnorth,
    npsouth: stepthree.npsouth,
    npeast: stepthree.npeast,
    npwest: stepthree.npwest,
    lease_term_type: stepfive.lease_type,
    lease_term: stepfive.lease_term,
    lease_start_date: stepfive.leasedate,
    isExtraApprovalRequired: steptwo.has_certificate,
    update_time_stamp: new Date(),
  };

  if (stepone.action == "save") {
    landDetails.approvalStatus = -1;
  } else if (stepone.action == "submit") {
    if (stepone.certificateType == "2") {
      landDetails.approvalStatus = 6;
    } else {
      if (steptwo.has_certificate == "1") {
        landDetails.approvalStatus = 6;
      } else {
        landDetails.approvalStatus = 0;
      }
    }
  }

  await lands.updateOne({ _id: id }, { $set: landDetails });
  let owner = await owner_demographic
    .find({ user_id: stepone.userid })
    .toArray();
  var owner_demo = stepfive.users[0];

  if (stepfive.users[0].isapplicant == 0) {
    owner_demo.spouse_details = stepfive.users[1];
  } else {
    owner_demo.spouse_details = {};
  }

  owner_demo.user_id = stepone.userid;

  if (owner.length > 0) {
    console.log("owner hai");
    delete owner_demo._id;
    owner_demographic.updateOne(
      { user_id: stepone.userid },
      { $set: owner_demo }
    );
  } else {
    console.log("owner nhi hai", owner_demo);
    owner_demographic.insertOne(owner_demo);
  }

  let demo = await demographic.find({ land_id: id }).toArray();
  console.log("find data", demo);
  demo.map(function (demo_user, index) {
    var demo_id = new Mongo.ObjectId(demo_user._id);
    console.log("user-data" + index, demo_id, stepfive.users[index]._id);
    // demographic.find({ _id: demo_id }).toArray((err, main) => {
    //   console.log("Find the data", main)
    // }.toArray())
    delete stepfive.users[index]._id;
    demographic.updateOne(
      { _id: demo_id },
      { $set: stepfive.users[index] },
      function (err, result) {
        if (index == demo.length - 1) {
          if (landDetails.approvalStatus == -1) {
            res.send({
              code: 200,
              msg: "success",
            });
          } else {
            landDetails.user_type = stepone.user_type;
            landDetails.land_id = stepone.land_id;
            fcntrl.addUserLand(landDetails).then((result) => {
              res.send({
                code: 200,
                msg: "success",
                result: result,
              });
            });
          }
        }
      }
    );
  });
};

// For Update Govt. User land record.

exports.updateGovLandRecord = async function (req, res, next) {
  const { stepone, steptwo, stepthree, stepfour, stepfive, stepsix } = req.body;
  var id = new Mongo.ObjectId(stepone.land_id);

  let con = await connectDatabase();
  const lands = con.collection("lands");

  var landDetails = {
    certificate_no: steptwo.certificate_no,
    region: stepthree.region,
    ward_no: stepthree.ward,
    block_no: stepthree.block,
    plot_no: stepthree.plot,
    district: stepthree.district,
    address: stepthree.address,
    location: stepthree.location,
    land_feature: stepthree.landfeature,
    land_height: stepthree.landheight,
    land_width: stepthree.landwidth,
    land_area: stepthree.landarea,
    land_lat: stepthree.lat,
    land_long: stepthree.long,
    marked_area: stepthree.markedarea,
    zoom_level: stepthree.zoom_level,
    land_markers: stepthree.land_markers,
    land_purpose: stepfour.land_purpose,
    ownership_details: stepfive.ownership_details,
    upload_title: stepsix.upload_title,
    user_id: stepone.userid,
    village: stepthree.village,
    kitongoji: stepthree.kitongi,
    npnorth: stepthree.npnorth,
    npsouth: stepthree.npsouth,
    npeast: stepthree.npeast,
    npwest: stepthree.npwest,
    isExtraApprovalRequired: steptwo.has_certificate,
    update_time_stamp: new Date(),
  };

  if (stepone.action == "save") {
    landDetails.approvalStatus = -1;
  } else if (stepone.action == "submit") {
    if (steptwo.has_certificate == "1") {
      landDetails.approvalStatus = 6;
    } else {
      landDetails.approvalStatus = 0;
    }
  }

  await lands.updateOne({ _id: id }, { $set: landDetails });
  if (landDetails.approvalStatus == -1) {
    res.send({
      code: 200,
      msg: "success",
    });
  } else {
    landDetails.user_type = stepone.user_type;
    landDetails.land_id = stepone.land_id;
    fcntrl.addUserLand(landDetails).then((result) => {
      res.send({
        code: 200,
        msg: "success",
        result: result,
      });
    });
  }
};

// For Uploading Certificate to server and IPFS

exports.uploadCertificate = async function (req, res, next) {
  console.log(req.file);
  const doc = new PDFDocument();

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  var base_path = "view/uploaded_doc/";
  var file_name = base_path + "app_id-" + req.body.app_id + ".pdf";
  doc.pipe(fs.createWriteStream(file_name));
  doc.image(req.file.path, 17, 35, {
    width: 580,
    height: 750,
    align: "center",
  });
  doc.end();

  let con = await connectDatabase();
  const users = con.collection("users");

  var id = new Mongo.ObjectId(req.body.user_id);
  let user = await users.find({ _id: id }).toArray();
  // console.log("My User to email",user)
  if (user.length > 0) {
    var subject = "Land Record Submission Notification";
    var filename = "ApplicationID-" + req.body.app_id + ".pdf";
    var username = user[0].firstname + " " + user[0].lastname;
    var message =
      "Hi " +
      username +
      " Congratulation! <br><br><br> Your application has been approved. Please log into your portal to view and download your certificate. <br><br><b> Land Application ID: " +
      req.body.app_id +
      "</b><br><br> Truly, <br> Registrar";
    // var message = "Your land with the Application ID: " + req.body.app_id + " is Approved and The Certificate of the Land is Generated."
    fcntrl.sendEmailWithAttachment(
      user[0].email,
      subject,
      message,
      filename,
      file_name
    );
  }
  module.exports.ipfsCertificateUpload(req, res, next, file_name);

  //res.send('Successfully saved')
};

// For Uploading the Certificates to IPFS

exports.ipfsCertificateUpload = async function (req, res, next, file_name) {
  let file = await addFilesToIPFS(req.file.path);
  console.log(file);
  let con = await connectDatabase();
  const certificate = con.collection("certificate");

  var cert = {
    user_id: req.body.user_id,
    app_id: req.body.app_id,
    file_hash: file,
    file_path: "uploaded_doc/app_id-" + req.body.app_id + ".pdf",
  };

  certificate.insertOne(cert);
  var success = {
    code: 200,
    hash: file,
    link: "uploaded_doc/app_id-" + req.body.app_id + ".pdf",
  };
  res.status(200).send(success);
};

// Get All Approved Lands

exports.getAllApprovedLand = async function (req, res, next) {
  let con = await connectDatabase();
  const lands = con.collection("lands");

  let land = await lands.find({ approvalStatus: 1 }).toArray();
  if (land.length > 0) {
    res.send({
      code: 200,
      msg: "lands data",
      data: land,
    });
  } else {
    res.send({
      code: 200,
      msg: "no result found",
      data: [],
    });
  }
};

// Get Approved Lands using certificate no

exports.getLandByCertificateNo = async function (req, res, next) {
  let con = await connectDatabase();
  const lands = con.collection("lands");

  let land = await lands
    .find({
      approvalStatus: 1,
      certificate_no: req.body.certificate_no,
    })
    .toArray();
  if (land.length > 0) {
    res.send({
      code: 200,
      msg: "lands data",
      data: land,
    });
  } else {
    res.send({
      code: 200,
      msg: "no result found",
      data: [],
    });
  }
};

// Show certificate to the user.

exports.showCertificate = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;

  let con = await connectDatabase();
  const certificate = con.collection("certificate");

  let cert = await certificate.find({ app_id: queryData.id }).toArray();
  if (cert.length > 0) {
    res.redirect(301, ipfsHost + "/ipfs/" + cert[0].file_hash);
  } else {
    res.end("No Certificate Found");
  }
};

// For Uploading the files to IPFS

exports.addLandRecords = async function (req, res, next) {
  try {
    var queryData = req.query;
    console.log(queryData);
    let file = await addFilesToIPFS(req.file.path);
    console.log(file);
    var success = {
      code: 200,
      hash: file,
      data: queryData,
    };
    res.status(200).send(success);
  } catch (err) {
    console.log(err);
    res.send({ code: 100, err });
  }
};

function addFilesToIPFS(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "", async function (err, contents) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var res = await ipfs.add(contents);
        console.log(res);
        var { path } = res;
        console.log("IPFS File hash", path);
        resolve(path);
      }
    });
  });
}

// For getting user data using the otp

exports.userData = function (email) {
  return new Promise(async (resolve, reject) => {
    let result = await connectDatabase();
    const c = result.collection("users");
    const owner_demo = result.collection("owner_demographic");

    let user = await c.find({ email: email }).toArray();
    console.log(user);
    if (user.length > 0) {
      console.log("in user");
      var userId = user[0]._id.toString();
      console.log("userId in userdata", userId);
      let owner = await owner_demo.find({ user_id: userId }).toArray();
      console.log("0wner", owner);
      if (owner.length > 0) {
        user[0].owner_demographic = owner[0];
      }
      resolve(user);
    } else {
      console.log("in no user");
      resolve(user);
    }
  });
};

// For Getting the Userdata of a user by using password.

exports.userDataPassword = async function (email, password) {
  return new Promise(async (resolve, reject) => {
    let result = await connectDatabase();
    const c = result.collection("users");
    const owner_demo = result.collection("owner_demographic");

    var user = "";
    let resp = await c.find({ user_id: email }).toArray();
    console.log("resp in userdata1", resp);
    user = resp;
    console.log("user in userdata1", user);
    if (user.length > 0) {
      if (user[0].password == password) {
        console.log("in user");
        var userId = resp[0]._id.toString();
        console.log("userId in userdata", userId);
        let owner = await owner_demo.find({ user_id: userId }).toArray();
        console.log("0wner", owner);
        if (owner.length > 0) {
          resp[0].owner_demographic = owner[0];
        }
        var myResp = {
          code: 200,
          msg: "User",
          data: resp,
        };
        resolve(myResp);
      } else {
        var myResp = {
          code: 101,
          msg: "Invalid Password",
        };
        console.log("in no user_ pass1");
        resolve(myResp);
      }
    } else {
      console.log("in no user1");
      var myResp = {
        code: 100,
        msg: "User Doesn't Exists",
      };
      resolve(myResp);
    }
  });
};

// For the Approval of the Govt. User.

exports.approveUser = async function (req, res, next) {
  var id = new Mongo.ObjectId(req.body.id);

  let result = await connectDatabase();
  const c = result.collection("users");
  var user = "";
  let resp = await c.find({ _id: id }).toArray();
  console.log(resp);
  user = resp;
  let data = {};
  if (user.length > 0) {
    console.log("in user");
    data.code = 200;
    data.user = user;
    console.log("in no user");
    await c.updateOne({ _id: id }, { $set: { approvalStatus: 1 } });

    var userData = {
      userType: user[0].userType,
      user_id: user[0].user_id,
      firstname: user[0].firstname,
      middlename: user[0].middlename,
      lastname: user[0].lastname,
      education: user[0].education,
      employment: user[0].employment,
      birthdate: user[0].birthdate,
      gender: user[0].gender,
      maritial_status: user[0].maritial_status,
      email: user[0].email,
      mobile: user[0].mobile,
      password: user[0].password,
      nationality: user[0].nationality,
      uniqueId: user[0].uniqueId,
      address: user[0].address,
      approvalStatus: 1,
      department: user[0].department,
      designation: user[0].designation,
    };
    let result = await fcntrl.addUser(userData);
    console.log("Blockchain result: " + result);

    var subject = "User Approval";
    var message =
      "Your account has been Approved. Now you can signin and register your landrecords.";
    fcntrl.sendEmail(user[0].email, subject, message);
    res.send(result);
  } else {
    data.code = 100;
    res.send(data);
  }
};

// For checking the user.

exports.checkUser = async function (email) {
  return new Promise(async (resolve, reject) => {
    let result = await connectDatabase();
    const c = result.collection("users");
    var user = "";
    let resp = await c.find({ email: email }).toArray();
    user = resp;
    if (user.length > 0) {
      console.log("in user");
      resolve(true);
    } else {
      console.log("in no user");
      resolve(false);
    }
  });
};

// For Checking the user ID of User.

exports.checkUserid = async function (user_id) {
  return new Promise(async (resolve, reject) => {
    let result = await connectDatabase();
    const c = result.collection("users");
    var user = "";
    let resp = await c.find({ user_id: user_id }).toArray();
    user = resp;
    if (user.length > 0) {
      console.log("in user to check userid");
      resolve(true);
    } else {
      console.log("in no user for check userid");
      resolve(false);
    }
  });
};

// For Registration of a User.

exports.registerUser = async function (req, res, next) {
  let userType = req.body.userType;
  var user_id,
    email,
    mobile,
    password,
    govEmail,
    govMobile,
    govDepartment,
    govDesignation,
    firstname,
    middlename,
    lastname,
    education,
    employment,
    dob,
    gender,
    maritial_status,
    citizenType,
    nationalityId,
    address;

  user_id = req.body.user_id;
  password = req.body.password;
  firstname = req.body.firstname;
  middlename = req.body.middlename;
  lastname = req.body.lastname;
  employment = req.body.employment;
  education = req.body.education;
  gender = req.body.gender;
  dob = req.body.birthdate;
  maritial_status = req.body.maritial_status;
  citizenType = req.body.citizenType;
  address = req.body.address;
  nationalityId = req.body.uniqueId;

  if (userType == 0) {
    email = req.body.email;
    mobile = req.body.mobile;
    password = req.body.password;

    let result = await connectDatabase();
    console.log("after DB connection");

    const c = result.collection("users");

    var user = {
      userType: userType,
      user_id: user_id,
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      education: education,
      employment: employment,
      birthdate: dob,
      gender: gender,
      maritial_status: maritial_status,
      email: email,
      mobile: mobile,
      password: password,
      nationality: citizenType,
      uniqueId: nationalityId,
      address: address,
      approvalStatus: 1,
    };

    c.insertOne(user);
    console.log("Data inserted");
    let addUserRes = await fcntrl.addUser(user);
    console.log("Blockchain Result: " + addUserRes);
    var success = {
      code: 200,
      result: "success",
      data: addUserRes,
      msg: "user successfully registered! please login",
    };
    res.send(success);
  } else if (userType == 1) {
    govEmail = req.body.govEmail;
    govMobile = req.body.govMobile;
    (govDepartment = req.body.govDepartment),
      (govDesignation = req.body.govDesignation);

    let result = await connectDatabase();
    const c = result.collection("users");

    var user = {
      userType: userType,
      user_id: user_id,
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      education: education,
      employment: employment,
      birthdate: dob,
      gender: gender,
      maritial_status: maritial_status,
      email: govEmail,
      mobile: govMobile,
      password: password,
      department: govDepartment,
      designation: govDesignation,
      nationality: citizenType,
      uniqueId: nationalityId,
      address: address,
      approvalStatus: 0,
    };

    c.insertOne(user);
    console.log("Data inserted");
    var success = {
      code: 200,
      result: "success",
      msg: "user successfully registered! please login",
    };
    res.send(success);
  }
};

// For Getting a Land Record.

exports.getSingalLand = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  var id = new Mongo.ObjectId(queryData.id);
  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");

  let resp = await lands.find({ _id: id }).toArray();
  //console.log('test', resp)
  if (resp) {
    var landRecords = [];
    resp.map(async function (land, index) {
      let demo = await demographic.find({ land_id: land._id }).toArray();
      //console.log('demotest', demo)
      land.users_profile = demo;
      //console.log('landafter profile', land)
      landRecords.push(land);
      if (index == resp.length - 1) {
        var success = {
          code: 200,
          msg: "success",
          data: landRecords,
        };
        res.send(success);
        //console.log("Main", landRecords)
      }
    });
    //console.log(landRecords)
  }
};

// For Getting UnApproved Users.

exports.getUnApprovedUser = async function (req, res, next) {
  console.log("In Get User");

  let result = await connectDatabase();
  const c = result.collection("users");

  let resp = await c.find({ userType: "1" }).toArray();
  var users = resp;

  var success = {
    code: 200,
    msg: "success",
    data: users,
  };

  res.send(success);
};

// For showing certificate type status in admin dashboard.

exports.showAdminLandTypes = async function (req, res, next) {
  try {
    let con = await connectDatabase();
    const lands = con.collection("lands");
    var certificateType = {};

    let resp = await lands.find({ certificate_type: "0" }).toArray();
    certificateType.OfferLetter = resp.length;
    let resp1 = await lands.find({ certificate_type: "1" }).toArray();
    certificateType.Digital = resp1.length;
    let resp2 = await lands.find({ certificate_type: "2" }).toArray();
    certificateType.ccro = resp2.length;
    let resp3 = await lands.find({ certificate_type: "3" }).toArray();
    certificateType.nonDigital = resp3.length;
    let resp4 = await lands.find({ certificate_type: "4" }).toArray();
    certificateType.residential = resp4.length;
    let resp5 = await lands
      .find({ certificate_type: { $exists: false } })
      .toArray();

    certificateType.others = resp5.length;
    var success = {
      code: 200,
      certificateType,
      msg: "success",
    };
    res.send(success);
  } catch (err) {
    res.send({ code: 502, msg: "failed" });
  }
};

// For Showing the Govt. User land Types Records in Dashboard.

exports.showGovLandTypes = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;

  let con = await connectDatabase();
  const lands = con.collection("lands");
  var landType = {};

  let resp = await lands
    .find({ user_id: queryData.id, land_purpose: "0" })
    .toArray();

  landType.housing = resp.length;
  let resp1 = await lands
    .find({ user_id: queryData.id, land_purpose: "1" })
    .toArray();

  landType.govFarming = resp1.length;
  let resp2 = await lands
    .find({ user_id: queryData.id, land_purpose: "2" })
    .toArray();
  landType.police = resp2.length;
  let resp3 = await lands
    .find({ user_id: queryData.id, land_purpose: "3" })
    .toArray();

  landType.hospital = resp3.length;
  let resp4 = await lands
    .find({ user_id: queryData.id, land_purpose: "4" })
    .toArray();
  landType.forest = resp4.length;
  let resp5 = await lands
    .find({ user_id: queryData.id, land_purpose: "5" })
    .toArray();
  landType.nationalPark = resp5.length;
  let resp6 = await lands.find({
    user_id: queryData.id,
    land_purpose: "6".toArray(),
  });
  landType.mineral = resp6.length;
  let resp7 = await lands.find({
    user_id: queryData.id,
    land_purpose: "7".toArray(),
  });
  landType.govAuth = resp7.length;
  let resp8 = await lands.find({
    user_id: queryData.id,
    land_purpose: "8".toArray(),
  });
  landType.others = resp8.length;
  var success = {
    code: 200,
    data: landType,
    msg: "success",
  };
  res.send(success);
};

// For showing land status in admin dashboard.

exports.showAdminLandStatus = async function (req, res, next) {
  let con = await connectDatabase();
  const lands = con.collection("lands");
  var status = {};
  status.pending = {};
  let land = await lands.find().toArray();
  status.total = land.length;
  let resp = await lands
    .find({
      $or: [{ approvalStatus: 0 }, { progressIn: 1, approvalStatus: 5 }],
    })
    .toArray();

  status.pending["tp"] = resp.length;
  let resp1 = await lands
    .find({
      $or: [{ approvalStatus: 3 }, { progressIn: 2, approvalStatus: 5 }],
    })
    .toArray();
  status.pending["la"] = resp1.length;
  let resp2 = await lands
    .find({
      $or: [{ approvalStatus: 6 }, { progressIn: 3, approvalStatus: 5 }],
    })
    .toArray();
  status.pending["s"] = resp2.length;
  let resp3 = await lands
    .find({
      $or: [{ approvalStatus: 4 }, { progressIn: 4, approvalStatus: 5 }],
    })
    .toArray();
  status.pending["r"] = resp3.length;
  let resp4 = await lands.find({ approvalStatus: 1 }).toArray();
  status.approved = resp4.length;
  let resp5 = await lands.find({ approvalStatus: 2 }).toArray();
  status.rejected = resp5.length;
  res.send({
    code: 200,
    status,
  });
};

// For Showing the land Status in dashboard.

exports.showLandStatus = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;

  let con = await connectDatabase();
  const lands = con.collection("lands");

  var landStatus = {};
  var landType = {};
  let resp = await lands
    .find({
      $or: [
        { user_id: queryData.id, approvalStatus: 0 },
        { user_id: queryData.id, approvalStatus: 3 },
        { user_id: queryData.id, approvalStatus: 4 },
        { user_id: queryData.id, approvalStatus: 5 },
        { user_id: queryData.id, approvalStatus: 6 },
        { user_id: queryData.id, approvalStatus: 7 },
      ],
    })
    .toArray();
  landStatus.pending = resp.length;
  let resp1 = await lands
    .find({ user_id: queryData.id, approvalStatus: 1 })
    .toArray();

  landStatus.approved = resp1.length;
  let resp2 = await lands
    .find({ user_id: queryData.id, approvalStatus: 2 })
    .toArray();
  landStatus.rejected = resp2.length;
  let resp3 = await lands
    .find({
      user_id: queryData.id,
      land_purpose_type: "0",
    })
    .toArray();
  landType.residential = resp3.length;
  let resp4 = await lands
    .find({
      user_id: queryData.id,
      land_purpose_type: "1",
    })
    .toArray();
  landType.commercial = resp4.length;
  let resp5 = await lands
    .find({ user_id: queryData.id, approvalStatus: -1 })
    .toArray();
  landStatus.saved = resp5.length;
  var success = {
    code: 200,
    data: landStatus,
    data2: landType,
    msg: "success",
  };
  res.send(success);
};

// For Showing the land Status in dashboard for verifier one.

exports.showVerifierLandStatus = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;

  let con = await connectDatabase();
  const lands = con.collection("lands");

  var landStatus = {};
  var landType = {};
  let resp = await lands.find({ approvalStatus: 0 }).toArray();
  landStatus.pending = resp.length;
  let resp1 = await lands
    .find({
      $or: [{ approvalStatus: 6 }, { approvedByone: 1 }],
    })
    .toArray();
  landStatus.approved = resp1.length;
  let resp2 = await lands.find({ approvalStatus: 2, by: 1 }).toArray();
  landStatus.rejected = resp2.length;
  var success = {
    code: 200,
    data: landStatus,
    data2: landType,
    msg: "success",
  };
  res.send(success);
};

// For Showing land status in dashboard for commissioner

exports.commissionerLandStatus = async function (req, res, next) {
  let con = await connectDatabase();
  const lands = con.collection("lands");

  var landStatus = {};
  let resp = await lands.find({ approvalStatus: 4 }).toArray();
  landStatus.pending = resp.length;
  let resp1 = await lands.find({ approvalStatus: 1 }).toArray();
  landStatus.approved = resp1.length;
  let resp2 = await lands.find({ approvalStatus: 2, by: 4 }).toArray();
  landStatus.rejected = resp2.length;
  var success = {
    code: 200,
    data: landStatus,
    msg: "success",
  };
  res.send(success);
};

// For Showing land status in dashboard for Surveyour

exports.surveyourLandStatus = async function (req, res, next) {
  let con = await connectDatabase();
  const lands = con.collection("lands");

  var landStatus = {};
  let resp = await lands.find({ approvalStatus: 6 }).toArray();
  landStatus.pending = resp.length;
  let resp1 = await lands
    .find({
      $or: [{ approvalStatus: 7 }, { approvedBythree: 1 }],
    })
    .toArray();

  landStatus.approved = resp1.length;
  let resp2 = await lands.find({ approvalStatus: 2, by: 3 }).toArray();
  landStatus.rejected = resp2.length;
  var success = {
    code: 200,
    data: landStatus,
    msg: "success",
  };
  res.send(success);
};

// For Showing the land Status in dashboard for verifier two.

exports.showOtherVerifierLandStatus = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;

  let con = await connectDatabase();
  const lands = con.collection("lands");

  var landStatus = {};
  var landType = {};
  let resp = await lands.find({ approvalStatus: 7 }).toArray();
  landStatus.pending = resp.length;
  let resp1 = await lands
    .find({
      $or: [{ approvalStatus: 4 }, { approvedBytwo: 1 }],
    })
    .toArray();
  landStatus.approved = resp1.length;
  let resp2 = await lands.find({ approvalStatus: 2, by: 2 }).toArray();
  landStatus.rejected = resp2.length;
  let resp3 = await lands.find({ approvalStatus: 6 }).toArray();
  landStatus.forwarded = resp3.length;
  let resp4 = await lands.find({ approvalStatus: 7 }).toArray();
  landStatus.survey_done = resp4.length;
  var success = {
    code: 200,
    data: landStatus,
    data2: landType,
    msg: "success",
  };
  res.send(success);
};

// For Getting a user details

exports.getSingleUser = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  var id = new Mongo.ObjectId(queryData.id);

  let con = await connectDatabase();
  const users = con.collection("users");

  let resp = await users.find({ _id: id }).toArray();
  var success = {
    code: 200,
    msg: "success",
    data: resp,
  };
  res.send(success);
};

// For updateOne Profile Details

exports.updateProfileDetails = async function (req, res, next) {
  var {
    firstname,
    middlename,
    lastname,
    education,
    employment,
    gender,
    maritial_status,
    birthdate,
    mobile,
    address,
    user_id,
  } = req.body;
  var id = new Mongo.ObjectId(user_id);

  let con = await connectDatabase();
  const users = con.collection("users");

  await users.updateOne(
    { _id: id },
    {
      $set: {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        education: education,
        gender: gender,
        birthdate: birthdate,
        maritial_status: maritial_status,
        employment: employment,
        mobile: mobile,
        address: address,
      },
    }
  );
  let resp = await users.find({ _id: id }).toArray();
  res.send({ code: 200, msg: "success", user: resp });
};

// For Getting land Records.

exports.getLandRecords = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  //console.log(queryData.id)
  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");
  const certificate = con.collection("certificate");

  let resp = await lands.find({ user_id: queryData.id }).toArray();
  // console.log("test", resp);

  let landRecords = resp.map(async function (land, index) {
    let demo = await demographic.find({ land_id: land._id }).toArray();
    // console.log("demotest", demo);
    land.users_profile = demo;
    // console.log("landafter profile", land);
    // landRecords.push(land)
    var file = {
      app_id: land._id.toString(),
    };
    // console.log(file);
    let cert = await certificate.find(file).toArray();
    console.log(cert);
    if (cert.length > 0) {
      land.certificate_details = cert[0];
    }
    // console.log(land)
    return land;
  });
  landRecords = await Promise.all(landRecords);
  console.log("land landRecords", landRecords);
  var success = {
    code: 200,
    msg: "success",
    data: landRecords.reverse(),
  };
  res.send(success);
  //console.log("Main", landRecords)

  //console.log(landRecords)
};

// For Getting land Records using status for Commissioner.

exports.listCommissionerLandRecords = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  //console.log(queryData.id)
  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");

  var hash = parseInt(queryData.hash);
  var data = {
    approvalStatus: parseInt(queryData.approvalStatus),
  };

  if (hash != 0) {
    data["by"] = hash;
  }
  //console.log(data)

  let resp = await lands.find(data).toArray();
  //console.log('test', resp)
  if (resp.length > 0) {
    //console.log('hii1')
    var landRecords = [];
    resp.map(async function (land, index) {
      let demo = await demographic.find({ land_id: land._id }).toArray();
      //console.log('demotest', demo)
      land.users_profile = demo;
      //console.log('landafter profile', land)
      landRecords.push(land);
      if (index == resp.length - 1) {
        var success = {
          code: 200,
          msg: "success",
          data: landRecords.reverse(),
        };
        res.send(success);
        //console.log("Main", landRecords)
      }
    });
    //console.log(landRecords)
  } else {
    // console.log('hii')
    var success = {
      code: 200,
      msg: "success",
      data: [],
    };
    res.send(success);
  }
};

// For Getting land Records Approval using status .

exports.listApprovedRecord = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  //console.log(queryData.id)
  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");

  // var hash = parseInt(queryData.hash)
  // var data = {
  //   approvalStatus: parseInt(queryData.approvalStatus)
  // }

  // if (hash != 0) {
  //   data['by'] = hash
  // }
  //console.log(data)
  var status = queryData.status;
  var status_data;
  if (status == "1") {
    status_data = {
      approvedByone: 1,
    };
  } else if (status == "2") {
    status_data = {
      approvedBytwo: 1,
    };
  } else if (status == "3") {
    status_data = {
      approvedBythree: 1,
    };
  } else if (status == "4") {
    status_data = {
      approvedByfour: 1,
    };
  }

  let resp = await lands
    .find({
      $or: [
        { approvalStatus: parseInt(queryData.approvalStatus) },
        status_data,
      ],
    })
    .toArray();
  //console.log('test', resp)
  if (resp.length > 0) {
    //console.log('hii1')
    var landRecords = [];
    resp.map(async function (land, index) {
      let demo = await demographic.find({ land_id: land._id }).toArray();
      //console.log('demotest', demo)
      land.users_profile = demo;
      //console.log('landafter profile', land)
      landRecords.push(land);
      if (index == resp.length - 1) {
        var success = {
          code: 200,
          msg: "success",
          data: landRecords.reverse(),
        };
        res.send(success);
        //console.log("Main", landRecords)
      }
    });
    //console.log(landRecords)
  } else {
    // console.log('hii')
    var success = {
      code: 200,
      msg: "success",
      data: [],
    };
    res.send(success);
  }
};

// For Getting land Records using status for verifier.

exports.listVerifierLandRecords = async function (req, res, next) {
  var queryData = url.parse(req.url, true).query;
  //console.log(queryData.id)
  let con = await connectDatabase();
  const lands = con.collection("lands");
  const demographic = con.collection("demographic");

  var hash = parseInt(queryData.hash);
  var data = {
    // region: queryData.region_id,
    approvalStatus: parseInt(queryData.approvalStatus),
  };

  if (hash != 0) {
    data["by"] = hash;
  }
  console.log(data);

  let resp = await lands.find(data).toArray();
  //console.log('test', resp)
  if (resp.length > 0) {
    //console.log('hii1')
    var landRecords = [];
    resp.map(async function (land, index) {
      let demo = await demographic.find({ land_id: land._id }).toArray();
      //console.log('demotest', demo)
      land.users_profile = demo;
      //console.log('landafter profile', land)
      landRecords.push(land);
      if (index == resp.length - 1) {
        var success = {
          code: 200,
          msg: "success",
          data: landRecords.reverse(),
        };
        res.send(success);
        //console.log("Main", landRecords)
      }
    });
    //console.log(landRecords)
  } else {
    // console.log('hii')
    var success = {
      code: 200,
      msg: "success",
      data: [],
    };
    res.send(success);
  }
};

exports.resetPassword = async function (req, res, next) {
  var email = req.body.email;
  var da = new Date();
  let resp = await module.exports.userData(email);
  if (resp.length > 0) {
    var subject = "Land Registry Demo: Reset Password";
    var message =
      "Hi " +
      resp[0].firstname +
      " " +
      resp[0].lastname +
      "<br><br><br> Your Reset Password link is: " +
      host +
      "/resetPassword.html?token=" +
      resp[0]._id +
      "&expiry=" +
      da.getTime() +
      "&name=" +
      resp[0].firstname;
    fcntrl.sendEmail(email, subject, message);
    res.send({
      code: 200,
      result: "success",
    });
  } else {
    res.send({
      code: 100,
      result: "failure",
      msg: "User Doesn't Exists!",
    });
  }
};

exports.changePassword = async function (req, res, next) {
  var user_id = new Mongo.ObjectId(req.body.id);
  var password = req.body.password;
  var expiry_time = req.body.expiry_time;

  if (expiry_time != null) {
    if (expiry_time < 1) {
      let con = await connectDatabase();
      const user = con.collection("users");

      await user.updateOne({ _id: user_id }, { $set: { password: password } });

      var success = {
        code: 200,
        msg: "Password Changed Successfully",
      };
      res.send(success);
    } else {
      var success = {
        code: 100,
        msg: "Link has been expired! please try again",
      };
      res.send(success);
    }
  } else {
    var success = {
      code: 101,
      msg: "Invalid Data",
    };
    res.send(success);
  }
};
