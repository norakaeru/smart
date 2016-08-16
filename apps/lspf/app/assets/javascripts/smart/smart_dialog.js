(function () {
    if (!window.smart) {
        window.smart = {};
    }

    smart.confirm = function(options) {
        options = $.extend(true, {
            message: "",
            buttons: [{
                name: "确认",
                click: function () {
                }
            }, {
                name: "取消",
                click: function () {
                }
            }]
        }, options);

        var $confirmDialog = $("<div id='confirmDialog'></div>");

        $confirmDialog.kendoDialog(options).data("kendoDialog").center().open();

    };

    smart.alert = function(options) {
        options = $.extend(true, {
            message: "",
            buttons: [{
                name: "确认",
                click: function () {
                }
            }]
        }, options);

        var $alertDialog = $("<div id='alertDialog'></div>");

        $alertDialog.kendoDialog(options).data("kendoDialog").center().open();
    };

})();