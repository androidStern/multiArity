/*
 * multiArity
 * https://github.com/androidStern/multiarity
 *
 * Copyright (c) 2014 Andrew Stern
 * Licensed under the MIT license.
 */

'use strict';

var _ = require("lodash");

module.exports = function multiArity() {
	if (arguments.length === 0) {
		throw new Error("multiarity expects at least 1 arument");
	}
	
	var args = _.toArray(arguments),
			arities = {},
			ctx = { recur: callByArity },
			opts = _.first(args);
	
	if (_.isPlainObject(opts)) {
		if (!isAllFns(_.values(opts))) {
			throw new Error("multiarity vals must be type function");
		}
		_.extend(arities, opts);
	} else {
		_.extend(arities, arityMapForFunctions(args));
	}

  return callByArity;

  function callByArity () {
  	var args = _.toArray(arguments),
  			fn_len = args.length,
  			fn_for_arity = _.has(arities, fn_len) ? 
  				arities[fn_len] : arities["otherwise"];
				if (_.isUndefined(fn_for_arity)) {
					throw new Error("wrong number of args: " + fn_len);
				}
		return fn_for_arity.apply(ctx, args);
  }
};

function arityMapForFunctions (fns_list) {
	return _.zipObject(_.map(fns_list, λ(_1.length)), fns_list);
}

function isAllFns (arr) {
	return _.all(arr, _.isFunction);
}


