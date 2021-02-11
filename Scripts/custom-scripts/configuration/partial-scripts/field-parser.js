$(function () {
    getParsePlatforms();
    getFieldParser();

    //on platform change, get field parsers
    $("#parse-platforms").change(function () {
        getFieldParser();
    })

    $("#add-new-parser-modal").click(function () {
        getFileParserTypes();

        if ($("#file-parser-type").val() == "FixedLengthParser")
            $("#delimiters").val("").attr("disabled", true)

        $("#add-field-parser-modal").modal("show");
    })

    //on parser type change, disable/enable delimiter input field
    $("#file-parser-type").change(function () {
        if ($(this).val() == "FixedLengthParser") 
            $("#delimiters").val("").attr("disabled", true)
         else 
            $("#delimiters").val("").attr("disabled", false)
        
    })

    $("#add-field-parser-modal-btn").click(function () {
        addParserModal();
    })

    $("#confirm-add-field-parser").click(function () {
        confirmInsertParser();
    })
})


/* --------------------------------------- METHODS ----------------------------------------------*/

function getParsePlatforms() {
    $.ajax({
        url: "/session_administration/Configuration/GetPlatforms",
        type: "get",
        async: false,
        success: function (result) {
            populateParsePlatformsDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

function getFileParserTypes() {
    $.ajax({
        url: "/session_administration/Configuration/GetParserTypes",
        type: "get",
        async: false,
        success: function (result) {
            populateFileParserTypesDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja tipova parsera!");        }
    });
}

function getFieldParser() {
    $.get("/session_administration/Configuration/GetFieldParser?selectedPlatform=" + $("#parse-platforms").val(), function () {
    }).done(function (result) {
        populateFieldParseTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja polja!");
    }).always(function () {
    })
}

function deleteAndInsertFieldParser(platform, fileType, skipLines, delimiters, index) {
    showLoader();
    $.get("/session_administration/Configuration/DeleteFileParser?index=" + index + "&platform=" + platform, function () {
    }).done(function (result) {
        insertFieldParser(platform, fileType, skipLines, delimiters);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja polja!");
    }).always(function () {
        hideLoader();
    })
}

function insertFieldParser(platform, fileType, skipLines, delimiters) {
    showLoader();
    $.get("/session_administration/Configuration/InsertFileParser?platform=" + platform + "&parserType=" + fileType + "&delimiters=" + delimiters + "&skipLines=" + skipLines, function () {
    }).done(function (result) {
        getFieldParser();
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja polja!");
    }).always(function () {
        hideLoader();
    })
}

function confirmInsertParser() {

    //values to insert
    let delimiters = $("#delimiters").val();
    let skipLines = $("#skip-lines").val();
    let fileType = $("#file-parser-type").val();
    let platform = $("#parse-platforms").val();
    //validation
    if ($("#file-parser-type").val() == "FixedLengthParser") {
        if (skipLines == "" || skipLines == null || fileType == "" || fileType == null) {
            toastr.warning("Unos svih polja je obavezan!");
            return;
        }
    } else {
        if (delimiters == "" || delimiters == null || skipLines == "" || skipLines == null || fileType == "" || fileType == null) {
            toastr.warning("Unos svih polja je obavezan!");
            return;
        }
    }

    if (isNaN(skipLines) == true) {
        toastr.warning("Broj linija koje treba preskočiti mora biti cijeli broj!");
        return;
    }

    let rowLength = $('#field-parse-tbl tr').length;
    let index = $('#field-parse-tbl tr:first').index();
    
    if (rowLength == 1) { //if parser do not exist, just insert it
         insertFieldParser(platform, fileType, skipLines, delimiters);
    } else { //if parser exist, first delete it and insert new one
         deleteAndInsertFieldParser(platform, fileType, skipLines, delimiters, index);
    }
    $("#add-field-parser-modal").modal("hide");
}

function addParserModal() {
    getFileParserTypes();

    if ($("#file-parser-type").val() == "FixedLengthParser")
        $("#delimiters").val("").attr("disabled", true)

    $("#add-field-parser-modal").modal("show");
}

/* --------------------------------------- POPULATE METHODS ----------------------------------------------*/

function populateParsePlatformsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#parse-platforms").html(html);
}

function populateFileParserTypesDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#file-parser-type").html(html);
}

function populateFieldParseTable(list) {
    var html = "";
    var counter = list.length;
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].FileType + "</td>";
        html += "<td>" + list[i].SkipLines + "</td>";
        html += "<td>" + (list[i].Delimiters === null ? '' : list[i].Delimiters) + "</td>";
        html += "</tr>"
    }
    $("#field-parse-tbl tbody").html(html);
}