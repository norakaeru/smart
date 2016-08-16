(function () {

    var IndexModule = smart.SingleIndexModule.extend({

        init: function (options) {
            smart.SingleIndexModule.fn.init.call(this, options);
        },

        params: function () {
            return { menu: {} }
        },

        initComponents: function () {
            smart.SingleIndexModule.fn.initComponents.call(this);
            var self = this;

            var dataSource = new kendo.data.TreeListDataSource({
                transport: {
                    read: {
                        url: self.restUrl,
                        dataType: "json"
                    },
                    parameterMap: function(options, operation) {
                        if (operation !== "read" && options.models) {
                            return {models: kendo.stringify(options.models)};
                        }
                    }
                },
                schema: {
                    model: {
                        fields: {
                            id: { field: "id", type: "number", nullable: false },
                            parentId: {field: "parent_menu_id", nullable: true},
                            system_code: { field: "system_code" },
                            plugin_code: { field: "plugin_code" },
                            label: { field: "label" },
                            route: { field: "route" },
                            controller: { field: "controller" },
                            action: { field: "action" },
                            menu_type: { field: "menu_type" }
                        },
                        expanded: true
                    }
                }
            });

            smart.kendoui.treeList("#mainGrid", {
                height: 940,
                dataSource: dataSource,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "system_code", title: "system_code", width: 100 },
                    { field: "plugin_code", title: "plugin_code", width: 100 },
                    { field: "label", title: "label", width: 100 },
                    { field: "route", title: "route", width: 200 },
                    { field: "controller", title: "controller", width: 150 },
                    { field: "action", title: "action", width: 100 },
                    { field: "menu_type", title: "menu_type", width: 100 }
                ],
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
                },
                filterable: true,
                resizable: true,
                editable: false,
                selectable: "multiple, row"
            });
        },

        initVars:function () {
            this.mainGrid = $("#mainGrid").data("kendoTreeList");
        },

        //新增
        doNew: function () {
            var ids =  this.mainGrid.selectData().ids;
            if (ids.length == 0) {
                this._doShow(null);
            } else if (ids.length == 1) {
                this._doShow({parent_menu_id: ids[0]});
            } else {

            }
        }

    });



    new IndexModule({
        name : "smart::menu::index",
        containerId : "ctnMenuIndex",
        restUrl: '/menus/',
        editModule : {
            name : "smart::menu::edit",
            containerId : "ctnMenuEditWrap",
            options: {
                width : '600px',
                height : '400px',
                content: '/menus/new'
            }
        },
        enterQueryIds: ["system_code", "plugin_code", "label"]
    });

})();









