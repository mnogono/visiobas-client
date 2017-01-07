"use strict"

/**
 * @namespace lib.baseTypes
 * modules working with strings, numbers
 */

/** link for async scripts */
//var lib = null;
var lib = lib || {};
lib.baseTypes = lib.baseTypes || {};

/** @fieldOf lib.baseTypes */
lib.baseTypes.MIN2MS = 60 * 1000;

/** @fieldOf lib.baseTypes */
lib.baseTypes.MS2MIN = 1.0 / lib.baseTypes.MIN2MS;

/** @fieldOf lib.baseTypes */
lib.baseTypes.MSEC2MIN = lib.baseTypes.MS2MIN;

/** @fieldOf lib.baseTypes */
lib.baseTypes.MSEC2SEC = 0.001;

/** @fieldOf lib.baseTypes */
lib.baseTypes.SEC2MSEC = 1000;

/** @fieldOf lib.baseTypes */
lib.baseTypes.MIN2MSEC = lib.baseTypes.MIN2MS;

/** @fieldOf lib.baseTypes */
lib.baseTypes.MIN2SEC = 60;

/** @fieldOf lib.baseTypes */
lib.baseTypes.HOUR2MSEC = 60 * 60 * 1000;

/** @filedOf lib.baseTypes */
lib.baseTypes.HOUR2SEC = 60 * 60;

/** @fieldOf lib.baseTypes */
lib.baseTypes.SEC2MIN = 1 / 60;

/** @fieldOf lib.baseTypes */
lib.baseTypes.SEC2HOUR = 1 / 3600;

/** @fieldOf lib.baseTypes */
lib.baseTypes.DAY2MS = lib.baseTypes.HOUR2MSEC * 24;

/** @fieldOf lib.baseTypes */
lib.baseTypes.months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** @fieldOf lib.baseTypes */
lib.baseTypes.monthsShort = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** @fieldOf lib.baseTypes */
lib.baseTypes.days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** @fieldOf lib.baseTypes */
lib.baseTypes.daysShort = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 *
 * @param {*} test
 * @param {*} defaultValue
 * @methodOf lib.baseTypes
 */
lib.baseTypes.nullTo = function (test, defaultValue) {
    if (isNull(test)) {
        return defaultValue;
    }
    return test;
}

/**
 * round value
 * @param {number} value
 * @param {number} digits count of digits
 * @methodOf lib.baseTypes
 */
lib.baseTypes.round = function (value, digits) {
    var k = Math.pow(10, digits);
    return Math.round(value * k) / k;
}


/**
 * Check is variant is number
 * 123 or 123.123 or '123.123' or (null - equal to 0) it is a numbers, otherwise no
 * @param {*} variant
 * @return {boolean} result of checks
 * @fieldOf lib.baseTypes
 */
lib.baseTypes.isNumber = function (variant) {
    return typeof(variant) != "boolean" && typeof(variant) != "string" && !isNaN(variant);
}

/** @private */
var __escapeHTMLSettings = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};

/**
 * Escape html tokens
 * @param {String} str string to escape
 * @returns {String}
 */
lib.baseTypes.escapeHTML = function (str) {
    return str.replace(/&|<|>|"|'/g, function (match) {
        return __escapeHTMLSettings[match]
    });
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
/**
 *
 * @param {String} text template. using &lt;%= for print some value %> or &lt;% put javascript here %> or &lt;%- ignore, like a comment %>
 * @param {Object} data
 * @param {Object} [oError=null] output javascript error object
 * @returns {String} return result of process template or null
 * @fieldOf lib.baseTypes
 *
 * @example
 * lib.baseTypes.template("Hello user <%= name %>", {name:"Pupkin"}); result: "Hello user Pupkin"
 * lib.baseTypes.template("<% for (var i = 0; i < 10; ++i) {%> <%=i %> <% } %>", {}); result: "1 2 3 4 5 6 7 8 9 "
 * lib.baseTypes.template("<%-sHTML%>", {sHTML: "<html></html>"}); result will be escaped html tokens "&lt;html&gt;&lt;/html&gt;"
 */
