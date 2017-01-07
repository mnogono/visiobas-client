"use strict"

/**
 * Module to work arrays
 * @namespace lib.arrays
 */

/** link for async scripts */
var lib = lib || {};
lib.arrays = lib.arrays || {};

/**
 * return intersect between a1 and a2
 * @param {Array} a1
 * @param {Array} a2
 * @methodOf lib.arrays
 */
lib.arrays.intersect = function intersect(a1, a2) {
    var o = {};
    for (var i = 0; i < a1.length; ++i) {
        o[a1[i]] = 0;
    }
    for (i = 0; i < a2.length; ++i) {
        if (o[a2[i]] === 0) {
            o[a2[i]] = 1;
        }
    }
    var result = [];
    for (i in o) {
        if (o[i] === 1) {
            result.push(i);
        }
    }

    return result;
}

/**
 * subtract elements a2 from a1
 * @param {Array} a1
 * @param {Array} a2
 * @methodOf lib.arrays
 */
lib.arrays.subtract = function subtract(a1, a2) {
    var o = {};
    for (var i = 0; i < a1.length; ++i) {
        o[a1[i]] = 1;
    }
    for (i = 0; i < a2.length; ++i) {
        if (o[a2[i]] === 1) {
            o[a2[i]] = 0;
        }
    }
    var result = [];
    for (i in o) {
        if (o[i] === 1) {
            result.push(i);
        }
    }

    return result;
}

/**
 * Joins all arrays values in one array
 * @param array... Any amount of arrays to concatenate
 * @return {Array}
 * @fieldOf lib.arrays
 */
lib.arrays.concat = function concat() {
    var arConcat = [];
    for (var i = 0; i < arguments.length; i++) {
        for (var j in arguments[i]) {
            arConcat.push(arguments[i][j]);
        }
    }
    return arConcat;
}

/**
 * removes from array all elements that contain one of specified values in array element
 * (or all elements that not contain it, if reverse parametes is set to true)
 * @param {[]} array array to delete from
 * @param {[]} values values that should be deleted from array
 * @param {String} [key] specifies what key in array element should be checked for values
 * @param {boolean=false} reverse allows to keep elements that have match by value and delete the rest
 * @returns {[]} returns link to array parameter (for convenience purposes)
 * @fieldOf lib.arrays
 */
lib.arrays.removeElements = function removeElements(array, values, key, reverse) {
    if (!array) return;
    if (key) {
        for (var i = 0; i < array.length; i++) {
            var isDelete = false;
            for (var j = 0; j < values.length; j++) {
                if (array[i][key] == values[j]) {
                    isDelete = true;
                    break;
                }
            }
            if ((isDelete && !reverse) || (!isDelete && reverse)) {
                array.splice(i, 1);
                i--;
            }
        }
    } else {
        for (var i = 0; i < array.length; i++) {
            var isDelete = false;
            for (var j = 0; j < values.length; j++) {
                if (array[i] == values[j]) {
                    isDelete = true;
                    break;
                }
            }
            if ((isDelete && !reverse) || (!isDelete && reverse)) {
                array.splice(i, 1);
                i--;
            }
        }
    }
    return array;
}

// -----------------------------------------------------------------------------------------

/**
 * Return the position of the first occurrence of an item in an array,
 * or -1 if the item is not included in the array.
 * If the array is large and already in sort order, pass `true`
 * for **isSorted** to use binary search.
 * @param array
 * @param item
 * @param [isSorted]
 * @return {number}
 * @methodOf lib.arrays
 */
lib.arrays.indexOf = function indexOf(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
        if (typeof isSorted == 'number') {
            i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
        } else {
            i = sortedIndex(array, item);
            return array[i] === item ? i : -1;
        }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
}

/**
 * Return the position of the first occurrence of an item in an array,
 * @param array
 * @param predicate
 * @param context
 * @methodOf lib.arrays
 */
lib.arrays.find = function find(array, predicate, context) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    for (; i < length; i++) if (predicate.call(context, array[i], i, array)) return i;
    return -1;
}

