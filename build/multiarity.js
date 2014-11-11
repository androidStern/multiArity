/*
 * multiArity
 * https://github.com/androidStern/multiarity
 *
 * Copyright (c) 2014 Andrew Stern
 * Licensed under the MIT license.
 */
'use strict';
var _$670 = require('lodash');
module.exports = function multiArity() {
    if (arguments.length === 0) {
        throw new Error('multiarity expects at least 1 arument');
    }
    var args$673 = _$670.toArray(arguments), arities$674 = {}, ctx$675 = { recur: callByArity$677 }, opts$676 = _$670.first(args$673);
    if (_$670.isPlainObject(opts$676)) {
        if (!isAllFns$672(_$670.values(opts$676))) {
            throw new Error('multiarity vals must be type function');
        }
        _$670.extend(arities$674, opts$676);
    } else {
        _$670.extend(arities$674, arityMapForFunctions$671(args$673));
    }
    return callByArity$677;
    function callByArity$677() {
        var args$678 = _$670.toArray(arguments), fn_len$679 = args$678.length, fn_for_arity$680 = _$670.has(arities$674, fn_len$679) ? arities$674[fn_len$679] : arities$674['otherwise'];
        if (_$670.isUndefined(fn_for_arity$680)) {
            throw new Error('wrong number of args: ' + fn_len$679);
        }
        return fn_for_arity$680.apply(ctx$675, args$678);
    }
};
function arityMapForFunctions$671(fns_list$681) {
    return _$670.zipObject(_$670.map(fns_list$681, function (_1$683) {
        return _1$683.length;
    }), fns_list$681);
}
function isAllFns$672(arr$684) {
    return _$670.all(arr$684, _$670.isFunction);
}
//# sourceMappingURL=multiarity.js.map