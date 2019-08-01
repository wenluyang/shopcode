//   run  2019-4-24 (重构教育局开通JS)

$(function(){

    function OpenBureauMangment(parm){
        this.parm = parm;
        this.init()
    }
    OpenBureauMangment.prototype = {
        constructor: OpenBureauMangment,
        init(){
            var _this = this;
            this.getSelctSchool()  // 获取表格数据
            this.getProvince()  // 查询省市区
            this.changeState()  // 刷新列表
            this.clickSearchBtn()  // 点击搜索按钮进行查询
            // this.clickDelBtn() // 点击删除按钮批量删除
            this.clickOpenEdu()  // 点击开通教育局按钮
            // this.getNextSchool()  // 下属学校
            // this.updateEdu()  // 修改

            // 渲染树资源
            // _this.rendenZtree('editAuthorizationZTree');
            _this.addOrprovince('#EditProvince', '#EditCity', '#EditArea');



        },

        //  查询省市区
        getProvince(){
            var _this = this;
            ysAjax.get(_this.parm.api.getProvinceApi,'','json',function(res){
                // console.log(res)
                var province =["<option value=''>选择省</option>"];
                var city = ["<option value=''>选择市</option>"];
                var area = ["<option value=''>选择区</option>"];
                var cityData = ''
                if(res.code=='OK'){
                    _this.parm.proTata = res.data
                    res.data.children.forEach(function(ele,i){
                        // console.log(ele)
                        province.push(`<option value="${ele.id}">${ele.text}</option>`)
                    });
                    $('#province').empty().html(province.join(''));


                    // 根据省查对应的市区
                    $('#city').empty().html(city.join(''));
                    $('#area').empty().html(area.join(''));
                    $('#province').change(function(){
                        var that = this;
                        city = ["<option value=''>选择市</option>"];
                        area = ["<option value=''>选择区</option>"];
                        $('#city').empty().html(city.join(''));
                        $('#area').empty().html(area.join(''));
                        res.data.children.forEach(function(e,i){
                            if(e.id==$(that).val()){
                                cityData = e;
                                e.children.forEach(function(value,index){
                                    city.push(`<option value="${value.id}">${value.text}</option>`)
                                })
                            }
                        })
                        $('#city').empty().html(city.join(''));

                        //选择省设置参数刷新列表
                        if ($('#province').val()==''){
                            _this.parm.getSelctSchoolParm.provinceId = '';
                            _this.parm.getSelctSchoolParm.cityId = '';
                            _this.parm.getSelctSchoolParm.areaId = '';
                        }else{
                            _this.parm.getSelctSchoolParm.provinceId = $(that).find('option:selected').val();

                        }

                        _this.getSelctSchool()

                    })

                    // 根据市查对应的区


                    $('#city').change(function(){
                        var that1 = this;
                        area = ["<option value=''>选择区</option>"];
                        cityData.children.forEach(function(value1,index1){
                            if (value1.id == $(that1).val()){
                                value1.children.forEach(function(value2,index2){
                                    area.push(`<option value="${value2.id}">${value2.text}</option>`)

                                })
                            }
                        })
                        $('#area').empty().html(area.join(''));

                        if ($('#city').val()==''){
                            _this.parm.getSelctSchoolParm.cityId = ''
                        }else{
                            _this.parm.getSelctSchoolParm.cityId = $(that1).find('option:selected').val();
                        }


                        _this.getSelctSchool()
                    })



                    // 根据区设置参数刷新列表
                    $('#area').change(function(){
                        var that = this;
                        if ($('#area').val()==''){
                            _this.parm.getSelctSchoolParm.areaId = '';
                        }else{
                            _this.parm.getSelctSchoolParm.areaId = $(that).find('option:selected').val();
                        }

                        _this.getSelctSchool()
                    })
                }
            })
        },
        //  查询教育局
        getSelctSchool(){
            var _this =this;
            ysAjax.initTable('.tableOpen', _this.parm.api.getSelctSchoolApi, _this.parm.getSelctSchoolParm, function (res) {
                // console.log(res)
                if(res.code=='OK'){
                    var arr = [];
                    var newData = res.data.records;
                    newData.forEach(function (e, i) {

                        arr.push({
                            "index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
                            "id": e.fkcode + '=' + e.id,
                            "eduCode": e.eduCode,
                            "eduName": e.eduName,
                            "eduLocus": e.eduLocus,
                            "tel": e.tel,
                            "state": e.state,
                            "fkcode": e.fkcode,
                            "id2": e.id
                        })

                    })
                }

                return arr;
            })
        },

        //根据状态刷新列表
        changeState(){
            var _this = this;
            $('#stau').change(function(){
                _this.parm.getSelctSchoolParm.state = $(this).val();
                _this.getSelctSchool()
            })
        },

        // 点击搜索按钮进行查询
        clickSearchBtn(){
            var _this = this;

            $('#sel').click(function(){
                var satu = $("#selText").val();
                var reg = /^[\u4E00-\u9FA5]+$/;
                if (reg.test(satu)) {
                    _this.parm.getSelctSchoolParm.eduName = satu
                } else {
                    _this.parm.getSelctSchoolParm.eduName = satu
                }

                _this.getSelctSchool()
            })
        },

    // 新增或者编辑时渲染模态框省市区
    addOrprovince(province,city,area){
        var _this = this;
        ysAjax.get(_this.parm.api.getProvinceApi, '', 'json', function (res) {
            // console.log(res)
            var provincetion = ["<option value=''>选择省</option>"];
            var citytion = ["<option value=''>选择市</option>"];
            var areation = ["<option value=''>选择区</option>"];
            var cityData = ''
            if (res.code == 'OK') {
                res.data.children.forEach(function (ele, i) {
                    // console.log(ele)
                    provincetion.push(`<option value="${ele.id}">${ele.text}</option>`)
                });
                $(province).empty().html(provincetion.join(''));


                // 根据省查对应的市区
                $(city).empty().html(citytion.join(''));
                $(province).change(function () {
                    var that = this;
                    citytion = ["<option value=''>选择市</option>"];
                    areation = ["<option value=''>选择区</option>"];
                    $(city).empty().html(citytion.join(''));
                    $(area).empty().html(areation.join(''));
                    res.data.children.forEach(function (e, i) {
                        if (e.id == $(that).val()) {
                            cityData = e;
                            e.children.forEach(function (value, index) {
                                citytion.push(`<option value="${value.id}">${value.text}</option>`)
                            })
                        }
                    })
                    console.log($(city))
                    $(city).empty().html(citytion.join(''));
                })

                // 根据市查对应的区
                $(area).empty().html(areation.join(''));

                $(city).change(function () {
                    var that1 = this;
                    areation = ["<option value=''>选择区</option>"];
                    cityData.children.forEach(function (value1, index1) {
                        if (value1.id == $(that1).val()) {
                            value1.children.forEach(function (value2, index2) {
                                areation.push(`<option value="${value2.id}">${value2.text}</option>`)

                            })
                        }
                    })
                    console.log($(area))
                    $(area).empty().html(areation.join(''));
                })



                // 根据区设置参数刷新列表
                $(area).change(function () {
                    var that = this;
                    // _this.parm.getSelctSchoolParm.districtName = $(that).find('option:selected').text();
                    // _this.getSelctSchool() province,city,area
                })
            }
        })
    },


        // 渲染日历
        rendenDate(start,end,timeEle){
            laydate.render({
                elem: start,
                theme: '#4C98F7',
                // format: 'yyyy-MM-dd HH:mm',
                trigger: 'click',
                // type: 'datetime'
                showBottom: false,
                done: function (value) {
                    console.log(value)
                    if ($(end).val()) {
                        console.log('11')
                        if (new Date($(end).val()).getTime() < new Date(value).getTime()) {
                            ysFn.msgBig('结束时间不能小于开始时间', 3, function () {
                                $(start).val('')
                            })
                            return
                        } else {
                            timeS = value
                            timeE = $(end).val()
                            var time = new Date(timeE).getTime() - new Date(timeS).getTime();
                            var day = (time / (24 * 60 * 60 * 1000)) + 1
                            $(timeEle).val(day + '天');
                        }
                    } else {
                        timeS = value
                    }
                    setTimeout(function () {
                        $(start).trigger("input")
                    }, 30)
                }
            });
            laydate.render({
                elem: end,
                theme: '#4C98F7',
                // format: 'yyyy-MM-dd HH:mm',
                trigger: 'click',
                // type: 'datetime'
                showBottom: false,
                done: function (value) {
                    if ($(start).val()) {
                        if (new Date(value).getTime() < new Date($(start).val()).getTime()) {
                            ysFn.msgBig('结束时间不能小于开始时间', 3, function () {
                                $(end).val('')
                            })
                            return
                        } else {
                            timeE = value
                            timeS = $(start).val()
                            var time = new Date(timeE).getTime() - new Date(timeS).getTime();
                            var day = (time / (24 * 60 * 60 * 1000)) + 1

                            console.log(timeEle)
                            $(timeEle).val(day + '天');

                        }
                    } else {
                        timeE = value
                    }
                    setTimeout(function () {
                        $(end).trigger("input")
                    }, 30)
                }
            })
        },

        // 资源树渲染
        rendenZtree(ele){
            var _this = this;
            var zTreeConfig = {
                data: {
                    keep: {
                        leaf: true,
                        parent: true
                    },
                    simpleData: {
                        enable: true,
                        idKey: "fkCode", //节点的id,注意此处要对应你后台传过来的节点的属性名id
                        pIdKey: "parentFkCode", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId
                        rootPId: 0
                    },
                    key: {
                        name: "resourceName"
                    }
                },
                check: {
                    enable: true
                }
            }
            ysAjax.get(_this.parm.api.selectResourcesApi,'type=2','json',function(res){
                // console.log(res)
                $.fn.zTree.init($('#'+ele), zTreeConfig, res.data);
            })
        },



        // 点击开通教育局
        clickOpenEdu(){
            var _this = this;
            $('#btn-open').click(function(){
                $("#bureauModal").modal('show');
                //渲染省市区
                _this.addOrprovince('#provinceModel', '#cityModel','#areaModel');
                //渲染时间日历
                _this.rendenDate('#startDate','#endDate','#addTime');

            });


            }












        }


    var parm = {
        api:{
            getProvinceApi: '/sys/region/find',   //查询省市区
            getSelctSchoolApi: '/sys/edubureau/list',//获取教育局
            selectResourcesApi:'/sys/role/selectResources',  //资源树

        },


        getSelctSchoolParm:{  // 列表查询参数
            cityId: "",
            areaId: "",
            eduName: "",
            provinceId: "",
            state: "全部"
        },


    }


        new OpenBureauMangment(parm)



})

