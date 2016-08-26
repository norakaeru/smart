/**
 * 编辑页面模块，依赖 smart-module.js
 * = require ./smart-module.js
 */
(function () {

    if (!window.smart) {
        window.smart = {};
    }
    /**
     * 执行顺序为： init -> ready { bindViewModel -> initComponents -> initVars -> bindEvents }
     */
    smart.EditModule = smart.Module.extend({

        init: function (options) {
            var self = this;
            $.each(["modelName", "model"], function (index, item) {
                if (!options[item]) {
                    alert("smart.EditModule创建失败，缺少必要参数：" + item);
                }
                self[item] = options[item];
            });

            if (typeof(this.modelName) == "string") {
                 this.modelName = [this.modelName];
            }

            smart.Module.fn.init.call(this, options);
        },

        //新增？编辑
        isNewItem: function () {
            var modelName = this.modelName[0];
            return !(this.viewModel[modelName].id);
        },

        ajax: function (options) {
            if (!options.type) {
                if (this.viewModel) {
                    options.type = this.isNewItem() ? "post" : "put";
                }
            }
            smart.ajax(options);
        },

        doNew: function () {
            //在子类实现
        },

        doSave: function () {
            //在子类实现
        },

        doDelete: function () {
            //在子类实现
        },

        loadItem: function (item) {
            this.clearErrorNotices();
            // 新增
            if (!item) {
                this.resetViewModel();
                this.$('#btnDoNew').hide();
                return;
            }
            //编辑
            this.$("#btnDoNew").show();
        },

        //显示表单校验失败错误信息
        showFieldErrors: function (errors) {
            var modelName = this.modelName[0];

            if (errors) {
                for (var field in errors) {
                    if (errors.hasOwnProperty(field)) {
                        var fieldErrorMsg = errors[field].join(";");
                        var $field = this.$('#' + modelName + '_' + field);
                        if ($field.attr('data-role')) {
                            $field = $field.closest('.k-widget').find("input");
                        }
                        $field.addClass("s-field-invalid");
                        $field.attr("error_notice", fieldErrorMsg);
                    }
                }
            }
            this.initErrorNotices();
        },

        //错误提示
        initErrorNotices: function () {
            this.container.kendoTooltip({
                filter: '.s-field-invalid',
                content: function (e) {
                    return e.target.attr('error_notice');
                },
                position: "top"
            });
        },

        //清除错误提示
        clearErrorNotices: function () {
            var errorNotice = this.container.data("kendoTooltip");
            if (errorNotice) errorNotice.destroy();

            $('.s-field-invalid').each(function () {
                $(this).removeClass("s-field-invalid").removeAttr("error_notice");
            })
        },

        //数据绑定
        bindViewModel: function () {
            this.viewModel = kendo.observable(this.model);
            kendo.bind(this.container, this.viewModel);
        },

        //重置初始值
        resetViewModel: function () {
            this.viewModel.set(this.modelName[0], this.model[this.modelName[0]]);
        },

        //初始化组件
        initComponents: function () {
            //在子类实现
        },

        //初始化变量
        initVars: function () {
            //在子类实现
        },

        //事件绑定
        bindEvents: function () {
            smart.bind('#' + this.containerId + ' #btnDoNew', [this.doNew, this]);
            smart.bind('#' + this.containerId + ' #btnDoSave', [this.doSave, this]);
            smart.bind('#' + this.containerId + ' #btnDoDelete', [this.doDelete, this]);
        },

        ready: function () {

            smart.Module.fn.ready.call(this);

            this.bindViewModel();

            this.initComponents();

            this.initVars();

            this.bindEvents();
        }

    });
})();