/**
 * Use a comparator function to figure out the smallest index at which
 * an object should be inserted so as to maintain order. Uses binary search.
 * @param array
 * @param obj
 * @param iterator
 * @param context
 * @return {number}
 * @methodOf lib.arrays
 */
lib.arrays.sortedIndex = function sortedIndex(array, obj, iterator, context) {
    iterator = lib.collections._lookupIterator(iterator, context);
    var value = iterator(obj);
    var low = 0, high = array.length;
    while (low < high) {
        var mid = (low + high) >>> 1;
        iterator(array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
}

/**
 * @See sortedIndex
 * Perform binary search of element in array
 *
 * @param {array<number>} array of numbers (sorted already!)
 * @param {number} value
 * @param {boolean} [checkResults=true] check is array[index] === value?, by default true, find existing element in array
 * @param {boolean} [closestIndex=false] correct result index, be default false do not correct index
 * @returns {number}, return -1 if checkResults is true and can't find element in array, otherwise return nearest value index
 *
 * @methodOf lib.arrays
 */
lib.arrays.binarySearch = function binarySearch(array, value, checkResults, closestIndex) {
    checkResults = lib.baseTypes.emptyTo(checkResults, true);
    closestIndex = lib.baseTypes.emptyTo(closestIndex, false);

    var index = sortedIndex(array, value);
    if (index >= array.length) {
        index = array.length - 1;
    }

    if (checkResults) {
        if (array[index] !== value) {
            return -1;
        }
    }

    if (closestIndex) {
        if (array[index] == value || index == 0) {
            return index;
        } else {
            var dif = Math.abs(array[index] - value);
            var difPrev = Math.abs(array[index - 1] - value);
            if (difPrev < dif) {
                --index;
            }
        }
    }

    return index;
}

/**
 *  Calculate sum of all elements in array
 * @param {array<number>} ar
 * @param {number} [lowerBound=0]
 * @param {number} [upperBound=ar.length]
 * @returns {number}
 * @methodOf lib.arrays
 */
lib.arrays.sum = function sum(ar, lowerBound, upperBound) {
    lowerBound = lib.baseTypes.emptyTo(lowerBound, 0);
    upperBound = lib.baseTypes.emptyTo(upperBound, ar.length);
    var sum = 0;
    for (var i = lowerBound; i < upperBound; ++i) {
        sum += ar[i];
    }
    return sum;
}

/**
 *
 * @param {array<number>} ar
 * @param {number} [lowerBound=0]
 * @param {number} [upperBound=ar.length]
 * @methodOf lib.arrays
 */
lib.arrays.average = function average(ar, lowerBound, upperBound) {
    return sum(ar, lowerBound, upperBound) / ar.length;
}

/**
 *
 * @param ar
 * @param fAverage
 * @param lowerBound
 * @param upperBound
 * @returns {number}
 *
 * @methodOf lib.array
 */
lib.arrays.squareDifference = function squareDifference(ar, fAverage, lowerBound, upperBound) {
    lowerBound = lib.baseTypes.emptyTo(lowerBound, 0);
    upperBound = lib.baseTypes.emptyTo(upperBound, ar.length);
    var s = 0;
    for (var i = lowerBound; i < upperBound; ++i) {
        s += (ar[i] - fAverage) * (ar[i] - fAverage);
    }
    return s;
}

/**
 * Calculation of standard deviation
 * @param ar
 * @param fAverage
 * @param lowerBound
 * @param upperBound
 * @returns {number}
 *
 * @methodOf lib.array
 */
lib.arrays.standardDeviation = function standardDeviation(ar, fAverage, lowerBound, upperBound) {
    lowerBound = lib.baseTypes.emptyTo(lowerBound, 0);
    upperBound = lib.baseTypes.emptyTo(upperBound, ar.length);
    fAverage = lib.baseTypes.emptyTo(fAverage, average(ar, lowerBound, upperBound));
    return Math.sqrt(squareDifference(ar, fAverage, lowerBound, upperBound) / (upperBound - lowerBound - 1));
}