lib.baseTypes.template = function (text, data, oError) {
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    var templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function (match) {
        return '\\' + escapes[match];
    };
    settings = templateSettings;

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p.push('";
    text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;

        if (escape) {
            source += "');\n__p.push(((__t=(" + escape + "))==null?'':lib.baseTypes.escapeHTML(__t)));\n__p.push('";
        } else if (interpolate) {
            source += "');\n__p.push(((__t=(" + interpolate + "))==null?'':__t));\n__p.push('";
        } else if (evaluate) {
            source += "');\n" + evaluate + "\n__p.push('";
        }

        // Adobe VMs need the match returned to produce the correct offest.
        return match;
    });
    source += "');\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    //source = "var __t,__p='',__j=Array.prototype.join," +
    source = "var __t,__p=[],__j=Array.prototype.join," +
        "print=function(){__p.push(__j.call(arguments,''));};\n" +
        source + "return __p.join(\"\");\n";

    try {
        var render = new Function(settings.variable || 'obj', 'lib', source);
    } catch (e) {
        oError = e;
        return null;
    }

    if (data) return render(data, lib);
}

/**
 * right trim
 * @param {string} str
 * @returns {string}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.rtrim = function (str) {
    return str.replace(/\s+$/, '');
}

/**
 * left trim
 * @param {string} str
 * @returns {string}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.ltrim = function (str) {
    return str.replace(/^\s+/, '');
}

/**
 * left and right trim
 * @param {string} str
 * @returns {string}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Replace all sFindTokens in sText into sReplaceToken
 * @param {string} sFindToken find token in sText
 * @param {string} sReplaceToken replace token in sText
 * @param {string} sText original text
 * @returns {string}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.replaceAll = function (sFindToken, sReplaceToken, sText) {
    return sText.replace(new RegExp(sFindToken, "g"), sReplaceToken);
}

/**
 *
 * @param text
 * @methodOf lib.baseTypes
 */
lib.baseTypes.screenRegExpSymbols = function (text) {
    var t = text.replace(new RegExp("\\[", "g"), "\\[");
    t = t.replace(new RegExp("\\]", "g"), "\\]");
    t = t.replace(new RegExp("\\$", "g"), "\\$");
    t = t.replace(new RegExp("\\+", "g"), "\\+");
    return t;
}

/**
 * JavaScript printf/sprintf functions.
 *
 * This code is unrestricted: you are free to use it however you like.
 *
 * The functions should work as expected, performing left or right alignment,
 * truncating strings, outputting numbers with a required precision etc.
 *
 * For complex cases, these functions follow the Perl implementations of
 * (s)printf, allowing arguments to be passed out-of-order, and to set the
 * precision or length of the output based on arguments instead of fixed
 * numbers.
 *
 * See http://perldoc.perl.org/functions/sprintf.html for more information.
 *
 * Implemented:
 * - zero and space-padding
 * - right and left-alignment,
 * - base X prefix (binary, octal and hex)
 * - positive number prefix
 * - (minimum) width
 * - precision / truncation / maximum width
 * - out of order arguments
 *
 * Not implemented (yet):
 * - vector flag
 * - size (bytes, words, long-words etc.)
 *
 * Will not implement:
 * - %n or %p (no pass-by-reference in JavaScript)
 *
 * @version 2007.04.27
 * @author Ash Searle
 *
 *
 *     example 1: sprintf("%01.2f", 123.1);
 *     returns 1: 123.10
 *
 *     example 2: sprintf("[%10s]", 'monkey');
 *     returns 2: '[    monkey]'
 *
 *     example 3: sprintf("[%'#10s]", 'monkey');
 *     returns 3: '[####monkey]'
 *
 *     example 4: sprintf("%d", 123456789012345);
 *     returns 4: '123456789012345'*
 *
 * format specification
 * http://msdn.microsoft.com/en-us/library/ybk95axf(v=vs.71).aspx
 * http://msdn.microsoft.com/en-us/library/56e442dc(v=vs.71).aspx
 * @methodOf lib.baseTypes
 */
