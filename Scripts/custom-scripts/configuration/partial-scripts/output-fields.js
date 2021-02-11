
$(function () {

    getOutputFields();

    //open add modal
    $("#add-field-btn").click(function () {
        $("#add-output-field-modal").modal("show");
    })

    //confirm add 
    $("#confirm-add-output-field-btn").click(function (e) {
        let outputField = $("#output-field").val();
        if (outputField == "" || outputField == null) {
            toastr.warning("Molimo unesite naziv izlaznog polja.");
            return;
        }
        addOutputField(outputField);
        $("#add-output-field-modal").modal("hide");
    })

})



/* --------------------------------------- METHODS ----------------------------------------------*/
function getOutputFields() {
    showLoader();
    $.get("/session_administration/Configuration/GetOutputField", function () {
    }).done(function (result) {
        populateOutputFieldsList(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja izlaznih polja!");
    }).always(function () {
        hideLoader();
    })
}

function addOutputField(outputField) {
    $.post("/session_administration/Configuration/InsertOutputField", { outputField: outputField }, function () {
        toastr.success("Uspješno uneseno novo polje!");
        getOutputFields();
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom unosa novog polja!");
    })
}

/* --------------------------------------- POPULATE ----------------------------------------------*/

function populateOutputFieldsList(list) {
    var html = "";
    html += "<ul class='list-group'>";
    for (var i = 0; i < list.length; i++) {
        html += "<li class='list-group-item'>" + list[i] + "</li>"
    }
    html += "</ul>";
    $("#output-fields-list").html(html);
}