$(function () {
//************************查询生涯课堂分类***************************************//

    var data = {};
    function getEdition(data) {
        ysAjax.initTable("#editionTable", "/sys/careerlecture_category/list", data, function (res) {
            var editonArr = [];
            Date.prototype.toLocaleString = function () {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
            };
            res.data.records.forEach(function (ele, i) {
                ele.updateTime = (new Date(ele.updateTime)).toLocaleString()
                editonArr.push({
                    "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                    "id": ele.id,
                    "categoryName": ele.categoryName,
                    "createTime": ele.updateTime,
                })
            })
            return editonArr;
        })
    }

    getEdition(data);

//************************新增模态框***************************************//
    $("#btn-newAdd").click(function () {
        $("#addModal").modal({
            show: true
        });
    });
//************************单个删除或者批量删除***************************************//
    $("#btnDel").click(function () {
        var arr_value = [];
        $('input[name="btSelectItem"]:checked').each(function () {
            arr_value.push($(this).parent().parent().attr("data-uniqueid"));
        });

        if (arr_value == "") {
            confirm("请选择要删除的选项")
        } else {
            ysFn.confirm('你是否确定删除？', function () {
                ysAjax.ajax("/sys/careerlecture_category/delete", arr_value, "json", function (res) {
                    if (res.code == "OK") {
                        ysFn.msgBig('删除成功', 1, function () {})
                        getEdition(data);
                    } else {
                        ysFn.msgBig('删除失败', 2, function () {})
                    }
                })
            })
        }
    });
//************************新增生涯讲堂分类**********************************//
    $("#btnAdd").click(function () {
        var categoryName = $("#categoryName").val();
        var categoryPosition = $("#categoryPosition").val();
        var dataAdd = {
            "categoryName": categoryName,
            "categoryPosition": categoryPosition,
        };

        if(categoryName==""){
            ysFn.msgBig('生涯课堂分类不能为空', 2, function () {});
            return;
        }

        var r=/^[1-9][0-9]+$/gi;
        if(categoryPosition=="" || r.test(categoryPosition)==false ){
            ysFn.msgBig('生涯课堂序号不能为空，并且只能是数字', 2, function () {});
            return;
        }

        ysAjax.ajax("/sys/careerlecture_category/create", dataAdd, "json", function (res) {
            console.log(dataAdd)
            if (res.code == "OK") {
                //   confirm("添加成功");
                ysFn.msgBig('添加成功', 1, function () {})
                getEdition(data);
            } else {
                ysFn.msgBig('添加失败', 2, function () {})
            }

        });

        });

//************************关闭弹窗清空数据**********************************//
    // 关闭模态框清空数据
    $('#addModal').on('hidden.bs.modal', function (e) {
        $("#categoryName").val("");
        $("#categoryPosition").val("");
    })
//************************编辑生涯讲堂分类模态框**********************************//
    $("#editionTable").on("click", ".blued", function () {
        var id = $(this).parent().parent().attr("data-uniqueid");
        changId = id;
        $("#changeModal").modal({
            show: true
        })
        ysAjax.get("/sys/careerlecture_category/get", "id=" + id, "json", function (res) {
            Date.prototype.toLocaleString = function () {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
            };
            if (res.code == "OK") {
                $("#categoryName1").val(res.data.categoryName);
                $("#categoryPosition1").val(res.data.categoryPosition)
            }

        });

        });
//************************编辑提交动作**********************************//
    $("#btnChang").click(function () {
        var categoryName = $("#categoryName1").val();
        var categoryPosition = $("#categoryPosition1").val();
        var changData={
            "categoryName": categoryName,
            "categoryPosition": categoryPosition,
            "id": changId,
        };

        if(categoryName==""){
            ysFn.msgBig('生涯课堂分类不能为空', 2, function () {});
            return;
        }

        var r=/^[1-9][0-9]+$/gi;
        if(categoryPosition=="" || r.test(categoryPosition)==false ){
            ysFn.msgBig('生涯课堂序号不能为空，并且只能是数字', 2, function () {});
            return;
        }

        ysAjax.ajax('/sys/careerlecture_category/update',changData, "json",function (res) {
            if (res.code == "OK") {
                ysFn.msgBig('编辑成功', 1, function () {});
                getEdition(data);
            } else {
                ysFn.msgBig('更新失败', 2, function () {})
            }

        });

    });



});


//************************数据表格里面的操作**********************************//

function dataOptionFormatterFa(value, row, index) {
    var e = '  <a href="###" title="" class="blued">修改</a>'
    return e;
}
