(function () {

    var IndexModule = smart.SingleIndexModule.extend({

        init: function (options) {
            smart.SingleIndexModule.fn.init.call(this, options);
        },

        params: function () {
            return { group: {} }
        },

        initComponents: function () {
            smart.SingleIndexModule.fn.initComponents.call(this);
            var self = this;

            //左侧权限组
            smart.kendoui.grid($("#mainGrid"), {
                height: 900,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "name", title: "name", width: 100 },
                    { field: "code", title: "code", width: 100 },
                    { field: "created_at", title: "创建时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false },
                    { field: "updated_at", title: "修改时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false }
                ],
                dataSource : {
                    url: self.restUrl,
                    parameterMap: self.params.call(self)
                },
                toolbar: kendo.template($("#template").html()),
                command: {
                    onEditClick: function () {
                        return function (event) {
                            self.doEdit.call(self, event)
                        }
                    }(self),
                    onDelClick: function () {
                        return function (event) {
                            self.doDelete.call(self, event)
                        }
                    }(self)
                }
            });

            self.initTabStrip();
        },

        //右侧tabs
        initTabStrip: function () {
            var self = this;

            self.tabstrip = $("#tabstrip").kendoTabStrip({
                animation: { open: { effects: "fadeIn"} }
            });

            self._initUserGrid();
            self._initMenuTree();
            self._initPermissionTree();
            self._initRoleTree();
        },

        //用户配置
        _initUserGrid: function () {
            var self = this;

            self.userGrid = smart.kendoui.grid($("#userGrid"), {
                height: 800,
                columns : [
                    { field: 'id', hidden: true },
                    { field: "name", title: "用户名", width: 85 },
                    { field: "account", title: "账号", width: 85 }
                ],
                autoBind: false,
                dataSource : {
                    url: '/users'
                },
                toolbar: kendo.template($("#tbUserGrid").html()),
                command: {
                    onDelClick: function () {
                        return function (event) {
                            //self.removeUserFromGroup.call(self, event)
                        }
                    }(self)
                },
                filterable:false,
                groupable:false
            });
        },

        //菜单配置
        _initMenuTree: function () {
            var self = this;
            var $ctnMenuTreeView = $('#ctnMenusTreeView'),
                $treeView = $ctnMenuTreeView.find('#menusTreeView');

            $treeView.kendoTreeView({
                dataTextField: 'label',
                checkboxes: {
                    checkChildren: true
                },
                dataSource: $.parseJSON($("#menuTreeData").text())['items']
            });
            self.menuTreeView = $treeView.data('kendoTreeView');
        },

        //权限权限
        _initPermissionTree: function () {
            var self = this;
            var $ctnPermissionTreeView = $('#ctnPermissionsTreeView'),
                $treeView = $ctnPermissionTreeView.find('#permissionsTreeView');

            $treeView.kendoTreeView({
                dataTextField: 'label',
                checkboxes: {
                    checkChildren: true
                },
                dataSource: $.parseJSON($("#permissionTreeData").text())['items']
            });
            self.permissionTreeView = $treeView.data('kendoTreeView');
        },

        //角色配置
        _initRoleTree: function () {
            var self = this;

//            self.roleGrid = smart.kendoui.grid($("#userGrid"), {
//                height: 890,
//                columns : [
//                    { field: 'id', hidden: true },
//                    { field: "name", title: "用户名", width: 85 },
//                    { field: "account", title: "账号", width: 85 }
//                ],
//                autoBind: false,
//                dataSource : {
//                    url: '/users'
//                },
//                toolbar: kendo.template($("#tbUserGrid").html()),
//                command: {
//                    onDelClick: function () {
//                        return function (event) {
//                            //self.removeUserFromGroup.call(self, event)
//                        }
//                    }(self)
//                },
//                filterable:false,
//                groupable:false
//            });
        },

        //grid自适应高度
        resizeLayout:function () {
            var self = this;
            smart.SingleIndexModule.fn.resizeLayout.call(self);

            var $userGrid = $("#userGrid"),
                $menusTreeView = $("#menusTreeView"),
                $permissionsTreeView = $("#permissionsTreeView"),
                height = $(window).height() - $userGrid.offset().top - 10;

            $userGrid.height(height);
            $menusTreeView.height(height);
            $permissionsTreeView.height(height);

            smart.kendoui.fixGridHeight($userGrid);
        },

        bindEvents: function () {
            var self = this;
            smart.SingleIndexModule.fn.bindEvents.call(self);

            // 绑定表格刷新事件
            self.mainGrid.bind("dataBound", function () {
                self.userGrid.tbody.find('tr').remove();
                self.doResetTree(self.menuTreeView);
                self.doResetTree(self.permissionTreeView);
            });

            // 绑定表格行单击事件
            self.mainGrid.bind("smartRowChange", (function (e) {
                var group_id = e.data.rowData.id;
                self.loadUsers(group_id, 1);
                self.loadMenus(group_id);
                self.loadPermissions(group_id);
            }));

            // 绑定保存事件
            self.$('#btnDoSave').click(function () {
                self.doSaveMenus();
                self.doSavePermissions();
            });
        },

        doResetTree: function (treeView) {
            if (!treeView) return;
            var items = treeView.dataSource.view();
            for (var i = 0; i < items.length; i++) {
                var node = items[i];
                node.set('checked', true);
                node.set('checked', false);
            }
        },

        //*********************************************************************************************
        loadUsers: function (group_id, page) {
            var self = this;
            var dataSource = self.userGrid.dataSource;
            dataSource.transport.parameterMap = function (model, type) {
                return $.extend(model, {user: { group_id: group_id }});
            };
            if (page) {
                dataSource.page(page);
            } else {
                dataSource.read();
            }
        },
        //****************************************************************************************
        //****************************************************************************************
        loadMenus: function (group_id) {
            var self = this;
            $.get('/groups/' + group_id + '/group_menus', function (res) {
                self._checkMenuTree(res);
            }, 'json');
        },

        _checkMenuTree: function (ids) {
            var self = this,
                treeView = self.menuTreeView,
                $checkboxes = treeView.element.find('li input:checkbox'),
                idArr = ids || [];

            self.doResetTree(treeView);

            $checkboxes.filter(function () {
                var $li = $(this).parents('li:first'), dataItem = treeView.dataItem($li);
                return dataItem.type == 'LEAF' && idArr.indexOf(dataItem.id) > -1;
            }).prop('checked', true);
            treeView.updateIndeterminate();
        },

        doSaveMenus: function () {
            var self = this,
                tr = self.mainGrid.select(),
                dataItem = self.mainGrid.dataItem(tr),
                treeView = self.menuTreeView,
                menuIds = self._getMenuIds(treeView);

            if (!dataItem) {
                smart.alert("请选择用户组");
                return;
            }

            var data = {
                group_id: dataItem.id,
                menu_ids: menuIds
            };

            smart.ajax({
                type: 'post',
                dataType: 'json',
                data: data,
                url: '/groups/update_menus',
                success: function (res) {
                },
                error: function () {
                }
            });
        },

        /**
         * @param treeView
         * @returns {{checked: Array, unchecked: Array}}
         */
        _getMenuIds: function (treeView) {
            var checkedNodes = [],
                uncheckedNodes = [],
                $nodes = treeView.element.find('li.k-item');

            $nodes.each(function (i, obj) {
                var $node = $(obj),
                    dataItem = treeView.dataItem($node),
                    $checkbox = $node.find('input:checkbox:first');

                //SYSTEM,MODULE,GROUP,LEAF
                if (dataItem.type.toUpperCase() != 'SYSTEM') {
                    if ($checkbox.is(':checked')) {
                        checkedNodes.push(dataItem.id);
                    } else {
                        uncheckedNodes.push(dataItem.id);
                    }
                }
            });

            return { checked: checkedNodes, unchecked: uncheckedNodes};
        },
        //****************************************************************************************
        //****************************************************************************************
        loadPermissions: function (group_id) {
            var self = this;
            $.get('/groups/' + group_id + '/group_permissions', function (res) {
                self._checkPermissionTree(res);
            }, 'json');
        },

        _checkPermissionTree: function (ids) {
            var self = this,
                treeView = self.permissionTreeView,
                $checkboxes = treeView.element.find('li input:checkbox'),
                idArr = ids || [];

            self.doResetTree(treeView);

            $checkboxes.filter(function () {
                var $li = $(this).parents('li:first'), dataItem = treeView.dataItem($li);
                return dataItem.type == 'permission' && idArr.indexOf(dataItem.id) > -1;
            }).prop('checked', true);
            treeView.updateIndeterminate();
        },

        doSavePermissions: function () {
            var self = this,
                tr = self.mainGrid.select(),
                dataItem = self.mainGrid.dataItem(tr),
                treeView = self.permissionTreeView,
                permissionIds = self._getPermissionIds(treeView);

            if (!dataItem || !dataItem.id) {
                smart.alert("请选择用户组");
                return;
            }

            var data = {
                group_id: dataItem.id,
                permission_ids: permissionIds
            };

            smart.ajax({
                type: 'post',
                dataType: 'json',
                data: data,
                url: '/groups/update_permissions',
                success: function (res) {
                },
                error: function () {
                }
            });
        },

        /**
         * @param treeView
         * @returns {{checked: Array, unchecked: Array}}
         */
        _getPermissionIds: function (treeView) {
            var checkedNodes = [],
                uncheckedNodes = [],
                $nodes = treeView.element.find('li.k-item');

            $nodes.each(function (i, obj) {
                var $node = $(obj),
                    $checkbox = $node.find('input:checkbox:first'),
                    dataItem = treeView.dataItem($node);

                //system, module, permission
                if (dataItem.type.toUpperCase() == 'PERMISSION') {
                    if ($checkbox.is(':checked')) {
                        checkedNodes.push(dataItem.id);
                    } else {
                        uncheckedNodes.push(dataItem.id);
                    }
                }
            });

            return { checked: checkedNodes, unchecked: uncheckedNodes};
        }


    });

    new IndexModule({
        name : "smart::group::index",
        containerId : "ctnGroupIndex",
        restUrl: '/groups/',
        editModule : {
            name : "smart::group::edit",
            containerId : "ctnGroupEditWrap",
            options: {
                width : '600px',
                height : '400px',
                content: '/groups/new'
            }
        },
        enterQueryIds: ["name", "code"]
    });

})();









