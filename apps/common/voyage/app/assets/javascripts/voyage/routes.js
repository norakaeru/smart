(function () {

    var IndexModule = smart.MultiIndexModule.extend({

        init: function (options) {
            smart.MultiIndexModule.fn.init.call(this, options);
        },

        params: function () {
            var params = {}
            return { route: params };
        },

        initComponents: function () {
            smart.MultiIndexModule.fn.initComponents.call(this);
            var self = this;

            //主表
            smart.kendoui.grid("#mainGrid", {
                height: 600,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "route_code", title: "航线编码", width: 100 },
                    { field: "route_name", title: "航线名称", width: 100 },
                    { field: "route_type_id", title: "航线类型", width: 100, values: smart.Data.getRouteTypeData() },
                    { field: "remark", title: "备注", width: 200 },
                    { field: "operator",title: "操作人", width: 100 },
                    { field: "created_at", title: "创建时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false },
                    { field: "updated_at", title: "修改时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false }
                ],
                dataSource : {
                    url: self.restUrl,
                    parameterMap: self.params.call(self)
                },
                toolbar: kendo.template(self.$("#template").html()),
                command: {
                    onEditClick: function () {
                        return function (event) {
                            self.doEdit.call(self, event);
                        }
                    }(self),
                    onDelClick: function () {
                        return function (event) {
                            self.doDelete.call(self, event);
                        }
                    }(self)
                },
                change: function () {
                    var dataItem = this.dataItem(this.select());
                    if (dataItem) {
                        $("#subGrid").data('kendoGrid').dataSource.read({id: dataItem.id});
                    }
                }
            });

            //子表
            smart.kendoui.grid("#subGrid", {
                height: 300,
                columns: [
                    { field: "id",  width: 100, hidden: true},
                    { field: "route_id",  width: 100, hidden: true},
                    { field: "port_type_id", title: "港口类型", width: 100, values: smart.Enums["BasicData::PortType"].getData()},
                    { field: "port_id", title: "港口名称", width: 100, values: smart.Data.getPortData() },
                    { field: "remark", title: "备注", width: 200 },
                    { field: "operator",title: "操作人", width: 100 },
                    { field: "created_at", title: "创建时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false },
                    { field: "updated_at", title: "修改时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false }
                ],
                autoBind: false,
                dataSource: {
                    url: self.restUrl + 'route_ports'
                },
                filterable: false,
                groupable: false,
                pageable: false
            });
        }

    });

    new IndexModule({
        name: "voyage::route::index",
        containerId: "ctnVoyageRouteIndex",
        restUrl: '/voyage/routes/',
        grid: ['mainGrid', 'subGrid'],
        editModule: {
            name: "voyage::route::edit",
            containerId: "ctnVoyageRouteEditWrap",
            options: {
                width: '1000px',
                height: '600px',
                content: '/voyage/routes/new'
            }
        },
        enterQueryIds: ["route_code", "route_name"]
    });

})();









