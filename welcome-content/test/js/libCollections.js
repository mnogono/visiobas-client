"use strict"

/**
 * functions for working with collections (objects or arrays)
 * @namespace lib.collections
 * @author litvin
 */

var lib = lib || {};
lib.collections = lib.collections || {};

/**
 * The cornerstone, an `each` implementation.
 * Handles raw objects in addition to array-likes. Treats all
 * sparse array-likes as if they were dense.
 * @param {object|Array} obj
 * @param {function(item: *, index: *, list: *)} iterator
 * @param {object=} context
 * @return {*} returns object that was passed to function
 * @methodOf lib.collections
 */
lib.collections.each = function (obj, iterator, context) {
    if (obj == null) return obj;
    if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; ++i) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        var keys = lib.objects.keys(obj);
        for (var i = 0, length = keys.length; i < length; ++i) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
    }
    return obj;
}

/**
 * each in reverse orders
 * @param obj
 * @param iterator
 * @param context
 * @returns {*}
 * @methodOf lib.collections
 */
lib.collections.each_r = function (obj, iterator, context) {
    if (obj == null) return obj;
    if (obj.length === +obj.length) {
        for (var i = obj.length - 1; i >= 0; --i) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        var keys = lib.objects.keys(obj);
        for (var i = keys.length - 1; i >= 0; --i) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
    }
    return obj;
}

/**
 * Return the first value which passes a truth test.
 * @param {object|Array} obj
 * @param {function(value: object, index: object, list: object)} predicate
 * @param {object=} context
 * @return {object|undefined} first found value or undefined if no value found
 * @methodOf lib.collections
 */
lib.collections.find = function (obj, predicate, context) {
    var result;
    some(obj, function (value, index, list) {
        if (predicate.call(context, value, index, list)) {
            result = value;
            return true;
        }
    });
    return result;
}

/**
 * Return all the elements that pass a truth test.
 * @param {object|Array} obj
 * @param {function(value: object, index: object, list: object)} predicate
 * @param {object=} context
 * @return {Array}
 * @methodOf lib.collections
 */
lib.collections.filter = function (obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    lib.collections.each(obj, function (value, index, list) {
        if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
}

/**
 * Determine whether all of the elements match a truth test.
 * @param {object|Array} obj
 * @param {function(value: object, index: object, list: object)=} predicate
 * @param {object=} context
 * @return {boolean}
 * @methodOf lib.collections
 */
lib.collections.every = function (obj, predicate, context) {
    predicate || (predicate = _identity);
    var result = true;
    if (obj == null) return result;
    lib.collections.each(obj, function (value, index, list) {
        if (!(result = result && predicate.call(context, value, index, list))) {
            return breaker;
        }
    });
    return !!result;
}

/**
 * Determine if at least one element in the object matches a truth test.x
 * @param {object|Array} obj
 * @param {function(value: object, index: object, list: object)=} predicate
 * @param {object=} context
 * @return {boolean}
 * @methodOf lib.collections
 */
lib.collections.some = function (obj, predicate, context) {
    predicate || (predicate = _identity);
    var result = false;
    if (obj == null) return result;
    lib.collections.each(obj, function (value, index, list) {
        if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
}

/**
 * Determine if the array or object contains a given value (using `===`).
 * @param {object|Array} obj
 * @param {*} target
 * @return {boolean}
 * @methodOf lib.collections
 */
lib.collections.contains = function (obj, target) {
    if (obj == null) return false;
    if (obj.length === +obj.length) return lib.arrays.indexOf(obj, target) >= 0;
    return lib.collections.some(obj, function (value) {
        return value === target;
    });
}

/**
 * Return the maximum element or (element-based computation).
 * @param {object|Array} obj
 * @param {function(item: object, index: number|string, list: object)=} iterator optional if array passed as obj
 * @param {object=} context
 * @return {number} -Infinity if there is no max
 * @methodOf lib.collections
 */
lib.collections.max = function (obj, iterator, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (!iterator && lib.objects.isArray(obj)) {
        for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value > result) {
                result = value;
            }
        }
    } else {
        lib.collections.each(obj, function (value, index, list) {
            computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
                result = value;
                lastComputed = computed;
            }
        });
    }
    return result;
}

/**
 * Return the minimum element (or element-based computation).
 * @param {object|Array} obj
 * @param {function(item: object, index: number|string, list: object)=} iterator optional if array passed as obj
 * @param {object=} context
 * @return {number} Infinity if there is no min
 * @methodOf lib.collections
 */
lib.collections.min = function (obj, iterator, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (!iterator && lib.objects.isArray(obj)) {
        for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value < result) {
                result = value;
            }
        }
    } else {
        lib.collections.each(obj, function (value, index, list) {
            computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
                result = value;
                lastComputed = computed;
            }
        });
    }
    return result;
}

/**
 * Safely create a real, live array from anything iterable.
 * @param {object|Array} obj
 * @return {Array}
 * @methodOf lib.collections
 */
lib.collections.toArray = function (obj) {
    if (!obj) return [];
    if (lib.objects.isArray(obj)) return Array.prototype.slice.call(obj);
    if (obj.length === +obj.length) return lib.collections.map(obj, _identity);
    return lib.objects.values(obj);
}

/**
 * Return the number of elements in collection.
 * @param {object|Array} obj
 * @return {number}
 * @methodOf lib.collections
 */
lib.collections.size = function (obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : lib.objects.keys(obj).length;
}

/**
 * Return the results of applying the iterator to each element.
 * @param {object|Array} obj
 * @param {function(item: object, index: number|string, list: object)} iterator
 * @param {object=} context
 * @return {Array}
 * @methodOf lib.collections
 */
lib.collections.map = function (obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    lib.collections.each(obj, function (value, index, list) {
        results.push(iterator.call(context, value, index, list));
    });
    return results;
}

//----------------------------------- private --------------------------------------------------------

/**
 * Establish the object that gets returned to break out of a loop iteration.
 * @fieldOf lib.collections
 */
var breaker = {};

/**
 * Keep the identity function around for default iterators.
 * @param value
 * @return {*}
 * @private
 * @methodOf lib.collections
 */
function _identity(value) {
    return value;
}

/**
 * An internal function to generate lookup iterators.
 * @param value
 * @param context
 * @return {*}
 * @private
 * @methodOf lib.collections
 */
function _lookupIterator(value, context) {
    if (value == null) return _identity;
    if (!lib.objects.isFunction(value)) return lib.objects.property(value);
    if (!context) return value;
    return function () {
        return value.apply(context, arguments);
    };
}

/**
 * reduce function convert from array of values into signle value
 * @param {Array} obj
 * @param {function(prevValue, currentValue, currentIndex, array)} callback
 * @param {*} init initial value
 * @param {object} [context]
 * @methodOf lib.collections
 */
lib.collections.reduce = function (obj, callback, init, context) {
    if (lib.baseTypes.isArray(obj)) {
        for (var i = 0, length = obj.length; i < length; ++i) {
            init = callback.call(context, init, obj[i], i, obj);
        }
    } else if (lib.baseTypes.isObject(obj)) {
        var keys = lib.objects.keys(obj);
        for (i = 0, length = keys.length; i < length; ++i) {
            init = callback.call(context, init, obj[keys[i]], keys[i], obj);
        }
    }

    return init;
}

// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/) {
        'use strict';
        if (this === null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length == 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}