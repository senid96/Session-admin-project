
$(function () {

    var rowIndexEdit;
    var scrollTop;
    getCDRsBySessionId();

    //open confirm update modal
    $("#update-cdr-btn").on('click', function () {
        $("#confirm-cdr-update-modal").modal("show");
        $("#cdr-fields-modal").modal("hide");
    })

    //confirm update
    $("#confirm-fields-update-btn").on('click', function () {
        updateCDRFields(scrollTop);
    })

    //cancel update
    $("#confirm-update-cancel-btn").on('click', function () {
      //  $("#cdr-fields-modal").modal("show");
    })

    $(document).on('click', '.edit-cdr-fields-modal', function (e) {
        var $row = $(this).closest('tr');
        var rowIndex = $row.index();
        scrollTop = $row.offset().top;
        //console.log('scrollTop: ' + scrollTop);
        var cdrId = $row.find('td:eq(0)').text();
        getCdrFieldsModal(cdrId,rowIndex)
    })

    //enable field edit button click
    $(document).on('click', '#enable-field-edit-btn', function (e) {
        var $row = $(this).closest('tr');
        var rowIndex = $row.index();
        scrollTop = $row.offset().top;
        var cdrId = $row.find('td:eq(0)').text();
        console.log('mess: cdrID' + cdrId + 'index reda:' + rowIndex);
        updateCdrStatusError(cdrId, 2, rowIndex);
        
    })

    //disable field edit button click
    $(document).on('click', '#disable-field-edit-btn', function (e) {
        console.log('treba ponisitit');
        var $row = $(this).closest('tr');
        var rowIndex = $row.index();
        var cdrId = $row.find('td:eq(0)').text();
        updateCdrStatusError(cdrId, 0, rowIndex);
    })
    
    if (window.history && window.history.pushState) {
        localStorage.setItem("isPostBack", 1);
    }
   
})

/* --------------------------------------- METHODS ----------------------------------------------*/
function getCDRsBySessionId() {
    let sessionId = $("#session-id").val(); 
    showLoader();
    $.get("/session_administration/SuspendedDetails/GetCDRsBySessionId?sessionId=" + sessionId, function () {
    }).done(function (result) {
        populateCDRTable(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja cdr-ova!");
    }).always(function () {
        hideLoader();
    })
}

function getErrorFieldsOfSuspendedCDR(cdrId) {
    $.get("/session_administration/SuspendedDetails/GetErrorFieldsOfSuspendedCDR?cdrId=" + cdrId, function () {
    }).done(function (result) {
        populateErrorFieldsOfSuspendedCDR(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja cdr polja!");
    }).always(function () {
    })
}

function getAllFieldsOfSuspendedCDR(cdrId) {
    $.get("/session_administration/SuspendedDetails/GetAllFieldsOfSuspendedCDR?cdrId=" + cdrId, function () {
    }).done(function (result) {
        populateAllFieldsOfSuspendedCDRTable(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja cdr polja!");
    }).always(function () {
    })
}

function getCdrFieldsModal(cdrId,rowIndex) {
    getErrorFieldsOfSuspendedCDR(cdrId);
    getAllFieldsOfSuspendedCDR(cdrId);
    rowIndexEdit = rowIndex;
    $("#cdr-fields-modal").modal("show");
}

function updateCDRFields(scrollTopValue) {
    showLoaderFixedScroll(scrollTopValue);
    let cdrValue = "";
    let cdrList = [];
    $("#all-fields-suspended-cdr-tbl tr").each(function () {
        if ($(this).find("td").eq(0).text() != "") {
            //update only edited fields
            if ($(this).find("td").eq(3).find(":input").hasClass("edited-field")) {
                cdrValue = { CdrId: $(this).find("td").eq(0).html(), NtsFieldId: $(this).find("td").eq(1).html(), FieldValue: $(this).find("td").eq(3).find(":input").val() };
                cdrList.push(cdrValue); //napuni listu id-jeva
            }
        }
    });
    
    //console.log(cdrList);
    cdrList = JSON.stringify({ 'cdrList': cdrList });
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/SuspendedDetails/UpdateCDRFields',
        data: cdrList,
        success: function () {
            toastr.success("Uspješno izmjenjena CDR polja!");
            //getCDRsBySessionId();
            //console.log('Uspjesne izmjene: rowIndexEdit ' + rowIndexEdit)
            setCdrStatus(1, rowIndexEdit);
            hideLoader();
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom izmjene polja!");
            hideLoader();
        }
    })
    $("#update-cdr-btn").attr("disabled", true);
}

function updateCdrStatusError(cdrId, status, rowIndex) {
    $.get("/session_administration/SuspendedDetails/UpdateCdrStatusError?cdrId=" + cdrId + "&status=" + status, function () {
        // getCDRsBySessionId(); 
        console.log('odbacen');
        setCdrStatus(status, rowIndex);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom izmjene statusa!");
    }).always(function () {
        hideLoader();
    })
}

/* --------------------------------------- POPULATE METHODS ----------------------------------------------*/

function populateErrorFieldsOfSuspendedCDR(list) {
   
    var html = "";
    var counter = list.length;
    var html = "<caption>Polja sa greškom</caption><thead><tr><th>Polje</th><th>Vrijednost polja</th><th>Validacijsko pravilo</th></tr></thead><tbody>"
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].ErrorFieldKey + "</td>";
        html += "<td>" + list[i].ErrorFieldValue + "</td>";
        html += "<td>" + list[i].ValidationRule + "</td>";
      //  html += "<td>" + list[i].ValidationErrorValue + "</td>";
        html += "</tr>"
    }
    html += "</tbody>";
    $("#error-fields-suspended-cdr-tbl").html(html);
}

