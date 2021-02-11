
$(function () {

    //populate platform drop down 
    getPlatforms();
    getFieldValidations();

    //on platform change, get field validations
    $("#validation-platforms").change(function () {
        getFieldValidations();
    })

    //on field version change, get input fields
    $("#input-field-version").change(function () {
        getInputFieldsValidation();
    })

    //prepare dropdowns, input fields and open modal for inserting new field validation
    $("#add-validation-field-btn").click(function () {
        $("#date-from, #date-to").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: "-20:+1",
            showButtonPanel: false,
            dateFormat: "mm/dd/yy",
            onSelect: function () { }
        });

        getFieldVersionsValidation();
        getInputFieldsValidation();

        getValidationRules();
        getOutputFileTypes();
        $("#add-validation-field-modal").modal("show");
    })

    //confirm inserting new validation field
    $("#confirm-add-validation-field-btn").click(function () {
        let inputField = $("#input-field").val();
        let validationRule = $("#validation-rules").val();
        let dateFrom = $("#date-from").val();
        let dateTo = $("#date-to").val();
        let fieldValues = $("#validation-fields").val();
        let outputFileType = $("#output-file-types").val();
        let platform = $("#validation-platforms").val(); 

        let obj = {
            Platform: platform,
            InputField: inputField,
            ValidationRule: validationRule,
            OutputFileType: outputFileType,
            DateFrom: dateFrom,
            DateTo: dateTo,
            FieldValues: fieldValues
        };

        if (isNull(obj) == true) {
            toastr.warning("Obavezan unos svih polja!");
            return;
        }
        
        insertFieldValidation(obj);

        $("#add-validation-field-modal").modal("hide");
    })

    //confirm delete of field validation
    $("#confirm-delete-btn").on('click', function () {
        deleteFieldValidation();
    })

    $(document).on('click', '#delete-file-control', function () {
        var $row = $(this).closest('tr');
        var index = $row.index();
        openModalDeleteFieldValidation(index);
        })

})


/* --------------------------------------- METHODS ----------------------------------------------*/

function getFieldValidations() {
    showLoader();
    let platformName = $("#validation-platforms").val();
    $.get("/session_administration/Configuration/GetFieldValidations?platformName=" + platformName, function () {
    }).done(function (result) {
        populateFieldValidationsTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja validacijskih polja!");
        $("#field-validation-tbl").html(html);
    }).always(function () {
        hideLoader();
    })
}

function getValidationRules() {
    $.get("/session_administration/Configuration/GetValidationRules", function () {
    }).done(function (result) {
        populateValidationRulesDdl(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja validacijskih pravila!");
    }).always(function () {
    })
}

function getOutputFileTypes() {
    $.get("/session_administration/Configuration/GetOutputFileTypes", function () {
    }).done(function (result) {
        populateOutputFileTypesDdl(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja izlaznih tipova fajla!");
    }).always(function () {
    })
}

//opens modal for confirmation
function openModalDeleteFieldValidation(line) {
    $("#delete-field-validation-modal").modal("show");
    $("#line").val(line); //set param in modal
}

function deleteFieldValidation() {
    showLoader();
    let line = $("#line").val();
    let platform = $("#validation-platforms").val();
    $.get("/session_administration/Configuration/DeleteFieldValidation?selectedPlatform=" + platform + "&line=" + line, function () {
    }).done(function (result) {
        getFieldValidations();
        toastr.success("Uspješno obrisano!");
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom brisanja validacijskog polja!");
    }).always(function () {
        hideLoader();
    })
}

function getPlatforms() {
    $.ajax({
        url: "/session_administration/Configuration/GetPlatforms",
        type: "get",
        async: false,
        success: function (result) {
            populatePlatformsDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

function getFieldVersionsValidation() {
    let selectedPlatform = $("#validation-platforms").val();
    $.ajax({
        url: "/session_administration/Configuration/GetFieldVersions?selectedPlatform=" + selectedPlatform,
        type: "get",
        async: false,
        success: function (result) {
            populateInputVersionValidationDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

function getInputFieldsValidation() {
    let platform = $("#validation-platforms").val();
    let version = $("#input-field-version").val();
    $.get("/session_administration/Configuration/GetInputList?platform=" + platform + "&version=" + version, function () {
    }).done(function (result) {
        populateValidationInputFieldsDdl(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja podataka!");
    }).always(function () {
    })
}

function insertFieldValidation(obj) {
    obj = JSON.stringify({ 'obj': obj });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/Configuration/AddFieldValidation',
        data: obj,
        success: function () {
            getFieldValidations();
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom unosa!");
        }
    });
}


/* --------------------------------------- POPULATE METHODS ----------------------------------------------*/

function populateValidationRulesDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>"
    }
    $("#validation-rules").html(html);
}

function populateOutputFileTypesDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>"
    }
    $("#output-file-types").html(html);
}

function populateFieldValidationsTable(list) {

    var html = "";
    var counter = list.length;
    var html = "<table class='table table-hover'>"
    html += "<thead><tr><th>Ulazno polje</th><th>Pravilo validacije</th><th>Datum od</th><th>Datum do</th><th>Vrijednosti za validaciju</th><th>Tip izlaznog fajla</th><th>Akcija</th></tr></thead><tbody>"
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].InputField + "</td>";
        html += "<td>" + list[i].ValidationRule + "</td>";
        html += "<td>" + convertTimestampToDate(list[i].DateFrom) + "</td>";
        html += "<td>" + convertTimestampToDate(list[i].DateTo) + "</td>";
        html += "<td>" + list[i].ValidationValues + "</td>";
        html += "<td>" + list[i].OutputFileType + "</td>";
        html += "<td><button id='delete-file-control' class='btn btn-custom'>Obriši</button></td>";
        html += "</tr>"
    }
    html += "</tbody></table>";
    $("#field-validation-tbl").html(html);
}

function populatePlatformsDdl(list){
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#validation-platforms").html(html);
}

function populateInputVersionValidationDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i].Version + "</option>";
    }
    $("#input-field-version").html(html);
}

function populateValidationInputFieldsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#input-field").html(html);
}
