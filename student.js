var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";

var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";
var connToken = "90935285|-31949236039672868|90958103";

$("#rollNo").focus();

function saveRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
}

function getRecNoFromLS() {
    return localStorage.getItem("recno");
}

function resetForm() {
    $("#studentForm")[0].reset();

    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", true);
    $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);

    $("#rollNo").prop("disabled", false).focus();
}

function validateData() {
    if (
        $("#rollNo").val() === "" ||
        $("#fullName").val() === "" ||
        $("#studentClass").val() === "" ||
        $("#birthDate").val() === "" ||
        $("#address").val() === "" ||
        $("#enrollDate").val() === ""
    ) {
        alert("All fields are required!");
        return "";
    }

    return JSON.stringify({
        "Roll-No": $("#rollNo").val(),
        "Full-Name": $("#fullName").val(),
        "Class": $("#studentClass").val(),
        "Birth-Date": $("#birthDate").val(),
        "Address": $("#address").val(),
        "Enrollment-Date": $("#enrollDate").val()
    });
}

function getStudent() {
    var roll = $("#rollNo").val();

    var jsonStr = {"Roll-No": roll};

    var req = createGET_BY_KEYRequest(connToken, dbName, relName, JSON.stringify(jsonStr));

    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIRL);

    if (result.status === 400) {
        // NEW RECORD
        $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#saveBtn, #resetBtn").prop("disabled", false);

        $("#fullName").focus();
    } else if (result.status === 200) {
        // EXISTING RECORD
        var data = JSON.parse(result.data).record;

        saveRecNo2LS(result);

        $("#rollNo").prop("disabled", true);

        $("#fullName").val(data["Full-Name"]);
        $("#studentClass").val(data["Class"]);
        $("#birthDate").val(data["Birth-Date"]);
        $("#address").val(data["Address"]);
        $("#enrollDate").val(data["Enrollment-Date"]);

        $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
        $("#updateBtn, #resetBtn").prop("disabled", false);

        $("#fullName").focus();
    }
}

function saveData() {
    var jsonStr = validateData();
    if (jsonStr === "") return;

    var req = createPUTRequest(connToken, jsonStr, dbName, relName);

    jQuery.ajaxSetup({async: false});
    executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIML);

    alert("Student saved successfully!");
    resetForm();
}

function updateData() {
    var jsonStr = validateData();
    if (jsonStr === "") return;

    var rec_no = getRecNoFromLS();

    var req = createUPDATERecordRequest(connToken, jsonStr, dbName, relName, rec_no);

    jQuery.ajaxSetup({async: false});
    executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIML);

    alert("Student updated successfully!");
    resetForm();
}