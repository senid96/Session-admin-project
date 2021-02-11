$(function () {
    $("#configuration-nav-tab").addClass("active-tab");

    $("#configuration-tabs li a").on('click', function (e) {
        let partialName = $(this).data('partial-name');
        let id = $(this).attr('id');
        var divInject = id.substr(0, id.indexOf('-tab')) + "-div"; 

        $('#' + divInject).load('/session_administration/Configuration/GetPartialByName?partialName=' + partialName);
    })


    $("#platform-info-tab").click();
})


/* --------------------------------------- METHODS ----------------------------------------------*/


/* --------------------------------------- POPULATE METHODS ----------------------------------------------*/


