(function () {

    new smart.SingleEditModule({
        name: "voyage::route_type::edit",
        containerId: "ctnVoyageRouteTypeEdit",
        restUrl: "/voyage/route_types/",
        modelName: "route_type",
        model: {
            route_type: {
                id: "",
                type_code: "",
                type_name: "",
                operator: "",
                remark: ""
            }
        }
    });

})();