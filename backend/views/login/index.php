<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <meta name="viewport" content="user-scalable=no" />
    <title></title>
    <link rel="shortcut icon" href="" />
    <!-- Bootstrap -->
    <link href="/lib/plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/index/index.css" rel="stylesheet">
    <link rel="stylesheet" href="./lib/plugins/pigcms/css/idangerous.swiper2.7.6.css">
    <link rel="stylesheet" href="./lib/plugins/pigcms/css/animate.min.css">
    <!--=========字体文件=========-->
    <link rel="stylesheet" href="./lib/plugins/ionicons/css/ionicons.min.css">
</head>

<body>
<!-- header BEGIN -->
<header class="navbar navbar-default navbar-fixed-top" id="ys_header" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="javascript:void(0);">
                <img src="" alt="鹰硕LOGO" class="">
            </a>
        </div>
        <div class="pull-right">
            <ul class="nav navbar-nav">

            </ul>
        </div>
    </div>
</header>
<!-- header END -->
<!-- banner BEGIN -->
<div class="swiper-container">
    <!-- login BEGIN -->
    <div class="login-aside">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">用户登录</h3>
            </div>
            <div class="panel-body">

                <div class="form-group">
                    <div class="input-group mar-btm">
                            <span class="input-group-addon">
                                <i class="ion-person"></i>
                            </span>
                        <input type="text" id="user-name" class="form-control" autocomplete="off"
                               placeholder="请输入用户名">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group mar-btm">
                            <span class="input-group-addon">
                                <i class="ion-locked"></i>
                            </span>
                        <input type="password" id="user-pwd" autocomplete="off" class="form-control"
                               placeholder="请输入密码">
                    </div>
                </div>

                <div class="from-group">
                    <div class="row clearfix">
                        <div class="col-md-6 col-sm-6">
                            <div class="pad-ver" style="padding: 0px !important;">
                                <input id="demo-remember-me" class="magic-checkbox" type="checkbox">
                                <label for="demo-remember-me">
                                    <font>
                                        <font>记住密码</font>
                                    </font>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-group submit">
                    <button id="login-submit" class="btn btn-block">登录</button>
                </div>
            </div>
        </div>
    </div>
    <!-- login END -->
    <a class="arrow-left" href="#"></a>
    <a class="arrow-right" href="#"></a>
    <div class="swiper-wrapper">

    </div>
    <div class="pagination"></div>
</div>




<!-- 基础设置 END -->
<!-- 版权所有 BEGIN -->
<div class="footer" >

    <p class="services">
        <a href="javascript:void(0);" class="iconfont icon-dianhua">电话：400-8893-913</a>
        <a href="javascript:void(0);" class="iconfont icon-youxiang">邮箱：service@ys100.com</a>
        <a href="javascript:void(0);" class="iconfont icon-dizhi">地址：深圳市宝安区新安三路建达工业园区1栋2楼</a>
    </p>
    <p class="ys_copyright">
        <span>©2019,深圳市鹰硕技术有限公司 All Rights Reserved. &nbsp;&nbsp;&nbsp;备案号：粤ICP14045151号-1</span>
    </p>
</div>

<!-- 版权所有 END -->
<script src="./lib/plugins/jquery/dist/jquery-1.8.0.min.js"></script>
<script src="https://cdn.bootcss.com/layer/2.3/layer.js"></script>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins)-->
<script src="./lib/plugins/jquery/dist/jquery.min.js"></script>
<script src="./lib/plugins/Aos/aos.js"></script>
<script src="./lib/plugins/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="./lib/plugins/pigcms/js/idangerous.swiper2.7.6.min.js"></script>
<script src="./lib/plugins/pigcms/js/swiper.animate1.0.2.min.js"></script>
<!--自定义的js-->
<script src="./lib/plugins/bootstrap/dist/back-to-top.js"></script>
<script src="./js/commonJs/common.ajax.js"></script>
<script src="./js/PersonalSpace/banner.js"></script>
<script src="./js/PersonalSpace/login.js"></script>


