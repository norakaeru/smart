(function () {

    new smart.SingleEditModule({
        name: "smart::role::edit",
        containerId: "ctnRoleEdit",
        restUrl: "/roles/",
        modelName: "role",
        model: {
            role: {
                id: "",
                name: "",
                code: ""
            }
        }
    });

})();