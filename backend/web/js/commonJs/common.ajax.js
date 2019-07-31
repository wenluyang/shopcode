/*
 * Ajax请求封装
 * ysAjax.post
 * ysAjax.ajax
 *
 *
 */
//
$(function () {});

// 测试环境
var baseApi = "http://www.api.com";




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
        // console.log(xhr, status, error);
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
            },
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





});



