'use strict';
var _ = require("lodash");
var multiarity = require('../build/multiarity.js');
var expect = require('chai').expect;

describe('multiarity', function () {

  it('should be a function', function () {
      expect(multiarity).to.be.a("function");
  });

  it("should require at least 1 argument", function(){
    expect(multiarity).to.throw("multiarity expects at least 1 arument");
  });

  describe("when passed a map", function (){
    var invalidArityMap = function (opts) {
      return _.merge({
        0: _.noop
      }, opts);
    }

    var otherwise = function () {return { "otherwise": _.noop}; };

    var validArityMap = _.compose(invalidArityMap, otherwise);

    it("should throw if all vals of map aren't functions", function (){
      var doarity = function () {
        multiarity({1: "hello"});
      }
      expect(doarity).to.throw("multiarity vals must be type function");
    });

    it("should return a function", function(){
      expect(multiarity(validArityMap())).to.be.a("function");
    });

    it("should have its return function's contexts bound to recur", function(){
      var arity_map = _.extend(validArityMap(), {
        1: function () {
          expect(this).to.have.property("recur");
        }
      });
      var testFunc = multiarity(validArityMap());
      testFunc(1);
    });

    it("should accept an otherwise case", function () {
      var oneIsFalseElseTrue = multiarity({
        "1": function () {
          return false;
        },
        "otherwise": function () {
          return true;
        }
      });
      expect(oneIsFalseElseTrue(1)).to.be.false
      expect(oneIsFalseElseTrue()).to.be.true
      expect(oneIsFalseElseTrue(1,2,3)).to.be.true
    });

    it("should return undefined if an arity is not found and an otherwise case is not provided", function(){
      var onlyOneIsFalse = multiarity({
        1: function () {return false; }
      });
      expect(onlyOneIsFalse).to.throw("Cannot call method \'apply\' of undefined");
    });

    it("this.recur should call the function recursivley [1]", function (){
      var add = multiarity({
        "1": function (a) {
          return this.recur(a, 0);
        },
        "2": function (a, b) {
          return a + b;
        }
      });
      expect(add(1)).to.eq(1);
    });

    it("this.recur should call the function recursivley [2]", function (){
      var sayHello = multiarity({
        0: function () {
          return this.recur("world");
        },
        1: function (name) {
          return "hello " + name;
        }
      });
      expect(sayHello()).to.eq("hello world");
      expect(sayHello("andrew")).to.eq("hello andrew");
    });  
  });

  describe("when called with a list of functions", function(){

    it("should infer arities based on function lengths", function(){
      var sayHello = multiarity(
        function(){
          return this.recur("world");
        },
        function(name) {
          return "hello " + name;
        }
      );
      expect(sayHello()).to.eq("hello world");
    });

  });
  
  
});
