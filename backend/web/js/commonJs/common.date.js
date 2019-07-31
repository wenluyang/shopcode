

/**
 * 计算输入时间begintime与endtime之间的时间单位的时间差
 * @param begintime 开始时间字符串 格式：yyyy-MM-dd hh:mm:ss 例如：2017-01-01 10:15:00
 * @param endtime 结束时间字符串 格式：yyyy-MM-dd hh:mm:ss 例如：2017-01-01 10:15:00
 * @param timeUnit 时间单位： ms/毫秒,s/秒,m/分钟,h/小时,d/天
 * @returns 时间单位的时间差
 */
function dateDiff(begintime, endtime, timeUnit) {
    var begintime_ms = Date.parse(new Date(begintime.replace(/-/g, "/"))); //begintime 为开始时间
    var endtime_ms = Date.parse(new Date(endtime.replace(/-/g, "/"))); // endtime 为结束时间
    var diff_ms = begintime_ms - endtime_ms; //时间差的毫秒数

    if (timeUnit === 'ms') {
        return diff_ms;
    }
    if (timeUnit === 's') {
        var diff_second = Math.floor(diff_ms / 1000);
        return diff_second;
    }
    if (timeUnit === 'm') {
        var diff_minutes = Math.floor(diff_ms / (1000 * 60));
        return diff_minutes;
    }
    if (timeUnit === 'h') {
        var diff_hour = Math.floor(diff_ms / (1000 * 60 * 60));
        return diff_hour;
    }
    if (timeUnit === 'd') {
        var diff_day = Math.floor(diff_ms / (1000 * 60 * 60 * 24 ));
        return diff_day;
    }
    return "";
}

/**
 * 获取某个时间单位后的日期字符串，格式：yyyy-MM-dd hh:mm:ss
 * @param inputDate 原始日期Date类型
 * @param n 时间步长
 * @param timeUnit 时间单位
 * @returns 日期字符串
 */
function calcDate(inputDate, n, timeUnit) {
    //var inputDate = new Date();
    if (timeUnit === 'y') {
        inputDate.setFullYear(inputDate.getFullYear() + n);
    } else if (timeUnit === 'M') {
        inputDate.setMonth(inputDate.getMonth() + n);
    } else if (timeUnit === 'd') {
        inputDate.setDate(inputDate.getDate() + n);
    } else if (timeUnit == 'h') {
        inputDate.setHours(inputDate.getHours() + n);
    } else if (timeUnit == 'm') {
        inputDate.setMinutes(inputDate.getMinutes() + n);
    } else if (timeUnit == 's') {
        inputDate.setSeconds(inputDate.getSeconds() + n);
    }
    var strYear = inputDate.getFullYear();
    var strMonth = inputDate.getMonth() + 1;
    var strDay = inputDate.getDate();
    var strHours = inputDate.getHours();
    var strMinutes = inputDate.getMinutes();
    var strSeconds = inputDate.getSeconds();
    var datastr = strYear + '-' + formatNumber(strMonth) + '-' + formatNumber(strDay) +
        ' ' + formatNumber(strHours) + ':' + formatNumber(strMinutes) + ':' + formatNumber(strSeconds);
    return datastr;
}
function formatNumber(value){
    return (value < 10 ? '0' : '') + value;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * 调用：
 * var time1 = new Date().Format("yyyy-MM-dd");
 * var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
       if (new RegExp("(" + k + ")").test(fmt)) fmt =
           fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
