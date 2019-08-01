$(function () {

    var data = {};
    function getEdition(data) {
        ysAjax.initTable("#editionTable", "/sys/career_course/list", data, function (res) {
            var editonArr = [];
            Date.prototype.toLocaleString = function () {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
            };
            res.data.records.forEach(function (ele, i) {
                ele.updateTime = (new Date(ele.updateTime)).toLocaleString()
                editonArr.push({
                    "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                    "id": ele.id,
                    "title": ele.title,
                    "categoryName": ele.categoryId,
                    "updateTime": ele.updateTime,
                })
            })
            return editonArr;
        })
    }

    getEdition(data);

});




//************************数据表格里面的操作**********************************//

function dataOptionFormatterFa(value, row, index) {
    var e = '  <a href="###" title="" class="blued">修改</a>';
    e+='  <a href="###" title="" class="blued">删除</a>';
    return e;
}