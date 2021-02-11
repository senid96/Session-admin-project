
$(function () {
    initConfiguration();
    $("#by-parameters-tab").click();
    $("#session-nav-tab").addClass("active-tab");

    $("#select-by-id-all, #select-all-by-params").prop("checked", false);

    //append datepickers to date inputs
    $("#date-from, #date-to").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-20:+1",
        showButtonPanel: false,
        dateFormat: "mm/dd/yy",
        onSelect: function () { }
    });

    //set default dates
    var d = new Date();
    var currMonth = d.getMonth();
    var currYear = d.getFullYear();
    var startDate = new Date(currYear, currMonth, 1);
    $("#date-from").datepicker("setDate", startDate);
    $("#date-to").datepicker("setDate", startDate);

    //get and populate platform names drop down
    getPlatformsFromConfiguration();
   
    //select all sessions params filter
    $('#select-all-by-params').click(function (event) {
        if (this.checked) {
            // Iterate each checkbox
            $(':checkbox').each(function () {
                this.checked = true;
            });
        } else {
            $(':checkbox').each(function () {
                this.checked = false;
            });
        }
    });

    //select all sessions id filter
    $('#select-by-id-all').click(function (event) {
        if (this.checked) {
            // Iterate each checkbox
            $(':checkbox').each(function () {
                this.checked = true;
            });
        } else {
            $(':checkbox').each(function () {
                this.checked = false;
            });
        }
    });

    //show/hide last-step-filter chose
    $("#last-step-filter-chose").change(function (e) {
        if ($(this).val() == 2) {
            $(".processing-step-div").fadeOut();
        }
        else {
            $(".processing-step-div").fadeIn();
        }
    })

    //get sessions by parameters
    $("#get-sessions-by-params-btn").click(function () {
        getSessionsByParams();
    })

    //get sessions by id
    $("#get-sessions-by-id").click(function () {
        getSessionById();
    })

    //prepare delete sessions by params
    $("#prepare-delete-sessions-btn").click(function () {
        prepareDeleteSessions();
    })

    //prepare reprocess by params
    $("#prepare-reprocess-sessions-btn").click(function () {
        prepareReprocessSessions();
    })

    //prepare delete by id
    $("#prepare-delete-sessions-id-btn").click(function () {
        prepareDeleteByIdSessions();
    })

    //prepare reprocess by id
    $("#prepare-reprocess-sessions-id-btn").click(function () {
        prepareReprocessSessionsById();
    })
   
});

/* --------------------------------------- METHODS ----------------------------------------------*/
//gets
function getSessionsByParams() {

    //input validation
    //if last-processed-step is included in filter
    if ($("#last-step-filter-chose").val() == 1) {
        if ($("#last-processed-step").val() == "" || $("#last-processed-step").val() == null) {
            toastr.warning("Potrebno unijeti korak procesiranja!");
            return;
        }
    }
    if ($("#date-type").val() == "" || $("#date-type").val() == null ||
        $("#date-from").val() == "" || $("#date-from").val() == null ||
        $("#date-to").val() == "" || $("#date-to").val() == null ||
        $("#platform").val() == "" || $("#platform").val() == null
    ) {
        toastr.warning("Potrebno unijeti sve parametre!");
        return;
    }
    //end input validation

    showLoader();
    //prepare search object
    var platfName = $("#platform option:selected").text();
    if (platfName == "Sve platforme")
        platfName = null;

    var data = {
        DateTypeSearch: $("#date-type").val(),
        DateFrom: $("#date-from").val(),
        DateTo: $("#date-to").val(),
        PlatformName: platfName,
        FileName: $("#file-name").val(),
        OperatorSign: $("#operator-sign").val(),
        ProccessingStep : $("#last-processed-step").val()
    };

    if ($("#last-step-filter-chose").val() == 2) {
        data.OperatorSign = null;
        data.ProccessingStep = null;
    }


    $.get("/session_administration/SessionAdministration/GetSessions", data, function () {
    }).done(function (result) {
        populateSessionTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja sesija!");
    }).always(function () {
        hideLoader();
    })
}

function getSessionById() {

    //input validation
    if ($("#session-id").val() == "" || $("#session-id").val() == null) {
        toastr.warning("Potrebno unijeti Id sesije!");
        return;
    }

    if ($("#session-id").val().match(/^[0-9]+$/) == null) {
        toastr.warning("Id sesije mora biti cijeli broj!");
        return;
    }
    //end input validation

    showLoader();

    $.get("/session_administration/SessionAdministration/GetSessionById?sessionId=" + $("#session-id").val(), function () {
    }).done(function (result) {
        populateSessionByIdTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja sesija!");
    }).always(function () {
        hideLoader();
    })
}

