$(function () {

	if (sessionStorage.getItem("indentity") == 6) {
		$(".page-title-white").html(
			'<ol class="breadcrumb ">' +
			'<i class="fa fa-home lh22">&nbsp;您现在的位置:</i>' +

			'<li>' +
			'<a href="javascript:void(0)">系统管理</a>' +
			'</li>' +
			'<li>' +
			'<a href="javascript:void(0);">用户管理</a>' +
			'</li>' +
			'<li>' +
			'<a href="javascript:void(0);">教育局用户</a>' +
			'</li>' +
			'</ol>'
		)
	}

	// 权限控制页面元素
	systemEducationBureauUserArr.forEach(function (item, i) {
		console.log(item)
		switch (item.text) {
			case '删除用户':
				$('#moreDeit1').removeClass('hidden');
				break;
			case '重置密码':
				$('#Reset1').removeClass('hidden');
				break;
		}
	})

	//教育局
	function getEduTable(data) {
		console.log(data)
		ysAjax.initTable('.edutable', '/sys/SysEduBureauUserCustom/selectList', data, function (res) {
			var resArray = [];
			console.log(res)
			res.data.records.forEach(function (ele, i) {
				console.log(ele)
				// function fun(ele) {
				// 	if (ele.indentity == 1) {
				// 		return ele.indentity = "管理员";
				// 	}
				// 	if (ele.indentity == 2) {
				// 		return ele.indentity = "领导"
				// 	}
				// 	if (ele.indentity == 3) {
				// 		return ele.indentity = "职员"
				// 	}
				// }
				function fun() {
					if (ele.indentity == '4') {
						return ele.indentity = "管理员";
					}else{
						return ele.indentity = "普通用户";
					}
				}
				// console.log(ele)
				resArray.push({
					"index": (res.data.pageNo - 1) * res.data.pageSize + i + 1,
					"id": ele.name + '=' + ele.userFkCode+'='+ele.indentity+'='+ele.id,
					"userAccount": ele.userAccount,
					"name": ele.name,
					"eduName": ele.eduName,
					"indentity": ele.indentity,
					"status": fun(ele),
					"fkCode": ele.userFkCode
				})
			})
			return resArray;
		})
	}
	var data = {}
	getEduTable(data)

	// 根据用户账号和姓名点击搜索
	$('#eduserch').click(function () {
		var serchInput = $("#eduName").val();
		var reg = /^[\u4E00-\u9FA5]+$/;
		if (!reg.test(serchInput)) {
			console.log("不是中文")
			data.name = '';
			data.userAccount = serchInput;
			getEduTable(data)
		} else {
			data.name = serchInput;
			data.userAccount = '';
			getEduTable(data)
		}
	})

	// 根据身份搜索
	$('#eduId').change(function () {
		data.indentity = $('#eduId').val();
		getEduTable(data)
	})

	//根据省市查询教育局
	var eduData = {}; //查教育局参数
	function seaedu() {
		ysAjax.ajax('/sys/SysEduBureauUserCustom/addSelect', eduData, 'json', function (res) {
			console.log(res);
			eduhtml = '<option value="" disabled selected>请选择教育局</option>';
			$.each(res.data, function (i, e) {
				eduhtml += '<option value="' + e.eduName + '">' + e.eduName + '</option>';
			})
			$('#edu').html(eduhtml)
			$('#edu').change(function () {
				data.eduName = $('#edu').val();
				getEduTable(data)
			})
		})
	}
	// 省市区三级联动	
	var preCity = "<option value=' '>请选择市</option>";

	//初始化 


	$.ajax({
		type: "get",
		url: baseApi + "/sys/area/find",
		contentType: 'application/json',
		dataType: "json",
		success: function (res) {
			console.log(res)
			var proData = res.data.children;
			proData.forEach(function (ele, i) {
				$('#province1').append("<option value=" + i + ">" +
					ele.text + "</option>");
			})
			$('#province1').change(function () {
				$('#city1').html(preCity)
				$('#edu').html('<option value="" disabled selected>请选择教育局</option>')
				if ($('#province1').val() != " ") {
					var pro_num = parseInt($('#province1').val());
					var cityCode = res.data.children[pro_num].children;
					cityCode.forEach(function (citydata, j) {
						$('#city1').append("<option value=" + j + ">" +
							citydata.text + "</option>");
					})
					data.provinceName = res.data.children[pro_num].text;
					eduData.provinceName = res.data.children[pro_num].text;
					seaedu()
					getEduTable(data)
				} else {
					data = {}
					getEduTable(data)
					seaedu()
				}
			});
			$('#city1').change(function () {
				$('#edu').html('<option value="" disabled selected>请选择教育局</option>')
				// if ($('#city1').val() != " ") {
				var pro_num = parseInt($('#province1').val());
				var cit_num = parseInt($('#city1').val());
				var cityCode = res.data.children[pro_num].children;
				data.cityName = cityCode[cit_num].text;
				eduData.cityName = cityCode[cit_num].text;
				seaedu()
				getEduTable(data)

				// }
			})
		}
	});

	//批量删除功能
	$("#moreDeit1").click(function () {
		var arrId = [];
		var t = $('.edutable input[type="checkbox"]').is(':checked')
		var trLength = $(".edutable tbody").find("tr")
		if (!$('.edutable').bootstrapTable('getAllSelections').length) {
			ysFn.msgBig('请选择要删除的数据!', 3, function () {})
		} else {
			$('#deleteModal').modal('show');
			$('#infoNum span').html($('.edutable').bootstrapTable('getAllSelections').length)
			for (var i = 0; i < trLength.length; i++) {
				if (trLength.eq(i).hasClass("selected")) {
					var id = trLength.eq(i).attr("data-uniqueid").split("=")[3]
				
					arrId.push(id)
				
				}
			}
			console.log(arrId)
			$('#deleteBtn').click(function () {
				ysAjax.ajax("/sys/SysEduBureauUserCustom/delete", arrId, "json", function (res) {
					console.log(arrId)
					console.log(res)
					if (res.code == 'OK') {
						ysFn.msgBig('删除成功', 1, function () {
							getEduTable(data)
						})
					} else {
						ysFn.msgBig('删除失败', 2, function () {})
					}
				})
			})
		}
	})

	//批量重置密码功能
	$("#Reset1").click(function () {
		var arrId = [];
		var t = $('.edutable input[type="checkbox"]').is(':checked')
		var trLength = $(".edutable tbody").find("tr")
		if (!$('.edutable').bootstrapTable('getAllSelections').length) {
			ysFn.msgBig('请选择要重置密码的账号!', 3, function () {})
		} else {
			$('#ResetModal').modal('show');
			$('#resetNum span').html($('.edutable').bootstrapTable('getAllSelections').length)
			var obj =[]
			for (var i = 0; i < $('.edutable').bootstrapTable('getAllSelections').length; i++) {
				console.log($('.edutable').bootstrapTable('getAllSelections'))
				obj.push({
					fkCode :$('.edutable').bootstrapTable('getAllSelections')[i].userFkCode,
					identity :$('.edutable').bootstrapTable('getAllSelections')[i].indentity,
					name :$('.edutable').bootstrapTable('getAllSelections')[i].name
				})
			}
			$('#resetBtn').unbind().click(function () {
				// if ($('#newPass').val() && $('#newPass').val() == $('#oldPass').val()) {
				// 	obj.pwd = $('#newPass').val();
				// } else {
				// 	ysFn.msgBig('请输入正确的密码!',3,  function () {});
				// 	return
				// }
				ysAjax.ajax("/sys/SysUser/resetPasswordsEducation", obj, "json", function (res) {
					console.log(obj)
					console.log(res)
					if (res.code == 'OK') {
						ysFn.msgBig('重置密码成功', 1,  function () {
						})
						getEduTable(data)
					} else {
						ysFn.msgBig('操作失败', 2,  function () {})
					}
				})
			})
		}
	})

	// 单条数据删除
	$(".edutable").on("click", ".deleted", function () {
		console.log($(this).parent().parent().attr('data-uniqueid'));
		var id = $(this).parent().parent().attr('data-uniqueid').split("=")[3];
		var arr = [];
		arr.push(id)
		// arr=JSON.stringify(arr)
		ysFn.confirm('你是否确定删除？', function () {
			ysAjax.ajax("/sys/SysEduBureauUserCustom/delete", arr, "json", function (res) {
				console.log(arr)
				console.log(res)
				if (res.code == 'OK') {
					ysFn.msgBig('删除成功', 1, function () {
						getEduTable(data)
					})
				} else {
					ysFn.msgBig('删除失败', 2, function () {})
				}
			})
		})
	})

	// 页面跳转传参
	$(".edutable").on("click", ".check", function () {
		var list = $(this).parent().parent().attr("data-uniqueid").split("=")[3];
		console.log(list)
		sessionStorage.setItem('sysEduBureauUserUpdateFrom', list)
	})

	$(".edutable").on("click", ".edit", function () {
		var list = $(this).parent().parent().attr("data-uniqueid").split("=")[0];
		sessionStorage.setItem('sysEduBureauUserUpdateFrom', list)
	})

	//重置密码
	$(".edutable").on("click", ".reset", function () {
		var list = $(this).parent().parent().attr("data-uniqueid").split("=");
		var obj = [{
			fkCode :list[1],
			identity :list[2],
			name :list[0]
		}]
		ysFn.confirm("确定重置密码吗？", function () {
			ysAjax.ajax("/sys/SysUser/resetPasswordsEducation", obj, "json", function (res) {
				console.log(res)
				if (res.code == 'OK') {
					ysFn.msgBig('重置密码成功', 1,  function () {
					})
					getEduTable(data)
				} else {
					ysFn.msgBig('操作失败', 2,  function () {})
				}
			})
		})
	})

	$('#eduImport').click(function () { //导入
		window.location.href = './import.html'
	})

})


function dataOptionFormatter(value, row, index) {
	var e = '<a href=" user-edu-check.html?index=0" title="" class="blued check" >查看</a>&nbsp;<a href="javascript:void(0);" title="" class="reset" style="color:#4c98f7">重置密码</a>&nbsp;<a href="javascript:void(0);" title="" class="deleted" style="color:#4c98f7">删除</a>';
	return e;
}