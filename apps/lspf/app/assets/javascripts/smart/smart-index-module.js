/**
 * 索引页面模板，依赖 smart-module.js
 * = require ./smart-module.js
 */
(function () {
    if (!window.smart) {
        window.smart = {};
    }
    /**
     *  执行顺序为： init -> ready{ initComponents -> initVars -> bindEvents }
     */
    smart.IndexModule = smart.Module.extend({

        init: function (options) {

            if (typeof(options.grid) == "string") {
                this.gridName = [options.grid];
            }

            smart.Module.fn.init.call(this, options);
        },

        doQuery: function () {
            this.mainGrid.dataSource.read();
        },

        resetQuery: function () {
            this.mainGrid.dataSource.page(1);
        },

        //初始化组件
        initComponents: function () {
            //在子类实现
        },

        //初始化变量
        initVars: function () {
            var gridName = this.gridName ? this.gridName[0] : "mainGrid";

            this.mainGrid = $("#" + gridName).data("kendoGrid");
        },

        //grid自适应高度
        resizeLayout:function () {
            var $grid = this.mainGrid.wrapper,
                height = $(window).height() - $grid.offset().top - 5;

            $grid.height(height);

            smart.kendoui.fixGridHeight($grid);
        },

        //绑定事件
        bindEvents: function () {
            var self = this;

            smart.bind('#' + this.containerId + ' #btnDoQuery', [this.doQuery, this]);
            smart.bind('#' + this.containerId + ' #btnResetQuery', [this.resetQuery, this]);

            // 回车查询
            $.each(this.options.enterQueryIds, function (index, item) {
                $("#" + item).bind("enterKeyDown", function (e) {
                    self.resetQuery();
                });
            });

            $(window).resize(function () {
                self.resizeLayout();
            });
        },

        ready: function () {

            smart.Module.fn.ready.call(this);

            this.initComponents();

            this.initVars();

            this.bindEvents();

            this.resizeLayout();
        }

    });
})();
