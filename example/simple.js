/*
 * multiArity
 * https://github.com/androidStern/multiarity
 *
 * Copyright (c) 2014 Andrew Stern
 * Licensed under the MIT license.
 */

var multiarity = require('../');

// *** FOR THE IMPATIENT ***

var unsafeMultiply = function (a, b) { return a * b; };

console.log( unsafeMultiply(1) ); //=> NAN. USELESS!!!!!

var betterMultiply = multiarity(
	function () { return this.recur(1,1); },
	function (a) { return this.recur(a, 1); },
	function (a, b) { return a * b; } );

console.log(betterMultiply()); //=> 1
console.log(betterMultiply(7)); //=> 7
console.log(betterMultiply(7, 2)); //=> 14


var contrived_factorial = multiarity(
	function () { return 1;},
	function (n) {
		if (n > 0) {
			return n * this.recur(n - 1);
		}
		return this.recur();
	});

console.log(contrived_factorial(3));

// *** FOR THE PATIENT ***

/**
 * Lets make a function that greets things by name. 
 */
var sayHelloTo = function (name) {
	console.log("[line:17]  sayHelloTo was called!");
	console.log("[line:18]  hello", name);
};

sayHelloTo("sayHelloTo_GUY"); // LOGS: sayHelloTo was called! \n "hello sayHelloTo_GUY"

/**
 * But what if I don't specify a name?
 */


sayHelloTo(); // LOGS: sayHelloTo was called! \n hello undefined


/**
 * ^^That's probably not what we wanted.
 * We probably want to have some default
 * value for `name` if one isn't specified.
 */

var sayHelloWithDefault = function () {
	if (arguments.length > 0) {
		console.log("[line:44]  hello", arguments[0]);
	} else {
		console.log("[line:46]  hello world");
	}
};

sayHelloWithDefault(); //LOGS: "hello world"
sayHelloWithDefault("sayHelloWithDefault_GUY"); //LOGS: "hello sayHelloWithDefault_GUY"

/**
 * Thats better... but there's a bit of duplication in our code:
 * both branches of our if statement are calling `console.log`...
 * the only difference between them is the number of arguments.
 *
 * It would be better, IMO, if we could express our intent
 * more explicitly as well. So what is our intent?
 *
 * (1) Our primary intent is to make a function that takes a name
 * and prints "hello" + name.
 * 
 * (2) Our secondary intent is to make a function that returns "hello" + "world" when
 * no arguments are passed to it. 
 * 
 * Wait, lets try breaking that down further...
 * 	(2.a) make a function that returns "hello" + "world"
 * 	(2.b) use 2.a when no arguments are provided
 *
 *
 * Our origional implamentation of `sayHelloTo` will do nicely for intent 1.
 * 
 * We could even re-use it for 2.a:
 * 		`sayHelloTo("world")` will return "hello" + "world".
 * 
 * Now finaly we need something for 2.b. Perhaps, a function that delegates
 * to several other functions depending on the number of arguments?
 */


/**
 * Suspend your disbelief for a moment and imagine that we
 * had a function, `multiarity`, that could do such a thing...
 * we could make a function that calls sayHelloTo when
 * one argument is provided like so:
 */
var sayHelloSingleArity = multiarity({
	1: sayHelloTo // we use a key of 1 to say this is what to call when 1 argument is provided
});

sayHelloSingleArity("sayHelloSingleArity_GUY"); // LOGS: sayHelloTo was called! \n "hello sayHelloSingleArity_GUY"

try {
	sayHelloSingleArity(); // ERROR!
} catch(e) {
	console.log("[line:97] ",e);
}


/**
 * *** A MULTIPLE-DISPATCH version!!! ***
 * ok lets teach say `sayHelloSingleArity` how to handle
 * two arguments: 
 */

var sayHelloDoubleArity = multiarity({
	1: sayHelloTo,
	0: function() {
		/**
		 * Within any of the functions passed into the 
		 * multiarity combinator `this.recur` is a 
		 * refrence to the new function that the multiarity combinator
		 * will return.
		 *
		 * So: `this.recur("world") === sayHelloDoubleArity("world");`
		 */
		console.log("[line:118] sayHelloDoubleArity called with 0 arguments");
		this.recur("world");
	}
});

/**
 * This should make sense, one argument provided means we dispatch to sayHelloTo
 * which in turn prints `sayHelloTo was called` and then our greeting.
 */
sayHelloDoubleArity("sayHelloDoubleArity_GUY"); 
// LOGS: 	sayHelloTo was called!
// 				"sayHelloDoubleArity_GUY"

/**
 * And this makes sense too, the zero argument version is dispatched to,
 * which simply recals the function (a la this.recur) with 1 argument of "world".
 * The one argument call dispatches to sayHelloTo as it always does and 
 * the world is once again greeted by a computer.
 */
sayHelloDoubleArity(); 
// LOGS: 	sayHelloDoubleArity called with 0 arguments
// 				sayHelloTo was called! 
// 				hello world

/**
 * BINGO. And for power users, leave off the argument numbering and let 
 * multiarity infer it based on your params list for you.
 */

var sayHelloLikeAPro = multiarity(
	function(name){ console.log("[LINE:143] hello pro", name); },
	function(){ this.recur("world"); });


sayHelloLikeAPro(); //LOGS: hello pro world

sayHelloLikeAPro("grammer"); // :)

