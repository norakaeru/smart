(function () {
    if (!window.smart) {
        window.smart = {};
    }

    smart.Enums = {};

    smart.Enum = function (className, data) {
        this.data = data;
        smart.Enums[className] = this;
    };

    smart.Enum.prototype = {
        getData: function () {
            return [].concat(this.data);
        },
        getText: function (value) {
            var enumArr = this.getData();
            for (var i = 0; i < enumArr.length; i++) {
                if (enumArr[i].value === value || enumArr[i].value + '' === value) {
                    return enumArr[i].text;
                }
            }
            return '--请选择--';
        },
        getValue: function (text) {
            var enumArr = this.getData();
            for (var i = 0; i < enumArr.length; i++) {
                if (enumArr[i].text === text) {
                    return enumArr[i].value;
                }
            }
            return '';
        }
    };

    new smart.Enum('BasicData::PortType', [
        {value: 0, text: "始发港"} ,
        {value: 1, text: "目的港"},
        {value: 2, text: "中转港"}
    ]);

})();


