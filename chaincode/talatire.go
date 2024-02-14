package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type GeneralDetails struct {
	FirstName     string   `json:"first_name"`
	MiddleName    string   `json:"middle_name"`
	LastName      string   `json:"last_name"`
	Education     string   `json:"education"`
	Employment    string   `json:"employment"`
	BirthDate     string   `json:"dob"`
	Gender        string   `json:"gender"`
	MaritalStatus string   `json:"marital_status"`
	EmailId1      string   `json:"email"`
	EmailId2      string   `json:"email2"`
	MobileNo      string   `json:"mobile_no"`
	Password      string   `json:"password"`
	Nationality   int      `json:"nationality"`
	NationalityId string   `json:"nationality_id"`
	Address       string   `json:"address"`
	LandsOwned    []string `json:"lands_owned"`
}

type User struct {
	UserId          string          `json:"user_id"`
	UserType        int             `json:"user_type"`
	Details         GeneralDetails  `json:"general_details"`
	GeneralUserInfo *GeneralUser    `json:"general_user_info"`
	GovUserInfo     *GovernmentUser `json:"gov_user_info"`
}

type GeneralUser struct {
}

type GovernmentUser struct {
	Department  string `json:"department"`
	Designation string `json:"designation"`
}

type LandLocationDetails struct {
	Region      string `json:"region"`
	WardNo      string `json:"ward_no"`
	BlockNo     string `json:"block_no"`
	PlotNo      string `json:"plot_no"`
	District    string `json:"district"`
	Address     string `json:"address"`
	Location    string `json:"location"`
	LandFeature string `json:"land_feature"`
	Village     string `json:"village"`
	Kitongoji   string `json:"kitongoji"`
}

type LandBoundaryDetails struct {
	Npnorth string `json:"npnorth"`
	Npsouth string `json:"npsouth"`
	Npeast  string `json:"npeast"`
	Npwest  string `json:"npwest"`
}

type LandDimensionDetails struct {
	LandHeight string `json:"land_height"`
	LandWidth  string `json:"land_width"`
	LandArea   string `json:"land_area"`
}

type DrawingDetails struct {
	MarkedArea  string   `json:"marked_area"`
	LandMarkers []string `json:"land_markers"`
	LandLat     string   `json:"land_lat"`
	LandLong    string   `json:"land_long"`
}

type LeaseDetails struct {
	LeaseTermType  string `json:"lease_term_type"`
	LeaseTerm      string `json:"lease_term"`
	LeaseStartDate string `json:"lease_start_date"`
}

type ApprovalStatus struct {
	Status              int    `json:"status"`
	RejectedBy          string `json:"rejected_by"`
	Verifier1Comment    string `json:"verifier1_comment"`
	Verifier2Comment    string `json:"verifier2_comment"`
	SurveyorComment     string `json:"surveyor_comment"`
	CommissionerComment string `json:"commisioner_comment"`
}

type DocumentTitle struct {
	FileName string `json:"filename"`
	FileHash string `json:"filehash"`
}

type LandDetails struct {
	CertificateNo           string               `json:"certificate_no"`
	LandLocationInfo        LandLocationDetails  `json:"land_location_details"`
	LandDimensionInfo       LandDimensionDetails `json:"land_boundary_details"`
	DrawingInfo             DrawingDetails       `json:"drawing_details"`
	LandPurpose             string               `json:"land_purpose"`
	UploadTitle             []DocumentTitle      `json:"upload_title"`
	BoundaryInfo            LandBoundaryDetails  `json:"boundary_details"`
	IsExtraApprovalRequired string               `json:"isExtraApprovalRequired"`
	TimeStamp               time.Time            `json:"time_stamp"`
}

type UserLand struct {
	LandId          string           `json:"land_id"`
	UserId          string           `json:"user_id"`
	ApprovalInfo    ApprovalStatus   `json:"approval_status"`
	LandInfo        LandDetails      `json:"land_details"`
	GenUserLandInfo *GeneralUserLand `json:"genuser_land_info"`
	GovUserLandInfo *GovUserLand     `json:"govuser_land_info"`
}

type GeneralUserLand struct {
	LandPurposeType string       `json:"land_purpose_type"`
	LandSecure      string       `json:"land_secure"`
	LeaseInfo       LeaseDetails `json:"lease_details"`
	CertificateType string       `json:"certificate_type"`
	OwnershipType   string       `json:"ownership_type"`
}