function getPlatformsFromConfiguration() {
    $.get("/session_administration/SessionAdministration/GetPlatformsFromConfiguration", function () {
    }).done(function (result) {
        populatePlatformDdl(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
    })
}

//prepare
function prepareDeleteSessions() {
    var sessionIds = [];
    //iterate only over checked rows and get checked session ids
    $("#sessions-by-params-tbl input[type=checkbox]:checked").each(function () {
        var row = $(this).closest("tr")[0];
        if (row.cells[1].innerHTML != "Id sesije") //ignorisi header
            sessionIds.push(row.cells[1].innerHTML); //napuni listu id-jeva
    });

    //validation
    if (sessionIds.length == 0) {
        toastr.warning("Molimo da odaberete sesije za brisanje.");
        return;
    }

    //otvori potvrdni modal
    $("#reprocess-modal").modal("show");
    $("#modal-msg").html("Odabrali ste da obrišete " + sessionIds.length + " sesiju/e/a. Da li ste sigurni?");
    $("#title").html("Brisanje sesija");
    $("#confirm-btn").unbind("click"); //ovo mora jer u suprotnom ce lijepiti metode.. pa ce ih pozivati uvijek vise
    $("#confirm-btn").click(function () { deleteSessions(sessionIds); }); //append click method to confirm button on modal.. 
}

function prepareDeleteByIdSessions() {
    var sessionIds = [];
    //iterate only over checked rows and get checked session ids
    $("#sessions-by-id-tbl input[type=checkbox]:checked").each(function () {
        var row = $(this).closest("tr")[0];
        if (row.cells[1].innerHTML != "Id sesije") //ignorisi header
            sessionIds.push(row.cells[1].innerHTML); //napuni listu id-jeva
    });

    //validation
    if (sessionIds.length == 0) {
        toastr.warning("Molimo da odaberete sesije za brisanje.");
        return;
    }

    //otvori potvrdni modal
    $("#reprocess-modal").modal("show");
    $("#modal-msg").html("Odabrali ste da obrišete " + sessionIds.length + " sesiju/e/a. Da li ste sigurni?");
    $("#title").html("Brisanje sesija");
    $("#confirm-btn").unbind("click"); //ovo mora jer u suprotnom ce lijepiti metode.. pa ce ih pozivati uvijek vise
    $("#confirm-btn").click(function () { deleteByIdSessions(sessionIds); }); //append click method to confirm button on modal.. 
}

function prepareReprocessSessions() {
    var reprocessRequestList = [];
    var reprocessRequest = "";
    //iterate only over checked rows and get checked session ids
    $("#sessions-by-params-tbl input[type=checkbox]:checked").each(function () {
        var row = $(this).closest("tr")[0];
        if (row.cells[1].innerHTML != "Id sesije") { //ignore header
            reprocessRequest = { Id: row.cells[1].innerHTML, Path: row.cells[4].innerHTML };
            reprocessRequestList.push(reprocessRequest);
        }
    });

    //validation
    if (reprocessRequestList.length == 0) {
        toastr.warning("Molimo da odaberete sesije za reprocesiranje.");
        return;
    }

    //otvori potvrdni modal
    $("#reprocess-modal").modal("show");
    $("#modal-msg").html("Odabrali ste da reprocesirate " + reprocessRequestList.length + " sesiju/e/a. Da li ste sigurni?");
    $("#title").html("Reprocesiranje sesija");
    $("#confirm-btn").unbind("click");
    $("#confirm-btn").click(function () { reprocessSessions(reprocessRequestList); });
};

function prepareReprocessSessionsById() {
    var reprocessRequestList = [];
    var reprocessRequest = "";
    //iterate only over checked rows and get checked session ids
    $("#sessions-by-id-tbl input[type=checkbox]:checked").each(function () {
        var row = $(this).closest("tr")[0];
        if (row.cells[1].innerHTML != "Id sesije") { //ignore header
            reprocessRequest = { Id: row.cells[1].innerHTML, Path: row.cells[4].innerHTML };
            reprocessRequestList.push(reprocessRequest);
        }
    });

    //validation
    if (reprocessRequestList.length == 0) {
        toastr.warning("Molimo da odaberete sesije za reprocesiranje.");
        return;
    }

    //otvori potvrdni modal
    $("#reprocess-modal").modal("show");
    $("#modal-msg").html("Odabrali ste da reprocesirate " + reprocessRequestList.length + " sesiju/e/a. Da li ste sigurni?");
    $("#title").html("Reprocesiranje sesija");
    $("#confirm-btn").unbind("click");
    $("#confirm-btn").click(function () { reprocessByIdSessions(reprocessRequestList); });
};

//delete & reprocess
function deleteSessions(sessionIds) {
    var stringSessions = sessionIds.join("|");
    stringSessions += "|"; //baza ocekuje ovakvu logiku, inace ce uci u beskonacnu petlju u proceduri
    $.post("/session_administration/SessionAdministration/DeleteSessions?sessions=" + stringSessions, function () {
    }).done(function (result) {
            getSessionsByParams();
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom brisanja sesija!");
    }).always(function () {
    })
}

function deleteByIdSessions(sessionIds) {
    var stringSessions = sessionIds.join("|");
    stringSessions += "|"; //baza ocekuje ovakvu logiku, inace ce uci u beskonacnu petlju u proceduri
    $.post("/session_administration/SessionAdministration/DeleteSessions?sessions=" + stringSessions, function () {
    }).done(function (result) {
        getSessionById();
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom brisanja sesija!");
    }).always(function () {
    })
}

function reprocessSessions(reqList) {
    reqList = JSON.stringify({ 'reqList': reqList });
    showLoader();

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/SessionAdministration/ReprocessSessions',
        data: reqList,
        success: function () {
            getSessionsByParams();
            toastr.success("Sesije uspjesno reprocesirane!");
        },
        error: function () {
            toastr.error("Greška prilikom reprocesiranja!");
            hideLoader();
        }
    })
}

