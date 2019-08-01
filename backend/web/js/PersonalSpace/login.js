$(document).ready(function () {



    $("#login-submit").click(function () {

        if (!$("#user-name").val()){
            layer.msg("用户名不能为空！");
            return false;
        }

        if (!$("#user-pwd").val()){
            layer.msg("密码不能为空！");
            return false;
        }
        var parm = {
            password: $("#user-pwd").val(),
            username: $("#user-name").val()
        };
        ysAjax.ajax('/admin/admin/login', parm, 'json', function (records, request) {
            if (records.code === 500) {
                layer.msg(records.message);
                $("#user-name").val("");
                $("#user-pwd").val("");
                return false;
            }else{
                //登录成功时，将token存到session中

                //记住密码
                if ($('#demo-remember-me').is(':checked') == true) {
                    setCookie('userName', $("#user-name").val());
                    setCookie('password', $("#user-pwd").val());
                    setCookie('remember-me', true)
                } else {
                    setCookie('userName', null);
                    setCookie('password', null);
                    setCookie('remember-me', false)
                }

                layer.msg(records.message,function () {
                    sessionStorage.setItem("x-auth-token", records.data.access_token);
                    window.location.href = './main';
                });



            }
        })
    });


    // 设置cookie 用于记住我
    function setCookie(name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }





})


