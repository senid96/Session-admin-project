function showLoader() {
    $(".loader").show();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("body").css("overflow", "hidden");
}

function showLoaderFixedScroll(scrollTopValue) {
    console.log('prije :' + $(".loader").top);
    $(".loader").scrollTop = scrollTopValue;
    console.log('poslije :' + $(".loader").scrollTop);
    $(".loader").show();
    $("html, body").animate({ scrollTop: scrollTopValue - 50 }, "slow");
    $("body").css("overflow", "hidden");
}

function hideLoader() {
    $(".loader").hide();
    $("body").css("overflow", "scroll");
}

function convertTimestampToDate(timestamp) {
    return timestamp == null ? "Nedefinisano" : new Date(timestamp.substr(6, 13) * 1).toLocaleDateString('bs-BS', { year: 'numeric', month: 'long', day: 'numeric' }) + " " + new Date(timestamp.substr(6, 13) * 1).toLocaleTimeString('bs-BS');
}

function isNull(target) {
    for (var member in target) {
        if (target[member] == "" || target[member] == null)
            return true;
    }
    return false;
}

function initConfiguration() {
    $.get("/session_administration/Configuration/InitConfiguration", function () {
    }).done(function () {
    }).fail(function () {
        toastr.error("Dogodila se greška prilikom inicijalne konfiguracije!");
    }).always(function () {
    })
}

