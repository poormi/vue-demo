import $ from 'jquery'

"use strict";
const defaults = {
		split: '/',
		url: '',
		disabled: false,
		data: [],
		showTop: false,
		titledLength: 0,
		async: false,
		textName: 'name',
		valName: 'code',
		onLoad: function() {

		},
		onSelect: function() {},
		onClose: function() {

		}
	},
	areaSelect = function(selector, context) {
		this.init.call(this, selector, context); //替换this对象
		return this;
	},
	_sClass = 'area-select';

areaSelect.prototype = {
	constructor: areaSelect,
	init: function(selector, context) {
		var that = this,
			options = that.options = $.extend({}, defaults, context);
		that.selector = selector;
		that.disabled = options.disabled;
		if (!!options.disabled) that.selector.addClass('disabled');
		that.selectedCodes = [];
		//优先使用设置的data属性
		if (options.data.length) {
			_init.call(that, selector, options.data);
			_bindEvents.call(that, selector);
			options.onLoad();
		} else {
			if ($.trim(options.url) !== '') {
				$.when(_request.call(that, selector)).done(function() {
					_bindEvents.call(that, selector);
					options.onLoad();
				});
			} else console.log('Data error: there is no data here.');
		}
		return that;
	},
	getSelectedCodes: function() {
		return this.selectedCodes;
	},
	setDisabled: function(disabled) {
		if (disabled == void 0) this.disabled = !this.disabled, this.selector.toggleClass('disabled');
		else this.disabled = disabled, !disabled ? this.selector.removeClass('disabled') : this.selector.addClass('disabled');
	},
	setSelected: function(index, tabIndex) {
		var _i = index == void 0 ? 0 : index,
			_ti = tabIndex == void 0 ? 0 : tabIndex;
		this.$content.find("ul").eq(_ti).children().eq(_i).mousedown();
		this.close();
	},
	close: function() {
		this.$head.mousedown();
		this.options.onClose(this.selectedCodes);
	},
	getSelectedText: function() {
		return this.$head.text();
	}
};


function _init(selector, source) {
	var $v = $.create('div', 'select-data'),
		data = source,
		options = this.options;
	selector.append($v);
	if (data.length) {
		var $w = $.create('div', 'select-wrap clear'),
			$u = [];
		if (!!data[0].data) {
			$u = $.create('ul', 'select-tabs');
			$w.append($u);
		} else $w.addClass('single');
		selector.append($w);

		//初始化结果区域（默认第一条数据）
		var def = data[0];
		$v.attr('title', def[options.textName]);
		_initDefault($v, $u, def);
		this.$tab = $u;
		this.$head = $v;
		//默认首个选项激活状态
		if ($u.length)
			$u.children().eq(0).addClass('active');

		//初始化展开的选择区域
		var $c = $.create('div', 'select-content clear');
		$w.append($c);
		this.$content = $c;
		_initContent($c, source);
		//默认显示首个选择区域
		$c.children().eq(0).show();
	}
	$v.append('<i class="triangle"></i>');

	function _initDefault(child1, child2, def) {
		var _cl = child1.children().length,
			$s = $('<span>'),
			$li = $('<li>'),
			_h = ['<a href="javascript:"><span>', def[options.textName], '</span><i class="triangle"> </i>', '</a>'];
		if (options.showTop) {
			if (!child1.children().length)
				$s.html(def[options.textName]),
				$s.data('code', def[options.valName]),
				child1.append($s);
		} else {
			if (!options.titledLength || _cl < options.titledLength - 1 || !def.data || !def.data.length) {
				$s.html(def[options.textName]);
				$s.data('code', def[options.valName]);
				child1.append($s);
			} else if (_cl == options.titledLength - 1) {
				child1.append($s.html('...'));
			}
		}
		if (child2.length) {
			$li.data('code', def[options.valName]);
			$li.data('index', 0);
			$li.attr('data-index', child2.children().length);
			child2.append($li.append(_h.join('')));
		}
		if (!!def.data && def.data.length) {
			if (!options.showTop && (_cl < options.titledLength || !options.titledLength)) child1.append(options.split);
			_initDefault(child1, child2, def.data[0]);
		}

	}

	function _initContent(selector, source) {
		var $ul = $.create('ul');
		$ul.data('index', selector.children().length);
		$ul.attr('data-index', selector.children().length);
		selector.append($ul);
		$.each(source, function(i, item) {
			var $li = $.create('li'),
				_h = ['<a href="javascript:">', item[options.textName], '</a>'];
			$li.append(_h.join(''));
			$li.addClass('ell').attr('title', item[options.textName]);
			if (i === 0) $li.addClass('selected');
			$li.data('code', item[options.valName]);
			$li.data('index', i);
			$li.data('data', item.data);
			$ul.append($li);

		});
		if (!!source[0].data && source[0].data.length) {
			_initContent(selector, source[0].data);
		}
	}
}

