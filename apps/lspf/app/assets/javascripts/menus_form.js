(function () {
    var EditModule = smart.SingleEditModule.extend({

        init: function (options) {
            smart.SingleEditModule.fn.init.call(this, options);
        },

        loadItem: function (item) {
            smart.SingleEditModule.fn.loadItem.call(this, item);

            if (item && item.parent_menu_id) {
                 this.viewModel.set("menu.parent_menu_id", item.parent_menu_id);
            }
        }
    });


    new EditModule({
        name: "smart::menu::edit",
        containerId: "ctnMenuEdit",
        restUrl: "/menus/",
        modelName: "menu",
        model: {
            menu: {
                id: "",
                system_code: "",
                plugin_code: "",
                label: "",
                route: "",
                controller: "",
                action: "",
                menu_type: "",
                parent_menu_id: ""
            }
        }
    });

})();