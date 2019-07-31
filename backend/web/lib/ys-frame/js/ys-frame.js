/*
 * 鹰硕校园管理平台ui组件
 */
;
(function ($, window, document, undefined) {

	function addJQFN(pluginName, methods) {
		$.fn[pluginName] = function (methodOrOptions) {
			if (methods[methodOrOptions]) { //传的是个方法名就执行方法
				return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1)); //使这个JQ对象继承组件的方法，并把参数切割掉第一个（因为第一个参数始终是一个类名例如：ysValidate("isPass")就是一个参数也不要传）
			} else if (typeof methodOrOptions === 'object' || !methodOrOptions) { //传的是个对象就初始化（option）
				return methods.init.apply(this, arguments); //执行默认方法，arguments是传入的参数
			} else {
				throw new Error('方法 ' + methodOrOptions + ' 在 $().' + pluginName + ' 上不存在');
			}
		}
	}
	//表单验证validate-------------------------------------------------------------------------------
	(function () {
		var pluginName = 'ysValidate';
		var methods = {
			init: function (options) {
				//内置验证器,后续可自行护展------------------------------------
				var internal = {
					//非空验证(不同类型元素会有不同的效果)
					notEmpty: function (opt, nodeType, node) {
						var df = {
							message: '请填写不能为空的提示信息!!!',
							// regexp: /^(?! ).+$/ //regexp: /^(?! ).*(?! )$/
							regexp: /^[\s\S]*.*[^\s][\s\S]*$/ //regexp: /^(?! ).*(?! )$/

						}
						var set = $.extend(df, opt);
						//根据不同的节点类型,做出不同的非空验证效果,并返回是否通过
						switch (nodeType) {
							//单选或复选框
							case 'radioOrCheckbox':
								//以节点借用数组方法检测是否通过验证
								return Array.prototype.some.call(node, function (item) {
									//如果有一项会返回true,则返回true
									return item.checked == true;
								});
								break;
								//普通的输入框,包括多行文本
							case 'input':
								return set.regexp.test(this.value);
								break;
								//下拉选择框
							case 'select':
								return this.selectedIndex != 0;
								break;
							default:
								return false;
								break;
						}

					},
					//字符串长度控制(只适用于可输入的文本框)
					stringLength: function (opt) {
						var df = {
							min: 0,
							max: 300
						}
						var set = $.extend(df, opt);
						var length = this.value.length;
						//当字符串的长度超过限制,则进行截取
						if (length > set.max) this.value = this.value.substr(0, set.max);
						//根据字符串长度是在限制之内进行判断,并返回是否通过
						return length >= set.min;
					},
					//回调函数(通用)
					callback: function (opt) {
						var df = {
							callback: function () {
								return false;
							}
						}
						var set = $.extend(df, opt);
						//根据回调函数的返回值进行判断,并返回是否通过
						return !!set.callback.call(this);
					},
					div: function (opt) {
						var df = {
							message: '请填写不能为空的提示信息!!!',
							callback: function () {
								return false;
							}
						}
						var set = $.extend(df, opt);
						//根据回调函数的返回值进行判断,并返回是否通过
						return !!set.callback.call(this);
					},
					//自定义正则(只适用于可输入的文本框)
					regexpValidate: function (opt) {
						if ($.type(opt.regexp) != 'regexp') throw new Error('请输入正确的正则表达式');
						//根据正则进行判断,并返回是否通过
						return opt.regexp.test(this.value);
					}
				}
				//验证方法--------------------------------------------------
				function internalValidate(fnName, obj) {
					//当有内置验证方法时,使用内置方法,没有时使用regexpValidate自定义正则方法
					if (internal[fnName]) {
						return internal[fnName].apply(this, Array.prototype.slice.call(arguments, 1)); //自带验证方法
					} else {
						return internal['regexpValidate'].apply(this, Array.prototype.slice.call(arguments, 1)); //自定义验证方法
					}
				}
				//初始化时的默认参数------------------------------------------
				var defaults = {
					//是否启用气泡模式
					tooltip: false,
					//提示气泡的显示位置(启用气泡模式时生效)
					location: 'top',
					//开-关 是否对非必填项,空值通过验证时添加样式
					optionalStyle: false,
					//需要验证的表单元素的name
					fields: {}
				}
				//合并对象
				var settings = $.extend({}, defaults, options);
				//需要验证的表单元素的每一项是否通过
				settings.isPass = {};
				//缓存this
				var that = this;
				//保存默认数据
				that.data('settings', settings);
				//遍历要验证的字段
				for (elName in settings.fields) {
					//设置验证默为不通过
					settings.isPass[elName] = false;
					//获取此字段对应的节点
					var node = this.find('[name=' + elName + ']');
					(function (elName, node) {
						//获取标签名
						var nodeName = node.prop('nodeName').toLowerCase(); //标签名转换
						//input
						if (nodeName == 'input' || nodeName == 'textarea') { //表单类型
							var type = node.prop('type');
							//单选或复选
							if (type == 'radio' || type == 'checkbox') {
								//选项值改变
								node.on('change.ysValidate', function () {
									//遍历验证器
									for (fnName in settings.fields[elName].validators) {
										//是否通过
										var hasPass = internalValidate.call(this, fnName, settings.fields[elName].validators[fnName], 'radioOrCheckbox', node);

										//验证错误情况下的提示信息
										var message = settings.fields[elName].validators[fnName].message || '请设置验证错误的提示!';

										//保存验证结果
										settings.isPass[elName] = hasPass;
										that.data('settings', settings);

										//显示单选或复选框验证结果所对应的样式
										radioOrCheckboxStyle.call(this, hasPass, node);

										if (settings.tooltip) {
											//气泡验证模式显示的样式
										} else {
											//默认模式显示的样式
											defaultStyle.call(this, hasPass, settings.fields[elName].group, message);
										}

										//如果当前验证未通过,则返回,不必再验证后面的验证器
										if (!hasPass) return;
									}
								});
							}
							//其它,例如输入框	
							else {
								//失去焦点
								node.on('input.ysValidate', function () {
									//遍历验证器
									for (fnName in settings.fields[elName].validators) {
										//是否通过
										var hasPass = internalValidate.call(this, fnName, settings.fields[elName].validators[fnName], 'input');

										//验证错误情况下的提示信息
										var message = settings.fields[elName].validators[fnName].message || '请设置验证错误的提示!';

										//保存验证结果
										settings.isPass[elName] = hasPass;
										that.data('settings', settings);

										//显示输入框验证结果所对应的样式										
										inputStyle.call(this, hasPass, settings.fields[elName].group, settings.optionalStyle);

										if (settings.tooltip) {
											//气泡验证模式显示的样式
											tooltipStyle.call(this, hasPass, message, settings.location);
										} else {
											//默认模式显示的样式
											defaultStyle.call(this, hasPass, settings.fields[elName].group, message);
										}

										//如果当前验证未通过,则返回,不必再验证后面的验证器
										if (!hasPass) return;
									}
								});
							}
						}
						//select下拉框
						else if (nodeName == 'select') {
							//选项改变
							node.on('change.ysValidate', function () {
								//遍历验证器
								for (fnName in settings.fields[elName].validators) {
									//是否通过
									var hasPass = internalValidate.call(this, fnName, settings.fields[elName].validators[fnName], 'select');

									//验证错误情况下的提示信息
									var message = settings.fields[elName].validators[fnName].message || '请设置验证错误的提示!';

									//保存验证结果
									settings.isPass[elName] = hasPass;
									that.data('settings', settings);

									//显示验证结果所对应的样式
									selectStyle.call(this, hasPass);

									if (settings.tooltip) {
										//气泡验证模式显示的样式
									} else {
										//默认模式显示的样式
										defaultStyle.call(this, hasPass, settings.fields[elName].group, message);
									}

									//如果当前验证未通过,则返回,不必再验证后面的验证器
									if (!hasPass) return;
								}
							});
						} else if (nodeName == 'div') {
							node.bind('ysmyfunc.ysValidate', function () {
								for (fnName in settings.fields[elName].validators) {
									//是否通过
									var hasPass = internalValidate.call(this, fnName, settings.fields[elName].validators[fnName]);

									//验证错误情况下的提示信息
									var message = settings.fields[elName].validators[fnName].message || '请设置验证错误的提示!';

									//保存验证结果
									settings.isPass[elName] = hasPass;
									that.data('settings', settings);

									//显示验证结果所对应的样式
									selectStyle.call(this, hasPass); //用下拉框的样式不要用input的样式不需要叉叉

									if (settings.tooltip) {
										//气泡验证模式显示的样式
									} else {
										//默认模式显示的样式给父框加红线，提示文字显示在下面
										defaultStyle.call(this, hasPass, settings.fields[elName].group, message);
									}

									//如果当前验证未通过,则返回,不必再验证后面的验证器
									if (!hasPass) return;
								}
							})

						}
					})(elName, node) //自执行+沙箱
				}
			},
			//返回是否已通过验证
			isPass: function () {
				// console.log(this);
				this.find('select').trigger('change.ysValidate');
				this.find('input').trigger('input.ysValidate');
				this.find('textarea').trigger('input.ysValidate');
				this.find('input').trigger('change.ysValidate');
				this.find('div').trigger('ysmyfunc.ysValidate');
				var isPass = this.data('settings').isPass;
				if (!isPass) return false;
				for (i in isPass) {
					if (!isPass[i]) return false;
				}
				console.log(true)
				return true;
			},
			// 销毁
			destroy: function () {
				var that = this;
				var settings = this.data('settings');
				if (!settings) return this;

				var str = 'has-icon-pass has-icon-error has-select-pass has-select-error has-checkbox-error has-input-pass has-input-error';
				var arr = str.split(' ');
				arr.map(function (itme, index) {
					$(that).find('.' + itme).removeClass(itme);
				});
				this.find('.has-span-error').remove();

				//遍历要验证的字段
				for (elName in settings.fields) {
					var node = this.find('[name=' + elName + ']');
					//销毁监听的事件
					node.off('.ysValidate');
				}
				this.removeData('settings');
				return this;
			}
		}
		//输入框验证基本样式
		function inputStyle(isPass, group, optionalStyle) {
			//找到用于插入样式的父级元素
			var $parents = group ? $(this).parents(group) : $(this).parent();
			//删除样式图标
			$parents.find('.has-icon-error, .has-icon-pass').remove();
			//更新边框样式
			if (isPass) {
				$(this).removeClass('has-input-error');
				//是否对非必填项,空值通过验证时添加样式
				if (!optionalStyle && this.value == '') {
					$(this).removeClass('has-input-pass');
				} else {
					$(this).addClass('has-input-pass');
					$parents.append($(`<i class="has-icon-pass"></i>`));
				}
			} else {
				$(this).addClass('has-input-error').removeClass('has-input-pass');
				$parents.append($(`<i class="has-icon-error"></i>`));
			}
		}
		//单选框或复选框基本样式
		function radioOrCheckboxStyle(isPass, node) {
			if (isPass) {
				node.siblings('label').removeClass('has-checkbox-error');
			} else {
				node.siblings('label').addClass('has-checkbox-error');
			}
		}
		//select下拉框基本样式
		function selectStyle(isPass) {
			if (isPass) {
				$(this).removeClass('has-select-error').addClass('has-select-pass');
			} else {
				$(this).addClass('has-select-error').removeClass('has-select-pass');
			}
		}
		//tooltip气泡模式样式
		function tooltipStyle(isPass, message, location) {
			console.log(isPass, message, location)
			if (!isPass) {
				$(this).ysTooltip('destroy').ysTooltip({
					title: message,
					location: location
				});
			} else {
				$(this).ysTooltip('destroy');
			}
		}
		//默认模式样式
		function defaultStyle(isPass, group, message) {
			// console.log(isPass, group, message)
			//找到用于插入样式的父级元素
			var $parents = group ? $(this).parents(group) : $(this).parent();
			//删除原样式
			$parents.find('.has-span-error').remove();
			if (!isPass) {
				$parents.append($(`<span class="has-span-error">${message}</span>`));
			}
		}
		addJQFN(pluginName, methods);
	})();

	//tooltip气泡------------------------------------------------------------------------------------
	(function () {
		var pluginName = 'ysTooltip';
		var methods = {
			init: function (options) {
				//默认属性
				var defaults = {
					title: '我是一个小提示',
					className: 'ys-tooltip',
					location: 'top',
				};
				var settings = $.extend({}, defaults, options);
				this.data('settings', settings);
				var $html = $(`<div class="${settings.className + ' ' + settings.location}">${settings.title}</div>`);
				this.on('focus.tooltip', function () {
					$html.appendTo($('body'));
					switch (settings.location) {
						case 'bottom':
							$html.css({
								top: $(this).offset().top + $(this).outerHeight() + 'px',
								left: $(this).offset().left - 10 + 'px'
							});
							break;
						case 'left':
							$html.css({
								top: $(this).offset().top - 10 + 'px',
								left: $(this).offset().left - $html.outerWidth() - 20 + 'px'
							});
							break;
						case 'right':
							$html.css({
								top: $(this).offset().top - 10 + 'px',
								left: $(this).offset().left + $(this).outerWidth() + 'px'
							});
							break;
						default:
							$html.css({
								top: $(this).offset().top - $html.outerHeight() - 20 + 'px',
								left: $(this).offset().left - 10 + 'px'
							});
							break;
					}
					$html.fadeIn(200)
				});
				this.on('blur.tooltip', function () {
					$html.fadeOut(200, function () {
						$html.remove();
					})
				});
				return this;
			},
			destroy: function () {
				this.removeData('settings');
				this.off('.tooltip');
				$('.ys-tooltip').remove();
				return this;
			}
		}
		addJQFN(pluginName, methods);

	})();
	//周日历--------------------------------
	(function () {
		var pluginName = 'ysWeeklyCalendar';
		var methods = {
			init: function (option) {
				var that = this
				var defaults = {
					firstday: 1,
					className: '.ys-Weekly-calendar',
				};
				var settings = $.extend({}, defaults, option);
				this.data('settings', settings);

				var d = new Date(), //当前时间
					currDay = d.getDay() == 0 ? 7 : d.getDay(), //当前时间是星期几？
					setTime = settings.settime ? settings.settime : new Date(), //传入的时间戳
					setDay = setTime.getDay() == 0 ? 7 : setTime.getDay() //传入的时间戳是星期几？


				/*初始化周历*/
				var initDatetime = function () {
					if (settings.settime) {
						sessionStorage.removeItem("ifthisweek")
					} else {
						sessionStorage.setItem("ifthisweek", true)
					}
					creatWeekCalendar(-setDay);
				}()

				//设置初始点击次数
				settings.clickedTimes = 0

				if (settings.ableStart && settings.ableEnd) { //默认禁用启用
					if (parseInt(settings.startMillisecond) <= parseInt(settings.ableStart)) {
						$(settings.className + ' .prev_week').attr("disabled", true)
					}
					if (parseInt(settings.endMillisecond) >= parseInt(settings.ableEnd)) {
						$(settings.className + ' .next_week').attr("disabled", true)
					}
				}
				/*前一周和后一周方法*/
				/*前一周*/
				$(settings.className + ' .prev_week').on('click.WeeklyCalendar', function () {
					//如果有时间范围限定
					settings.clickedTimes++;
					changeWeek(settings.clickedTimes);
				})
				/*后一周*/
				$(settings.className + ' .next_week').on('click.WeeklyCalendar', function () {
					settings.clickedTimes--;
					changeWeek(settings.clickedTimes);
				})
				// 本周
				$(settings.className + ' .thisweek').on('click.WeeklyCalendar', function () {
					settings.thisweekCallback && settings.thisweekCallback() //如果有设置回调就执行回调
					// settings.clickedTimes = 0
					// sessionStorage.setItem("ifthisweek", true)
					// creatWeekCalendar(-currDay)
				})

				function calcTime(num) { //返回一个过去今天或者未来的时间对象，num的初始值是当天的日期，进退值7天为单位
					var num = num + parseInt(settings.firstday), //加1是为了从星期一开始到星期天结束
						someTime = (sessionStorage.getItem("ifthisweek") ? d.getTime() : setTime.getTime()) + (24 * 60 * 60 * 1000) * num, //目前的时间减去过去的时间或者加上未来的时间，比如今天周三，-3就是周一再加6是周天
						//例如今天星期六，星期一就该往前推-6+1天，星期天就该-6+6+1=1天
						someYear = new Date(someTime).getFullYear(),
						someMonth = new Date(someTime).getMonth() + 1, //美式月份从零开始
						someDate = new Date(someTime).getDate(); //未来天
					var obj = {
						"year": someYear,
						"month": someMonth < 10 ? '0' + someMonth : someMonth,
						"date": someDate < 10 ? '0' + someDate : someDate,
						"millisecond": new Date(someTime).getTime(),
						"now": d.getTime(),
					};
					return obj;
				}
				/*创建周历*/
				function creatWeekCalendar(some) { //两个参数的是本周，不管怎么定范围都跳回本周
					$(settings.className + ' input').val(calcTime(some).year + '-' + calcTime(some).month + '-' + calcTime(some).date + '--' +
						calcTime(some + 6).year + '-' + calcTime(some + 6).month + '-' + calcTime(some + 6).date)

					settings.startTime = calcTime(some).year + '-' + calcTime(some).month + '-' + calcTime(some).date
					settings.endTime = calcTime(some + 6).year + '-' + calcTime(some + 6).month + '-' + calcTime(some + 6).date
					settings.startMillisecond = calcTime(some).millisecond
					settings.endMillisecond = calcTime(some + 6).millisecond
					settings.now = calcTime(some).now

					settings.singleDubleCallback && settings.singleDubleCallback() //如果有设置回调就执行回调
					enable() //按钮禁用启用
				}

				function changeWeek(clickedTimes) { //换周
					creatWeekCalendar(-setDay - (7 * clickedTimes)); //每次点击是一次性退7天或者进7天
				}

				function enable() { //设置禁用启用
					if (settings.ableStart && settings.ableEnd) {
						if (parseInt(settings.startMillisecond) <= parseInt(settings.ableStart)) {
							$(settings.className + ' .prev_week').attr("disabled", true)
						} else {
							$(settings.className + ' .prev_week').attr("disabled", false)
						}
						if (parseInt(settings.endMillisecond) >= parseInt(settings.ableEnd)) {
							$(settings.className + ' .next_week').attr("disabled", true)
						} else {
							$(settings.className + ' .next_week').attr("disabled", false)
						}
					}
				}
				return this;
			},
			destroy: function () {
				$(this.data("settings").className + ' .next_week').off('click');
				$(this.data("settings").className + ' .prev_week').off('click');
				$(this.data("settings").className + ' .thisweek').off('click');
				$(this.data("settings").className + ' input').val('')
				this.removeData('settings');
				sessionStorage.removeItem('ifthisweek');
				return this;
			},
			getdata: function () {
				// console.log(this)
				return {
					startTime: this.data("settings").startTime,
					endTime: this.data("settings").endTime,
					startMillisecond: this.data("settings").startMillisecond,
					endMillisecond: this.data("settings").endMillisecond,
					now: this.data("settings").now,
				}
			}
		}
		addJQFN(pluginName, methods);
	})();
	ysFn = {
		//信息提示框
		msg: function (str, type) {
			var str = str || '',
				type = type || 'tip';
			var html = [];
			html.push('<div class="ys-alert" style="display: none;">');
			html.push('<div class="ys-prompt ' + type + '">');
			html.push('<span class="ion-checkmark-circled "></span>');
			html.push('<p class="">' + str + '</p>');
			html.push('<span class="ion-close-round closeAlert"></span>');
			html.push('</div>');
			html.push('</div>');
			$('body').append(html.join(''));
			$('.ys-alert').fadeIn(300);
		},
		//操作成功/失败提示框
		msgBig: function (str, type, callBack, time) {
			var str = str || '',
				type = type || 1,
				time = time || 2000,
				icon;
			switch (type) {
				case 1:
					icon = 'ion-checkmark-round';
					break;
				case 2:
					icon = 'ion-close-round';
					break;
				case 3:
					icon = 'ion-sad';
					break;
				case 4:
					icon = 'ion-sad';
					break;
				default:
					break;
			}
			var html = [];
			html.push('<div class="ys-msg-big">');
			html.push('<p><i class="' + icon + '"></i>' + str + '</p>');
			html.push('</div>');
			var el = $(html.join(''))
			$('body').append(el);
			el.fadeIn(100, function () {
				setTimeout(function () {
					el.remove();
					callBack && callBack();
				}, time)
			})

		},
		//遮罩
		mask: function (methodOrOptions) {
			var methods = {
				show: function (str, callback) {
					//删除之前的遮罩
					$('.ys-mask').remove();
					//创建新的遮罩
					var str = `<div class="ys-mask">
								<div class="mask-content">
									<span class="mask-img"></span>
									<span class="mask-text">${str ? str : '正在加载中,请稍候...'}</span>
								</div>
							</div>`;
					//添加遮罩点击事件
					var $el = $(str).on('click.mask', function () {
						callback && callback.call(this);
					});
					$('body').append($el);
					$el.fadeIn(600);
				},
				hide: function () {
					$('.ys-mask').fadeOut(600, function () {
						$(this).off('click.mask').remove();
					});
				}
			}
			if (methods[methodOrOptions]) {
				return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
				return methods.init.apply(this, arguments);
			} else {
				throw new Error('方法 ' + methodOrOptions + ' 在 $' + pluginName + ' 上不存在');
			}
		},
		//弹窗确认框
		confirm: function (str, onCallBack, offCallBack, disable) {
			$('#ysFn-confirm').remove();
			var test = true;
			var str = str || '请输入要确认的内容',
				html = `<div class="modal fade confirm" id="ysFn-confirm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
							<div class="modal-dialog" role="document">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close" data-dismiss="modal">
											<span aria-hidden="true" class="ion-close-round"></span>
										</button>
										<h4 class="modal-title">&nbsp;</h4>
									</div>
									<div class="modal-body">
										${str}
									</div>
									<div class="modal-footer">
										<button type="button" class="ys-btn btn-close btn-long">取消</button>
										<button type="button" class="ys-btn btn-primary btn-long">确定</button>
									</div>
								</div>
							</div>
						</div>`
			var el = $(html);
			$('body').append(el);
			$('#ysFn-confirm').modal('show');
			$('#ysFn-confirm').find('.modal-footer button').click(function () {
				$('#ysFn-confirm').find('.modal-footer button').unbind('click')

				$('.modal.confirm').modal('hide');
				if ($(this).text() == '确定') {
					
					onCallBack && onCallBack();
					test = false;
				} else {
					$(this).attr('disabled',false)
					offCallBack && offCallBack();
				}
			});
			$("#ysFn-confirm").on('hidden.bs.modal', function (e) {
				if (test) {
					disable && disable()
				}
			})
		},
		//可增删标签组
		tagGroup: function (el, data, name) {
			return new TagGroup(el, data, name);
		},
		//输入选择框
		selectOneTag: function (el, res, data) {
			return new SelectOneTag(el, res, data);
		},
		//canvas圆形进度条
		drawProgress: function (container, percent, number_elem, forecolor, bgcolor) {
			return new drawProgress(container, percent, number_elem, forecolor, bgcolor);
		},
		//添加单选树
		addRadioTree: function (el, ul, zNodes, setting) {
			return new AddRadioTree(el, ul, zNodes, setting);
		},
		//新增添加单选树 资产 liaoyi
		assetsRadioTree: function (el, ul, zNodes, setting) {
			return new AssetsRadioTree(el, ul, zNodes, setting);
		},
		
		//添加多选树
		addCheckTree: function (el, ul, zNodes, setting) {
			return new AddCheckTree(el, ul, zNodes, setting);
		},
		//上传
		uploadFiles: function (el, api, options, callback) {
			return new UploadFiles(el, api, options, callback);
		},
		//自定义下拉框
		definedSelect: function (el) {
			return new DefinedSelect(el);
		},
		//拖动调换
		drag: function (containerId, dragItemClassName, options) {
			return new Drag(containerId, dragItemClassName, options);
		},
		//时分秒选择器
		timeSelect: function (id, options) {
			return new TimeSelect(id, options);
		},
		//模糊搜索
		ysFuzzy: function (wrap, data) {
			return new ysFuzzy(wrap, data)
		},
		ysMultiSelect: function (wrap, data) {
			return new ysMultiSelect(wrap, data)

		}
	};

	//上传
	function UploadFiles(el, api, options, callback) {
		/*
		 * @el: 上传文件容器(id)
		 * @api: 接口地址
		 * @count: 上传文件最大数量
		 * @maxSize: 文件大小最大值
		 */
		this.el = $('#' + el); //容器对象
		this.api = api; //请求地址
		var defaults = {
			count: 20,
			maxSize: 10
		}
		this.config = $.extend(true, defaults, options);
		this.sum = 0; //计数
		//  this.count = count || 5; //最大数量
		// this.maxSize = (maxSize || 10) * 1024 * 1024; //文件总大小
		this.fileType = this.el.find('.files').length > 0; //检测上传的容器类型
		this.filsesArr = []; //所选文件集合
		this.currentAJAX = null; //当前ajax对象
		this.results = []; //数据集合
		this.whichGroup = 0; //上传的第几组
		this.init();
		this.callback = callback
	}
	UploadFiles.prototype = {
		constructor: UploadFiles,
		init: function () {
			this.fileType ? this.isFiles() : this.isImgs();
			this.closeEvents();
		},
		//删除文件或图片
		closeEvents: function () {
			var that = this;
			//删除
			that.el.on('click', '.delete', function () {
				// 
				// console.log(that.whichGroup)

				//				var index = $(this).parents('.item').index();
				//				that.results.splice(that.fileType ? index : index - 1, 1);
				var fileName = $(this).attr('data-name');
				for (var i = 0; i < that.results.length; i++) {
					if (fileName == that.results[i].fileName) {
						that.results.splice(i, 1);
						break;
					}
				}
				$(this).parents('.item').remove();
				that.whichGroup = that.whichGroup - 1;
				console.log('显示数据集合', that.results);
			});
			//取消上传
			that.el.on('click', '.cancel', function () {
				if (that.currentAJAX) that.currentAJAX.abort();
				$(this).parents('li.item').fadeOut(600, function () {
					$(this).remove();
				});
			})
		},
		//创建本地预览图片地址
		getObjectURL: function (file) {
			var url = null;
			if (window.createObjectURL != undefined) {
				url = window.createObjectURL(file)
			} else if (window.URL != undefined) {
				url = window.URL.createObjectURL(file)
			} else if (window.webkitURL != undefined) {
				url = window.webkitURL.createObjectURL(file)
			}
			return url
		},
		//查看文件类型并返回相应图标
		getFileType: function (name) {
			var str = name.match(/[^\.][\w]{2,5}$/);
			if (str != null) return str[0].toLowerCase();
			return '';
		},
		//文件上传
		isFiles: function () {
			var that = this;
			that.el.find('input[type="file"]').change(function (ev) {
				console.log("jinlai")
				var files = ev.target.files;
				if (files.length == 0) return;
				that.filsesArr = []; //清空原来选择的文件
				that.whichGroup++; //批次计数
				var html = [];
				var tag = "%";
				console.log(that.results.length)
				// console.log(that.config.count)
				if (that.results.length >= that.config.count) {
					// that.whichGroup=that.whichGroup-1
					ysFn.msgBig(`最多上传${that.config.count}个`, 2, function () {})
					return false
				}
				for (var i = 0; i < files.length; i++) {
					// if(files[i].name.indexOf(tag)!=-1){
					// 	console.log('====')
					// 	ysFn.msgBig("你上传的 \“"+files[i].name+"\” 文件有特殊字符，文件名中不可存在特殊字符,请重新上传"); 
					// 	return 
					// } 
					that.filsesArr.push(files[i]);
					html.push('<li class="item">');
					html.push('<div class="file-info">');
					html.push('<span class="icon ' + that.getFileType(files[i].name) + '" /></span>');
					html.push('<span class="name" title="' + files[i].name + '">' + files[i].name + '</span>');
					//html.push('<span class="complete complete' + that.whichGroup + '">已完成</span>');
					// html.push('<div class="file-button">');
					//html.push('<span class=\"cancel cancel' + that.whichGroup + '\" data-name="' + files[i].name + '">取消上传</span>');
					html.push('<span class=\"file-button ion-trash-a delete delete' + that.whichGroup + '\" data-name="' + files[i].name + '"></span>');
					html.push('</div>');
					// html.push('</div>');
					//html.push('<div class="file-progress">');
					//html.push('<div class="progress">');
					//html.push('<div class="color progress-color' + that.whichGroup + '" style="width: 0;"></div>');
					//html.push('</div>');
					//html.push('<span class="percent percent' + that.whichGroup + '">0%</span>');
					//html.push('</div>');
					html.push('</li>');
				}
				that.el.find('.files-ul').append(html.join(''));
				//开始上传文件,回调函数更新进度条状态
				that.request(function (percent) {
					that.el.find('.progress-color' + that.whichGroup).width(percent + '%');
					that.el.find('.percent' + that.whichGroup).html(percent + '%');
					if (percent == 100) {
						that.el.find('.cancel' + that.whichGroup).hide(); //关闭取消上传
						that.el.find('.delete' + that.whichGroup).fadeIn(500); //显示删除按钮
						that.el.find('.complete' + that.whichGroup).fadeIn(500); //显示已完成
					}
				}, that.config.UploadType || 'files');
			})
		},
		//图片上传
		isImgs: function (callback) {
			var that = this;
			that.el.find('input[type="file"]').change(function (ev) {
				var files = ev.target.files;
				console.log('已传：' + that.el.find('.imgs>.img-list').length);
				if (files.length == 0) return;
				that.filsesArr = []; //清空原来选择的文件
				that.whichGroup++; //批次计数
				var html = [];
				console.log(that.config.count)
				console.log(that.whichGroup)
				console.dir('文件集合：' + that.results.length)
				if (files.length > that.config.count || that.results.length + files.length > that.config.count) {
					ysFn.msgBig(`图片最多上传${that.config.count}张`, 2, function () {})
					return false
				}
				// if (that.whichGroup > that.config.count) {
				// 	ysFn.msgBig(`图片最多上传${that.config.count}张`, 2, function () { })
				// 	return false
				// }
				for (var i = 0; i < files.length; i++) {
					if (!/image\/\w+/.test(files[i].type)) {
						continue
					}
					if (that.config.count == i) {
						continue
					}
					that.filsesArr.push(files[i]);
					html.push('<div class="img-list item">');
					html.push('<img src="' + that.getObjectURL(files[i]) + '"  />');
					html.push('<div class="mask mask' + that.whichGroup + '">');
					html.push('<span class="mask-percent' + that.whichGroup + '">' + '</span>');
					html.push('</div>');
					html.push('<i class="ion-close delete delete' + that.whichGroup + '" data-name="' + files[i].name + '"></i>');
					html.push('</div>');
				}
				if (that.config.count == 1) {
					that.el.find('.imgs>.img-list').remove();
				}
				that.el.find('.imgs').append(html.join(''));

				ysFn.drag("file2", "item", {})
				// $('item').eq(0).removeClass("drag-item")
				//开始上传文件,回调函数更新进度条状态
				that.request(function (percent) {
					that.el.find('.mask-percent' + that.whichGroup).html(percent + '%');
					if (percent == 100) {
						that.el.find('.mask' + that.whichGroup).fadeOut(500); //关闭遮罩
						that.el.find('.delete' + that.whichGroup).fadeIn(500); //显示删除按钮
					}
				}, 'imgs');
			})
		},
		//ajax请求
		request: function (callBack, type) {
			ysFn.mask('show', '上传中,请稍候...');
			var that = this;
			// console.log( that.filsesArr)
			var formData = new FormData();
			for (var i = 0; i < that.filsesArr.length; i++) {
				//   that.filsesArr[i].name = encodeURIComponent(that.filsesArr[i].name)
				//   console.log(encodeURI(that.filsesArr[i].name))
				formData.append(type, that.filsesArr[i]);
			}
			console.log(that.filsesArr)
			that.currentAJAX = $.ajax({
				url: that.api,
				type: 'POST',
				data: formData,
				dataType: 'json',
				contentType: false,
				processData: false,
				xhr: function () {
					var xhr = $.ajaxSettings.xhr();
					if (onprogress && xhr.upload) {
						xhr.upload.addEventListener("progress", onprogress, false);
						return xhr;
					}
				},
				success: function (res) {
					if (res.code == 'OK') {
						if (res.data[type + 'Url'] && res.data[type + 'Url'].length > 0) {
							console.log('成功返回' + type + '地址', res);
							var arr = res.data[type + 'Url'];
							// 	if($(".item").length>0){
							// 		console.log($('.item').length)
							//    }
							// 	$(".item:last").find('img').attr("src",api+res.data.imgsUrl[0].fileUrl)
							if (arr && arr.length > 0) {
								console.log('上传文件图片数量：' + $(".item").length)
								for (var i = $(".item").length - arr.length, j = 0; i < $(".item").length; i++) {

									$($(".item")[i]).find('img').attr('src', imgApi + arr[j].fileUrl)
									$($(".item")[i]).find('img').attr('data-img', arr[j].fileUrl)
									j++
								}
							}
							if (that.config.count == 1) {
								that.results = [arr[0]];
							} else {
								that.results = that.results.concat(arr);
							}
							console.log('显示' + type + '对象数据集合', that.results);

						} else {

							console.log(type + '参数错误, 没有返回' + type + '地址');

						}

					} else {
						that.el.find('.delete' + that.whichGroup).hide();
						console.log('失败,返回' + type + '集合', that.results);
					}
					that.el.find('input[type="file"]').val('');
					ysFn.mask('hide');
					if(that.callback) {
						that.callback()
					}
				},
				error: function (xhr, type, errorThrown) {
					console.log(xhr, type, errorThrown);
					console.log('ajax请求错误');
					ysFn.mask('hide');
					that.el.find('.delete' + that.whichGroup).hide();
					that.el.find('input[type="file"]').val('');
				}
			});

			function onprogress(evt) {
				var loaded = evt.loaded; //已上传大小
				var total = evt.total; //总大小
				var percent = Math.floor(100 * loaded / total);
				callBack(percent);
			}
		},
		//设置默认文件集合
		setResults: function (addData, url) {
			var that = this;
			if (addData && addData.length && addData.length > 0) {
				that.results = that.results.concat(addData);
				this.fileType ? setFiles() : setimages();
			}

			function setFiles() {
				var html = [];
				for (var i = 0; i < addData.length; i++) {
					html.push('<li class="item">');
					html.push('<div class="file-info">');
					html.push('<span class="icon ' + that.getFileType(addData[i].fileName) + '" /></span>');
					html.push('<span class="name">' + addData[i].fileName + '</span>');
					html.push('<span class="file-button ion-trash-a delete" data-name="' + addData[i].fileName + '" style="display:inline;"></span>');
					html.push('</div>');
					html.push('</li>');
				}
				that.el.find('.files-ul').append(html.join(''));
			}

			function setimages() {
				var html = [];
				console.log(url)
				for (var i = 0; i < addData.length; i++) {
					html.push('<div class="img-list item">');
					html.push('<img src="' + (url ? url : "") + addData[i].fileUrl + '" data-img="' + addData[i].fileUrl + '" />');
					html.push('<i class="ion-close delete" style="display:block;" data-name="' + addData[i].fileName + '"></i>');
					html.push('</div>');
				}
				that.el.find('.imgs').append(html.join(''));

			}
			return this.results;
		},
		//删除文件集合
		delResults: function () {
			this.results = [];
			this.el.find('.files-ul').empty();
			this.el.find('.img-list').remove();
		},
		//获取文件集合
		getResults: function () {
			return this.results;
		},
		// 获取文件对象
		getFileObj:function(){
			var that = this;
			return that.filsesArr
		}
	}

	//canvas圆形进度条
	function drawProgress(container, percent, number_elem, forecolor, bgcolor) {
		/*
		 * @container: 绘制对象容器
		 * @percent： 绘制圆环百分比[0~100]
		 * @number_elem: 计数值对象
		 * @forecolor: 绘制圆环的前景色， 颜色代码
		 * @bgcolor: 绘制圆环的背景色， 颜色代码
		 */
		var container = document.getElementById(container),
			drawing_elem = container.getElementsByTagName('canvas')[0],
			number_elem = number_elem || container.getElementsByClassName("content-number")[0],
			forecolor = forecolor || "#0493f0",
			bgcolor = bgcolor || "#cfdae5",
			context = drawing_elem.getContext("2d"),
			center_x = drawing_elem.width / 2, //Canvas中心点x轴坐标
			center_y = drawing_elem.height / 2, //Canvas中心点y轴坐标
			rad = Math.PI * 2 / 100, //将360度分成100份
			speed = 0; //开始值
		// 绘制背景圆圈  
		function bgcolorCircle() {
			context.save();
			context.beginPath();
			context.lineWidth = 5; //设置线宽  
			var radius = center_x - context.lineWidth;
			context.lineCap = "butt";
			context.strokeStyle = bgcolor;
			context.arc(center_x, center_y, radius, 0, Math.PI * 2, false);
			context.stroke();
			context.closePath();
			context.restore();
		}

		//绘制运动圆环  
		function forecolorCircle(n) {
			context.save();
			context.strokeStyle = forecolor;
			context.lineWidth = 5;
			context.lineCap = "butt";
			var radius = center_x - context.lineWidth;
			context.beginPath();
			context.arc(center_x, center_y, radius, -Math.PI / 2, -Math.PI / 2 + n * rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)  
			context.stroke();
			context.closePath();
			context.restore();
		}

		//绘制文字
		function drawText(n) {
			number_elem.innerHTML = n.toFixed(0);
		}

		//执行动画  
		(function drawFrame() {
			var stop = window.requestAnimationFrame(drawFrame);
			context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
			bgcolorCircle();
			forecolorCircle(speed);
			drawText(speed);
			if (speed >= percent) {
				window.cancelAnimationFrame(stop)
				return;
			}
			speed += 1;
		}());
	}

	//可增删标签组
	function TagGroup(el, data, name) {
		/*
		 * @el: 容器(id)
		 * @data: 数据数组对象
		 */
		this.el = $('#' + el);
		this.data = data || [];
		this.name = name || 'name';
		this.prevByRemoveNode = {};
		this.nodes = [];
		this.init();

	}
	TagGroup.prototype = {
		constructor: TagGroup,
		init: function () {
			this.el.find('.tag-items').empty();
			this.insertNodes();
			this.removeNode();
		},
		createNode: function (arr) {
			var that = this;
			var html = [];
			if ($.isArray(arr) && arr.length > 0) {
				$.each(arr, function (i, v) {
					html.push('<div class="tag-label">');
					html.push('<span class="tag-label-text">' + v[that.name] && v[that.name] + '</span>');
					html.push('<i class="tag-label-remove ion-ios-close-empty" data-attr="'+i+'" ></i>');
					html.push('</div>');
					that.nodes.push(v);
				});
			}
			return html.join('');
		},
		insertNodes: function () {
			var that = this;
			that.el.find('.tag-items').append(that.createNode(that.data));
		},
		addNodes: function (pushData) {
			var that = this;
			if (pushData.length > 0) {
				var html = that.createNode(pushData);
				that.el.find('.tag-items').append(html);
			}
			return this;
		},
		removeNode: function (callBack) {
			var that = this;
			that.el.unbind('mouseup')
			that.el.on('mouseup', '.tag-label-remove', function (ev) {
				var index = $(this).parents('.tag-label').index();
				that.prevByRemoveNode = that.nodes[index];
				that.nodes.splice(index, 1);
				that.el.find('.tag-label').eq(index).remove();
				//return index
			});
		},
		getNodes: function () {
			return this.nodes;
		},
		empty: function () {
			this.el.find('.tag-items').empty();
			this.nodes = [];
			return this;
		}
	}

	//单选搜索框
	function SelectOneTag(el, res, data) {
		/*
		 * @el: 容器(id)
		 * @data: 初始增加的数组对象
		 * @res: 数据数组对象
		 */
		this.el = $('#' + el);
		this.data = data || [];
		this.res = res || [];
		this.init();
	}
	SelectOneTag.prototype = {
		constructor: SelectOneTag,
		init: function () {
			this.onInput();
			this.onFocus();
			this.onBlurAndAdd();
			this.addData();
		},
		addData: function () { //把选项添加到输入框
			var that = this;
			if (that.data.length == 0) {
				that.el.find('input').val('');
				that.el.find('input').attr('data-fkCode', '');
			} else {
				that.el.find('input').val(that.data[0].name);
				that.el.find('input').attr('data-fkCode', that.data[0].id);
			}
			return that;
		},
		onBlurAndAdd: function () {
			var that = this;
			that.el.find('input').blur(function () { //失去焦点时隐藏选项
				var deferSearch1 = null;
				deferSearch1 && clearTimeout1(deferSearch);
				deferSearch1 = setTimeout(function () {
					that.el.find('ul').hide()
				}, 100);
			})
			that.el.find('ul').on('click', 'a', function () { //点击选项时隐藏选项
				console.log(1)
				var $this = $(this);
				that.el.find('ul').hide()
				that.res.forEach(function (e, i) {
					if (e.id == $this.attr('data-fkCode')) {
						that.data = [e]
					}
				})
				that.addData()
			})
		},
		onFocus: function () { //点击输入框时显示全部选项
			var that = this;
			that.el.find('input').focus(function () {
				var html = '';
				that.res.forEach(function (e, i) {
					html += '<li><a href="javasceipt:;" data-fkCode="' + e.id + '">' + e.name + '</a></li>'
				})
				that.el.find('ul').html(html)
				that.el.find('ul').show()
			})
		},
		onInput: function () { //修改时变更选项
			var that = this;
			that.el.find('input').on('input', function () {
				if (!$(this).val().trim()) {
					var html = '';
					that.res.forEach(function (e, i) {
						html += '<li><a href="javasceipt:;" data-fkCode="' + e.id + '">' + e.name + '</a></li>'
					})
					that.el.find('ul').html(html)
					that.el.find('ul').show()
					return
				}
				var keyWord = $(this).val().trim();
				console.log(keyWord)
				search()

				function search() {
					var arr = [];
					var html = '';
					that.res.forEach(function (e, i) {
						// if (e.type) {
						if (e.name.indexOf(keyWord) > -1) {
							arr.push(e)
						}
						// }
					})
					if (arr.length != 0) {
						arr.forEach(function (e, i) {
							html += '<li><a href="javasceipt:;" data-fkCode="' + e.id + '">' + e.name + '</a></li>'
						})
						that.el.find('ul').html(html)
						that.el.find('ul').show()
					} else {
						that.el.find('ul').html('<h4 style="text-align:center;">没有匹配的数据！</h4>')
						that.el.find('ul').show()
					}
				}
			})
		},
		upData: function (upData) { //手动添加选中数据
			var that = this
			if (upData) {
				that.data = upData;
				that.addData();
			}
			return that;
		},
		upRes: function (upRes) { //手动修改筛选数据
			var that = this
			if (upRes) {
				that.res = upRes;
				that.data = []
				that.addData()
			}
			return that;
		},
		getData: function () { //获取数据
			var that = this;
			var flag = false;
			that.res.forEach(function (e, i) {
				//只有名字和id都对上时才会返回数据
				if (e.name == that.el.find('input').val() && e.id == that.el.find('input').attr('data-fkCode')) {
					flag = true
				}
			})
			console.log(that.data)
			console.log(flag)
			if (flag) {
				return that.data;
			} else {
				console.log('文字与id不匹配')
				return [];
			}
		}
	}
	//单选树型
	function AssetsRadioTree(el, ul, zNodes, setting) {
		/*
		 * @el: 添加单选人员容器(id)
		 * @ul: 添加树型容器(id)
		 * @zNodes: 数据[]
		 * @setting: 设置参数{}
		 */
		this.el = $('#' + el);
		this.ul = $('#' + ul);
		this.zNodes = zNodes;
		//树默认参数				
		this.defaults = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id", //节点的id,注意此处要对应你后台传过来的节点的属性名id  
					pIdKey: "pId", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId  
					rootPId: 0
				},
			},
			callback: {
				beforeCheck: function (treeId, treeNode) {
					//return !treeNode.isParent; //当是父节点 返回false 不让选取
				},
				onCheck: function (ev, treeId, treeNode) {},

			},
			check: {
				enable: true,
				autoCheckTrigger: true,
				chkStyle: "radio",
				radioType: "all"
			}
		};
		if (setting) {
			$.extend(this.defaults, setting);
		}
		this.init();
	}
	//单选树型
	function AddRadioTree(el, ul, zNodes, setting) {
		/*
		 * @el: 添加单选人员容器(id)
		 * @ul: 添加树型容器(id)
		 * @zNodes: 数据[]
		 * @setting: 设置参数{}
		 */
		this.el = $('#' + el);
		this.ul = $('#' + ul);
		this.zNodes = zNodes;
		//树默认参数				
		this.defaults = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id", //节点的id,注意此处要对应你后台传过来的节点的属性名id  
					pIdKey: "pId", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId  
					rootPId: 0
				},
			},
			callback: {
				beforeCheck: function (treeId, treeNode) {
					return !treeNode.isParent; //当是父节点 返回false 不让选取
				},
				onCheck: function (ev, treeId, treeNode) {},

			},
			check: {
				enable: true,
				autoCheckTrigger: true,
				chkStyle: "radio",
				radioType: "all"
			}
		};
		if (setting) {
			$.extend(this.defaults, setting);
		}
		this.init();
	}
	AddRadioTree.prototype = {
		constructor: AddRadioTree,
		init: function () {
			this.insertTree();
		},
		//过滤节点,如果是父节点不显示check
		createNode: function (responseData) {
			var responseData = JSON.parse(JSON.stringify(responseData))
			for (var i = 0; i < responseData.length; i++) {
				if (!responseData[i].type) responseData[i].isParent = true;
				if (responseData[i].isParent) responseData[i].nocheck = true;
			}
			return responseData;
		},
		insertTree: function () {
			var that = this;
			//初始化zTree
			that.defaults.callback.onClick = function (e, treeId, treeNode, clickFlag) {
				that.zTreeObj.checkNode(treeNode, !treeNode.checked, true);
			}
			that.zTreeObj = $.fn.zTree.init(that.ul, that.defaults, that.createNode(that.zNodes));
			//防抖模糊搜索
			var deferSearch = null;
			var allNodes = that.zTreeObj.transformToArray(that.zTreeObj.getNodes());
			that.el.find('.modal-body input').on('input', function () {
				if (!$(this).val().trim()) {
					that.zTreeObj.expandAll(false);
					that.zTreeObj.showNodes(allNodes);
					that.el.find('.modal-body h4').css('display', 'none');
					return
				}
				var keyWord = $(this).val().trim();
				deferSearch && clearTimeout(deferSearch);
				deferSearch = setTimeout(function () {
					//隐藏所有的节点
					that.zTreeObj.hideNodes(allNodes);
					//通过关键字模糊搜索到匹配的节点
					var nodeList = that.zTreeObj.getNodesByParamFuzzy('name', keyWord);
					//找出所有符合要求的叶子节点的路径
					var arr = new Array();
					for (var i = 0; i < nodeList.length; i++) {
						arr = $.merge(arr, nodeList[i].getPath());
					}

					//显示搜索结果节点及其路径节点
					that.zTreeObj.showNodes($.unique(arr));
					//展开路径
					that.zTreeObj.expandAll(true);

					if (arr.length == 0) {
						that.el.find('.modal-body h4').css('display', 'block');
						that.zTreeObj.expandAll(false);
					} else {
						that.el.find('.modal-body h4').css('display', 'none');
					}
				}, 600);
			});
			that.el.on('hidden.bs.modal', function () {
				that.el.find('.modal-body input').val('')
			})
		},
		getSelectNodes: function () {
			var that = this;
			var nodes = that.zTreeObj.getCheckedNodes(true);
			return nodes;
		}
	}
	//复制一份 资产 liaoyi
	AssetsRadioTree.prototype = {
		constructor: AssetsRadioTree,
		init: function () {
			this.insertTree();
		},
		//过滤节点,如果是父节点不显示check
		createNode: function (responseData) {
			var responseData = JSON.parse(JSON.stringify(responseData))
			for (var i = 0; i < responseData.length; i++) {
				if (!responseData[i].type) responseData[i].isParent = true;
				if (responseData[i].isParent) responseData[i].nocheck = true;
			}
			return responseData;
		},
		insertTree: function () {
			var that = this;
			//初始化zTree
			that.defaults.callback.onClick = function (e, treeId, treeNode, clickFlag) {
				that.zTreeObj.checkNode(treeNode, !treeNode.checked, true);
			}
			that.zTreeObj = $.fn.zTree.init(that.ul, that.defaults, that.createNode(that.zNodes));
			//防抖模糊搜索
			var deferSearch = null;
			var allNodes = that.zTreeObj.transformToArray(that.zTreeObj.getNodes());
			that.el.find('.modal-body input').on('input', function () {
				if (!$(this).val().trim()) {
					that.zTreeObj.expandAll(false);
					that.zTreeObj.showNodes(allNodes);
					that.el.find('.modal-body h4').css('display', 'none');
					return
				}
				var keyWord = $(this).val().trim();
				deferSearch && clearTimeout(deferSearch);
				deferSearch = setTimeout(function () {
					//隐藏所有的节点
					that.zTreeObj.hideNodes(allNodes);
					//通过关键字模糊搜索到匹配的节点
					var nodeList = that.zTreeObj.getNodesByParamFuzzy('name', keyWord);
					//找出所有符合要求的叶子节点的路径
					var arr = new Array();
					for (var i = 0; i < nodeList.length; i++) {
						arr = $.merge(arr, nodeList[i].getPath());
					}

					//显示搜索结果节点及其路径节点
					that.zTreeObj.showNodes($.unique(arr));
					//展开路径
					that.zTreeObj.expandAll(true);

					if (arr.length == 0) {
						that.el.find('.modal-body h4').css('display', 'block');
						that.zTreeObj.expandAll(false);
					} else {
						that.el.find('.modal-body h4').css('display', 'none');
					}
				}, 600);
			});
			that.el.on('hidden.bs.modal', function () {
				that.el.find('.modal-body input').val('')
			})
		},
		getSelectNodes: function () {
			var that = this;
			var nodes = that.zTreeObj.getCheckedNodes(true);
			return nodes;
		}
	}
	//复选树型
	function AddCheckTree(el, ul, zNodes, setting) {
		/*
		 * @el: 添加单选人员容器(id)
		 * @ul: 添加树型容器(id)
		 * @zNodes: 数据[]
		 * @setting: 设置参数{}
		 */
		this.el = $('#' + el);
		this.ul = $('#' + ul);
		this.zNodes = zNodes; //树型数据
		this.zTreeObj = null; //zTree对象
		//树默认参数				
		this.defaults = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: 0
				},
			},
			view: {
				selectedMulti: false
			},
			callback: {
				beforeCheck: null,
				onCheck: function (ev, treeId, treeNode) {}
			},
			check: {
				enable: true,
				autoCheckTrigger: true,
				chkStyle: "checkbox",
				chkBoxType: {
					"Y": "p",
					"N": "s"
				}
			}
		};
		if (setting) {
			$.extend(this.defaults, setting);
		}
		this.init();
	}
	AddCheckTree.prototype = {
		constructor: AddCheckTree,
		init: function () {
			this.insertTree();
			// this.removeAll()
		},
		//过滤节点
		createNode: function (responseData) {
			var responseData = JSON.parse(JSON.stringify(responseData))
			for (var i = 0; i < responseData.length; i++) {
				if (responseData[i].isParent) responseData[i].nocheck = true;
				if (!responseData[i].type) responseData[i].isParent = true;
			}
			return responseData;
		},
		insertTree: function () {
			var that = this;
			//初始化zTree
			$(function () {
				that.defaults.callback.onClick = function (e, treeId, treeNode, clickFlag) {
					that.zTreeObj.checkNode(treeNode, !treeNode.checked, true);
				}
				that.zTreeObj = $.fn.zTree.init(that.ul, that.defaults, that.createNode(that.zNodes));
			})
			//初始化模糊搜索方法
			fuzzySearch(that.ul.attr('id'), that.el.find('.modal-body-left input'), null, true);
			//选择事件
			that.el.find('.modal-body-center .select-btn').click(function () {
				that.selects();
				that.selectsDel()
			});
			//移除事件
			that.el.find('.modal-body-center .remove-btn').click(function () {
				that.remove();

			});

			//点击添加
			that.el.find('.modal-body-center .remove-btn').click(function () {
				that.remove();

			});
			//清空事件
			that.el.find('.modal-body-center .empty-btn').click(function () {
				that.empty();
			});
			//全选
			that.el.find('.modal-body-right .all label').click(function (ev) {
				ev.stopPropagation();
				var checked = $(this).prev('input').prop('checked');
				that.el.find('.modal-body-right .ys-checkbox:not(.all)').find('input').prop('checked', !checked);
			});
			//自动全选或取消全选
			that.el.find('.modal-body-right').on('click', '.ys-checkbox:not(.all) input', function (ev) {
				ev.stopPropagation();
				var checks = that.el.find('.modal-body-right .ys-checkbox:not(.all)');
				var all = that.el.find('.modal-body-right .all').find('input');
				var nodeData = JSON.parse($(this).parent('.ys-checkbox').attr('data-str'));
				if (checks.find('input').length == checks.find('input:checked').length) {
					all.prop('checked', true);
				} else {
					all.prop('checked', false);
				}
			});
			//防抖模糊搜索
			//			var deferSearch = null;
			//			var allNodes = that.zTreeObj.transformToArray(that.zTreeObj.getNodes());
			//			that.el.find('.modal-body-left input').on('input', function() {
			//				var keyWord = $(this).val();
			//				deferSearch && clearTimeout(deferSearch);
			//				deferSearch = setTimeout(function() {
			//					//隐藏所有的节点
			//					that.zTreeObj.hideNodes(allNodes);
			//					//通过关键字模糊搜索到匹配的节点
			//					var nodeList = that.zTreeObj.getNodesByParamFuzzy('name', keyWord);
			//					//找出所有符合要求的叶子节点的路径
			//					var arr = new Array();
			//					for(var i = 0; i < nodeList.length; i++) {
			//						arr = $.merge(arr, nodeList[i].getPath());
			//					}
			//					//显示搜索结果节点及其路径节点
			//					that.zTreeObj.showNodes($.unique(arr));
			//					//展开路径
			//					that.zTreeObj.expandAll(true);
			//
			//				}, 600);
			//			});
		},
		//选择
		selects: function () {
			console.log(this.getSelectNodes())
			var that = this;
			var nodes = that.zTreeObj.getCheckedNodes(true);
			var getSelectNodes = this.getSelectNodes();
			if (nodes.length > 0) {
				var treeNodeArr = [];
				nodes.forEach(function (treeNode, i) {
					//如果不是父节点
					if (!treeNode.isParent) {
						//检测右边是否已有此人员
						var boole = getSelectNodes.some(function (value) {
							return value.id == treeNode.id
						});
						if (!boole) {
							//判断是否因为搜索而修改过name
							if (treeNode.oldname) treeNode.name = treeNode.oldname;
							//开始创建节点
							treeNodeArr.push('<div class="ys-checkbox ys-left ztreeli" data-str=' + JSON.stringify(treeNode) + '>');
							// treeNodeArr.push('<input type="checkbox" id="checkbox' + treeNode.id + '">');
							// treeNodeArr.push('<label >' + treeNode.name + '</label>');
							// 2019.4.11新增 liaoyi
							treeNodeArr.push('<span class="pl40" for="checkbox' + treeNode.id + '">' + treeNode.name + '</span>');
							treeNodeArr.push('<span class="fa fa-close delCom" ></span>');
							treeNodeArr.push('</div>');
							
						}
					}
				});
				that.el.find('.modal-body-right').append(treeNodeArr.join(''));
				that.el.find(".delCom").unbind("click")
				console.log(that.el.find(".delCom").length)
				that.el.find(".delCom").bind("click",function () {

					var that = this;
					var treeObj = $.fn.zTree.getZTreeObj("addCheckTreeTestUlnoButton");
					var removeId = $(this).parents(".ys-checkbox").attr("data-str");


					$.each(nodes, function (i, v) {
						console.log(v)
						if (v.id == JSON.parse(removeId).id) {
							// nodes.checkNode(v, false, false); //取消这个节点的勾选状态
		
							$(that).parent(".ys-checkbox").remove();
						}
					});
	
				})
				that.el.find(".ztreeli").unbind("click")
				that.el.find(".ztreeli").bind("click",function () {
					if($(this).hasClass('activeLi'))
					{
						$(this).removeClass('activeLi');
					}else{
						$(this).addClass('activeLi');
					}
				})
			}
			
		},
		// 带删除按钮
		selectsDel: function () {
			var that = this;
			var nodes = that.zTreeObj.getCheckedNodes(true);
			// console.log(nodes.length)
			$(".num").text(nodes.length)
			// console.log(nodes)
			if (nodes.length > 0) {
				var treeNodeArr = [];
				nodes.forEach(function (treeNode, i) {
					if (!treeNode.isParent) {
						if (treeNode.oldname) treeNode.name = treeNode.oldname;
						treeNodeArr.push('<div class="ys-checkbox ys-left slectRemove" data-str=' + JSON.stringify(treeNode) + '>');
						treeNodeArr.push('<span>' + treeNode.name + '</span>')
						// treeNodeArr.push('<input type="checkbox" id="checkbox' + treeNode.id + '">');
						// treeNodeArr.push('<label for="checkbox' + treeNode.id + '">' + treeNode.name + '</label>');
						treeNodeArr.push('<i class="fa fa-remove removBtn" style="color:red;float:right;"></i>')
						treeNodeArr.push('</div>');
					}
				});
				//that.empty();
				that.el.find('.removeButton .ys-checkbox:not(.all)').remove();
				that.el.find('.removeButton').append(treeNodeArr.join(''));
			}
			that.el.find(".removeButton i").click(function () {
				var that = this;
				var treeObj = $.fn.zTree.getZTreeObj("addCheckTreeTestUlnoButton");
				var removeId = $(this).parents(".ys-checkbox").attr("data-str");
				console.log(removeId)
				console.log(nodes)

				$.each(nodes, function (i, v) {
					console.log(v)
					if (v.id == JSON.parse(removeId).id) {
						treeObj.checkNode(v, false, false); //取消这个节点的勾选状态
						$(".num").text(i)
						$(that).parent(".ys-checkbox").remove();
					}
				});

			})

			// that.removeAll()

		},
		removeAll: function () {
			var that = this;
			that.el.find(".allDel").click(function () {
				that.el.find('.modal-body-right .ys-checkbox').remove();
				// that.el.find('.removeButton .ys-checkbox:not(.all)').remove();
				var treeObj = $.fn.zTree.getZTreeObj("addCheckTreeTestUlnoButton");
				// that.el.find('.removeButton .ys-checkbox').remove()
				treeObj.checkAllNodes(false);
			})
		},
		//移除
		remove: function () {
			var that = this;
			// var list = that.el.find('.modal-body-right .ys-checkbox:not(.all)').find('input');
			var list = that.el.find('.modal-body-right .activeLi');
			list.each(function () {
				// if ($(this).prop('checked')) {
					// $(this).parent('.ys-checkbox').remove()
				// }
				$(this).remove()
			})
		},
		//清空
		empty: function () {
			var that = this;

			that.el.find('.modal-body-right .ys-checkbox:not(.all)').remove();
			var nodes = that.zTreeObj.getCheckedNodes(true);
			$.each(nodes, function (i, v) {
				nodes[i].checked = false;
				that.zTreeObj.updateNode(nodes[i], true, true);
			});
			$(".num").text("0")
		},
		//获取所有选中的节点
		getSelectNodes: function () {
			var that = this;
			var divs = that.el.find('.modal-body-right .ys-checkbox:not(.all)');
			if (divs.length > 0) {
				var arr = [];
				divs.each(function (i, v) {
					arr.push(JSON.parse($(v).attr('data-str')))
				})
				return arr;
			}
			return [];
		},
	}

	//自定义select
	function DefinedSelect(el) {
		this.el = $('#' + el);
		this.span = this.el.children('.select-val');
		this.init();
	}
	DefinedSelect.prototype = {
		constructor: DefinedSelect,
		init: function () {
			var that = this;
			that.el.on('click', '.select-val', function (ev) {
				ev.stopPropagation();
				$('.ys-select').toggleClass('active');
				// that.el.toggleClass('active');
			});
			$(document).click(function () {
				$('.ys-select').removeClass('active');
			});
		},
		change: function (callBack) {
			var that = this;
			that.el.on('click', '.select-dropdown li', function () {
				$(this).addClass('active').siblings().removeClass('active');
				that.span.html($(this).text());
				$('.ys-select').removeClass('active');
				callBack && callBack.call(this, that.span, $(this));
			});
		},
		getSpan: function () {
			return this.span;
		},
		// 可多选
		changeArr: function (callback) {
			var that = this;
			// var htmlArr  = []
			// var htmlValue = []
			that.el.on('click', '.select-dropdown li', function () {
				var htmlArr = []
				var htmlValue = []
				console.log(this)
				htmlValue.push($(this).text())
				htmlValue.forEach(function (v, i) {
					console.log(v)
					htmlArr.push('<div class="tag-label">')
					htmlArr.push('<span clas>' + v + '</span>')
					htmlArr.push('<i class="tag-label-remove ion-ios-close-empty"></i>')
					htmlArr.push('</div>')
				})
				//   htmlArr.push($(this).text())
				$(".select-val").append(htmlArr.join(""))
			});
		},
		delArr: function (callback) {
			var that = this;
			that.el.on('click', '.tag-label-remove', function (event) {
				event.stopPropagation();
				$('.ys-select').removeClass('active');
				$(this).parents(".tag-label").remove()
			})
		}
	}
	//  自定义可多选下拉框
	function DefinedSelectArr(el) {

	}
	DefinedSelectArr.prototype = {

	}
	//拖动替换
	function DragReplace($container, options) {
		this.$container = $container;
		this.$container.addClass('drag-disabled-select')
		var defaults = {
			childClass: '.drag', //被拖动的元素类名
			draggable: true, //可拖动性,默认true
			callbacks: {
				beforeDragstart: null,
				beforeDrop: null,
				afterDrop: null
			}
		}
		this.config = $.extend({}, defaults, options);
		this.init();
	}
	DragReplace.prototype = {
		constructor: DragReplace,
		init: function () {
			this.dragEvents();
		},
		dragEvents: function () {
			var that = this;
			var isDown = false,
				$dragItem = null,
				$targetItem = null,
				startX = 0,
				startY = 0,
				offsetLeft = 0,
				offsetTop = 0;

			window.addEventListener('mousedown', function (ev) {
				var $target = $(ev.srcElement || ev.target);
				$dragItem = $target.hasClass(that.config.childClass.slice(1)) ? $target : $target.parents(that.config.childClass);

				//拖动开始前的回调函数,如果有该函数,并且返回false则不再继续拖动
				if (that.config.callbacks.beforeDragstart && that.config.callbacks.beforeDragstart.call(this, $dragItem) === false) return false;

				//是否可拖动
				if (!that.config.draggable) return false;

				isDown = true;
				startX = ev.clientX;
				startY = ev.clientY;

				offsetLeft = $dragItem.offset().left;
				offsetTop = $dragItem.offset().top;

				that.$container.find(that.config.childClass).removeClass('active');
				$dragItem.addClass('active');

			}, false);

			window.addEventListener('mousemove', function (ev) {
				if (!isDown) return;
				var currentX = ev.clientX,
					currentY = ev.clientY;
				var left = parseInt($dragItem.css('left')),
					top = parseInt($dragItem.css('top'));
				$dragItem.css({
					left: left + (currentX - startX),
					top: top + (currentY - startY)
				})
				startX = currentX;
				startY = currentY;
			}, false);

			window.addEventListener('mouseup', function (ev) {
				var $allItem = that.$container.find(that.config.childClass + ':not([class*=active])');
				$allItem.each(function (index, item) {
					var $item = $(this),
						left = $item.offset().left,
						right = $item.offset().left + $item.outerWidth(),
						top = $item.offset().top,
						bottom = $item.offset().top + $item.outerHeight();
					if (startX > left && startX < right && startY > top && startY < bottom) {

						//拖动放下前的回调函数,根据返回的结果来决定是否继续操作
						if (that.config.callbacks.beforeDrop && that.config.callbacks.beforeDrop.call(this, $dragItem, $item) === false) return false;

						$targetItem = $item;
						//假装移动到目标节点上面
						$dragItem.animate({
							left: left - offsetLeft,
							top: top - offsetTop
						}, 300, function () {
							$dragItem.removeClass('active').removeAttr('style');

							//创建临时节点用于占位
							var $tem = $('<i></i>');
							//将拖动节点替换为临时节点
							$dragItem.replaceWith($tem);

							//将目标节点替换为拖动节点
							$targetItem.replaceWith($dragItem);

							//将临时节点替换为目标节点
							$tem.replaceWith($targetItem);

							callBack()
						});
						return false;
					}
				});
				if (!$targetItem) {
					var x = $dragItem.offset().left,
						y = $dragItem.offset().top,
						time = Math.sqrt(x * x + y * y) / 1.5;
					$dragItem.animate({
						left: 0,
						top: 0
					}, time, function () {
						$dragItem.removeClass('active').removeAttr('style');
						callBack()
					});
				}

			}, false);

			function callBack() {
				isDown = false,
					$dragItem = null,
					$targetItem = null,
					startX = 0,
					startY = 0,
					offsetLeft = 0,
					offsetTop = 0;
				//拖动放下后的回调函数
				that.config.callbacks.afterDrop && that.config.callbacks.afterDrop.call(that);

			}

		}
	}
	$.fn.extend({
		dragReplace: function (options) {
			return $(this).each(function () {
				new DragReplace($(this), options);
			})
		}
	})
	//拖动
	function Drag(containerId, dragItemClassName, options) {
		this.id = containerId;
		this.dragItemClassName = dragItemClassName;

		var defaults = {
			draggable: true, //可拖动性,默认true
			callbacks: {
				beforeDragstart: null,
				beforeDrop: null,
				afterDrop: null
			}
		}
		this.config = $.extend({}, defaults, options);
		this.init();
	}
	Drag.prototype = {
		constructor: Drag,
		init: function () {
			this.dragEvents();
		},
		on: function (boole) {
			this.config.draggable = boole;
		},
		dragEvents: function () {

			var that = this;
			//			$('#' + this.id).css('position', 'relative');
			//			var isBoolean = false,
			//				container = document.getElementById(that.id),
			//				$dragItem = null,
			//				startX = 0,
			//				startY = 0;
			//
			//			container.addEventListener('mousedown', function(ev) {
			//				isBoolean = true;
			//				startX = ev.clientX;
			//				startY = ev.clientY;
			//				var $target = $(ev.srcElement || ev.target);
			//				$dragItem = $target.hasClass(that.dragItemClassName) ? $target : $target.parents('.' + that.dragItemClassName);
			//				$dragItem.css('z-index', '10');
			//
			//			}, false);
			//
			//			window.addEventListener('mousemove', function(ev) {
			//				if(!isBoolean) return;
			//				var currentX = ev.clientX,
			//					currentY = ev.clientY;
			//				var left = parseInt($dragItem.css('left')),
			//					top = parseInt($dragItem.css('top'));
			//				$dragItem.css({
			//					'left': left + (currentX - startX) + 'px',
			//					'top': top + (currentY - startY) + 'px'
			//				})
			//				startX = currentX;
			//				startY = currentY;
			//			}, false);
			//
			//			window.addEventListener('mouseup', function(ev) {
			//				isBoolean = false;
			//				$dragItem.css('z-index', '0');
			//				$dragItem = null;
			//			}, false);

			//拖动项
			var $dragItem = null;

			//给所有可拖动项添加事件
			var items = $('#' + that.id).addClass('ys-drag').find('.' + that.dragItemClassName);
			items.each(function xxx(index, item) {
				item.classList.add('drag-item');
				item.setAttribute('draggable', true);
				item.ondragstart = function (ev) {
					// console.log('开始', ev);
					$dragItem = $(ev.target || ev.srcElement).hasClass('drag-item') ? $(ev.target || ev.srcElement) : $(ev.target || ev.srcElement).parents('.drag-item');
					//拖动开始前的回调函数,根据返回的结果来决定是否继续拖动
					if (that.config.callbacks.beforeDragstart && that.config.callbacks.beforeDragstart.call(this, $dragItem) === false) return false;

					//是否可拖动
					if (!that.config.draggable) return false;
				}
				item.ondragover = function (ev) {
					ev.preventDefault();
				}
				item.ondrop = function (ev) {
					// console.log('结束', ev)
					ev.preventDefault();

					if (!$dragItem) return false;

					//目标节点
					var $targetItem = $(ev.target || ev.srcElement).hasClass('drag-item') ? $(ev.target || ev.srcElement) : $(ev.target || ev.srcElement).parents('.drag-item');

					//放置位置是否属于同一个容器内
					if ($targetItem.parents('.ys-drag').attr('id') !== that.id) return false;

					//拖动放下前的回调函数,根据返回的结果来决定是否继续操作
					if (that.config.callbacks.beforeDrop && that.config.callbacks.beforeDrop.call(this, $dragItem, $targetItem) === false) return false;

					//创建临时节点用于占位
					var $tem = $('<div></div>');

					//将拖动节点替换为临时节点
					$dragItem.replaceWith($tem);

					console.log($tem)
					//将目标节点替换为拖动节点
					$targetItem.replaceWith($dragItem).fadeIn(500).removeAttr('style');

					//将临时节点替换为目标节点
					$tem.replaceWith($targetItem)

					//拖动放下后的回调函数
					that.config.callbacks.afterDrop && that.config.callbacks.afterDrop.call(this);
				}
			});

		}

	}
	//模糊搜索
	function ysFuzzy(wrap, data) {
		this.wrap = wrap;
		this.data = data;
		this.init();
	}
	ysFuzzy.prototype = {
		constructor: ysFuzzy,
		init: function () {
			var that = this
			that.moren()
			$(that.wrap + ' .FuzzySearch .fuzzyInput').val('') //每次初始化给他清空掉
			$(that.wrap + " .FuzzySearch .fuzzyInput , " + that.wrap + " .FuzzySearch i").on('click', function (ev) {
				ev.stopPropagation();
				$(that.wrap + " .ULwrap").slideDown(10)
			});

			$('html').on('click', that.wrap + ' .FuzzySearch .query-list li', function () { //需要动态绑定
				console.log($(that.wrap + ' .FuzzySearch .fuzzyInput'))

				$(that.wrap + ' .FuzzySearch .fuzzyInput').val($(this).html()).trigger("input")
				$(that.wrap + ' .FuzzySearch .fuzzyInput').attr("data-fkcode", $(this).attr("data-fkcode"))
			});
			$(":not(" + that.wrap + " .FuzzySearch .fuzzyInput , " + that.wrap + " .FuzzySearch  i)").bind('click', function (event) {
				$(that.wrap + " .ULwrap").slideUp(10)
			});
			$(that.wrap + ' .fuzzyInput').on('input', function () {
				uldata = that.data.filter(checkout);

				function checkout(xx) { //只执行了一次
					var val = $(that.wrap + ' .fuzzyInput').val()
					var reg = new RegExp(val)
					// console.log(xx);
					// console.log(reg.test(xx)); //可以看到已经在我打完字之前立马执行完了
					return reg.test(xx.cardCode);
				}

				var ulhtml = uldata.length == 0 ? '无记录' : ''
				$.each(uldata, function (i, ele) {
					ulhtml += '<li data-fkcode=' + ele.cardFkCode + '>' + ele.cardCode + '</li>'
					if ($(that.wrap + ' .FuzzySearch .fuzzyInput').val() == ele.cardCode) {
						$(that.wrap + ' .FuzzySearch .fuzzyInput').attr("data-fkcode", ele.cardFkCode)
					} else if ($(that.wrap + ' .FuzzySearch .fuzzyInput').val() != ele.cardCode) {
						$(that.wrap + ' .FuzzySearch .fuzzyInput').attr("data-fkcode", '')
					}

				})
				$(that.wrap + ' .query-list').html(ulhtml)
			})
		},
		moren: function () {
			var that = this
			var ulhtml = that.data.length == 0 ? '无记录' : ''
			$.each(that.data, function (i, ele) {
				ulhtml += '<li data-fkcode=' + ele.cardFkCode + '>' + ele.cardCode + '</li>'
			})
			$(that.wrap + ' .query-list').html(ulhtml)
			// console.log(that.data);
		},
		destroyed: function () {
			var that = this
			that.data = []
			$(that.wrap + ' .query-list').html("")
			$(that.wrap + " .ULwrap").css({
				"display": 'none'
			})
			$(that.wrap + " .FuzzySearch .fuzzyInput , " + that.wrap + " .FuzzySearch i").off('click')
			$(that.wrap + ' .fuzzyInput').off('input')

		},
	}

	//多选下拉框
	//下拉框插件
	function ysMultiSelect(content, data) {
		this.content = content;
		this.data = data;
		this.init();
	}
	ysMultiSelect.prototype = {
		constructor: ysMultiSelect,
		init: function () {
			var _this = this
			//下拉放下收起动画
			console.log("下拉多选");
			console.log(_this.content);
			$("body").bind('click', function (event) {
				$(_this.content + " .abc").slideUp(10)
				//如果是一下几种类名（加个统一类名），显示，如果其他，隐藏
				$(_this.content + ' .slidetoggle').css({
					border: "1px solid #cfdae5"
				})
			});
			$(_this.content + ' .input').click(function (ev) {
				console.log(222);
				ev.stopPropagation()
				$(_this.content + " .wrap").slideToggle(10)
				$(this).css({
					border: "1px solid #0493f0"
				})
			})
			$(_this.content + ' .wrap').click(function (ev) {
				ev.stopPropagation()
				$(this).css({
					border: "1px solid #0493f0"
				})
			})
			//数据导入组成下拉布局	
			$(_this.content + " .wrap").html("").append(
				` <div class="ys-checkbox all">
                                  <input type="checkbox" id="` + _this.content + `all">
                                  <label class="my-xl" data-code="1201" for="` + _this.content + `all">全选</label>
                                 </div>`)

			$.each(_this.data, function (i, ele) {
				$(_this.content + " .wrap").append(
					`<div class="ys-checkbox">
                                        <input type="checkbox" id="` + _this.content + i + `">
                                         <label class="my-xl" data-code="` + ele.code + `" for="` + _this.content + i + `">` + ele.name + `</label>
                                        </div>`)
			})
			//选中选项，全选的动作逻辑
			if (JSON.stringify(_this.data) != "[]") {
				$(_this.content + " .all input").click(function () {
					$(_this.content + " .ys-checkbox input").prop("checked", $(this).prop("checked"))
				})
				$(_this.content + "  .ys-checkbox:not(.all) input").click(function () {
					if ($(_this.content + " .ys-checkbox:not(.all) input:checked").length == $(_this.content + " .ys-checkbox:not(.all)").length) {
						$(_this.content + " .all input").prop("checked", true)
					} else {
						$(_this.content + " .all input").prop("checked", false)
					}
				})
				$(_this.content + " .ys-checkbox input").click(function (ev) {
					ev.stopPropagation();
					var name = []
					var code = []
					$.each($(_this.content + " .ys-checkbox:not(.all) input:checked+label"), function (i, ele) {
						name.push($(ele).html())
						code.push($(ele).attr("data-code"))
					})
					$(_this.content + " .input").val(name)
					$(_this.content + " .input").attr("data-code", code)
				})
			} else {
				$(_this.content + " .input").val("")
				$(_this.content + " .input").attr("data-code", undefined)
				$(_this.content + " .wrap").html("无数据")
			}

		},
		destroyed: function () {
			var _this = this
			_this.data = []
			$(_this.content + ' .input').off("click")
			$(_this.content + ' .wrap').off("click")
			$(_this.content + " .wrap").html("")
			$(_this.content + " .input").attr("data-code", undefined)
			$(_this.content + " .ys-checkbox input").off("click")
			$(_this.content + " .all input").off("click")
			$(_this.content + "  .ys-checkbox:not(.all) input").off("click")
			$(_this.content + " .ys-checkbox input").off("click")
			$(_this.content + " .input").val("")

		}

	}

	//时分秒选择器
	function TimeSelect($el, options) {
		this.el = $el.eq(0);
		var defaults = {
			//value: new Date(-1000 * 60 * 60 * 8),
			type: [true, true, true]
		}
		this.config = $.extend({}, defaults, options);
		this.init();
	}
	TimeSelect.prototype = {
		constructor: TimeSelect,
		init: function () {
			var that = this;
			var defaultVal = this.el.attr('data-val') || '00:00:00';
			//设置节点
			var html = '';
			$.each(that.config.type, function (i, v) {
				if (v) {
					var type,
						val;
					if (i == 0) {
						type = '时';
						val = defaultVal.split(":")[0];
					} else if (i == 1) {
						type = '分';
						val = defaultVal.split(":")[1];
					} else {
						type = '秒'
						val = defaultVal.split(":")[2];
					}
					html += `<span class="time-select">${val}</span><span class="time-text">${type}</span>`;
				}
			});
			//插入节点
			that.el.html(html);
			//设置
			that.getTime();
			//添加事件
			that.clickEvents();
		},
		//点击事件
		clickEvents: function () {
			var that = this;
			var length,
				$span,
				$next;

			that.el.find('.time-select').click(function (ev) {
				ev.stopPropagation();
				//设置样式
				$('.ys-time-select .time-select').removeClass('active');
				$(this).toggleClass('active');

				//设置定位的ul选择列表				
				$span = $(this);
				$next = $(this).next()
				var ul = '<ul class="ys-time-select-ul">';
				length = $next.text() == '时' ? 24 : 60;
				for (var i = 0; i < length; i++) {
					var val = i < 10 ? '0' + i : i
					ul += `<li class="${$span.text() == val ? 'active' : ''}">${i < 10 ? '0' + i : i}</li>`;
				}
				ul += '</ul>';
				//插入选择列表
				$('.ys-time-select-ul').remove();
				$('body').append($(ul));

				//在指定的位置显示列表
				$('.ys-time-select-ul').hide().fadeIn(200).css({
					top: $(this).outerHeight() + $span.offset().top,
					left: $span.offset().left
				});

				//列表单击事件
				$('.ys-time-select-ul').on('click', 'li', function (ev) {
					ev.stopPropagation();
					$span.text($(this).text());

					that.getTime(); //设置数据
					$('.ys-time-select-ul').fadeOut(300, function () {
						$(this).remove();
					})
				})
			});
			$(document).click(function () {
				$('.ys-time-select .time-select').removeClass('active');
				$('.ys-time-select-ul').remove();
			});
		},
		getTime: function () {
			var nodes = this.el.find('.time-select');
			var time = '';
			nodes.each(function (i, span) {
				time += $(span).text() + (i + 1 < nodes.length ? ':' : '');
			});
			this.el.attr('data-val', time);
			return time;
		}
	}
	/**
	 * @param zTreeId the ztree id used to get the ztree object
	 * @param searchField selector of your input for fuzzy search
	 * @param isHighLight whether highlight the match words, default true
	 * @param isExpand whether to expand the node, default false
	 */
	function fuzzySearch(zTreeId, searchField, isHighLight, isExpand) {
		var zTreeObj = $.fn.zTree.getZTreeObj(zTreeId); //get the ztree object by ztree id
		if (!zTreeObj) {
			alter("fail to get ztree object");
		}
		var nameKey = zTreeObj.setting.data.key.name; //get the key of the node name
		isHighLight = isHighLight === false ? false : true; //default true, only use false to disable highlight
		isExpand = isExpand ? true : false; // not to expand in default
		zTreeObj.setting.view.nameIsHTML = isHighLight; //allow use html in node name for highlight use

		var metaChar = '[\\[\\]\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)]'; //js meta characters
		var rexMeta = new RegExp(metaChar, 'gi'); //regular expression to match meta characters

		// keywords filter function 
		function ztreeFilter(zTreeObj, _keywords, callBackFunc) {
			if (!_keywords) {
				_keywords = ''; //default blank for _keywords 
			}

			// function to find the matching node
			function filterFunc(node) {
				if (node && node.oldname && node.oldname.length > 0) {
					node[nameKey] = node.oldname; //recover oldname of the node if exist
				}
				zTreeObj.updateNode(node); //update node to for modifications take effect
				if (_keywords.length == 0) {
					//return true to show all nodes if the keyword is blank
					zTreeObj.showNode(node);
					zTreeObj.expandNode(node, isExpand);
					return true;
				}
				//transform node name and keywords to lowercase
				if (node[nameKey] && node[nameKey].toLowerCase().indexOf(_keywords.toLowerCase()) != -1) {
					if (isHighLight) { //highlight process
						//a new variable 'newKeywords' created to store the keywords information 
						//keep the parameter '_keywords' as initial and it will be used in next node
						//process the meta characters in _keywords thus the RegExp can be correctly used in str.replace
						var newKeywords = _keywords.replace(rexMeta, function (matchStr) {
							//add escape character before meta characters
							return '\\' + matchStr;
						});
						node.oldname = node[nameKey]; //store the old name  
						var rexGlobal = new RegExp(newKeywords, 'gi'); //'g' for global,'i' for ignore case
						//use replace(RegExp,replacement) since replace(/substr/g,replacement) cannot be used here
						node[nameKey] = node.oldname.replace(rexGlobal, function (originalText) {
							//highlight the matching words in node name
							var highLightText =
								'<span style="color: #0493f0;background-color:#ecf6fd;">' +
								originalText +
								'</span>';
							return highLightText;
						});
						zTreeObj.updateNode(node); //update node for modifications take effect
					}
					zTreeObj.showNode(node); //show node with matching keywords
					return true; //return true and show this node
				}

				zTreeObj.hideNode(node); // hide node that not matched
				return false; //return false for node not matched
			}

			var nodesShow = zTreeObj.getNodesByFilter(filterFunc); //get all nodes that would be shown
			processShowNodes(nodesShow, _keywords); //nodes should be reprocessed to show correctly
		}

		/**
		 * reprocess of nodes before showing
		 */
		function processShowNodes(nodesShow, _keywords) {
			if (nodesShow && nodesShow.length > 0) {
				//process the ancient nodes if _keywords is not blank
				if (_keywords.length > 0) {
					$.each(nodesShow, function (n, obj) {
						var pathOfOne = obj.getPath(); //get all the ancient nodes including current node
						if (pathOfOne && pathOfOne.length > 0) {
							//i < pathOfOne.length-1 process every node in path except self
							for (var i = 0; i < pathOfOne.length - 1; i++) {
								zTreeObj.showNode(pathOfOne[i]); //show node 
								zTreeObj.expandNode(pathOfOne[i], true); //expand node
							}
						}
					});
				} else { //show all nodes when _keywords is blank and expand the root nodes
					var rootNodes = zTreeObj.getNodesByParam('level', '0'); //get all root nodes
					$.each(rootNodes, function (n, obj) {
						zTreeObj.expandNode(obj, true); //expand all root nodes
					});
				}
			}
		}

		//listen to change in input element
		$(searchField).bind('input propertychange', function () {
			var _keywords = $(this).val();
			searchNodeLazy(_keywords); //call lazy load
		});

		var timeoutId = null;
		// excute lazy load once after input change, the last pending task will be cancled  
		function searchNodeLazy(_keywords) {
			if (timeoutId) {
				//clear pending task
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(function () {
				ztreeFilter(zTreeObj, _keywords); //lazy load ztreeFilter function 
				$(searchField).focus(); //focus input field again after filtering
			}, 500);
		}
	}
	//默认方法
	$(function () {

		//关闭自动填充历史信息
		$('input').each(function () {
			$(this).attr('autocomplete', "off")
		})

		//开关方法
		$('html').on('click', '.ys-switch', function () {
			var boole = $(this).hasClass('ys-active');
			$(this).children().animate({
				left: boole ? '20px' : '0px'
			}, 200);
			$(this).toggleClass('ys-active');
		});

		//关闭信息提示
		$('html').on('click', '.closeAlert', function () {
			$(this).parents('.ys-alert').remove();
		});

		//tab切换页
		$('html').on('click', '.ys-tab-base>.nav-tabs>li', function (ev) {
			ev.preventDefault();
			$(this).addClass('active').siblings('li').removeClass('active');
			$($(this).children('a').attr('href')).addClass('active').siblings('.tab-pane').removeClass('active');
		});

		//多条件筛选切换
		$('html').on('click', '.ys-condition-query .ys-condition-item li', function () {
			$(this).addClass('active').siblings('li').removeClass('active');
		});

		//基础模糊查询
		$('html').on('focus', '.ys-base-query .ys-form-control', function () {
			$(this).siblings('.query-list').addClass('active');
		});
		$('html').on('blur', '.ys-base-query .ys-form-control', function () {
			$(this).siblings('.query-list').removeClass('active');
		});
		$('html').on('keyup', '.ys-base-query .ys-form-control', function (ev) {
			$(this).siblings('.query-list').addClass('active');
			var ul = $(this).siblings('.query-list');
			if (ul.children('li').length > 0) { //有列表 
				switch (ev.keyCode) {
					case 13: //回车
						if (ul.children('.active').length > 0) {
							$(this).val(ul.children('.active').text());
							$(this).siblings('.query-list').removeClass('active');
						}
						break;
					case 38: //上键
						if (ul.children('.active').length > 0) {
							if (ul.children('.active').prev('li').length > 0) {
								ul.children('.active').removeClass('active').prev('li').addClass('active');
							} else {
								ul.children('.active').removeClass('active').siblings(':last-child').addClass('active');
							}
						} else {
							ul.children(':last-child').addClass('active');
						}
						break;
					case 40: //下键
						if (ul.children('.active').length > 0) {
							if (ul.children('.active').next('li').length > 0) {
								ul.children('.active').removeClass('active').next('li').addClass('active');
							} else {
								ul.children('.active').removeClass('active').siblings(':first-child').addClass('active');
							}
						} else {
							ul.children(':first-child').addClass('active');
						}
						break;
					default:
						break;
				}
			}
		});
		//人员标签
		$('html').on('click', '.ys-btnpeople', function (ev) {
			$(this).addClass('active').siblings('button').removeClass('active');
		});
	})

})(jQuery, window, document);