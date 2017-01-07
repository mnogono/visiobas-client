"use strict"

/**
 * @namespace lib.objects
 * module working with js objects
 */

var lib = lib || {};
lib.objects = lib.objects || {};

/**
 * Parse json object from string
 * @param sJSON
 * @returns {Object|Array} return js object or null
 * @fieldOf lib.objects
 */
lib.objects.parse = function (sJSON) {
    try {
        return JSON.parse(sJSON);
    } catch (pass) {
        return null;
    }
}

if (Object.create) {
    /**
     * Extend object
     * @param {Function} child child
     * @param {Function} parent parent
     * @fieldOf lib.objects
     */
    lib.objects.extend = function (child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        child.superclass = parent.prototype;
    }
} else {
    lib.objects.extend = function (child, parent) {
        var F = function () {};
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        child.superclass = parent.prototype;
    }
}

/**
 * copy all properties from oSrc into oDest
 * @param {object} oDest destination object
 * @param {object} oSrc source object
 * @fieldOf lib.objects
 */
lib.objects.merge = function (oDest, oSrc) {
    for (var itProp in oSrc) {
        oDest[itProp] = oSrc[itProp];
    }
	return oDest;
}

/**
 * Convert js object unto json string
 * @param {Object} obj object to be converted into json
 * @param replacer
 * @param space
 * @return {String}
 * @fieldOf lib.objects
 */
lib.objects.stringify = function (obj, replacer, space) {
    try {
        return JSON.stringify(obj, replacer, space);
    } catch (e) {
        return "";
    }
}

/**
 * Create copy of object
 * @param {Object} obj copy object
 * @returns {*}
 * @methodOf lib.objects
 */
lib.objects.clone = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }
    return copy;
}

/**
 * Create full copy of object
 * @param {object} obj
 * @returns {*}
 * @methodOf lib.objects
 */
lib.objects.deepClone = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            if ("object" == typeof obj[attr]) {
                copy[attr] = clone(obj[attr]);
            } else {
                copy[attr] = obj[attr];
            }
        }
    }
    return copy;
}

/*
 str - input string
 len - max length of each word
 */
lib.objects.splitString2Words = function (str, len) {
    return str.replace(new RegExp('(\\w{' + len + '})\\B', 'gi'), '$1 ');
}

/*
 long number format like ### ### ## (separate 3 number)
 */
lib.objects.formatNumber = function (number) {
    return number.toString().split(/(?=(?:\d{3})+(?!\d))/).join(" ");
}

/**
 * Is a given value an array?
 * @param obj
 * @return {*}
 * @methodOf lib.objects
 */
lib.objects.isArray = function (obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

/**
 * Is a given variable an object?
 * @param obj
 * @return {boolean}
 * @methodOf lib.objects
 */
lib.objects.isObject = function (obj) {
    return obj === Object(obj);
}

/**
 * Optimize `isFunction` if appropriate.
 * @param obj
 * @return {boolean}
 * @methodOf lib.objects
 */
lib.objects.isFunction = function (obj) {
    return typeof obj === 'function';
}

/**
 * Shortcut function for checking if an object has a given property directly
 * on itself (in other words, not on a prototype).
 * @param obj
 * @param key
 * @return {boolean|*}
 * @methodOf lib.objects
 */
lib.objects.has = function (obj, key) {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Retrieve the names of an object's properties.
 *
 * @param obj
 * @return {*}
 * @methodOf lib.objects
 */
lib.objects.keys = function (obj) {
    if (!lib.objects.isObject(obj)) {
        return [];
    }
    /*
    revert prev version of function
    if (Object.keys) {
        return Object.keys(obj);
    }
    */
    var keys = [];
    for (var key in obj) if (lib.objects.has(obj, key)) keys.push(key);
    return keys;
}

/**
 * Retrieve the values of an object's properties.
 * @param obj
 * @return {Array}
 * @methodOf lib.objects
 */
lib.objects.values = function (obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
        values[i] = obj[_keys[i]];
    }
    return values;
}

/**
 *
 * @param key
 * @return {Function}
 * @methodOf lib.objects
 */
lib.objects.property = function (key) {
    return function (obj) {
        return obj[key];
    };
}

/**
 * return function body
 * @param {function} fn
 * @returns {string}
 * @methodOf lib.objects
 */
lib.objects.functionBody = function (fn) {
    if (lib.baseTypes.isNewJsEngine()) {
        return fn.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1];
    } else {
        return fn.toString().match(/function[^{]+\{([\s\S]*)\}/)[1];
    }
}