type GovUserLand struct {
	OwnershipDetails string `json:"ownership_details"`
}

type StatusQueue struct {
	Queue map[int][]string `json:"queue_map"`
}

const SQId = "status_queue"

func updateStatusQueue(stub shim.ChaincodeStubInterface, prevStatus int, curStatus int, landId string) error {

	var sq StatusQueue

	fmt.Printf("status queue: start\n")
	err := getStateAndUnmarshal(stub, SQId, &sq)
	if err != nil {
		return fmt.Errorf("getStateAndUnmarshalError:: %s", err)
	}
	fmt.Printf("status queue: prev st %d\n", prevStatus)
	if prevStatus >= 0 {
		fmt.Printf("status queue: prevstatu %d\n", prevStatus)
		sq.Queue[prevStatus] = removeStrFromArr(sq.Queue[prevStatus], landId)
	}
	fmt.Printf("status queue: cur status%d\n", curStatus)
	if curStatus >= 0 {
		fmt.Printf("status queue: cur status inside%d\n", curStatus)
		sq.Queue[curStatus] = append(sq.Queue[curStatus], landId)
	}
	return (marshalAndPutState(stub, SQId, sq))
}

/*
* The Init method *
called when the Smart Contract is instantiated by the network
*/
func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) sc.Response {

	//initialise the status queue
	var funcName = "Init"
	var sq StatusQueue
	sq.Queue = make(map[int][]string)
	err := marshalAndPutState(stub, SQId, sq)
	if err != nil {
		return shim.Error(fmt.Sprintf("%s - marshalAndPutState: %s\n\n", funcName, err))
	}

	users := []User{
		{UserType: 3, UserId: "townplanner", Details: GeneralDetails{FirstName: "Town", LastName: "planner", EmailId1: "verifierone@gmail.com", EmailId2: "verifieroneother@gmail.com", Password: "landrecord", Nationality: 1}},

		{UserType: 4, UserId: "landofficer", Details: GeneralDetails{FirstName: "Land", LastName: "architect", EmailId1: "verifiertwo@gmail.com", EmailId2: "verifieroneother@gmail.com", Password: "landrecord", Nationality: 1}},

		{UserType: 5, UserId: "surveyor", Details: GeneralDetails{FirstName: "Surveyor", EmailId1: "surveyour@gmail.com", EmailId2: "surveyour@gmail.com", Password: "landrecord", Nationality: 1}},

		{UserType: 6, UserId: "registrar", Details: GeneralDetails{FirstName: "Registrar", EmailId1: "commissioner@gmail.com", EmailId2: "commissioner@gmail.com", Password: "landrecord", Nationality: 1}},

		{UserType: 2, UserId: "landrecord", Details: GeneralDetails{FirstName: "Admin", EmailId1: "landrecord@gmail.com", Password: "landrecord", Nationality: 1}}}

	for _, user := range users {
		userAsBytes, _ := json.Marshal(user)
		stub.PutState(user.UserId, userAsBytes)
		fmt.Println("Added \n", user)
	}
	return shim.Success(nil)
}

