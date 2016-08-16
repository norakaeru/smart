(function () {

    new smart.SingleEditModule({
        name: "voyage::port::edit",
        containerId: "ctnVoyagePortEdit",
        restUrl: "/voyage/ports/",
        modelName: "port",
        model: {
            port: {
                id: "",
                port_code: "",
                port_name_cn: "",
                port_name_en: "",
                operator: "",
                remark: ""
            }
        }
    });

})();