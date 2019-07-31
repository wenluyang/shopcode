/**
 * 1. 转换为JSON
 * 2. isJSON ?
 * 3. isARRAY ?
 * 4. StringBuffer
 */

// 转换为json对象
common$toJson = function(obj) {
        if (obj == null || obj == undefined || obj == "") {
            return {};
        }
        var jsonObj;
        if (!common$isJson(obj)) {
            //jsonObj = eval("("+obj+")");
            jsonObj = jQuery.parseJSON(obj)
        } else {
            jsonObj = obj;
        }
        return jsonObj;
    }
    /*
     * 判断是否为json对象
     */
common$isJson = function(obj) {
        var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return isjson;
    }
    /*
     * 判断是否为Array对象
     */
common$isArray = function(obj) {
    if (obj == null || obj == undefined || obj == "") {
        return false;
    }
    return Object.prototype.toString.call(obj) === '[object Array]'
}

/*
 * StringBuffer
 */
// var buffer = new StringBuffer ();
// buffer.append("hello ");
// buffer.append("world");
// var result = buffer.toString();
function StringBuffer() {
    this._strings_ = new Array();
}

StringBuffer.prototype.append = function(str) {
    this._strings_.push(str);
};

StringBuffer.prototype.toString = function() {
    return this._strings_.join("");
};