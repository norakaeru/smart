/**
 * 单表表编辑页面模板，依赖 smart-edit-module.js
 * = require ./smart-edit-module.js
 */
(function(){

    if (!window.smart) {
        window.smart = {};
    }

    smart.SingleEditModule = smart.EditModule.extend({

        init: function (options) {
            smart.EditModule.fn.init.call(this, options);
        },

        loadItem: function (item) {
            smart.EditModule.fn.loadItem.call(this, item);
            var self = this,
                modelName = this.modelName[0];

            if (item && item.id) {
                this.ajax({
                    type: 'get',
                    url: this.restUrl + item.id,
                    success: function (res) {
                        self.viewModel.set(modelName, res[modelName]);
                    }
                });
            }
        },

        doNew: function () {
            //触发自定义事件
            smart.Event('ITEM_ADD_EVENT').fire();

            this.$("#btnDoNew").hide();
        },

        doSave: function () {
           var self = this,
               modelName = this.modelName[0],
               data = {};

            data[modelName] = this.viewModel.get(modelName).toJSON();

            this.ajax({
                url: this.restUrl + data[modelName].id,
                data: data,
                success: function (res) {
                    //触发自定义事件
                    smart.Event('ITEM_SAVE_EVENT', res[modelName]).fire();
                },
                error: function (jqXHR) {
                    var msg = smart.ajax.formatError(jqXHR);

                    if (jqXHR.status == 401) {
                        smart.alert(msg.notice);
                    } else {
                        var errors = msg.data[modelName];
                        self.showFieldErrors(errors);
                    }
                }
            });
        },

        doDelete: function () {
           var self = this,
               modelName = this.modelName[0];

            if (this.isNewItem()) {
                //触发自定义事件
                smart.Event("ITEM_REMOVE_EVENT").fire();
                return;
            }

            smart.confirm({
                message: "您确定要删除这条记录?",
                buttons: [{
                    click: function () {
                        smart.ajax({
                            type: 'delete',
                            url: self.restUrl + self.viewModel[modelName].id,
                            success: function (res) {
                                //触发自定义事件
                                smart.Event("ITEM_REMOVE_EVENT").fire();
                            },
                            error: function (jqXHR) {}
                        });
                    }
                }]
            });

        }

    });
})();
