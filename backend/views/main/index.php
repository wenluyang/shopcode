
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <!--====================== 标题logo==========================-->

    <link rel="shortcut icon" href="../../images/logo/favicon.ico" type="image/x-icon">

    <!--======================STYLESHEET==========================-->
    <link href="../../lib/plugins/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../../lib/nifty/lib/css/nifty.min.css">
    <link href="../../lib/nifty/lib/css/nifty-ys.min.css" rel="stylesheet">
    <link href="../../lib/nifty/lib/css/nifty.min_sys_2.1.css" rel="stylesheet">
    <link id="theme" href="../../lib/nifty/themes/type-b/theme-light.min.css" rel="stylesheet">
    <!--======================引用 字体==========================-->

    <link rel="stylesheet" href="../../lib/plugins/ionicons/css/ionicons.min.css">
    <link rel="stylesheet" href="../../lib/plugins/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="../../css/commonStyle/ys-fontStyle/css/ys-admin-style.css">

    <!-- ==================== 加载动画及表格，单选复选css   ===========================-->

    <link href="../../lib/plugins/pace/pace.min.css" rel="stylesheet">
    <link href="../../lib/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="../../lib/plugins/bootstrap-select/bootstrap-select.min.css" rel="stylesheet">
    <link href="../../lib/plugins/magic-check/css/magic-check.min.css" rel="stylesheet">
    <link href="../../lib/plugins/chosen/chosen.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../../lib/plugins/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css">
    <link rel="stylesheet" href="../../lib/plugins/zTree/css/metroStyle/metroStyle.css">
    <link rel="stylesheet" href="../../lib/ys-frame/css/ys-frame.min.css">
    <link rel="stylesheet" href="../../lib/plugins/mCustomScrollbar/css/jquery.mCustomScrollbar.css">
    <!-- ==================== 公用css文件  ===========================-->

    <link rel="stylesheet" type="text/css" href="../../css/commonStyle/Normalize.css" />

    <!-- ==================== 本页面自定义css  ===========================-->
    <link rel="stylesheet" href="../../lib/ys-frame/css/ys-frame.min.css">
    <link rel="stylesheet" type="text/css" href="../../css/backStageManagement/back-schoolManagement.css" />
    <!--<link href="../../css/layout.main.css" rel="stylesheet">-->

    <!--JAVASCRIPT-->
    <!-- ==================== 引用第三方的js文件  ===========================-->

    <script src="../../lib/plugins/jquery/dist/jquery.min.js"></script>
    <script src="../../lib/plugins/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="../../lib/plugins/pace/pace.min.js"></script>
    <script src="../../lib/plugins/bootstrap-ztree3/js/jquery.ztree.all.min.js"></script>
    <!-- layui日期选择器 -->
    <script src="../../lib/plugins/bootstrap-switch/dist/js/bootstrap-switch.min.js"></script>
    <script src="../../lib/plugins/layDate-v5.0.7/laydate/laydate.js"></script>

    <!-- ==================== Common page js  ===========================-->

    <script src="../../js/commonJs/common.string.js"></script>
    <script src="../../js/commonJs/common.date.js"></script>
    <script src="../../js/commonJs/page.label.cn.js"></script>
    <script src="../../js/backStageManagement/systemManagement.common.js"></script>
    <script src="../../lib/nifty/lib/js/nifty.min.js"></script>

    <!-- ==================== 页面表格及按钮js  ===========================-->
    <script src="../../lib/plugins/layer-v3.1.1/layer/layer.js"></script>
    <script src="../../lib/plugins/bootstrap-select/bootstrap-select.min.js"></script>
    <script src="../../lib/plugins/chosen/chosen.jquery.min.js"></script>
    <script src="../../lib/plugins/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="../../lib/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
    <script src="../../lib/plugins/layDate-v5.0.7/laydate/laydate.js"></script>
    <script src="../../lib/plugins/mCustomScrollbar/js/jquery.mCustomScrollbar.js"></script>
    <!-- ==================== 自定义本页面js  ===========================-->
    <script src="../../js/commonJs/common.ajax.js"></script>
    <script src="../../lib/ys-frame/js/ys-frame.js"></script>
    <style>
        .groupList .lab1::before {
            left: 57px;
        }
    </style>