function _request(selector) {
	var dtd = $.Deferred(),
		_self = this,
		options = _self.options;
	$.get(options.url).done(function(data) {
		if (typeof data == "string") data = eval("(" + data + ")");
		if (data.flag != void 0 && (data.flag == "true" || data.flag === true)) {
			options.data = data.data;
			_init.call(_self, selector, options.data);
		} else
			console.log('Request error:please check the network and make sure the url is correct.');
		dtd.resolve();
	});
	return dtd.promise();
}

function _bindEvents(selector) {
	//点击弹出(隐藏)选择部分
	var _self = this,
		_click = 'mousedown',
		_expand = 'expand',
		$head = selector.children();
	_eventHandler($head.eq(0), _click, _ctrlClick);
	//点击切换区域选项
	var $ctrl = $head.eq(1).children(),
		$tabs = $ctrl.eq(0).find('li');
	if ($ctrl.length == 1) {
		_tabsClick = _liClick;
	}
	_eventHandler($tabs, _click, _tabsClick);
	//点击选择具体的区域
	var $lis = $ctrl.eq(1).find('li');
	_eventHandler($lis, _click, _liClick)

	_eventHandler($head.eq(1), _click, function(e) {
		e.stopPropagation();
	});

	_eventHandler($(document), _click, _bodyClick);

	function _ctrlClick() {
		if (!!_self.disabled) return;
		var $e = $('.' + _expand + '.' + _sClass),
			$p = $(this).parent();
		if ($p.hasClass(_expand)) $p.removeClass(_expand);
		else {
			if ($e.length)
				$e.removeClass(_expand);
			$p.addClass(_expand);
		}
	}

	function _tabsClick() {
		$ctrl.find('li.active').removeClass('active');
		var _index = $(this).attr('data-index'),
			$all = $(this).parent().next().find('ul');
		$(this).toggleClass('active');
		$all.hide();
		$all.eq(_index).show();
	}

	function _liClick() {
		var $parent = $(this).parent(),
			_index = $parent.data('index'), //当前tab索引
			_currentCode = $(this).data('code');
		$parent.children().removeClass('selected');
		$(this).addClass('selected');

		if (_index == 0 || $(this).data('index') > 0)
			_setSelectCodes(_index, {
				id: _currentCode,
				name: $(this).text()
			});
		else {
			_self.selectedCodes.splice(_index, _self.selectedCodes.length - _index);
		}


		//回调自定义点击事件
		var _return = _self.options.onSelect($(this).data('index'), {
			id: _currentCode,
			name: $(this).text()
		}, $(this));

		if (_self.options.async && typeof _return === 'object') {
			var that = this;
			_return.done(function() {
				done.call(that);
			});
		} else done.call(this);

		function done() {
			//选项不存在
			if ($ctrl.length == 1) {
				$head.eq(0).find('span').text($(this).text()).end().data('index', $(this).data('index')).attr('title', $(this).text());
			} else {
				//设置选项
				var $tab = $parent.parent().prev().children().eq(_index);
				$tab.find('span').text($(this).text()).end().data('index', $(this).data('index')); //data('index')记录选中项

				if ($tab.next().length) {
					var _h = true,
						_d = $(this).data('data'),
						$nTab = $tab.next();
					_render($parent.next(), _d);
					if (!_return || typeof _return == "object")
						$nTab.mousedown()
					else
						_h = false;
				}
				if (!_h) {
					//设置主文本框
					var vArr = [],
						$spans = $head.eq(0).find('span'),
						$ts = $ctrl.eq(0).children(),
						_op = _self.options;

					//_self.selectedCodes = [];
					$.each($ts, function(i, elm) {
						if (!_op.showTop || $(elm).data('index') > 0 || $(elm).attr('data-index') == 0) {
							vArr.push($.trim($(elm).text()));
							/*_self.selectedCodes.push({
								id: $(elm).data('code'),
								name: $.trim($(elm).text())
							});*/
						}
						if (_op.showTop && $(elm).hasClass('active')) return false;
					});
					$head.eq(0).attr('title', vArr.join(_op.split));
					if ($spans.length > vArr.length) {
						$.each($spans, function(i, elm) {
							if (i < vArr.length) $(elm).text(vArr[i]);
							else $(elm.previousSibling).remove(), $(elm).remove();
						});
					} else {
						$.each(vArr, function(i, v) {
							var elm, $p = $head.eq(0);
							if (i < $spans.length) {
								elm = $spans[i];
								if ($(elm).text() === '...') {
									$(elm).next().text(vArr[vArr.length - 1]);
									return false;
								} else {
									if (i === _op.titledLength - 1 && i < vArr.length - 1) {
										$(elm).text('...');
										$p.append(_op.split).append('<span>' + vArr[vArr.length - 1] + '</span>');
										return false;
									}
									$(elm).text(v);
								}
							} else {
								if (!_op.showTop || _op.titledLength > i || i === vArr.length - 1) {
									elm = $('<span></span>');
									if (!_op.showTop || $p.find('span').length < _op.titledLength - 1 || i === vArr.length - 1) elm.text(v), $p.append(_op.split), $p.append(elm);
									else if (i === _op.titledLength - 1) elm.text('...'), $p.append(_op.split), $p.append(elm);
								}
							}
						})
					}
				}
			}
			if (!$parent.next().length || !!_return && typeof _return == "boolean") {
				//末个选项点击后触发关闭
				$head.mousedown();
				//回调自定义关闭事件
				_self.options.onClose(_self.selectedCodes);
			}
		}
	}

	function _bodyClick(evt) {
		var _target = evt.srcElement || evt.target;
		if (selector.hasClass(_expand) && !$(_target).closest('.' + $head[0].className).length) {
			selector.removeClass(_expand);
		}
	}

	function _render(selector, source) {
		var $lis = selector.children();
		$lis.removeClass('selected');
		$.each(source, function(i, _) {
			var $li = $lis.eq(i);
			if ($li.length) {
				$li.children().text(_[options.textName]).attr('title', _[options.textName]);
			} else {
				$li = $('<li></li>');
				var $a = $('<a href="javascript:""></a>');
				$li.addClass('ell');
				$li.data('index', $lis.length);
				$a.text(_[options.textName]).attr('title', _[options.textName]);
				$li.append($a);
				selector.append($li);
				_eventHandler($li, _click, _liClick);
			}
			if (i == 0) $li.addClass('selected');
			$li.data('code', _[options.valName]);
			$li.data('data', _.data);
		});
		if (source.length < $lis.length) {
			for (var i = $lis.length - 1; i >= source.length; i--) {
				$lis[i].remove();
			}
		}
		if (!!source && source.length) {
			var _i = selector.data('index'),
				$tab = selector.parent().prev().children().eq(_i);
			$tab.find('span').text(source[0][options.textName]).end().data('index', 0); //还原选中项;

			if (selector.next().length && !!source[0].data) {
				var _d = source[0].data;
				_render(selector.next(), _d);
			}
		}
	}


	function _setSelectCodes(_index, _currentCode) {
		var _len = _self.selectedCodes.length;
		//保存当前选择区域编码
		if (_len > _index) {
			_self.selectedCodes[_index] = _currentCode;
			_self.selectedCodes.splice(_index + 1, _self.selectedCodes.length - _index); //清空后面的选项
		} else if (_len == _index) {
			_self.selectedCodes.push(_currentCode);
		}
	}
}

function _eventHandler(selector, type, fn) {
	selector.on(type, fn);
}

$.create = function(elm, className) {
	return $(document.createElement(elm)).addClass(className);
};

export default function() {
	var _self = this,
		args = Array.prototype.slice.call(arguments);
	if (this.length) {
		_self.addClass(_sClass);
		_self.empty();
		_self.parent().css('position', 'relative');
		return new areaSelect(_self, args[0]);
	}
	return null
};