<script>
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("Firefox") > -1) {

        function appInfo() {
            var browser = {
                    appname: '',
                    version: 0
                },
                userAgent = window.navigator.userAgent.toLowerCase(); // 使用navigator.userAgent来判断浏览器类型
            //msie,firefox,opera,chrome,netscape
            if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
                browser.appname = RegExp.$1;
                browser.version = RegExp.$2;
            } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari
                browser.appname = 'safari';
                browser.version = RegExp.$2;
            }
            return browser;
        }
        var a = appInfo()

        if (a.appname == 'chrome' && a.version.split('.')[0] < 41) { //谷歌兼容es6
            noStill()
        }

        if (a.appname == 'firefox' && a.version.split('.')[0] < 34) { //谷歌兼容es6
            noStill()
        }

        if (typeof (Worker) == "undefined") { //是否兼容H5
            noStill()
        }

    } else {
        noStill()
    }

    function noStill() { //不支持的页面
        $('body').removeClass("hidden")
        var html = $('body').html()
        // if (window.navigator.userAgent.indexOf('compatible') != -1) {
        $('body').html('<div id="other" class="text-center">' +
            '<div class="text-center"><div class="text-center" style="display:inline-block"><img src="./images/浏览器不兼容.png">' +
            '<h3>不兼容当前版本浏览器</h3></div><div class="text-center" style="display:inline-block;margin-left:60px"><img src="./images/icon1.png" style="margin-left:-60px;margin-right:60px;margin-bottom:40px"><img src="./images/极速模式.png" style="margin-bottom:40px">' +
            '<h3>请使用浏览器极速模式访问</h3></div></div>' +
            '<div class="text-center"><p class="otherP">使用不兼容的浏览器可能会出现页面空白、乱码、加载错误、无法访问等问题，请尝试切换成极速模式或更换浏览器' +
            '</p></div>' +
            '<div class="text-center"><a class="otherA text-left" href="https://www.google.cn/chrome/" target="_blank" style="margin-right:30px;"><img src="./images/Chrome.png" style="margin-right:6px;margin-left:16px;">推荐使用新版谷歌浏览器' +
            '</a><a class="otherA text-left" href="http://www.firefox.com.cn/" target="_blank"><img src="./images/firefox.png" style="margin-right:6px;margin-left:16px;">推荐使用新版火狐浏览器' +
            '</a></div>' +
            '<div class="text-center"><a class="otherA text-left" href="https://browser.360.cn/se/" target="_blank" style="margin-right:30px;"><img src="./images/360-.png" style="margin-right:6px;margin-left:16px;">推荐使用新版360浏览器极速模式' +
            '</a><a class="otherA text-left" href="https://browser.360.cn/ee/" target="_blank"><img src="./images/360.png" style="margin-right:6px;margin-left:16px;">推荐使用新版360极速浏览器' +
            '</a></div>' +
            '<div class="othermore"><div class="text-center"><a class="otherA text-left" href="https://browser.qq.com/" target="_blank" style="margin-right:30px;"><img src="./images/QQ.png" style="margin-right:6px;margin-left:16px;">推荐使用新版QQ浏览器极速模式' +
            '</a><a class="otherA text-left" href="https://ie.sogou.com/" target="_blank"><img src="./images/搜狗.png" style="margin-right:6px;margin-left:16px;">推荐使用新版搜狗浏览器极速模式' +
            '</a></div>' +
            '<div class="text-center"><a class="otherA text-left" href="https://www.liebao.cn/" target="_blank" style="margin-right:30px;"><img src="./images/猎豹.png" style="margin-right:6px;margin-left:16px;">推荐使用新版猎豹安全浏览器' +
            '</a><a class="otherA text-left" href="https://liulanqi.baidu.com/" target="_blank"><img src="./images/百度.png" style="margin-right:6px;margin-left:16px;">推荐使用新版百度浏览器极速模式' +
            '</a></div>' +
            '<div class="text-center"><a class="otherA text-left" href="http://pc.uc.cn/" target="_blank"><img src="./images/UC.png" style="margin-right:6px;margin-left:16px;">推荐使用新版UC浏览器极速模式' +
            '</a><span class="xxx"></span></div></div>' +
            '<div class="text-center otherP"><a href="javascript:;" id="otherMore">展开全部浏览器兼容列表<i class="glyphicon glyphicon-menu-down"></a></div>' +
            '</div>')

        $('#otherMore').click(function () {
            if ($('#otherMore').text() == '展开全部浏览器兼容列表') {
                $('.othermore').show()
                $('#otherMore').html('收起全部浏览器兼容列表<i class="glyphicon glyphicon-menu-up"></i>')
            } else {
                $('.othermore').hide()
                $('#otherMore').html('展开全部浏览器兼容列表<i class="glyphicon glyphicon-menu-down"></i>')
            }

        })


    }
    $('.downloadApp').hover(function () {
        $('.dropdown-QRCodeMenu').show();
    }, function () {
        $('.dropdown-QRCodeMenu').hide();
    })
    AOS.init({
        once: true
    })
</script>

</body>

</html>
