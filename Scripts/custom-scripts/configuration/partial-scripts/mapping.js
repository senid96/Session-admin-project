$(function () {
    getMappingPlatforms();
    getTransformations();
    getFieldVersions();
    getInputFields();
    getOutputList();
    getMappings();

    //on platform change, get mappings, field version and input fields
    $("#platform-mapping").change(function () {
        getMappings();
        getFieldVersions();
        getInputFields();
    })

    //on field version change, get input fields
    $("#input-version-mapping").change(function () {
        getInputFields();
    })

    //map parameters
    $("#map-btn").click(function () {
        map();
    })

    //open delete modal
    $(document).on('click', '.open-delete-maping-modal-btn', function (e) {
        var $row = $(this).closest('tr');
        var index = $row.index();
        var platform = $("#platform-mapping").val();

        openDeleteMappingModal(index, platform);
    })

    //confirm mapping delete
    $("#confirm-mapping-delete-btn").click(function () {
        confirmDeleteMapping();
    })

})

/*---------------------------------------METHODS--------------------------------------------------------- */

function getMappingPlatforms() {
    $.ajax({
        url: "/session_administration/Configuration/GetPlatforms",
        type: "get",
        async: false,
        success: function (result) {
            populateMappingPlatformsDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

function getTransformations() {
    $.get("/session_administration/Configuration/GetTransformations", function () {
    }).done(function (result) {
        populateMappingTransformationDdl(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
    }).always(function () {
    })
}

function getInputFields() {
    let platform = $("#platform-mapping").val();
    let version = $("#input-version-mapping").val();
    console.log(platform);
    $.get("/session_administration/Configuration/GetInputList?platform=" + platform + "&version=" + version, function () {
    }).done(function (result) {
        populateMappingInputFieldsDdl(result)
    }).fail(function () {
        $("#mapping-table tbody").html("");
        toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
    }).always(function () {
    })
}

function getOutputList() {
    $.get("/session_administration/Configuration/GetOutputList", function () {
    }).done(function (result) {
        populateMappingOutputFieldsDdl(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
    }).always(function () {
    })
}

function map() {
    let platform = $("#platform-mapping").val();
    let transform = $("#transformation-mapping").val();
    let inputField = $("#input-field-mapping").val();
    let outputField = $("#output-field-mapping").val();
    let transformParam = $("#transform-param").val();

    let transformation = transform + "(" + transformParam + ");";
    if (transform == "" || transform == null || inputField == "" || inputField == null || outputField == "" || outputField == null) {
        toastr.warning("Molimo popunite obavezna polja!");
        return;
    }
    showLoader();
    $.get("/session_administration/Configuration/Map?platform=" + platform + "&inputField=" + inputField + "&outputField=" + outputField + "&transform=" + transformation, function () {
    }).done(function (result) {
       //TODO populate table
        getMappings();
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom mapiranja!");
    }).always(function () {
        hideLoader();
    })
   
}

function getMappings() {
    showLoader();
    let platform = $("#platform-mapping").val();
    console.log(platform);
    $.get("/session_administration/Configuration/GetMappings?platform=" + platform, function () {
    }).done(function (result) {
        populateMappingTbl(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja podataka!");
    }).always(function () {
        hideLoader();
    })
}

function openDeleteMappingModal(index, platform) {
    $("#delete-mapping-modal").modal("show");
    $("#map-index").val(index);
    $("#map-platform").val(platform);
}

function confirmDeleteMapping() {
    showLoader();
    let platform = $("#map-platform").val();
    let index = $("#map-index").val();
    $.get("/session_administration/Configuration/DeleteMapping?platform=" + platform + "&index=" + index, function () {
    }).done(function (result) {
        getMappings()
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja podataka!");
    }).always(function () {
        hideLoader();
    })
    $("#delete-mapping-modal").modal("hide");

}

function getFieldVersions() {
    let selectedPlatform = $("#platform-mapping").val();
    $.ajax({
        url: "/session_administration/Configuration/GetFieldVersions?selectedPlatform=" + selectedPlatform,
        type: "get",
        async: false,
        success: function (result) {
            populateInputVersionDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

/*---------------------------------------POPULATE--------------------------------------------------------- */

function populateMappingPlatformsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#platform-mapping").html(html);
}

function populateMappingTransformationDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#transformation-mapping").html(html);
}

function populateMappingInputFieldsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#input-field-mapping").html(html);
}

function populateMappingOutputFieldsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#output-field-mapping").html(html);
}

function populateMappingTbl(list) {

    var html = "";
    var counter = list.length;
    var html = "";
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].InputField + "</td>";
        html += "<td>" + list[i].Transformation + "</td>";
        html += "<td>" + list[i].OutputField + "</td>";
        html += "<td><button class='btn btn-custom open-delete-maping-modal-btn'>Obriši</button></td>";
        html += "</tr>"
    }
    html += "</tbody></table>";
    $("#mapping-table tbody").html(html);
}

function populateInputVersionDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i].Version+ "</option>";
    }
    $("#input-version-mapping").html(html);
}