/**
 * 主子表编辑页面模板，依赖 smart-edit-module.js
 * = require ./smart-edit-module.js
 */
(function () {

    if (!window.smart) {
        window.smart = {};
    }

    smart.MultiEditModule = smart.EditModule.extend({

        init: function (options) {
            smart.EditModule.fn.init.call(this, options);
        },

        loadItem: function (item) {
            smart.EditModule.fn.loadItem.call(this, item);
            var self = this,
                modelName = self.modelName[0];

            this.subGridEdit.clearData();

            //新增
            if (!item) {
                return;
            }
            //编辑
            this.ajax({
                type: 'get',
                url: this.restUrl + item.id,
                success: function (res) {
                    self.viewModel.set(modelName, res[modelName]);
                }
            });
            this.subGridEdit.dataSource.read({id: item.id});
        },

        doNew: function () {
            new smart.Event('ITEM_ADD_EVENT', {}).fire();

            this.$("#btnDoNew").hide();
        },

        doSave: function () {
            var self = this,
                modelName = this.modelName[0],
                subName = this.modelName[1],
                data = {};

            data[modelName] = this.viewModel.get(modelName).toJSON();
            data[subName] = this.subGridEdit.getDatas();

            this.ajax({
                url: this.restUrl + data[modelName].id,
                data: data,
                success: function (res) {
                    new smart.Event('ITEM_SAVE_EVENT', res[modelName]).fire();
                },
                error: function (jqXHR) {
                    var msg = smart.ajax.formatError(jqXHR);

                    if (jqXHR.status == 401) {
                        smart.alert({message: msg.notice});
                    } else {
                        var main_errors = msg.data[modelName],
                            sub_errors = msg.data[subName];
                        // 子项校验失败
                        if (sub_errors) {
                            self.subGridEdit.showInvalidErrors(sub_errors);
                        }
                        // 主项校验失败
                        self.showFieldErrors(main_errors);
                    }
                }
            });
        },

        doDelete: function () {
            var self = this,
                modelName = this.modelName[0];

            if (this.isNewItem()) {
                new smart.Event("ITEM_REMOVE_EVENT", {}).fire();
                return;
            }

            this.ajax({
                type: 'delete',
                url: this.restUrl + this.viewModel[modelName].id,
                success: function (res) {
                    new smart.Event("ITEM_REMOVE_EVENT", {}).fire();
                },
                error: function (jqXHR) {}
            });
        },

        doNewSub: function () {
            this.subGridEdit.smartAddRow();
        },

        doDeleteSub: function (event) {
            this.subGridEdit.smartRemoveRow(event);
        },

        initVars: function () {
            var subGridEdit = this.options.grid || "subGridEdit";

            this.subGridEdit = $("#" + subGridEdit).data("kendoGrid");
        },

        bindEvents: function () {
            smart.EditModule.fn.bindEvents.call(this);
            smart.bind('#' + this.containerId + ' #btnDoNewSub', [this.doNewSub, this]);
            smart.bind('#' + this.containerId + ' #btnDoDeleteSub', [this.doDeleteSub, this]);
        }

    });
})();
