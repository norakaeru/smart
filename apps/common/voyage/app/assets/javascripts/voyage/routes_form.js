(function () {

    var EditModule = smart.MultiEditModule.extend({

        init: function (options) {
            smart.MultiEditModule.fn.init.call(this, options);
        },

        initComponents: function () {
            var self = this;

            smart.kendoui.comboBox("#route_route_type_id", {
                dataSource: smart.Data.getRouteTypeData()
            });

//            smart.kendoui.searchBox("#route_route_type_id", {
//                placeholder: '请选择',
//                dataFilterField: 'type_code',
//                dataTextField: 'type_name',
//                dataValueField: 'id',
//                filter: 'contains',
//                ignoreCase: false,
//                grid: {
//                    dataSource: {
//                        dataType: "json",
//                        pageSize: 5,
//                        serverPaging: true,
//                        serverFiltering: true,
//                        transport: {
//                            read: {
//                                dataType: 'json',
//                                url: "/voyage/route_types"
//                            }
//                        }
//                    },
//                    columns: [
//                        { field: 'id', hidden: true },
//                        { field: "type_code", title: "编码", width: 80 },
//                        { field: "type_name", title: "名称", width: 80 }
//                    ],
//                    pageable: true,
//                    filterable: true,
//                    scrollable: false
//                }
//            });

            smart.kendoui.grid("#subGridEdit", {
                height: 460,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "route_id",  width: 100, hidden: true},
                    { field: "port_type_id", title: "港口类型", width: 100, values: smart.Enums["BasicData::PortType"].getData(),
                        editor: function (container, options) {
                            $('<input data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>').appendTo(container).kendoDropDownList({
                                autoBind: false,
                                optionLabel: '--请选择--',
                                dataSource: smart.Enums["BasicData::PortType"].getData()
                            });
                        }
                    },
                    { field: "port_id", title: "港口名称", width: 100, values: smart.Data.getPortData(),
                        editor: function (container, options) {
                            $('<input data-text-field="port_name_cn" data-value-field="id" data-bind="value:' + options.field + '"/>').appendTo(container).kendoDropDownList({
                                autoBind: false,
                                optionLabel: '--请选择--',
                                dataSource: {
                                    transport: {
                                        read: "/voyage/ports.json"
                                    }
                                }
                            });
                        }
                    },
                    { field: "remark", title: "备注", width: 200 },
                    { field: "operator",title: "操作人", width: 100 },
                    { field: "created_at", title: "创建时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false },
                    { field: "updated_at", title: "修改时间", width: 150, format: "{0:yyyy-MM-dd HH:mm:ss}", filterable: false }
                ],
                autoBind: false,
                dataSource : {
                    url: this.restUrl + 'route_ports'
                },
                toolbar: kendo.template(this.$("#template").html()),
                command: {
                    onDelClick: function () {
                        return function (event) {
                            self.doDeleteSub.call(self, event);
                        }
                    }(self)
                },
                editable: true,
                filterable: false,
                groupable: false,
                pageable: false
            });
        }
    });

    new EditModule({
        name: "voyage::route::edit",
        containerId: "ctnVoyageRouteEdit",
        restUrl: "/voyage/routes/",
        grid: "subGridEdit",
        modelName: ["route", "route_port"],
        model: {
            route: {
                id: "",
                route_code: "",
                route_name: "",
                route_type_id: "",
                operator: "",
                remark: ""
            }
        }
    });

})();