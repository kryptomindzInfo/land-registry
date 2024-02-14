"use strict";
const { Fabric } = require("../fabric-utils/fabric");
var mongoController = require("./controller.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var url = require("url");

exports.validateAndSendEMail = async function (req, res, next) {
  console.log("start validateAndSendEMail");
  var email = req.body.email;
  var user_id = req.body.user_id;

  let result = await mongoController.checkUserid(user_id);
  console.log("Userid check", result, user_id);
  if (result == true) {
    res.send({
      code: 100,
      result: "failure",
      msg: "User ID already exists",
    });
  } else {
    let result = await mongoController.checkUser(email);
    console.log("User", result, email);
    if (result == true) {
      res.send({
        code: 100,
        result: "failure",
        msg: "Email already exists",
      });
    } else {
      console.log("call here");
      module.exports.generateOTP(req, res, next);
    }
  }
};

exports.validateAndGenerateOtp = function (req, res, next) {
  var email = req.body.email;
  mongoController.checkUser(email).then((result) => {
    console.log("User", result, email);
    if (result == true) {
      module.exports.generateOTP(req, res, next);
    } else {
      res.send({
        code: 100,
        result: "failure",
        msg: "User Doesnot exists!",
      });
    }
  });
};

exports.generateOTP = function (req, res, _next) {
  var email = req.body.email;
  var otp = Date.now().toString().substr(-6);
  var subject = "Land Registry Demo: Login OTP";
  var message = "Your One Time Password is:- " + otp;
  console.log("--- OTP: " + otp);
  module.exports.sendEmail(email, subject, message);
  res.send({
    code: 200,
    result: "success",
    otp: otp,
  });
};

exports.login = function (req, res, _next) {
  var email = req.body.email;
  var otp = req.body.otp;
  var orgToken = jwt.sign(
    {
      _email: email,
      _otp: otp,
    },
    "jwt_Secret_Key_for_land_registry_Of_32Bit_String",
    {
      expiresIn: "6800000",
    }
  );
  mongoController.userData(email).then((re) => {
    if (re) {
      res.send({
        result: "success",
        userType: "user",
        msg: "not an Admin",
        token: orgToken,
        userData: re,
      });
    } else {
      res.send({
        result: "error",
        msg: "not an Admin",
      });
    }
  });
};

exports.passwordLogin = function (req, res, _next) {
  console.log("in password login");
  var email = req.body.user_id;
  var otp = req.body.otp;
  var orgToken = jwt.sign(
    {
      _email: email,
      _otp: otp,
    },
    "jwt_Secret_Key_for_land_registry_Of_32Bit_String",
    {
      expiresIn: "6800000",
    }
  );
  mongoController.userDataPassword(email, otp).then((re) => {
    console.log("In C", re);
    if (re.code == 200) {
      res.send({
        code: 200,
        result: "success",
        userType: "user",
        msg: "not an Admin",
        token: orgToken,
        userData: re.data,
      });
    } else if (re.code == 101) {
      res.send({
        code: 101,
        result: "error",
        msg: "Invalid Password",
      });
    } else if (re.code == 100) {
      res.send({
        code: 100,
        result: "error",
        msg: "User Doesn't Exists! Please Register to login.",
      });
    }
  });
};

exports.sendEmail = async function (email, subject, message) {
  try {
    console.log("comes here3");
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      debug: true,
      auth: {
        user: "landrecord.blockchain@gmail.com", // generated ethereal user
        pass: "krmcvpqvboeujlvb", // generated ethereal password
      },
    });
    console.log("comes here2");
    // setup email data with unicode symbols
    var mailOptions = {
      from: '"Land Records" <landrecord.blockchain@gmail.com>', // sender address
      to: email,
      subject: subject, // Subject line
      html: message, // html body
    };
    console.log("comes here");
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("sendEmail:- Message sent: %s", info.messageId);
  } catch (error) {
    console.log("sendEmail:- " + error);
    throw error;
  }
};

exports.onLoad = function (req, res, next) {
  res.send({ result: "success" });
};

exports.sendEmailWithAttachment = function (
  email,
  subject,
  message,
  filename,
  filepath
) {
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "landrecord.blockchain@gmail.com", // generated ethereal user
      pass: "landRecord2019", // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  var mailOptions = {
    from: '"Land Records" <landrecord.blockchain@gmail.com>', // sender address
    to: email,
    subject: subject, // Subject line
    html: message, // html body
    attachments: [
      {
        // file on disk as an attachment
        filename: filename,
        path: filepath, // stream this file
      },
    ],
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("sendEmail:- " + error);
    }
    console.log("sendEmail:- Message sent: %s", info.messageId);
  });
};

