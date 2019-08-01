$(function () {



    var data = {};
    function getEdition(data) {
        ysAjax.initTable("#editionTable", "/sys/region/list", data, function (res) {
            var editonArr = [];
            Date.prototype.toLocaleString = function () {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate();
            };
            res.data.records.forEach(function (ele, i) {
                ele.updateTime = (new Date(ele.updateTime)).toLocaleString()
                editonArr.push({
                    "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                    "id": ele.id,
                    "region_name": ele.regionName,
                    "fatherId": ele.fatherId,
                })

                $('#editionTable').bootstrapTable('hideColumn', 'fatherId');
            })
            return editonArr;
        })
    }

    getEdition(data);


//************************省市区三级联动**********************************//
    var province = $("#province");
    var city = $("#city");
    var preProvince = "<option value=''>选择省（省）</option>";
    var preCity = "<option value=''>选择市（市）</option>";

    var obj = {};
    //初始化
    province.html(preProvince);
    city.html(preCity);
    $.ajax({
        type: "get",
        url: baseApi + "/sys/region/get/"+0,
        contentType: 'application/json',
        dataType: "json",
        success: function (res) {
            var proData = res.data;
            proData.forEach(function (ele, i) {
                province.append("<option value=" + ele.id + ">" +
                    ele.regionName + "</option>");



            });
            }
        });


    province.change(function () {
        city.html(preCity);
        if (province.val() != "") {
            var pro_num = parseInt(province.val());

            $.ajax({
                type: "get",
                url: baseApi + "/sys/region/get/"+pro_num,
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    var cityData = res.data;
                    cityData.forEach(function (ele, i) {
                        city.append("<option value=" + ele.id + ">" +
                            ele.regionName + "</option>");

                    });

                    var data = {
                        fatherId: province.find('option:selected').val()
                    }
                    getEdition(data);

                }
            });

        }

    });


    city.change(function () {
        if (city.val() != "") {
            var data = {
                fatherId: city.find('option:selected').val()
            }
            getEdition(data);

        }
    });


    $("#sel").click(function () {
        if (province.val() != "" && city.val() != ""){
            var fatherId=city.val();
        }

        if (province.val() != "" && city.val() == ""){
            var fatherId=province.val();
        }


        var selText = $("#selText");

        var data = {
            regionName: selText.val(),
            fatherId: fatherId
        }

        getEdition(data);

    });


    //    **********************************批量删除*********************************************//

    $("#btnDel").click(function () {
        var arr_value = [];
        $('input[name="btSelectItem"]:checked').each(function () {
            arr_value.push($(this).parent().parent().attr("data-uniqueid"));
        });

        if (arr_value == "") {
            confirm("请选择要删除的选项")
        } else {
            ysFn.confirm('你是否确定删除？', function () {
                ysAjax.ajax("/sys/region/delete", arr_value, "json", function (res) {
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


    //************************新增模态框***************************************//
    $("#btn-newAdd").click(function () {
        $("#addModal").modal({
            show: true,
        });


        //************************新增模态框省市三级联动**********************************//
        var province = $("#province1");
        var city = $("#city1");
        var preProvince = "<option value=''>选择省（省）</option>";
        var preCity = "<option value=''>选择市（市）</option>";

        var obj = {};
        //初始化
        province.html(preProvince);
        city.html(preCity);
        $.ajax({
            type: "get",
            url: baseApi + "/sys/region/get/"+0,
            contentType: 'application/json',
            dataType: "json",
            success: function (res) {
                var proData = res.data;
                proData.forEach(function (ele, i) {
                    province.append("<option value=" + ele.id + ">" +
                        ele.regionName + "</option>");
                });
            }
        });

        province.change(function () {
            city.html(preCity);
            if (province.val() != "") {
                var pro_num = parseInt(province.val());

                $.ajax({
                    type: "get",
                    url: baseApi + "/sys/region/get/"+pro_num,
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (res) {
                        var cityData = res.data;
                        cityData.forEach(function (ele, i) {
                            city.append("<option value=" + ele.id + ">" +
                                ele.regionName + "</option>");

                        });

                    }
                });

            }

        });




    });


    //************************新增省市区数据**********************************//
    $("#btnAdd").click(function () {

        var province = $("#province1").val();
        var city = $("#city1").val();
        var area = $("#area1").val();
        if(city==""){
            var fatherId=province;
        }else{
            var fatherId=city;
        }
        var dataAdd = {
            "fatherId": fatherId,
            "regionName": area,
        };

        if(province==""){
            ysFn.msgBig('请选择省份', 2, function () {});
            return;
        }



        if(area==""){
            ysFn.msgBig('请填写地区名称', 2, function () {});
            return;
        }


        ysAjax.ajax("/sys/region/create", dataAdd, "json", function (res) {
            console.log(dataAdd)
            if (res.code == "OK") {
                ysFn.msgBig('添加成功', 1, function () {})
                getEdition(data);
            } else {
                ysFn.msgBig('添加失败', 2, function () {})
            }

        });


    });


    // 关闭模态框清空数据
    $('#addModal').on('hidden.bs.modal', function (e) {
        $("#province1").val("");
        $("#city1").val("");
        $("#area1").val("");
    })


    //************************编辑省市区数据**********************************//
    $("#editionTable").on("click", ".blued", function () {
        var id = $(this).parent().parent().attr("data-uniqueid");

        changId = id;
        $("#changeModal").modal({
            show: true
        })

        ysAjax.get("/sys/region/get", "id=" + id, "json", function (res) {
            if (res.code == "OK") {
                $("#area2").val(res.data.regionName)
                $("#fatherId2").val(res.data.fatherId)
            }

        });

    });


    //************************编辑提交动作**********************************//
    $("#btnChang").click(function () {
        var regionName = $("#area2").val();
        var fatherId = $("#fatherId2").val();
        var changData={
            "regionName": regionName,
            "iD": changId,
            "fatherId": fatherId,
        };

        if(regionName==""){
            ysFn.msgBig('地区名称不能为空', 2, function () {});
            return;
        }



        ysAjax.ajax('/sys/region/update',changData, "json",function (res) {
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
    if (row.fatherId!=0){
        var e = '  <a href="###" title="" class="blued">修改</a>'
        return e;
    }

}