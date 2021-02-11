$(function () {
/* prepare page */
    initConfiguration();

    $("#suspended-nav-tab").addClass("active-tab");

    getPlatformsFromConfiguration();

    $("#unprocessed-date-from, #processed-date-from, #unprocessed-date-to, #processed-date-to").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-20:+1",
        showButtonPanel: false,
        dateFormat: "mm/dd/yy",
        onSelect: function () { }
    });

    //set default dates
    var d = new Date();
    var currDay = d.getDate();
    var currMonth = d.getMonth();
    var currYear = d.getFullYear();
    var startDate = new Date(currYear, currMonth, currDay - 1);
    var endDate = new Date(currYear, currMonth, currDay);
    $("#unprocessed-date-from, #processed-date-from").datepicker("setDate", startDate);
    $("#unprocessed-date-to, #processed-date-to").datepicker("setDate", endDate);
/* end prepare page */

    //todo: lose rjesenje, popraviti kad budes imao vremena
    $("#unprocessed-platform").change(function () {
        console.log('changed');
        let selectedPlatformName = $("#unprocessed-platform option:selected").text();
        if (selectedPlatformName == "Sve platforme") {
            let html = "<option value='null'>Sva pravila</option>";
            $("#unprocessed-field-rule").html(html);
        }
        getRulesFromConfigurationUnprocessed(selectedPlatformName);
    })

    $("#processed-platform").change(function () {
        let selectedPlatformName = $("#processed-platform option:selected").text();
        if (selectedPlatformName == "Sve platforme") {
            let html = "<option value='null'>Sva pravila</option>";
            $("#processed-field-rule").html(html);
        }
        getRulesFromConfigurationProcessed(selectedPlatformName);
    })

    //search unprocessed files
    $("#unprocessed-search-btn").click(function () {
        let platform = $("#unprocessed-platform").val();
        let dateFrom = $("#unprocessed-date-from").val();
        let dateTo = $("#unprocessed-date-to").val();
        let rule = $("#unprocessed-field-rule").val();

        getSuspendedRecords(platform, dateFrom, dateTo, rule);


        //set to localstorage
        var savedSearchParams = { platform: platform, dateFrom: dateFrom, dateTo: dateTo, rule: rule };
        savedSearchParams = JSON.stringify(savedSearchParams);
        localStorage.setItem("savedSearchParams", savedSearchParams);
    })

    //search processed files
    $("#processed-search-btn").click(function () {
        let platform = $("#processed-platform").val();
        let dateFrom = $("#processed-date-from").val();
        let dateTo = $("#processed-date-to").val();
        let rule = $("#processed-field-rule").val();

        getProcessedSuspendedRecords(platform, dateFrom, dateTo, rule);

    })

    //confirm process of suspended file
    $("#confirm-fields-process-btn").click(function () {
        processSuspendedCDR($("#session-id").val())
    })

    //on click 'Procesiraj' unprocessed file
    $(document).on('click', '.open-unprocessed-cdr-modal', function (e) {
        var $row = $(this).closest('tr');
        var medSessionId = $row.find('td:eq(0)').text();
        openProcessSuspendedCDRModal(medSessionId)
    })

    //get processed files
    $(document).on('click', '.open-processed-cdrs-modal', function (e) {
        var $row = $(this).closest('tr');
        var medSessionId = $row.find('td:eq(0)').text();
        getProcessedCdrs(medSessionId);
    })
    $("#unprocessed-records-tab").click();


    if (localStorage.getItem("isPostBack") == 1) {
        localStorage.setItem("isPostBack", 0);

        var savedSearchParams = localStorage.getItem("savedSearchParams");
        savedSearchParams = JSON.parse(savedSearchParams);
        $("#unprocessed-platform").val(savedSearchParams.platform)
        $("#unprocessed-date-from").val(savedSearchParams.dateFrom);
        $("#unprocessed-date-to").val(savedSearchParams.dateTo);
        $("#unprocessed-field-rule").val(savedSearchParams.rule);


        let platform = $("#unprocessed-platform").val();
        let dateFrom = $("#unprocessed-date-from").val();
        let dateTo = $("#unprocessed-date-to").val();
        let rule = $("#unprocessed-field-rule").val();

        getSuspendedRecords(platform, dateFrom, dateTo, rule);
    }

   
})

/* --------------------------------------- METHODS ----------------------------------------------*/



function getPlatformsFromConfiguration() {
    //$.get("/session_administration/SessionAdministration/GetPlatformsFromConfiguration", function () {
    //}).done(function (result) {
    //    populatePlatformDdl(result)
    //}).fail(function () {
    //    toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
    //})


    $.ajax({
        url: "/session_administration/SessionAdministration/GetPlatformsFromConfiguration",
        type: "get",
        async: false,
        success: function (result) {
            populatePlatformDdl(result)
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja platformi!");
        }
    });

}

function getRulesFromConfigurationUnprocessed(platformName) {
    //$.get("/session_administration/Suspended/GetRules?platformName=" + platformName, function () {
    //}).done(function (result) {
    //    populateUnprocessedRulesDdl(result)
    //}).fail(function () {
    //    toastr.error("Dogodila se greška prilikom dohvatanja pravila!");
    //})


    $.ajax({
        url: "/session_administration/Suspended/GetRules?platformName=" + platformName,
        type: "get",
        async: false,
        success: function (result) {
            populateUnprocessedRulesDdl(result)
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja pravila!");
        }
    });
}