</head>
<body templet='ys'>
<div id="container" class="effect aside-float aside-bright mainnav-lg">
    <!-- 顶部导航 -->
    <header id="navbar"></header>
    <!-- 内容部分 -->
    <div class="boxed">
        <!-- 中间内容部分 -->
        <div id="content-container">
            <!-- 页面位置 -->
            <div class="page-title-white">
                <ol class="breadcrumb ">
                    <i class="fa fa-home lh22">&nbsp;您现在的位置:</i>
                    <li>
                        <a href="javascript:void(0);">系统管理</a>
                    </li>
                    <li class="active">
                        <a href="javascript:void(0);">系统首页</a>
                    </li>
                </ol>
            </div>
            <!-- TODO 页面内容   表格部分-->
            <div id="page-content">
                <div class="panel">
                    <div class="panel-body">




                    </div>
                </div>
            </div>
        </div>
        <!-- 右侧隐藏部分 -->
        <aside id="aside-container"></aside>
        <!-- 左侧主导航 -->
        <nav id="mainnav-container"></nav>
    </div>
    <!-- 网站页脚 -->
    <footer id="footer"></footer>
</div>
<div id="ys-set" class="ys-set"></div>


<!-- =====================================以下是模态框=========================== -->
<!--开通教育局-->
<div class="modal fade" id="bureauModal" role="dialog" tabindex="-1" aria-labelledby="demo-default-modal"
     aria-hidden="true">
    <div class="modal-dialog modal-md ">
        <div class="modal-content">

            <!--Modal header-->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true" class="ion-close-round"></span>
                </button>
                <h4 class="modal-title">开通教育局</h4>
            </div>

            <!--Modal body-->
            <div class="modal-body">
                <form class=" form-horizontal form-padding" id="addBureau" style="padding-right:15px">
                    <!--Text Input-->
                    <div class="form-group groupList">
                        <label class="col-md-3 control-label" for="demo-text-input">教育局编码</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" autocomplete="off" id="eduCode" name="eduCode">
                        </div>
                    </div>
                    <div class="form-group groupList">
                        <label class="col-md-3 control-label" for="demo-text-input">教育局名称</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" autocomplete="off" id="eduName" name="eduName">
                        </div>
                    </div>
                    <div class="form-group groupList groupItem">
                        <label class="col-md-3 control-label" for="demo-text-input">所在地区</label>
                        <div class="col-md-9">
                            <div id="serveTime" style="width:100%">
                                <select class="select " style="width:31%" id="provinceModel" name="provinceModel">
                                    <!--<option value="">11</option>-->
                                </select>

                                <select name="cityModel" style="width:33%" id="cityModel">
                                    <!--<option value="">请选择市</option>-->
                                </select>

                                <select name="areaModel" style="width:33%" id="areaModel">
                                    <!--<option value="">请选择区域</option>-->
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group groupItem">
                        <label class="col-md-3 control-label" for="demo-text-input">办公电话</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" autocomplete="off" name="tel" id="tel">
                        </div>
                    </div>
                    <div class="form-group groupList groupItem">
                        <label class="col-md-3 control-label" for="demo-text-input">服务时间</label>
                        <div class="col-md-9">

                            <div class="ys-date-control" style="width:48%">
                                <input type="text" style="width:100%" autocomplete="off" readonly name="start"
                                       class="layui-input ys-form-control" placeholder="请选择日期" id="startDate">
                            </div>
                            <span>-</span>
                            <div class="ys-date-control" style="width:47%">
                                <input type="text" style="width:100%" autocomplete="off" readonly name="end" class="layui-input ys-form-control"
                                       placeholder="请选择日期" id="endDate">
                            </div>


                        </div>
                    </div>
                    <div class="form-group ">
                        <label class="col-md-3 control-label" for="demo-text-input">服务时长</label>
                        <div class="col-md-9 timerSevier">

                            <input type="text" class="form-control" autocomplete="off" id="addTime" name="addTime"
                                   disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="demo-text-input">到期自动提醒</label>
                        <div class="col-md-9 ys-radio-group">
                            <div class="radio ys-radio left">
                                <input id="demo-inline-form-radio" type="radio" name="inline-form-radio" checked=""
                                       value="1">
                                <label for="demo-inline-form-radio">提前30天提醒</label>
                            </div>
                            <div class="radio ys-radio left">
                                <input id="demo-inline-form-radio-2" type="radio" name="inline-form-radio" value="0">
                                <label for="demo-inline-form-radio-2">不需要提醒</label>

                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label requiredFields">应用授权</label>
                        <div class="col-md-9 ys-scrollbarS no" style="width:auto;height:150px;">
                            <ul class="ztree" id="authorizationZTree"></ul>
                        </div>
                    </div>
                </form>
            </div>

            <!--Modal footer-->
            <div class="modal-footer">
                <button data-dismiss="modal" class="ys-btn btn-default ">取消</button>
                <button class="ys-btn btn-primary" type="button" id="btnOpen">确认</button>
            </div>
        </div>
    </div>
</div>
<!--===================================================-->

