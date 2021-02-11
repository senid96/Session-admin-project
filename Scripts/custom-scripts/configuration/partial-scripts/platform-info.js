$(function () {

    getPlatformInformations();

    //on click btn, open add modal
    $("#add-platform-info").click(function () {
        addPlatformOpenModal();
    })

   

    //open modal for platform delete
    $(document).on('click', '.open-modal-delete-platform', function (e) {
        var $row = $(this).closest('tr');
        var index = $row.index();
        var platformId = $row.find('td:eq(0)').text();
        var platformName = $row.find('td:eq(1)').text();

        deletePlatformOpenModal(index, platformId, platformName);
    })

    //confirm delete platform
    $("#confirm-delete-platform-btn").click(function () {
        confirmDelete();
    })

    //confirm add platform
    $("#confirm-add-platform-btn").click(function () {
        confirmAdd();
    })

   
})

/*-------------------------------------METHODS------------------------------------------------------------ */


function confirmDelete() {
    showLoader();
    $.get("/session_administration/Configuration/DeletePlatformInformation?index=" + $("#index").val() + "&platformId=" + $("#platform-id").val() + "&platformName=" + $("#platform-name").val(), function () {
    }).done(function () {
        getPlatformInformations();
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom brisanja!");
    }).always(function () {
        hideLoader();
    })
}

function confirmAdd() {

    let obj = {
        PlatformId: $("#platform-id-add").val(),
        Platform: $("#platform").val(),
        InputFilePath: $("#input-file-path").val(),
        InputFileFormat: $("#input-file-format").val(),
        OutputFileDirectory: $("#output-directory").val(),
        OriginFileDirectory: $("#origin-directory").val(),
        FTPServer: $("#ftp-server").val(),
        Port: $("#port").val(),
        Username: $("#username").val(),
        Password: $("#password").val(),
        IncomingInterval: $("#incoming-interval").val()
    };

    if (isNull(obj) == true) {
        toastr.warning("Molimo da popunite sva polja!");
        return;
    }

    if (isNaN(obj.IncomingInterval)) {
        toastr.warning("Interval mora biti u formatu cijelog broja!");
        return;
    }

    if (isNaN(obj.Port)) {
        toastr.warning("Port mora biti u formatu cijelog broja!");
        return;
    }

    showLoader();
    $("#add-platform-info-modal").modal("hide");
    obj = JSON.stringify({ 'obj': obj });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/Configuration/AddPlatformInformation',
        data: obj,
        success: function () {
            toastr.success("Uspješno dodan zapis!");
            getPlatformInformations();
            hideLoader();
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dodavanja!");
            hideLoader();
        }
    })
}

function addPlatformOpenModal() {

    let nextIndex = $('#platform-info-tbl tr:last').find("td")[0].textContent;
    nextIndex = parseInt(nextIndex, 10) + 1;
    $("#platform-id-add").val(nextIndex);
    $("#add-platform-info-modal").modal("show");

}

function deletePlatformOpenModal(index, platformId, platformName) {
    $("#index").val(index);
    $("#platform-id").val(platformId);
    $("#platform-name").val(platformName);
    $("#confirm-delete-modal").modal("show");
} 

function getPlatformInformations() {
    $.get("/session_administration/Configuration/GetPlatformInformations", function () {
    }).done(function (result) {
        populatePlatformInfoTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja informacija o platformi!");
    }).always(function () {
    })
}


/*-------------------------------------POPULATE ------------------------------------------------------------ */

function populatePlatformInfoTable(list) {
    var html = "";
    var counter = list.length;
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].PlatformId + "</td>";
        html += "<td>" + list[i].Platform + "</td>";
        html += "<td>" + list[i].InputFilePath + "</td>";
        html += "<td>" + list[i].InputFileFormat + "</td>";
        html += "<td>" + list[i].OriginFileDirectory + "</td>";
        html += "<td>" + list[i].OutputFileDirectory + "</td>";
        html += "<td>" + list[i].FTPServer + "</td>";
        html += "<td>" + list[i].Port + "</td>";
        html += "<td>" + list[i].Username + "</td>";
        html += "<td>" + list[i].Password + "</td>";
        html += "<td>" + list[i].IncomingInterval + "</td>";
        html += "<td><button class='btn btn-custom open-modal-delete-platform'>Obriši</button></td>";
        html += "</tr>"
    }
    $("#platform-info-tbl tbody").html(html);
}