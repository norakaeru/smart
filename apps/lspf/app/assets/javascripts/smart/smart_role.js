(function () {
    if (!window.smart) {
        window.smart = {};
    }

    smart.user = {
        _permissions: [],
        _roles: [],

        hasRole: function (codes, controller) {
            return this.hasRoles(codes.split(','), controller);
        },

        hasRoles: function (codes, controller) {
            var self = this;
            for (var i = 0; i < codes.length; i++) {
                if (self._hasRole(codes[i], controller)) {
                    return true;
                }
            }
            return false;
        },

        _hasRole: function (code, controller) {
            var self = this;
            var roles = self._permissions;
            for (var i = 0; i < roles.length; i++) {
                var role = roles[i];
                if (role.code == $.trim(code) && role.controller == controller) {
                    return true;
                }
            }
            return false;
        },

        getStoredData: function () {
            var self = this;
            var json = localStorage.getItem('user_group_settings');
            var settings = $.parseJSON(json);

            for (var i = 0; i < settings.length; i++) {
                self._permissions = self._permissions.concat(settings[i].permissions);
                self._roles = self._roles.concat(settings[i].roles);
            }
        },

        storeRolesData: function () {
            var json = $('#user_group_settings').text();
            if (json && localStorage) {
                localStorage.setItem('user_group_settings', json);
            }
        }
    };

    $(function () {
        smart.user.storeRolesData();
        smart.user.getStoredData();
    });
})();