<!--编辑模态框-->
<div class="modal fade" id="EditModal" role="dialog" tabindex="-1" aria-labelledby="demo-default-modal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <!--Modal header-->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true" class="ion-close-round"></span>
                </button>
                <h4 class="modal-title">编辑</h4>
            </div>

            <!--Modal body-->
            <div class="modal-body">
                <form class="form-horizontal form-padding" style="padding-right:15px" id="EditForm">
                    <!--Text Input-->
                    <div class="form-group groupList">
                        <label class="col-md-3 control-label" for="demo-text-input">教育局编码</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" autocomplete="off" id="EditEduCode" name="eduCode"
                                   value="11">
                        </div>
                    </div>
                    <div class="form-group groupList">
                        <label class="col-md-3 control-label" for="demo-text-input">教育局名称</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="eduName" autocomplete="off" id="EditName">
                        </div>
                    </div>
                    <div class="form-group groupList">
                        <label class="col-md-3 lab1  control-label" for="demo-text-input">所在地区</label>
                        <div class="col-md-9">
                            <div id="serveTime">
                                <select class="select " style="width:32%" id="EditProvince" name="provinceModel">
                                    <!--<option value="">11</option>-->
                                </select>

                                <select name="cityModel" style="width:32%" id="EditCity" name="cityModel">
                                    <!--<option value="">请选择市</option>-->
                                </select>

                                <select name="areaModel" style="width:32%" id="EditArea" name="areaModel">
                                    <option value="">请选择县区</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="demo-text-input">办公电话</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" id="EditTel" name="tel">
                        </div>
                    </div>
                    <div class="form-group groupList">
                        <label class="col-md-3 lab1 control-label" for="demo-text-input">服务时间</label>
                        <div class="col-md-9">

                            <div class="ys-date-control" style="width:48%">
                                <input type="text" style="width:100%" autocomplete="off" readonly class="layui-input ys-form-control"
                                       name="start" placeholder="请选择日期" id="EditUpDate">
                            </div>
                            <span>-</span>
                            <div class="ys-date-control" style="width:47%">
                                <input type="text" style="width:100%" autocomplete="off" readonly class="layui-input ys-form-control"
                                       name="end" placeholder="请选择日期" id="EditEndDate">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="demo-text-input">服务时长</label>
                        <div class="col-md-9 timerSevier">
                            <!-- <input type="text"  disabled="disabled" class="col-md-2" id="edityears">
                            <span class="col-md-1" style="line-height:30px;">年</span>
                            <input type="text" disabled="disabled" class="col-md-2" id="editmonths" />
                            <span class="col-md-1" style="line-height:30px;">月</span>
                            <input type="text" disabled="disabled" class="col-md-2" id="editdays" />
                            <span class="col-md-1" style="line-height:30px;">日</span> -->
                            <input type="text" class="form-control" autocomplete="off" id="editTime" name="editTime"
                                   disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label" for="demo-text-input">到期自动提醒</label>
                        <div class="col-md-9 ys-radio-group">
                            <div class="radio ys-radio left">
                                <!-- Inline radio buttons -->
                                <input id="demo-inline-form-radio1" type="radio" name="inline-form-radio" checked
                                       value="1">
                                <label for="demo-inline-form-radio1">提前30天提醒</label>
                            </div>
                            <div class="radio ys-radio left">
                                <input id="demo-inline-form-radio-3" type="radio" name="inline-form-radio" value="0">
                                <label for="demo-inline-form-radio-3">不需要提醒</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label requiredFields">应用授权</label>
                        <div class="col-md-9 ys-scrollbarS no" style="width:auto;height:150px;">
                            <ul class="ztree" id="editAuthorizationZTree"></ul>
                        </div>
                    </div>
                </form>
            </div>

            <!--Modal footer-->
            <div class="modal-footer">
                <button data-dismiss="modal" class="ys-btn btn-default " data-dismiss="modal">取消</button>
                <button class="ys-btn btn-primary" type="button" id="btnEdit">确认</button>
            </div>
        </div>
    </div>
</div>

<!--下属学校-->


<div class="modal fade" id="underModal" role="dialog" tabindex="-1" aria-labelledby="demo-default-modal"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <!--Modal header-->
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true" class="ion-close-round"></span>
                </button>
                <h4 class="modal-title">下属学校</h4>
            </div>

            <!--Modal body-->
            <div class="modal-body">
                <table class="schoolTable">
                    <thead>
                    <tr>
                        <th data-field="index">序号</th>
                        <th data-field="schoolName">学校名称</th>
                        <th data-field="schoolNature">办学性质</th>
                        <th data-field="schoolTel">电话</th>
                    </tr>
                    </thead>
                </table>
            </div>


        </div>
    </div>
</div>



</body>

</html>
<script>
    $(function () {

        $("#mainnav-menu").find(".collapse> li a").each(function (i, e) {
            var $this = $(this).parents('.collapse > li');
            if (this.href == window.location.href) {
                $this.addClass("hover");
            } else {
                $this.removeClass("hover");
            }
        });
    })
</script>