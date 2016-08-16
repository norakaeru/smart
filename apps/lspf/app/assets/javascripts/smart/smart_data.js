(function () {
    if (!window.smart) {
        window.smart = {};
    }

    if (!smart.Data) {
        smart.Data = {};
    }

    var data = smart.Data;

    data._getData = function (selector) {
        var array = [];
        $(selector).children('option').each(function (i, obj) {
            array.push({text: $(obj).text(), value: $(obj).val()});
        });
        return array;
    };

    //基础数据/港口
    data.getPortData = function () {
        if (!portData) {
            var portData = data._getData('#basic_data_port');
        }
        return portData;
    };

    //基础数据/航线类型
    data.getRouteTypeData = function () {
        if (!routeTypeData) {
            var routeTypeData = data._getData('#basic_data_route_type');
        }
        return routeTypeData;
    };

})();

