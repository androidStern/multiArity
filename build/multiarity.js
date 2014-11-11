/*
 * multiArity
 * https://github.com/androidStern/multiarity
 *
 * Copyright (c) 2014 Andrew Stern
 * Licensed under the MIT license.
 */
'use strict';
var _$1140 = require('lodash');
module.exports = function multiArity() {
    if (arguments.length === 0) {
        throw new Error('multiarity expects at least 1 arument');
    }
    var args$1143 = _$1140.toArray(arguments), arities$1144 = {}, ctx$1145 = { recur: callByArity$1147 }, opts$1146 = _$1140.first(args$1143);
    if (_$1140.isPlainObject(opts$1146)) {
        if (!isAllFns$1142(_$1140.values(opts$1146))) {
            throw new Error('multiarity vals must be type function');
        }
        _$1140.extend(arities$1144, opts$1146);
    } else {
        _$1140.extend(arities$1144, arityMapForFunctions$1141(args$1143));
    }
    return callByArity$1147;
    function callByArity$1147() {
        var args$1148 = _$1140.toArray(arguments), fn_len$1149 = args$1148.length, fn_for_arity$1150 = _$1140.has(arities$1144, fn_len$1149) ? arities$1144[fn_len$1149] : arities$1144['otherwise'];
        if (_$1140.isUndefined(fn_for_arity$1150)) {
            throw new Error('wrong number of args: ' + fn_len$1149);
        }
        return fn_for_arity$1150.apply(ctx$1145, args$1148);
    }
};
function arityMapForFunctions$1141(fns_list$1151) {
    return _$1140.zipObject(_$1140.map(fns_list$1151, function (_1$1153) {
        return _1$1153.length;
    }), fns_list$1151);
}
function isAllFns$1142(arr$1154) {
    return _$1140.all(arr$1154, _$1140.isFunction);
}
//# sourceMappingURL=multiarity.js.map