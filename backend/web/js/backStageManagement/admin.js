//   run  2019-4-24 (重构教育局开通JS)

$(function () {

        function OpenAdminMangment(parm) {
            this.parm = parm;
            this.init()
        }

        OpenAdminMangment.prototype = {
            constructor: OpenAdminMangment,
            init() {
                var _this = this;
                this.getSelectAdmin(); // 获取表格数据
                this.clickSearchBtn(); // 点击搜索按钮进行查询
                this.clickAddAdmin(); // 添加管理员
                this.clickUpdateAdmin(); // 修改管理员
                this.clickDelBtn(); // 批量删除管理员

            },


            //  管理员列表
            getSelectAdmin() {
                var _this = this;
                ysAjax.initTable('.tableOpen', _this.parm.api.getSelectAdminApi, _this.parm.getSelctAdminParm, function (res) {
                    if (res.data.code == 'OK') {
                        var arr = [];
                        var newData = res.data.records;
                        newData.forEach(function (e, i) {
                            arr.push({
                                "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                                "username": e.username,
                                "id2": e.id,
                                "id": e.id,
                                "rolename": e.rolename

                            })
                        })
                    }
                    return arr;
                })
            },


            // 添加管理员模态框
            clickAddAdmin() {
                var _this = this;
                $('#btn-open').click(function () {
                    $("#adminModal").modal('show');
                    //渲染角色下来菜单
                    _this.addRole('#roleid');

                });


                //验证
                $('#addAdmin').ysValidate({
                    tooltip: true,
                    fields: {
                        password: {
                            validators: {
                                stringLength: {
                                    min: 1,
                                    max: 30,
                                    message: '1-30字'
                                },
                                xx: {
                                    message: '必填，可由数字字母-_组成',
                                    regexp: /^[a-zA-Z0-9\-_]{1,30}$/
                                }
                            }
                        },
                        username: {
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
                        roleid: {
                            validators: {
                                notEmpty: {
                                    message: '未选择'
                                },
                            }
                        },

                        phone: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 19,
                                    message: '最多19字'
                                },
                                xx: {
                                    message: '电话格式不对',
                                    regexp: /^$|^(0\d{2,4})?\d{7,8}(\d{1,4})?$|^(0\d{2,4}-)?\d{7,8}(-\d{1,4})?$|^1[0-9]{10}$/
                                }
                            }
                        },

                        email: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 19,
                                    message: '最多19字'
                                },
                                xx: {
                                    message: '邮箱格式不对',
                                    regexp: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                }
                            }
                        },


                    }

                });


                $("#btnOpen").click(function () {
                    var isPass = $("#addAdmin").ysValidate("isPass")
                    if (!isPass) return
                    _this.parm.openAdminParm.username = $("#username").val();
                    _this.parm.openAdminParm.password = $("#password").val();
                    _this.parm.openAdminParm.phone = $("#phone").val();
                    _this.parm.openAdminParm.email = $("#email").val();
                    _this.parm.openAdminParm.roleid = $("#roleid").val();
                    _this.parm.openAdminParm.rolename = $("#roleid").find("option:selected").text();
                    ysAjax.ajax(_this.parm.api.openAdminApi, _this.parm.openAdminParm, 'json', function (res) {
                        if (res.code == 200) {
                            $("#adminModal").modal('hide');
                            ysFn.msgBig('开通成功！', 1, function () {
                                _this.getSelectAdmin();
                            });

                            $('#addAdmin')[0].reset();
                            // $("#bureauModal").ysValidate("destroy")
                        } else if (res.code == 500) {
                            ysFn.msgBig(res.msg, 2, function () {
                            });
                        } else {
                            ysFn.msgBig('开通失败', 2, function () {
                            });
                        }

                        $("#adminModal").ysValidate('destroy');

                    });


                });
            },


            //  修改理员模态框
            clickUpdateAdmin() {
                var _this = this;
                $(".tableOpen").on("click", ".edit", function () {
                    dataId = $(this).parent().parent().attr("data-uniqueid");
                    $("#EditModal").modal('show');
                    //渲染角色下来菜单
                    _this.addRole('#roleid1');


                    //修改验证
                    $('#EditForm').ysValidate({
                        tooltip: true,
                        fields: {
                            username1: {
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
                            roleid1: {
                                validators: {
                                    notEmpty: {
                                        message: '未选择'
                                    },
                                }
                            },

                            phone1: {
                                validators: {
                                    stringLength: {
                                        min: 0,
                                        max: 19,
                                        message: '最多19字'
                                    },
                                    xx: {
                                        message: '电话格式不对',
                                        regexp: /^$|^(0\d{2,4})?\d{7,8}(\d{1,4})?$|^(0\d{2,4}-)?\d{7,8}(-\d{1,4})?$|^1[0-9]{10}$/
                                    }
                                }
                            },

                            email1: {
                                validators: {
                                    stringLength: {
                                        min: 0,
                                        max: 19,
                                        message: '最多19字'
                                    },
                                    xx: {
                                        message: '邮箱格式不对',
                                        regexp: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                                    }
                                }
                            },


                        }

                    });

                    // 数据反选
                    ysAjax.get(_this.parm.api.UpdataAdminDataApi, 'id=' + dataId, 'json', function (res) {
                        if (res.code == 200) {
                            $("#username1").val(res.data.username);
                            $("#phone1").val(res.data.phone);
                            $("#email1").val(res.data.email);
                            $('#roleid1').val(res.data.roleid);
                            $("#roleid1").trigger("change")

                        }
                    })
                })


                // 点击修改按钮提交
                $('#btnEdit').click(function () {
                    var isPass = $("#EditForm").ysValidate("isPass")
                    if (!isPass) return;
                    _this.parm.updateAdminParm.id = dataId;
                    _this.parm.updateAdminParm.username = $("#username1").val();
                    _this.parm.updateAdminParm.username = $("#username1").val();
                    _this.parm.updateAdminParm.password = $("#password1").val();
                    _this.parm.updateAdminParm.phone = $("#phone1").val();
                    _this.parm.updateAdminParm.email = $("#email1").val();
                    _this.parm.updateAdminParm.roleid = $("#roleid1").val();
                    _this.parm.updateAdminParm.rolename = $("#roleid1").find("option:selected").text();

                    //更新管理员
                    ysAjax.ajax(_this.parm.api.updateAdminApi, _this.parm.updateAdminParm, 'json', function (res) {
                        if (res.code == 200) {
                            ysFn.msgBig('修改成功！', 1, function () {
                                $("#EditModal").modal('hide');
                                _this.getSelectAdmin();
                                $("#EditForm").ysValidate("destroy")
                            });
                        } else if (res.code == 500) {
                            ysFn.msgBig(res.msg, 2, function () {
                            });
                        } else {
                            ysFn.msgBig('修改失败', 2, function () {
                            });
                        }
                    })
                })
            },


            //渲染角色下来菜单
            addRole(roleidObject) {
                var _this = this;
                ysAjax.get(_this.parm.api.getSelectRoleApi, '', 'json', function (res) {
                    console.log(res);
                    var roleid = ["<option value=''>选择所属角色</option>"];
                    if (res.code == 200) {
                        res.data.forEach(function (ele, i) {
                            roleid.push(`<option value="${ele.id}">${ele.name}</option>`)
                        });

                        $(roleidObject).empty().html(roleid.join(''));


                    }

                })
            }
            ,


            // 点击搜索按钮进行查询
            clickSearchBtn() {
                var _this = this;
                $('#sel').click(function () {
                    var satu = $("#selText").val();
                    _this.parm.getSelctAdminParm.username = satu;
                    _this.getSelectAdmin()
                })
            }
            ,


            //点击删除按钮批量删除
            clickDelBtn() {
                var _this = this;
                $('#delete').click(function () {
                    var delArr = []
                    var arr = $(".tableOpen").bootstrapTable('getAllSelections');
                    if (arr.length == 0) {
                        ysFn.msgBig('请选择要删除的管理员', 2);
                    } else {
                        arr.forEach(function (e, i) {
                            console.log(e)
                            delArr.push(e.id2)
                        })
                        ysFn.confirm('你确定要删除吗？', function () {
                            console.log(delArr)
                            ysAjax.ajax(_this.parm.api.deleteApi, delArr, 'json', function (res) {
                                console.log(res)
                                if (res.code == 200) {
                                    ysFn.msgBig('删除成功', 1, function () {
                                        _this.getSelectAdmin();
                                    });

                                } else {
                                    ysFn.msgBig('删除失败', 2);
                                }
                            })
                        })

                    }
                })
            }
            ,


        }


        var parm = {
            api: {
                getSelectAdminApi: '/admin/admin/list',//获取管理员列表
                openAdminApi: '/admin/admin/add',//添加管理员
                getSelectRoleApi: '/admin/role/getselectlist',//角色下拉列表
                deleteApi: '/admin/admin/remove',  //批量删除
                UpdataAdminDataApi: '/admin/admin/getone',  //更新前的数据反显
                updateAdminApi: '/admin/admin/edit',  //更新前的数据反显

            },
            getSelctAdminParm: {  // 列表查询参数
                username: "",
            },

            openAdminParm: {   //   添加管理员参数
                username: "",
                password: "",
                phone: "",
                email: "",
                rolename: "",
                roleid: ""
            },

            updateAdminParm: { //   更新管理员参数
                username: "",
                password: "",
                phone: "",
                email: "",
                rolename: "",
                roleid: "",
                id: ""
            },


        }
        new OpenAdminMangment(parm)
    }
)


function dataOptionFormatter(value, row, index) {
    if (row.id != 1) {
        var e = '<a href="javascript:void(0);" title=""class="blued edit" >修改</a>';
    } else {
        var e = '<a href="javascript:void(0);" title="">超级管理员不允许修改</a>';
    }

    return e;

}

