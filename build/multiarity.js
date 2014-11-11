/*
 * multiArity
 * https://github.com/androidStern/multiarity
 *
 * Copyright (c) 2014 Andrew Stern
 * Licensed under the MIT license.
 */
'use strict';
var _$1046 = require('lodash');
module.exports = function multiArity() {
    if (arguments.length === 0) {
        throw new Error('multiarity expects at least 1 arument');
    }
    var args$1049 = _$1046.toArray(arguments), arities$1050 = {}, ctx$1051 = { recur: callByArity$1053 }, opts$1052 = _$1046.first(args$1049);
    if (_$1046.isPlainObject(opts$1052)) {
        if (!isAllFns$1048(_$1046.values(opts$1052))) {
            throw new Error('multiarity vals must be type function');
        }
        _$1046.extend(arities$1050, opts$1052);
    } else {
        _$1046.extend(arities$1050, arityMapForFunctions$1047(args$1049));
    }
    return callByArity$1053;
    function callByArity$1053() {
        var args$1054 = _$1046.toArray(arguments), fn_len$1055 = args$1054.length, fn_for_arity$1056 = _$1046.has(arities$1050, fn_len$1055) ? arities$1050[fn_len$1055] : arities$1050['otherwise'];
        if (_$1046.isUndefined(fn_for_arity$1056)) {
            throw new Error('wrong number of args: ' + fn_len$1055);
        }
        return fn_for_arity$1056.apply(ctx$1051, args$1054);
    }
};
function arityMapForFunctions$1047(fns_list$1057) {
    return _$1046.zipObject(_$1046.map(fns_list$1057, function (_1$1059) {
        return _1$1059.length;
    }), fns_list$1057);
}
function isAllFns$1048(arr$1060) {
    return _$1046.all(arr$1060, _$1046.isFunction);
}
//# sourceMappingURL=multiarity.js.map