function getRulesFromConfigurationProcessed(platformName) {
    //$.get("/session_administration/Suspended/GetRules?platformName=" + platformName, function () {
    //}).done(function (result) {
    //    populateProcessedRulesDdl(result)
    //}).fail(function () {
    //    toastr.error("Dogodila se greška prilikom dohvatanja pravila!");
    //})

    $.ajax({
        url: "/session_administration/Suspended/GetRules?platformName=" + platformName,
        type: "get",
        async: false,
        success: function (result) {
            populateProcessedRulesDdl(result)
        },
        error: function () {
            toastr.error("Dogodila se greška prilikom dohvatanja pravila!");
        }
    });
}

function getSuspendedRecords(platform, dateFrom, dateTo, rule) {
    showLoader();
    $.get("/session_administration/Suspended/GetSuspendedRecords?platform=" + platform + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&rule=" + rule, function () {
    }).done(function (result) {
        populateSuspendedRecordsTable(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja spornih zapisa!");
    }).always(function () {
        hideLoader();
    })
}

function getProcessedSuspendedRecords(platform, dateFrom, dateTo, rule) {
    showLoader();
    $.get("/session_administration/Suspended/GetProcessedSuspendedRecords?platform=" + platform + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&rule=" + rule, function () {
    }).done(function (result) {
        populateProcessedSuspendedRecordsTable(result)
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja procesiranih spornih zapisa!");
    }).always(function () {
        hideLoader();
    })
}

function openProcessSuspendedCDRModal(sessionId) {
    $("#session-id").val(sessionId);
    $("#confirm-cdr-process-modal").modal("show");
}

function processSuspendedCDR(sessionId) {
    showLoader();
    $.post("/session_administration/Suspended/ProcessSuspendedCDR", { sessionId: sessionId }, function () {
    }).done(function () {
        toastr.success("Fajl procesiran uspješno!");

        let platform = $("#unprocessed-platform").val();
        let dateFrom = $("#unprocessed-date-from").val();
        let dateTo = $("#unprocessed-date-to").val();
        let rule = $("#unprocessed-field-rule").val();
        getSuspendedRecords(platform, dateFrom, dateTo, rule);
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom procesiranja fajla!");
    }).always(function () {
        hideLoader();
    })
}

function getProcessedCdrs(sessionId) {
    $.get("/session_administration/SuspendedDetails/GetProcessedCDRsBySessionId?sessionId=" + sessionId, function () {
    }).done(function (result) {
        populateProcessedCDRs(result);
        $("#processed-cdrs-modal").modal("show");
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom dohvatanja cdr-ova!");
    }).always(function () {
    })
}



/* --------------------------------------- POPULATE METHODS ----------------------------------------------*/

function populatePlatformDdl(list) {
    var html = "";
    html += "<option value='Sve platforme'>Sve platforme</option>";
    for (var i = 0; i < list.length; i++) {
        html += "<option value='" + list[i].FileTypeID + "'>";
        html += list[i].FileTypeName;
        html += "</option>";
    }

    $("#unprocessed-platform, #processed-platform").html(html);
}

function populateProcessedRulesDdl(list) {
    var html = "";
    html += "<option value='Sva pravila'>Sva pravila</option>";
    for (var i = 0; i < list.length; i++) {
        html += "<option value='" + list[i] + "'>";
        html += list[i];
        html += "</option>";
    }
    $("#processed-field-rule").html(html);
}

function populateUnprocessedRulesDdl(list) {
    var html = "";
    html += "<option value='Sva pravila'>Sva pravila</option>";
    for (var i = 0; i < list.length; i++) {
        html += "<option value='" + list[i] + "'>";
        html += list[i];
        html += "</option>";
    }
    $("#unprocessed-field-rule").html(html);
}

function populateSuspendedRecordsTable(list) {
    $("#select-all").prop("checked", false);
    var myTable = $("#unprocessed-tbl").DataTable(
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
        myTable.row.add([list[i].MedSessionId,
            list[i].FileSource, list[i].FileName, convertTimestampToDate(list[i].SessionDate),
            list[i].FileRowCount, list[i].TarificationCount, 
            list[i].SuspendedCount, list[i].RejectedCount,
            list[i].ErrorCount, list[i].Status == 3 ? "Spreman za procesiranje" : "Nije spreman za procesiranje",
            "<a class='btn btn-custom open-edit-view-btn' href='/session_administration/SuspendedDetails/Index?sessionId=" + list[i].MedSessionId + "'>Uredi</a>",
            "<button class='btn btn-custom open-unprocessed-cdr-modal' " + (list[i].Status == 3 ? " " : "disabled") +" >Procesiraj</button>"
        ])
    }
    myTable.draw();
}

function populateProcessedSuspendedRecordsTable(list) {
    $("#select-all").prop("checked", false);
    var myTable = $("#processed-tbl").DataTable(
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
        myTable.row.add([list[i].MedSessionId,
        list[i].FileSource, list[i].FileName, convertTimestampToDate(list[i].SessionDate),
        list[i].FileRowCount, list[i].TarificationCount,
            list[i].SuspendedCount, list[i].RejectedCount,
            list[i].ErrorCount, list[i].Status,
            "<button class='btn btn-custom open-processed-cdrs-modal'>Pregledaj</button>"
        ])
    }
    myTable.draw();
}

function populateProcessedCDRs(list) {
    var html = "";
    var counter = list.length;
    var html = "<caption>CDRs</caption><thead><tr><th>Linija</th><th>CDR</th></tr></thead><tbody>"
    for (var i = 0; i < counter; i++) {
        html += "<tr>";
        html += "<td>" + list[i].LineNumber + "</td>";
        html += "<td style='max-width:800px; word-wrap: break-word;'>" + list[i].Line.replace(/<.*>(.*)<\/.*>/g, '$1') + "</td>";
        html += "</tr>"
    }
    html += "</tbody>";
    $("#processed-cdr-tbl").html(html);
}

