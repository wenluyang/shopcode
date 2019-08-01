$(document).ready(function () {





    function Dictionary(params) {
        this.params = params
        this.init()
    }
    Dictionary.prototype = {
        constructor: Dictionary,
        init() {
            var _this = this
            this.getSelectList()
            this.clikItem();
            this.btnYesOrNo(); //控制按钮可否点击
            this.addAdmin(0) //新增系统
            this.addSchool() //新增学校
            this.deleteAll() // 系统批量删除
            this.topMove() // 系统批量上移
            this.bottomMove() // 系统批量下移
            this.deleteOnly() // 系统单个删除
            this.deleteSchoolOnly()
            this.deleteschoolAll()
            this.udietooAdmin()
            this.udietooSchool()
            this.getAdminTable()

            this.getAdminTable();
            this.getSchoolList()
            // this.getSchoolTable()
            // this.getSchoolList()
            // 系统
            //学校
            _this.params.selctparms.schoolFkCode = "0"
            $('#outerTab>.nav-tabs>li').click(function () {
                _this.params.type = $(this).attr("data-tab");
                if (_this.params.type == 1) {
                    $("#inside1 .nav-tabs .tab-item").eq(0).trigger("click");
                    _this.params.selctparms.dictionarytype = Number(1)
                    _this.getSelectList()
                    _this.getAdminTable();
                }
                if (_this.params.type == 2) {
                    _this.params.selctparms.dictionarytype = Number(2)
                    _this.getSchoolList()
                    _this.getSchoolTable()
                }

            })
            $("#outerTab table[data-file='dicValue']").html("123")
        },
        //查询左边列表
        getSelectList: function () {
            var _this = this
            ysAjax.ajax(_this.params.apis.selectListApi, _this.params.selctparms, "json", function (res) {
                if (res.code == "OK") {
                    var html = [];
                    $.each(res.data, function (i, v) {
                        html.push('<li class="tab-item ' + (i == 0 ? 'active' : '') + '" data-code="' + v.id + '" data-description="' + v.nodeDescription + '"><a href="#demo-ke-tab-1-1">' + v.nodeDescription + '</a></li>');
                    })
                    $("#inside" + _this.params.type).find("ul").html(html)


                }
                $("#inside1 .nav-tabs .tab-item").eq(0).trigger("click");
            })
        },
        getSchoolList() {
            var _this = this
            ysAjax.ajax(_this.params.apis.selectListApi, _this.params.selctparms, "json", function (res) {
                if (res.code == "OK") {
                    var html = [];
                    $.each(res.data, function (i, v) {
                        html.push('<li class="tab-item ' + (i == 0 ? 'active' : '') + '" data-code="' + v.id + '" data-description="' + v.nodeDescription + '"><a href="#demo-ke-tab-1-1">' + v.nodeDescription + '</a></li>');
                    })
                    $("#inside" + _this.params.type).find("ul").html(html)


                }
                $("#inside2 .nav-tabs .tab-item").eq(0).trigger("click");
            })

        },
        //获取系统表格数据
        getAdminTable() {
            var _this = this;
            $('#delBtn').addClass('disabled')
            $('#topBtn').addClass('disabled')
            $('#bomBtn').addClass('disabled')
            _this.params.getTablePram.dictionarytype = Number(1)
            ysAjax.initTable("#table-1", _this.params.apis.getTableApi, _this.params.getTablePram, function (res) {
                console.log(_this.params.getTablePram)
                // console.log(res)
                var resArr = []
                if (res.code == "OK") {

                    res.data.records.forEach(function (e, i) {
                        // console.log(e.fkCode)
                        resArr.push({
                            "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                            "dictionaryId": e.id,
                            "dicValue": e.dicValue,
                            "description": e.description,

                        })

                        // $(".type").html(e.description)
                        $(".type").eq(0).html(_this.params.description)
                    })
                }
                return resArr
            })
            //
        },
        //获取学校表格
        getSchoolTable() {
            var _this = this;
            _this.params.getTablePram.dictionarytype = Number(2)
            ysAjax.initTable("#table-2", _this.params.apis.getTableApi, _this.params.getTablePram, function (res) {

                console.log(_this.params.getTablePram)
                var resArr = []
                if (res.code == "OK") {

                    res.data.records.forEach(function (e, i) {
                        console.log(e)
                        // console.log(e.fkCode)
                        resArr.push({
                            "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                            "dictionaryId": e.id,
                            "dicValue": e.dicValue,
                            "description": e.description,

                        })
                        $(".schooltype").eq(0).html(_this.params.description)
                    })
                }
                return resArr
            })

        },
        clikItem() {
            var _this = this;
            $("#outerTab").on('click', '.tab-item', function () {
                var code = $(this).attr("data-code");
                console.log(code)
                _this.params.description = $(this).attr("data-description")
                _this.params.getTablePram.dictionaryId = code;
                var type = $('#outerTab>.nav-tabs .active').attr('data-tab');
                console.log(code)

                type == 1 ? _this.getAdminTable() : _this.getSchoolTable()
            });

        },
        //新增系统数据词典
        addAdmin(index) {
            var _this = this;


            $('#addBtn').click(function () {

                var inputs = $('#add').find('.form-control');
                $('#add .form-group label').eq(0).html('<span style="color: red;">* </span>' + _this.params.description + ':')
                $('#add').modal('show');

                $('#add').ysValidate({
                    tooltip: true,
                    fields: {
                        name: {
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 30,
                                    message: '必填，1-30字'
                                },
                                xx: {
                                    message: '必填,1-30字',
                                    regexp: /^.{1,30}$/
                                }
                            }
                        },
                        discrib: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 300,
                                    message: '最多300字'
                                },
                                xx: {
                                    message: '0-300字',
                                    regexp: /^.{0,300}$/
                                }
                            }
                        },
                    }

                });
                $("#add .btn-close").click(function () {
                    console.log(23233);
                    $("#add").ysValidate("destroy")
                })
                $("#add .close").click(function () {
                    console.log(23233);
                    $("#add").ysValidate("destroy")
                })
            })


            $("#add .confirm").click(function () {

                var isPass = $("#add").ysValidate("isPass")
                if (!isPass) return
                $("#add").ysValidate('destroy');


                var inputs = $('#add').find('.form-control');
                _this.params.addPrams.dictionarytype = Number("1")
                _this.params.addPrams.id = _this.params.getTablePram.id;
                _this.params.addPrams.dicValue = inputs.eq(0).val();
                _this.params.addPrams.description = inputs.eq(1).val()
                // console.log(_this.params.addPrams )

                // if (!_this.params.addPrams.dicValue) {
                // 	ysFn.msgBig('请填写获奖类型！', 3, function () {})
                // 	return;
                // }

                //
                $('#add').on('hidden.bs.modal', function (e) {
                    inputs.eq(0).val("");
                    inputs.eq(1).val("")
                })
                $('#add').modal('hide');

                ysAjax.ajax(_this.params.apis.addAdminApi, _this.params.addPrams, "json", function (res) {
                    // console.log(_this.params.addPrams)
                    // console.log(res)
                    if (res.code == 'OK') {
                        ysFn.msgBig('新增成功', 1);
                        _this.getAdminTable();
                        console.log("chufale")
                    } else {
                        ysFn.msgBig('新增失败', 2);
                    }

                });
            })

        },
        //新增学校系统
        addSchool() {
            var _this = this;
            $('#schaddBtn').click(function () {
                var inputs = $('#add').find('.form-control');
                $('#schadd .form-group label').eq(0).html('<span style="color: red;">* </span>' + _this.params.description + ':')
                $('#schadd').modal('show');
            })
            $("#schadd .confirm").click(function () {
                var inputs = $('#schadd').find('.form-control');
                _this.params.addPrams.dictionarytype = Number("2")
                _this.params.addPrams.dictionaryId = _this.params.getTablePram.dictionaryId;
                _this.params.addPrams.dicValue = inputs.eq(0).val();
                _this.params.addPrams.description = inputs.eq(1).val()
                // console.log(_this.params.addPrams )

                if (!_this.params.addPrams.dicValue) {
                    ysFn.msgBig('请填写类型！', 0, function () {})
                    return;
                }
                $('#schadd').on('hidden.bs.modal', function (e) {
                    inputs.eq(0).val("");
                    inputs.eq(1).val("")
                })
                $('#schadd').modal('hide');
                ysAjax.ajax(_this.params.apis.addAdminApi, _this.params.addPrams, "json", function (res) {
                    // console.log(_this.params.addPrams)
                    // console.log(res)
                    if (res.code == 'OK') {
                        ysFn.msgBig('新增成功', 1);
                        _this.getSchoolTable()
                        console.log("chufale")
                    } else {
                        ysFn.msgBig('新增失败', 2);
                    }
                });
            })
        },
        btnYesOrNo() { //按钮可否点击
            //系统数据字典按钮
            $('#table-1').on('check-all.bs.table', function () {
                $('#delBtn').removeClass('disabled')
                $('#topBtn').addClass('disabled')
                $('#bomBtn').addClass('disabled')
            });
            $('#table-1').on('uncheck-all.bs.table', function () {
                $('#delBtn').addClass('disabled')
                $('#topBtn').addClass('disabled')
                $('#bomBtn').addClass('disabled')
            });
            $('#table-1').on('check.bs.table', function (e, row, $element) {
                $('#delBtn').removeClass('disabled')
                var flagTop = false;
                var flagBom = false;
                $('#table-1').bootstrapTable('getSelections').forEach(function (e, i) {
                    if (e.index % $('.page-size').text() == 1) {
                        flagTop = true
                    }
                    if (e.index % $('.page-size').text() == 0 || $('#table-1').bootstrapTable('getData').length == e.index) {
                        flagBom = true
                    }
                })
                if (flagTop) {
                    $('#topBtn').addClass('disabled')
                } else {
                    $('#topBtn').removeClass('disabled')
                }
                if (flagBom) {
                    $('#bomBtn').addClass('disabled')
                } else {
                    $('#bomBtn').removeClass('disabled')
                }
            });
            $('#table-1').on('uncheck.bs.table', function () {
                if ($('#table-1').bootstrapTable('getSelections').length == 0) {
                    $('#delBtn').addClass('disabled')
                    $('#topBtn').addClass('disabled')
                    $('#bomBtn').addClass('disabled')
                } else {
                    var flagTop = false;
                    var flagBom = false;
                    $('#table-1').bootstrapTable('getSelections').forEach(function (e, i) {
                        if (e.index % $('.page-size').text() == 1) {
                            flagTop = true
                        }
                        if (e.index % $('.page-size').text() == 0 || $('#table-1').bootstrapTable('getData').length == e.index) {
                            flagBom = true
                        }
                    })
                    if (flagTop) {
                        $('#topBtn').addClass('disabled')
                    } else {
                        $('#topBtn').removeClass('disabled')
                    }
                    if (flagBom) {
                        $('#bomBtn').addClass('disabled')
                    } else {
                        $('#bomBtn').removeClass('disabled')
                    }
                }
            });

            //学校数据字典按钮
            $('#table-2').on('check-all.bs.table', function () {
                $('#delBtn2').removeClass('disabled')
                $('#topBtn2').addClass('disabled')
                $('#bomBtn2').addClass('disabled')
            });
            $('#table-2').on('uncheck-all.bs.table', function () {
                $('#delBtn2').addClass('disabled')
                $('#topBtn2').addClass('disabled')
                $('#bomBtn2').addClass('disabled')
            });
            $('#table-2').on('check.bs.table', function (e, row, $element) {
                $('#delBtn2').removeClass('disabled')
                var flagTop = false;
                var flagBom = false;
                $('#table-2').bootstrapTable('getSelections').forEach(function (e, i) {
                    if (e.index % $('.page-size').text() == 1) {
                        flagTop = true
                    }
                    if (e.index % $('.page-size').text() == 0 || $('#table-2').bootstrapTable('getData').length == e.index) {
                        flagBom = true
                    }
                })
                if (flagTop) {
                    $('#topBtn2').addClass('disabled')
                } else {
                    $('#topBtn2').removeClass('disabled')
                }
                if (flagBom) {
                    $('#bomBtn2').addClass('disabled')
                } else {
                    $('#bomBtn2').removeClass('disabled')
                }
            });
            $('#table-2').on('uncheck.bs.table', function () {
                if ($('#table-2').bootstrapTable('getSelections').length == 0) {
                    $('#delBtn2').addClass('disabled')
                    $('#topBtn2').addClass('disabled')
                    $('#bomBtn2').addClass('disabled')
                } else {
                    var flagTop = false;
                    var flagBom = false;
                    $('#table-2').bootstrapTable('getSelections').forEach(function (e, i) {
                        if (e.index % $('.page-size').text() == 1) {
                            flagTop = true
                        }
                        if (e.index % $('.page-size').text() == 0 || $('#table-2').bootstrapTable('getData').length == e.index) {
                            flagBom = true
                        }
                    })
                    if (flagTop) {
                        $('#topBtn2').addClass('disabled')
                    } else {
                        $('#topBtn2').removeClass('disabled')
                    }
                    if (flagBom) {
                        $('#bomBtn2').addClass('disabled')
                    } else {
                        $('#bomBtn2').removeClass('disabled')
                    }
                }
            });
        },
        //系统批量删除
        deleteAll() {
            var _this = this;
            $('#delBtn').click(function () {
                var selectArr = $('#table-1').bootstrapTable('getAllSelections');
                // console.log(selectArr)
                if (selectArr.length == 0) {
                    ysFn.msgBig('请勾选要删除的数据', 2);
                    return
                } else {
                    $.each(selectArr, function (i, v) {
                        _this.params.delInfo.push(v.id)
                    })
                    //  _this.params.delInfo();
                }
                console.log(_this.params.delInfo)
                ysAjax.ajax(_this.params.apis.deleteApi, _this.params.delInfo, "json", function (res) {
                    // console.log(_this.params.delInfo)
                    if (res.code == "OK") {
                        ysFn.msgBig('删除成功', 1);
                        _this.getAdminTable();
                    }
                    _this.params.delInfo = [];
                })
            })
        },
        //批量上移
        topMove() {
            var _this = this;
            $('#topBtn').click(function () { //系统批量上移
                var arr = []
                var selectArr = $('#table-1').bootstrapTable('getAllSelections');
                var selectAllArr = $('#table-1').bootstrapTable('getData');
                // console.log(selectArr)
                if (selectArr.length == 0) {
                    ysFn.msgBig('请勾选要上移的数据', 2);
                    return
                } else {
                    if ($('#topBtn').hasClass('disabled')) {
                        return
                    }
                    console.log(selectArr)
                    for (var i = 0; i < selectArr.length; i++) {
                        for (var j = selectAllArr.length - 1; j > 0; j--) {
                            if (selectArr[i].id == selectAllArr[j].id) {
                                var id = selectAllArr[j].id
                                selectAllArr[j].id = selectAllArr[j - 1].id
                                selectAllArr[j - 1].id = id
                                break;
                            }
                        }
                    }
                    console.log(selectAllArr)
                    $.each(selectAllArr, function (i, v) {
                        arr.push({
                            id: v.id,
                            dicPosition: v.index
                        })
                    })
                }
                console.log(arr)
                ysAjax.ajax(_this.params.apis.moveApi, arr, "json", function (res) {
                    console.log(res)
                    if (res.code == "OK") {
                        ysFn.msgBig('上移成功', 1);
                        _this.getAdminTable();
                    }
                })
            })
            $('#topBtn2').click(function () { //学校批量上移
                var arr = []
                var selectArr = $('#table-2').bootstrapTable('getAllSelections');
                var selectAllArr = $('#table-2').bootstrapTable('getData');
                // console.log(selectArr)
                if (selectArr.length == 0) {
                    ysFn.msgBig('请勾选要上移的数据', 2);
                    return
                } else {
                    if ($('#topBtn2').hasClass('disabled')) {
                        return
                    }
                    console.log(selectArr)
                    for (var i = 0; i < selectArr.length; i++) {
                        for (var j = selectAllArr.length - 1; j > 0; j--) {
                            if (selectArr[i].id == selectAllArr[j].id) {
                                var id = selectAllArr[j].id
                                selectAllArr[j].id = selectAllArr[j - 1].id
                                selectAllArr[j - 1].id = id
                                break;
                            }
                        }
                    }
                    console.log(selectAllArr)
                    $.each(selectAllArr, function (i, v) {
                        arr.push({
                            id: v.id,
                            dicPosition: v.index
                        })
                    })
                }
                console.log(arr)
                ysAjax.ajax(_this.params.apis.moveApi, arr, "json", function (res) {
                    console.log(res)
                    if (res.code == "OK") {
                        ysFn.msgBig('上移成功', 1);
                        _this.getSchoolTable();
                    }
                })
            })
        },
        //批量下移
        bottomMove() {
            var _this = this;
            $('#bomBtn').click(function () { //系统批量下移
                var arr = []
                var selectArr = $('#table-1').bootstrapTable('getAllSelections');
                var selectAllArr = $('#table-1').bootstrapTable('getData');
                // console.log(selectArr)
                if (selectArr.length == 0) {
                    ysFn.msgBig('请勾选要下移的数据', 2);
                    return
                } else {
                    if ($('#bomBtn').hasClass('disabled')) {
                        return
                    }
                    console.log(selectArr)
                    for (var i = selectArr.length - 1; i >= 0; i--) {
                        for (var j = 0; j < selectAllArr.length - 1; j++) {
                            if (selectArr[i].id == selectAllArr[j].id) {
                                var id = selectAllArr[j].id
                                selectAllArr[j].id = selectAllArr[j + 1].id
                                selectAllArr[j + 1].id = id
                                break;
                            }
                        }
                    }
                    console.log(selectAllArr)
                    $.each(selectAllArr, function (i, v) {
                        arr.push({
                            id: v.id,
                            dicPosition: v.index
                        })
                    })
                }
                console.log(arr)
                ysAjax.ajax(_this.params.apis.moveApi, arr, "json", function (res) {
                    console.log(res)
                    if (res.code == "OK") {
                        ysFn.msgBig('下移成功', 1);
                        _this.getAdminTable();
                    }
                })
            })

            $('#bomBtn2').click(function () { //学校批量下移
                var arr = []
                var selectArr = $('#table-2').bootstrapTable('getAllSelections');
                var selectAllArr = $('#table-2').bootstrapTable('getData');
                // console.log(selectArr)
                if (selectArr.length == 0) {
                    ysFn.msgBig('请勾选要下移的数据', 2);
                    return
                } else {
                    if ($('#bomBtn2').hasClass('disabled')) {
                        return
                    }
                    console.log(selectArr)
                    for (var i = selectArr.length - 1; i >= 0; i--) {
                        for (var j = 0; j < selectAllArr.length - 1; j++) {
                            if (selectArr[i].id == selectAllArr[j].id) {
                                var id = selectAllArr[j].id
                                selectAllArr[j].id = selectAllArr[j + 1].id
                                selectAllArr[j + 1].id = id
                                break;
                            }
                        }
                    }
                    console.log(selectAllArr)
                    $.each(selectAllArr, function (i, v) {
                        arr.push({
                            id: v.id,
                            dicPosition: v.index
                        })
                    })
                }
                console.log(arr)
                ysAjax.ajax(_this.params.apis.moveApi, arr, "json", function (res) {
                    console.log(res)
                    if (res.code == "OK") {
                        ysFn.msgBig('下移成功', 1);
                        _this.getSchoolTable();
                    }
                })
            })
        },
        //系统单个删除
        deleteOnly() {
            var _this = this;
            $("#table-1").on("click", ".delete", function () {
                _this.params.delInfo[0] = $(this).parent().parent().attr("data-uniqueid")
                //  console.log(_this.params.delInfo)
                ysAjax.ajax(_this.params.apis.deleteApi, _this.params.delInfo, "json", function (res) {
                    console.log(_this.params.delInfo)
                    if (res.code == "OK") {
                        ysFn.msgBig('删除成功', 1);
                        _this.getAdminTable();
                    }
                    _this.params.delInfo = [];
                })

            })
        },
        deleteSchoolOnly() {
            var _this = this;
            $("#table-2").on("click", ".delete", function () {
                _this.params.delInfo[0] = $(this).parent().parent().attr("data-uniqueid")
                console.log(_this.params.delInfo)
                ysAjax.ajax(_this.params.apis.deleteApi, _this.params.delInfo, "json", function (res) {
                    console.log(_this.params.delInfo)
                    if (res.code == "OK") {
                        ysFn.msgBig('删除成功', 1);
                        _this.getSchoolTable();
                    }
                    _this.params.delInfo = [];
                })

            })

        },
        //学校批量删除
        deleteschoolAll() {
            var _this = this;
            $('#delBtn2').click(function () {
                var selectArr = $('#table-2').bootstrapTable('getAllSelections');
                console.log(selectArr)
                if (selectArr.length == 0) {
                    ysFn.msgBig('请勾选要删除的数据', 2);
                    return
                } else {
                    $.each(selectArr, function (i, v) {
                        _this.params.delInfo.push(v.id)
                    })
                    //  _this.params.delInfo();
                }
                console.log(_this.params.delInfo)
                ysAjax.ajax(_this.params.apis.deleteApi, _this.params.delInfo, "json", function (res) {
                    // console.log(_this.params.delInfo)
                    if (res.code == "OK") {
                        ysFn.msgBig('删除成功', 1);
                        _this.getSchoolTable();
                    }
                    _this.params.delInfo = [];
                })
            })
        },
        udietooAdmin() {
            var _this = this;
            var inputs = $('#update').find('.form-control');
            $("#table-1").on("click", ".blued", function (res) {
                $('#update').modal('show');
                $('#update .form-group label').eq(0).html('<span style="color: red;">* </span>' + _this.params.description + ':')

                _this.params.udietoo.fkCode = $(this).parent().parent().attr("data-uniqueid");
                ysAjax.get(_this.params.apis.InvertApi, "fkCode=" + _this.params.udietoo.fkCode, "json", function (res) {
                    // console.log(res)
                    inputs.eq(0).val(res.data.dicValue)
                    inputs.eq(1).val(res.data.description)
                })
                $('#update').ysValidate({
                    tooltip: true,
                    fields: {
                        name: {
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 30,
                                    message: '必填，1-30字'
                                },
                                xx: {
                                    message: '必填,1-30字',
                                    regexp: /^.{1,30}$/
                                }
                            }
                        },
                        discrib: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 300,
                                    message: '最多300字'
                                },
                                xx: {
                                    message: '0-300字',
                                    regexp: /^.{0,300}$/
                                }
                            }
                        },
                    }

                });
                $(".btn-close").click(function () {
                    $("#update").ysValidate("destroy")
                })
                $(".close").click(function () {
                    $("#update").ysValidate("destroy")
                })
            })
            $("#update .confirm").click(function () {
                $('#update').ysValidate({
                    tooltip: true,
                    fields: {
                        name: {
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 30,
                                    message: '必填，1-30字'
                                },
                                xx: {
                                    message: '必填,1-30字',
                                    regexp: /^.{1,30}$/
                                }
                            }
                        },
                        discrib: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 300,
                                    message: '最多300字'
                                },
                                xx: {
                                    message: '0-300字',
                                    regexp: /^.{0,300}$/
                                }
                            }
                        },
                    }

                });
                $(".btn-close").click(function () {
                    $("#update").ysValidate("destroy")
                })
                $(".close").click(function () {
                    $("#update").ysValidate("destroy")
                })
                var isPass = $('#update').ysValidate("isPass")
                if (!isPass) return
                $('#update').modal('hide');

                _this.params.udietoo.dicValue = inputs.eq(0).val();
                _this.params.udietoo.description = inputs.eq(1).val();

                // console.log(_this.params.udietoo)
                ysAjax.ajax(_this.params.apis.udietooApi, _this.params.udietoo, "json", function (res) {
                    if (res.code == 'OK') {
                        ysFn.msgBig('编辑成功', 1);
                        _this.getAdminTable();
                    } else {
                        ysFn.msgBig('编辑失败', 2);
                    }
                    $("#update").ysValidate('destroy');
                })
            })
        },
        udietooSchool() {
            var _this = this;
            var inputs = $('#schupdate').find('.form-control');
            $("#table-2").on("click", ".blued", function (res) {
                $('#schupdate .form-group label').eq(0).html('<span style="color: red;">* </span>' + _this.params.description + ':')
                $('#schupdate').modal('show');
                _this.params.udietoo.fkCode = $(this).parent().parent().attr("data-uniqueid");
                ysAjax.get(_this.params.apis.InvertApi, "fkCode=" + _this.params.udietoo.fkCode, "json", function (res) {
                    // console.log(res)
                    inputs.eq(0).val(res.data.dicValue)
                    inputs.eq(1).val(res.data.description)
                })
            })
            $("#schupdate .confirm").click(function () {
                $('#schupdate').modal('hide');

                _this.params.udietoo.dicValue = inputs.eq(0).val();
                _this.params.udietoo.description = inputs.eq(1).val();

                // console.log(_this.params.udietoo)
                ysAjax.ajax(_this.params.apis.udietooApi, _this.params.udietoo, "json", function (res) {
                    if (res.code == 'OK') {
                        ysFn.msgBig('编辑成功', 1);
                        _this.getSchoolTable();
                    } else {
                        ysFn.msgBig('编辑失败', 2);
                    }
                })
            })
        }
    }

    var params = {
        type: "1", //第几个表格
        description: "",
        apis: {
            selectListApi: "/sys/dictionary/listbytype", //查询左边列表
            getTableApi: "/sys/dic/list", // 查询表格
            addAdminApi: "/sys/dic/create", // 新增
            deleteApi: "/sys/dic/delete", // 删除
            udietooApi: "/sys/dic/update", //修改
            InvertApi: "/sys/dic/get", // 数据反显
            moveApi: "/sys/dic/updateposition" // 移动
        },
        // 左边列表参数
        selctparms: {
            dictionarytype: 1,
        },
        getTablePram: {
            dictionaryId: "",
            dictionarytype: "",
        },
        addPrams: {
            description: "",
            dictionaryId: "",
            dictionarytype: "",
            dicValue: "",
        },
        udietoo: {
            description: "",
            dicValue: "",
            fkCode: ""
        },
        delInfo: []
    }

    new Dictionary(params)
});

function dataOptionFormatterFa(value, row, index) {
    // var e = '  <a href="javascript:void(0);" title="编辑"><img src="img/btn_ic_date.png" width="18px" height="20px"/></a>|<a href="javascript:void(0);" title="删除"><img src="img/btn_icon_delete.png" width="18px" height="20px"/></a>';
    var e = '<a href="###" title=""class="blued" >修改</a>&nbsp;  <a href="###" title=""  class="delete deleted">删除</a>';
    return e;
}
