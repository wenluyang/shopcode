$(function () {
    var data = {};
    function getEdition(data) {
        ysAjax.initTable("#editionTable", "/sys/dictionary/list", data, function (res) {
            var editonArr = [];
            Date.prototype.toLocaleString = function () {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
            };
            res.data.records.forEach(function (ele, i) {
                ele.updateTime = (new Date(ele.updateTime)).toLocaleString()
                editonArr.push({
                    "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                    "id": ele.id,
                    "description": ele.nodeDescription,
                    "code": ele.nodeCode,
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
    //************************新增**********************************//
    $("#btnAdd").click(function () {
        var dictionarytype = $("#dictionarytype").val();
        var code = $("#nodeCode").val();
        var description = $("#nodeDescription").val();
        var dataAdd = {
            "dictionaryType": dictionarytype,
            "nodeCode": code,
            "nodeDescription": description,
        };

        if(dictionarytype==""){
            ysFn.msgBig('请选择节点所属于的类型', 2, function () {});
            return;
        }


        if(code=="" ){
            ysFn.msgBig('节点标识不能为空', 2, function () {});
            return;
        }

        if(description=="" ){
            ysFn.msgBig('节点描述不能为空', 2, function () {});
            return;
        }

        ysAjax.ajax("/sys/dictionary/create", dataAdd, "json", function (res) {
            console.log(dataAdd)
            if (res.code == "OK") {
                //   confirm("添加成功");
                ysFn.msgBig('添加成功', 1, function () {})
                getEdition(data);
            } else {
                ysFn.msgBig(res.msg, 2, function () {})
            }

        });

    });



    //************************编辑**********************************//
    $("#editionTable").on("click", ".blued", function () {
        var id = $(this).parent().parent().attr("data-uniqueid");
        changId = id;
        $("#changeModal").modal({
            show: true
        })
        ysAjax.get("/sys/dictionary/get/","id="+id,"json", function (res) {
            Date.prototype.toLocaleString = function () {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
            };
            if (res.code == "OK") {
                $("#nodeCode1").val(res.data.nodeCode);
                $("#nodeDescription1").val(res.data.nodeDescription)
                $("#dictionarytype1").val(res.data.dictionaryType)
                $("#id").val(res.data.id)
            }

        });

    });


    //************************编辑提交动作**********************************//
    $("#btnChang").click(function () {
        var dictionarytype = $("#dictionarytype1").val();
        var code = $("#nodeCode1").val();
        var description = $("#nodeDescription1").val();
        var id = $("#id").val();
        var changData={
            "dictionaryType": dictionarytype,
            "nodeCode": code,
            "nodeDescription": description,
            "id": id
        };

        if(dictionarytype==""){
            ysFn.msgBig('请选择节点所属于的类型', 2, function () {});
            return;
        }


        if(code=="" ){
            ysFn.msgBig('节点标识不能为空', 2, function () {});
            return;
        }

        if(description=="" ){
            ysFn.msgBig('节点描述不能为空', 2, function () {});
            return;
        }

        ysAjax.ajax('/sys/dictionary/update',changData, "json",function (res) {
            if (res.code == "OK") {
                ysFn.msgBig('编辑成功', 1, function () {});
                getEdition(data);
            } else {
                ysFn.msgBig(res.msg, 2, function () {})
            }

        });

    });

    //************************关闭弹窗清空数据**********************************//
    // 关闭模态框清空数据
    $('#addModal').on('hidden.bs.modal', function (e) {
        $("#description").val("");
        $("#code").val("");
        $("#dictionarytype").val("");
    })


























































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
                ysAjax.ajax("/sys/dictionary/delete", arr_value, "json", function (res) {
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

});




//************************数据表格里面的操作**********************************//

function dataOptionFormatterFa(value, row, index) {
    var e = '  <a href="###" title="" class="blued">修改</a>'
    return e;
}
