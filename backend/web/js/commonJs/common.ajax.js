$(function () {});
var baseApi = "http://www.api.com";
var imgApi = "http://127.0.0.1:82";

//为将来的 AJAX 请求设置默认值
$.ajaxSetup({
    //请求前运行的函数
    beforeSend: function (xhr) {
        var token = sessionStorage.getItem("x-auth-token");
        if (!(token === null || token === undefined))
            xhr.setRequestHeader("x-auth-token", token);
        // console.log(xhr)
    },
    //请求完成,不论成功或失败
    complete: function (xhr, status) {
        // console.log(xhr, status);
        if (xhr.status === 403) {
            location.href = "../../index.html";
        }
        if (xhr.status === 500) {
            location.href = "../html/500.html";
        }
    },
    //请求失败
    error: function (xhr, status, error) {
        console.log(xhr, status, error);
        if (xhr.status === 403) {
            location.href = "../../index.html";
        }
        if (xhr.status === 500) {
            location.href = "../html/500.html";
        }
    }
});


var ysAjax = $.extend({}, {
    ajax: function (url, data, dataType, callback) {
        return $.ajax({
            type: "post",
            url: baseApi + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: dataType,
            success: function (results, s, req) {
                callback(results, req);
                // console.log(results);
            }
        });
    },
    postUpload: function (url, data, callback) {
        $.ajax({
            url: imgApi + url,
            type: "POST",
            data: data,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (res) {
                callback(res);
            },
            error: function (data) {
                callback(data.status);
            }
        });
    },
    post: function (url, data, dataType, callback) {
        return $.ajax({
            type: "post",
            url: baseApi + url + "?" + data,
            contentType: "application/json",
            dataType: dataType,
            success: function (results) {
                callback(results);
                // console.log(results);
            }
        });
    },
    get: function (url, data, dataType, callback) {
        return $.ajax({
            type: "get",
            url: baseApi + url + "?" + data,
            dataType: dataType,
            success: function (res) {
                callback(res);
            }
        });
    },

    initTable: function (ele, url, data, callback, columns, callback2, pageSizeX) {
        if (pageSizeX == "undefined") {
            pageSizeX = 10
        }
        $(ele).bootstrapTable("destroy");
        $(ele).bootstrapTable("refresh");
        $(ele).bootstrapTable({
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            undefinedText: "", //没数据显示空白
            cache: false, //是否缓存
            striped: true, //是否显示行间隔色
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            url: baseApi + url, //服务器地址
            pagination: true,
            queryParams: queryParams, // 请求条件
            silent: true,
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: pageSizeX, //单页记录数
            pageList: [10, 50, 100, 500], //可供选择的每页的行数（*）
            uniqueId: "id", //每一行的唯一标识，一般为主键列
            paginationLoop: false, // 分页禁止循环
            sortable: false,
            formatNoMatches: function () {
                //没有匹配的结果
                return "无符合条件的记录";
            },
            columns: columns,
            locale: "zh-CN", //中文支持,
            responseHandler: function (res) {
                var results = callback(res);
                if (res.data) {
                    if ($(ele).parents().is(".modal") == true) {
                        $(".modal").on("shown.bs.modal", function () {
                            return {
                                rows: results,
                                // total: res.data.totalCount == undefined ? res.data.page.totalCount : res.data.totalCount
                                total: res.data && res.data.totalCount || (res.data.page && res.data.page.totalCount) || 1
                            };
                        });
                    }
                    return {
                        rows: results,
                        // total: res.data.totalCount == undefined ? res.data.page.totalCount : res.data.totalCount
                        total: res.data && res.data.totalCount || (res.data.page && res.data.page.totalCount) || 1
                    };
                } else {
                    return {
                        rows: [],
                        total: 0
                    };
                }
                $(ele).bootstrapTable("refresh"); //刷新表格
            },
            onPostBody: function (res) {
                // 显示 bootstrap分页默认隐藏的内容
                $(".bootstrap-table .fixed-table-pagination .pull-right").css("display", "")
                $(".bootstrap-table .fixed-table-pagination .pull-left .page-list").css("display", "")
                // 给记录加上逗号
                $(".fixed-table-pagination .pagination-info").each(function () {
                    var txt
                    if ($(this).html().indexOf(",") == "-1") {
                        txt = $(this).html() + " ,"
                    } else {
                        txt = $(this).html()
                    }
                    $(this).html(txt)
                })
                // 修改button字体颜色
                $(".bootstrap-table .fixed-table-pagination .pull-left .page-list .page-size").css("color", "#384a58")
                // 默认显示[10,50,100,500]的分页下拉框
                $(".bootstrap-table .fixed-table-pagination .pull-left .page-list .dropdown-menu").empty().html(
                    `<li role="menuitem" class="active"><a href="#">10</a></li><li role="menuitem" class=""><a href="#">50</a></li><li role="menuitem" class=""><a href="#">100</a></li><li role="menuitem" class=""><a href="#">500</a></li>`
                )
                // 给新的下拉框添加点击事件
                $(".page-list li").click(function () {
                    ysAjax.initTable(ele, url, data, callback, columns, callback2, $(this).find("a").html())
                })
                //数据装完后可执行的回调,当第五个参数没有时传undefined
                callback2 && callback2(res);
            }
        });
        function queryParams(params) {
            var datas = {
                pageNo: this.pageNumber,
                pageSize: this.pageSize
            };
            var params = Object.assign(datas, data);
            return JSON.stringify(params);
        }
    },




});

