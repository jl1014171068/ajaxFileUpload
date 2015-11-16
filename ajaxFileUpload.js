/**
 * @file ${FILE_NAME}. Created by PhpStorm.
 * @desc ${FILE_NAME}.
 *
 * @author acrazing
 * @since 15/11/13 1:09PM
 * @version 1.0.0
 */
(function (w, d, $) {
    var i,
        j,
        extend = function (obj, ext) {
            for (i = 1; i < arguments.length; i++)
                for (j in arguments[i]) if (arguments[i].hasOwnProperty(j))
                    obj[j] = arguments[i][j];
            return obj;
        },
        methods = {
            POST: 'POST',
            GET: 'GET',
            PUT: 'PUT',
            DELETE: 'DELETE',
            HEADER: 'HEADER',
            OPTIONS: 'OPTIONS',
            PATCH: 'PATCH',
            TRACE: 'TRACE'
        },
        enctypes = {
            BLOB: 'application/octet-stream',
            FORM_DATA: 'multipart/form-data',
            URL_ENCODED: 'application/x-www-form-urlencoded',
            JSON: 'application/json'
        },
        responseTypes = {
            TEXT: 'text/plain',
            JSON: 'application/json',
            XML: 'application/xml',
            BLOB: 'application/octet-stream'
        },
        AjaxSubmit,
        s = {
            method: methods.POST,
            enctype: enctypes.FORM_DATA,
            type: responseTypes.JSON,
            extraData: [],
            timeout: 30,
            onUploadProgress: null,
            onUploadLoadStart: null,
            onUploadLoadEnd: null,
            onUploadLoad: null,
            onUploadAbort: null,
            onUploadError: null,
            onUploadTimeout: null,
            onProgress: null,
            onLoadStart: null,
            onLoadEnd: null,
            onLoad: null,
            onAbort: null,
            onError: null,
            onTimeout: null,
            success: null,
            error: null,
            complete: null,
            context: w
        };

    /**
     *
     * @param {HTMLFormElement} form
     * @returns {Array}
     */
    function serializeArray(form) {
        var name, type, result = [],
            i, field,
            add = function (value) {
                if (value.forEach) return value.forEach(add);
                result.push({name: name, value: value})
            };
        for (i in form.elements) {
            if (form.elements.hasOwnProperty(i)) {
                field = form.elements[i];
                type = field.type;
                name = field.name;
                if (name && field.nodeName.toLowerCase() != 'fieldset'
                    && !field.disabled && type != 'submit' && type != 'reset'
                    && type != 'button' && type != 'file'
                    && ((type != 'radio' && type != 'checkbox') || field.checked))
                    add(field.value)
            }
        }
        return result
    }

    /**
     * form Zepto
     * @param {HTMLFormElement} form
     * @returns {string}
     */
    function serialize(form) {
        var result = [];
        serializeArray(form).forEach(function (elm) {
            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        });
        return result.join('&')
    }

    /**
     *
     * @param {HTMLElement|HTMLInputElement|HTMLFormElement|string} form
     * @param {string} url
     * @param {Object|Function} settings
     * @param {string} [type]
     * @constructor
     */
    AjaxSubmit = function (form, url, settings, type) {
        var options = {},
            name,
            data = '',
            xhr,
            response,
            i;
        typeof form === 'string' && (form = d.getElementById(form));
        typeof settings === 'function' && ((options.success = settings) && (settings = {}));
        typeof type === 'string' && (options.type = type);
        extend(options, s, settings);
        name = form.name;
        if (options.enctype === enctypes.BLOB) {
            if (form instanceof HTMLInputElement && form.type === 'file') {
                if (form.files.length > 0) {
                    data = form.files[0];
                }
            } else {
                data = new Blob([form.value || '']);
            }
        } else if (options.enctype === enctypes.FORM_DATA) {
            if (form instanceof HTMLFormElement) {
                data = new FormData(form);
            } else {
                data = new FormData();
                if (form instanceof HTMLInputElement && form.type === 'file') {
                    if (form.files.length > 0) {
                        if (name.lastIndexOf('[]') === 0) {
                            name = name.substr(0, name.length - 2);
                            for (i = 0; i < form.files.length; i++) {
                                data.append(name + '[' + i + ']', form.files[i]);
                            }
                        } else {
                            data.append(name, form.files[0]);
                        }
                    }
                } else {
                    data.append(name, form.value);
                }
            }
        } else {
            if (form instanceof HTMLFormElement) {
                data = serialize(form);
            } else {
                data = encodeURIComponent(name) + '=' + encodeURIComponent(form.value);
            }
        }
        xhr = new XMLHttpRequest();
        xhr.open(options.method, url);
        xhr.upload.onabort = options.onUploadAbort;
        xhr.upload.onerror = options.onUploadError;
        xhr.upload.onload = options.onUploadLoad;
        xhr.upload.onloadstart = options.onUploadLoadStart;
        xhr.upload.onloadend = options.onUploadLoadEnd;
        xhr.upload.ontimeout = options.onUploadTimeout;
        xhr.upload.onprogress = options.onUploadProgress;
        xhr.onabort = options.onAbort;
        xhr.onerror = options.onError;
        xhr.onload = options.onLoad;
        xhr.onloadstart = options.onLoadStart;
        xhr.onloadend = options.onLoadEnd;
        xhr.ontimeout = options.onTimeout;
        xhr.onprogress = options.onProgress;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status < 300) {
                    if (options.type === responseTypes.XML) {
                        response = xhr.responseXML
                            ? xhr.responseXML
                            : (new DOMParser()).parseFromString(xhr.response || xhr.responseText, 'text/xml');
                    } else if (options.type === responseTypes.JSON) {
                        response = JSON.parse(xhr.response || xhr.responseText);
                    }
                    options.success && options.success.call(options.context, response);
                } else {
                    options.error && options.error.call(options.context, xhr, xhr.status, xhr.response);
                }
            }
        };
        this.xhr = xhr;
        this.options = options;
        this.data = data;
    };
    AjaxSubmit.prototype.send = function () {
        this.xhr.send(this.data);
        return this.xhr;
    };
    extend(AjaxSubmit, enctypes, methods, responseTypes);
    w.AjaxSubmit = AjaxSubmit;
    if ($) {
        $.fn.ajaxSubmit = function (url, settings, type) {
            return this.length > 0 ? new AjaxSubmit(this.get(0), url, settings, type).send() : this;
        };
    }
})(window, document, window.Zepto || window.jQuery || undefined);