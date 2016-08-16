(function () {

    new smart.SingleEditModule({
        name: "smart::user::edit",
        containerId: "ctnUserEdit",
        restUrl: "/users/",
        modelName: "user",
        model: {
            user: {
                id: "",
                name: "",
                account: "",
                email: '',
                password: '',
                password_confirmation: ''
            }
        }
    });

})();