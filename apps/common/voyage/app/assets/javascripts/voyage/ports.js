(function () {

    var IndexModule = smart.SingleIndexModule.extend({

        init: function (options) {
            smart.SingleIndexModule.fn.init.call(this, options);
        },

        params: function () {
            return { port: {} }
        },

        initComponents: function () {
            smart.SingleIndexModule.fn.initComponents.call(this);
            var self = this;

            smart.kendoui.grid($("#mainGrid"), {
                height: 900,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "port_code", title: "港口编码", width: 100 },
                    { field: "port_name_cn", title: "中文名称", width: 100 },
                    { field: "port_name_en", title: "英文名称", width: 100 },
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
        name : "voyage::port::index",
        containerId : "ctnVoyagePortIndex",
        restUrl: '/voyage/ports/',
        grid: 'mainGrid',
        editModule : {
            name : "voyage::port::edit",
            containerId : "ctnVoyagePortEditWrap",
            options: {
                width : '600px',
                height : '400px',
                content: '/voyage/ports/new'
            }
        },
        enterQueryIds: ["port_code", "port_name"]
    });

})();