lib.baseTypes.sprintf = function () {
    function pad(str, len, chr, leftJustify) {
        var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;

    }

    function justify(value, prefix, leftJustify, minWidth, zeroPad) {
        var diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, ' ', leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    }

    function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0;
        prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    }

    function formatString(value, leftJustify, minWidth, precision, zeroPad) {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad);
    }

    var a = arguments, i = 0, format = a[i++];
    return format.replace(sprintf.regex, function (substring, valueIndex, flags, minWidth, _, precision, type) {
        if (substring == '%%') return '%';

        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false;
        for (var j = 0; flags && j < flags.length; j++) switch (flags.charAt(j)) {
            case ' ':
                positivePrefix = ' ';
                break;
            case '+':
                positivePrefix = '+';
                break;
            case '-':
                leftJustify = true;
                break;
            case '0':
                zeroPad = true;
                break;
            case '#':
                prefixBaseX = true;
                break;
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values

        if (!minWidth) {
            minWidth = 0;
        } else if (minWidth == '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) == '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (minWidth < 0) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0);
        } else if (precision == '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) == '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }

        // grab value using valueIndex if required?
        var value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

        switch (type) {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad);
            case 'c':
                return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
            {
                var number = parseInt(+value);
                var prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            }
            case 'e':
            case 'E':
            case 'f':
            case 'F':
            case 'g':
            case 'G':
            {
                var number = +value;
                var prefix = number < 0 ? '-' : positivePrefix;
                var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                var textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            }
            default:
                return substring;
        }
    });
}
lib.baseTypes.sprintf.regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;

/**
 * split string into array of string chunk, max chunk size is iChunkSize
 * @param {string} sStr
 * @param {number} iChunkSize
 * @return {array<string>} return array of strings
 * @methodOf lib.baseTypes
 */
lib.baseTypes.splitStringIntoChunks = function (sStr, iChunkSize) {
    var pattern = new RegExp(".{1," + iChunkSize + "}", "g");
    return sStr.match(pattern);
}

lib.baseTypes.sign = function (x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}


/**
 * is test value is empty
 * @param {*} test check value
 * @return {boolean} return true is test value is empty
 * @methodOf lib.baseTypes
 */
