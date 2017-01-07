"use strict"

/**
 * set of assert functions
 */

/** link for async scripts */
var lib = lib || {};
lib.assert = lib.assert || {};

/**
 *
 * @param a1
 * @param a2
 * @returns {boolean}
 * @methodOf lib.assert
 */
lib.assert.arrayEquals = function (a1, a2) {
    if (lib.baseTypes.isNull(a1)) {
        return false;
    }
    if (lib.baseTypes.isNull(a2)) {
        return false;
    }
    if (!lib.baseTypes.isArray(a1)) {
        return false;
    }
    if (!lib.baseTypes.isArray(a2)) {
        return false;
    }
    if (a1.length != a2.length) {
        return false;
    }

    return lib.collections.every(a1, function (e, i) {
        if (lib.baseTypes.isObject(e)) {
            return lib.assert.objectEquals(e, a2[i]);
        } else if (lib.baseTypes.isArray(e)) {
            return lib.assert.arrayEquals(e, a2[i]);
        } else {
            return e === a2[i];
        }
    });
}

/**
 *
 * @param v1
 * @param v2
 * @returns {boolean}
 * @methodOf lib.assert
 */
lib.assert.equals = function (v1, v2) {
    return v1 === v2;
}

/**
 *
 * @param o1
 * @param o2
 * @returns {boolean}
 * @methodOf lib.assert
 */
lib.assert.objectEquals = function (o1, o2) {
    if (!lib.baseTypes.isObject(o1)) {
        return false;
    }
    if (!lib.baseTypes.isObject(o2)) {
        return false;
    }
    if (lib.objects.keys(o1).length != lib.objects.keys(o2).length) {
        return false;
    }

    return lib.collections.every(o1, function (e, k) {
        if (lib.baseTypes.isArray(e)) {
            return lib.assert.arrayEquals(e, o2[k]);

        } else if (lib.baseTypes.isObject(e)) {
            return lib.assert.objectEquals(e, o2[k]);

        } else {
            return e === o2[k];
        }
    });
}
