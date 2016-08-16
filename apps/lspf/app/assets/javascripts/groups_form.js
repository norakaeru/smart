(function () {

    new smart.SingleEditModule({
        name: "smart::group::edit",
        containerId: "ctnGroupEdit",
        restUrl: "/groups/",
        modelName: "group",
        model: {
            group: {
                id: "",
                name: "",
                code: ""
            }
        }
    });

})();