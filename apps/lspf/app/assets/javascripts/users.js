(function () {

    var IndexModule = smart.SingleIndexModule.extend({

        init: function (options) {
            smart.SingleIndexModule.fn.init.call(this, options);
        },

        params: function () {
            return { user: {} }
        },

        initComponents: function () {
            smart.SingleIndexModule.fn.initComponents.call(this);
            var self = this;

            smart.kendoui.grid($("#mainGrid"), {
                height: 940,
                columns : [
                    { field: "id",  width: 100, hidden: true},
                    { field: "name", title: "姓名", width: 100 },
                    { field: "account", title: "帐号", width: 100 },
                    { field: "email", title: "邮箱", width: 200 },
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
        name : "smart::user::index",
        containerId : "ctnUserIndex",
        restUrl: '/users/',
        editModule : {
            name : "smart::user::edit",
            containerId : "ctnUserEditWrap",
            options: {
                width : '600px',
                height : '400px',
                content: '/users/new'
            }
        },
        enterQueryIds: ["name", "account"]
    });

})();