exports.addUser = async function (req) {
  console.log("addUser fabric controller received request: " + req);
  var user_type = req.userType;
  var user_id = req.user_id;
  var firstname = req.firstname;
  var middlename = req.middlename;
  var lastname = req.lastname;
  var employment = req.employment;
  var education = req.education;
  var gender = req.gender;
  var dob = req.birthdate;
  var maritial_status = req.maritial_status;
  var email_id = req.email;
  var mobile_no = req.mobile;
  var password = req.password;
  var nationality = req.nationality;
  var unique_id = req.uniqueId;
  var address = req.address;
  var department, designation;
  var args = [
    user_id,
    user_type,
    firstname,
    middlename,
    lastname,
    education,
    employment,
    dob,
    gender,
    maritial_status,
    email_id,
    mobile_no,
    password,
    nationality,
    unique_id,
    address,
  ];
  if (user_type == "1") {
    department = req.department;
    designation = req.designation;
    args.push(department, designation);
  }

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  const result = await fabric.invoke("addUser", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.addUserLand = async function (req) {
  console.log("addUserLand fabric controller received request: " + req);
  var land_id = req.land_id;
  var user_type = req.user_type;
  //var user_type = "0";
  var approval_status = req.approvalStatus;
  var certificate_no = req.certificate_no;
  var region = req.region;
  var ward_no = req.ward_no;
  var block_no = req.block_no;
  var plot_no = req.plot_no;
  var district = req.district;
  var address = req.address;
  var location = req.location;
  var land_feature = req.land_feature;
  var land_height = req.land_height;
  var land_width = req.land_width;
  var land_area = req.land_area;
  var land_lat = req.land_lat;
  var land_long = req.land_long;
  var marked_area = req.marked_area;
  var land_markers = req.land_markers;
  var land_purpose = req.land_purpose;
  var upload_title = req.upload_title;
  var user_id = req.user_id;
  var village = req.village;
  var kitongoji = req.kitongoji;
  var npnorth = req.npnorth;
  var npsouth = req.npsouth;
  var npeast = req.npeast;
  var npwest = req.npwest;
  var isExtraApprovalRequired = req.isExtraApprovalRequired;
  console.log("upload title " + JSON.stringify(upload_title));
  var args = [
    land_id.toString(),
    user_type,
    user_id,
    approval_status.toString(), //user details
    region,
    ward_no,
    block_no,
    plot_no,
    district,
    address,
    location,
    land_feature,
    village,
    kitongoji, //location details
    npnorth,
    npsouth,
    npeast,
    npwest, //boundary details
    land_height,
    land_width,
    land_area, //dimension details
    marked_area,
    JSON.stringify(land_markers),
    land_lat,
    land_long, //drawing details
    JSON.stringify(upload_title),
    certificate_no,
    land_purpose,
    isExtraApprovalRequired, //other details
  ];

  if (user_type == "1") {
    var ownership_details = req.ownership_details; //ownership details
    args.push(ownership_details);
  } else {
    var land_purpose_type = req.land_purpose_type;
    var land_secure = req.land_secure;
    var lease_term_type = req.lease_term_type;
    var lease_term = req.lease_term;
    var lease_start_date = req.lease_start_date;
    var certificate_type = req.certificate_type;
    var ownership_type = req.ownership_type;
    args.push(
      lease_term_type,
      lease_term,
      lease_start_date, //lease details
      land_purpose_type,
      land_secure,
      certificate_type,
      ownership_type
    );
  }

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("addLandDetails", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.updateVerifier1ApprovalInfo = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("updateVerifier1ApprovalInfo", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.updateVerifier2ApprovalInfo = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("updateVerifier2ApprovalInfo", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.updateSurveyorApprovalInfo = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("updateSurveyorApprovalInfo", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.updateCommissionerApprovalInfo = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("updateCommissionerApprovalInfo", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.rejectedByVerifier1 = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("rejectedByVerifier1", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.rejectedByVerifier2 = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("rejectedByVerifier2", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.rejectedBySurveyor = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("rejectedBySurveyor", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.rejectedByCommissioner = async function (req) {
  var land_id = req.land_id;
  var status = req.status;
  var comment = req.comment;

  var args = [land_id, status, comment];

  console.log("Arguments Array: " + args);
  let fabric = new Fabric();
  await fabric.connectNetwork();
  await fabric.invoke("rejectedByCommissioner", args);
  return { result: "success", tx_id: fabric.getTxId() };
};

exports.fetchDetailsById = async function (req) {
  var id = req.id;
  var args = [id];
  let fabric = new Fabric();
  await fabric.connectNetwork();
  let data = fabric.query("fetchDetailsById", args);
  return { result: "success", data };
};

exports.fetchLandDetailsByUserId = async function (req) {
  var user_id = req.user_id;
  var args = [user_id];
  let fabric = new Fabric();
  await fabric.connectNetwork();
  let data = fabric.query("fetchLandDetailsByUserId", args);
  return { result: "success", data };
};

exports.fetchLandDetailsByStatus = async function (req) {
  var status = req.status;
  var args = [status];
  let fabric = new Fabric();
  await fabric.connectNetwork();
  let data = fabric.query("fetchLandDetailsByStatus", args);
  return { result: "success", data };
};

exports.getHistoryForLand = async function (req, res) {
  var queryData = url.parse(req.url, true).query;
  var land_id = queryData.land_id;
  console.log("land id " + land_id);
  var args = [land_id];
  let fabric = new Fabric();
  await fabric.connectNetwork();
  var data = await fabric.query("getHistoryForLand", args);
  res.send({ result: "success", data });
};
