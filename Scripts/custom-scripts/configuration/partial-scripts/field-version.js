$(function () {
    localStorage.clear();

    getVersionPlatforms();
    getMethodVersions();
    getFieldVersions($("#version-platforms").val());

    //on platform change, get field versions
    $("#version-platforms").change(function () {
        let selectedPlatform = $("#version-platforms").val();
        getFieldVersions(selectedPlatform);
    })

    //during insert modal: disable inputs based on method version
    $("#method-versions").change(function () {
        if ($("#method-versions").val() == "VersionStartDate") {
            $("#version-date-from").attr("disabled", false)
            $("#version-date-to").attr("disabled", false)
            $("#format").attr("disabled", true)
           
        } else {
            $("#version-date-from").val(null).attr("disabled", true)
            $("#version-date-to").val(null).attr("disabled", true)
            $("#format").val(null).attr("disabled", false)
        }
    })

    //confirm add version
    $("#confirm-add-btn").click(function () {
        confirmAddVersion();
    })

    //open add version modal
    $("#open-add-version-modal-btn").click(function () {
        openAddVersionModal();
    })

    //confirm delete version
    $(document).on('click', '#confirm-delete-field-version-btn', function () {
        confirmDeleteVersion();
    })

    //open version detail modal
    $(document).on('click', '#open-field-version-details-modal-btn', function () {
        var $row = $(this).closest('tr');
        var index = $row.index();
        var platform = $("#version-platforms").val();
        var format = $row.find('td:eq(1)').text();
        openFieldVersionDetails(index, platform, format)
    })

    //open version detail modal
    $(document).on('click', '#open-delete-version-modal-btn', function () {
        var $row = $(this).closest('tr');
        var index = $row.index();
        var platform = $("#version-platforms").val();
        var format = $row.find('td:eq(1)').text();
        openDeleteVersionModal(index, platform, format);
    })
})

/*--------------------------------------------------METHODS------------------------------------------------------------ */

