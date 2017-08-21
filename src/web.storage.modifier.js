(function (window) {
    var win = window, doc = win['document'];

    function Cookie() {
        function hasCookie() {
            return typeof document.cookie === "string" && document.cookie !== "";
        }

        Cookie.prototype.setCookie = function (key, value) {
            var cookies = this.getCookies();
            var cookieString = "";
            for (var k in cookies) {
                if (k !== key)
                    cookieString += k + "=" + cookies[k] + ";";
            }
            doc['cookie'] = key + "=" + value;
            doc['cookie'] = cookieString;
        };

        Cookie.prototype.deleteCookie = function (key) {
            doc['cookie'] = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };

        Cookie.prototype.getCookies = function () {
            var cookies = hasCookie() ? document.cookie.split(";") : [];

            if (cookies.length > 0) {
                for (var i = 0; i < cookies.length; i++) {
                    var key = cookies[i].substring(0, cookies[i].indexOf('=')).trim();
                    var value = cookies[i].substring(cookies[i].indexOf('=') + 1);
                    delete cookies[i];
                    cookies[key] = value;
                }
            }

            return cookies;
        };
    }

    function LocalStorage() {
        var cookieObj = new Cookie();

        function getStorage() {
            if (isLocalStorageNameSupported()) {
                return win['localStorage'];
            }
            return cookieObj.getCookies();
        }

        function isLocalStorageNameSupported() {
            try {
                win['localStorage'].setItem("localStorage", 1);
                win['localStorage'].removeItem("localStorage");
                return true;
            } catch (e) {
                return false;
            }
        }

        function isJSON(v) {
            if (typeof v == 'undefined') return false;
            try {
                if (typeof v == 'string') JSON.parse(v);
                else JSON.stringify(v);
                return true;
            } catch (e) {
                return false;
            }
        }

        var obj = getStorage();

        LocalStorage.prototype.setItem = function (key, value) {

            if (isJSON(value)) {
                obj[key] = JSON.stringify(value);
            } else {
                obj[key] = value;
            }

            if (!isLocalStorageNameSupported()) {
                cookieObj.setCookie(key, value);
            }
        };

        LocalStorage.prototype.getItem = function (key) {
            var value = obj[key];
            if (isJSON(value)) {
                return JSON.parse(value);
            }

            return value;
        };

        LocalStorage.prototype.deleteItem = function (key) {
            for (var k in obj) {
                if (k == key) {
                    delete obj[key];
                }
            }

            if (!isLocalStorageNameSupported()) {
                cookieObj.deleteCookie(key);
            }
        };
    }

    window.LocalStorage = new LocalStorage();

})(window);