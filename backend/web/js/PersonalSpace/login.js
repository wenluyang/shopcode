$(document).ready(function () {



    $("#login-submit").click(function () {
        alert();
        var parm = {
            pwd: $("#user-pwd").val(),
            userAccount: $("#user-name").val()
        };
        ysAjax.ajax('/admin/admin/login', parm, 'json', function (records, request) {
            console.log(records);
        })
    });






})


