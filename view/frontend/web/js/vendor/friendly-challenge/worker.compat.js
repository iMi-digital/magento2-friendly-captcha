(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};self.Promise||(self.Promise=n,self.Promise.resolve=u,self.Promise.reject=t,self.Promise.race=x,self.Promise.all=w,self.Promise.prototype.then=n.prototype.c,self.Promise.prototype["catch"]=n.prototype.g);}());
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict'; // This is not an enum to save some bytes in the output bundle.

  var SOLVER_TYPE_JS = 1;
  var SOLVER_TYPE_WASM = 2;
  var CHALLENGE_SIZE_BYTES = 128;

  function getPuzzleSolverInputs(puzzleBuffer, numPuzzles) {
    var startingPoints = [];

    for (var i = 0; i < numPuzzles; i++) {
      var input = new Uint8Array(CHALLENGE_SIZE_BYTES);
      input.set(puzzleBuffer);
      input[120] = i;
      startingPoints.push(input);
    }

    return startingPoints;
  } // This is a hand-pruned version of the assemblyscript loader, removing
  // a lot of functionality we don't need, saving in bundle size.


  function addUtilityExports(instance) {
    var extendedExports = {};
    var exports = instance.exports;
    var memory = exports.memory;
    var alloc = exports["__alloc"];
    var retain = exports["__retain"];
    var rttiBase = exports["__rtti_base"] || ~0; // oob if not present

    /** Gets the runtime type info for the given id. */

    function getInfo(id) {
      var U32 = new Uint32Array(memory.buffer); // const count = U32[rttiBase >>> 2];
      // if ((id >>>= 0) >= count) throw Error("invalid id: " + id);

      return U32[(rttiBase + 4 >>> 2) + id * 2];
    }
    /** Allocates a new array in the module's memory and returns its retained pointer. */


    extendedExports.__allocArray = function (id, values) {
      var info = getInfo(id);
      var align = 31 - Math.clz32(info >>> 6 & 31);
      var length = values.length;
      var buf = alloc(length << align, 0);
      var arr = alloc(12, id);
      var U32 = new Uint32Array(memory.buffer);
      U32[arr + 0 >>> 2] = retain(buf);
      U32[arr + 4 >>> 2] = buf;
      U32[arr + 8 >>> 2] = length << align;
      var buffer = memory.buffer;
      var view = new Uint8Array(buffer);

      if (info & 1 << 14) {
        for (var i = 0; i < length; ++i) {
          view[(buf >>> align) + i] = retain(values[i]);
        }
      } else {
        view.set(values, buf >>> align);
      }

      return arr;
    };

    extendedExports.__getUint8Array = function (ptr) {
      var U32 = new Uint32Array(memory.buffer);
      var bufPtr = U32[ptr + 4 >>> 2];
      return new Uint8Array(memory.buffer, bufPtr, U32[bufPtr - 4 >>> 2] >>> 0);
    };

    return demangle(exports, extendedExports);
  }
  /** Demangles an AssemblyScript module's exports to a friendly object structure. */


  function demangle(exports) {
    var extendedExports = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // extendedExports = Object.create(extendedExports);
    var setArgumentsLength = exports["__argumentsLength"] ? function (length) {
      exports["__argumentsLength"].value = length;
    } : exports["__setArgumentsLength"] || exports["__setargc"] || function () {
      return {};
    };

    var _loop = function _loop(internalName) {
      if (!Object.prototype.hasOwnProperty.call(exports, internalName)) return "continue";
      var elem = exports[internalName]; // Only necessary if nested exports are present
      //   let parts = internalName.split(".");
      //   let curr = extendedExports;
      //   while (parts.length > 1) {
      //     let part = parts.shift();
      //     if (!Object.prototype.hasOwnProperty.call(curr, part as any)) curr[part as any] = {};
      //     curr = curr[part as any];
      //   }

      var name = internalName.split(".")[0];

      if (typeof elem === "function" && elem !== setArgumentsLength) {
        (extendedExports[name] = function () {
          setArgumentsLength(arguments.length);
          return elem.apply(void 0, arguments);
        }).original = elem;
      } else {
        extendedExports[name] = elem;
      }
    };

    for (var internalName in exports) {
      var _ret = _loop(internalName);

      if (_ret === "continue") continue;
    }

    return extendedExports;
  }

  function instantiateWasmSolver(module) {
    return new Promise(function ($return, $error) {
      var imports, result, exports;
      imports = {
        env: {
          abort: function abort() {
            throw Error("Wasm aborted");
          }
        }
      };
      return Promise.resolve(WebAssembly.instantiate(module, imports)).then(function ($await_5) {
        try {
          result = $await_5;
          exports = addUtilityExports(result);
          return $return({
            exports: exports
          });
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }, $error);
    });
  }

  function getWasmSolver(module) {
    return new Promise(function ($return, $error) {
      var w, arrPtr, solution;
      return Promise.resolve(instantiateWasmSolver(module)).then(function ($await_6) {
        try {
          w = $await_6;
          arrPtr = w.exports.__retain(w.exports.__allocArray(w.exports.Uint8Array_ID, new Uint8Array(128)));
          solution = w.exports.__getUint8Array(arrPtr);
          return $return(function (puzzleBuffer, threshold) {
            var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4294967295;
            solution.set(puzzleBuffer);
            var hashPtr = w.exports.solveBlake2b(arrPtr, threshold, n);
            solution = w.exports.__getUint8Array(arrPtr);

            var hash = w.exports.__getUint8Array(hashPtr);

            w.exports.__release(hashPtr);

            return [solution, hash];
          });
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }, $error);
    });
  } // Blake2B made assemblyscript compatible, adapted from (CC0 licensed):
  // Blake2B in pure Javascript
  // Adapted from the reference implementation in RFC7693
  // Ported to Javascript by DC - https://github.com/dcposch


  var Context = function Context(outlen) {
    _classCallCheck(this, Context);

    this.b = new Uint8Array(128);
    this.h = new Uint32Array(16);
    this.t = 0; // input count

    this.c = 0; // pointer within buffer

    this.v = new Uint32Array(32);
    this.m = new Uint32Array(32);
    this.outlen = outlen;
  }; // Little-endian byte access


  function B2B_GET32(arr, i) {
    return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
  } // G Mixing function with everything inlined
  // performance at the cost of readability, especially faster in old browsers


  function B2B_G_FAST(v, m, a, b, c, d, ix, iy) {
    var x0 = m[ix];
    var x1 = m[ix + 1];
    var y0 = m[iy];
    var y1 = m[iy + 1]; // va0 are the low bits, va1 are the high bits

    var va0 = v[a];
    var va1 = v[a + 1];
    var vb0 = v[b];
    var vb1 = v[b + 1];
    var vc0 = v[c];
    var vc1 = v[c + 1];
    var vd0 = v[d];
    var vd1 = v[d + 1];
    var w0, ww, xor0, xor1; // ADD64AA(v, a, b); // v[a,a+1] += v[b,b+1] ... in JS we must store a uint64 as two uint32s
    // ADD64AA(v,a,b)

    w0 = va0 + vb0;
    ww = (va0 & vb0 | (va0 | vb0) & ~w0) >>> 31;
    va0 = w0;
    va1 = va1 + vb1 + ww; // // ADD64AC(v, a, x0, x1); // v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

    w0 = va0 + x0;
    ww = (va0 & x0 | (va0 | x0) & ~w0) >>> 31;
    va0 = w0;
    va1 = va1 + x1 + ww; // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated to the right by 32 bits

    xor0 = vd0 ^ va0;
    xor1 = vd1 ^ va1; // We can just swap high and low here becaeuse its a shift by 32 bits

    vd0 = xor1;
    vd1 = xor0; // ADD64AA(v, c, d);

    w0 = vc0 + vd0;
    ww = (vc0 & vd0 | (vc0 | vd0) & ~w0) >>> 31;
    vc0 = w0;
    vc1 = vc1 + vd1 + ww; // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 24 bits

    xor0 = vb0 ^ vc0;
    xor1 = vb1 ^ vc1;
    vb0 = xor0 >>> 24 ^ xor1 << 8;
    vb1 = xor1 >>> 24 ^ xor0 << 8; // ADD64AA(v, a, b);

    w0 = va0 + vb0;
    ww = (va0 & vb0 | (va0 | vb0) & ~w0) >>> 31;
    va0 = w0;
    va1 = va1 + vb1 + ww; // ADD64AC(v, a, y0, y1);

    w0 = va0 + y0;
    ww = (va0 & y0 | (va0 | y0) & ~w0) >>> 31;
    va0 = w0;
    va1 = va1 + y1 + ww; // v[d,d+1] = (v[d,d+1] xor v[a,a+1]) rotated right by 16 bits

    xor0 = vd0 ^ va0;
    xor1 = vd1 ^ va1;
    vd0 = xor0 >>> 16 ^ xor1 << 16;
    vd1 = xor1 >>> 16 ^ xor0 << 16; // ADD64AA(v, c, d);

    w0 = vc0 + vd0;
    ww = (vc0 & vd0 | (vc0 | vd0) & ~w0) >>> 31;
    vc0 = w0;
    vc1 = vc1 + vd1 + ww; // v[b,b+1] = (v[b,b+1] xor v[c,c+1]) rotated right by 63 bits

    xor0 = vb0 ^ vc0;
    xor1 = vb1 ^ vc1;
    vb0 = xor1 >>> 31 ^ xor0 << 1;
    vb1 = xor0 >>> 31 ^ xor1 << 1;
    v[a] = va0;
    v[a + 1] = va1;
    v[b] = vb0;
    v[b + 1] = vb1;
    v[c] = vc0;
    v[c + 1] = vc1;
    v[d] = vd0;
    v[d + 1] = vd1;
  } // Initialization Vector


  var BLAKE2B_IV32 = [0xF3BCC908, 0x6A09E667, 0x84CAA73B, 0xBB67AE85, 0xFE94F82B, 0x3C6EF372, 0x5F1D36F1, 0xA54FF53A, 0xADE682D1, 0x510E527F, 0x2B3E6C1F, 0x9B05688C, 0xFB41BD6B, 0x1F83D9AB, 0x137E2179, 0x5BE0CD19]; // TODO format more nicely
  // Note these offsets have all been multiplied by two to make them offsets into
  // a uint32 buffer.

  var SIGMA82 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 28, 20, 8, 16, 18, 30, 26, 12, 2, 24, 0, 4, 22, 14, 10, 6, 22, 16, 24, 0, 10, 4, 30, 26, 20, 28, 6, 12, 14, 2, 18, 8, 14, 18, 6, 2, 26, 24, 22, 28, 4, 12, 10, 20, 8, 0, 30, 16, 18, 0, 10, 14, 4, 8, 20, 30, 28, 2, 22, 24, 12, 16, 6, 26, 4, 24, 12, 20, 0, 22, 16, 6, 8, 26, 14, 10, 30, 28, 2, 18, 24, 10, 2, 30, 28, 26, 8, 20, 0, 14, 12, 6, 18, 4, 16, 22, 26, 22, 14, 28, 24, 2, 6, 18, 10, 0, 30, 8, 16, 12, 4, 20, 12, 30, 28, 18, 22, 6, 0, 16, 24, 4, 26, 14, 2, 8, 20, 10, 20, 4, 16, 8, 14, 12, 2, 10, 30, 22, 18, 28, 6, 24, 26, 0, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 28, 20, 8, 16, 18, 30, 26, 12, 2, 24, 0, 4, 22, 14, 10, 6]; // Compression function. 'last' flag indicates last block.

  function blake2bCompress(ctx, last) {
    var v = ctx.v;
    var m = ctx.m; // init work variables

    for (var i = 0; i < 16; i++) {
      v[i] = ctx.h[i];
      v[i + 16] = BLAKE2B_IV32[i];
    } // low 64 bits of offset


    v[24] = v[24] ^ ctx.t;
    v[25] = v[25] ^ ctx.t / 0x100000000; // high 64 bits not supported, offset may not be higher than 2**53-1
    // last block flag set ?

    if (last) {
      v[28] = ~v[28];
      v[29] = ~v[29];
    } // get little-endian words


    for (var _i = 0; _i < 32; _i++) {
      m[_i] = B2B_GET32(ctx.b, 4 * _i);
    } // twelve rounds of mixing


    for (var _i2 = 0; _i2 < 12; _i2++) {
      B2B_G_FAST(v, m, 0, 8, 16, 24, SIGMA82[_i2 * 16 + 0], SIGMA82[_i2 * 16 + 1]);
      B2B_G_FAST(v, m, 2, 10, 18, 26, SIGMA82[_i2 * 16 + 2], SIGMA82[_i2 * 16 + 3]);
      B2B_G_FAST(v, m, 4, 12, 20, 28, SIGMA82[_i2 * 16 + 4], SIGMA82[_i2 * 16 + 5]);
      B2B_G_FAST(v, m, 6, 14, 22, 30, SIGMA82[_i2 * 16 + 6], SIGMA82[_i2 * 16 + 7]);
      B2B_G_FAST(v, m, 0, 10, 20, 30, SIGMA82[_i2 * 16 + 8], SIGMA82[_i2 * 16 + 9]);
      B2B_G_FAST(v, m, 2, 12, 22, 24, SIGMA82[_i2 * 16 + 10], SIGMA82[_i2 * 16 + 11]);
      B2B_G_FAST(v, m, 4, 14, 16, 26, SIGMA82[_i2 * 16 + 12], SIGMA82[_i2 * 16 + 13]);
      B2B_G_FAST(v, m, 6, 8, 18, 28, SIGMA82[_i2 * 16 + 14], SIGMA82[_i2 * 16 + 15]);
    }

    for (var _i3 = 0; _i3 < 16; _i3++) {
      ctx.h[_i3] = ctx.h[_i3] ^ v[_i3] ^ v[_i3 + 16];
    }
  }
  /**
   * FRIENDLYCAPTCHA optimization only, does not reset ctx.t (global byte counter)
   * Assumes no key
   */


  function blake2bResetForShortMessage(ctx, input) {
    // Initialize State vector h with IV
    for (var i = 0; i < 16; i++) {
      ctx.h[i] = BLAKE2B_IV32[i];
    } // Danger: These operations and resetting are really only possible because our input is exactly 128 bytes


    ctx.b.set(input); // ctx.m.fill(0);
    // ctx.v.fill(0);

    ctx.h[0] ^= 0x01010000 ^ ctx.outlen;
  }

  var HASH_SIZE_BYTES = 32;
  /**
   * Solve the blake2b hashing problem, re-using the memory between different attempts (which solves up to 50% faster).
   *
   * This only changes the last 4 bytes of the input array to find a solution. To find multiple solutions
   * one could call this function multiple times with the 4 bytes in front of those last 4 bytes varying.
   *
   *
   * The goal is to find a nonce that, hashed together with the rest of the input header, has a value of its
   * most significant 32bits that is below some threshold.
   * Approximately this means: the hash value of it starts with K zeroes (little endian), which is expected to be
   * increasingly difficult as K increases.
   *
   * In practice you should ask the client to solve multiple (easier) puzzles which should reduce variance and also allows us
   * to show a progress bar.
   * @param input challenge bytes
   * @param threshold u32 value under which the solution's hash should be below.
   */

  function solveBlake2bEfficient(input, threshold, n) {
    if (input.length != CHALLENGE_SIZE_BYTES) {
      throw Error("Invalid input");
    }

    var buf = input.buffer;
    var view = new DataView(buf);
    var ctx = new Context(HASH_SIZE_BYTES);
    ctx.t = CHALLENGE_SIZE_BYTES;
    var start = view.getUint32(124, true);
    var end = start + n;

    for (var i = start; i < end; i++) {
      view.setUint32(124, i, true);
      blake2bResetForShortMessage(ctx, input);
      blake2bCompress(ctx, true);

      if (ctx.h[0] < threshold) {
        if (ASC_TARGET == 0) {
          // JS
          return new Uint8Array(ctx.h.buffer);
        } //@ts-ignore


        return Uint8Array.wrap(ctx.h.buffer);
      }
    }

    return new Uint8Array(0);
  }

  function getJSSolver() {
    return new Promise(function ($return, $error) {
      return $return(function (puzzleBuffer, threshold) {
        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4294967295;
        var hash = solveBlake2bEfficient(puzzleBuffer, threshold, n);
        return [puzzleBuffer, hash];
      });
    });
  }

  function createDiagnosticsBuffer(solverID, timeToSolved) {
    var arr = new Uint8Array(3);
    var view = new DataView(arr.buffer);
    view.setUint8(0, solverID);
    view.setUint16(1, timeToSolved);
    return arr;
  }

  if (!Uint8Array.prototype.slice) {
    Object.defineProperty(Uint8Array.prototype, 'slice', {
      value: function value(begin, end) {
        return new Uint8Array(Array.prototype.slice.call(this, begin, end));
      }
    });
  }

  self.ASC_TARGET = 0; // 1 for JS, 2 for WASM

  var solverType; // Puzzle consisting of zeroes

  var setSolver;
  var solver = new Promise(function (resolve) {
    return setSolver = resolve;
  });
  var hasStarted = false;

  self.onerror = function (evt) {
    self.postMessage({
      type: "error",
      message: JSON.stringify(evt)
    });
  };

  self.onmessage = function (evt) {
    return new Promise(function ($return, $error) {
      var i, b;
      var data, type;
      data = evt.data;
      type = data.type;

      var $Try_1_Post = function $Try_1_Post() {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      };

      var $Try_1_Catch = function $Try_1_Catch(e) {
        try {
          setTimeout(function () {
            throw e;
          });
          return $Try_1_Post();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      };

      try {
        var $If_2 = function $If_2() {
          return $Try_1_Post();
        };

        if (type === "module") {
          var s;
          return Promise.resolve(getWasmSolver(data.module)).then(function ($await_7) {
            try {
              s = $await_7;
              self.postMessage({
                type: "ready",
                solver: SOLVER_TYPE_WASM
              });
              solverType = SOLVER_TYPE_WASM;
              setSolver(s);
              return $If_2.call(this);
            } catch ($boundEx) {
              return $Try_1_Catch($boundEx);
            }
          }.bind(this), $Try_1_Catch);
        } else {
          var $If_3 = function $If_3() {
            return $If_2.call(this);
          };

          if (type === "js") {
            var _s;

            return Promise.resolve(getJSSolver()).then(function ($await_8) {
              try {
                _s = $await_8;
                self.postMessage({
                  type: "ready",
                  solver: SOLVER_TYPE_JS
                });
                solverType = SOLVER_TYPE_JS;
                setSolver(_s);
                return $If_3.call(this);
              } catch ($boundEx) {
                return $Try_1_Catch($boundEx);
              }
            }.bind(this), $Try_1_Catch);
          } else {
            var $If_4 = function $If_4() {
              return $If_3.call(this);
            };

            if (type === "start") {
              var solve, solverStartTime, totalH, starts, solutionBuffer, totalTime, doneMessage;

              if (hasStarted) {
                return $return();
              }

              hasStarted = true;
              return Promise.resolve(solver).then(function ($await_9) {
                try {
                  solve = $await_9;
                  self.postMessage({
                    type: "started"
                  });
                  solverStartTime = Date.now();
                  totalH = 0;
                  starts = getPuzzleSolverInputs(data.buffer, data.n);
                  solutionBuffer = new Uint8Array(8 * data.n); // Note: var instead of const for IE11 compat

                  for (i = 0; i < starts.length; i++) {
                    var startTime = Date.now();
                    var solution = void 0;

                    for (b = 0; b < 256; b++) {
                      // In the very unlikely case no solution is found we should try again 
                      starts[i][123] = b;

                      var _solve = solve(starts[i], data.threshold),
                          _solve2 = _slicedToArray(_solve, 2),
                          _s2 = _solve2[0],
                          hash = _solve2[1];

                      if (hash.length === 0) {
                        // This should be very small in probability unless you set the difficulty much too high.
                        // Also this means 2^32 puzzles were evaluated, which takes a while in a browser!
                        // As we try 256 times, this is not fatal
                        console.warn("FC: Internal error or no solution found");
                        continue;
                      }

                      solution = _s2;
                      break;
                    }

                    var view = new DataView(solution.slice(-4).buffer);
                    var h = view.getUint32(0, true);
                    var t = (Date.now() - startTime) / 1000;
                    totalH += h;
                    solutionBuffer.set(solution.slice(-8), i * 8); // The last 8 bytes are the solution nonce

                    self.postMessage({
                      type: "progress",
                      n: data.n,
                      h: h,
                      t: t,
                      i: i
                    });
                  }

                  totalTime = (Date.now() - solverStartTime) / 1000;
                  doneMessage = {
                    type: "done",
                    solution: solutionBuffer,
                    h: totalH,
                    t: totalTime,
                    diagnostics: createDiagnosticsBuffer(solverType, totalTime),
                    solver: solverType
                  };
                  self.postMessage(doneMessage);
                  return $If_4.call(this);
                } catch ($boundEx) {
                  return $Try_1_Catch($boundEx);
                }
              }.bind(this), $Try_1_Catch);
            }

            return $If_4.call(this);
          }
        }
      } catch (e) {
        $Try_1_Catch(e);
      }
    });
  };
})();
