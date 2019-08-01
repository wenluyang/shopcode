 function dataOptionFormatter(value, row, index) {
 	// var e = '  <a href="javascript:void(0);" title="编辑"><img src="img/btn_ic_date.png" width="18px" height="20px"/></a>|<a href="javascript:void(0);" title="删除"><img src="img/btn_icon_delete.png" width="18px" height="20px"/></a>';
 	var e = ' <a href="javascript:void(0);" title=""class="edit deleted"  >修改</a>&nbsp;  <a href="javascript:void(0);" title="" class="blued">查看</a>&nbsp;';
 	return e;
 }

 function dataStatusFormatter(value, row, index) {
 	var a = "<div class='label label-table label-";
 	var b = '';
 	var c = "</div>";
 	if (value == '0')
 		b = 'info\' >' + '状态1';
 	if (value == '1')
 		b = 'success\' >' + '状态2';
 	if (value == '2')
 		b = 'primary\' >' + '状态3';
 	if (value == '3')
 		b = 'pink\' >' + '状态4';
 	return a + b + c;
 }
 $(function () {
 	var flag;
 	if (sessionStorage.getItem("indentity") == 6) {
 		$(".page-title-white").html(
 			'<ol class="breadcrumb ">' +
 			'<i class="fa fa-home lh22">&nbsp;您现在的位置:</i>' +
 			'<li>' +
 			'<a href="javascript:void(0);">系统管理</a>' +
 			'</li>' +
 			'<li class="active">' +
 			'<a href="javascript:void(0);">学校开通</a>' +
 			'</li>' +
 			'</ol>'
 		)
 	}
 	var timeS;
 	var timeE;

 	laydate.render({
 		elem: '#start',
 		theme: '#4C98F7',
 		// format: 'yyyy-MM-dd HH:mm',
 		trigger: 'click',
 		// type: 'datetime'
 		showBottom: false,
 		done: function (value) {
 			console.log(value)
 			console.log(timeS)
 			console.log(timeE)
 			if (timeE) {
 				if (new Date(timeE).getTime() < new Date(value).getTime()) {
 					ysFn.msgBig('结束时间不能小于开始时间', 3, function () {
 						$('#start').val('')
 					})
 					return
 				} else {
 					timeS = value
 					var time = new Date(timeE).getTime() - new Date(timeS).getTime();
 					var day = (time / (24 * 60 * 60 * 1000)) + 1
 					$('#addTime').val(day + '天');
 				}
 			} else {
 				timeS = value
 			}
 		}
 	});
 	laydate.render({
 		elem: '#end',
 		theme: '#4C98F7',
 		// format: 'yyyy-MM-dd HH:mm',
 		trigger: 'click',
 		// type: 'datetime'
 		showBottom: false,
 		done: function (value) {
 			console.log(value)
 			console.log(timeS)
 			console.log(timeE)
 			if (timeS) {
 				if (new Date(value).getTime() < new Date(timeS).getTime()) {
 					ysFn.msgBig('结束时间不能小于开始时间', 3, function () {
 						$('#end').val('')
 					})
 					return
 				} else {
 					timeE = value
 					var time = new Date(timeE).getTime() - new Date(timeS).getTime();
 					var day = (time / (24 * 60 * 60 * 1000)) + 1
 					$('#addTime').val(day + '天');
 				}
 			} else {
 				timeE = value
 			}
 		}
 	});

 	schoolOpenArr.forEach(function (item, i) {
 		// console.log(item)
 		switch (item.text) {
 			case '新增':
 				$('#btn-open').removeClass('hidden');
 				break;
 			case '删除':
 				$('#moreDeit').removeClass('hidden');
 			default:
 				break;
 		}
 	})

 	var data = {
 		state: ""
 	}



 	// laydate.render({
 	// 	elem: '#start',
 	// 	theme: '#4C98F7',
 	// 	// format: 'yyyy-MM-dd HH:mm',
 	// 	trigger: 'click',
 	// 	// type: 'datetime'
 	// 	showBottom: false
 	// });
 	// laydate.render({
 	// 	elem: '#end',
 	// 	theme: '#4C98F7',
 	// 	// format: 'yyyy-MM-dd HH:mm',
 	// 	trigger: 'click',
 	// 	// type: 'datetime'
 	// 	showBottom: false
 	// });

 	//办学性质  数据词典
 	var schoolNature
 	ysAjax.ajax('/sys/dadicary/getDicValue', {
 		"dicCode": "SCHOOLTYPE",
 		"dicType": 1,
 		"schoolFkCode": sessionStorage.getItem('schoolFkCode')
 	}, 'json', function (res1) {
 		 console.log(res1)
 		schoolNature = res1.data
 		var NationalSelect = ['<option  disabled selected value="">请选择办学性质</option>'];
 		res1.data.forEach(function (e, i) {
 			NationalSelect.push('<option value=' + e.dicKey + '>' + e.dicValue + '</option>');
 		})
 		$('#select').html('').append(NationalSelect);
 		$('#editselect').html('').append(NationalSelect);

 	})

 	function getDevPlanTable(data) {
 		//办学性质  数据词典
 		var schoolNature
 		ysAjax.ajax('/sys/dadicary/getDicValue', {
 			"dicCode": "SCHOOLTYPE",
 			"dicType": 1,
 			"schoolFkCode": sessionStorage.getItem('schoolFkCode')
 		}, 'json', function (res1) {
 			// console.log(res)
 			schoolNature = res1.data
 			ysAjax.initTable('.schoolOpen', '/sys/SysSchoolOpen/selectList', data, function (res) {
 				 console.log(res)
 				var resArray = [];
 				res.data.records.forEach(function (ele, i) {
 					//        	console.log(ele)
 					schoolNature.forEach(function (e, i) {
 						if (e.dicKey == ele.schoolNature) {
 							ele.schoolNature = e.dicValue
 						}
 					})
 					ele.uploadTime = (new Date(ele.uploadTime)).toLocaleString()
 					resArray.push({
 						"index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
 						"id": ele.id + "=" + ele.schoolFkCode,
 						//  "schoolFkCode":,
 						"schoolCode": ele.schoolCode,
 						"schoolName": ele.schoolName,
 						"schoolNature": ele.schoolNature,
 						"schoolLocus": ele.schoolLocus,
 						"schoolTel": ele.schoolTel,
 						"state": ele.state
 					})
 				})
 				return resArray;
 			})
 		})

 	}
 	data.state = "全部"

 	getDevPlanTable(data)


 	// 点击查看学校信息传递参数 ../baseInfo/baseInfo-school-Info.html
 	$(".schoolOpen ").on("click", ".blued", function () {
 		$('#checkModal').find('.form-control').text('');
 		$('#checkModal').modal();
 		var code = $(this).parent().parent().attr("data-uniqueid").split("=")[0];
 		ysAjax.get('/sys/SysSchoolOpen/updateSelect', 'id=' + code, 'json', function (res) {
 			$('#checkModal').find('#schoolTel').text(res.data.schoolTel);
 			$('#checkModal').find('#schoolCode').text(res.data.schoolCode);
 			$('#checkModal').find('#schoolName').text(res.data.schoolName);
 			$('#checkModal').find('#schooladdress').text(res.data.provinceName + (res.data.cityName ? ',' + res.data.cityName : '') + (res.data.districtName ? ',' + res.data.districtName : ''));
 			getschoolBelongEducationbureau(res.data.provinceName, res.data.cityName, res.data.districtName, function (arr) {
 				arr.forEach(function (item, i) {
 					if (item.fkcode == res.data.eduBureauFkCode) {
 						console.log(item.eduName)
 						$('#checkModal').find('#schoolBelongEducationbureau').html(item.eduName);
 					}
 				})
 			})
 			var schoolStagesArr = res.data.schoolStages.toString().split('0');
 			var stageArr = []
 			schoolStagesArr.forEach(function (item, i) {
 				SchoolStages.forEach(function (e, i) {
 					if (item == e.dicKey) {
 						stageArr.push(e.dicValue);
 					}
 				})
 			})
 			$('#checkModal').find('#schoolStages').text(stageArr.join(','));
 			schoolNature.forEach(function (e, i) {
 				if (e.dicKey == res.data.schoolNature) {
 					$('#checkModal').find('#schoolNature').text(e.dicValue);
 				}
 			})

 			$('#checkModal').find('#serveTime').text(new Date(res.data.validStartTime).yymmdd('-') + ' 至 ' + new Date(res.data.validEndTime).yymmdd('-'));
 			//  $('#checkModal').find('#serveDateTime').text()
 			// var year = new Date(res.data.validEndTime).getFullYear() - new Date(res.data.validStartTime).getFullYear();
 			// var month = (new Date(res.data.validEndTime).getMonth() + 1) - (new Date(res.data.validStartTime).getMonth() + 1);
 			// var day = new Date(res.data.validEndTime).getDate() - new Date(res.data.validStartTime).getDate();
 			var day = ((res.data.validEndTime - res.data.validStartTime) / (24 * 60 * 60 * 1000)) + 1
 			// $('#serveDateTime').html(year + '年 ' + month + '月' + day + '日');
 			$('#serveDateTime').html(day + '天');
 			$('#isAutOremind').html(res.data.remindAuto == 1 ? '提前30天提醒' : '不需要提醒');
 			var checkzTreeConfig = {
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
 			}
 			var treeObj = $.fn.zTree.init($("#checkAuthorizationZtree"), checkzTreeConfig, res.data.listResources);
 			// treeObj.expandAll(true);
 			var treeObj1 = $.fn.zTree.getZTreeObj("checkAuthorizationZtree");
 			var nodes = treeObj1.getNodes()
 			treeObj1.expandNode(nodes[0]);
 		})

 		// localStorage.setItem("schoolFkCode", code)
 		// console.log(localStorage.getItem("schoolFkCode"))
 		// window.location.href = "../baseInfo/baseInfo-school-Info.html?type=1";
 	})
 	/**
 	 * 
 	 * @param {*} provinceName 省名称
 	 * @param {*} cityName 市名称
 	 * @param {*} districtName 区名称
 	 * @param {*} callback 回调函数
 	 */
 	function getschoolBelongEducationbureau(provinceName, cityName, districtName, callback) {
 		ysAjax.ajax('/sys/SysEduBureau/select', {
 			cityName: cityName,
 			districtName: districtName,
 			provinceName: provinceName
 		}, 'json', function (res) {
 			callback(res.data);
 		})
 	}





 	//省市区三级联动	

 	var province = $("#province");
 	var city = $("#city");
 	var area = $("#area");
 	var preProvince = "<option value=''>选择省（省）</option>";
 	var preCity = "<option value=''>选择市（市）</option>";
 	var preArea = "<option value=''>选择区（县）</option>";
 	var obj = {};
 	//初始化 
 	province.html(preProvince);
 	city.html(preCity);
 	area.html(preArea)


 	$.ajax({
 		type: "get",
 		url: baseApi + "/sys/area/find",
 		contentType: 'application/json',
 		dataType: "json",
 		success: function (res) {
 			var proData = res.data.children;
 			//	    	console.log(proData)
 			proData.forEach(function (ele, i) {
 				//	    		console.log(ele)

 				//          渲染省的下拉框
 				province.append("<option value=" + i + ">" +
 					ele.text + "</option>");

 			})
 			province.change(function () {
 				city.html(preCity);
 				area.html(preArea)
 				if (province.val() != "") {
 					var pro_num = parseInt(province.val());
 					var cityCode = res.data.children[pro_num].children;
 					console.log(cityCode)
 					var data = {
 						state: "全部",
 						provinceName: province.find('option:selected').text()
 					}
 					getDevPlanTable(data);
 					cityCode.forEach(function (citydata, j) {

 						city.append("<option value=" + j + ">" +
 							citydata.text + "</option>");
 						obj.proId = citydata.parentId;
 						obj.proText = res.data.children[pro_num].text;
 						//			            obj.cityText = citydata.text ;
 					})

 				} else {
 					obj.proId = '';
 					obj.proText = '';
 					obj.cityId = '';
 					obj.cityText = '';
 					obj.areaId = '';
 					obj.areaText = '';
 					data = {
 						state: "全部"
 					}
 					getDevPlanTable(data);
 				}
 			});

 			city.change(function () {
 				area.html(preArea)
 				if (city.val() != "") {
 					var pro_num = parseInt(province.val());
 					var cit_num = parseInt(city.val());
 					var areaCode = res.data.children[pro_num].children[cit_num].children;
 					var cityCode = res.data.children[pro_num].children;
 					var data = {
 						state: "全部",
 						cityName: city.find('option:selected').text()
 					}
 					getDevPlanTable(data);
 					areaCode.forEach(function (res, k) {
 						area.append("<option value=" + k + ">" +
 							res.text + "</option>");
 						obj.cityId = res.parentId;
 						obj.cityText = cityCode[cit_num].text;
 					})

 				} else {
 					obj.cityId = '';
 					obj.cityText = '';
 					obj.areaId = '';
 					obj.areaText = '';
 					var data = {
 						state: "全部",
 						provinceName: province.find('option:selected').text()
 					}
 					getDevPlanTable(data);
 				}
 				//	    	 	console.log(areaCode)
 			})

 			//获取区的id
 			area.change(function () {
 				//	    	 	area.html(preArea)
 				if (area.val() != "") {
 					var pro_num = parseInt(province.val());
 					var cit_num = parseInt(city.val());
 					var area_num = parseInt(area.val())
 					var areaData = res.data.children[pro_num].children[cit_num].children[area_num];
 					var data = {
 						state: "全部",
 						districtName: area.find('option:selected').text()
 					}
 					getDevPlanTable(data);
 					obj.areaId = areaData.id;
 					obj.areaText = areaData.text;
 				} else {
 					obj.areaId = '';
 					obj.areaText = '';
 					var data = {
 						state: "全部",
 						cityName: city.find('option:selected').text()
 					}
 					getDevPlanTable(data);
 				}

 				//	    	 	console.log(areaData.id)
 			})
 			return obj;

 		}
 	});



 	var schoolProvince = $("#shoolProvince");
 	var schoolCity = $("#shoolCity");
 	var schoolArea = $("#shoolArea");
 	var nextProvince = "<option value=''>选择省（省）</option>";
 	var nextCity = "<option value=''>选择市（市）</option>";
 	var nextArea = "<option value=''>选择区（区）</option>";
 	var schoolObj = {};
 	//初始化 
 	schoolProvince.html(nextProvince);
 	schoolCity.html(nextCity);
 	schoolArea.html(nextArea)

 	//   省市区页面渲染

 	$.ajax({
 		type: "get",
 		url: baseApi + "/sys/area/find",
 		contentType: 'application/json',
 		dataType: "json",
 		success: function (res) {
 			// console.log(res)
 			var proData = res.data.children;
 			//	    	console.log(proData)
 			proData.forEach(function (ele, i) {
 				//	    		console.log(ele)

 				//          渲染省的下拉框
 				schoolProvince.append("<option value=" + i + ">" +
 					ele.text + "</option>");

 			})
 			var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 		

 			schoolProvince.change(function () {
				$("#edu").html(optionArr)
 				schoolCity.html(nextCity);
 				schoolArea.html(nextArea)
 				if (schoolProvince.val() != "") {
 					var pro_num = parseInt(schoolProvince.val());
 					var cityCode = res.data.children[pro_num].children;
 					console.log(cityCode)
 					cityCode.forEach(function (citydata, j) {

 						schoolCity.append("<option value=" + j + ">" +
 							citydata.text + "</option>");
 						schoolObj.proId = citydata.parentId;
 						schoolObj.proText = res.data.children[pro_num].text;
 						//			            obj.cityText = citydata.text ;
 					})

 				}
 				//	    	渲染教育局	
 				var data = {

 					"provinceName": schoolObj.proText

 				}

 				ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res) {
 					console.log(data)
 					console.log(res)
 					if (res.code == "OK") {
 						var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 						res.data.forEach(function (ele, i) {
 							//			   	   	 	console.log(ele.eduName)
 							optionArr.push("<option value=\'" + ele.fkcode + "\'>" + ele.eduName + "</option>")
 							obj.fkCode = ele.fkCode
 						})
 						//			   	   	 console.log(optionArr)
 						$("#edu").html(optionArr)


 					}
 				})

 			});

 			//	    	 市

 			schoolCity.change(function () {
 				var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 				$("#edu").html(optionArr)

 				schoolArea.html(nextArea);
 				if (schoolCity.val() != "") {
 					var pro_num = parseInt(schoolProvince.val());
 					var cit_num = parseInt(schoolCity.val());
 					var areaCode = res.data.children[pro_num].children[cit_num].children;
 					var cityCode = res.data.children[pro_num].children;
 					areaCode.forEach(function (res, k) {
 						schoolArea.append("<option value=" + k + ">" +
 							res.text + "</option>");
 						schoolObj.cityId = res.parentId;
 						schoolObj.cityText = cityCode[cit_num].text;
 					})

 				}
 				var data = {

 					"cityName": schoolObj.cityText,
 					"provinceName": schoolObj.proText

 				}
 				ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res) {

 					if (res.code == "OK") {
 						var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 						res.data.forEach(function (ele, i) {
 							//			   	   	 	console.log(ele.eduName)
 							optionArr.push("<option value=\'" + ele.fkcode + "\'>" + ele.eduName + "</option>")
 							obj.fkCode = ele.fkCode
 						})

 						$("#edu").html(optionArr)


 					}

 				})



 			})
 			//获取区的id
 			schoolArea.change(function () {
 				var optionArr = ["<option selected='true' value=''></option>请选择教育局</option>"];
 				$("#edu").html(optionArr)


 				if (schoolCity.val() != "") {
 					var pro_num = parseInt(schoolProvince.val());
 					var cit_num = parseInt(schoolCity.val());
 					var area_num = parseInt(schoolArea.val())
 					var areaData = res.data.children[pro_num].children[cit_num].children[area_num];

 					schoolObj.areaId = areaData.id;
 					schoolObj.areaText = areaData.text;
 				}


 				//c查询教育局，渲染下拉框
 				var data = {

 					"cityName": schoolObj.cityText,
 					"provinceName": schoolObj.proText,
 					"districtName": schoolObj.areaText
 				}
 				ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res) {

 					if (res.code == "OK") {

 						res.data.forEach(function (ele, i) {
 							//			   	   	 	console.log(ele.eduName)
 							optionArr.push("<option value=\'" + ele.fkcode + "\'>" + ele.eduName + "</option>")
 							obj.fkCode = ele.fkCode
 						})
 						//			   	   	 console.log(optionArr)
 						$("#edu").html(optionArr)


 					}

 				})

 			})

 			return schoolObj
 		}
 	});

 	//  搜索查询
 	$("#sel").click(function () {

 		var satu = $("#selText").val();
 		console.log(satu)
 		var reg = /^[\u4E00-\u9FA5]+$/;
 		if (reg.test(satu)) {
 			var stauData = {
 				// "pageNo": 1,
 				// "pageSize": 10,
 				"state": '全部',
 				'schoolName': satu
 			}
 		} else {
 			var stauData = {
 				// "pageNo": 1,
 				// "pageSize": 10,
 				"state": '全部',
 				'schoolCode': satu
 			}
 		}
 		console.log(stauData)
 		getDevPlanTable(stauData);
 	})

 	//  使用状态查询
 	$("#stau").change(function () {
 		var satu = $("#stau option:selected").val();
 		console.log(satu)
 		console.log(obj)
 		var stauData = {
 			// "pageNo": 1,
 			// "pageSize": 10,
 			"state": satu,
 			"provinceCode": obj.proId,
 			"provinceName": obj.proText,
 			"cityCode": obj.cityId,
 			"cityName": obj.cityText,
 			"districtCode": obj.areaId,
 			"districtName": obj.areaText
 		}
 		getDevPlanTable(stauData);
 	})

 	//新增学校用户
 	//开通学校
 	var SchoolStages
 	dic('STUDYSECTION', 1, function (res1, arr) { //学段
 		var str = '<div class="xueduan">'
 		SchoolStages = res1.data
 		res1.data.forEach(function (e, i) {
 			str += '<div class="checkbox ys-checkbox left">' +
 				'<input id="demo-form-inline-checkbox' + i + '" name="schoolStages" value="' + e.dicKey + '" type="checkbox">' +
 				'<label for="demo-form-inline-checkbox' + i + '">' + e.dicValue + '</label>' +
 				'</div>'
 		})
 		str += '</div>'
 		$('#addSchoolStages').html(str)
 	})
 	$("#btn-open").click(function () {
 		schoolObj = {}
 		$("#bureauModal").modal({
 			show: true
 		})

 	})
 	$('#bureauModal').on('hidden.bs.modal', function (e) {
 		$(this).find('.form-horizontal')[0].reset();
 		var zTree = $.fn.zTree.getZTreeObj("authorizationZtree");
		 zTree.checkAllNodes(false);
		  $('#edu').val()
		  $('.form-horizontal')[0].reset()
		//   $('.form-horizontal').find('select').html('')
 		// $("#schoolCode").val('')
 		// $("#schoolName").val('')
 		// $("#tel").val('')
 		// $("#select option:selected")[0].selected = false
 		// $("#shoolProvince option:selected")[0].selected = false
 		// $("#shoolCity option:selected")[0].selected = false
 		// $("#shoolArea option:selected")[0].selected = false
 		// $("#bureauModal .magic-checkbox").eq(0)[0].checked = true
 		// $("#bureauModal .magic-checkbox").eq(1)[0].checked = false
 		// $("#bureauModal .magic-checkbox").eq(2)[0].checked = false
 		// $("#bureauModal .magic-checkbox").eq(3)[0].checked = false
 		// $("#start").val('')
 		// $("#end").val('')
 		// $("#years").val('')
 		// $("#months").val('')
 	})
 	//  var t1 = $('.checkbox input[type="checkbox"]').is(':checked');

 	$("#enter").click(function () {
 		// if (!$("#schoolCode").val()) {
 		// 	ysFn.msgBig('请填写学校编码！', 3, function () {});
 		// 	return;
 		// }
 		// if (!$("#schoolName").val()) {
 		// 	ysFn.msgBig('请填写学校名称！', 3, function () {});
 		// 	return;
 		// }
 		// if (/[0-9]/.test($("#schoolName").val()) || /[，\s_'’‘\"”“|\\~#$@%^&*;\/<>\?？]/.test($("#schoolName").val())) {
 		// 	ysFn.msgBig('学校名称不能为数字或特殊字符！', 3, function () {});
 		// 	return false;
 		// }
 		// if (!schoolObj.proId) {
 		// 	ysFn.msgBig('请选择省！', 3, function () {});
 		// 	return;
 		// }
 		// if (!schoolObj.cityId) {
 		// 	ysFn.msgBig('请选择市！', 3, function () {});
 		// 	return;
 		// }

 		// // if (!schoolObj.areaId) {
 		// // 	ysFn.msgBig('请选择区！', 3,  function () {});
 		// // 	return;
 		// // }

 		// if (!$("#select option:selected").val()) {
 		// 	ysFn.msgBig('请选择办学性质！', 3, function () {});
 		// 	return;
 		// }

 		var checked = 0;
 		$("#bureauModal .magic-checkbox").click(function () {
 			console.log("chufa")
 		})
 		var str = ''
 		//  var newStr =""
 		$.each($("#addSchoolStages").find('input'), function (i, e) {
 			if ($(e).prop("checked")) {
 				checked++
 				str += e.value + "0"
 			}
 		})
 		str = str.substring(0, str.length - 1);
 		//  alert(str)
 		// console.log(checked)
 		// if (checked == 0) {
 		// 	ysFn.msgBig('请选择学校学段！', 3, function () {});
 		// 	return;
 		// }
 		// if (!$("#start").val()) {
 		// 	ysFn.msgBig('请选择服务开始时间！', 3, function () {});
 		// 	return;
 		// }
 		// if (!$("#end").val()) {
 		// 	ysFn.msgBig('请选择服务结束时间！', 3, function () {});
 		// 	return;
 		// }
 		// if (new Date($("#start").val()) > new Date($("#end").val())) {
 		// 	ysFn.msgBig('服务结束时间不能小于开始时间', 3, function () {});
 		// 	return;
 		// }


 		$('#bureauModal').ysValidate({
 			tooltip: true,
 			fields: {
 				schoolCode: {
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
 				schoolName: {
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
 				select1: {
 					validators: {
 						notEmpty: {
 							message: '未选择'
 						},
 					}
 				},
 				schoolStages: {
 					group: ".xueduan",
 					validators: {
 						notEmpty: {
 							message: '未选择'
 						},
 					}
 				},
 				// province: {
 				// 	validators: {
 				// 		notEmpty: {
 				// 			message: '未选择'
 				// 		},
 				// 	}
 				// },
 				// city: {
 				// 	validators: {
 				// 		notEmpty: {
 				// 			message: '未选择'
 				// 		},
 				// 	}
 				// },
 				// town: {
 				// 	validators: {
 				// 		notEmpty: {
 				// 			message: '未选择'
 				// 		},
 				// 	}
 				// },
 				tel: {
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
 				start: {
 					validators: {
 						notEmpty: {
 							message: '必填'
 						},
 					}
 				},
 				end: {
 					validators: {
 						notEmpty: {
 							message: '必填'
 						},
 					}
 				},
 			}

 		});
 		$(".close").click(function () {
 			$("#bureauModal").ysValidate("destroy")
 		})
 		$("#bureauModal .btn-default").click(function () {
 			$("#bureauModal").ysValidate("destroy")
 		})
 		var isPass = $("#bureauModal").ysValidate("isPass")
 		if (!isPass) return
 		// console.log(t1)
 		var parm = {
 			'creatorFkCode': sessionStorage.getItem('userFkCode'),
 			"cityCode": schoolObj.cityId,
 			"cityName": schoolObj.cityText,
 			"districtCode": schoolObj.areaId,
 			"districtName": schoolObj.areaText,
 			"eduBureauFkCode": $('#edu').val(),
 			"provinceCode": schoolObj.proId,
 			"provinceName": schoolObj.proText,
 			"remindAuto": parseInt($(".radio input[type='radio']:checked").val()),
 			"schoolCode": $("#schoolCode").val(),
 			"schoolName": $("#schoolName").val(),
 			"schoolNature": Number($("#select  option:selected").val()),
 			"schoolStages": parseInt(str),
 			"schoolTel": $("#tel").val(),
 			"validEndTime": $("#end").val(),
 			"validStartTime": $("#start").val()

 		}
 		var resourceList = [];
 		var zTree = $.fn.zTree.getZTreeObj("authorizationZtree");
 		var selectCheck = zTree.getCheckedNodes(true);
 		selectCheck.forEach(function (item, i) {
 			resourceList.push({
 				id: item.fkCode,
 				pId: item.parentFkCode,
 				resourceMark: item.resourceMark,
 				resourceName: item.resourceName,
 				resourceType: item.resourceType,
 				type: item.type
 			})
 		})
 		parm.listResources = resourceList;
 		console.log(parm)
 		ysAjax.ajax("/sys/SysSchoolOpen/add", parm, "json", function (res) {
 			console.log(res);
 			if (res.code == 'OK') {
 				ysFn.msgBig('开通成功', 1, function () {})
 				getDevPlanTable(data);
 				$("#bureauModal").modal('hide')
 			} else {
 				ysFn.msgBig(res.msg, 2, function () {})
 			}
 			$("#bureauModal").ysValidate('destroy');
 		})

 	})

 	//批量删除功能
 	var arr = [];
 	$("#moreDeit").click(function () {
 		var selectArr = $('.schoolOpen').bootstrapTable('getAllSelections');
 		console.log(selectArr)
 		if (selectArr.length == 0) {
 			ysFn.msg('您还没有选择', 'error');
 		} else {
 			$.each(selectArr, function (i, v) {
 				console.log(v)
 				arr.push(v.id.split("=")[0]);
 				ysAjax.ajax("/sys/SysSchoolOpen/delete", arr, "json", function (res) {
 					if (res.code == 'OK') {
 						ysFn.msgBig('删除成功', 1, function () {})
 						getDevPlanTable(data);
 					}
 				})
 			})
 		}

 		// var t = $('input[type="checkbox"]').is(':checked');
 		// console.log(t)
 		// var trLength = $(".schoolOpen tbody").find("tr")
 		// if (t == "") {
 		// 	alert("请选择需要删除的数据")

 		// } else {

 		// 	for (var i = 0; i < trLength.length; i++) {
 		// 		//       		console.log(trLength[i])
 		// 		if (trLength.eq(i).hasClass("selected")) {
 		// 			arr.push(trLength.eq(i).attr("data-uniqueid"))
 		// 		} else {
 		// 			arr.removeByValue(trLength.eq(i).attr("data-uniqueid"))
 		// 		}
 		// 	}

 		// }
 		// var arr1 = arr.unique1()
 		// console.log(arr1)
 		// if(arr1.length==0){
 		// 	ysFn.msg('您还没有选择', 'error');
 		// }else{
 		// 	ysAjax.ajax("/sys/SysSchoolOpen/delete", arr1, "json", function (res) {
 		// 		if (res.code == 'OK') {
 		// 			ysFn.msgBig('删除成功', 1,  function () {})
 		// 			getDevPlanTable(data);
 		// 		} else {
 		// 			ysFn.msgBig('删除失败', 2,  function () {})
 		// 		}
 		// 	})
 		// }
 	})
 	$('#EditModal').on('hidden.bs.modal', function () {
 		var treeObj = $.fn.zTree.getZTreeObj("editAuthorizationZtree");
 		treeObj.checkAllNodes(false);
 	})
 	//编辑学校信息	
 	dic('STUDYSECTION', 1, function (res1, arr) { //学段
 		var str = '<div class="xueduan">'
 		res1.data.forEach(function (e, i) {
 			str += '<div class="checkbox ys-checkbox left">' +
 				'<input id="demo-form-inline-checkbox1' + i + '" name="schoolStages" value="' + e.dicKey + '" type="checkbox">' +
 				'<label for="demo-form-inline-checkbox1' + i + '">' + e.dicValue + '</label>' +
 				'</div>'
 		})
 		str += "</div>"
 		$('#editSchoolStages').html(str);
 	})
 	$(".schoolOpen").on("click", ".edit", function () {
 		var valArr = [];
 		var dataId = $(this).parent().parent().attr("data-uniqueid").split("=")[0];
 		console.log(dataId)



 		$("#EditModal").modal({

 			show: true
 		})

 		var timeS;
 		var timeE;

 		laydate.render({
 			elem: '#EditUpDate',
 			theme: '#4C98F7',
 			// format: 'yyyy-MM-dd HH:mm',
 			trigger: 'click',
 			// type: 'datetime'
 			showBottom: false,
 			done: function (value) {
 				console.log(value)
 				if ($('#EditEndDate').val()) {
 					if (new Date($('#EditEndDate').val()).getTime() < new Date(value).getTime()) {
 						ysFn.msgBig('结束时间不能小于开始时间', 3, function () {
 							$('#EditUpDate').val('')
 						})
 						return
 					} else {
 						timeS = value
 						timeE = $('#EditEndDate').val()
 						var time = new Date(timeE).getTime() - new Date(timeS).getTime();
 						var day = (time / (24 * 60 * 60 * 1000)) + 1
 						$('#editTime').val(day + '天');
 					}
 				} else {
 					timeS = value
 				}
 			}
 		});
 		laydate.render({
 			elem: '#EditEndDate',
 			theme: '#4C98F7',
 			// format: 'yyyy-MM-dd HH:mm',
 			trigger: 'click',
 			// type: 'datetime'
 			showBottom: false,
 			done: function (value) {
 				console.log(value)
 				if ($('#EditUpDate').val()) {
 					if (new Date(value).getTime() < new Date($('#EditUpDate').val()).getTime()) {
 						ysFn.msgBig('结束时间不能小于开始时间', 3, function () {
 							$('#EditEndDate').val('')
 						})
 						return
 					} else {
 						timeE = value
 						timeS = $('#EditUpDate').val()
 						var time = new Date(timeE).getTime() - new Date(timeS).getTime();
 						var day = (time / (24 * 60 * 60 * 1000)) + 1
 						$('#editTime').val(day + '天');
 					}
 				} else {
 					timeE = value
 				}
 			}
 		});

 		//渲染省市区下拉框
 		var EditProvince = $("#EditProvince");
 		var EditCity = $("#EditCity");
 		var EditArea = $("#EditArea");
 		var EarlyProvince = "<option value=''>选择省（省）</option>";
 		var EarlyCity = "<option value=''>选择市（市）</option>";
 		var EarlyArea = "<option value=''>选择区（县）</option>";
 		var objEdit = {};
 		//初始化 
 		EditProvince.html(EarlyProvince);
 		EditCity.html(EarlyCity);
 		EditArea.html(EarlyArea);
 		// 		console.log(EditArea.html(EarlyArea))

 		var editArr = [];
 		$.ajax({
 			type: "get",
 			url: baseApi + "/sys/SysSchoolOpen/updateSelect?id=" + dataId,
 			async: false,
 			success: function (res) {
 				// 				反选check选中状态
 				console.log("======" + res)
 				valArr = String(res.data.schoolStages).split("0");
 				//         console.log(valArr)
 				$.each($('#editSchoolStages').find('input'), function (i, e) {
 					valArr.forEach(function (ele, i) {
 						if (ele == e.value) {
 							e.checked = true
 						}
 					})
 				})


 				editArr.push({
 					"cityCode": res.data.cityCode,
 					"cityName": res.data.cityName,
 					"districtCode": res.data.districtCode,
 					"districtName": res.data.districtName,
 					"schoolCode": res.data.schoolCode,
 					"schoolName": res.data.schoolName,
 					"provinceCode": res.data.provinceCode,
 					"provinceName": res.data.provinceName,
 					"remindAuto": res.data.remindAuto,
 					"schoolNature": res.data.schoolNature,
 					"schoolStages": res.data.schoolStages,
 					"schoolTel": res.data.schoolTel,
 					"validEndTime": res.data.validEndTime,
 					"validStartTime": res.data.validStartTime
 				})
 				//反显不修改时传入上次默认的省市区的值 
 				objEdit.proId = res.data.provinceCode;
 				objEdit.proText = res.data.provinceName;
 				objEdit.cityId = res.data.cityCode;
 				objEdit.cityText = res.data.cityName;
 				objEdit.areaId = res.data.districtCode;
 				objEdit.districtName = res.data.districtName;
 				objEdit.fkcode = res.data.fkCode
 				//				 console.log(objEdit) 

 				$.ajax({
 					type: "get",
 					url: baseApi + "/sys/area/find",
 					contentType: 'application/json',
 					dataType: "json",
 					success: function (result) {
 						var proData = result.data.children;
 						// console.log(proData)
 						proData.forEach(function (ele, i) {
 							//	    		console.log(ele)
 							if (ele.text == res.data.provinceName) {
 								EditProvince.append("<option value=" + i + " selected>" +
 									ele.text + "</option>");
 								objEdit.proId = result.data.children[i].id;
 								objEdit.proText = result.data.children[i].text;
 								var cityCode = result.data.children[i].children;
 								cityCode.forEach(function (citydata, j) {
 									if (citydata.text == res.data.cityName) {
 										EditCity.append("<option value=" + j + " selected>" +
 											citydata.text + "</option>");
 										objEdit.cityId = cityCode[j].id;
 										objEdit.cityText = cityCode[j].text;
 										var areaCode = result.data.children[i].children[j].children;
 										areaCode.forEach(function (resu, k) {
 											if (res.data.districtName) {
 												if (resu.text == res.data.districtName) {
 													EditArea.append("<option value=" + k + " selected>" +
 														resu.text + "</option>");
 													var areaData = result.data.children[i].children[j].children[k];
 													objEdit.areaId = areaData.id;
 													objEdit.areaText = areaData.text;
 													var data = {
 														"cityName": objEdit.cityText,
 														"provinceName": objEdit.proText,
 														"districtName": objEdit.areaText
 													}
 													ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res1) {
 														// console.log(res1)
 														var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 														if (res1.code == "OK") {
 															res1.data.forEach(function (ele, i) {
 																if (ele.fkcode == res.data.eduBureauFkCode) {
 																	optionArr.push("<option value=" + ele.fkcode + " selected>" + ele.eduName + "</option>")
 																} else {
 																	optionArr.push("<option value=" + ele.fkcode + ">" + ele.eduName + "</option>")
 																}

 															})
 															$("#editedu").html(optionArr)
 														}
 													})
 												} else {
 													EditArea.append("<option value=" + k + ">" +
 														resu.text + "</option>");
 												}
 											} else {
 												var data = {
 													"cityName": objEdit.cityText,
 													"provinceName": objEdit.proText
 												}
 												ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res1) {
 													// console.log(res1)
 													var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 													if (res1.code == "OK") {
 														res1.data.forEach(function (ele, i) {
 															if (ele.fkcode == res.data.eduBureauFkCode) {
 																optionArr.push("<option value=" + ele.fkcode + " selected>" + ele.eduName + "</option>")
 															} else {
 																optionArr.push("<option value=" + ele.fkcode + ">" + ele.eduName + "</option>")
 															}

 														})
 														$("#editedu").html(optionArr)
 													}
 												})
 											}
 										})
 									} else {
 										EditCity.append("<option value=" + j + ">" +
 											citydata.text + "</option>");
 									}
 								})
 							} else {
 								EditProvince.append("<option value=" + i + ">" +
 									ele.text + "</option>");
 							}
 						})
 						EditProvince.change(function () {

 							EditCity.html(EarlyCity);
 							EditArea.html(EarlyArea)
 							if (EditProvince.val() != "") {
 								var pro_num = parseInt(EditProvince.val());
 								var cityCode = result.data.children[pro_num].children;
 								console.log(cityCode)
 								cityCode.forEach(function (citydata, j) {

 									EditCity.append("<option value=" + j + ">" +
 										citydata.text + "</option>");
 									objEdit.proId = citydata.parentId;
 									objEdit.proText = result.data.children[pro_num].text;
 								})
 								var data = {
 									"provinceName": objEdit.proText,
 								}
 								var optionArr = ["<option  value=''>请选择教育局</option>"];
 								ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res1) {
 									if (res1.code == "OK") {
 										res1.data.forEach(function (ele, i) {
 											optionArr.push("<option value=" + ele.fkcode + ">" + ele.eduName + "</option>")
 										})
 										$("#editedu").html(optionArr)
 									}
 								})
 							}
 						});

 						EditCity.change(function () {
 							EditArea.html(EarlyArea)
 							if (EditCity.val() != "") {
 								var pro_num = parseInt(EditProvince.val());
 								var cit_num = parseInt(EditCity.val());
 								var areaCode = result.data.children[pro_num].children[cit_num].children;
								 var cityCode = result.data.children[pro_num].children;
								 console.log(cityCode);
 								areaCode.forEach(function (res, k) {
 									EditArea.append("<option value=" + k + ">" +
 										res.text + "</option>");
 									objEdit.cityId = res.parentId;
 									objEdit.cityText = cityCode[cit_num].text;
								 })
								 console.log(objEdit.cityText)
 								var data = {
 									"cityName": objEdit.cityText,
 									"provinceName": objEdit.proText,
 								}
 								var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 								ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res1) {
 									if (res1.code == "OK") {
 										res1.data.forEach(function (ele, i) {
 											optionArr.push("<option value=" + ele.fkcode + ">" + ele.eduName + "</option>")
 										})
 										$("#editedu").html(optionArr)
 									}
 								})
 							} else {
								objEdit.cityText = "";
								objEdit.cityId = "";
							}
 							//	    	 	console.log(areaCode)
 						})

 						//获取区的id
 						EditArea.change(function () {
 							//	    	 	area.html(preArea)
 							if (EditCity.val() != "") {
 								var pro_num = parseInt(EditProvince.val());
 								var cit_num = parseInt(EditCity.val());
 								var area_num = parseInt(EditArea.val())
 								var areaData = result.data.children[pro_num].children[cit_num].children[area_num];

 								objEdit.areaId = areaData.id;
 								objEdit.areaText = areaData.text;
 							}
 							var data = {
 								"cityName": objEdit.cityText,
 								"provinceName": objEdit.proText,
 								"districtName": objEdit.areaText
 							}
 							var optionArr = ["<option selected='true' value=''>请选择教育局</option>"];
 							ysAjax.ajax("/sys/SysEduBureau/select", data, "json", function (res1) {
 								if (res1.code == "OK") {
 									res1.data.forEach(function (ele, i) {
 										optionArr.push("<option value=" + ele.fkcode + ">" + ele.eduName + "</option>")
 									})
 									$("#editedu").html(optionArr)
 								}
 							})
 							//	    	 	console.log(areaData.id)
 						})
 						return objEdit;

 					}
 				})
 				//	    		return editArr;
 				//获得年月日      得到日期oTime  
 				function getMyDate(str) {
 					var oDate = new Date(str),
 						oYear = oDate.getFullYear(),
 						oMonth = oDate.getMonth() + 1,
 						oDay = oDate.getDate(),
 						oHour = oDate.getHours(),
 						oMin = oDate.getMinutes(),
 						oSen = oDate.getSeconds(),
 						oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay); //最后拼接时间  
 					return oTime;
 				};
 				$('#editselect').find('option').each(function (i, e) {
 					if (e.value == res.data.schoolNature) {
 						e.selected = true
 					}
 				})
 				//补0操作  
 				function getzf(num) {
 					if (parseInt(num) < 10) {
 						num = '0' + num;
 					}
 					return num;
 				}
 				var endTime = getMyDate(editArr[0].validEndTime)
 				var starTime = getMyDate(editArr[0].validStartTime)

 				$("#EditEduCode").val(editArr[0].schoolCode);
 				$("#EditName").val(editArr[0].schoolName);
 				$("#EditTel").val(editArr[0].schoolTel);
 				$("#EditUpDate").val(starTime);
 				$("#EditEndDate").val(endTime)
 				$('#edityears').val('')
 				$('#editmonths').val('')
 				var day = ((res.data.validEndTime - res.data.validStartTime) / (24 * 60 * 60 * 1000)) + 1
 				$('#editTime').val(day + '天');
 				var treeObj = $.fn.zTree.getZTreeObj("editAuthorizationZtree");
 				objEdit.resourceList = res.data.listResources;
 				for (var i = 0; i < res.data.listResources.length; i++) {
 					var nodes = treeObj.getNodesByParam("fkCode", res.data.listResources[i].fkCode, null);
 					nodes.forEach(function (item, i) {
 						treeObj.checkNode(item, true, false);
 					})
 				}

 			}
 		});

 		//点击编辑确定按钮发送请求
 		$("#btnEdit").unbind('click').click(function () {
 			// if (!$("#EditEduCode").val()) {
 			// 	ysFn.msgBig('请填写学校编码！', 3, function () {});
 			// 	return;
 			// }
 			// if (!$("#EditName").val()) {
 			// 	ysFn.msgBig('请填写学校名称！', 3, function () {});
 			// 	return;
 			// }
 			// if (/[0-9]/.test($("#EditName").val()) || /[，\s_'’‘\"”“|\\~#$@%^&*;\/<>\?？]/.test($("#EditName").val())) {
 			// 	ysFn.msgBig('学校名称不能为数字或特殊字符！', 3, function () {});
 			// 	return false;
 			// }
 			// if (!EditProvince.val()) {
 			// 	ysFn.msgBig('请选择省！', 3, function () {});
 			// 	return false;
 			// }
 			// if (!objEdit.cityId) {
 			// 	ysFn.msgBig('请选择市！', 3, function () {});
 			// 	return;
 			// }
 			// // if (!objEdit.areaId) {
 			// // 	ysFn.msgBig('请选择区！', 3,  function () {});
 			// // 	return;
 			// // }
 			// if (!$("#editselect option:selected").val()) {
 			// 	ysFn.msgBig('请选择办学性质！', 3, function () {});
 			// 	return;
 			// }
 			var checked = 0;
 			var newstr = ''
 			$.each($("#editSchoolStages").find('input'), function (i, e) {
 				if ($(e).prop("checked")) {
 					checked++
 					newstr += e.value + "0"
 				}
 			})
 			newstr = newstr.substring(0, newstr.length - 1);
 			// alert(newstr)
 			// if (checked == 0) {
 			// 	ysFn.msgBig('请选择学校学段！', 3, function () {});
 			// 	return;
 			// }
 			// if (!$("#EditUpDate").val()) {
 			// 	ysFn.msgBig('请选择服务开始时间！', 3, function () {});
 			// 	return;
 			// }
 			// if (!$("#EditEndDate").val()) {
 			// 	ysFn.msgBig('请选择服务结束时间！', 3, function () {});
 			// 	return;
 			// }
 			var date1 = new Date($("#EditEndDate").val())
 			var date2 = new Date($("#EditUpDate").val());
 			var endtime = date1.getTime();
 			var startTime = date2.getTime()
 			// console.log(startTime)
 			// var editData = {
 			// 	cityName: objEdit.cityText,
 			// 	districtName: objEdit.areaText,
 			// 	eduBureauFkCode: $("#editedu").val(),
 			// 	fkcode: objEdit.fkcode,
 			// 	id: dataId,
 			// 	listResources: [],
 			// 	provinceName: objEdit.proText,
 			// 	remindAuto: parseInt($("#EditModal .radio input[type='radio']:checked").val()),
 			// 	schoolCode: $("#EditEduCode").val(),
 			// 	schoolName: $("#EditName").val(),
 			// 	schoolNature: Number($("#editselect  option:selected").val()),
 			// 	schoolStages: parseInt(newstr),
 			// 	schoolTel: $("#EditTel").val(),
 			// 	provinceName: objEdit.proText,
 			// 	validEndTime: endtime.toString(),
 			// 	validStartTime: startTime.toString()
 			// }
 			$('#EditModal').ysValidate({
 				tooltip: true,
 				fields: {
 					schoolCode: {
 						validators: {
 							stringLength: {
 								min: 1,
 								max: 30,
 								message: '必填，1-30字'
 							},
 							xx: {
 								message: '必填，可由数字字母-_组成',
 								regexp: /^[a-zA-Z0-9\-_]{1,30}$/
 							}
 						}
 					},
 					schoolName: {
 						validators: {
 							stringLength: {
 								min: 1,
 								max: 30,
 								message: '必填，最多30字'
 							},
 							xx: {
 								message: '必填,1-30字',
 								regexp: /^.{1,30}$/
 							}
 						}
 					},
 					select1: {
 						validators: {
 							notEmpty: {
 								message: '未选择'
 							},
 						}
 					},
 					schoolStages: {
 						group: ".xueduan",
 						validators: {
 							notEmpty: {
 								message: '未选择'
 							},
 						}
 					},
 					// province: {
 					// 	validators: {
 					// 		notEmpty: {
 					// 			message: '未选择'
 					// 		},
 					// 	}
 					// },
 					// city: {
 					// 	validators: {
 					// 		notEmpty: {
 					// 			message: '未选择'
 					// 		},
 					// 	}
 					// },
 					// town: {
 					// 	validators: {
 					// 		notEmpty: {
 					// 			message: '未选择'
 					// 		},
 					// 	}
 					// },
 					tel: {
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
 					startTime: {
 						validators: {
 							notEmpty: {
 								message: '必填'
 							},
 						}
 					},
 					endDate: {
 						validators: {
 							notEmpty: {
 								message: '必填'
 							},
 						}
 					},
 				}

 			});
 			$(".close").click(function () {
 				$("#EditModal").ysValidate("destroy")
 			})
 			$("#EditModal .btn-default").click(function () {
 				$("#EditModal").ysValidate("destroy")
 			})
 			var isPass = $("#EditModal").ysValidate("isPass")
 			if (!isPass) return
 			var editData = {
 				"cityName": objEdit.cityText,
 				"districtName": objEdit.areaText,
 				"creatorFkCode": sessionStorage.getItem('userFkCode'),
 				"eduBureauFkCode": $("#editedu").val(),
 				"fkCode": objEdit.fkcode,
 				"id": dataId,
 				"listResources": [],
 				"provinceName": objEdit.proText,
 				"remindAuto": parseInt($("#EditModal .radio input[type='radio']:checked").val()),
 				"schoolCode": $("#EditEduCode").val(),
 				"schoolName": $("#EditName").val(),
 				"schoolNature": Number($("#editselect  option:selected").val()),
 				"schoolStages": parseInt(newstr),
 				"schoolTel": $("#EditTel").val(),
 				"provinceCode": objEdit.proId,
 				"provinceName": objEdit.proText,
 				"remindAuto": parseInt($("#EditModal .radio input[type='radio']:checked").val()),
 				"validEndTime": endtime,
 				"validStartTime": startTime
 			}
 			var resourceList = [];
 			var zTree = $.fn.zTree.getZTreeObj("editAuthorizationZtree");
 			var selectCheck = zTree.getCheckedNodes(true);
 			selectCheck.forEach(function (item, i) {
 				resourceList.push({
 					id: item.fkCode.toString(),
 					pId: item.parentFkCode.toString(),
 					resourceMark: item.resourceMark,
 					resourceName: item.resourceName,
 					resourceType: item.resourceType,
 					type: item.type
 				})
 			})
 			var oldArr = [];
 			var newArr = [];
 			objEdit.resourceList.forEach(function (item, i) {
 				oldArr.push(item.fkCode);
 			})
 			resourceList.forEach(function (e, index) {
 				newArr.push(e.id)
 			})
 			editData.listResources = resourceList;
 			ysAjax.ajax("/sys/SysSchoolOpen/update", editData, "json", function (res) {
 				console.log(res);
 				if (res.code == 'OK') {
 					$('#EditModal').modal('hide');
 					ysFn.msgBig('编辑成功', 1, function () {})
 					var data = {
 						state: "全部"
 					}
 					getDevPlanTable(data);
 				} else {
 					ysFn.msgBig(res.msg, 2, function () {})
 				}
 				$("#EditModal").ysValidate('destroy');
 			})
 			// flag = oldArr.equals(newArr);
 			// console.log(flag)
 			// if (flag) {
 			// 	editData.listResources = [];
 			// 	ysAjax.ajax("sys/SysSchoolOpen/update", editData, "json", function (res) {
 			// 		console.log(res);
 			// 		if (res.code == 'OK') {
 			// 			$('#EditModal').modal('hide');
 			// 			ysFn.msgBig('编辑成功', 1, function () {})
 			// 			var data = {
 			// 				state: "全部"
 			// 			}
 			// 			getDevPlanTable(data);
 			// 		} else {
 			// 			ysFn.msgBig('编辑失败', 2, function () {})
 			// 		}
 			// 		$("#EditModal").ysValidate('destroy');
 			// 	})
 			// } else {

 			// 	console.log(editData)
 			// 	ysFn.confirm('修改后该机构的角色权限将会格式化,是否确认修改?', function () {

 			// 	})
 			// }




 		})

 	})


 	function dic(type, num, callback) { //调取数据字典
 		ysAjax.ajax('/sys/dadicary/getDicValue', {
 			"dicCode": type,
 			"dicType": num,
 			"schoolFkCode": sessionStorage.getItem('schoolFkCode')
 		}, 'json', function (res) {
 			// console.log(res)
 			var Select = [];
 			res.data.forEach(function (e, i) {
 				Select.push('<option value=' + e.dicKey + '>' + e.dicValue + '</option>');
 			})
 			callback(res, Select)
 		})
 	}



 	//应用资源树
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
 			enable: true,
 			// chkStyle: "radio",
 			// radioType: "level"
 		}
 	}


 	ysAjax.get('/sys/role/selectResources', 'type=1', 'json', function (res) {
 		var treeObj = $.fn.zTree.init($("#authorizationZtree"), zTreeConfig, res.data);
 		var editTreeObj = $.fn.zTree.init($("#editAuthorizationZtree"), zTreeConfig, res.data);
 		// treeObj.expandAll(true);
 		//  editTreeObj.expandAll(true);
 		var treeObj1 = $.fn.zTree.getZTreeObj("authorizationZtree");
 		var nodes = treeObj1.getNodes()
 		treeObj1.expandNode(nodes[0]);
 		var treeObj1 = $.fn.zTree.getZTreeObj("editAuthorizationZtree");
 		var nodes = treeObj1.getNodes()
 		treeObj1.expandNode(nodes[0]);
 	})


 })


 if (Array.prototype.equals)
 	console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
 Array.prototype.equals = function (array) {
 	// if the other array is a falsy value, return
 	if (!array)
 		return false;

 	// compare lengths - can save a lot of time 
 	if (this.length != array.length)

 		return false;

 	for (var i = 0, l = this.length; i < l; i++) {
 		// Check if we have nested arrays
 		if (this[i] instanceof Array && array[i] instanceof Array) {
 			// recurse into the nested arrays
 			if (!this[i].equals(array[i]))
 				return false;
 		} else if (this[i] != array[i]) {
 			// Warning - two different object instances will never be equal: {x:20} != {x:20}
 			return false;
 		}
 	}
 	return true;
 }
 // Hide method from for-in loops
 Object.defineProperty(Array.prototype, "equals", {
 	enumerable: false
 });