function setCdrStatus(status, rowIndex) {
    //"<button class='btn btn-custom' id='disable-field-edit-btn'>Poništi odbacivanje</button>"

    var statusText = "CDR Nekorigovan"   
    //console.log('passed status: ' + status);
    var element = document.getElementById('cdr-table');
    var tbody = element.children[1];
    var tr = tbody.children[rowIndex];

    if (status == 2) {
        statusText = "CDR Odbacen";
        tr.children[6].innerHTML = "<button class='btn btn-custom' id='disable-field-edit-btn'>Poništi odbacivanje</button>";
        tr.children[7].innerHTML = "<button disabled class='btn btn-custom edit-cdr-fields-modal'>Uredi</button>";   
    }
    else if (status == 0)
    {
        tr.children[6].innerHTML = "<button class='btn btn-custom' id='enable-field-edit-btn'> Odbaci</button>";
        tr.children[7].innerHTML = "<button class='btn btn-custom edit-cdr-fields-modal'>Uredi</button>";
        statusText = "CDR Nekorigovan";
    }
    else if (status==1) {
        statusText = "CDR Korigovan";
    }
    tr.children[5].innerHTML = statusText;
    //console.log(tr.children[5].innerHTML.toString());
}

function populateAllFieldsOfSuspendedCDRTable(list) {
    var html = "";
    var counter = list.length;
    var html = "<caption>Korekcija polja</caption><thead><tr><th hidden>Polje Id</th><th hidden>Polje</th><th>Vrijednost polja</th></tr></thead><tbody>"
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td hidden>" + list[i].CdrId + "</td>";
        html += "<td hidden>" + list[i].NtsFieldId + "</td>";
        html += "<td>" + list[i].FieldKey + "</td>";
        html += "<td><input type='text' value='" + list[i].FieldValue + "' class='form-control'/></td>";
        html += "</tr>"
    }
    html += "</tbody>";
    $("#all-fields-suspended-cdr-tbl").html(html);

    //on keydown, set focused input class 'edited-field', so later only ids with that class will be updated
    $(document).on('keydown', $("#all-fields-suspended-cdr-tbl input"), function () {
        //TODO enable button
        $("#update-cdr-btn").removeAttr("disabled");
        $(this.activeElement).addClass("edited-field");
        
        if ($("#suspended-detail-platform").text() == "GeoMnC") {
            var cdrStatus = $("#all-fields-suspended-cdr-tbl td:contains('CDR_Status')").next().find('input');
            cdrStatus.val("S");
            cdrStatus.addClass("edited-field");
        }
    })
}

function populateCDRTable(list) {
    $("#select-all").prop("checked", false);

    var html = "";
    var counter = list.length;
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td hidden>" + list[i].CdrId + "</td>";
        html += "<td style='max-width:800px; word-wrap: break-word;'>" + list[i].Line.replace(/<.*>(.*)<\/.*>/g, '$1') + "</td>";
        html += "<td>" + list[i].LineNumber + "</td>";
        html += "<td>" + convertTimestampToDate(list[i].ChangeDate) + "</td>";
        html += "<td>" + list[i].ChangeByUser + "</td>";
        html += "<td>" + list[i].Status + "</td>";
        console.log(list[i].Status);
        html += "<td>" + (list[i].Status == 'CDR Odbačen' ? "<button class='btn btn-custom' id='disable-field-edit-btn'>Poništi odbacivanje</button>" : "<button class='btn btn-custom' id='enable-field-edit-btn'> Odbaci</button>") + "</td>";
        html += "<td>" + (list[i].Status == 'CDR Odbačen' ? "<button disabled class='btn btn-custom'>Uredi</button>" : "<button class='btn btn-custom edit-cdr-fields-modal'> Uredi</button>") + "</td>";
        html += "</tr>"
    }
    $("#cdr-table tbody").html(html);

    $("#cdr-table").DataTable(
        {
            "paging": true,
            "ordering": true,
            "retrieve": true,
            "info": false,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Sve"]],
            "language": {
                "emptyTable": "Nema podataka",
                "info": " _START_ do _END_ od _TOTAL_ unosa",
                "lengthMenu": "Prikazano _MENU_ zapisa",
                "loadingRecords": "Učitavanje...",
                "processing": "Učitavanje...",
                "search": "Pretraga:",
                "zeroRecords": "Nema rezultata pretrage",
                "paginate": {
                    "first": "Prvi",
                    "last": "Posljednji",
                    "next": "Sljedeći",
                    "previous": "Prethodni"
                },
            }
        });
}