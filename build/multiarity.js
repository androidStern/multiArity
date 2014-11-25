/*
 * multiarity
 * https://github.com/androidStern/multiarity
 *
 * Copyright (c) 2014 Andrew Stern
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function multiarity() {
	if (arguments.length === 0) {
		throw new Error("multiarity expects at least 1 arument");
	}
	
	var args = [].slice.call(arguments),
			arities = {},
			ctx = { recur: callByArity },
			opts = args[0],
			temp_arities = {};
	
	if (!(typeof opts === 'function')) {
		Object.keys(opts).forEach(function(key){
			var func = opts[key];
			if (!(typeof func === 'function')) {
				throw new Error("multiarity vals must be type function");
			}
			arities[key] = func;
		});
	} else {
		args.forEach(function(func){
			if (!(typeof func === 'function')) {
				throw new Error("multiarity vals must be type function");
			}
			arities[func.length] = func;
		});
	}

  return callByArity;

  function callByArity () {
  	var args = [].slice.call(arguments),
  			fn_len = args.length,
  			fn_for_arity = arities.hasOwnProperty(fn_len) ? arities[fn_len] : arities["otherwise"];
		return fn_for_arity.apply(ctx, args);
  }
};
