//   run  2019-4-24 (重构教育局开通JS)

$(function () {

    function RoleMangment(parm) {
        this.parm = parm;
        this.init()
    }

    RoleMangment.prototype = {
        constructor: RoleMangment,
        init() {
            var _this = this;
            this.getSelectRole()  // 获取表格数据
            this.clickOpenRole() //添加角色
            this.clickUpdateRole() //修改角色
            this.clickSearchBtn()  // 点击搜索按钮进行查询

        },


        //  角色列表
        getSelectRole() {
            var _this = this;
            ysAjax.initTable('.tableOpen', _this.parm.api.getSelectRole, _this.parm.getSelctRoleParm, function (res) {
                if (res.data.code == 'OK') {
                    var arr = [];
                    var newData = res.data.records;
                    newData.forEach(function (e, i) {
                        arr.push({
                            "id": e.id,
                            "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                            "name": e.name,
                            "id2": e.id,

                        })
                    })
                }
                return arr;
            })
        },

        // 点击搜索按钮进行查询
        clickSearchBtn() {
            var _this = this;

            $('#sel').click(function () {
                var satu = $("#selText").val();
                var reg = /^[\u4E00-\u9FA5]+$/;
                if (reg.test(satu)) {
                    _this.parm.getSelctAdminParm.username = satu
                } else {
                    _this.parm.getSelctAdminParm.username = satu
                }
                _this.getSelctSchool()
            })
        },


        // 点击开通教育局
        clickOpenRole() {
            var _this = this;
            $('#btn-open').click(function () {
                $("#RoleModal").modal('show');

            });

            //验证
            $('#addRole').ysValidate({
                tooltip: true,
                fields: {
                    name: {
                        validators: {
                            stringLength: {
                                min: 1,
                                max: 30,
                                message: '最多30字'
                            },
                            xx: {
                                message: '必填,1-30字',
                                regexp: /^.{1,30}$/
                            }
                        }
                    },
                }
            }),


                $("#btnOpen").click(function () {
                    var isPass = $("#addRole").ysValidate("isPass")
                    if (!isPass) return
                    _this.parm.addRoleParm.name = $("#name").val();
                    // console.log(_this.parm.addRoleParm.name);
                    ysAjax.ajax(_this.parm.api.openRoleApi, _this.parm.addRoleParm, 'json', function (res) {
                        console.log(res);
                        if (res.code == 200) {
                            $("#RoleModal").modal('hide');
                            ysFn.msgBig('开通成功！', 1, function () {
                                _this.getSelectRole();
                            });

                            $('#addRole')[0].reset();
                        } else {
                            ysFn.msgBig('开通失败', 2, function () {
                            });
                        }

                        $("#RoleModal").ysValidate('destroy');

                    });

                })
        },

        //  修改
        clickUpdateRole() {
            var _this = this;
            $(".tableOpen").on("click", ".edit", function () {
                dataId = $(this).parent().parent().attr("data-uniqueid");
                console.log(dataId);
                $("#EditModal").modal('show');
//验证
                $('#EditForm').ysValidate({
                    tooltip: true,
                    fields: {
                        name1: {
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 30,
                                    message: '最多30字'
                                },
                                xx: {
                                    message: '必填,1-30字',
                                    regexp: /^.{1,30}$/
                                }
                            }
                        },
                    }

                });
                $("#EditModal .btn-default").click(function () {
                    $("#EditForm").ysValidate("destroy")
                })
                ysAjax.get(_this.parm.api.getUpdataRoleDataApi, 'id=' + dataId, 'json', function (res) {
                    if (res.code == 200) {
                        // 设置修改后的fkcode的
                        _this.parm.updateRoleParm.name = res.data.name;
                        _this.parm.updateRoleParm.id = res.data.id;

                        $("#name1").val(res.data.name);

                    }

                })
                // 点击修改按钮提交
                $('#btnEdit').click(function () {
                    var isPass = $("#EditForm").ysValidate("isPass")
                    if (!isPass) return
                    _this.parm.updateRoleParm.name = $('#name1').val();
                    _this.parm.updateRoleParm.id = dataId;
                    console.log(_this.parm.updateRoleParm);

                    ysAjax.ajax(_this.parm.api.updateRoleApi, _this.parm.updateRoleParm, 'json', function (res) {
                        console.log(res);
                        if (res.code == 200) {
                            ysFn.msgBig('修改成功！', 1, function () {
                                $("#EditModal").modal('hide');
                                _this.getSelectRole();
                                $("#EditForm").ysValidate("destroy")
                            });

                        } else {
                            if (res.code == 'dataError') {
                                ysFn.msgBig(res.msg, 2, function () {
                                });
                            } else {
                                ysFn.msgBig('修改失败', 2, function () {
                                });
                            }

                        }


                    })


                })


            })

        },


        // 点击搜索按钮进行查询
        clickSearchBtn(){
            var _this = this;

            $('#sel').click(function(){
                var satu = $("#selText").val();
                _this.parm.getSelctRoleParm.name = satu;
                _this.getSelectRole()
            })
        },
    }


    var parm = {
        api: {
            getSelectRole: '/admin/role/list',//获取角色列表
            openRoleApi: '/admin/role/add',//添加角色
            getUpdataRoleDataApi: '/admin/role/getone',  //修改数据反选
            updateRoleApi: '/admin/role/edit',  //修改


        },
        getSelctRoleParm: {  // 列表查询参数
            name: "",
        },

        addRoleParm: {   // 创建角色参数
            name: "",
        },

        updateRoleParm: { //修改角色参数
            id: "",
            name: "",
        },


    }
    new RoleMangment(parm)
})

function dataOptionFormatter(value, row, index) {
    var e = '<a href="javascript:void(0);" title=""class="blued edit" >修改</a>&nbsp;<a href="javascript:void(0);" title="" class="blued underSchool">权限设置</a>';
    return e;
}

