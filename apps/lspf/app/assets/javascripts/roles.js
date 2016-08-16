(function () {

    var IndexModule = smart.SingleIndexModule.extend({

        init: function (options) {
            smart.SingleIndexModule.fn.init.call(this, options);
        },

        params: function () {
            return { role: {} }
        },

        initComponents: function () {
            smart.SingleIndexModule.fn.initComponents.call(this);
            var self = this;

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
        }
    });

    new IndexModule({
        name : "smart::role::index",
        containerId : "ctnRoleIndex",
        restUrl: '/roles/',
        editModule : {
            name : "smart::role::edit",
            containerId : "ctnRoleEditWrap",
            options: {
                width : '600px',
                height : '400px',
                content: '/roles/new'
            }
        },
        enterQueryIds: ["name", "code"]
    });

})();