/*
*Invoke Method *
called when client sends a transaction proposal.
*/
func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) sc.Response {
	// Retrieve the requested Smart Contract function and arguments
	var funcName = "Invoke"
	function, args := stub.GetFunctionAndParameters()

	fmt.Printf("%s - Call Function %s and pass Arguments %s\n\n", funcName, function, args)

	if function == "addUser" {
		return s.addUser(stub, args)
	} else if function == "addLandDetails" {
		return s.addLandDetails(stub, args)
	} else if function == "updateVerifier1ApprovalInfo" {
		return s.updateVerifier1ApprovalInfo(stub, args)
	} else if function == "updateVerifier2ApprovalInfo" {
		return s.updateVerifier2ApprovalInfo(stub, args)
	} else if function == "updateSurveyorApprovalInfo" {
		return s.updateSurveyorApprovalInfo(stub, args)
	} else if function == "updateCommissionerApprovalInfo" {
		return s.updateCommissionerApprovalInfo(stub, args)
	} else if function == "rejectedByVerifier1" {
		return s.rejectedByVerifier1(stub, args)
	} else if function == "rejectedByVerifier2" {
		return s.rejectedByVerifier2(stub, args)
	} else if function == "rejectedBySurveyor" {
		return s.rejectedBySurveyor(stub, args)
	} else if function == "rejectedByCommissioner" {
		return s.rejectedByCommissioner(stub, args)
	} else if function == "fetchDetailsById" {
		return s.fetchDetailsById(stub, args)
	} else if function == "fetchLandDetailsByUserId" {
		return s.fetchLandDetailsByUserId(stub, args)
	} else if function == "fetchLandDetailsByStatus" {
		return s.fetchLandDetailsByStatus(stub, args)
	} else if function == "getHistoryForLand" {
		return s.getHistoryForLand(stub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

// AddUser - adds a user after registration. User can be aither General or Government
func (s *SmartContract) addUser(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Adding User %s...\n", args[0])

	//Validation
	userType, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error("User type argument must be eaither 0 or 1 as a numeric string")
	}

	if userType == 0 && len(args) != 16 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 16")
	}
	if userType == 1 && len(args) != 18 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 18")
	}

	//Define
	nationality, err := strconv.Atoi(args[13])
	if err != nil {
		return shim.Error("Nationality argument must be eaither 0 or 1 as a numeric string")
	}
	var details = GeneralDetails{
		FirstName:     args[2],
		MiddleName:    args[3],
		LastName:      args[4],
		Education:     args[5],
		Employment:    args[6],
		BirthDate:     args[7],
		Gender:        args[8],
		MaritalStatus: args[9],
		EmailId1:      args[10],
		MobileNo:      args[11],
		Password:      args[12],
		Nationality:   nationality,
		NationalityId: args[14],
		Address:       args[15],
		LandsOwned:    []string{}}

	var user = User{UserId: args[0], UserType: userType, Details: details}

	if userType == 1 {
		var govUser = GovernmentUser{
			Department:  args[16],
			Designation: args[17]}
		user.GovUserInfo = &govUser
	}

	//Marshal
	userAsBytes, err := json.Marshal(user)
	if err != nil {
		return shim.Error(fmt.Sprintf("MarshallingError: %s", err))
	}

	//Add to the ledger world state
	err = stub.PutState(args[0], userAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("LegderCommitError: %s", err))
	}

	fmt.Printf("Successfully Added User %s\n", args[1])
	return shim.Success(nil)
}

func (s *SmartContract) addLandDetails(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Adding Land Details...\n")

	//args[0] - userType
	//args[1] - userId
	//args[2] - status

	//Validation
	userType, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error("User type argument must be either 0 or 1 numeric string")
	}

	fmt.Printf("Adding Land Details: %d\n", userType)
	//userType 0 is General User and 1 is Government user
	if userType == 0 && len(args) != 36 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 36")
	}
	if userType == 1 && len(args) != 30 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 30")
	}
	fmt.Printf("Adding Land Details pass args check\n")
	//genrate unique id
	//landUid, err := GetUId()
	// if err != nil {
	// 	return shim.Error(fmt.Sprintf("UIdError: %s", err))
	// }
	landUid := args[0]

	fmt.Printf("Adding Land Details: %s\n", landUid)
	//Define land details
	var locDetails = LandLocationDetails{
		Region:      args[4],
		WardNo:      args[5],
		BlockNo:     args[6],
		PlotNo:      args[7],
		District:    args[8],
		Address:     args[9],
		Location:    args[10],
		LandFeature: args[11],
		Village:     args[12],
		Kitongoji:   args[13]}

	var boundryDetails = LandBoundaryDetails{
		Npnorth: args[14],
		Npsouth: args[15],
		Npeast:  args[16],
		Npwest:  args[17]}

	var dimensionDetails = LandDimensionDetails{
		LandHeight: args[18],
		LandWidth:  args[19],
		LandArea:   args[20]}

	var landMarker []string
	fmt.Printf("Adding Land Details: structures formed\n")
	//Unmarshal land markers
	err = json.Unmarshal([]byte(args[22]), &landMarker)
	if err != nil {
		return shim.Error(err.Error())
	}

	var drawingDetails = DrawingDetails{
		MarkedArea:  args[21],
		LandMarkers: landMarker,
		LandLat:     args[23],
		LandLong:    args[24]}

	var docTitle = []DocumentTitle{}
	//Unmarshal uploaded doc title
	err = json.Unmarshal([]byte(args[25]), &docTitle)
	if err != nil {
		return shim.Error(err.Error())
	}

	status, err := strconv.Atoi(args[3])
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Printf("Adding Land Details: %d\n", status)
	var approvalStatus = ApprovalStatus{Status: status} //initialise status
	time_now, _ := stub.GetTxTimestamp()
	var landDetails = LandDetails{
		CertificateNo:           args[26],
		LandLocationInfo:        locDetails,
		LandDimensionInfo:       dimensionDetails,
		DrawingInfo:             drawingDetails,
		LandPurpose:             args[27],
		UploadTitle:             docTitle,
		BoundaryInfo:            boundryDetails,
		IsExtraApprovalRequired: args[28],
		TimeStamp:               time_now.AsTime()}

	var userLand = UserLand{LandId: landUid, UserId: args[2], ApprovalInfo: approvalStatus, LandInfo: landDetails}
	updateLandsOwnedList(stub, args[1], landUid)
	fmt.Printf("Adding Land Details: updated lands owned list\n")
	if userType == 0 { //0 for general user
		var leaseDetails = LeaseDetails{
			LeaseTermType:  args[29],
			LeaseTerm:      args[30],
			LeaseStartDate: args[31]}

		var genUserLand = GeneralUserLand{
			LandPurposeType: args[32],
			LandSecure:      args[33],
			LeaseInfo:       leaseDetails,
			CertificateType: args[34],
			OwnershipType:   args[35]}

		userLand.GenUserLandInfo = &genUserLand

	} else { // government user

		var govUserLand = GovUserLand{
			OwnershipDetails: args[29]}
		userLand.GovUserLandInfo = &govUserLand
	}

	err = marshalAndPutState(stub, landUid, userLand)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	fmt.Printf("Adding Land Details: updating...\n")
	err = updateStatusQueue(stub, -1, status, landUid)
	if err != nil {
		return shim.Error(fmt.Sprintf("StatusQueueError:: %s", err))
	}
	fmt.Printf("Adding Land Details: updated status queue\n")
	fmt.Printf("Successfully Added Land \n")
	return shim.Success(nil)

}

