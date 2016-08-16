(function () {

    var IndexModule = smart.SingleIndexModule.extend({

        init: function (options) {
            smart.SingleIndexModule.fn.init.call(this, options);
        },

        params: function () {
            var params = {}
            return { route_type: params }
        },

        initComponents: function () {
            smart.SingleIndexModule.fn.initComponents.call(this);
            var self = this;

            smart.kendoui.grid($("#mainGrid"), {
                height: 900,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "type_code", title: "类型编码", width: 100 },
                    { field: "type_name", title: "类型名称", width: 100 },
                    { field: "remark", title: "备注", width: 200 },
                    { field: "operator",title: "操作人", width: 100 },
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
        }

    });

    new IndexModule({
        name : "voyage::route_type::index",
        containerId : "ctnVoyageRouteTypeIndex",
        restUrl: '/voyage/route_types/',
        editModule : {
            name : "voyage::route_type::edit",
            containerId : "ctnVoyageRouteTypeEditWrap",
            options: {
                width : '600px',
                height : '400px',
                content: '/voyage/route_types/new'
            }
        },
        enterQueryIds: ["type_code", "type_name"]
    });

})();









