(function () {

    if (!window.smart) {
        window.smart = {};
    }

    if (!smart.modules) {
        smart.modules = {};
    }

    smart.Module = kendo.Class.extend({

        init: function (options) {
            var self = this;

            $.each(["containerId", "name", "restUrl"], function (index, item) {
                if (!options[item]) {
                    alert("smart.Module创建失败，缺少必要参数：" + item);
                }
                self[item] = options[item];
            });

            this.options = options;
            smart.modules[this.name] = this;

            $(function () {
                self.ready.call(self);
            });
        },

        ready: function () {
            this.container = $("#" + this.containerId);
        },

        $: function (selector) {
            return this.container.find(selector);
        }
    });

    smart.Module.getModule = function (name) {
        return smart.modules[name];
    };

})();