function reprocessByIdSessions(reqList) {
    reqList = JSON.stringify({ 'reqList': reqList });
    showLoader();

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/SessionAdministration/ReprocessSessions',
        data: reqList,
        success: function () {
            getSessionById();
            toastr.success("Sesija uspješno reprocesirana!");
        },
        error: function () {
            toastr.error("Greška prilikom reprocesiranja!");
            hideLoader();
        }
    })
}

/* --------------------------------------- POPULATE ----------------------------------------------*/
function populateSessionTable(list) {
    showLoader();
    $("#select-all-by-params").prop("checked", false);
    var myTable = $("#sessions-by-params-tbl").DataTable(
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
    //ako ima podataka, onda prikazi buttone za brisanje i reprocesiranje
    if (list.length > 0) {
        $(".reprocess-btn").css("visibility", "visible");
        $(".delete-btn").css("visibility", "visible");
    } else {
        $(".reprocess-btn").css("visibility", "hidden");
        $(".delete-btn").css("visibility", "hidden");
    }
    myTable.clear();
    for (var i = 0; i < list.length; i++) {
        myTable.row.add(['<input type="checkbox"/>',list[i].Id, convertTimestampToDate(list[i].SessionDate), convertTimestampToDate(list[i].FileDate),
            list[i].FilePath, list[i].FileName, list[i].LastSuccessfulStep,
            convertTimestampToDate(list[i].DateOfLastChange), list[i].FileRowCount, list[i].TarificationCount,
            list[i].RejectedCount, list[i].SporniCount, list[i].ErrorCount
        ])
    }
    myTable.draw();
    hideLoader();
}

function populateSessionByIdTable(list) {
    showLoader();
    $("#select-by-id-all").prop("checked", false);
    var myTable = $("#sessions-by-id-tbl").DataTable(
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
    //ako ima podataka, onda prikazi buttone za brisanje i reprocesiranje
    if (list.length > 0) {
        $(".reprocess-btn").css("visibility", "visible");
        $(".delete-btn").css("visibility", "visible");
    } else {
        $(".reprocess-btn").css("visibility", "hidden");
        $(".delete-btn").css("visibility", "hidden");
    }
    myTable.clear();
    for (var i = 0; i < list.length; i++) {
        myTable.row.add(['<input type="checkbox"/>', list[i].Id, convertTimestampToDate(list[i].SessionDate), convertTimestampToDate(list[i].FileDate),
            list[i].FilePath, list[i].FileName, list[i].LastSuccessfulStep,
            convertTimestampToDate(list[i].DateOfLastChange), list[i].FileRowCount, list[i].TarificationCount,
            list[i].RejectedCount, list[i].SporniCount, list[i].ErrorCount
        ])
    }
    myTable.draw();
    hideLoader();
}

function populatePlatformDdl(list) {
    var html = "";
    html += "<option value='Sve platforme'>Sve platforme</option>";
    for (var i = 0; i < list.length; i++) {
        html += "<option value='" + list[i].FileTypeID + "'>";
        html += list[i].FileTypeName;
        html += "</option>";
    }
    $("#platform").html(html);
}

