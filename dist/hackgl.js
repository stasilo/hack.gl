(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hackgl = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":12}],2:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":13}],3:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":14}],4:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":15}],5:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":16}],6:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":17}],7:[function(_dereq_,module,exports){
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
},{"../core-js/promise":6}],8:[function(_dereq_,module,exports){
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
},{"../core-js/object/assign":4}],9:[function(_dereq_,module,exports){
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
},{"../core-js/get-iterator":2,"../core-js/is-iterable":3}],10:[function(_dereq_,module,exports){
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
},{"../core-js/array/from":1}],11:[function(_dereq_,module,exports){
module.exports = _dereq_("regenerator-runtime");

},{"regenerator-runtime":96}],12:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.string.iterator');
_dereq_('../../modules/es6.array.from');
module.exports = _dereq_('../../modules/_core').Array.from;

},{"../../modules/_core":25,"../../modules/es6.array.from":86,"../../modules/es6.string.iterator":92}],13:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.get-iterator');

},{"../modules/core.get-iterator":84,"../modules/es6.string.iterator":92,"../modules/web.dom.iterable":95}],14:[function(_dereq_,module,exports){
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.string.iterator');
module.exports = _dereq_('../modules/core.is-iterable');

},{"../modules/core.is-iterable":85,"../modules/es6.string.iterator":92,"../modules/web.dom.iterable":95}],15:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.assign');
module.exports = _dereq_('../../modules/_core').Object.assign;

},{"../../modules/_core":25,"../../modules/es6.object.assign":88}],16:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.keys');
module.exports = _dereq_('../../modules/_core').Object.keys;

},{"../../modules/_core":25,"../../modules/es6.object.keys":89}],17:[function(_dereq_,module,exports){
_dereq_('../modules/es6.object.to-string');
_dereq_('../modules/es6.string.iterator');
_dereq_('../modules/web.dom.iterable');
_dereq_('../modules/es6.promise');
_dereq_('../modules/es7.promise.finally');
_dereq_('../modules/es7.promise.try');
module.exports = _dereq_('../modules/_core').Promise;

},{"../modules/_core":25,"../modules/es6.object.to-string":90,"../modules/es6.promise":91,"../modules/es6.string.iterator":92,"../modules/es7.promise.finally":93,"../modules/es7.promise.try":94,"../modules/web.dom.iterable":95}],18:[function(_dereq_,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],19:[function(_dereq_,module,exports){
module.exports = function () { /* empty */ };

},{}],20:[function(_dereq_,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],21:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":43}],22:[function(_dereq_,module,exports){
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

},{"./_to-absolute-index":75,"./_to-iobject":77,"./_to-length":78}],23:[function(_dereq_,module,exports){
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

},{"./_cof":24,"./_wks":82}],24:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],25:[function(_dereq_,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],26:[function(_dereq_,module,exports){
'use strict';
var $defineProperty = _dereq_('./_object-dp');
var createDesc = _dereq_('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":55,"./_property-desc":65}],27:[function(_dereq_,module,exports){
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

},{"./_a-function":18}],28:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],29:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":33}],30:[function(_dereq_,module,exports){
var isObject = _dereq_('./_is-object');
var document = _dereq_('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":35,"./_is-object":43}],31:[function(_dereq_,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],32:[function(_dereq_,module,exports){
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

},{"./_core":25,"./_ctx":27,"./_global":35,"./_hide":37}],33:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],34:[function(_dereq_,module,exports){
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

},{"./_an-object":21,"./_ctx":27,"./_is-array-iter":42,"./_iter-call":44,"./_to-length":78,"./core.get-iterator-method":83}],35:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],36:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],37:[function(_dereq_,module,exports){
var dP = _dereq_('./_object-dp');
var createDesc = _dereq_('./_property-desc');
module.exports = _dereq_('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":29,"./_object-dp":55,"./_property-desc":65}],38:[function(_dereq_,module,exports){
var document = _dereq_('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":35}],39:[function(_dereq_,module,exports){
module.exports = !_dereq_('./_descriptors') && !_dereq_('./_fails')(function () {
  return Object.defineProperty(_dereq_('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":29,"./_dom-create":30,"./_fails":33}],40:[function(_dereq_,module,exports){
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

},{}],41:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":24}],42:[function(_dereq_,module,exports){
// check on default Array iterator
var Iterators = _dereq_('./_iterators');
var ITERATOR = _dereq_('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":49,"./_wks":82}],43:[function(_dereq_,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],44:[function(_dereq_,module,exports){
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

},{"./_an-object":21}],45:[function(_dereq_,module,exports){
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

},{"./_hide":37,"./_object-create":54,"./_property-desc":65,"./_set-to-string-tag":69,"./_wks":82}],46:[function(_dereq_,module,exports){
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

},{"./_export":32,"./_has":36,"./_hide":37,"./_iter-create":45,"./_iterators":49,"./_library":50,"./_object-gpo":58,"./_redefine":67,"./_set-to-string-tag":69,"./_wks":82}],47:[function(_dereq_,module,exports){
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

},{"./_wks":82}],48:[function(_dereq_,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],49:[function(_dereq_,module,exports){
module.exports = {};

},{}],50:[function(_dereq_,module,exports){
module.exports = true;

},{}],51:[function(_dereq_,module,exports){
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

},{"./_cof":24,"./_global":35,"./_task":74}],52:[function(_dereq_,module,exports){
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

},{"./_a-function":18}],53:[function(_dereq_,module,exports){
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

},{"./_fails":33,"./_iobject":41,"./_object-gops":57,"./_object-keys":60,"./_object-pie":61,"./_to-object":79}],54:[function(_dereq_,module,exports){
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

},{"./_an-object":21,"./_dom-create":30,"./_enum-bug-keys":31,"./_html":38,"./_object-dps":56,"./_shared-key":70}],55:[function(_dereq_,module,exports){
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

},{"./_an-object":21,"./_descriptors":29,"./_ie8-dom-define":39,"./_to-primitive":80}],56:[function(_dereq_,module,exports){
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

},{"./_an-object":21,"./_descriptors":29,"./_object-dp":55,"./_object-keys":60}],57:[function(_dereq_,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],58:[function(_dereq_,module,exports){
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

},{"./_has":36,"./_shared-key":70,"./_to-object":79}],59:[function(_dereq_,module,exports){
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

},{"./_array-includes":22,"./_has":36,"./_shared-key":70,"./_to-iobject":77}],60:[function(_dereq_,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _dereq_('./_object-keys-internal');
var enumBugKeys = _dereq_('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":31,"./_object-keys-internal":59}],61:[function(_dereq_,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],62:[function(_dereq_,module,exports){
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

},{"./_core":25,"./_export":32,"./_fails":33}],63:[function(_dereq_,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],64:[function(_dereq_,module,exports){
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

},{"./_an-object":21,"./_is-object":43,"./_new-promise-capability":52}],65:[function(_dereq_,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],66:[function(_dereq_,module,exports){
var hide = _dereq_('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":37}],67:[function(_dereq_,module,exports){
module.exports = _dereq_('./_hide');

},{"./_hide":37}],68:[function(_dereq_,module,exports){
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

},{"./_core":25,"./_descriptors":29,"./_global":35,"./_object-dp":55,"./_wks":82}],69:[function(_dereq_,module,exports){
var def = _dereq_('./_object-dp').f;
var has = _dereq_('./_has');
var TAG = _dereq_('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":36,"./_object-dp":55,"./_wks":82}],70:[function(_dereq_,module,exports){
var shared = _dereq_('./_shared')('keys');
var uid = _dereq_('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":71,"./_uid":81}],71:[function(_dereq_,module,exports){
var global = _dereq_('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":35}],72:[function(_dereq_,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = _dereq_('./_an-object');
var aFunction = _dereq_('./_a-function');
var SPECIES = _dereq_('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":18,"./_an-object":21,"./_wks":82}],73:[function(_dereq_,module,exports){
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

},{"./_defined":28,"./_to-integer":76}],74:[function(_dereq_,module,exports){
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

},{"./_cof":24,"./_ctx":27,"./_dom-create":30,"./_global":35,"./_html":38,"./_invoke":40}],75:[function(_dereq_,module,exports){
var toInteger = _dereq_('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":76}],76:[function(_dereq_,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],77:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./_iobject');
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":28,"./_iobject":41}],78:[function(_dereq_,module,exports){
// 7.1.15 ToLength
var toInteger = _dereq_('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":76}],79:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":28}],80:[function(_dereq_,module,exports){
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

},{"./_is-object":43}],81:[function(_dereq_,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],82:[function(_dereq_,module,exports){
var store = _dereq_('./_shared')('wks');
var uid = _dereq_('./_uid');
var Symbol = _dereq_('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":35,"./_shared":71,"./_uid":81}],83:[function(_dereq_,module,exports){
var classof = _dereq_('./_classof');
var ITERATOR = _dereq_('./_wks')('iterator');
var Iterators = _dereq_('./_iterators');
module.exports = _dereq_('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":23,"./_core":25,"./_iterators":49,"./_wks":82}],84:[function(_dereq_,module,exports){
var anObject = _dereq_('./_an-object');
var get = _dereq_('./core.get-iterator-method');
module.exports = _dereq_('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":21,"./_core":25,"./core.get-iterator-method":83}],85:[function(_dereq_,module,exports){
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

},{"./_classof":23,"./_core":25,"./_iterators":49,"./_wks":82}],86:[function(_dereq_,module,exports){
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

},{"./_create-property":26,"./_ctx":27,"./_export":32,"./_is-array-iter":42,"./_iter-call":44,"./_iter-detect":47,"./_to-length":78,"./_to-object":79,"./core.get-iterator-method":83}],87:[function(_dereq_,module,exports){
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

},{"./_add-to-unscopables":19,"./_iter-define":46,"./_iter-step":48,"./_iterators":49,"./_to-iobject":77}],88:[function(_dereq_,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = _dereq_('./_export');

$export($export.S + $export.F, 'Object', { assign: _dereq_('./_object-assign') });

},{"./_export":32,"./_object-assign":53}],89:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_('./_to-object');
var $keys = _dereq_('./_object-keys');

_dereq_('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":60,"./_object-sap":62,"./_to-object":79}],90:[function(_dereq_,module,exports){

},{}],91:[function(_dereq_,module,exports){
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

},{"./_a-function":18,"./_an-instance":20,"./_classof":23,"./_core":25,"./_ctx":27,"./_export":32,"./_for-of":34,"./_global":35,"./_is-object":43,"./_iter-detect":47,"./_library":50,"./_microtask":51,"./_new-promise-capability":52,"./_perform":63,"./_promise-resolve":64,"./_redefine-all":66,"./_set-species":68,"./_set-to-string-tag":69,"./_species-constructor":72,"./_task":74,"./_wks":82}],92:[function(_dereq_,module,exports){
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

},{"./_iter-define":46,"./_string-at":73}],93:[function(_dereq_,module,exports){
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

},{"./_core":25,"./_export":32,"./_global":35,"./_promise-resolve":64,"./_species-constructor":72}],94:[function(_dereq_,module,exports){
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

},{"./_export":32,"./_new-promise-capability":52,"./_perform":63}],95:[function(_dereq_,module,exports){
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

},{"./_global":35,"./_hide":37,"./_iterators":49,"./_wks":82,"./es6.array.iterator":87}],96:[function(_dereq_,module,exports){
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

},{"./runtime":97}],97:[function(_dereq_,module,exports){
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

},{}],98:[function(_dereq_,module,exports){
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

},{}],99:[function(_dereq_,module,exports){
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

},{"../utils/get-mouse-position":114}],100:[function(_dereq_,module,exports){
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
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gl, fboSettings, fboTextureName, options, prevFboUniforms) {
        var fboShader, fboUniformData, fbo, fboProgram, fboVertexCount, fboUniforms, renderToTexture;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        fboShader = toyFragmentHeader + '\n                     ' + (fboSettings.injectWebcamUniform ? cameraFragmentHeader : '') + '\n                     ' + (fboSettings ? fboFragmentHeader : '') + '\n                     ' + fboSettings.fragmentShader;
                        fboUniformData = (0, _extends3.default)({}, _defaultUniforms.defaultUniforms, fboSettings.uniforms, prevFboUniforms);


                        fboUniformData.u_resolution.value = [options.resolution.width, options.resolution.height];

                        if (!fboSettings.injectWebcamUniform) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 6;
                        return (0, _initCamera.initCameraUniform)();

                    case 6:
                        fboUniformData.u_camera = _context.sent;

                    case 7:

                        // initialize framebuffer object (FBO)
                        fbo = void 0;
                        _context.prev = 8;

                        fbo = _initFramebufferObject(gl, fboSettings, options);
                        _context.next = 16;
                        break;

                    case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](8);

                        console.error('hackGl: ' + _context.t0);
                        return _context.abrupt('return');

                    case 16:

                        fboUniformData[fboTextureName] = {
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

                        fboVertexCount = (0, _initVertexBuffers2.default)(gl, fboProgram);
                        _context.next = 24;
                        return (0, _uniformUtils.initUniforms)(gl, fboProgram, fboUniformData, fboTextureName);

                    case 24:
                        fboUniforms = _context.sent;

                        renderToTexture = function renderToTexture() {
                            gl.useProgram(fboProgram);

                            (0, _textureUtils.rebindFboTextures)(gl, fboUniforms);
                            fboUniforms = (0, _uniformUtils.updateUniforms)(gl, fboUniforms);

                            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); // change the drawing destination to FBO

                            // uniform location exists, which means fbo texture accessed in shader => ping pong texture to enable feedback
                            if (fboUniforms[fboTextureName]) {
                                var tmp = fbo.texture2;
                                fbo.texture2 = fbo.texture1;
                                fbo.texture1 = tmp;

                                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture1, 0);

                                gl.activeTexture(gl['TEXTURE' + fboUniforms[fboTextureName].textureUnitNo]);
                                gl.bindTexture(gl.TEXTURE_2D, fbo.texture2);
                                gl.uniform1i(fboUniforms[fboTextureName].uniform, fboUniforms[fboTextureName].textureUnitNo);
                            }

                            // clear and draw
                            gl.viewport(0, 0, options.resolution.width, options.resolution.height);
                            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                            gl.drawArrays(gl.TRIANGLE_STRIP, 0, fboVertexCount);

                            gl.bindFramebuffer(gl.FRAMEBUFFER, null); // change the drawing destination to color buffer
                            gl.bindTexture(gl.TEXTURE_2D, null);
                            // gl.bindTexture(gl.TEXTURE_2D, fbo.texture2);
                        };

                        return _context.abrupt('return', {
                            renderToTexture: renderToTexture,
                            fboUniform: fboUniforms[fboTextureName]
                        });

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[8, 12]]);
    }));

    return function initFramebuffer(_x, _x2, _x3, _x4, _x5) {
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

var _textureUtils = _dereq_('./texture-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toyFragmentHeader = _dereq_('../shaders/pixeltoy/fragment-header.glsl');
var cameraFragmentHeader = _dereq_('../shaders/camera-fragment-header.glsl');
var fboFragmentHeader = _dereq_('../shaders/fbo-fragment-header.glsl');
var toyVertexShader = _dereq_('../shaders/pixeltoy/vertex-shader.glsl');
var defaultFragmentShader = _dereq_('../shaders/pixeltoy/default-fragmentshader.glsl');

function _initFramebufferObject(gl, fboSettings, options) {
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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, options.resolution.width, options.resolution.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    framebuffer.texture1 = texture1;

    // bind the object to target
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    // setup texture2 to be written to
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, options.resolution.width, options.resolution.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

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
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, options.resolution.width, options.resolution.height);

    // attach the texture and the renderbuffer object to the FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // check if fbo is configured correctly
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        throw 'frame buffer object is incomplete: ' + e.toString();
        return error();
    }

    // unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return framebuffer;
}

},{"../shaders/camera-fragment-header.glsl":108,"../shaders/fbo-fragment-header.glsl":109,"../shaders/pixeltoy/default-fragmentshader.glsl":110,"../shaders/pixeltoy/fragment-header.glsl":111,"../shaders/pixeltoy/vertex-shader.glsl":112,"../webrtc/init-camera":116,"./create-gl-program":98,"./default-uniforms":99,"./init-vertex-buffers":102,"./texture-utils":103,"./uniform-utils":104,"babel-runtime/helpers/asyncToGenerator":7,"babel-runtime/helpers/extends":8,"babel-runtime/regenerator":11}],101:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = _dereq_('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = _dereq_('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _textureUtils = _dereq_('./texture-utils');

var _defaultUniforms = _dereq_('./default-uniforms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toyFragmentHeader = _dereq_('../shaders/pixeltoy/fragment-header.glsl');
var cameraFragmentHeader = _dereq_('../shaders/camera-fragment-header.glsl');
var fboFragmentHeader = _dereq_('../shaders/fbo-fragment-header.glsl');
var toyVertexShader = _dereq_('../shaders/pixeltoy/vertex-shader.glsl');
var defaultFragmentShader = _dereq_('../shaders/pixeltoy/default-fragmentshader.glsl');

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gl, options) {
        var uniformData, fragmentShader, fbos, prevFboUniforms, fboCount, _prevFboUniforms, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fboSettings, fbo, _fbo, program, vertexCount, uniforms, _renderFragmentShader, _render;

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
                        fbos = [];
                        prevFboUniforms = {};

                        if (!options.feedbackFbo) {
                            _context.next = 50;
                            break;
                        }

                        fboCount = 0;

                        if (!options.feedbackFbo.length) {
                            _context.next = 45;
                            break;
                        }

                        _prevFboUniforms = {};
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 16;
                        _iterator = (0, _getIterator3.default)(options.feedbackFbo);

                    case 18:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 29;
                            break;
                        }

                        fboSettings = _step.value;
                        _context.next = 22;
                        return (0, _initFbo.initFramebuffer)(gl, fboSettings, 'u_fbo' + fboCount, options, _prevFboUniforms);

                    case 22:
                        fbo = _context.sent;


                        if (typeof fbo.fboUniform !== 'undefined') {
                            uniformData['u_fbo' + fboCount] = fbo.fboUniform;
                            _prevFboUniforms['u_fbo' + fboCount] = fbo.fboUniform; // enable the rendered fbo texture from the prev fbo shader in the next fbo shader
                        }

                        fbos.push(fbo);
                        fboCount++;

                    case 26:
                        _iteratorNormalCompletion = true;
                        _context.next = 18;
                        break;

                    case 29:
                        _context.next = 35;
                        break;

                    case 31:
                        _context.prev = 31;
                        _context.t0 = _context['catch'](16);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 35:
                        _context.prev = 35;
                        _context.prev = 36;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 38:
                        _context.prev = 38;

                        if (!_didIteratorError) {
                            _context.next = 41;
                            break;
                        }

                        throw _iteratorError;

                    case 41:
                        return _context.finish(38);

                    case 42:
                        return _context.finish(35);

                    case 43:
                        _context.next = 50;
                        break;

                    case 45:
                        _context.next = 47;
                        return (0, _initFbo.initFramebuffer)(gl, options.feedbackFbo, 'u_fbo' + fboCount, options);

                    case 47:
                        _fbo = _context.sent;

                        uniformData['u_fbo' + fboCount] = _fbo.fboUniform;
                        fbos.push(_fbo);

                    case 50:
                        program = (0, _createGlProgram2.default)(gl, toyVertexShader, fragmentShader);

                        if (program) {
                            _context.next = 53;
                            break;
                        }

                        throw 'hack.Gl: failed to create main gl program!';

                    case 53:

                        gl.useProgram(program);
                        vertexCount = (0, _initVertexBuffers2.default)(gl, program, options);
                        _context.next = 57;
                        return (0, _uniformUtils.initUniforms)(gl, program, uniformData, 'main fragment');

                    case 57:
                        uniforms = _context.sent;

                        _renderFragmentShader = function _renderFragmentShader() {
                            gl.useProgram(program);

                            (0, _textureUtils.rebindFboTextures)(gl, uniforms);
                            uniforms = (0, _uniformUtils.updateUniforms)(gl, uniforms, options);

                            gl.viewport(0, 0, options.resolution.width, options.resolution.height); // set a viewport for FBO
                            gl.clear(gl.COLOR_BUFFER_BIT);
                            gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
                        };

                        // main render loop


                        _render = function _render() {
                            if (fbos.length) {
                                var _iteratorNormalCompletion2 = true;
                                var _didIteratorError2 = false;
                                var _iteratorError2 = undefined;

                                try {
                                    for (var _iterator2 = (0, _getIterator3.default)(fbos), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                        var _fbo2 = _step2.value;

                                        _fbo2.renderToTexture();
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
                            }

                            _renderFragmentShader();

                            (0, _executeCallbackOrArray2.default)(options.onRender);
                            requestAnimationFrame(_render);
                        };

                        _render();

                    case 61:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[16, 31, 35, 43], [36,, 38, 42]]);
    }));

    function initPixelToy(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return initPixelToy;
}();

module.exports = exports['default'];

},{"../shaders/camera-fragment-header.glsl":108,"../shaders/fbo-fragment-header.glsl":109,"../shaders/pixeltoy/default-fragmentshader.glsl":110,"../shaders/pixeltoy/fragment-header.glsl":111,"../shaders/pixeltoy/vertex-shader.glsl":112,"../utils/execute-callback-or-array":113,"../webrtc/init-camera":116,"./create-gl-program":98,"./default-uniforms":99,"./init-fbo":100,"./init-vertex-buffers":102,"./texture-utils":103,"./uniform-utils":104,"babel-runtime/core-js/get-iterator":2,"babel-runtime/helpers/asyncToGenerator":7,"babel-runtime/helpers/extends":8,"babel-runtime/regenerator":11}],102:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = initVertexBuffers;
function initVertexBuffers(gl, program) {
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

},{}],103:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadTextureData = undefined;

var _toConsumableArray2 = _dereq_('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = _dereq_('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = _dereq_('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = _dereq_('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = _dereq_('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var loadTextureData = exports.loadTextureData = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
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
                    case 'end':
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
exports.bindFboTexture = bindFboTexture;
exports.rebindFboTextures = rebindFboTextures;
exports.updateTexture = updateTexture;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var textureUnitNo = 0;

function initTexture(gl, data, image) {
    var maxTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    if (textureUnitNo > maxTextureCount) {
        throw 'hackGl: max number of texture units (' + maxTextureCount + ') exceeded';
    }

    var texture = gl.createTexture();

    // activate texture
    gl.activeTexture(gl['TEXTURE' + textureUnitNo]);

    // bind texture object
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // flip axes to xy instead of yx
    if (typeof data.flipY === 'undefined' || data.flipY != false) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    }

    // set params

    // note: clamp removes need for w x h being a power of two
    var repeatTypeS = gl.CLAMP_TO_EDGE,
        repeatTypeT = gl.CLAMP_TO_EDGE;
    if (_imageDimensionArePowerOf2(image)) {
        repeatTypeS = gl.REPEAT;
        repeatTypeT = gl.REPEAT;
    }

    if (data.wrapS && data.wrapS == 'clamp') {
        repeatTypeS = gl.CLAMP_TO_EDGE;
    }

    if (data.wrapT && data.wrapT == 'clamp') {
        repeatTypeT = gl.CLAMP_TO_EDGE;
    }

    if (data.wrapS && data.wrapS == 'repeat') {
        repeatTypeS = gl.REPEAT;
    }

    if (data.wrapT && data.wrapT == 'repeat') {
        repeatTypeT = gl.REPEAT;
    }

    if (data.wrapS && data.wrapS == 'mirrored-repeat') {
        repeatTypeS = gl.MIRRORED_REPEAT;
    }

    if (data.wrapT && data.wrapT == 'mirrored-repeat') {
        repeatTypeT = gl.MIRRORED_REPEAT;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeatTypeS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeatTypeT);

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (data.generateMips) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    // set the texture unit number to the sampler
    gl.uniform1i(data.uniform, textureUnitNo);
    data.textureUnitNo = textureUnitNo;
    data.texture = texture;

    textureUnitNo++;
    return data;
}

function initFboTexture(gl, data) {
    gl.activeTexture(gl['TEXTURE' + textureUnitNo]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture2);

    if (data.uniform) {
        gl.uniform1i(data.uniform, textureUnitNo);
    }

    data.textureUnitNo = textureUnitNo;
    textureUnitNo++;

    return data;
}

function bindFboTexture(gl, data) {
    gl.activeTexture(gl['TEXTURE' + data.textureUnitNo]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture2);
    gl.uniform1i(data.uniform, data.textureUnitNo);
    return data;
}

function rebindFboTextures(gl, uniforms) {
    var fboUniforms = (0, _keys2.default)(uniforms).reduce(function (a, uniformName) {
        return uniformName.startsWith('u_fbo') ? [].concat((0, _toConsumableArray3.default)(a), [uniforms[uniformName]]) : a;
    }, []);

    fboUniforms.forEach(function (uniform) {
        gl.activeTexture(gl['TEXTURE' + uniform.textureUnitNo]);
        gl.bindTexture(gl.TEXTURE_2D, uniform.texture2);
        gl.uniform1i(uniform.uniform, uniform.textureUnitNo);
    });
}

function updateTexture(gl, data) {
    gl.activeTexture(gl['TEXTURE' + data.textureUnitNo]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.value);
}

function _imageDimensionArePowerOf2(image) {
    return (image.naturalWidth & image.naturalWidth - 1) == 0 && (image.naturalHeight & image.naturalHeight - 1) == 0;
}

},{"babel-runtime/core-js/object/keys":5,"babel-runtime/core-js/promise":6,"babel-runtime/helpers/asyncToGenerator":7,"babel-runtime/helpers/toConsumableArray":10,"babel-runtime/regenerator":11}],104:[function(_dereq_,module,exports){
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
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gl, program, uniformData, shaderName) {
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
                            _context.next = 21;
                            break;
                        }

                        _step$value = (0, _slicedToArray3.default)(_step.value, 2), uniformName = _step$value[0], data = _step$value[1];
                        uniform = gl.getUniformLocation(program, new String(uniformName));

                        if (uniform) {
                            _context.next = 13;
                            break;
                        }

                        console.warn('hackGl: ' + shaderName + ' shader ' + ('failed to get the storage location of "' + uniformName + '" - ignoring variable. ') + 'Perhaps you forgot to use it in your shader?');

                        // don't init uniform, but still init texture unit for the fbo rendering

                        if (!(data.type != 'fbo_t')) {
                            _context.next = 13;
                            break;
                        }

                        return _context.abrupt('continue', 18);

                    case 13:
                        updatedData = (0, _extends3.default)({}, data, {
                            uniform: uniform
                        });

                        // await needed for texture image data loading

                        _context.next = 16;
                        return setUniformValue(gl, updatedData);

                    case 16:
                        updatedData = _context.sent;

                        result[uniformName] = updatedData;

                    case 18:
                        _iteratorNormalCompletion = true;
                        _context.next = 6;
                        break;

                    case 21:
                        _context.next = 27;
                        break;

                    case 23:
                        _context.prev = 23;
                        _context.t0 = _context['catch'](4);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 27:
                        _context.prev = 27;
                        _context.prev = 28;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 30:
                        _context.prev = 30;

                        if (!_didIteratorError) {
                            _context.next = 33;
                            break;
                        }

                        throw _iteratorError;

                    case 33:
                        return _context.finish(30);

                    case 34:
                        return _context.finish(27);

                    case 35:
                        return _context.abrupt('return', result);

                    case 36:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[4, 23, 27, 35], [28,, 30, 34]]);
    }));

    return function initUniforms(_x, _x2, _x3, _x4) {
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
                        _context2.next = _context2.t0 === 't' ? 3 : _context2.t0 === 'fbo_t' ? 17 : _context2.t0 === 'f' ? 19 : _context2.t0 === '2fv' ? 21 : _context2.t0 === '3fv' ? 23 : _context2.t0 === '4fv' ? 25 : 27;
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

                        data = (0, _textureUtils.initTexture)(gl, data, imageData);
                        _context2.next = 16;
                        break;

                    case 15:
                        if (updating && data.needsUpdate) {
                            (0, _textureUtils.updateTexture)(gl, data);
                        }

                    case 16:
                        return _context2.abrupt('break', 29);

                    case 17:
                        if (!updating && !data.textureUnitNo) {
                            data = (0, _textureUtils.initFboTexture)(gl, data);
                        } else {
                            data = (0, _textureUtils.bindFboTexture)(gl, data);
                        }

                        return _context2.abrupt('break', 29);

                    case 19:
                        gl.uniform1f(data.uniform, data.value);
                        return _context2.abrupt('break', 29);

                    case 21:
                        gl.uniform2fv(data.uniform, data.value);
                        return _context2.abrupt('break', 29);

                    case 23:
                        gl.uniform3fv(data.uniform, data.value);
                        return _context2.abrupt('break', 29);

                    case 25:
                        gl.uniform4fv(data.uniform, data.value);
                        return _context2.abrupt('break', 29);

                    case 27:
                        throw ': ' + data.type + ' uniform not yet implemented!';

                    case 29:
                        return _context2.abrupt('return', data);

                    case 30:
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

},{"../utils/iterate-object":115,"./texture-utils":103,"babel-runtime/core-js/get-iterator":2,"babel-runtime/helpers/asyncToGenerator":7,"babel-runtime/helpers/extends":8,"babel-runtime/helpers/slicedToArray":9,"babel-runtime/regenerator":11}],105:[function(_dereq_,module,exports){
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

// require('babel-polyfill');

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

},{"./gl/init-pixel-toy":101,"./init/options":106,"./lib/webgl-utils":107,"babel-runtime/helpers/toConsumableArray":10}],106:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = _dereq_('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = validateOptions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// wow, yeah, this needs work - the boring part

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
        validatedOptions.clearColor = [0.0, 0.0, 0.0, 1.0];
    }

    if (typeof options.resolution === 'undefined' || !options.resolution.width || !options.resolution.height) {
        validatedOptions.resolution = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    if (typeof options.feedbackFbo !== 'undefined') {
        if (typeof options.feedbackFbo.resolution === 'undefined' || !options.feedbackFbo.resolution.width || !options.feedbackFbo.resolution.height) {
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

},{"babel-runtime/helpers/extends":8}],107:[function(_dereq_,module,exports){
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

},{}],108:[function(_dereq_,module,exports){
module.exports = "uniform sampler2D u_camera;\n";

},{}],109:[function(_dereq_,module,exports){
module.exports = "uniform sampler2D u_fbo0;\nuniform sampler2D u_fbo1;\nuniform sampler2D u_fbo2;\nuniform sampler2D u_fbo3;\nuniform sampler2D u_fbo4;\nuniform sampler2D u_fbo5;\nuniform sampler2D u_fbo6;\n";

},{}],110:[function(_dereq_,module,exports){
module.exports = "void main() {\n    vec2 uv = gl_FragCoord.xy / u_resolution.xy;\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}\n";

},{}],111:[function(_dereq_,module,exports){
module.exports = "#ifdef GL_ES\n    precision mediump float;\n#endif\n\nuniform vec2 u_resolution;\nuniform vec2 u_mouse;\nuniform float u_time;\n";

},{}],112:[function(_dereq_,module,exports){
module.exports = "attribute vec4 a_position;\n\nvoid main() {\n    gl_Position = a_position;\n}\n";

},{}],113:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = executeCallbackOrArray;
function executeCallbackOrArray(callback) {
    if (Array.isArray(callback)) {
        callback.forEach(function (cb) {
            return cb();
        });
    } else if (typeof callback === 'function') {
        callback();
    } else {
        throw 'hackGl: illegal callback';
    }
}
module.exports = exports['default'];

},{}],114:[function(_dereq_,module,exports){
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

},{}],115:[function(_dereq_,module,exports){
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

},{"babel-runtime/core-js/get-iterator":2,"babel-runtime/core-js/object/keys":5,"babel-runtime/regenerator":11}],116:[function(_dereq_,module,exports){
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
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var video;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        video = void 0;
                        _context.prev = 1;
                        _context.next = 4;
                        return _initCamera();

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

    return function initCameraUniform() {
        return _ref.apply(this, arguments);
    };
}();

var _initCamera = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
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
                        _context2.next = 14;
                        break;

                    case 10:
                        _context2.prev = 10;
                        _context2.t0 = _context2['catch'](4);

                        console.dir(_context2.t0);
                        throw 'hackGl: Could not load camera stream:';

                    case 14:

                        video.srcObject = stream;
                        video.play();
                        streaming = true;

                        return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
                            video.addEventListener('canplay', function (e) {
                                return resolve(video);
                            }, false);
                        }));

                    case 18:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[4, 10]]);
    }));

    return function _initCamera() {
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
    value: null,
    wrapS: 'clamp',
    wrapT: 'clamp'
};

function _injectVideoElement() {
    var video = document.createElement('video');

    video.id = 'video';
    video.style.display = 'none';
    video.innerHTML = 'Video stream not available.';
    document.body.insertBefore(video, document.body.childNodes[0]);

    return video;
}

},{"babel-runtime/core-js/promise":6,"babel-runtime/helpers/asyncToGenerator":7,"babel-runtime/helpers/extends":8,"babel-runtime/regenerator":11}]},{},[105])(105)
});

//# sourceMappingURL=hackgl.js.map
