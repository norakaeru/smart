/**
 * 单表索引页面模板 ，依赖 smart-index-module.js
 * = require ./smart-index-module.js
 */
(function () {

    if (!window.smart) {
        window.smart = {};
    }

    smart.SingleIndexModule = smart.IndexModule.extend({

        init: function (options) {
            if (!options["editModule"]) {
                alert("smart.SingleIndexModule创建失败，缺少必要参数： editModule");
            } else {
                this.editWrap = options["editModule"];
            }
            smart.IndexModule.fn.init.call(this, options);
        },


        //新增
        doNew: function () {
            this._doShow(null);
        },

        //编辑
        doEdit: function (event) {
            var editItems = [];

            //行内编辑
            if (event) {
                var tr = $(event.target).closest("tr");
                var data = this.mainGrid.dataItem(tr);
                editItems.push(data);
            //多条编辑
            } else {
                var data = this.mainGrid.selectData();
                editItems = data.datas;
            }

            if (editItems.length < 1) {
                smart.alert("请选择要编辑的行");
                return false;
            }

            this._doShow(editItems);
        },

        //删除
        doDelete: function (event) {
            var self = this,
                deleteIds = [];

            // 行内删除
            if (event) {
                var tr = $(event.target).closest("tr");
                var data = this.mainGrid.dataItem(tr);
                deleteIds.push(data.id);
            //多条删除
            } else {
                var data = this.mainGrid.selectData();
                deleteIds = data.ids;
            }

            if (deleteIds.length < 1) {
                smart.alert("请选择要删除的行");
                return false;
            }

            smart.confirm({
                message: "您确定要删除" + (deleteIds.length > 1 ? "所选" + deleteIds.length : "该") + "条记录?",
                buttons: [{
                    click: function () {
                        //批量删除
                        smart.ajax({
                            type: 'delete',
                            url: self.restUrl + 'multi_delete',
                            data: {ids: deleteIds},
                            success: function (res) {
                                self.doQuery();
                            },
                            error: function (jqXHR) {}
                        });
                    }
                }]
            });
        },

        //显示编辑页面
        _doShow: function (items) {
            this.navBar.setItems(items);
            this._setTitle(this.navBar.title());
            this._loadItem(this.navBar.getCurrItem());
            this.winDetail.center().open();
        },

        //设置编辑页面title
        _setTitle: function (title) {
            this.winDetail.title(title);
        },

        //编辑页面--载入当前item
        _loadItem: function (item) {
            var editModule = smart.Module.getModule(this.editWrap.name);
            if (editModule) editModule.loadItem(item);
        },

        //编辑页面--新增回调函数
        _itemAddHandler: function () {
            this.navBar.addItem(null);
            this._setTitle(this.navBar.title());
        },

        //编辑页面--保存回调函数
        _itemSaveHandler: function (item) {
            this.navBar.updateCurrItem(item);
            this._setTitle(this.navBar.title());
            this._loadItem(this.navBar.getCurrItem());
            this.doQuery();
        },

        //编辑页面--删除回调函数
        _itemRemoveHandler: function () {
            this.navBar.removeCurrItem();
            this._setTitle(this.navBar.title());
            this._loadItem(this.navBar.getCurrItem());
            this.doQuery();
        },

        initComponents: function () {
            var self = this,
                editWrap = self.editWrap,
                containerId = editWrap.containerId,
                options = editWrap.options || {};
            if (!options.content) {
                options.content =  self.restUrl + "new";
            }
            //编辑页
            this.winDetail = smart.kendoui.window('#' + containerId, options);
            //导航条
            this.navBar = new smart.NavBar('#' + containerId, {
                onNext: function (item, title) {
                    self._setTitle(title);
                    self._loadItem(item);
                    return true;
                },
                onPrev: function (item, title) {
                    self._setTitle(title);
                    self._loadItem(item);
                    return true;
                }
            });
        },

        bindEvents: function () {
            smart.IndexModule.fn.bindEvents.call(this);

            //事件绑定
            smart.bind('#' + this.containerId + ' #btnDoNew', [this.doNew, this]);
            smart.bind('#' + this.containerId + ' #btnDoEdit', [this.doEdit, this]);
            smart.bind("#" + this.containerId + " #btnDoDelete", [this.doDelete, this]);

            //自定义事件绑定
            smart.Event.bind('ITEM_ADD_EVENT', [this._itemAddHandler, this]);
            smart.Event.bind('ITEM_SAVE_EVENT', [this._itemSaveHandler, this]);
            smart.Event.bind('ITEM_REMOVE_EVENT', [this._itemRemoveHandler, this]);
        }

    });
})();
