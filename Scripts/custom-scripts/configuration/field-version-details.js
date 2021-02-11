let nextIndex = localStorage.getItem("index");
let method = localStorage.getItem("method");
let platform = localStorage.getItem("platform");

$(function () {
    getFieldVersionDetails();

    $(document).on('click', '#delete-field-ver-detail-modal-btn', function () {
        var $row = $(this).closest('tr');
        var index = $row.index();
        $("#version-detail-index").val(index);
        $("#delete-field-vers-detail-modal").modal("show");
    })

    $("#confirm-delete-version-detail-btn").click(function () {
        var index = $("#version-detail-index").val();
        deleteFieldVersionDetail(index);
        $("#delete-field-vers-detail-modal").modal("hide");
    })
})

function getFieldVersionDetails() {
    showLoader();
    let method = localStorage.getItem("method");
    let platform = localStorage.getItem("platform");
    let index = localStorage.getItem("index");

    $.get("/session_administration/Configuration/GetFieldVersionDetails?selectedPlatform=" + platform + "&selectedVersion=" + method + "&index=" + index, function () {
    }).done(function (result) {
        populateFieldVersionDetailsTbl(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja podataka!");
    }).always(function () {
        hideLoader();
    })
}

function confirmAddDetail() {
    let name = $("#field-name").val();
    let length = $("#field-length").val();

    if (name == "" || name == null || length == "" || length == null) {
        toastr.warning("Potrebno unijeti sva polja!");
        return;
    }

    if (isNaN(length)) {
        toastr.warning("Dužina mora biti u formatu cijelog broja!");
        return;
    }

    insertFieldVersionDetails(platform, method, nextIndex, name, length);
}

function insertFieldVersionDetails(platform, method, nextIndex, name, length) {
    //insert
    $.get("/session_administration/Configuration/InsertVersionDetail?selectedPlatform=" + platform
        + "&selectedVersion=" + method
        + "&index=" + nextIndex
        + "&name=" + name
        + "&length=" + length, function () {
    }).done(function (result) {
        getFieldVersionDetails();
        }).fail(function () {
            toastr.error("Dogodila se greška prilikom dodavanja!");
        }).always(function () {
            $("#add-field-vers-detail").modal("hide");
        })
}

function deleteFieldVersionDetail(detailIndex) {
    showLoader();
    $.get("/session_administration/Configuration/DeleteFieldVersionDetail?selectedPlatform=" + platform
        + "&selectedVersion=" + method
        + "&detailIndex=" + detailIndex
        + "&index=" + nextIndex, function () {
        }).done(function (result) {
            getFieldVersionDetails();
        }).fail(function () {
            toastr.error("Dogodila se greška prilikom brisanja!");
        }).always(function () {
            hideLoader();
        })
}

/*---------------------------------------POPULATE METHOD---------------------------------------------------- */

function populateFieldVersionDetailsTbl(list){

    var html = "";
    var counter = list.length;
    var html = "<table class='table table-hover'>"
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].FieldName + "</td>";
        html += "<td>" + list[i].FieldLength + "</td>";
        html += "<td><button id='delete-field-ver-detail-modal-btn' class='btn btn-custom'>Obriši</button></td>";
        html += "</tr>"
    }
    html += "</table>";
    $("#field-version-detals-tbl tbody").html(html);
}