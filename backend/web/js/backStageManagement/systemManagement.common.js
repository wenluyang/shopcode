$(document).ready(function () {
    // 初始化->顶部导航栏->位置：顶部导航栏
    page$drawTopHeader();
    //左侧
    page$drawMainMenuNav();
    //页面底部
    page$drawFooter();
    //返回底部
    page$drawScrollBtn();

});

/*
 * 初始化->顶部导航栏
 * 位置：顶部导航栏
 */
page$drawTopHeader = function () {
    var topHeaderHtml = [];
    var navhref;
    topHeaderHtml.push(`<div id="navbar-container" class="boxed">
    <div class="navbar-header">
           <a href="javascript:void(0);" class="navbar-brand"> 
       <div class="brand-title">
                 <img src="../../images/logo/logo.png" alt="鹰硕" class="brand-logo">
               </div>
           </a>
       </div>
       <div class="navbar-content clearfix">
       <ul class="nav navbar-top-links pull-left">
                            <!--顶部导航栏-左侧-按钮1-->
         <li class="tgl-menu-btn"><a class="mainnav-toggle" href="javascript:void(0);"><i class="icon-pli-view-list"></i>
         </a></li>
         <li class="mega-dropdown" id="topLayoutGrid"></li>
        </ul>
      <ul class="nav navbar-nav topNav pull-left"></ul>'
        <ul class="nav navbar-top-links pull-right">
        <li class="dropdown" id="topBell"></li>
        <li id="dropdown-user" class="dropdown"><a href="javascript:void(0);" data-toggle="dropdown" class="dropdown-toggle text-right"><span class="pull-right"><img class="img-circle img-user media-object" src="../../images/logo/logo.png"></span><div class="username hidden-xs">鹰硕管理员</div></a><div class="dropdown-menu dropdown-menu-md dropdown-menu-right panel-default"><ul class="head-list"><li style="display: none;"><a href="javascript:void(0);"><i class="undefined"></i>选择机构:<select style="display:inline-block; width:200px;margin-left:10px; " class="input-sm  form-control" id="organizationSelect"><option>鹰硕集团</option><option>新安中学集团</option><option>宝安教育局</option></select></a></li><li style="display: none;"><a href="javascript:void(0);"><i class="undefined"></i>身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份:<div id="identity-container" style="margin-left: 10px;"><label data-indentity="2" class="label label-default ">校长</label> <label data-indentity="3" class="label label-default ">老师</label> <label data-indentity="1" class="label label-default ">学生</label></div></a></li><li><a href="../PersonalSpace/personalCenterPage.html"><span class="badge badge-danger pull-right"></span><i class="userIcon"></i>个人中心</a></li></ul><div class="pad-all text-right"><a href="javascript:;" id="loginOut" class="btn btn-primary"><i class="ys-pli-unlock"></i>退出登录</a></div></div></li>
        <li id="aside-menu-btn"></li>
       </ul>
      </div>
   </div>`);

        $("header[id='navbar']").append(topHeaderHtml.join(''));

}


/*
 * 初始化->页面左侧导航栏
 * 位置：左侧主导航栏最下边部分
 */
page$drawMainMenuNav = function () {
    var mainMenuNavHtml = ['                <div id="mainnav">',
        '                    <div id="mainnav-menu-wrap">',
        '                        <div class="nano">',
        '                            <div class="nano-content">',
        '                                <ul id="mainnav-menu" class="list-group"></ul>',
        '                            </div>',
        '                        </div>',
        '                    </div>',
        '                </div>'
    ];
    $("nav[id='mainnav-container']").append(mainMenuNavHtml.join(""));
}


/*
 * 初始化->页脚
 * 位置：页脚
 */
page$drawFooter = function () {
    var footerHtml = [
        '<div class="footer-3">' +
        '<p class="ys_copyright">' +
        '<span>©2019,山东高招 All Rights Reserved. 备案号：粤ICP14045151号-1</span>' +
        '</p>' +
        '</div>'
    ];
    $("footer[id='footer']").append(footerHtml.join(""));
}


/*
 * 初始化->返回顶部按钮
 */
page$drawScrollBtn = function () {
    var scrollBtnHtml = ['<button class="scroll-top btn">',
        '    <i class="pci-chevron chevron-up"></i>',
        '</button>'
    ];
    $("div[id='container']").append(scrollBtnHtml.join(""));
}




