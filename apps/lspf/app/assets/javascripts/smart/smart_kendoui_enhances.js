
(function () {
    // kendo ui 配置国际化
    kendo.culture("zh-CN");

    if (!window.smart) {
        window.smart = {};
    }

    smart.kendoui = {};

    smart.kendoui.window = function (selector, options) {
        var config = $.extend(true, {
            width: "60%",
            height: "60%",
            actions: ["Maximize","Close"],
            visible: false,
            modal: true,
            content: ""
        }, options);


        return $(selector).kendoWindow(config).data('kendoWindow');
    };


    var _createDataSource = function (columns, options, pageable) {
        options = $.extend(true, {
            transport: {
                read: {
                    url: options.url,
                    dataType: "json"
                },
                parameterMap : function(data, type) {
                    if (type == "read") {
                        return $.extend(data, options.parameterMap||{});
                    }
                }
            },
            schema: {
                model: {
                    fields: _createFields(columns)
                }
            }
        }, options);

        if (pageable == false) {
            return new kendo.data.DataSource($.extend(true, {
                serverPaging: false
            }, options));
        } else {
            return new kendo.data.DataSource($.extend(true, {
                pageSize: 30,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                serverGrouping: false,
                schema: {
                    data: "items",
                    total: "total"
                }
            }, options));
        }
    };

    var _createFields = function (columns, options) {
        var fields = {};
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i],
                field = col.field,
                type = col.type;
            if (field) {
                fields[field] = {};
                if (type) {
                    fields[field].type = type;
                }
            }
        }
        return $.extend(true, fields, options);
    };

    var _createCommand = function (options) {
        var command = [];

        if (options.onEditClick) {
            command.push({
                name: "smart_edit",
                text: "<span class='k-icon k-edit' title='编辑'></span>",
                click: options.onEditClick
            });
        }

        if (options.onDelClick) {
            command.push({
                name: "smart_destroy",
                text: "<span class='k-icon k-delete' title='删除'></span>",
                click: options.onDelClick
            });
        }

        return { command: command, width: 75 }
    };

    smart.kendoui.filterMessages = {
        messages: {
            info: '请输入过滤条件：',
            selectValue: "请选择",
            and: "且",
            or: "或",
            filter: "过滤",
            clear: "清除过滤器"
        },
        operators: {
            string: {
                eq: "等于",
                neq: "不等于",
                contains: "包含",
                startswith: "开始于",
                doesnotcontain: "不包含",
                endswith: "结束于"
            },
            number: {
                eq: "等于",
                neq: "不等于",
                gte: "大于等于",
                gt: "大于",
                lte: "小于等于",
                lt: "小于"
            },
            date: {
                eq: "等于",
                neq: "不等于",
                gte: "起始于(包含)",
                gt: "起始于",
                lte: "结束于(包含)",
                lt: "结束于"
            },
            enums: {
                eq: "等于",
                neq: "不等于"
            }
        }
    };

    smart.kendoui.pageMessages = {
        previous: "上一页",
        next: "下一页",
        first: "第一页",
        last: "最后一页",
        display: " {0} - {1} /{2}条",
        empty: "无数据",
        page: "第",
        of: "页/ {0} 页",
        itemsPerPage: "条每页",
        refresh: '刷新'
    };

    smart.kendoui.grid = function (selector, options) {

        if (options.columns && options.dataSource) {

            options.dataSource = _createDataSource(options.columns, options.dataSource, options.pageable);

            if (options.command) options.columns.unshift(_createCommand(options.command));
        }

        if (options.editable) {
            options = $.extend(true, {
                edit: function (e) {
                    var $tr = e.container.parent("tr");
                    if (e.model.id && $tr.hasClass('s-row-del')) {
                        this.closeCell();
                    }
                },
                save: function (e) {
                    if (e.model.id && e.model.dirty) {
                        e.container.parent('tr').addClass('s-row-update');
                    }
                }
            }, options, {editable: {confirmation: false}} );
        }

        var config = $.extend(true, {
            editable: false,
            filterable: smart.kendoui.filterMessages,
            groupable: {
                messages: {
                    empty: "请将要分组的列表头拖动到这一行"
                }
            },
            height: 600,
            pageable: {
                pageSizes: [10 , 30 , 50 , 100 , 200],
                refresh: true,
                numeric: true,
                input: true,
                buttonCount: 10,
                messages: smart.kendoui.pageMessages
            },
            reorderable: true,
            resizable: true,
            selectable: "multiple",
            sortable: {
                mode: "multiple"
            }
        }, options);


        var grid = $(selector).kendoGrid(config).data('kendoGrid');
        grid.bindSmartEvents();

        return grid;
    };

    smart.kendoui.treeList = function (selector, options) {
        if (options.command) {
            //options.columns.push(_createCommand(options.command));
        }

        var config = options;

        return $(selector).kendoTreeList(config).data('kendoTreeList');
    };

    smart.kendoui.comboBox = function (selector, options) {
        var config = $.extend(true, {
            autoBind: false,
            placeholder: '--请选择--',
            filter: "contains",
            dataTextField: 'text',
            dataValueField: 'value'
        }, options);

        var comboBox = $(selector).kendoComboBox(config).data('kendoComboBox');

        smart.kendoui._removeSpanClass(selector);

        return comboBox;
    };

    smart.kendoui.dropDownList = function (selector, options) {
        var config = $.extend(true, {
            autoBind: false,
            optionLabel: '--请选择--',
            dataTextField: 'text',
            dataValueField: 'value'
        }, options);

        var dropDownList = $(selector).kendoDropDownList(config).data('kendoDropDownList');

        smart.kendoui._removeSpanClass(selector);

        return dropDownList;
    };

    smart.kendoui.searchBox = function (selector, options) {
        options = $.extend(true, {
            autoBind: false,
            placeholder: '--请选择--',
            filter: 'contains'
        }, options);

        var searchBox = $(selector).kendoSearchBox(options).data('kendoSearchBox');

        smart.kendoui._removeSpanClass(selector);

        return searchBox;
    };

    smart.kendoui._removeSpanClass = function (selector) {
        var classStr = $(selector).attr('class');
        if (classStr) {
            var classes = classStr.split(/\s+/);
            for (var i = 0; i < classes.length; i++) {
                if (/^s-span(\d){1,2}$/.test(classes[i])) {
                    $(selector).closest('.k-widget').find('input').removeClass(classes[i]);
                }
            }
        }
    };

    //----------------------------扩展kendoui方法----------------------------------------------------------------------
    kendo.ui.Grid.prototype.setDeleteIds = function (delIds) {
        this._deleteIds = delIds||[];
    };

    //新增行，会改变颜色
    kendo.ui.Grid.prototype.smartAddRow = function () {
        this.addRow();
        this.refreshRow();
    };

    //删除行
    kendo.ui.Grid.prototype.smartRemoveRow = function (event) {
        // 点击行内删除按钮进行单条删除
        if (event) {
            var tr = $(event.target).closest("tr");
            var data = this.dataItem(tr);
            if (data.id) {
                this._deleteIds.push(data.id);
                tr.css("text-decoration", "line-through");
            } else {
                this.removeRow(tr);
            }
        }
        // 点击删除按钮，进行多选删除

        this.refreshRow();
    };

    //刷新表格行样式，新增绿色，修改蓝色，删除贯穿线
    kendo.ui.Grid.prototype.refreshRow = function () {
        var trs = this.tbody.children("tr[role=row]");
        for (var i = 0; i < trs.length; i++) {
            var row = this.dataItem(trs[i]);
            if (!row.id) {
                $(trs[i]).addClass('s-row-new');
            } else if (this._deleteIds.indexOf(row.id) >= 0) {
                $(trs[i]).removeClass('s-row-update').addClass('s-row-del');
            } else if (row.dirty) {
                $(trs[i]).addClass('s-row-update');
            }
        }
    };

    //返回表格选中行的数据--kendoGrid
    kendo.ui.Grid.prototype.selectData = function () {
        var ids = [], datas = [];
        var $rows = this.select();
        for (var i = 0; i < $rows.length; i++) {
                var data = this.dataItem($rows[i]);
                if (data) {
                    ids.push(data.id);
                    datas.push(data);
                }
        }
        return {ids: ids, datas: datas};
    };

    //返回表格选中行的数据--kendoTreeList
    kendo.ui.TreeList.prototype.selectData = function () {
        var ids = [], datas = [];
        var $rows = this.tbody.children("tr.k-state-selected[role=row]");
        for (var i = 0; i < $rows.length; i++) {
            var data = this.dataItem($rows[i]);
            if (data) {
                ids.push(data.id);
                datas.push(data);
            }
        }
        return {ids: ids, datas: datas};
    };

    //清除表格数据
    kendo.ui.Grid.prototype.clearData = function () {
        var data = this.dataSource.data();
        for (var i = data.length; i > 0; i--) {
            this.dataSource.remove(this.dataSource.at(i - 1));
        }
        this.setDeleteIds([]);
    };

    /**
     * 修复grid由于总高度和内容高度不匹配导致的变形问题
     * @param selector 选择器或jquery对象
     */
    smart.kendoui.fixGridHeight = function (selector) {
        var $grid = $(selector);
        var height = $grid.height();
        $grid.children().each(function (i, obj) {
            var $obj = $(obj);
            if (!$obj.hasClass('k-grid-content')) {
                height -= $obj.outerHeight();
            }
        });
        $grid.find('.k-grid-content').height(height);
    };

    //过滤fields属性
    kendo.ui.Grid.prototype.getFields = function () {
        var fields = [];
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field) {
                fields.push(this.columns[i].field);
            }
        }
        return fields;
    };

    //获取提交所需表格数据
    kendo.ui.Grid.prototype.getDatas = function () {
        var deleteIds = this._deleteIds;
        var fields = this.getFields();
        var datas = {news: [], updates: [], deletes: deleteIds}
        for (var i = 0; i < this.dataSource.data().length; i++) {
            var item = this.dataSource.at(i);
            var itemClone = {_row_index: i};
            // 拷贝fields中的数据，如果不过滤掉非field数据，提交数据会报错：field不存在
            for (var f in item) {
                if (fields.indexOf(f) >= 0) {
                    itemClone[f] = item[f];
                }
            }
            if (!item.id) {
                datas.news.push(itemClone);
            } else if (item.dirty && deleteIds.indexOf(item.id) < 0) {
                datas.updates.push(itemClone);
            }
        }
        return datas;
    };

    kendo.ui.Grid.prototype.getColumnIndex = function (field) {
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field) {
                if (field == this.columns[i].field) {
                    return i;
                }
            }
        }
        return -1;
    };

    //定位校验错误
    kendo.ui.Grid.prototype.showInvalidErrors = function (errors) {
        var $rows = this.tbody.find('> tr:not(.k-grouping-row,.k-detail-row,.k-group-footer)');
        for (var row in errors) {
            var rowIndex = row.substr(4);
            var errorRow = $rows[rowIndex];
            var errorInfo = errors[row];
            for (var field in errorInfo) {
                var colIndex = this.getColumnIndex(field);
                if (colIndex > -1) {
                    var errorTd = $(errorRow).find("td[role=gridcell]:eq(" + colIndex + ")");
                    errorTd.addClass("s-field-invalid");
                    errorTd.attr("error_notice", errorInfo[field].join(";"));
                } else {
                    alert("查找错误td失败:" + field);
                }
            }
        }
    };

    /**
     * 添加框架扩展的一些事件及处理函数
     */
    kendo.ui.Grid.prototype.bindSmartEvents = function () {
        var grid = this,
            options = grid.options;

        grid._addSmartClickEvent();
    };

    /**
     * 添加行点击事件、双击事件、选中行变化事件
     * @private
     */
    kendo.ui.Grid.prototype._addSmartClickEvent = function () {
        var self = this,
            $table = self.table;
        self.selectedRowUid = null;
        // 主表选择行事件
        $table.on("click", function (e) {
            var $target = $(e.target);
            var $tr = $target.closest("tr");
            if ($tr.size() > 0 && $tr.hasClass("k-state-selected")) {
                var rowData = self.dataItem($tr);
                var data = { data: { tr: $tr, rowData: rowData}};
                self.trigger("smartRowClick", data);

                // 选中行发生变化的事件
                if (rowData && self.selectedRowUid != rowData.uid) {
                    self.trigger("smartRowChange", data);
                    self.selectedRowUid = rowData.uid;
                }
            }
        });
        // 绑定行双击击事件
        $table.on("dblclick", function (e) {
            var $target = $(e.target);
            var $tr = $target.closest("tr");
            if ($tr.size() > 0 && $tr.hasClass("k-state-selected")) {
                self.trigger("smartRowDblClick", { data: { tr: $tr, rowData: self.dataItem($tr)}});
            }
        });
    };

    //----------------------------------------------------------------------------------------------------------------

})();