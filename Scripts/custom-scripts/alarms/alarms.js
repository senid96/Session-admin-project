
$(function () {

/* prepare page */
    initConfiguration();
        //set active tab to alarms
        $(".nav li").removeClass();
        $("#alarms-nav-tab").addClass("active-tab");

        $("#select-all").prop("checked", false);
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
/* end prepare page */


        //select all alarms
        $('#select-all').click(function (event) {
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

        //get history alarms by date
        $("#search-history-alarm-btn").click(function () {
            var dateFrom = $("#date-from").val();
            var dateTo = $("#date-to").val();
            if (dateFrom == "" || dateFrom == null || dateTo == "" || dateTo == null) {
                toastr.warning("Potrebno unijeti datume!");
                return;
            }
            getAlarmsHistory(dateFrom, dateTo);
        })
    
        //confirm alarms reprocess
        $("#open-modal-conifrm-btn").click(function () {
            prepareConfirmAlarms();
        })

        //get active alarms by date
        $("#get-active-alarms-btn").click(function () {
            getActiveAlarms();
        })

    $("#active-alarms-tab").click();

})

/*----------------------------------METHODS--------------------------------------------- */

function getActiveAlarms() {
    showLoader();
    $.get("/session_administration/Alarms/GetActiveAlarms", function () {
    }).done(function (result) {
        populateActiveAlarmsTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja aktivnih alarma!");
    }).always(function () {
        hideLoader();
    })
}

function getAlarmsHistory(dateFrom, dateTo) {
    showLoader();
    $.get("/session_administration/Alarms/GetAlarmsHistory?datefrom=" + dateFrom + "&dateTo=" + dateTo, function () {
    }).done(function (result) {
        populateAlarmsHistoryTable(result);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja aktivnih alarma!");
    }).always(function () {
        hideLoader();
    })
}

function prepareConfirmAlarms() {
    var alarmsList = [];
    var alarmId = "";
    //iterate only over checked rows and get checked session ids
    $("#active-alarms-tbl input[type=checkbox]:checked").each(function () {
        var row = $(this).closest("tr")[0];
        if (row.cells[1].innerHTML != "Alarm ID") { //ignorisi header
            alarmId = row.cells[1].innerHTML;
            alarmsList.push(alarmId); //napuni listu id-jeva
        }
    });

    //validation
    if (alarmsList.length == 0) {
        toastr.warning("Molimo da odaberete alarme za potvrdu.");
        return;
    }

    //open confirm modal 
    $("#confirm-alarms-modal").modal("show");
    $("#modal-msg").html("Odabrali ste da potvrdite " + alarmsList.length + " alarm/a. Da li ste sigurni?");
    $("#confirm-btn").unbind("click");
    $("#confirm-btn").click(function () { confirmAlarms(alarmsList); });    
};

function confirmAlarms(alarmIds) {
    alarmIds = JSON.stringify({ 'alarmIds': alarmIds });
    showLoader();

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        url: '/session_administration/Alarms/ConfirmAlarms',
        data: alarmIds,
        success: function () {
            toastr.success("Alarmi uspješno potvrđeni!");
            hideLoader();
            getActiveAlarms();
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom potvrde alarma!");
            hideLoader();
        }
    })
}


/*-----------------------------------POPULATE METHODS--------------------------------------------- */

function populateActiveAlarmsTable(list) {
    $("#select-all").prop("checked", false); //after refresh, it stays checked, so we need to uncheck manually
    var myTable = $("#active-alarms-tbl").DataTable(
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
  
    myTable.clear();
    for (var i = 0; i < list.length; i++) {
        myTable.row.add(['<input type="checkbox"/>', list[i].AlarmId, convertTimestampToDate(list[i].AlarmTime), list[i].Source,
            list[i].Source, list[i].MedSessionId
        ])
    }
    myTable.draw();
}

function populateAlarmsHistoryTable(list) {

    var myTable = $("#alarms-history-tbl").DataTable(
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

    myTable.clear();
    for (var i = 0; i < list.length; i++) {
        myTable.row.add([convertTimestampToDate(list[i].AlarmTime), list[i].Source,
            list[i].Message, list[i].Acknowledged, list[i].AckUser, list[i].AckTime
        ])
    }
    myTable.draw();
}