function getVersionPlatforms() {
    $.ajax({
        url: "/session_administration/Configuration/GetPlatforms",
        type: "get",
        async: false,
        success: function (result) {
            populateVersionPlatformsDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

function getMethodVersions() {
    $.ajax({
        url: "/session_administration/Configuration/GetMethodVersions",
        type: "get",
        async: false,
        success: function (result) {
            populateMethodVersionsDdl(result);
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });
}

function getFieldVersions(selectedPlatform) {
    $.get("/session_administration/Configuration/GetFieldVersions?selectedPlatform=" + selectedPlatform, function () {
    }).done(function (result) {
        populateFieldVersionsTbl(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
    }).always(function () {
    })
}

function openDeleteVersionModal(index, selectedPlatform, format) {

    let method=";"
    if (format == "" || format == null)
       method = "VersionStartDate";
    else
        method = "VersionFileNameFormat";

    $("#ver-platform").val(selectedPlatform);
    $("#ver-method").val(method);
    $("#ver-index").val(index);

    $("#delete-version-modal").modal("show");

}

function openAddVersionModal() {

    getMethodVersions();

    //hide/show inputs
    $("#method-versions").change(function () {
        if ($("#method-versions").val() == "VersionStartDate") {
            $("#version-date-from").attr("disabled", false)
            $("#version-date-to").attr("disabled", false)
            $("#format").val("").attr("disabled", true)

        } else {
            $("#version-date-from").val(null).attr("disabled", true)
            $("#version-date-to").val(null).attr("disabled", true)
            $("#format").attr("disabled", false)
        }
    })

    //set datepickers
    $("#version-date-from, #version-date-to").datetimepicker({
        dateFormat: 'mm/dd/yy',
        timeFormat: 'HH:mm:ss',
        showMilliseconds: false,
        showMicroSeconds: false,
        stepHour: 1,
        stepMinute: 1,
        stepSecond: 1,
        timeText: 'Vrijeme',
        hourText: 'Sati',
        minuteText: 'Minute',
        secondText: 'Sekunde',
        currentText: 'Trenutno',
        closeText: 'Uredu'
    });


    //set inputs based on method version
    if ($("#method-versions").val() == "VersionStartDate") {
        $("#version-date-from").attr("disabled", false)
        $("#version-date-to").attr("disabled", false)
        $("#format").attr("disabled", true)

    } else {
        $("#version-date-from").val(null).attr("disabled", true)
        $("#version-date-to").val(null).attr("disabled", true)
        $("#format").val("").attr("disabled", false)
    }

    $("#add-version-modal").modal("show");

}

function confirmAddVersion() {
    let methodVersion = $("#method-versions").val();
    let version = $("#version").val();
    let format = $("#format").val();
    let dateFrom = $("#version-date-from").val();
    let dateTo = $("#version-date-to").val();


    /* 
     0 method is not defined
     1 file has different method defined
     2 file has the same method defined
     */

    //input validations
    if (methodVersion == "VersionFileNameFormat") {
        if (format == "" || format == null || version == "" || version == null) {
            toastr.warning("Potrebno unijeti sva polja!");
            return;
        }
    } else {
        if (version == "" || version == null || dateFrom == "" || dateFrom == null || dateTo == "" || dateTo == null) {
            toastr.warning("Potrebno unijeti sva polja!");
            return;
        }
    }



    //ako vec ima definisana razlicita metoda
    if (checkIfVersionExist($("#version-platforms").val(), methodVersion) == "1") {
        toastr.warning("Odabrana platforma ima već definisanu drugačiju metodu verzije!");
        return;
    }

    //unos formata, a  vec postoji format
    if (checkIfVersionExist($("#version-platforms").val(), methodVersion) == "2" && methodVersion == "VersionFileNameFormat") {
        toastr.warning("Nije moguće definisati više istih verzija formata!");
        return;
    } else {
        //date overlap
        if (methodVersion == "VersionStartDate") {

            //ispravni datumi sa unosa
            if (dateFrom > dateTo) {
                toastr.warning("Datum početka treba biti raniji od datuma završetka!");
                return;
            }

            if (checkDateOverlap($("#version-platforms").val(), methodVersion, dateFrom, dateTo) == "False") {
                toastr.warning("Došlo je do preklapanja intervala sa već postojećom verzijom!");
                return;
            }
        }
    }


  


    //insert
    $.get("/session_administration/Configuration/InsertFieldVersion?selectedPlatform=" + $("#version-platforms").val()
        + "&selectedVersion=" + $("#method-versions").val()
        + "&version=" + $("#version").val()
        + "&format=" + $("#format").val()
        + "&dateFrom=" + $("#version-date-from").val()
        + "&dateTo=" + $("#version-date-to").val(), function () {
        }).done(function (result) {
            getFieldVersions($("#version-platforms").val());
        }).fail(function () {
            toastr.error("Dogodila se greška prilikom dodavanja nove verzije!");
        }).always(function () {
            $("#add-version-modal").modal("hide");
        })
}

function openFieldVersionDetails(index, platform, format) {
    let method = ";"
    if (format == "" || format == null)
        method = "VersionStartDate";
    else
        method = "VersionFileNameFormat";

    localStorage.setItem("method", method);
    localStorage.setItem("platform", platform);
    localStorage.setItem("index", index);

    window.location.href = '/session_administration/Configuration/FieldVersionDetails';
}

function confirmDeleteVersion() {
    let selectedPlatform = $("#ver-platform").val();
    let method = $("#ver-method").val();
    let index = $("#ver-index").val();
  
    $.get("/session_administration/Configuration/DeleteFieldVersion?index=" + index + "&selectedPlatform=" + selectedPlatform + "&selectedVersion=" + method, function () {
    }).done(function (result) {
        getFieldVersions($("#version-platforms").val(), $("#method-versions").val());
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom brisanja verzije polja!");
    }).always(function () {

    })
    $("#delete-version-modal").modal("hide");
}

function checkIfVersionExist(selectedPlatform, selectedVersion) {
    let res = "";
    $.ajax({
        url: "/session_administration/Configuration/CheckIfVersionExist?selectedPlatform=" + selectedPlatform + "&selectedVersion=" + selectedVersion,
        type: "get",
        async: false,
        success: function (result) {
            res = result;
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom provjere ulaznih parametara!");
        }
    });

    return res;
}

function checkDateOverlap(selectedPlatform, selectedVersion, dateFrom, dateTo) {
    let res = "";
    $.ajax({
        url: "/session_administration/Configuration/CheckDateOverlap?selectedPlatform=" + selectedPlatform + "&selectedVersion=" + selectedVersion + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo,
        type: "get",
        async: false,
        success: function (result) {
            res = result;
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom provjere ulaznih parametara!");
        }
    });

    return res;
}

/* ---------------------------------------------- POPULATE METHODS --------------------------------------------------*/

function populateVersionPlatformsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#version-platforms").html(html);
}

function populateMethodVersionsDdl(list) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += "<option>" + list[i] + "</option>";
    }
    $("#method-versions").html(html);
}

function populateFieldVersionsTbl(list) {

    var html = "";
    var counter = list.length;
    var html = "<table class='table table-hover'>"
    html += "<thead><tr><th>Naziv verzija</th><th>Format naziva</th><th>Datum od</th><th>Datum do</th><th>Detalji</th><th>Brisanje</th></tr></thead><tbody>"
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].Version + "</td>";
        html += "<td>" + list[i].Format + "</td>";
        html += "<td>" + list[i].DateFrom.replace(/\//g, '.') + "</td>";
        html += "<td>" + list[i].DateTo.replace(/\//g, '.') + "</td>";
        html += "<td><button id='open-field-version-details-modal-btn' class='btn btn-custom'>Pregled</button></td>";
        html += "<td><button id='open-delete-version-modal-btn' class='btn btn-custom'>Obriši</button></td>";
        html += "</tr>"
    }
    html += "</tbody></table>";
    $("#field-version-tbl").html(html);
}


