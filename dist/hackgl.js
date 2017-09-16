(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hackgl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
"use strict";

_dereq_("core-js/shim");

_dereq_("regenerator-runtime/runtime");

_dereq_("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/fn/regexp/escape":14,"core-js/shim":420,"regenerator-runtime/runtime":2}],2:[function(_dereq_,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":15}],4:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":16}],5:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":17}],6:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":18}],7:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":19}],8:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":20}],9:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;

var _promise = _dereq_("../core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
},{"../core-js/promise":8}],10:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;

var _assign = _dereq_("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
},{"../core-js/object/assign":6}],11:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;

var _isIterable2 = _dereq_("../core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = _dereq_("../core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"../core-js/get-iterator":4,"../core-js/is-iterable":5}],12:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;

var _from = _dereq_("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":3}],13:[function(_dereq_,module,exports){
module.exports = _dereq_("regenerator-runtime");

},{"regenerator-runtime":421}],14:[function(_dereq_,module,exports){
_dereq_('../../modules/core.regexp.escape');
module.exports = _dereq_('../../modules/_core').RegExp.escape;

},{"../../modules/_core":119,"../../modules/core.regexp.escape":223}],15:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.string.iterator');
_dereq_('../../modules/es6.array.from');
module.exports = _dereq_('../../modules/_core').Array.from;

},{"../../modules/_core":28,"../../modules/es6.array.from":89,"../../modules/es6.string.iterator":95}],16:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.get-iterator');

},{"../modules/core.get-iterator":87,"../modules/es6.string.iterator":95,"../modules/web.dom.iterable":98}],17:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.is-iterable');

},{"../modules/core.is-iterable":88,"../modules/es6.string.iterator":95,"../modules/web.dom.iterable":98}],18:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.assign');
module.exports = _dereq_('../../modules/_core').Object.assign;

},{"../../modules/_core":28,"../../modules/es6.object.assign":91}],19:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.keys');
module.exports = _dereq_('../../modules/_core').Object.keys;

},{"../../modules/_core":28,"../../modules/es6.object.keys":92}],20:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
_dereq_('../modules/es7.promise.finally');
_dereq_('../modules/es7.promise.try');
module.exports = _dereq_('../modules/_core').Promise;

},{"../modules/_core":28,"../modules/es6.object.to-string":93,"../modules/es6.promise":94,"../modules/es6.string.iterator":95,"../modules/es7.promise.finally":96,"../modules/es7.promise.try":97,"../modules/web.dom.iterable":98}],21:[function(_dereq_,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],22:[function(_dereq_,module,exports){
module.exports = function () { /* empty */ };

},{}],23:[function(_dereq_,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],24:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":46}],25:[function(_dereq_,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = _dereq_('./_to-iobject');
var toLength = _dereq_('./_to-length');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":78,"./_to-iobject":80,"./_to-length":81}],26:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./_cof');
var TAG = _dereq_('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":27,"./_wks":85}],27:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],28:[function(_dereq_,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],29:[function(_dereq_,module,exports){
'use strict';
var $defineProperty = _dereq_('./_object-dp');
var createDesc = _dereq_('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":58,"./_property-desc":68}],30:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":21}],31:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],32:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":36}],33:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var document = _dereq_('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":38,"./_is-object":46}],34:[function(_dereq_,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],35:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var ctx = _dereq_('./_ctx');
var hide = _dereq_('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":28,"./_ctx":30,"./_global":38,"./_hide":40}],36:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],37:[function(_dereq_,module,exports){
var ctx = _dereq_('./_ctx');
var call = _dereq_('./_iter-call');
var isArrayIter = _dereq_('./_is-array-iter');
var anObject = _dereq_('./_an-object');
var toLength = _dereq_('./_to-length');
var getIterFn = _dereq_('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":24,"./_ctx":30,"./_is-array-iter":45,"./_iter-call":47,"./_to-length":81,"./core.get-iterator-method":86}],38:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],39:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],40:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":32,"./_object-dp":58,"./_property-desc":68}],41:[function(_dereq_,module,exports){
var document = _dereq_('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":38}],42:[function(_dereq_,module,exports){
module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function () {
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":32,"./_dom-create":33,"./_fails":36}],43:[function(_dereq_,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],44:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":27}],45:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators = _dereq_('./_iterators');
var ITERATOR = _dereq_('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":52,"./_wks":85}],46:[function(_dereq_,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],47:[function(_dereq_,module,exports){
// call something on iterator step with safe closing on error
var anObject = _dereq_('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":24}],48:[function(_dereq_,module,exports){
'use strict';
var create = _dereq_('./_object-create');
var descriptor = _dereq_('./_property-desc');
var setToStringTag = _dereq_('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./_hide')(IteratorPrototype, _dereq_('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":40,"./_object-create":57,"./_property-desc":68,"./_set-to-string-tag":72,"./_wks":85}],49:[function(_dereq_,module,exports){
'use strict';
var LIBRARY = _dereq_('./_library');
var $export = _dereq_('./_export');
var redefine = _dereq_('./_redefine');
var hide = _dereq_('./_hide');
var has = _dereq_('./_has');
var Iterators = _dereq_('./_iterators');
var $iterCreate = _dereq_('./_iter-create');
var setToStringTag = _dereq_('./_set-to-string-tag');
var getPrototypeOf = _dereq_('./_object-gpo');
var ITERATOR = _dereq_('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":35,"./_has":39,"./_hide":40,"./_iter-create":48,"./_iterators":52,"./_library":53,"./_object-gpo":61,"./_redefine":70,"./_set-to-string-tag":72,"./_wks":85}],50:[function(_dereq_,module,exports){
var ITERATOR = _dereq_('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":85}],51:[function(_dereq_,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],52:[function(_dereq_,module,exports){
module.exports = {};

},{}],53:[function(_dereq_,module,exports){
module.exports = true;

},{}],54:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var macrotask = _dereq_('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = _dereq_('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":27,"./_global":38,"./_task":77}],55:[function(_dereq_,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = _dereq_('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":21}],56:[function(_dereq_,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = _dereq_('./_object-keys');
var gOPS = _dereq_('./_object-gops');
var pIE = _dereq_('./_object-pie');
var toObject = _dereq_('./_to-object');
var IObject = _dereq_('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || _dereq_('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":36,"./_iobject":44,"./_object-gops":60,"./_object-keys":63,"./_object-pie":64,"./_to-object":82}],57:[function(_dereq_,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = _dereq_('./_an-object');
var dPs = _dereq_('./_object-dps');
var enumBugKeys = _dereq_('./_enum-bug-keys');
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _dereq_('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _dereq_('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":24,"./_dom-create":33,"./_enum-bug-keys":34,"./_html":41,"./_object-dps":59,"./_shared-key":73}],58:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define');
var toPrimitive = _dereq_('./_to-primitive');
var dP = Object.defineProperty;

exports.f = _dereq_('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":24,"./_descriptors":32,"./_ie8-dom-define":42,"./_to-primitive":83}],59:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var anObject = _dereq_('./_an-object');
var getKeys = _dereq_('./_object-keys');

module.exports = _dereq_('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":24,"./_descriptors":32,"./_object-dp":58,"./_object-keys":63}],60:[function(_dereq_,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],61:[function(_dereq_,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = _dereq_('./_has');
var toObject = _dereq_('./_to-object');
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":39,"./_shared-key":73,"./_to-object":82}],62:[function(_dereq_,module,exports){
var has = _dereq_('./_has');
var toIObject = _dereq_('./_to-iobject');
var arrayIndexOf = _dereq_('./_array-includes')(false);
var IE_PROTO = _dereq_('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":25,"./_has":39,"./_shared-key":73,"./_to-iobject":80}],63:[function(_dereq_,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _dereq_('./_object-keys-internal');
var enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":34,"./_object-keys-internal":62}],64:[function(_dereq_,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],65:[function(_dereq_,module,exports){
// most Object methods by ES6 should accept primitives
var $export = _dereq_('./_export');
var core = _dereq_('./_core');
var fails = _dereq_('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":28,"./_export":35,"./_fails":36}],66:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],67:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var isObject = _dereq_('./_is-object');
var newPromiseCapability = _dereq_('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":24,"./_is-object":46,"./_new-promise-capability":55}],68:[function(_dereq_,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],69:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":40}],70:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');

},{"./_hide":40}],71:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var dP = _dereq_('./_object-dp');
var DESCRIPTORS = _dereq_('./_descriptors');
var SPECIES = _dereq_('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":28,"./_descriptors":32,"./_global":38,"./_object-dp":58,"./_wks":85}],72:[function(_dereq_,module,exports){
var def = _dereq_('./_object-dp').f;
var has = _dereq_('./_has');
var TAG = _dereq_('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":39,"./_object-dp":58,"./_wks":85}],73:[function(_dereq_,module,exports){
var shared = _dereq_('./_shared')('keys');
var uid = _dereq_('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":74,"./_uid":84}],74:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":38}],75:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = _dereq_('./_an-object');
var aFunction = _dereq_('./_a-function');
var SPECIES = _dereq_('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":21,"./_an-object":24,"./_wks":85}],76:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var defined = _dereq_('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":31,"./_to-integer":79}],77:[function(_dereq_,module,exports){
var ctx = _dereq_('./_ctx');
var invoke = _dereq_('./_invoke');
var html = _dereq_('./_html');
var cel = _dereq_('./_dom-create');
var global = _dereq_('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_dereq_('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":27,"./_ctx":30,"./_dom-create":33,"./_global":38,"./_html":41,"./_invoke":43}],78:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":79}],79:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],80:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject');
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":31,"./_iobject":44}],81:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":79}],82:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":31}],83:[function(_dereq_,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = _dereq_('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":46}],84:[function(_dereq_,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],85:[function(_dereq_,module,exports){
var store = _dereq_('./_shared')('wks');
var uid = _dereq_('./_uid');
var Symbol = _dereq_('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":38,"./_shared":74,"./_uid":84}],86:[function(_dereq_,module,exports){
var classof = _dereq_('./_classof');
var ITERATOR = _dereq_('./_wks')('iterator');
var Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":26,"./_core":28,"./_iterators":52,"./_wks":85}],87:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var get = _dereq_('./core.get-iterator-method');
module.exports = _dereq_('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":24,"./_core":28,"./core.get-iterator-method":86}],88:[function(_dereq_,module,exports){
var classof = _dereq_('./_classof');
var ITERATOR = _dereq_('./_wks')('iterator');
var Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"./_classof":26,"./_core":28,"./_iterators":52,"./_wks":85}],89:[function(_dereq_,module,exports){
'use strict';
var ctx = _dereq_('./_ctx');
var $export = _dereq_('./_export');
var toObject = _dereq_('./_to-object');
var call = _dereq_('./_iter-call');
var isArrayIter = _dereq_('./_is-array-iter');
var toLength = _dereq_('./_to-length');
var createProperty = _dereq_('./_create-property');
var getIterFn = _dereq_('./core.get-iterator-method');

$export($export.S + $export.F * !_dereq_('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":29,"./_ctx":30,"./_export":35,"./_is-array-iter":45,"./_iter-call":47,"./_iter-detect":50,"./_to-length":81,"./_to-object":82,"./core.get-iterator-method":86}],90:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./_add-to-unscopables');
var step = _dereq_('./_iter-step');
var Iterators = _dereq_('./_iterators');
var toIObject = _dereq_('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":22,"./_iter-define":49,"./_iter-step":51,"./_iterators":52,"./_to-iobject":80}],91:[function(_dereq_,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = _dereq_('./_export');

$export($export.S + $export.F, 'Object', { assign: _dereq_('./_object-assign') });

},{"./_export":35,"./_object-assign":56}],92:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_('./_to-object');
var $keys = _dereq_('./_object-keys');

_dereq_('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":63,"./_object-sap":65,"./_to-object":82}],93:[function(_dereq_,module,exports){

},{}],94:[function(_dereq_,module,exports){
'use strict';
var LIBRARY = _dereq_('./_library');
var global = _dereq_('./_global');
var ctx = _dereq_('./_ctx');
var classof = _dereq_('./_classof');
var $export = _dereq_('./_export');
var isObject = _dereq_('./_is-object');
var aFunction = _dereq_('./_a-function');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var speciesConstructor = _dereq_('./_species-constructor');
var task = _dereq_('./_task').set;
var microtask = _dereq_('./_microtask')();
var newPromiseCapabilityModule = _dereq_('./_new-promise-capability');
var perform = _dereq_('./_perform');
var promiseResolve = _dereq_('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_dereq_('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _dereq_('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
_dereq_('./_set-to-string-tag')($Promise, PROMISE);
_dereq_('./_set-species')(PROMISE);
Wrapper = _dereq_('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && _dereq_('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":21,"./_an-instance":23,"./_classof":26,"./_core":28,"./_ctx":30,"./_export":35,"./_for-of":37,"./_global":38,"./_is-object":46,"./_iter-detect":50,"./_library":53,"./_microtask":54,"./_new-promise-capability":55,"./_perform":66,"./_promise-resolve":67,"./_redefine-all":69,"./_set-species":71,"./_set-to-string-tag":72,"./_species-constructor":75,"./_task":77,"./_wks":85}],95:[function(_dereq_,module,exports){
'use strict';
var $at = _dereq_('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
_dereq_('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":49,"./_string-at":76}],96:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = _dereq_('./_export');
var core = _dereq_('./_core');
var global = _dereq_('./_global');
var speciesConstructor = _dereq_('./_species-constructor');
var promiseResolve = _dereq_('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":28,"./_export":35,"./_global":38,"./_promise-resolve":67,"./_species-constructor":75}],97:[function(_dereq_,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = _dereq_('./_export');
var newPromiseCapability = _dereq_('./_new-promise-capability');
var perform = _dereq_('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":35,"./_new-promise-capability":55,"./_perform":66}],98:[function(_dereq_,module,exports){
_dereq_('./es6.array.iterator');
var global = _dereq_('./_global');
var hide = _dereq_('./_hide');
var Iterators = _dereq_('./_iterators');
var TO_STRING_TAG = _dereq_('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":38,"./_hide":40,"./_iterators":52,"./_wks":85,"./es6.array.iterator":90}],99:[function(_dereq_,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],100:[function(_dereq_,module,exports){
var cof = _dereq_('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":114}],101:[function(_dereq_,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _dereq_('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _dereq_('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":138,"./_wks":221}],102:[function(_dereq_,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],103:[function(_dereq_,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./_is-object":147,"dup":24}],104:[function(_dereq_,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = _dereq_('./_to-object');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
var toLength = _dereq_('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":207,"./_to-length":211,"./_to-object":212}],105:[function(_dereq_,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = _dereq_('./_to-object');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
var toLength = _dereq_('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":207,"./_to-length":211,"./_to-object":212}],106:[function(_dereq_,module,exports){
var forOf = _dereq_('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":135}],107:[function(_dereq_,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"./_to-absolute-index":207,"./_to-iobject":210,"./_to-length":211,"dup":25}],108:[function(_dereq_,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = _dereq_('./_ctx');
var IObject = _dereq_('./_iobject');
var toObject = _dereq_('./_to-object');
var toLength = _dereq_('./_to-length');
var asc = _dereq_('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":111,"./_ctx":121,"./_iobject":143,"./_to-length":211,"./_to-object":212}],109:[function(_dereq_,module,exports){
var aFunction = _dereq_('./_a-function');
var toObject = _dereq_('./_to-object');
var IObject = _dereq_('./_iobject');
var toLength = _dereq_('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":99,"./_iobject":143,"./_to-length":211,"./_to-object":212}],110:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var isArray = _dereq_('./_is-array');
var SPECIES = _dereq_('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":145,"./_is-object":147,"./_wks":221}],111:[function(_dereq_,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = _dereq_('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":110}],112:[function(_dereq_,module,exports){
'use strict';
var aFunction = _dereq_('./_a-function');
var isObject = _dereq_('./_is-object');
var invoke = _dereq_('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":99,"./_invoke":142,"./_is-object":147}],113:[function(_dereq_,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"./_cof":114,"./_wks":221,"dup":26}],114:[function(_dereq_,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],115:[function(_dereq_,module,exports){
'use strict';
var dP = _dereq_('./_object-dp').f;
var create = _dereq_('./_object-create');
var redefineAll = _dereq_('./_redefine-all');
var ctx = _dereq_('./_ctx');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var $iterDefine = _dereq_('./_iter-define');
var step = _dereq_('./_iter-step');
var setSpecies = _dereq_('./_set-species');
var DESCRIPTORS = _dereq_('./_descriptors');
var fastKey = _dereq_('./_meta').fastKey;
var validate = _dereq_('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":102,"./_ctx":121,"./_descriptors":125,"./_for-of":135,"./_iter-define":151,"./_iter-step":153,"./_meta":161,"./_object-create":166,"./_object-dp":167,"./_redefine-all":186,"./_set-species":193,"./_validate-collection":218}],116:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = _dereq_('./_classof');
var from = _dereq_('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":106,"./_classof":113}],117:[function(_dereq_,module,exports){
'use strict';
var redefineAll = _dereq_('./_redefine-all');
var getWeak = _dereq_('./_meta').getWeak;
var anObject = _dereq_('./_an-object');
var isObject = _dereq_('./_is-object');
var anInstance = _dereq_('./_an-instance');
var forOf = _dereq_('./_for-of');
var createArrayMethod = _dereq_('./_array-methods');
var $has = _dereq_('./_has');
var validate = _dereq_('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":102,"./_an-object":103,"./_array-methods":108,"./_for-of":135,"./_has":137,"./_is-object":147,"./_meta":161,"./_redefine-all":186,"./_validate-collection":218}],118:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var $export = _dereq_('./_export');
var redefine = _dereq_('./_redefine');
var redefineAll = _dereq_('./_redefine-all');
var meta = _dereq_('./_meta');
var forOf = _dereq_('./_for-of');
var anInstance = _dereq_('./_an-instance');
var isObject = _dereq_('./_is-object');
var fails = _dereq_('./_fails');
var $iterDetect = _dereq_('./_iter-detect');
var setToStringTag = _dereq_('./_set-to-string-tag');
var inheritIfRequired = _dereq_('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":102,"./_export":129,"./_fails":131,"./_for-of":135,"./_global":136,"./_inherit-if-required":141,"./_is-object":147,"./_iter-detect":152,"./_meta":161,"./_redefine":187,"./_redefine-all":186,"./_set-to-string-tag":194}],119:[function(_dereq_,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],120:[function(_dereq_,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./_object-dp":167,"./_property-desc":185,"dup":29}],121:[function(_dereq_,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"./_a-function":99,"dup":30}],122:[function(_dereq_,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = _dereq_('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":131}],123:[function(_dereq_,module,exports){
'use strict';
var anObject = _dereq_('./_an-object');
var toPrimitive = _dereq_('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":103,"./_to-primitive":213}],124:[function(_dereq_,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],125:[function(_dereq_,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"./_fails":131,"dup":32}],126:[function(_dereq_,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./_global":136,"./_is-object":147,"dup":33}],127:[function(_dereq_,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],128:[function(_dereq_,module,exports){
// all enumerable object keys, includes symbols
var getKeys = _dereq_('./_object-keys');
var gOPS = _dereq_('./_object-gops');
var pIE = _dereq_('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":173,"./_object-keys":176,"./_object-pie":177}],129:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var hide = _dereq_('./_hide');
var redefine = _dereq_('./_redefine');
var ctx = _dereq_('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":119,"./_ctx":121,"./_global":136,"./_hide":138,"./_redefine":187}],130:[function(_dereq_,module,exports){
var MATCH = _dereq_('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":221}],131:[function(_dereq_,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],132:[function(_dereq_,module,exports){
'use strict';
var hide = _dereq_('./_hide');
var redefine = _dereq_('./_redefine');
var fails = _dereq_('./_fails');
var defined = _dereq_('./_defined');
var wks = _dereq_('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":124,"./_fails":131,"./_hide":138,"./_redefine":187,"./_wks":221}],133:[function(_dereq_,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = _dereq_('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":103}],134:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = _dereq_('./_is-array');
var isObject = _dereq_('./_is-object');
var toLength = _dereq_('./_to-length');
var ctx = _dereq_('./_ctx');
var IS_CONCAT_SPREADABLE = _dereq_('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_ctx":121,"./_is-array":145,"./_is-object":147,"./_to-length":211,"./_wks":221}],135:[function(_dereq_,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./_an-object":103,"./_ctx":121,"./_is-array-iter":144,"./_iter-call":149,"./_to-length":211,"./core.get-iterator-method":222,"dup":37}],136:[function(_dereq_,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],137:[function(_dereq_,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],138:[function(_dereq_,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./_descriptors":125,"./_object-dp":167,"./_property-desc":185,"dup":40}],139:[function(_dereq_,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./_global":136,"dup":41}],140:[function(_dereq_,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./_descriptors":125,"./_dom-create":126,"./_fails":131,"dup":42}],141:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var setPrototypeOf = _dereq_('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":147,"./_set-proto":192}],142:[function(_dereq_,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43}],143:[function(_dereq_,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./_cof":114,"dup":44}],144:[function(_dereq_,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./_iterators":154,"./_wks":221,"dup":45}],145:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":114}],146:[function(_dereq_,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = _dereq_('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":147}],147:[function(_dereq_,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],148:[function(_dereq_,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = _dereq_('./_is-object');
var cof = _dereq_('./_cof');
var MATCH = _dereq_('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":114,"./_is-object":147,"./_wks":221}],149:[function(_dereq_,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"./_an-object":103,"dup":47}],150:[function(_dereq_,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./_hide":138,"./_object-create":166,"./_property-desc":185,"./_set-to-string-tag":194,"./_wks":221,"dup":48}],151:[function(_dereq_,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./_export":129,"./_has":137,"./_hide":138,"./_iter-create":150,"./_iterators":154,"./_library":155,"./_object-gpo":174,"./_redefine":187,"./_set-to-string-tag":194,"./_wks":221,"dup":49}],152:[function(_dereq_,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"./_wks":221,"dup":50}],153:[function(_dereq_,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],154:[function(_dereq_,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],155:[function(_dereq_,module,exports){
module.exports = false;

},{}],156:[function(_dereq_,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],157:[function(_dereq_,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = _dereq_('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":160}],158:[function(_dereq_,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],159:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

},{}],160:[function(_dereq_,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],161:[function(_dereq_,module,exports){
var META = _dereq_('./_uid')('meta');
var isObject = _dereq_('./_is-object');
var has = _dereq_('./_has');
var setDesc = _dereq_('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_dereq_('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":131,"./_has":137,"./_is-object":147,"./_object-dp":167,"./_uid":217}],162:[function(_dereq_,module,exports){
var Map = _dereq_('./es6.map');
var $export = _dereq_('./_export');
var shared = _dereq_('./_shared')('metadata');
var store = shared.store || (shared.store = new (_dereq_('./es6.weak-map'))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./_export":129,"./_shared":196,"./es6.map":253,"./es6.weak-map":359}],163:[function(_dereq_,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"./_cof":114,"./_global":136,"./_task":206,"dup":54}],164:[function(_dereq_,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"./_a-function":99,"dup":55}],165:[function(_dereq_,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"./_fails":131,"./_iobject":143,"./_object-gops":173,"./_object-keys":176,"./_object-pie":177,"./_to-object":212,"dup":56}],166:[function(_dereq_,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./_an-object":103,"./_dom-create":126,"./_enum-bug-keys":127,"./_html":139,"./_object-dps":168,"./_shared-key":195,"dup":57}],167:[function(_dereq_,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"./_an-object":103,"./_descriptors":125,"./_ie8-dom-define":140,"./_to-primitive":213,"dup":58}],168:[function(_dereq_,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"./_an-object":103,"./_descriptors":125,"./_object-dp":167,"./_object-keys":176,"dup":59}],169:[function(_dereq_,module,exports){
'use strict';
// Forced replacement prototype accessors methods
module.exports = _dereq_('./_library') || !_dereq_('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete _dereq_('./_global')[K];
});

},{"./_fails":131,"./_global":136,"./_library":155}],170:[function(_dereq_,module,exports){
var pIE = _dereq_('./_object-pie');
var createDesc = _dereq_('./_property-desc');
var toIObject = _dereq_('./_to-iobject');
var toPrimitive = _dereq_('./_to-primitive');
var has = _dereq_('./_has');
var IE8_DOM_DEFINE = _dereq_('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = _dereq_('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":125,"./_has":137,"./_ie8-dom-define":140,"./_object-pie":177,"./_property-desc":185,"./_to-iobject":210,"./_to-primitive":213}],171:[function(_dereq_,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = _dereq_('./_to-iobject');
var gOPN = _dereq_('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":172,"./_to-iobject":210}],172:[function(_dereq_,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = _dereq_('./_object-keys-internal');
var hiddenKeys = _dereq_('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":127,"./_object-keys-internal":175}],173:[function(_dereq_,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],174:[function(_dereq_,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"./_has":137,"./_shared-key":195,"./_to-object":212,"dup":61}],175:[function(_dereq_,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./_array-includes":107,"./_has":137,"./_shared-key":195,"./_to-iobject":210,"dup":62}],176:[function(_dereq_,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"./_enum-bug-keys":127,"./_object-keys-internal":175,"dup":63}],177:[function(_dereq_,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64}],178:[function(_dereq_,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"./_core":119,"./_export":129,"./_fails":131,"dup":65}],179:[function(_dereq_,module,exports){
var getKeys = _dereq_('./_object-keys');
var toIObject = _dereq_('./_to-iobject');
var isEnum = _dereq_('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":176,"./_object-pie":177,"./_to-iobject":210}],180:[function(_dereq_,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = _dereq_('./_object-gopn');
var gOPS = _dereq_('./_object-gops');
var anObject = _dereq_('./_an-object');
var Reflect = _dereq_('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":103,"./_global":136,"./_object-gopn":172,"./_object-gops":173}],181:[function(_dereq_,module,exports){
var $parseFloat = _dereq_('./_global').parseFloat;
var $trim = _dereq_('./_string-trim').trim;

module.exports = 1 / $parseFloat(_dereq_('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":136,"./_string-trim":204,"./_string-ws":205}],182:[function(_dereq_,module,exports){
var $parseInt = _dereq_('./_global').parseInt;
var $trim = _dereq_('./_string-trim').trim;
var ws = _dereq_('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":136,"./_string-trim":204,"./_string-ws":205}],183:[function(_dereq_,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"dup":66}],184:[function(_dereq_,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"./_an-object":103,"./_is-object":147,"./_new-promise-capability":164,"dup":67}],185:[function(_dereq_,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"dup":68}],186:[function(_dereq_,module,exports){
var redefine = _dereq_('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":187}],187:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var hide = _dereq_('./_hide');
var has = _dereq_('./_has');
var SRC = _dereq_('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_dereq_('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":119,"./_global":136,"./_has":137,"./_hide":138,"./_uid":217}],188:[function(_dereq_,module,exports){
module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],189:[function(_dereq_,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],190:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = _dereq_('./_export');
var aFunction = _dereq_('./_a-function');
var ctx = _dereq_('./_ctx');
var forOf = _dereq_('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":99,"./_ctx":121,"./_export":129,"./_for-of":135}],191:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = _dereq_('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":129}],192:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = _dereq_('./_is-object');
var anObject = _dereq_('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _dereq_('./_ctx')(Function.call, _dereq_('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":103,"./_ctx":121,"./_is-object":147,"./_object-gopd":170}],193:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var dP = _dereq_('./_object-dp');
var DESCRIPTORS = _dereq_('./_descriptors');
var SPECIES = _dereq_('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":125,"./_global":136,"./_object-dp":167,"./_wks":221}],194:[function(_dereq_,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"./_has":137,"./_object-dp":167,"./_wks":221,"dup":72}],195:[function(_dereq_,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"./_shared":196,"./_uid":217,"dup":73}],196:[function(_dereq_,module,exports){
arguments[4][74][0].apply(exports,arguments)
},{"./_global":136,"dup":74}],197:[function(_dereq_,module,exports){
arguments[4][75][0].apply(exports,arguments)
},{"./_a-function":99,"./_an-object":103,"./_wks":221,"dup":75}],198:[function(_dereq_,module,exports){
'use strict';
var fails = _dereq_('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":131}],199:[function(_dereq_,module,exports){
arguments[4][76][0].apply(exports,arguments)
},{"./_defined":124,"./_to-integer":209,"dup":76}],200:[function(_dereq_,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = _dereq_('./_is-regexp');
var defined = _dereq_('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":124,"./_is-regexp":148}],201:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var fails = _dereq_('./_fails');
var defined = _dereq_('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":124,"./_export":129,"./_fails":131}],202:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = _dereq_('./_to-length');
var repeat = _dereq_('./_string-repeat');
var defined = _dereq_('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":124,"./_string-repeat":203,"./_to-length":211}],203:[function(_dereq_,module,exports){
'use strict';
var toInteger = _dereq_('./_to-integer');
var defined = _dereq_('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":124,"./_to-integer":209}],204:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var defined = _dereq_('./_defined');
var fails = _dereq_('./_fails');
var spaces = _dereq_('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":124,"./_export":129,"./_fails":131,"./_string-ws":205}],205:[function(_dereq_,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],206:[function(_dereq_,module,exports){
arguments[4][77][0].apply(exports,arguments)
},{"./_cof":114,"./_ctx":121,"./_dom-create":126,"./_global":136,"./_html":139,"./_invoke":142,"dup":77}],207:[function(_dereq_,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"./_to-integer":209,"dup":78}],208:[function(_dereq_,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = _dereq_('./_to-integer');
var toLength = _dereq_('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":209,"./_to-length":211}],209:[function(_dereq_,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"dup":79}],210:[function(_dereq_,module,exports){
arguments[4][80][0].apply(exports,arguments)
},{"./_defined":124,"./_iobject":143,"dup":80}],211:[function(_dereq_,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"./_to-integer":209,"dup":81}],212:[function(_dereq_,module,exports){
arguments[4][82][0].apply(exports,arguments)
},{"./_defined":124,"dup":82}],213:[function(_dereq_,module,exports){
arguments[4][83][0].apply(exports,arguments)
},{"./_is-object":147,"dup":83}],214:[function(_dereq_,module,exports){
'use strict';
if (_dereq_('./_descriptors')) {
  var LIBRARY = _dereq_('./_library');
  var global = _dereq_('./_global');
  var fails = _dereq_('./_fails');
  var $export = _dereq_('./_export');
  var $typed = _dereq_('./_typed');
  var $buffer = _dereq_('./_typed-buffer');
  var ctx = _dereq_('./_ctx');
  var anInstance = _dereq_('./_an-instance');
  var propertyDesc = _dereq_('./_property-desc');
  var hide = _dereq_('./_hide');
  var redefineAll = _dereq_('./_redefine-all');
  var toInteger = _dereq_('./_to-integer');
  var toLength = _dereq_('./_to-length');
  var toIndex = _dereq_('./_to-index');
  var toAbsoluteIndex = _dereq_('./_to-absolute-index');
  var toPrimitive = _dereq_('./_to-primitive');
  var has = _dereq_('./_has');
  var classof = _dereq_('./_classof');
  var isObject = _dereq_('./_is-object');
  var toObject = _dereq_('./_to-object');
  var isArrayIter = _dereq_('./_is-array-iter');
  var create = _dereq_('./_object-create');
  var getPrototypeOf = _dereq_('./_object-gpo');
  var gOPN = _dereq_('./_object-gopn').f;
  var getIterFn = _dereq_('./core.get-iterator-method');
  var uid = _dereq_('./_uid');
  var wks = _dereq_('./_wks');
  var createArrayMethod = _dereq_('./_array-methods');
  var createArrayIncludes = _dereq_('./_array-includes');
  var speciesConstructor = _dereq_('./_species-constructor');
  var ArrayIterators = _dereq_('./es6.array.iterator');
  var Iterators = _dereq_('./_iterators');
  var $iterDetect = _dereq_('./_iter-detect');
  var setSpecies = _dereq_('./_set-species');
  var arrayFill = _dereq_('./_array-fill');
  var arrayCopyWithin = _dereq_('./_array-copy-within');
  var $DP = _dereq_('./_object-dp');
  var $GOPD = _dereq_('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":102,"./_array-copy-within":104,"./_array-fill":105,"./_array-includes":107,"./_array-methods":108,"./_classof":113,"./_ctx":121,"./_descriptors":125,"./_export":129,"./_fails":131,"./_global":136,"./_has":137,"./_hide":138,"./_is-array-iter":144,"./_is-object":147,"./_iter-detect":152,"./_iterators":154,"./_library":155,"./_object-create":166,"./_object-dp":167,"./_object-gopd":170,"./_object-gopn":172,"./_object-gpo":174,"./_property-desc":185,"./_redefine-all":186,"./_set-species":193,"./_species-constructor":197,"./_to-absolute-index":207,"./_to-index":208,"./_to-integer":209,"./_to-length":211,"./_to-object":212,"./_to-primitive":213,"./_typed":216,"./_typed-buffer":215,"./_uid":217,"./_wks":221,"./core.get-iterator-method":222,"./es6.array.iterator":234}],215:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var DESCRIPTORS = _dereq_('./_descriptors');
var LIBRARY = _dereq_('./_library');
var $typed = _dereq_('./_typed');
var hide = _dereq_('./_hide');
var redefineAll = _dereq_('./_redefine-all');
var fails = _dereq_('./_fails');
var anInstance = _dereq_('./_an-instance');
var toInteger = _dereq_('./_to-integer');
var toLength = _dereq_('./_to-length');
var toIndex = _dereq_('./_to-index');
var gOPN = _dereq_('./_object-gopn').f;
var dP = _dereq_('./_object-dp').f;
var arrayFill = _dereq_('./_array-fill');
var setToStringTag = _dereq_('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":102,"./_array-fill":105,"./_descriptors":125,"./_fails":131,"./_global":136,"./_hide":138,"./_library":155,"./_object-dp":167,"./_object-gopn":172,"./_redefine-all":186,"./_set-to-string-tag":194,"./_to-index":208,"./_to-integer":209,"./_to-length":211,"./_typed":216}],216:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var hide = _dereq_('./_hide');
var uid = _dereq_('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":136,"./_hide":138,"./_uid":217}],217:[function(_dereq_,module,exports){
arguments[4][84][0].apply(exports,arguments)
},{"dup":84}],218:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":147}],219:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var LIBRARY = _dereq_('./_library');
var wksExt = _dereq_('./_wks-ext');
var defineProperty = _dereq_('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":119,"./_global":136,"./_library":155,"./_object-dp":167,"./_wks-ext":220}],220:[function(_dereq_,module,exports){
exports.f = _dereq_('./_wks');

},{"./_wks":221}],221:[function(_dereq_,module,exports){
arguments[4][85][0].apply(exports,arguments)
},{"./_global":136,"./_shared":196,"./_uid":217,"dup":85}],222:[function(_dereq_,module,exports){
arguments[4][86][0].apply(exports,arguments)
},{"./_classof":113,"./_core":119,"./_iterators":154,"./_wks":221,"dup":86}],223:[function(_dereq_,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = _dereq_('./_export');
var $re = _dereq_('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });

},{"./_export":129,"./_replacer":188}],224:[function(_dereq_,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = _dereq_('./_export');

$export($export.P, 'Array', { copyWithin: _dereq_('./_array-copy-within') });

_dereq_('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":101,"./_array-copy-within":104,"./_export":129}],225:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $every = _dereq_('./_array-methods')(4);

$export($export.P + $export.F * !_dereq_('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":108,"./_export":129,"./_strict-method":198}],226:[function(_dereq_,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = _dereq_('./_export');

$export($export.P, 'Array', { fill: _dereq_('./_array-fill') });

_dereq_('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":101,"./_array-fill":105,"./_export":129}],227:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $filter = _dereq_('./_array-methods')(2);

$export($export.P + $export.F * !_dereq_('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":108,"./_export":129,"./_strict-method":198}],228:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = _dereq_('./_export');
var $find = _dereq_('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":101,"./_array-methods":108,"./_export":129}],229:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = _dereq_('./_export');
var $find = _dereq_('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_dereq_('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":101,"./_array-methods":108,"./_export":129}],230:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $forEach = _dereq_('./_array-methods')(0);
var STRICT = _dereq_('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":108,"./_export":129,"./_strict-method":198}],231:[function(_dereq_,module,exports){
arguments[4][89][0].apply(exports,arguments)
},{"./_create-property":120,"./_ctx":121,"./_export":129,"./_is-array-iter":144,"./_iter-call":149,"./_iter-detect":152,"./_to-length":211,"./_to-object":212,"./core.get-iterator-method":222,"dup":89}],232:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $indexOf = _dereq_('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !_dereq_('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":107,"./_export":129,"./_strict-method":198}],233:[function(_dereq_,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = _dereq_('./_export');

$export($export.S, 'Array', { isArray: _dereq_('./_is-array') });

},{"./_export":129,"./_is-array":145}],234:[function(_dereq_,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"./_add-to-unscopables":101,"./_iter-define":151,"./_iter-step":153,"./_iterators":154,"./_to-iobject":210,"dup":90}],235:[function(_dereq_,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = _dereq_('./_export');
var toIObject = _dereq_('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (_dereq_('./_iobject') != Object || !_dereq_('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":129,"./_iobject":143,"./_strict-method":198,"./_to-iobject":210}],236:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toIObject = _dereq_('./_to-iobject');
var toInteger = _dereq_('./_to-integer');
var toLength = _dereq_('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !_dereq_('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":129,"./_strict-method":198,"./_to-integer":209,"./_to-iobject":210,"./_to-length":211}],237:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $map = _dereq_('./_array-methods')(1);

$export($export.P + $export.F * !_dereq_('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":108,"./_export":129,"./_strict-method":198}],238:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var createProperty = _dereq_('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * _dereq_('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":120,"./_export":129,"./_fails":131}],239:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $reduce = _dereq_('./_array-reduce');

$export($export.P + $export.F * !_dereq_('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":109,"./_export":129,"./_strict-method":198}],240:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $reduce = _dereq_('./_array-reduce');

$export($export.P + $export.F * !_dereq_('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":109,"./_export":129,"./_strict-method":198}],241:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var html = _dereq_('./_html');
var cof = _dereq_('./_cof');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
var toLength = _dereq_('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * _dereq_('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_cof":114,"./_export":129,"./_fails":131,"./_html":139,"./_to-absolute-index":207,"./_to-length":211}],242:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $some = _dereq_('./_array-methods')(3);

$export($export.P + $export.F * !_dereq_('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":108,"./_export":129,"./_strict-method":198}],243:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var aFunction = _dereq_('./_a-function');
var toObject = _dereq_('./_to-object');
var fails = _dereq_('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !_dereq_('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":99,"./_export":129,"./_fails":131,"./_strict-method":198,"./_to-object":212}],244:[function(_dereq_,module,exports){
_dereq_('./_set-species')('Array');

},{"./_set-species":193}],245:[function(_dereq_,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = _dereq_('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":129}],246:[function(_dereq_,module,exports){
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = _dereq_('./_export');
var toISOString = _dereq_('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_date-to-iso-string":122,"./_export":129}],247:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toObject = _dereq_('./_to-object');
var toPrimitive = _dereq_('./_to-primitive');

$export($export.P + $export.F * _dereq_('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":129,"./_fails":131,"./_to-object":212,"./_to-primitive":213}],248:[function(_dereq_,module,exports){
var TO_PRIMITIVE = _dereq_('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) _dereq_('./_hide')(proto, TO_PRIMITIVE, _dereq_('./_date-to-primitive'));

},{"./_date-to-primitive":123,"./_hide":138,"./_wks":221}],249:[function(_dereq_,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  _dereq_('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":187}],250:[function(_dereq_,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = _dereq_('./_export');

$export($export.P, 'Function', { bind: _dereq_('./_bind') });

},{"./_bind":112,"./_export":129}],251:[function(_dereq_,module,exports){
'use strict';
var isObject = _dereq_('./_is-object');
var getPrototypeOf = _dereq_('./_object-gpo');
var HAS_INSTANCE = _dereq_('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) _dereq_('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":147,"./_object-dp":167,"./_object-gpo":174,"./_wks":221}],252:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || _dereq_('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":125,"./_object-dp":167}],253:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');
var validate = _dereq_('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = _dereq_('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":118,"./_collection-strong":115,"./_validate-collection":218}],254:[function(_dereq_,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = _dereq_('./_export');
var log1p = _dereq_('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":129,"./_math-log1p":158}],255:[function(_dereq_,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = _dereq_('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":129}],256:[function(_dereq_,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = _dereq_('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":129}],257:[function(_dereq_,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = _dereq_('./_export');
var sign = _dereq_('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":129,"./_math-sign":160}],258:[function(_dereq_,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":129}],259:[function(_dereq_,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = _dereq_('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":129}],260:[function(_dereq_,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = _dereq_('./_export');
var $expm1 = _dereq_('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":129,"./_math-expm1":156}],261:[function(_dereq_,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', { fround: _dereq_('./_math-fround') });

},{"./_export":129,"./_math-fround":157}],262:[function(_dereq_,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = _dereq_('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":129}],263:[function(_dereq_,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = _dereq_('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * _dereq_('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":129,"./_fails":131}],264:[function(_dereq_,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":129}],265:[function(_dereq_,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', { log1p: _dereq_('./_math-log1p') });

},{"./_export":129,"./_math-log1p":158}],266:[function(_dereq_,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":129}],267:[function(_dereq_,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', { sign: _dereq_('./_math-sign') });

},{"./_export":129,"./_math-sign":160}],268:[function(_dereq_,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = _dereq_('./_export');
var expm1 = _dereq_('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * _dereq_('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":129,"./_fails":131,"./_math-expm1":156}],269:[function(_dereq_,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = _dereq_('./_export');
var expm1 = _dereq_('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":129,"./_math-expm1":156}],270:[function(_dereq_,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":129}],271:[function(_dereq_,module,exports){
'use strict';
var global = _dereq_('./_global');
var has = _dereq_('./_has');
var cof = _dereq_('./_cof');
var inheritIfRequired = _dereq_('./_inherit-if-required');
var toPrimitive = _dereq_('./_to-primitive');
var fails = _dereq_('./_fails');
var gOPN = _dereq_('./_object-gopn').f;
var gOPD = _dereq_('./_object-gopd').f;
var dP = _dereq_('./_object-dp').f;
var $trim = _dereq_('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(_dereq_('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = _dereq_('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  _dereq_('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":114,"./_descriptors":125,"./_fails":131,"./_global":136,"./_has":137,"./_inherit-if-required":141,"./_object-create":166,"./_object-dp":167,"./_object-gopd":170,"./_object-gopn":172,"./_redefine":187,"./_string-trim":204,"./_to-primitive":213}],272:[function(_dereq_,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = _dereq_('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":129}],273:[function(_dereq_,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = _dereq_('./_export');
var _isFinite = _dereq_('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":129,"./_global":136}],274:[function(_dereq_,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = _dereq_('./_export');

$export($export.S, 'Number', { isInteger: _dereq_('./_is-integer') });

},{"./_export":129,"./_is-integer":146}],275:[function(_dereq_,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = _dereq_('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":129}],276:[function(_dereq_,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = _dereq_('./_export');
var isInteger = _dereq_('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":129,"./_is-integer":146}],277:[function(_dereq_,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = _dereq_('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":129}],278:[function(_dereq_,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = _dereq_('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":129}],279:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var $parseFloat = _dereq_('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":129,"./_parse-float":181}],280:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var $parseInt = _dereq_('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":129,"./_parse-int":182}],281:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toInteger = _dereq_('./_to-integer');
var aNumberValue = _dereq_('./_a-number-value');
var repeat = _dereq_('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !_dereq_('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_a-number-value":100,"./_export":129,"./_fails":131,"./_string-repeat":203,"./_to-integer":209}],282:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $fails = _dereq_('./_fails');
var aNumberValue = _dereq_('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":100,"./_export":129,"./_fails":131}],283:[function(_dereq_,module,exports){
arguments[4][91][0].apply(exports,arguments)
},{"./_export":129,"./_object-assign":165,"dup":91}],284:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: _dereq_('./_object-create') });

},{"./_export":129,"./_object-create":166}],285:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !_dereq_('./_descriptors'), 'Object', { defineProperties: _dereq_('./_object-dps') });

},{"./_descriptors":125,"./_export":129,"./_object-dps":168}],286:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !_dereq_('./_descriptors'), 'Object', { defineProperty: _dereq_('./_object-dp').f });

},{"./_descriptors":125,"./_export":129,"./_object-dp":167}],287:[function(_dereq_,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = _dereq_('./_is-object');
var meta = _dereq_('./_meta').onFreeze;

_dereq_('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":147,"./_meta":161,"./_object-sap":178}],288:[function(_dereq_,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = _dereq_('./_to-iobject');
var $getOwnPropertyDescriptor = _dereq_('./_object-gopd').f;

_dereq_('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":170,"./_object-sap":178,"./_to-iobject":210}],289:[function(_dereq_,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
_dereq_('./_object-sap')('getOwnPropertyNames', function () {
  return _dereq_('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":171,"./_object-sap":178}],290:[function(_dereq_,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = _dereq_('./_to-object');
var $getPrototypeOf = _dereq_('./_object-gpo');

_dereq_('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":174,"./_object-sap":178,"./_to-object":212}],291:[function(_dereq_,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = _dereq_('./_is-object');

_dereq_('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":147,"./_object-sap":178}],292:[function(_dereq_,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = _dereq_('./_is-object');

_dereq_('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":147,"./_object-sap":178}],293:[function(_dereq_,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = _dereq_('./_is-object');

_dereq_('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":147,"./_object-sap":178}],294:[function(_dereq_,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = _dereq_('./_export');
$export($export.S, 'Object', { is: _dereq_('./_same-value') });

},{"./_export":129,"./_same-value":189}],295:[function(_dereq_,module,exports){
arguments[4][92][0].apply(exports,arguments)
},{"./_object-keys":176,"./_object-sap":178,"./_to-object":212,"dup":92}],296:[function(_dereq_,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = _dereq_('./_is-object');
var meta = _dereq_('./_meta').onFreeze;

_dereq_('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":147,"./_meta":161,"./_object-sap":178}],297:[function(_dereq_,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = _dereq_('./_is-object');
var meta = _dereq_('./_meta').onFreeze;

_dereq_('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":147,"./_meta":161,"./_object-sap":178}],298:[function(_dereq_,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = _dereq_('./_export');
$export($export.S, 'Object', { setPrototypeOf: _dereq_('./_set-proto').set });

},{"./_export":129,"./_set-proto":192}],299:[function(_dereq_,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = _dereq_('./_classof');
var test = {};
test[_dereq_('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  _dereq_('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":113,"./_redefine":187,"./_wks":221}],300:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var $parseFloat = _dereq_('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":129,"./_parse-float":181}],301:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var $parseInt = _dereq_('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":129,"./_parse-int":182}],302:[function(_dereq_,module,exports){
arguments[4][94][0].apply(exports,arguments)
},{"./_a-function":99,"./_an-instance":102,"./_classof":113,"./_core":119,"./_ctx":121,"./_export":129,"./_for-of":135,"./_global":136,"./_is-object":147,"./_iter-detect":152,"./_library":155,"./_microtask":163,"./_new-promise-capability":164,"./_perform":183,"./_promise-resolve":184,"./_redefine-all":186,"./_set-species":193,"./_set-to-string-tag":194,"./_species-constructor":197,"./_task":206,"./_wks":221,"dup":94}],303:[function(_dereq_,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = _dereq_('./_export');
var aFunction = _dereq_('./_a-function');
var anObject = _dereq_('./_an-object');
var rApply = (_dereq_('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !_dereq_('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":99,"./_an-object":103,"./_export":129,"./_fails":131,"./_global":136}],304:[function(_dereq_,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = _dereq_('./_export');
var create = _dereq_('./_object-create');
var aFunction = _dereq_('./_a-function');
var anObject = _dereq_('./_an-object');
var isObject = _dereq_('./_is-object');
var fails = _dereq_('./_fails');
var bind = _dereq_('./_bind');
var rConstruct = (_dereq_('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":99,"./_an-object":103,"./_bind":112,"./_export":129,"./_fails":131,"./_global":136,"./_is-object":147,"./_object-create":166}],305:[function(_dereq_,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = _dereq_('./_object-dp');
var $export = _dereq_('./_export');
var anObject = _dereq_('./_an-object');
var toPrimitive = _dereq_('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * _dereq_('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":103,"./_export":129,"./_fails":131,"./_object-dp":167,"./_to-primitive":213}],306:[function(_dereq_,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = _dereq_('./_export');
var gOPD = _dereq_('./_object-gopd').f;
var anObject = _dereq_('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":103,"./_export":129,"./_object-gopd":170}],307:[function(_dereq_,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = _dereq_('./_export');
var anObject = _dereq_('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
_dereq_('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":103,"./_export":129,"./_iter-create":150}],308:[function(_dereq_,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = _dereq_('./_object-gopd');
var $export = _dereq_('./_export');
var anObject = _dereq_('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":103,"./_export":129,"./_object-gopd":170}],309:[function(_dereq_,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = _dereq_('./_export');
var getProto = _dereq_('./_object-gpo');
var anObject = _dereq_('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":103,"./_export":129,"./_object-gpo":174}],310:[function(_dereq_,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = _dereq_('./_object-gopd');
var getPrototypeOf = _dereq_('./_object-gpo');
var has = _dereq_('./_has');
var $export = _dereq_('./_export');
var isObject = _dereq_('./_is-object');
var anObject = _dereq_('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":103,"./_export":129,"./_has":137,"./_is-object":147,"./_object-gopd":170,"./_object-gpo":174}],311:[function(_dereq_,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = _dereq_('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":129}],312:[function(_dereq_,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = _dereq_('./_export');
var anObject = _dereq_('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":103,"./_export":129}],313:[function(_dereq_,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = _dereq_('./_export');

$export($export.S, 'Reflect', { ownKeys: _dereq_('./_own-keys') });

},{"./_export":129,"./_own-keys":180}],314:[function(_dereq_,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = _dereq_('./_export');
var anObject = _dereq_('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":103,"./_export":129}],315:[function(_dereq_,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = _dereq_('./_export');
var setProto = _dereq_('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":129,"./_set-proto":192}],316:[function(_dereq_,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = _dereq_('./_object-dp');
var gOPD = _dereq_('./_object-gopd');
var getPrototypeOf = _dereq_('./_object-gpo');
var has = _dereq_('./_has');
var $export = _dereq_('./_export');
var createDesc = _dereq_('./_property-desc');
var anObject = _dereq_('./_an-object');
var isObject = _dereq_('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":103,"./_export":129,"./_has":137,"./_is-object":147,"./_object-dp":167,"./_object-gopd":170,"./_object-gpo":174,"./_property-desc":185}],317:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var inheritIfRequired = _dereq_('./_inherit-if-required');
var dP = _dereq_('./_object-dp').f;
var gOPN = _dereq_('./_object-gopn').f;
var isRegExp = _dereq_('./_is-regexp');
var $flags = _dereq_('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (_dereq_('./_descriptors') && (!CORRECT_NEW || _dereq_('./_fails')(function () {
  re2[_dereq_('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  _dereq_('./_redefine')(global, 'RegExp', $RegExp);
}

_dereq_('./_set-species')('RegExp');

},{"./_descriptors":125,"./_fails":131,"./_flags":133,"./_global":136,"./_inherit-if-required":141,"./_is-regexp":148,"./_object-dp":167,"./_object-gopn":172,"./_redefine":187,"./_set-species":193,"./_wks":221}],318:[function(_dereq_,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (_dereq_('./_descriptors') && /./g.flags != 'g') _dereq_('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: _dereq_('./_flags')
});

},{"./_descriptors":125,"./_flags":133,"./_object-dp":167}],319:[function(_dereq_,module,exports){
// @@match logic
_dereq_('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":132}],320:[function(_dereq_,module,exports){
// @@replace logic
_dereq_('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":132}],321:[function(_dereq_,module,exports){
// @@search logic
_dereq_('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":132}],322:[function(_dereq_,module,exports){
// @@split logic
_dereq_('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = _dereq_('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":132,"./_is-regexp":148}],323:[function(_dereq_,module,exports){
'use strict';
_dereq_('./es6.regexp.flags');
var anObject = _dereq_('./_an-object');
var $flags = _dereq_('./_flags');
var DESCRIPTORS = _dereq_('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  _dereq_('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (_dereq_('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":103,"./_descriptors":125,"./_fails":131,"./_flags":133,"./_redefine":187,"./es6.regexp.flags":318}],324:[function(_dereq_,module,exports){
'use strict';
var strong = _dereq_('./_collection-strong');
var validate = _dereq_('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = _dereq_('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":118,"./_collection-strong":115,"./_validate-collection":218}],325:[function(_dereq_,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
_dereq_('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":201}],326:[function(_dereq_,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
_dereq_('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":201}],327:[function(_dereq_,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
_dereq_('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":201}],328:[function(_dereq_,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
_dereq_('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":201}],329:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $at = _dereq_('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":129,"./_string-at":199}],330:[function(_dereq_,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = _dereq_('./_export');
var toLength = _dereq_('./_to-length');
var context = _dereq_('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * _dereq_('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":129,"./_fails-is-regexp":130,"./_string-context":200,"./_to-length":211}],331:[function(_dereq_,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
_dereq_('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":201}],332:[function(_dereq_,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
_dereq_('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":201}],333:[function(_dereq_,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
_dereq_('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":201}],334:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":129,"./_to-absolute-index":207}],335:[function(_dereq_,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = _dereq_('./_export');
var context = _dereq_('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * _dereq_('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":129,"./_fails-is-regexp":130,"./_string-context":200}],336:[function(_dereq_,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
_dereq_('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":201}],337:[function(_dereq_,module,exports){
arguments[4][95][0].apply(exports,arguments)
},{"./_iter-define":151,"./_string-at":199,"dup":95}],338:[function(_dereq_,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
_dereq_('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":201}],339:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var toIObject = _dereq_('./_to-iobject');
var toLength = _dereq_('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":129,"./_to-iobject":210,"./_to-length":211}],340:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: _dereq_('./_string-repeat')
});

},{"./_export":129,"./_string-repeat":203}],341:[function(_dereq_,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
_dereq_('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":201}],342:[function(_dereq_,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = _dereq_('./_export');
var toLength = _dereq_('./_to-length');
var context = _dereq_('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * _dereq_('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":129,"./_fails-is-regexp":130,"./_string-context":200,"./_to-length":211}],343:[function(_dereq_,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
_dereq_('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":201}],344:[function(_dereq_,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
_dereq_('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":201}],345:[function(_dereq_,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
_dereq_('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":201}],346:[function(_dereq_,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
_dereq_('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":204}],347:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = _dereq_('./_global');
var has = _dereq_('./_has');
var DESCRIPTORS = _dereq_('./_descriptors');
var $export = _dereq_('./_export');
var redefine = _dereq_('./_redefine');
var META = _dereq_('./_meta').KEY;
var $fails = _dereq_('./_fails');
var shared = _dereq_('./_shared');
var setToStringTag = _dereq_('./_set-to-string-tag');
var uid = _dereq_('./_uid');
var wks = _dereq_('./_wks');
var wksExt = _dereq_('./_wks-ext');
var wksDefine = _dereq_('./_wks-define');
var enumKeys = _dereq_('./_enum-keys');
var isArray = _dereq_('./_is-array');
var anObject = _dereq_('./_an-object');
var toIObject = _dereq_('./_to-iobject');
var toPrimitive = _dereq_('./_to-primitive');
var createDesc = _dereq_('./_property-desc');
var _create = _dereq_('./_object-create');
var gOPNExt = _dereq_('./_object-gopn-ext');
var $GOPD = _dereq_('./_object-gopd');
var $DP = _dereq_('./_object-dp');
var $keys = _dereq_('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  _dereq_('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  _dereq_('./_object-pie').f = $propertyIsEnumerable;
  _dereq_('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !_dereq_('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || _dereq_('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":103,"./_descriptors":125,"./_enum-keys":128,"./_export":129,"./_fails":131,"./_global":136,"./_has":137,"./_hide":138,"./_is-array":145,"./_library":155,"./_meta":161,"./_object-create":166,"./_object-dp":167,"./_object-gopd":170,"./_object-gopn":172,"./_object-gopn-ext":171,"./_object-gops":173,"./_object-keys":176,"./_object-pie":177,"./_property-desc":185,"./_redefine":187,"./_set-to-string-tag":194,"./_shared":196,"./_to-iobject":210,"./_to-primitive":213,"./_uid":217,"./_wks":221,"./_wks-define":219,"./_wks-ext":220}],348:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var $typed = _dereq_('./_typed');
var buffer = _dereq_('./_typed-buffer');
var anObject = _dereq_('./_an-object');
var toAbsoluteIndex = _dereq_('./_to-absolute-index');
var toLength = _dereq_('./_to-length');
var isObject = _dereq_('./_is-object');
var ArrayBuffer = _dereq_('./_global').ArrayBuffer;
var speciesConstructor = _dereq_('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * _dereq_('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

_dereq_('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":103,"./_export":129,"./_fails":131,"./_global":136,"./_is-object":147,"./_set-species":193,"./_species-constructor":197,"./_to-absolute-index":207,"./_to-length":211,"./_typed":216,"./_typed-buffer":215}],349:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
$export($export.G + $export.W + $export.F * !_dereq_('./_typed').ABV, {
  DataView: _dereq_('./_typed-buffer').DataView
});

},{"./_export":129,"./_typed":216,"./_typed-buffer":215}],350:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],351:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],352:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],353:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],354:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],355:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],356:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],357:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":214}],358:[function(_dereq_,module,exports){
_dereq_('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":214}],359:[function(_dereq_,module,exports){
'use strict';
var each = _dereq_('./_array-methods')(0);
var redefine = _dereq_('./_redefine');
var meta = _dereq_('./_meta');
var assign = _dereq_('./_object-assign');
var weak = _dereq_('./_collection-weak');
var isObject = _dereq_('./_is-object');
var fails = _dereq_('./_fails');
var validate = _dereq_('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = _dereq_('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":108,"./_collection":118,"./_collection-weak":117,"./_fails":131,"./_is-object":147,"./_meta":161,"./_object-assign":165,"./_redefine":187,"./_validate-collection":218}],360:[function(_dereq_,module,exports){
'use strict';
var weak = _dereq_('./_collection-weak');
var validate = _dereq_('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
_dereq_('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":118,"./_collection-weak":117,"./_validate-collection":218}],361:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = _dereq_('./_export');
var flattenIntoArray = _dereq_('./_flatten-into-array');
var toObject = _dereq_('./_to-object');
var toLength = _dereq_('./_to-length');
var aFunction = _dereq_('./_a-function');
var arraySpeciesCreate = _dereq_('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

_dereq_('./_add-to-unscopables')('flatMap');

},{"./_a-function":99,"./_add-to-unscopables":101,"./_array-species-create":111,"./_export":129,"./_flatten-into-array":134,"./_to-length":211,"./_to-object":212}],362:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = _dereq_('./_export');
var flattenIntoArray = _dereq_('./_flatten-into-array');
var toObject = _dereq_('./_to-object');
var toLength = _dereq_('./_to-length');
var toInteger = _dereq_('./_to-integer');
var arraySpeciesCreate = _dereq_('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

_dereq_('./_add-to-unscopables')('flatten');

},{"./_add-to-unscopables":101,"./_array-species-create":111,"./_export":129,"./_flatten-into-array":134,"./_to-integer":209,"./_to-length":211,"./_to-object":212}],363:[function(_dereq_,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = _dereq_('./_export');
var $includes = _dereq_('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

_dereq_('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":101,"./_array-includes":107,"./_export":129}],364:[function(_dereq_,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = _dereq_('./_export');
var microtask = _dereq_('./_microtask')();
var process = _dereq_('./_global').process;
var isNode = _dereq_('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_cof":114,"./_export":129,"./_global":136,"./_microtask":163}],365:[function(_dereq_,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = _dereq_('./_export');
var cof = _dereq_('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_cof":114,"./_export":129}],366:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-global
var $export = _dereq_('./_export');

$export($export.G, { global: _dereq_('./_global') });

},{"./_export":129,"./_global":136}],367:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
_dereq_('./_set-collection-from')('Map');

},{"./_set-collection-from":190}],368:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
_dereq_('./_set-collection-of')('Map');

},{"./_set-collection-of":191}],369:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Map', { toJSON: _dereq_('./_collection-to-json')('Map') });

},{"./_collection-to-json":116,"./_export":129}],370:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

},{"./_export":129}],371:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

},{"./_export":129}],372:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

},{"./_export":129}],373:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');
var scale = _dereq_('./_math-scale');
var fround = _dereq_('./_math-fround');

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

},{"./_export":129,"./_math-fround":157,"./_math-scale":159}],374:[function(_dereq_,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":129}],375:[function(_dereq_,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":129}],376:[function(_dereq_,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":129}],377:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

},{"./_export":129}],378:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

},{"./_export":129}],379:[function(_dereq_,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = _dereq_('./_export');

$export($export.S, 'Math', { scale: _dereq_('./_math-scale') });

},{"./_export":129,"./_math-scale":159}],380:[function(_dereq_,module,exports){
// http://jfbastien.github.io/papers/Math.signbit.html
var $export = _dereq_('./_export');

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });

},{"./_export":129}],381:[function(_dereq_,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = _dereq_('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":129}],382:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toObject = _dereq_('./_to-object');
var aFunction = _dereq_('./_a-function');
var $defineProperty = _dereq_('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
_dereq_('./_descriptors') && $export($export.P + _dereq_('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":99,"./_descriptors":125,"./_export":129,"./_object-dp":167,"./_object-forced-pam":169,"./_to-object":212}],383:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toObject = _dereq_('./_to-object');
var aFunction = _dereq_('./_a-function');
var $defineProperty = _dereq_('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
_dereq_('./_descriptors') && $export($export.P + _dereq_('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":99,"./_descriptors":125,"./_export":129,"./_object-dp":167,"./_object-forced-pam":169,"./_to-object":212}],384:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = _dereq_('./_export');
var $entries = _dereq_('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":129,"./_object-to-array":179}],385:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = _dereq_('./_export');
var ownKeys = _dereq_('./_own-keys');
var toIObject = _dereq_('./_to-iobject');
var gOPD = _dereq_('./_object-gopd');
var createProperty = _dereq_('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":120,"./_export":129,"./_object-gopd":170,"./_own-keys":180,"./_to-iobject":210}],386:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toObject = _dereq_('./_to-object');
var toPrimitive = _dereq_('./_to-primitive');
var getPrototypeOf = _dereq_('./_object-gpo');
var getOwnPropertyDescriptor = _dereq_('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
_dereq_('./_descriptors') && $export($export.P + _dereq_('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":125,"./_export":129,"./_object-forced-pam":169,"./_object-gopd":170,"./_object-gpo":174,"./_to-object":212,"./_to-primitive":213}],387:[function(_dereq_,module,exports){
'use strict';
var $export = _dereq_('./_export');
var toObject = _dereq_('./_to-object');
var toPrimitive = _dereq_('./_to-primitive');
var getPrototypeOf = _dereq_('./_object-gpo');
var getOwnPropertyDescriptor = _dereq_('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
_dereq_('./_descriptors') && $export($export.P + _dereq_('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":125,"./_export":129,"./_object-forced-pam":169,"./_object-gopd":170,"./_object-gpo":174,"./_to-object":212,"./_to-primitive":213}],388:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = _dereq_('./_export');
var $values = _dereq_('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":129,"./_object-to-array":179}],389:[function(_dereq_,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export = _dereq_('./_export');
var global = _dereq_('./_global');
var core = _dereq_('./_core');
var microtask = _dereq_('./_microtask')();
var OBSERVABLE = _dereq_('./_wks')('observable');
var aFunction = _dereq_('./_a-function');
var anObject = _dereq_('./_an-object');
var anInstance = _dereq_('./_an-instance');
var redefineAll = _dereq_('./_redefine-all');
var hide = _dereq_('./_hide');
var forOf = _dereq_('./_for-of');
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

_dereq_('./_set-species')('Observable');

},{"./_a-function":99,"./_an-instance":102,"./_an-object":103,"./_core":119,"./_export":129,"./_for-of":135,"./_global":136,"./_hide":138,"./_microtask":163,"./_redefine-all":186,"./_set-species":193,"./_wks":221}],390:[function(_dereq_,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"./_core":119,"./_export":129,"./_global":136,"./_promise-resolve":184,"./_species-constructor":197,"dup":96}],391:[function(_dereq_,module,exports){
arguments[4][97][0].apply(exports,arguments)
},{"./_export":129,"./_new-promise-capability":164,"./_perform":183,"dup":97}],392:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });

},{"./_an-object":103,"./_metadata":162}],393:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });

},{"./_an-object":103,"./_metadata":162}],394:[function(_dereq_,module,exports){
var Set = _dereq_('./es6.set');
var from = _dereq_('./_array-from-iterable');
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var getPrototypeOf = _dereq_('./_object-gpo');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":103,"./_array-from-iterable":106,"./_metadata":162,"./_object-gpo":174,"./es6.set":324}],395:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var getPrototypeOf = _dereq_('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":103,"./_metadata":162,"./_object-gpo":174}],396:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":103,"./_metadata":162}],397:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":103,"./_metadata":162}],398:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var getPrototypeOf = _dereq_('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":103,"./_metadata":162,"./_object-gpo":174}],399:[function(_dereq_,module,exports){
var metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":103,"./_metadata":162}],400:[function(_dereq_,module,exports){
var $metadata = _dereq_('./_metadata');
var anObject = _dereq_('./_an-object');
var aFunction = _dereq_('./_a-function');
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });

},{"./_a-function":99,"./_an-object":103,"./_metadata":162}],401:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
_dereq_('./_set-collection-from')('Set');

},{"./_set-collection-from":190}],402:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
_dereq_('./_set-collection-of')('Set');

},{"./_set-collection-of":191}],403:[function(_dereq_,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = _dereq_('./_export');

$export($export.P + $export.R, 'Set', { toJSON: _dereq_('./_collection-to-json')('Set') });

},{"./_collection-to-json":116,"./_export":129}],404:[function(_dereq_,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = _dereq_('./_export');
var $at = _dereq_('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":129,"./_string-at":199}],405:[function(_dereq_,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export = _dereq_('./_export');
var defined = _dereq_('./_defined');
var toLength = _dereq_('./_to-length');
var isRegExp = _dereq_('./_is-regexp');
var getFlags = _dereq_('./_flags');
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

_dereq_('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_defined":124,"./_export":129,"./_flags":133,"./_is-regexp":148,"./_iter-create":150,"./_to-length":211}],406:[function(_dereq_,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = _dereq_('./_export');
var $pad = _dereq_('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":129,"./_string-pad":202}],407:[function(_dereq_,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = _dereq_('./_export');
var $pad = _dereq_('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":129,"./_string-pad":202}],408:[function(_dereq_,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
_dereq_('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":204}],409:[function(_dereq_,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
_dereq_('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":204}],410:[function(_dereq_,module,exports){
_dereq_('./_wks-define')('asyncIterator');

},{"./_wks-define":219}],411:[function(_dereq_,module,exports){
_dereq_('./_wks-define')('observable');

},{"./_wks-define":219}],412:[function(_dereq_,module,exports){
// https://github.com/tc39/proposal-global
var $export = _dereq_('./_export');

$export($export.S, 'System', { global: _dereq_('./_global') });

},{"./_export":129,"./_global":136}],413:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
_dereq_('./_set-collection-from')('WeakMap');

},{"./_set-collection-from":190}],414:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
_dereq_('./_set-collection-of')('WeakMap');

},{"./_set-collection-of":191}],415:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
_dereq_('./_set-collection-from')('WeakSet');

},{"./_set-collection-from":190}],416:[function(_dereq_,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
_dereq_('./_set-collection-of')('WeakSet');

},{"./_set-collection-of":191}],417:[function(_dereq_,module,exports){
var $iterators = _dereq_('./es6.array.iterator');
var getKeys = _dereq_('./_object-keys');
var redefine = _dereq_('./_redefine');
var global = _dereq_('./_global');
var hide = _dereq_('./_hide');
var Iterators = _dereq_('./_iterators');
var wks = _dereq_('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":136,"./_hide":138,"./_iterators":154,"./_object-keys":176,"./_redefine":187,"./_wks":221,"./es6.array.iterator":234}],418:[function(_dereq_,module,exports){
var $export = _dereq_('./_export');
var $task = _dereq_('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":129,"./_task":206}],419:[function(_dereq_,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = _dereq_('./_global');
var $export = _dereq_('./_export');
var navigator = global.navigator;
var slice = [].slice;
var MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":129,"./_global":136}],420:[function(_dereq_,module,exports){
_dereq_('./modules/es6.symbol');
_dereq_('./modules/es6.object.create');
_dereq_('./modules/es6.object.define-property');
_dereq_('./modules/es6.object.define-properties');
_dereq_('./modules/es6.object.get-own-property-descriptor');
_dereq_('./modules/es6.object.get-prototype-of');
_dereq_('./modules/es6.object.keys');
_dereq_('./modules/es6.object.get-own-property-names');
_dereq_('./modules/es6.object.freeze');
_dereq_('./modules/es6.object.seal');
_dereq_('./modules/es6.object.prevent-extensions');
_dereq_('./modules/es6.object.is-frozen');
_dereq_('./modules/es6.object.is-sealed');
_dereq_('./modules/es6.object.is-extensible');
_dereq_('./modules/es6.object.assign');
_dereq_('./modules/es6.object.is');
_dereq_('./modules/es6.object.set-prototype-of');
_dereq_('./modules/es6.object.to-string');
_dereq_('./modules/es6.function.bind');
_dereq_('./modules/es6.function.name');
_dereq_('./modules/es6.function.has-instance');
_dereq_('./modules/es6.parse-int');
_dereq_('./modules/es6.parse-float');
_dereq_('./modules/es6.number.constructor');
_dereq_('./modules/es6.number.to-fixed');
_dereq_('./modules/es6.number.to-precision');
_dereq_('./modules/es6.number.epsilon');
_dereq_('./modules/es6.number.is-finite');
_dereq_('./modules/es6.number.is-integer');
_dereq_('./modules/es6.number.is-nan');
_dereq_('./modules/es6.number.is-safe-integer');
_dereq_('./modules/es6.number.max-safe-integer');
_dereq_('./modules/es6.number.min-safe-integer');
_dereq_('./modules/es6.number.parse-float');
_dereq_('./modules/es6.number.parse-int');
_dereq_('./modules/es6.math.acosh');
_dereq_('./modules/es6.math.asinh');
_dereq_('./modules/es6.math.atanh');
_dereq_('./modules/es6.math.cbrt');
_dereq_('./modules/es6.math.clz32');
_dereq_('./modules/es6.math.cosh');
_dereq_('./modules/es6.math.expm1');
_dereq_('./modules/es6.math.fround');
_dereq_('./modules/es6.math.hypot');
_dereq_('./modules/es6.math.imul');
_dereq_('./modules/es6.math.log10');
_dereq_('./modules/es6.math.log1p');
_dereq_('./modules/es6.math.log2');
_dereq_('./modules/es6.math.sign');
_dereq_('./modules/es6.math.sinh');
_dereq_('./modules/es6.math.tanh');
_dereq_('./modules/es6.math.trunc');
_dereq_('./modules/es6.string.from-code-point');
_dereq_('./modules/es6.string.raw');
_dereq_('./modules/es6.string.trim');
_dereq_('./modules/es6.string.iterator');
_dereq_('./modules/es6.string.code-point-at');
_dereq_('./modules/es6.string.ends-with');
_dereq_('./modules/es6.string.includes');
_dereq_('./modules/es6.string.repeat');
_dereq_('./modules/es6.string.starts-with');
_dereq_('./modules/es6.string.anchor');
_dereq_('./modules/es6.string.big');
_dereq_('./modules/es6.string.blink');
_dereq_('./modules/es6.string.bold');
_dereq_('./modules/es6.string.fixed');
_dereq_('./modules/es6.string.fontcolor');
_dereq_('./modules/es6.string.fontsize');
_dereq_('./modules/es6.string.italics');
_dereq_('./modules/es6.string.link');
_dereq_('./modules/es6.string.small');
_dereq_('./modules/es6.string.strike');
_dereq_('./modules/es6.string.sub');
_dereq_('./modules/es6.string.sup');
_dereq_('./modules/es6.date.now');
_dereq_('./modules/es6.date.to-json');
_dereq_('./modules/es6.date.to-iso-string');
_dereq_('./modules/es6.date.to-string');
_dereq_('./modules/es6.date.to-primitive');
_dereq_('./modules/es6.array.is-array');
_dereq_('./modules/es6.array.from');
_dereq_('./modules/es6.array.of');
_dereq_('./modules/es6.array.join');
_dereq_('./modules/es6.array.slice');
_dereq_('./modules/es6.array.sort');
_dereq_('./modules/es6.array.for-each');
_dereq_('./modules/es6.array.map');
_dereq_('./modules/es6.array.filter');
_dereq_('./modules/es6.array.some');
_dereq_('./modules/es6.array.every');
_dereq_('./modules/es6.array.reduce');
_dereq_('./modules/es6.array.reduce-right');
_dereq_('./modules/es6.array.index-of');
_dereq_('./modules/es6.array.last-index-of');
_dereq_('./modules/es6.array.copy-within');
_dereq_('./modules/es6.array.fill');
_dereq_('./modules/es6.array.find');
_dereq_('./modules/es6.array.find-index');
_dereq_('./modules/es6.array.species');
_dereq_('./modules/es6.array.iterator');
_dereq_('./modules/es6.regexp.constructor');
_dereq_('./modules/es6.regexp.to-string');
_dereq_('./modules/es6.regexp.flags');
_dereq_('./modules/es6.regexp.match');
_dereq_('./modules/es6.regexp.replace');
_dereq_('./modules/es6.regexp.search');
_dereq_('./modules/es6.regexp.split');
_dereq_('./modules/es6.promise');
_dereq_('./modules/es6.map');
_dereq_('./modules/es6.set');
_dereq_('./modules/es6.weak-map');
_dereq_('./modules/es6.weak-set');
_dereq_('./modules/es6.typed.array-buffer');
_dereq_('./modules/es6.typed.data-view');
_dereq_('./modules/es6.typed.int8-array');
_dereq_('./modules/es6.typed.uint8-array');
_dereq_('./modules/es6.typed.uint8-clamped-array');
_dereq_('./modules/es6.typed.int16-array');
_dereq_('./modules/es6.typed.uint16-array');
_dereq_('./modules/es6.typed.int32-array');
_dereq_('./modules/es6.typed.uint32-array');
_dereq_('./modules/es6.typed.float32-array');
_dereq_('./modules/es6.typed.float64-array');
_dereq_('./modules/es6.reflect.apply');
_dereq_('./modules/es6.reflect.construct');
_dereq_('./modules/es6.reflect.define-property');
_dereq_('./modules/es6.reflect.delete-property');
_dereq_('./modules/es6.reflect.enumerate');
_dereq_('./modules/es6.reflect.get');
_dereq_('./modules/es6.reflect.get-own-property-descriptor');
_dereq_('./modules/es6.reflect.get-prototype-of');
_dereq_('./modules/es6.reflect.has');
_dereq_('./modules/es6.reflect.is-extensible');
_dereq_('./modules/es6.reflect.own-keys');
_dereq_('./modules/es6.reflect.prevent-extensions');
_dereq_('./modules/es6.reflect.set');
_dereq_('./modules/es6.reflect.set-prototype-of');
_dereq_('./modules/es7.array.includes');
_dereq_('./modules/es7.array.flat-map');
_dereq_('./modules/es7.array.flatten');
_dereq_('./modules/es7.string.at');
_dereq_('./modules/es7.string.pad-start');
_dereq_('./modules/es7.string.pad-end');
_dereq_('./modules/es7.string.trim-left');
_dereq_('./modules/es7.string.trim-right');
_dereq_('./modules/es7.string.match-all');
_dereq_('./modules/es7.symbol.async-iterator');
_dereq_('./modules/es7.symbol.observable');
_dereq_('./modules/es7.object.get-own-property-descriptors');
_dereq_('./modules/es7.object.values');
_dereq_('./modules/es7.object.entries');
_dereq_('./modules/es7.object.define-getter');
_dereq_('./modules/es7.object.define-setter');
_dereq_('./modules/es7.object.lookup-getter');
_dereq_('./modules/es7.object.lookup-setter');
_dereq_('./modules/es7.map.to-json');
_dereq_('./modules/es7.set.to-json');
_dereq_('./modules/es7.map.of');
_dereq_('./modules/es7.set.of');
_dereq_('./modules/es7.weak-map.of');
_dereq_('./modules/es7.weak-set.of');
_dereq_('./modules/es7.map.from');
_dereq_('./modules/es7.set.from');
_dereq_('./modules/es7.weak-map.from');
_dereq_('./modules/es7.weak-set.from');
_dereq_('./modules/es7.global');
_dereq_('./modules/es7.system.global');
_dereq_('./modules/es7.error.is-error');
_dereq_('./modules/es7.math.clamp');
_dereq_('./modules/es7.math.deg-per-rad');
_dereq_('./modules/es7.math.degrees');
_dereq_('./modules/es7.math.fscale');
_dereq_('./modules/es7.math.iaddh');
_dereq_('./modules/es7.math.isubh');
_dereq_('./modules/es7.math.imulh');
_dereq_('./modules/es7.math.rad-per-deg');
_dereq_('./modules/es7.math.radians');
_dereq_('./modules/es7.math.scale');
_dereq_('./modules/es7.math.umulh');
_dereq_('./modules/es7.math.signbit');
_dereq_('./modules/es7.promise.finally');
_dereq_('./modules/es7.promise.try');
_dereq_('./modules/es7.reflect.define-metadata');
_dereq_('./modules/es7.reflect.delete-metadata');
_dereq_('./modules/es7.reflect.get-metadata');
_dereq_('./modules/es7.reflect.get-metadata-keys');
_dereq_('./modules/es7.reflect.get-own-metadata');
_dereq_('./modules/es7.reflect.get-own-metadata-keys');
_dereq_('./modules/es7.reflect.has-metadata');
_dereq_('./modules/es7.reflect.has-own-metadata');
_dereq_('./modules/es7.reflect.metadata');
_dereq_('./modules/es7.asap');
_dereq_('./modules/es7.observable');
_dereq_('./modules/web.timers');
_dereq_('./modules/web.immediate');
_dereq_('./modules/web.dom.iterable');
module.exports = _dereq_('./modules/_core');

},{"./modules/_core":119,"./modules/es6.array.copy-within":224,"./modules/es6.array.every":225,"./modules/es6.array.fill":226,"./modules/es6.array.filter":227,"./modules/es6.array.find":229,"./modules/es6.array.find-index":228,"./modules/es6.array.for-each":230,"./modules/es6.array.from":231,"./modules/es6.array.index-of":232,"./modules/es6.array.is-array":233,"./modules/es6.array.iterator":234,"./modules/es6.array.join":235,"./modules/es6.array.last-index-of":236,"./modules/es6.array.map":237,"./modules/es6.array.of":238,"./modules/es6.array.reduce":240,"./modules/es6.array.reduce-right":239,"./modules/es6.array.slice":241,"./modules/es6.array.some":242,"./modules/es6.array.sort":243,"./modules/es6.array.species":244,"./modules/es6.date.now":245,"./modules/es6.date.to-iso-string":246,"./modules/es6.date.to-json":247,"./modules/es6.date.to-primitive":248,"./modules/es6.date.to-string":249,"./modules/es6.function.bind":250,"./modules/es6.function.has-instance":251,"./modules/es6.function.name":252,"./modules/es6.map":253,"./modules/es6.math.acosh":254,"./modules/es6.math.asinh":255,"./modules/es6.math.atanh":256,"./modules/es6.math.cbrt":257,"./modules/es6.math.clz32":258,"./modules/es6.math.cosh":259,"./modules/es6.math.expm1":260,"./modules/es6.math.fround":261,"./modules/es6.math.hypot":262,"./modules/es6.math.imul":263,"./modules/es6.math.log10":264,"./modules/es6.math.log1p":265,"./modules/es6.math.log2":266,"./modules/es6.math.sign":267,"./modules/es6.math.sinh":268,"./modules/es6.math.tanh":269,"./modules/es6.math.trunc":270,"./modules/es6.number.constructor":271,"./modules/es6.number.epsilon":272,"./modules/es6.number.is-finite":273,"./modules/es6.number.is-integer":274,"./modules/es6.number.is-nan":275,"./modules/es6.number.is-safe-integer":276,"./modules/es6.number.max-safe-integer":277,"./modules/es6.number.min-safe-integer":278,"./modules/es6.number.parse-float":279,"./modules/es6.number.parse-int":280,"./modules/es6.number.to-fixed":281,"./modules/es6.number.to-precision":282,"./modules/es6.object.assign":283,"./modules/es6.object.create":284,"./modules/es6.object.define-properties":285,"./modules/es6.object.define-property":286,"./modules/es6.object.freeze":287,"./modules/es6.object.get-own-property-descriptor":288,"./modules/es6.object.get-own-property-names":289,"./modules/es6.object.get-prototype-of":290,"./modules/es6.object.is":294,"./modules/es6.object.is-extensible":291,"./modules/es6.object.is-frozen":292,"./modules/es6.object.is-sealed":293,"./modules/es6.object.keys":295,"./modules/es6.object.prevent-extensions":296,"./modules/es6.object.seal":297,"./modules/es6.object.set-prototype-of":298,"./modules/es6.object.to-string":299,"./modules/es6.parse-float":300,"./modules/es6.parse-int":301,"./modules/es6.promise":302,"./modules/es6.reflect.apply":303,"./modules/es6.reflect.construct":304,"./modules/es6.reflect.define-property":305,"./modules/es6.reflect.delete-property":306,"./modules/es6.reflect.enumerate":307,"./modules/es6.reflect.get":310,"./modules/es6.reflect.get-own-property-descriptor":308,"./modules/es6.reflect.get-prototype-of":309,"./modules/es6.reflect.has":311,"./modules/es6.reflect.is-extensible":312,"./modules/es6.reflect.own-keys":313,"./modules/es6.reflect.prevent-extensions":314,"./modules/es6.reflect.set":316,"./modules/es6.reflect.set-prototype-of":315,"./modules/es6.regexp.constructor":317,"./modules/es6.regexp.flags":318,"./modules/es6.regexp.match":319,"./modules/es6.regexp.replace":320,"./modules/es6.regexp.search":321,"./modules/es6.regexp.split":322,"./modules/es6.regexp.to-string":323,"./modules/es6.set":324,"./modules/es6.string.anchor":325,"./modules/es6.string.big":326,"./modules/es6.string.blink":327,"./modules/es6.string.bold":328,"./modules/es6.string.code-point-at":329,"./modules/es6.string.ends-with":330,"./modules/es6.string.fixed":331,"./modules/es6.string.fontcolor":332,"./modules/es6.string.fontsize":333,"./modules/es6.string.from-code-point":334,"./modules/es6.string.includes":335,"./modules/es6.string.italics":336,"./modules/es6.string.iterator":337,"./modules/es6.string.link":338,"./modules/es6.string.raw":339,"./modules/es6.string.repeat":340,"./modules/es6.string.small":341,"./modules/es6.string.starts-with":342,"./modules/es6.string.strike":343,"./modules/es6.string.sub":344,"./modules/es6.string.sup":345,"./modules/es6.string.trim":346,"./modules/es6.symbol":347,"./modules/es6.typed.array-buffer":348,"./modules/es6.typed.data-view":349,"./modules/es6.typed.float32-array":350,"./modules/es6.typed.float64-array":351,"./modules/es6.typed.int16-array":352,"./modules/es6.typed.int32-array":353,"./modules/es6.typed.int8-array":354,"./modules/es6.typed.uint16-array":355,"./modules/es6.typed.uint32-array":356,"./modules/es6.typed.uint8-array":357,"./modules/es6.typed.uint8-clamped-array":358,"./modules/es6.weak-map":359,"./modules/es6.weak-set":360,"./modules/es7.array.flat-map":361,"./modules/es7.array.flatten":362,"./modules/es7.array.includes":363,"./modules/es7.asap":364,"./modules/es7.error.is-error":365,"./modules/es7.global":366,"./modules/es7.map.from":367,"./modules/es7.map.of":368,"./modules/es7.map.to-json":369,"./modules/es7.math.clamp":370,"./modules/es7.math.deg-per-rad":371,"./modules/es7.math.degrees":372,"./modules/es7.math.fscale":373,"./modules/es7.math.iaddh":374,"./modules/es7.math.imulh":375,"./modules/es7.math.isubh":376,"./modules/es7.math.rad-per-deg":377,"./modules/es7.math.radians":378,"./modules/es7.math.scale":379,"./modules/es7.math.signbit":380,"./modules/es7.math.umulh":381,"./modules/es7.object.define-getter":382,"./modules/es7.object.define-setter":383,"./modules/es7.object.entries":384,"./modules/es7.object.get-own-property-descriptors":385,"./modules/es7.object.lookup-getter":386,"./modules/es7.object.lookup-setter":387,"./modules/es7.object.values":388,"./modules/es7.observable":389,"./modules/es7.promise.finally":390,"./modules/es7.promise.try":391,"./modules/es7.reflect.define-metadata":392,"./modules/es7.reflect.delete-metadata":393,"./modules/es7.reflect.get-metadata":395,"./modules/es7.reflect.get-metadata-keys":394,"./modules/es7.reflect.get-own-metadata":397,"./modules/es7.reflect.get-own-metadata-keys":396,"./modules/es7.reflect.has-metadata":398,"./modules/es7.reflect.has-own-metadata":399,"./modules/es7.reflect.metadata":400,"./modules/es7.set.from":401,"./modules/es7.set.of":402,"./modules/es7.set.to-json":403,"./modules/es7.string.at":404,"./modules/es7.string.match-all":405,"./modules/es7.string.pad-end":406,"./modules/es7.string.pad-start":407,"./modules/es7.string.trim-left":408,"./modules/es7.string.trim-right":409,"./modules/es7.symbol.async-iterator":410,"./modules/es7.symbol.observable":411,"./modules/es7.system.global":412,"./modules/es7.weak-map.from":413,"./modules/es7.weak-map.of":414,"./modules/es7.weak-set.from":415,"./modules/es7.weak-set.of":416,"./modules/web.dom.iterable":417,"./modules/web.immediate":418,"./modules/web.timers":419}],421:[function(_dereq_,module,exports){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = _dereq_("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":422}],422:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],423:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createGlProgram;
function createGlProgram(gl, vshader, fshader) {
    // create a program object
    var program = gl.createProgram();
    if (!program) {
        return null;
    }

    // create shader objects
    var vertexShader = __loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = __loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    // attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program object
    gl.linkProgram(program);

    // check the result of linking
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(program);

        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        throw 'hackGl: Failed to link gl program: ' + error;
    }

    return program;
}

function __loadShader(gl, type, source) {
    // create shader object
    var shader = gl.createShader(type);
    if (!shader) {
        throw 'hackGl: unable to create shader';
    }

    // set the shader program
    gl.shaderSource(shader, source);
    // compile the shader
    gl.compileShader(shader);

    // check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw 'hackGl: Failed to compile shader: ' + error;
    }

    return shader;
}
module.exports = exports['default'];

},{}],424:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultUniforms = undefined;

var _getMousePosition = _dereq_('../utils/get-mouse-position');

var _getMousePosition2 = _interopRequireDefault(_getMousePosition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startTime = Date.now();

var defaultUniforms = exports.defaultUniforms = {
    u_resolution: {
        type: '2fv',
        value: [0.0, 0.0]
    },
    u_mouse: {
        type: '2fv',
        value: [0.0, 0.0],
        update: function update() {
            return (0, _getMousePosition2.default)(options.canvas);
        }
    },
    u_time: {
        type: 'f',
        value: 0.0,
        update: function update() {
            return (Date.now() - startTime) / 1200;
        }
    }
};

},{"../utils/get-mouse-position":439}],425:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initFramebuffer = undefined;

var _regenerator = _dereq_('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = _dereq_('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = _dereq_('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var initFramebuffer = exports.initFramebuffer = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gl, options) {
        var fboShader, fboUniformData, fbo, fboProgram, fboVertexCount, fboUniforms, renderToTexture;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        fboShader = toyFragmentHeader + '\n                     ' + (options.feedbackFbo.injectWebcamUniform ? cameraFragmentHeader : '') + '\n                     ' + (options.feedbackFbo ? fboFragmentHeader : '') + '\n                     ' + options.feedbackFbo.fragmentShader;
                        fboUniformData = (0, _extends3.default)({}, _defaultUniforms.defaultUniforms, options.feedbackFbo.uniforms);


                        fboUniformData.u_resolution.value = [options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height];

                        if (!options.feedbackFbo.injectWebcamUniform) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 6;
                        return (0, _initCamera.initCameraUniform)(options);

                    case 6:
                        fboUniformData.u_camera = _context.sent;

                    case 7:

                        // initialize framebuffer object (FBO)
                        fbo = void 0;
                        _context.prev = 8;

                        fbo = _initFramebufferObject(gl, options);
                        _context.next = 16;
                        break;

                    case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](8);

                        console.error('hackGl: ' + _context.t0);
                        return _context.abrupt('return');

                    case 16:

                        fboUniformData.u_fbo = {
                            type: 'fbo_t',
                            texture1: fbo.texture1,
                            texture2: fbo.texture2
                        };

                        fboProgram = (0, _createGlProgram2.default)(gl, toyVertexShader, fboShader);

                        if (fboProgram) {
                            _context.next = 20;
                            break;
                        }

                        throw 'hack.Gl: failed to create fbo gl program!';

                    case 20:

                        gl.useProgram(fboProgram);

                        fboVertexCount = (0, _initVertexBuffers2.default)(gl, fboProgram, options);
                        _context.next = 24;
                        return (0, _uniformUtils.initUniforms)(gl, fboProgram, fboUniformData, true);

                    case 24:
                        fboUniforms = _context.sent;

                        renderToTexture = function renderToTexture() {
                            gl.useProgram(fboProgram);
                            fboUniforms = (0, _uniformUtils.updateUniforms)(gl, fboUniforms);

                            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); // change the drawing destination to FBO

                            // ping pong texture
                            var tmp = fbo.texture2;
                            fbo.texture2 = fbo.texture1;
                            fbo.texture1 = tmp;

                            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture1, 0);
                            gl.activeTexture(gl['TEXTURE' + fboUniforms.u_fbo.textureUnitNo]);
                            gl.bindTexture(gl.TEXTURE_2D, fbo.texture2);
                            // gl.uniform1i(fboUniforms.u_fbo.uniform, fboUniforms.u_fbo.textureUnitNo);

                            // clear and draw
                            gl.viewport(0, 0, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height);
                            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                            gl.drawArrays(gl.TRIANGLE_STRIP, 0, fboVertexCount);

                            gl.bindFramebuffer(gl.FRAMEBUFFER, null); // change the drawing destination to color buffer
                        };

                        return _context.abrupt('return', {
                            renderToTexture: renderToTexture,
                            fboUniform: fboUniformData.u_fbo
                        });

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[8, 12]]);
    }));

    return function initFramebuffer(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var _createGlProgram = _dereq_('./create-gl-program');

var _createGlProgram2 = _interopRequireDefault(_createGlProgram);

var _initVertexBuffers = _dereq_('./init-vertex-buffers');

var _initVertexBuffers2 = _interopRequireDefault(_initVertexBuffers);

var _uniformUtils = _dereq_('./uniform-utils');

var _initCamera = _dereq_('../webrtc/init-camera');

var _defaultUniforms = _dereq_('./default-uniforms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toyFragmentHeader = _dereq_('../shaders/pixeltoy/fragment-header.glsl');
var cameraFragmentHeader = _dereq_('../shaders/camera-fragment-header.glsl');
var fboFragmentHeader = _dereq_('../shaders/fbo-fragment-header.glsl');
var toyVertexShader = _dereq_('../shaders/pixeltoy/vertex-shader.glsl');
var defaultFragmentShader = _dereq_('../shaders/pixeltoy/default-fragmentshader.glsl');

function _initFramebufferObject(gl, options) {
    var framebuffer = void 0,
        depthBuffer = void 0;

    // define the error handling function
    var error = function error() {
        if (framebuffer) {
            gl.deleteFramebuffer(framebuffer);
        }
        if (texture1) {
            gl.deleteTexture(texture1);
        }

        if (texture2) {
            gl.deleteTexture(texture2);
        }

        if (depthBuffer) {
            gl.deleteRenderbuffer(depthBuffer);
        }

        return null;
    };

    // create a frame buffer object (FBO)
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        throw 'failed to create frame buffer object';
        return error();
    }

    // create a texture object and set its size and parameters
    var texture1 = gl.createTexture(); // Create a texture object
    if (!texture1) {
        throw 'failed to create texture object';
        return error();
    }

    var texture2 = gl.createTexture(); // Create a texture object
    if (!texture2) {
        throw 'failed to create texture object';
        return error();
    }

    // bind the object to target
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    // setup texture to be written to
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    framebuffer.texture1 = texture1;

    // bind the object to target
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    // setup texture2 to be written to
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    framebuffer.texture2 = texture2;

    // create a renderbuffer object and Set its size and parameters
    depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
    if (!depthBuffer) {
        throw 'failed to create renderbuffer object';
        return error();
    }

    // bind the object to target
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height);

    // attach the texture and the renderbuffer object to the FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // check if FBO is configured correctly
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        throw 'frame buffer object is incomplete: ' + e.toString();
        return error();
    }

    // unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;
}

},{"../shaders/camera-fragment-header.glsl":433,"../shaders/fbo-fragment-header.glsl":434,"../shaders/pixeltoy/default-fragmentshader.glsl":435,"../shaders/pixeltoy/fragment-header.glsl":436,"../shaders/pixeltoy/vertex-shader.glsl":437,"../webrtc/init-camera":441,"./create-gl-program":423,"./default-uniforms":424,"./init-vertex-buffers":427,"./uniform-utils":429,"babel-runtime/helpers/asyncToGenerator":9,"babel-runtime/helpers/extends":10,"babel-runtime/regenerator":13}],426:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = _dereq_('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = _dereq_('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = _dereq_('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _createGlProgram = _dereq_('./create-gl-program');

var _createGlProgram2 = _interopRequireDefault(_createGlProgram);

var _initVertexBuffers = _dereq_('./init-vertex-buffers');

var _initVertexBuffers2 = _interopRequireDefault(_initVertexBuffers);

var _uniformUtils = _dereq_('./uniform-utils');

var _initFbo = _dereq_('./init-fbo');

var _executeCallbackOrArray = _dereq_('../utils/execute-callback-or-array');

var _executeCallbackOrArray2 = _interopRequireDefault(_executeCallbackOrArray);

var _initCamera = _dereq_('../webrtc/init-camera');

var _defaultUniforms = _dereq_('./default-uniforms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toyFragmentHeader = _dereq_('../shaders/pixeltoy/fragment-header.glsl');
var cameraFragmentHeader = _dereq_('../shaders/camera-fragment-header.glsl');
var fboFragmentHeader = _dereq_('../shaders/fbo-fragment-header.glsl');
var toyVertexShader = _dereq_('../shaders/pixeltoy/vertex-shader.glsl');
var defaultFragmentShader = _dereq_('../shaders/pixeltoy/default-fragmentshader.glsl');

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gl, options) {
        var uniformData, fragmentShader, fbo, program, vertexCount, uniforms, _renderFragmentShader, _render;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        uniformData = (0, _extends3.default)({}, _defaultUniforms.defaultUniforms, options.uniforms);
                        fragmentShader = toyFragmentHeader + '\n                          ' + (options.injectWebcamUniform ? cameraFragmentHeader : '') + '\n                          ' + (options.feedbackFbo ? fboFragmentHeader : '') + '\n                          ' + (options.fragmentShader ? options.fragmentShader : defaultFragmentShader);


                        uniformData.u_resolution.value = [options.resolution.width, options.resolution.height];

                        if (!options.injectWebcamUniform) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 6;
                        return (0, _initCamera.initCameraUniform)(options);

                    case 6:
                        uniformData.u_camera = _context.sent;

                    case 7:
                        fbo = null;

                        if (!options.feedbackFbo) {
                            _context.next = 13;
                            break;
                        }

                        _context.next = 11;
                        return (0, _initFbo.initFramebuffer)(gl, options);

                    case 11:
                        fbo = _context.sent;

                        uniformData.u_fbo = fbo.fboUniform;

                    case 13:
                        program = (0, _createGlProgram2.default)(gl, toyVertexShader, fragmentShader);

                        if (program) {
                            _context.next = 16;
                            break;
                        }

                        throw 'hack.Gl: failed to create main gl program!';

                    case 16:

                        gl.useProgram(program);
                        vertexCount = (0, _initVertexBuffers2.default)(gl, program, options);
                        _context.next = 20;
                        return (0, _uniformUtils.initUniforms)(gl, program, uniformData);

                    case 20:
                        uniforms = _context.sent;

                        _renderFragmentShader = function _renderFragmentShader() {
                            gl.useProgram(program);
                            uniforms = (0, _uniformUtils.updateUniforms)(gl, uniforms, options);

                            gl.viewport(0, 0, options.resolution.width, options.resolution.height); // set a viewport for FBO
                            gl.clear(gl.COLOR_BUFFER_BIT);
                            gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
                        };

                        // main render loop


                        _render = function _render() {
                            if (options.feedbackFbo) {
                                fbo.renderToTexture();
                            }

                            _renderFragmentShader();

                            (0, _executeCallbackOrArray2.default)(options.onRender);
                            requestAnimationFrame(_render);
                        };

                        _render();

                    case 24:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function initPixelToy(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return initPixelToy;
}();

module.exports = exports['default'];

},{"../shaders/camera-fragment-header.glsl":433,"../shaders/fbo-fragment-header.glsl":434,"../shaders/pixeltoy/default-fragmentshader.glsl":435,"../shaders/pixeltoy/fragment-header.glsl":436,"../shaders/pixeltoy/vertex-shader.glsl":437,"../utils/execute-callback-or-array":438,"../webrtc/init-camera":441,"./create-gl-program":423,"./default-uniforms":424,"./init-fbo":425,"./init-vertex-buffers":427,"./uniform-utils":429,"babel-runtime/helpers/asyncToGenerator":9,"babel-runtime/helpers/extends":10,"babel-runtime/regenerator":13}],427:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = initVertexBuffers;
function initVertexBuffers(gl, program, options) {
    // cover whole canvas with quad
    var vertices = new Float32Array([-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]);

    var vertexCount = 4; // number of vertices

    // create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        throw 'hackGl: failed to create the buffer object';
    }

    // bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_position = gl.getAttribLocation(program, 'a_position');
    if (a_position < 0) {
        throw 'hackGl: pixeltoy failed to get the storage location of a_position';
    }

    // assign the buffer object to a_position variable
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    // enable the assignment to a_position variable
    gl.enableVertexAttribArray(a_position);

    return vertexCount;
}
module.exports = exports['default'];

},{}],428:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadTextureData = undefined;

var _regenerator = _dereq_("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = _dereq_("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = _dereq_("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var loadTextureData = exports.loadTextureData = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt("return", new _promise2.default(function (resolve, reject) {
                            var image = new Image();
                            image.onload = function () {
                                return resolve(image);
                            };
                            image.onerror = function (e) {
                                return reject(e);
                            };
                            image.src = data.url;
                        }));

                    case 1:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function loadTextureData(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.initTexture = initTexture;
exports.initFboTexture = initFboTexture;
exports.bindFboTextureToFragmentShader = bindFboTextureToFragmentShader;
exports.updateTexture = updateTexture;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var textureUnitNo = 0;

function initTexture(gl, data, image) {
    var unitNoOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var maxTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    if (textureUnitNo > maxTextureCount) {
        throw "hackGl: max number of texture units (" + maxTextureCount + ") exceeded";
    }

    var texture = gl.createTexture();

    // flip axes to xy instead of yx
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // activate texture
    gl.activeTexture(gl["TEXTURE" + (textureUnitNo + unitNoOffset)]);

    // bind texture object
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // set params

    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // set the texture unit number to the sampler
    gl.uniform1i(data.uniform, textureUnitNo);
    data.textureUnitNo = textureUnitNo;

    textureUnitNo++;
    return texture;
}

function initFboTexture(gl, data) {
    gl.activeTexture(gl["TEXTURE" + textureUnitNo]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture2);
    gl.uniform1i(data.uniform, textureUnitNo);
    data.textureUnitNo = textureUnitNo;
    textureUnitNo++;

    return data;
}

function bindFboTextureToFragmentShader(gl, uniforms) {
    gl.activeTexture(gl["TEXTURE" + uniforms.u_fbo.textureUnitNo]);
    gl.bindTexture(gl.TEXTURE_2D, uniforms.u_fbo.texture2);
    gl.uniform1i(uniforms.u_fbo.uniform, uniforms.u_fbo.textureUnitNo);
}

function updateTexture(gl, data) {
    gl.bindTexture(gl.TEXTURE_2D, data.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.value);
}

},{"babel-runtime/core-js/promise":8,"babel-runtime/helpers/asyncToGenerator":9,"babel-runtime/regenerator":13}],429:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setUniformValue = exports.initUniforms = undefined;

var _regenerator = _dereq_('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = _dereq_('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = _dereq_('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = _dereq_('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = _dereq_('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var initUniforms = exports.initUniforms = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gl, program, uniformData) {
        var fbo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, uniformName, data, uniform, updatedData;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        result = {};
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 4;
                        _iterator = (0, _getIterator3.default)((0, _iterateObject2.default)(uniformData));

                    case 6:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 20;
                            break;
                        }

                        _step$value = (0, _slicedToArray3.default)(_step.value, 2), uniformName = _step$value[0], data = _step$value[1];
                        uniform = gl.getUniformLocation(program, new String(uniformName));

                        if (uniform) {
                            _context.next = 12;
                            break;
                        }

                        console.warn('hackGl: ' + (fbo ? 'frame buffer shader:' : 'fragment shader:') + ' ' + ('failed to get the storage location of "' + uniformName + '" - ignoring variable. ') + 'Perhaps you forgot to use it in your shader?');
                        return _context.abrupt('continue', 17);

                    case 12:
                        updatedData = (0, _extends3.default)({}, data, {
                            uniform: uniform
                        });

                        // await needed for texture image data loading

                        _context.next = 15;
                        return setUniformValue(gl, updatedData);

                    case 15:
                        updatedData = _context.sent;

                        result[uniformName] = updatedData;

                    case 17:
                        _iteratorNormalCompletion = true;
                        _context.next = 6;
                        break;

                    case 20:
                        _context.next = 26;
                        break;

                    case 22:
                        _context.prev = 22;
                        _context.t0 = _context['catch'](4);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 26:
                        _context.prev = 26;
                        _context.prev = 27;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 29:
                        _context.prev = 29;

                        if (!_didIteratorError) {
                            _context.next = 32;
                            break;
                        }

                        throw _iteratorError;

                    case 32:
                        return _context.finish(29);

                    case 33:
                        return _context.finish(26);

                    case 34:
                        return _context.abrupt('return', result);

                    case 35:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[4, 22, 26, 34], [27,, 29, 33]]);
    }));

    return function initUniforms(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var setUniformValue = exports.setUniformValue = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(gl, data) {
        var updating = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var imageData;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.t0 = data.type;
                        _context2.next = _context2.t0 === 't' ? 3 : _context2.t0 === 'fbo_t' ? 17 : _context2.t0 === 'f' ? 19 : _context2.t0 === '2fv' ? 21 : 23;
                        break;

                    case 3:
                        if (updating) {
                            _context2.next = 15;
                            break;
                        }

                        if (!(typeof data.url !== 'undefined')) {
                            _context2.next = 10;
                            break;
                        }

                        _context2.next = 7;
                        return (0, _textureUtils.loadTextureData)(data);

                    case 7:
                        _context2.t1 = _context2.sent;
                        _context2.next = 11;
                        break;

                    case 10:
                        _context2.t1 = data.value;

                    case 11:
                        imageData = _context2.t1;

                        data.texture = (0, _textureUtils.initTexture)(gl, data, imageData);
                        _context2.next = 16;
                        break;

                    case 15:
                        if (updating && data.needsUpdate) {
                            (0, _textureUtils.updateTexture)(gl, data);
                        }

                    case 16:
                        return _context2.abrupt('break', 25);

                    case 17:
                        if (!updating) {
                            data = (0, _textureUtils.initFboTexture)(gl, data);
                        }

                        return _context2.abrupt('break', 25);

                    case 19:
                        gl.uniform1f(data.uniform, data.value);
                        return _context2.abrupt('break', 25);

                    case 21:
                        gl.uniform2fv(data.uniform, data.value);
                        return _context2.abrupt('break', 25);

                    case 23:
                        throw ': ' + data.type + ' uniform not yet implemented!';

                    case 25:
                        return _context2.abrupt('return', data);

                    case 26:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function setUniformValue(_x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

exports.updateUniforms = updateUniforms;

var _textureUtils = _dereq_('./texture-utils');

var _iterateObject = _dereq_('../utils/iterate-object');

var _iterateObject2 = _interopRequireDefault(_iterateObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateUniforms(gl, uniforms, options) {
    if (typeof options !== 'undefined' && options.feedbackFbo && uniforms.u_fbo && uniforms.u_fbo.uniform) {
        (0, _textureUtils.bindFboTextureToFragmentShader)(gl, uniforms);
    }

    var result = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = (0, _getIterator3.default)((0, _iterateObject2.default)(uniforms)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
                key = _step2$value[0],
                data = _step2$value[1];

            var uniform = result[key] = (0, _extends3.default)({}, data);
            if (typeof uniform.update === 'function') {
                uniform.value = uniform.update(uniform.value);
                setUniformValue(gl, uniform, true);
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return result;
}

},{"../utils/iterate-object":440,"./texture-utils":428,"babel-runtime/core-js/get-iterator":4,"babel-runtime/helpers/asyncToGenerator":9,"babel-runtime/helpers/extends":10,"babel-runtime/helpers/slicedToArray":11,"babel-runtime/regenerator":13}],430:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = _dereq_('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = hackGl;

var _webglUtils = _dereq_('./lib/webgl-utils');

var _webglUtils2 = _interopRequireDefault(_webglUtils);

var _initPixelToy = _dereq_('./gl/init-pixel-toy');

var _initPixelToy2 = _interopRequireDefault(_initPixelToy);

var _options = _dereq_('./init/options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dereq_('babel-polyfill');

function hackGl(options) {
    options = (0, _options2.default)(options);
    if (!options.isValid) {
        throw 'hack.Gl: ' + options.errors;
    }

    _setupCanvasResolution(options);
    var gl = _getWebGlContext(options.canvas);

    // specify the color for clearing canvas
    gl.clearColor.apply(gl, (0, _toConsumableArray3.default)(options.clearColor));

    (0, _initPixelToy2.default)(gl, options);
}

function _getWebGlContext(canvas) {
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var gl = _webglUtils2.default.setupWebGL(canvas);
    if (!gl) {
        throw 'hack.Gl: failed to get the rendering context for webGl';
    }

    if (debug) {
        gl = _webglUtils2.default.makeDebugContext(gl);
    }

    return gl;
}

function _setupCanvasResolution(options) {
    options.canvas.width = options.resolution.width;
    options.canvas.height = options.resolution.height;
}
module.exports = exports['default'];

},{"./gl/init-pixel-toy":426,"./init/options":431,"./lib/webgl-utils":432,"babel-polyfill":1,"babel-runtime/helpers/toConsumableArray":12}],431:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = _dereq_('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = validateOptions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateOptions(options) {
    var validatedOptions = (0, _extends3.default)({
        isValid: true,
        errors: ''
    }, options);

    if (typeof options.canvas === 'undefined' || !options.canvas) {
        validatedOptions.isValid = false;
        validatedOptions.errors = "\nNo canvas element supplied when calling hackGl()";
    }

    if (typeof options.clearColor === 'undefined' || !options.clearColor) {
        validatedOptions.isValid = false;
        validatedOptions.errors = "\nNo clear color supplied when calling hackGl()";
    }

    if (typeof options.resolution === 'undefined' || !options.resolution.width || !options.resolution.height) {
        validatedOptions.resolution = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    if (typeof options.feedbackFbo !== 'undefined') {
        if (options.feedbackFbo && typeof options.feedbackFbo.resolution === 'undefined' || !options.feedbackFbo.resolution.width || !options.feedbackFbo.resolution.height) {
            validatedOptions.feedbackFbo.resolution = validatedOptions.resolution;
        }
    }

    if (typeof options.uniforms === 'undefined') {
        validatedOptions.uniforms = {};
    }

    if (typeof options.onRender === 'undefined') {
        validatedOptions.onRender = [];
    }

    return validatedOptions;
}
module.exports = exports['default'];

},{"babel-runtime/helpers/extends":10}],432:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimationFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */

exports.default = new function () {
  /**
   * Provides requestAnimationFrame in a cross browser
   * way.
   */
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function FrameRequestCallback */callback, /* DOMElement Element */element) {
        window.setTimeout(callback, 1000 / 60);
      };
    }();
  }

  /** * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
   *
   * Cancels an animation frame request.
   * Checks for cross-browser support, falls back to clearTimeout.
   * @param {number}  Animation frame request. */
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.clearTimeout;
  }

  /**
   * Creates the HTLM for a failure message
   * @param {string} canvasContainerId id of container of th
   *        canvas.
   * @return {string} The html.
   */
  var makeFailHTML = function makeFailHTML(msg) {
    return '' + '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
    return '' + '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' + '<td align="center">' + '<div style="display: table-cell; vertical-align: middle;">' + '<div style="">' + msg + '</div>' + '</div>' + '</td></tr></table>';
  };

  /**
   * Mesasge for getting a webgl browser
   * @type {string}
   */
  var GET_A_WEBGL_BROWSER = '' + 'This page requires a browser that supports WebGL.<br/>' + '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

  /**
   * Mesasge for need better hardware
   * @type {string}
   */
  var OTHER_PROBLEM = '' + "It doesn't appear your computer can support WebGL.<br/>" + '<a href="http://get.webgl.org">Click here for more information.</a>';

  /**
   * Creates a webgl context. If creation fails it will
   * change the contents of the container of the <canvas>
   * tag to an error message with the correct links for WebGL.
   * @param {Element} canvas. The canvas element to create a
   *     context from.
   * @param {WebGLContextCreationAttirbutes} opt_attribs Any
   *     creation attributes you want to pass in.
   * @param {function:(msg)} opt_onError An function to call
   *     if there is an error during creation.
   * @return {WebGLRenderingContext} The created context.
   */
  var setupWebGL = function setupWebGL(canvas, opt_attribs, opt_onError) {
    function handleCreationError(msg) {
      var container = document.getElementsByTagName("body")[0];
      //var container = canvas.parentNode;
      if (container) {
        var str = window.WebGLRenderingContext ? OTHER_PROBLEM : GET_A_WEBGL_BROWSER;
        if (msg) {
          str += "<br/><br/>Status: " + msg;
        }
        container.innerHTML = makeFailHTML(str);
      }
    };

    opt_onError = opt_onError || handleCreationError;

    if (canvas.addEventListener) {
      canvas.addEventListener("webglcontextcreationerror", function (event) {
        opt_onError(event.statusMessage);
      }, false);
    }
    var context = create3DContext(canvas, opt_attribs);
    if (!context) {
      if (!window.WebGLRenderingContext) {
        opt_onError("");
      } else {
        opt_onError("");
      }
    }

    return context;
  };

  /**
   * Creates a webgl context.
   * @param {!Canvas} canvas The canvas tag to get context
   *     from. If one is not passed in one will be created.
   * @return {!WebGLContext} The created context.
   */
  var create3DContext = function create3DContext(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch (e) {}
      if (context) {
        break;
      }
    }
    return context;
  };

  return {
    create3DContext: create3DContext,
    setupWebGL: setupWebGL
  };
}();
module.exports = exports['default'];

},{}],433:[function(_dereq_,module,exports){
module.exports = "uniform sampler2D u_camera;\n";

},{}],434:[function(_dereq_,module,exports){
module.exports = "uniform sampler2D u_fbo;\n";

},{}],435:[function(_dereq_,module,exports){
module.exports = "void main() {\n    vec2 uv = gl_FragCoord.xy / u_resolution.xy;\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}\n";

},{}],436:[function(_dereq_,module,exports){
module.exports = "#ifdef GL_ES\n    precision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n";

},{}],437:[function(_dereq_,module,exports){
module.exports = "attribute vec4 a_position;\n\nvoid main() {\n    gl_Position = a_position;\n}\n";

},{}],438:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = executeCallbackOrArray;
function executeCallbackOrArray(callback) {
    if (Array.isArray(callback)) {
        callback.map(function (cb) {
            return cb();
        });
    } else if (typeof callback === 'function') {
        callback();
    } else {
        throw 'hackGl: illegal callback';
    }
}
module.exports = exports['default'];

},{}],439:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getMousePosition;
var handler = null;
var position = {
    x: 0,
    y: 0
};

function getMousePosition(canvas) {
    if (!handler) {
        handler = canvas.onmousemove = function (e) {
            position = {
                x: (e.pageX - canvas.offsetLeft) / canvas.width,
                y: (e.pageY - canvas.offsetTop) / canvas.height
            };
        };
    }

    return [position.x, position.y];
}
module.exports = exports["default"];

},{}],440:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = _dereq_("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = _dereq_("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = _dereq_("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = iterateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(iterateObject);

// helper generator to iterate by [key, value] over objects
function iterateObject(obj) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return _regenerator2.default.wrap(function iterateObject$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 3;
                    _iterator = (0, _getIterator3.default)((0, _keys2.default)(obj));

                case 5:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context.next = 12;
                        break;
                    }

                    key = _step.value;
                    _context.next = 9;
                    return [key, obj[key]];

                case 9:
                    _iteratorNormalCompletion = true;
                    _context.next = 5;
                    break;

                case 12:
                    _context.next = 18;
                    break;

                case 14:
                    _context.prev = 14;
                    _context.t0 = _context["catch"](3);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                case 18:
                    _context.prev = 18;
                    _context.prev = 19;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }

                case 21:
                    _context.prev = 21;

                    if (!_didIteratorError) {
                        _context.next = 24;
                        break;
                    }

                    throw _iteratorError;

                case 24:
                    return _context.finish(21);

                case 25:
                    return _context.finish(18);

                case 26:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this, [[3, 14, 18, 26], [19,, 21, 25]]);
}
module.exports = exports["default"];

},{"babel-runtime/core-js/get-iterator":4,"babel-runtime/core-js/object/keys":7,"babel-runtime/regenerator":13}],441:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initCameraUniform = undefined;

var _promise = _dereq_('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = _dereq_('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = _dereq_('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = _dereq_('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var initCameraUniform = exports.initCameraUniform = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
        var video;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        video = void 0;
                        _context.prev = 1;
                        _context.next = 4;
                        return _initCamera(options);

                    case 4:
                        video = _context.sent;
                        _context.next = 11;
                        break;

                    case 7:
                        _context.prev = 7;
                        _context.t0 = _context['catch'](1);

                        console.error(_context.t0);
                        return _context.abrupt('return');

                    case 11:
                        return _context.abrupt('return', (0, _extends3.default)({}, cameraUniformBase, {
                            value: video,
                            update: function update() {
                                return video;
                            }
                        }));

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[1, 7]]);
    }));

    return function initCameraUniform(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _initCamera = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        var video, stream;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!streaming) {
                            _context2.next = 2;
                            break;
                        }

                        return _context2.abrupt('return', document.getElementById('video'));

                    case 2:
                        video = _injectVideoElement();
                        stream = void 0;
                        _context2.prev = 4;
                        _context2.next = 7;
                        return _getCameraStream();

                    case 7:
                        stream = _context2.sent;
                        _context2.next = 13;
                        break;

                    case 10:
                        _context2.prev = 10;
                        _context2.t0 = _context2['catch'](4);
                        throw 'hackGl: Could not load camera stream!';

                    case 13:

                        // canvas = document.createElement('canvas');
                        // context = canvas.getContext('2d');
                        //
                        // canvas.width = options.canvas.width;
                        // canvas.height = options.canvas.height;

                        video.srcObject = stream;
                        video.play();
                        streaming = true;

                        return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
                            video.addEventListener('canplay', function (e) {
                                return resolve(video);
                            }, false);
                        }));

                    case 17:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[4, 10]]);
    }));

    return function _initCamera(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var _getCameraStream = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: {
                                width: {
                                    min: 640, ideal: 640, max: 640
                                },
                                height: {
                                    min: 480, ideal: 480, max: 480
                                }
                            }
                        });

                    case 2:
                        return _context3.abrupt('return', _context3.sent);

                    case 3:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function _getCameraStream() {
        return _ref3.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var context = null,
    canvas = null,
    streaming = false;

var cameraUniformBase = {
    type: 't',
    needsUpdate: true,
    value: null
};

function _injectVideoElement() {
    var video = document.createElement('video');

    video.id = 'video';
    video.style.display = 'none';
    video.innerHTML = 'Video stream not available.';
    document.body.insertBefore(video, document.body.childNodes[0]);

    return video;
}

},{"babel-runtime/core-js/promise":8,"babel-runtime/helpers/asyncToGenerator":9,"babel-runtime/helpers/extends":10,"babel-runtime/regenerator":13}]},{},[430])(430)
});

//# sourceMappingURL=hackgl.js.map
