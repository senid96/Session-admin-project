
$(function () {

    getAdditionalConfiguration();

    //open save conf modal
    $(document).on('click', '#open-save-conf-modal-btn', function () {
        openModalSaveConfiguration();
    })

    //confirm save configuration
    $("#confirm-save-btn").click(function () {
        saveConfiguration();
    })

})

function getAdditionalConfiguration() {
    showLoader();
    $.get("/session_administration/Configuration/GetAdditionalConfiguration", function () {
    }).done(function (result) {
        populateAdditionalConfigurationTbl(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja izlaznih polja!");
    }).always(function () {
        hideLoader();
    })
}

//open confirm modal 
function openModalSaveConfiguration() {

        let newConfig = {
        StartupTimeout: $("#startup-timeout").val(),
        StartTransfer: $("#start-transfer").val(),
        FileCreatedTimeout: $("#file-timeout").val(),
        NumberOfThreads: $("#threads").val(),
        ProcessedDirectory: $("#processed-directory").val(),
        TarificationDirectory: $("#tarification-directory").val(),
        TariffDirectory: $("#tariff-directory").val(),
        TariffExtension: $("#tariff-extension").val(),
        RejDirectory: $("#rej-directory").val(),
        RejExtension: $("#rej-extension").val(),
        ErrExtension: $("#err-extension").val(),
        ErrDirectory: $("#err-directory").val()
    };
    if (isNull(newConfig) == true) {
        toastr.warning("Molimo da popunite sva polja!");
        return;
    }
    newConfig = JSON.stringify({ 'newConfig': newConfig });
    localStorage.setItem("newConfig", newConfig);
    $("#confirm-save-config-modal").modal("show");
   // saveConfiguration(newConfig);
}

function saveConfiguration() {
    let config = localStorage.getItem("newConfig");
    showLoader();
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/Configuration/SaveConfiguration',
        data: config,
        success: function () {
            toastr.success("Konfiguracija uspješno spašena!");
            getAdditionalConfiguration();
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom snimanja konfiguracije!");
            hideLoader();
        }
    })
    $("#confirm-save-config-modal").modal("hide");
}

function populateAdditionalConfigurationTbl(obj) {
    var html = "";
    var html = "<table id='config-tbl' class='table'><thead><tr><th>Opis</th><th>Parametar</th></tr></thead><tbody>"
    html += "<tr>";
    html += "<td >Direktorij za procesirane fajlove: </td>";
    html += "<td><input id='processed-directory' class='form-control form-control-custom' type='text' value='" + obj.ProcessedDirectory + "' /></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Ulazni tarifikacijski direktorij: </td>";
    html += "<td><input id='tarification-directory' class='form-control form-control-custom' type='text' value='" + obj.TarificationDirectory + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Direktorij za uspješno procesirane fajlove:</td>";
    html += "<td><input id='tariff-directory' class='form-control form-control-custom' type='text' value='" + obj.TariffDirectory + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Ekstenzija uspješno obrađenog fajla: </td>";
    html += "<td><input id='tariff-extension' class='form-control form-control-custom' type='text' value='" + obj.TariffExtension + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Direktorij za odbačene fajlove: </td>";
    html += "<td><input id='rej-directory' class='form-control form-control-custom' type='text' value='" + obj.RejDirectory + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Ekstenzija odbačenog fajla: </td>";
    html += "<td><input id='rej-extension' class='form-control form-control-custom' type='text' value='" + obj.RejExtension + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Direktorij za fajlove sa greškom: </td>";
    html += "<td><input id='err-directory' class='form-control form-control-custom' type='text' value='" + obj.ErrDirectory + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Ekstenzija fajlova sa greškom: </td>";
    html += "<td><input id='err-extension' class='form-control form-control-custom' type='text' value='" + obj.ErrExtension + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Vrijeme čekanja na početaj obrade: </td>";
    html += "<td><input id='startup-timeout' class='form-control form-control-custom' type='text' value='" + obj.StartupTimeout + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Vrijeme čekanja slanja na FTP server: </td>";
    html += "<td><input id='start-transfer' class='form-control form-control-custom' type='text' value='" + obj.StartTransfer + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Vrijeme čekanja na kreiranje fajla: </td>";
    html += "<td><input id='file-timeout' class='form-control form-control-custom' type='text' value='" + obj.FileCreatedTimeout + "'/></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td>Broj threadova: </td>";
    html += "<td><input id='threads' class='form-control form-control-custom' type='text' value='" + obj.NumberOfThreads + "'/></td>";
    html += "</tr>";
    html += "</tbody></table>";
    html += "<button class='btn btn-custom' id='open-save-conf-modal-btn'>Spasi konfiguraciju</button>"

    $("#additional-conf").html(html);
}