// add land id in user's LandsOwned array list
func updateLandsOwnedList(stub shim.ChaincodeStubInterface, userId string, landId string) error {

	var user = User{}
	err := getStateAndUnmarshal(stub, userId, &user)
	if err != nil {
		return fmt.Errorf("getStateAndUnmarshalError: %s", err)
	}

	user.Details.LandsOwned = append(user.Details.LandsOwned, landId)

	return (marshalAndPutState(stub, userId, user))
}

// Update Verifier1's Approval Information
func (s *SmartContract) updateVerifier1ApprovalInfo(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Updating Verifier1's approval status\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	landDetails.ApprovalInfo.Status = curStatus //update status and verifier1's comment
	landDetails.ApprovalInfo.Verifier1Comment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("updated verifier1 approval status\n\n")

	return shim.Success(nil)
}

// Update Verifier2's Approval Information
func (s *SmartContract) updateVerifier2ApprovalInfo(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Updating Verifier2's approval status\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}
	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	landDetails.ApprovalInfo.Status = curStatus //update status and verifier2's comment
	landDetails.ApprovalInfo.Verifier2Comment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

// Update Surveyor's Approval Information
func (s *SmartContract) updateSurveyorApprovalInfo(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("updating surveyor approval status\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	landDetails.ApprovalInfo.Status = curStatus //update status and Surveyor's comment
	landDetails.ApprovalInfo.SurveyorComment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

// Update Commisioner's Approval Information
func (s *SmartContract) updateCommissionerApprovalInfo(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("updating Commisioner's approval status\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	landDetails.ApprovalInfo.Status = curStatus //update status and Commissioner's comment
	landDetails.ApprovalInfo.CommissionerComment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

func (s *SmartContract) rejectedByVerifier1(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Update Verifier1's reject information\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	landDetails.ApprovalInfo.Status = curStatus //update status and Commissioner's comment
	landDetails.ApprovalInfo.RejectedBy = "commissioner"
	landDetails.ApprovalInfo.Verifier1Comment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

func (s *SmartContract) rejectedByVerifier2(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Update Verifier2's reject information\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	landDetails.ApprovalInfo.Status = curStatus //update status and Commissioner's comment
	landDetails.ApprovalInfo.RejectedBy = "verifier2"
	landDetails.ApprovalInfo.Verifier2Comment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

func (s *SmartContract) rejectedBySurveyor(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Update Surveyor's reject information\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	landDetails.ApprovalInfo.Status = curStatus //update status and Commissioner's comment
	landDetails.ApprovalInfo.RejectedBy = "surveyor"
	landDetails.ApprovalInfo.SurveyorComment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

func (s *SmartContract) rejectedByCommissioner(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Update Commisioner's reject information\n")
	if len(args) != 3 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 3")
	}

	var landDetails UserLand
	err := getStateAndUnmarshal(stub, args[0], &landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	prevStatus := landDetails.ApprovalInfo.Status
	curStatus, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	landDetails.ApprovalInfo.Status = curStatus //update status and Commissioner's comment
	landDetails.ApprovalInfo.RejectedBy = "commissioner"
	landDetails.ApprovalInfo.CommissionerComment = args[2]

	err = marshalAndPutState(stub, args[0], landDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	err = updateStatusQueue(stub, prevStatus, curStatus, args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("updateQueueError:: %s", err))
	}

	fmt.Printf("Updated successfully\n\n")

	return shim.Success(nil)
}

// Fetch land information from landId
func (s *SmartContract) fetchDetailsById(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Fetch details of id: %s\n", args[0])
	if len(args) != 1 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 1")
	}

	dataAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Printf("Fetching details is success\n\n")
	return shim.Success(dataAsBytes)
}

// Fetch all the Land Information of a User from its userId
func (s *SmartContract) fetchLandDetailsByUserId(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Fetch land details of user id: %s\n", args[0])

	var user = User{}
	err := getStateAndUnmarshal(stub, args[0], &user)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	var landIds = user.Details.LandsOwned //fetch landIds from userId
	landAsBytes, err := getStateFromArray(stub, landIds)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Printf("Successfully fetched Lands List ::: %s\n\n", string(landAsBytes))

	return shim.Success(landAsBytes)
}

func (s *SmartContract) fetchLandDetailsByStatus(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Fetch land details from status: %s\n", args[0])

	var sq StatusQueue
	err := getStateAndUnmarshal(stub, SQId, &sq)
	if err != nil {
		return shim.Error(err.Error())
	}

	status, err := strconv.Atoi(args[0])
	var landIds = sq.Queue[status] //fetch landIds from status
	landAsBytes, err := getStateFromArray(stub, landIds)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Printf("Successfully fetched Lands List ::: %s\n\n", string(landAsBytes))

	return shim.Success(landAsBytes)
}

// Get the history of Land from landId
func (s *SmartContract) getHistoryForLand(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1\n")
	}

	landId := args[0]

	fmt.Printf("- start getHistoryForland: %s\n", landId)

	resultsIterator, err := stub.GetHistoryForKey(landId)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the land
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON land)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatInt(response.Timestamp.Seconds, 10))
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForland returning:\n%s\n\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func GetUId() (string, error) {
	id, err := uuid.NewUUID()
	if err != nil {
		return "", err
	}
	return id.String(), err
}

func removeStrFromArr(s []string, r string) []string {
	for i, v := range s {
		if v == r {
			return append(s[:i], s[i+1:]...)
		}
	}
	return s
}

func getStateFromArray(stub shim.ChaincodeStubInterface, ids []string) ([]byte, error) {

	var buffer bytes.Buffer
	var isBufferEmpty = true

	for _, id := range ids {
		idAsBytes, err := stub.GetState(id)
		if err != nil {
			return nil, fmt.Errorf("GetWorldStateError: %s", err)
		}
		if isBufferEmpty == false {
			buffer.WriteString(",")
		}
		buffer.Write(idAsBytes)
		isBufferEmpty = false
	}

	return buffer.Bytes(), nil
}

func getStateAndUnmarshal(stub shim.ChaincodeStubInterface, id string, t interface{}) error {

	idAsBytes, err := stub.GetState(id)
	if err != nil {
		return fmt.Errorf("GetWorldStateError: %s", err)
	}

	//Unmarshal
	return (json.Unmarshal(idAsBytes, &t))
}
func marshalAndPutState(stub shim.ChaincodeStubInterface, id string, data interface{}) error {

	//Marshal
	dataAsBytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("MarshallingError: %s", err)
	}
	//Add to the ledger world state
	return (stub.PutState(id, dataAsBytes))
}

// =========================================================================================
// getQueryResultForQueryString executes the passed in query string.
// Result set is built and returned as a byte array containing the JSON results.
// =========================================================================================
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

// ===========================================================================================
// constructQueryResponseFromIterator constructs a JSON array containing query results from
// a given result iterator
// ===========================================================================================
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}

func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