lib.baseTypes.isEmpty = function (test) {
    if (isNull(test)) {
        return true;
    }
    if (test === "") {
        return true;
    }
    if (lib.baseTypes.isArray(test)) {
        if (test.length > 0) {
            return false;
        }
        return true;
    }
    if (lib.baseTypes.isObject(test)) {
        if (test.hasOwnProperty) {
            for (var key in test) {
                if (test.hasOwnProperty(key)) {
                    return false;
                }
            }
        } else {
            for (var key in test) {
                return false;
            }
        }
        if (lib.baseTypes.isFunction(test)) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

/**
 *
 * @param test
 * @param defaultValue
 * @returns {*}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.emptyTo = function (test, defaultValue) {
    if (isEmpty(test)) {
        return defaultValue;
    }
    return test;
}

/**
 *
 * @param test
 * @returns {boolean}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.isNull = function (test) {
    return typeof(test) !== "string" && (test === null || test === undefined || (!lib.baseTypes.isObject(test) && lib.baseTypes.isNaN(test)));
}

/**
 * Check is test value isFinite
 * @param {number} test
 * @result {boolean} true is test value is finite
 * @methodOf lib.baseTypes
 */
lib.baseTypes.isFinite = function (test) {
    return isNumber(test) && !(test == Number.POSITIVE_INFINITY || test == Number.NEGATIVE_INFINITY);
}

/**
 * Check is test object
 * @param test
 * @returns {boolean}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.isObject = function (test) {
    return test === Object(test);
}

/**
 *
 * @param test
 * @returns {boolean}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.isArray = function (test) {
    return Array.isArray(test);
}

if (!Array.isArray) {
    Array.isArray = function(test) {
        return Object.prototype.toString.call(test) === "[object Array]";
    }
}

/**
 * Check is test function
 * @param test
 * @returns {*|boolean}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.isFunction = function (test) {
    return test && new Object().toString.call(test) === "[object Function]";
}

/**
 * Convert duration seconds into string using sFormat string
 * @param {number} iDurationSec
 * @param {string} sFormat
 *
 * @example
 * lib.baseTypes.formatTimeDuration(100, "hh:mm:ss");
 *
 * @methodOf lib.baseTypes
 */
lib.baseTypes.formatTimeDuration = function (iDurationSec, sFormat) {
    var iHour = Math.floor(iDurationSec * SEC2HOUR);
    var iMinute = Math.floor((iDurationSec - iHour * HOUR2SEC) * SEC2MIN);
    var iSecond = Math.floor(iDurationSec - iHour * HOUR2SEC - iMinute * MIN2SEC);

    var sResult = sFormat;

    if (sResult.match(/hh/g)) {
        if (0 <= iHour && iHour <= 9) {
            sResult = sResult.replace(/hh/g, "0" + iHour);
        } else {
            sResult = sResult.replace(/hh/g, iHour);
        }
    } else if (sResult.match(/h/g)) {
        sResult = sResult.replace(/h/, iHour);
    }

    if (sResult.match(/mm/g)) {
        if (0 <= iMinute && iMinute <= 9) {
            sResult = sResult.replace(/mm/g, "0" + iMinute);
        } else {
            sResult = sResult.replace(/mm/g, iMinute);
        }
    } else if (sResult.match(/m/g)) {
        sResult = sResult.replace(/m/g, iMinute);
    }

    if (sResult.match(/ss/g)) {
        if (0 <= iSecond && iSecond <= 9) {
            sResult = sResult.replace(/ss/g, "0" + iSecond);
        } else {
            sResult = sResult.replace(/ss/g, iSecond);
        }
    } else if (sResult.match(/s/g)) {
        sResult = sResult.replace(/s/g, iSecond);
    }

    return sResult;
}

/**
 * M - signle digit prefere
 * MM - month as number
 * MMM - month as short name
 * MMMM - month as long name
 *
 * d - single digit prefere
 * dd - day as number
 * ddd - day as short name
 * dddd - data as long name
 *
 * h - hour as number, signle digit prefere
 * hh - hour as number, 2 digit prefere
 *
 * m - minute as number, signle digit prefere
 * mm - minutes 2 digits
 *
 * s - seconds as number, signle digit prefer
 * ss - seconds 2 digits
 *
 * @param iJSDateTime
 * @param {string} sFormat
 * @methodOf lib.baseTypes
 * @example "MM/dd/yyyy hh:mm"
 * @example "dddd MMM hh:mm"
 *
 */
lib.baseTypes.formatDateTime = function (iJSDateTime, sFormat) {
    var dt = new Date();
    dt.setTime(iJSDateTime);
    var sResult = sFormat;

    var iHour = dt.getHours();
    var iMinute = dt.getMinutes();
    var iSecond = dt.getSeconds();

    var iYear = dt.getFullYear();
    var iMonth = dt.getMonth();
    var iDay = dt.getDate();
    var iDayOfWeek = dt.getDay();

    //calendarstarts from Sunday
    if (iDayOfWeek == 0) {
        iDayOfWeek = 7;
    }

    function hourFormat(sResult) {
        if (sResult.match(/%hh/g)) {
            if (0 <= iHour && iHour <= 9) {
                sResult = sResult.replace(/%hh/g, "0" + iHour);
                sResult = hourFormat(sResult);
            } else {
                sResult = sResult.replace(/%hh/g, iHour);
                sResult = hourFormat(sResult);
            }
        } else if (sResult.match(/%h/g)) {
            sResult = sResult.replace(/%h/, iHour);
            sResult = hourFormat(sResult);
        }

        return sResult;
    }

    sResult = hourFormat(sResult);

    function minuteFormat(sResult) {
        if (sResult.match(/%mm/g)) {
            if (0 <= iMinute && iMinute <= 9) {
                sResult = sResult.replace(/%mm/g, "0" + iMinute);
                sResult = minuteFormat(sResult);
            } else {
                sResult = sResult.replace(/%mm/g, iMinute);
                sResult = minuteFormat(sResult);
            }
        } else if (sResult.match(/%m/g)) {
            sResult = sResult.replace(/%m/g, iMinute);
            sResult = minuteFormat(sResult);
        }

        return sResult;
    }

    sResult = minuteFormat(sResult);

    function secondFormat(sResult) {
        var r = sResult.match(/%ss/g);
        if (r) {
            if (0 <= iSecond && iSecond <= 9) {
                sResult = sResult.replace(/%ss/g, "0" + iSecond);
                sResult = secondFormat(sResult);
            } else {
                sResult = sResult.replace(/%ss/g, iSecond);
                sResult = secondFormat(sResult);
            }
        } else if (sResult.match(/%s/g)) {
            sResult = sResult.replace(/%s/g, iSecond);
            sResult = secondFormat(sResult);
        }

        return sResult;
    }

    sResult = secondFormat(sResult);

    function yearFormat(sResult) {
        if (sResult.match(/%yyyy/g)) {
            sResult = sResult.replace(/%yyyy/g, iYear);
            sResult = yearFormat(sResult);
        }
        return sResult;
    }

    sResult = yearFormat(sResult);

    function monthFormat(sResult) {
        if (sResult.match(/%MMMM/g)) {
            sResult = sResult.replace(/%MMMM/g, months[iMonth + 1]);
            sResult = monthFormat(sResult);
        } else if (sResult.match(/%MMM/g)) {
            sResult = sResult.replace(/%MMM/g, monthsShort[iMonth + 1]);
            sResult = monthFormat(sResult);
        } else if (sResult.match(/%MM/g)) {
            if (0 <= iMonth && iMonth <= 9) {
                sResult = sResult.replace(/%MM/g, "0" + (iMonth + 1));
                sResult = monthFormat(sResult);
            } else {
                sResult = sResult.replace(/%MM/g, iMonth + 1);
                sResult = monthFormat(sResult);
            }
        }
        return sResult;
    }

    sResult = monthFormat(sResult);

    function dayFormat(sResult) {
        if (sResult.match(/%dddd/g)) {
            sResult = sResult.replace(/%dddd/g, days[iDayOfWeek]);
            sResult = dayFormat(sResult);
        } else if (sResult.match(/%ddd/g)) {
            sResult = sResult.replace(/%ddd/g, daysShort[iDayOfWeek]);
            sResult = dayFormat(sResult);
        } else if (sResult.match(/%dd/g)) {
            if (0 <= iDay && iDay <= 9) {
                sResult = sResult.replace(/%dd/g, "0" + iDay);
                sResult = dayFormat(sResult);
            } else {
                sResult = sResult.replace(/%dd/g, iDay);
                sResult = dayFormat(sResult);
            }
        }
        return sResult;
    }

    sResult = dayFormat(sResult);

    return sResult;
}

/**
 *
 * @param {number} number
 * @param {boolean} [isLittleEndian=true]
 * @returns {number}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.decodeFloat = function (number, isLittleEndian) {
    if (isNull(number)) return NaN;
    if (isNull(isLittleEndian)) isLittleEndian = true;

    var bytes = [];
    bytes.push((number >> 24) & 0xFF);
    bytes.push((number >> 16) & 0xFF);
    bytes.push((number >> 8) & 0xFF);
    bytes.push(number & 0xFF);
    return __decodeFloat(bytes, 1, 8, 23, -126, 127, isLittleEndian);
}

/**
 *
 * @param bytes
 * @param signBits
 * @param exponentBits
 * @param fractionBits
 * @param eMin
 * @param eMax
 * @param littleEndian
 * @returns {number}
 * @see https://gist.github.com/kg/2192799
 */
lib.baseTypes.__decodeFloat = function (bytes, signBits, exponentBits, fractionBits, eMin, eMax, littleEndian) {
    var totalBits = (signBits + exponentBits + fractionBits);

    var binary = "";
    for (var i = 0, l = bytes.length; i < l; i++) {
        var bits = bytes[i].toString(2);
        while (bits.length < 8)
            bits = "0" + bits;

        if (littleEndian)
            binary = bits + binary;
        else
            binary += bits;
    }

    var sign = (binary.charAt(0) == '1') ? -1 : 1;
    var exponent = parseInt(binary.substr(signBits, exponentBits), 2) - eMax;
    var significandBase = binary.substr(signBits + exponentBits, fractionBits);
    var significandBin = '1' + significandBase;
    var i = 0;
    var val = 1;
    var significand = 0;

    if (exponent == -eMax) {
        if (significandBase.indexOf('1') == -1)
            return 0;
        else {
            exponent = eMin;
            significandBin = '0' + significandBase;
        }
    }

    while (i < significandBin.length) {
        significand += val * parseInt(significandBin.charAt(i));
        val = val / 2;
        i++;
    }

    return sign * significand * Math.pow(2, exponent);
}

/**
 * check how many ms time consume of function invoke
 * @param {function} f
 * @param {Array} [args] function arguments
 * @param {object} [context] invoke function context
 * @returns {number} time consume
 * @methodOf lib.baseTypes
 */
lib.baseTypes.timeConsume = function (f, args, context) {
    var t = (new Date).getTime();
    if (context) {
        f.apply(context, args || []);
    } else {
        f.apply(f, args || []);
    }
    return (new Date).getTime() - t;
}

/**
 * calculate average time fo running function f
 * @param {number} N how many times to run function to calculate average time
 * @param {function} f
 * @param {Array} [args]
 * @param {object} [context]
 * @returns {number}
 * @methodOf lib.baseTypes
 */
lib.baseTypes.averageTimeConsume = function (N, f, args, context) {
    var times = [];
    for (var i = 0; i < N; ++i) {
        times.push(timeConsume(f, args, context));
    }
    return lib.arrays.average(times);
}