//SPDX-License-Identifier: Apache-2.0

let express = require('express');
let router = express.Router();
let fapp = require('./controller/fabric-controller.js');
let dapp = require('./controller/controller.js');
let format = require('date-format');
var jwtTokenAuth = require('./jwt_authorisation');
var multer = require('multer')
var storage = multer.diskStorage({
  destination: 'view/uploaded_doc/', filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

module.exports = router;

router.use(function (req, res, next) {

  console.log(format.asString('hh:mm:ss.SSS', new Date()) + '::............ ' + req.url + ' .............');
  console.log('Request: ' + JSON.stringify(req.body, null, 4));
  next(); // make sure we go to the next routes and don't stop here

  function afterResponse() {
    res.removeListener('finish', afterResponse);
  }
  res.on('finish', afterResponse);

});

router.post('/validateAndSendEMail*', fapp.validateAndSendEMail);
router.post('/registerUser*', dapp.registerUser);
router.post('/generateOTP*', fapp.generateOTP);
router.post('/validateAndGenerateOtp*', fapp.validateAndGenerateOtp);
router.post('/login*', fapp.login);
router.post('/passwordLogin*', fapp.passwordLogin);
router.get('/listUnApprovedUser*', dapp.getUnApprovedUser);
router.get('/getSingalLand*', dapp.getSingalLand);
router.get('/listLandRecords*', dapp.getLandRecords);
router.get('/listVerifierLandRecords*', dapp.listVerifierLandRecords);
router.get('/listCommissionerLandRecords*', dapp.listCommissionerLandRecords);
router.get('/showLandStatus*', dapp.showLandStatus);
router.get('/showAdminLandStatus*', dapp.showAdminLandStatus);
router.get('/showAdminLandTypes*', dapp.showAdminLandTypes);
router.get('/showVerifierLandStatus*', dapp.showVerifierLandStatus);
router.get('/VerifierTwoLandStatus*', dapp.showOtherVerifierLandStatus);
router.get('/commissionerLandStatus*', dapp.commissionerLandStatus);
router.get('/listApprovedRecord*', dapp.listApprovedRecord);
router.get('/surveyourLandStatus*', dapp.surveyourLandStatus);
router.get('/showGovLandTypes*', dapp.showGovLandTypes);
router.get('/getSingleUser*', dapp.getSingleUser);
router.get('/getRegions*', dapp.getRegions);
router.get('/getVerifiers*', dapp.getVerifiers);
router.get('/getDistricts*', dapp.getDistricts);
router.get('/getWards*', dapp.getWards);
router.get('/getSingleRegion*', dapp.getSingleRegion);
router.get('/getSingleDistrict*', dapp.getSingleDistrict);
router.get('/getSingleWard*', dapp.getSingleWard);
router.get('/getSingleChecklist*', dapp.getSingleChecklist);
router.get('/showInProgressChecklist*', dapp.showInProgressChecklist);
router.get('/showForwardedList*', dapp.showForwardedList);
router.get('/showCertificate*', dapp.showCertificate);
router.get('/getAllApprovedLand*', dapp.getAllApprovedLand);
router.get('/getHistoryForLand',fapp.getHistoryForLand);

router.post('/jwtTokenAuth*', jwtTokenAuth, fapp.onLoad);
router.post('/approveUser*', dapp.approveUser);
router.post('/searchApprovedLand*', dapp.getLandByCertificateNo);
router.post('/updateVerifiersEmail*', dapp.updateVerifiersEmail)
router.post('/uploadLandRecords*', dapp.uploadLandRecords);
router.post('/uploadGovLandRecords*', dapp.uploadGovLandRecords);
router.post('/updateProfileDetails*', dapp.updateProfileDetails);
router.post('/updateGovLandRecord*', dapp.updateGovLandRecord);
router.post('/updateLandRecord*', dapp.updateLandRecord);
router.post('/resetPassword*', dapp.resetPassword);
router.post('/changePassword*', dapp.changePassword);
router.post('/rejectLandRecord*', dapp.rejectLandRecord);
router.post('/forwardLandRecord*', dapp.forwardLandRecord);
router.post('/saveChecklistAsDraft*', dapp.saveChecklistAsDraft);
router.post('/submitChecklist*', dapp.submitChecklist);
router.post('/addLandRecord*', upload.single('file'), dapp.addLandRecords);
router.post('/uploadCertificate*', upload.single('file'), dapp.uploadCertificate);

