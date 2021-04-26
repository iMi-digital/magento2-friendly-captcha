"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  'use strict';

  var css = '.frc-captcha *{margin:0;padding:0;border:0;text-align:initial;border-radius:px;filter:none!important;transition:none!important;font-weight:400;font-size:14px;line-height:1.35;text-decoration:none;background-color:initial;color:#222}.frc-captcha{position:relative;width:312px;border:1px solid #f4f4f4;padding-bottom:12px;background-color:#fff}.frc-container{display:flex;align-items:center;min-height:52px}.frc-icon{fill:#222;stroke:#222;flex-shrink:0;margin:8px 8px 0}.frc-icon.frc-warning{fill:#c00}.frc-content{white-space:nowrap;display:flex;flex-direction:column;margin:4px 6px 0 0;overflow-x:auto;flex-grow:1}.frc-banner{position:absolute;bottom:0;right:6px;line-height:1}.frc-banner *{font-size:10px;opacity:.8}.frc-banner b{font-weight:700}.frc-progress{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:3px 0;height:4px;border:none;background-color:#eee;color:#222;width:100%;transition:.5s linear}.frc-progress::-webkit-progress-bar{background:#eee}.frc-progress::-webkit-progress-value{background:#222}.frc-progress::-moz-progress-bar{background:#222}.frc-button{cursor:pointer;padding:2px 6px;background-color:#f1f1f1;border:1px solid transparent;text-align:center;font-weight:600;text-transform:none}.frc-button:focus{border:1px solid #333}.frc-button:hover{background-color:#ddd}.dark.frc-captcha{color:#fff;background-color:#222;border-color:#333}.dark.frc-captcha *{color:#fff}.dark.frc-captcha button{background-color:#444}.dark .frc-icon{fill:#fff;stroke:#fff}.dark .frc-progress{background-color:#444}.dark .frc-progress::-webkit-progress-bar{background:#444}.dark .frc-progress::-webkit-progress-value{background:#ddd}.dark .frc-progress::-moz-progress-bar{background:#ddd}'; // This is not an enum to save some bytes in the output bundle.

  var SOLVER_TYPE_JS = 1; // @ts-ignore

  var loaderSVG = "<circle cx=\"12\" cy=\"12\" r=\"8\" stroke-width=\"3\" stroke-dasharray=\"15 10\" fill=\"none\" stroke-linecap=\"round\" transform=\"rotate(0 12 12)\"><animateTransform attributeName=\"transform\" type=\"rotate\" repeatCount=\"indefinite\" dur=\"0.9s\" values=\"0 12 12;360 12 12\"/></circle>";
  var errorSVG = "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"/>";
  /**
   * Base template used for all widget states
   * The reason we use raw string interpolation here is so we don't have to ship something like lit-html.
   */

  function getTemplate(fieldName, svgContent, textContent, solutionString, buttonText) {
    var progress = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var debugData = arguments.length > 6 ? arguments[6] : undefined;
    return "<div class=\"frc-container\">\n<svg class=\"frc-icon\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" height=\"32\" width=\"32\" viewBox=\"0 0 24 24\">".concat(svgContent, "</svg>\n<div class=\"frc-content\">\n    <span class=\"frc-text\" ").concat(debugData ? "title=\"".concat(debugData, "\"") : "", ">").concat(textContent, "</span>\n    ").concat(buttonText ? "<button type=\"button\" class=\"frc-button\">".concat(buttonText, "</button>") : '', "\n    ").concat(progress ? "<progress class=\"frc-progress\" value=\"0\">0%</progress>" : '', "\n</div>\n</div><span class=\"frc-banner\"><a href=\"https://friendlycaptcha.com/\" rel=\"noopener\" style=\"text-decoration:none;\" target=\"_blank\"><b>Friendly</b>Captcha \u21D7</a></span>\n<input name=\"").concat(fieldName, "\" class=\"frc-captcha-solution\" style=\"display: none;\" type=\"hidden\" value=\"").concat(solutionString, "\">");
  }
  /**
   * Used when the widget is ready to start solving.
   */


  function getReadyHTML(fieldName, l) {
    return getTemplate(fieldName, "<path d=\"M17,11c0.34,0,0.67,0.04,1,0.09V6.27L10.5,3L3,6.27v4.91c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55 C11.41,19.47,11,18.28,11,17C11,13.69,13.69,11,17,11z\"/><path d=\"M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38\"/>", l.text_ready, ".UNSTARTED", l.button_start, false);
  }
  /**
   * Used when the widget is retrieving a puzzle
   */


  function getFetchingHTML(fieldName, l) {
    return getTemplate(fieldName, loaderSVG, l.text_fetching, ".FETCHING", undefined, true);
  }
  /**
   * Used when the solver is running, displays a progress bar.
   */


  function getRunningHTML(fieldName, l) {
    return getTemplate(fieldName, loaderSVG, l.text_solving, ".UNFINISHED", undefined, true);
  }

  function getDoneHTML(fieldName, l, solution, data) {
    var timeData = "Completed: ".concat(data.t.toFixed(0), "s (").concat((data.h / data.t * 0.001).toFixed(0), "K/s)").concat(data.solver === SOLVER_TYPE_JS ? " JS Fallback" : "");
    return getTemplate(fieldName, "<title>".concat(timeData, "</title><path d=\"M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z\"><animate attributeName=\"opacity\" dur=\"1.0s\" values=\"0;1\"/></path>"), l.text_completed, solution, undefined, false, timeData);
  }

  function getExpiredHTML(fieldName, l) {
    return getTemplate(fieldName, errorSVG, l.text_expired, ".EXPIRED", l.button_restart);
  }

  function getErrorHTML(fieldName, l, errorDescription) {
    var recoverable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return getTemplate(fieldName, errorSVG, l.text_error + " " + errorDescription, ".ERROR", recoverable ? l.button_retry : undefined);
  }

  function findCaptchaElements() {
    var elements = document.querySelectorAll(".frc-captcha");

    if (elements.length === 0) {
      console.warn("FriendlyCaptcha: No div was found with .frc-captcha class");
    }

    return elements;
  }
  /**
   * Injects the style if no #frc-style element is already present
   * (to support custom stylesheets)
   */


  function injectStyle() {
    if (!document.querySelector("#frc-style")) {
      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.id = "frc-style";
      styleSheet.innerHTML = css;
      document.head.appendChild(styleSheet);
    }
  }
  /**
   * @param element parent element of friendlycaptcha
   * @param progress value between 0 and 1
   */


  function updateProgressBar(element, data) {
    var p = element.querySelector(".frc-progress");
    var perc = (data.i + 1) / data.n;

    if (p) {
      p.value = perc;
      p.innerText = perc.toFixed(2) + "%";
      p.title = data.i + 1 + "/" + data.n + " (" + (data.h / data.t * 0.001).toFixed(0) + "K/s)";
    }
  }
  /**
   * Traverses parent nodes until a <form> is found, returns null if not found.
   */


  function findParentFormElement(element) {
    while (element.tagName !== "FORM") {
      element = element.parentElement;

      if (!element) {
        return null;
      }
    }

    return element;
  }
  /**
   * Add listener to specified element that will only fire once on focus.
   */


  function executeOnceOnFocusInEvent(element, listener) {
    element.addEventListener("focusin", listener, {
      once: true,
      passive: true
    });
  } // WARNING: This file was autogenerated by wasmwrap and should not be edited manually.


  var base64 = "AGFzbQEAAAABKghgAABgAn9/AGADf39/AX9gAX8AYAR/f39/AGAAAX9gAX8Bf2ACf38BfwINAQNlbnYFYWJvcnQABAMMCwcGAwAAAQIFAQIABQMBAAEGFgR/AUEAC38BQQALfwBBAwt/AEHgDAsHbgkGbWVtb3J5AgAHX19hbGxvYwABCF9fcmV0YWluAAIJX19yZWxlYXNlAAMJX19jb2xsZWN0AAQHX19yZXNldAAFC19fcnR0aV9iYXNlAwMNVWludDhBcnJheV9JRAMCDHNvbHZlQmxha2UyYgAKCAELCvgSC5IBAQV/IABB8P///wNLBEAACyMBQRBqIgQgAEEPakFwcSICQRAgAkEQSxsiBmoiAj8AIgVBEHQiA0sEQCAFIAIgA2tB//8DakGAgHxxQRB2IgMgBSADShtAAEEASARAIANAAEEASARAAAsLCyACJAEgBEEQayICIAY2AgAgAkEBNgIEIAIgATYCCCACIAA2AgwgBAsEACAACwMAAQsDAAELBgAjACQBC7sCAQF/AkAgAUUNACAAQQA6AAAgACABakEEayICQQA6AAMgAUECTQ0AIABBADoAASAAQQA6AAIgAkEAOgACIAJBADoAASABQQZNDQAgAEEAOgADIAJBADoAACABQQhNDQAgAEEAIABrQQNxIgJqIgBBADYCACAAIAEgAmtBfHEiAmpBHGsiAUEANgIYIAJBCE0NACAAQQA2AgQgAEEANgIIIAFBADYCECABQQA2AhQgAkEYTQ0AIABBADYCDCAAQQA2AhAgAEEANgIUIABBADYCGCABQQA2AgAgAUEANgIEIAFBADYCCCABQQA2AgwgACAAQQRxQRhqIgFqIQAgAiABayEBA0AgAUEgTwRAIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGCABQSBrIQEgAEEgaiEADAELCwsLcgACfyAARQRAQQxBAhABIQALIAALQQA2AgAgAEEANgIEIABBADYCCCABQfD///8DIAJ2SwRAQcAKQfAKQRJBORAAAAsgASACdCIBQQAQASICIAEQBiAAKAIAGiAAIAI2AgAgACACNgIEIAAgATYCCCAAC88BAQJ/QaABQQAQASIAQQxBAxABQYABQQAQBzYCACAAQQxBBBABQQhBAxAHNgIEIABCADcDCCAAQQA2AhAgAEIANwMYIABC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"; // Adapted from the base64-arraybuffer package implementation
  // (https://github.com/niklasvh/base64-arraybuffer, MIT licensed)

  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var EQ_CHAR = "=".charCodeAt(0); // Use a lookup table to find the index.

  var lookup = new Uint8Array(256);

  for (var i = 0; i < CHARS.length; i++) {
    lookup[CHARS.charCodeAt(i)] = i;
  }

  function encode(bytes) {
    var len = bytes.length;
    var base64 = "";

    for (var _i = 0; _i < len; _i += 3) {
      var b0 = bytes[_i + 0];
      var b1 = bytes[_i + 1];
      var b2 = bytes[_i + 2];
      base64 += CHARS.charAt(b0 >>> 2);
      base64 += CHARS.charAt((b0 & 3) << 4 | b1 >>> 4);
      base64 += CHARS.charAt((b1 & 15) << 2 | b2 >>> 6);
      base64 += CHARS.charAt(b2 & 63);
    }

    if (len % 3 === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  }

  function decode(base64) {
    var len = base64.length;
    var bufferLength = len * 3 >>> 2; // * 0.75

    if (base64.charCodeAt(len - 1) === EQ_CHAR) bufferLength--;
    if (base64.charCodeAt(len - 2) === EQ_CHAR) bufferLength--;
    var bytes = new Uint8Array(bufferLength);

    for (var _i2 = 0, p = 0; _i2 < len; _i2 += 4) {
      var encoded1 = lookup[base64.charCodeAt(_i2 + 0)];
      var encoded2 = lookup[base64.charCodeAt(_i2 + 1)];
      var encoded3 = lookup[base64.charCodeAt(_i2 + 2)];
      var encoded4 = lookup[base64.charCodeAt(_i2 + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }

    return bytes;
  }

  var workerString = "!function(){function r(r,n){return function(r){if(Array.isArray(r))return r}(r)||function(r,t){if(\"undefined\"!=typeof Symbol&&Symbol.iterator in Object(r)){var n=[],e=!0,o=!1,i=void 0;try{for(var a,u=r[Symbol.iterator]();!(e=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);e=!0);}catch(f){o=!0,i=f}finally{try{e||null==u.return||u.return()}finally{if(o)throw i}}return n}}(r,n)||function(r,n){if(r){if(\"string\"==typeof r)return t(r,n);var e=Object.prototype.toString.call(r).slice(8,-1);return\"Object\"===e&&r.constructor&&(e=r.constructor.name),\"Map\"===e||\"Set\"===e?Array.from(r):\"Arguments\"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?t(r,n):void 0}}(r,n)||function(){throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\")}()}function t(r,t){(null==t||t>r.length)&&(t=r.length);for(var n=0,e=new Array(t);n<t;n++)e[n]=r[n];return e}!function(){\"use strict\";var r,t=[];function n(){for(;t.length;)t[0](),t.shift()}function e(r){this.a=o,this.b=void 0,this.f=[];var t=this;try{r((function(r){a(t,r)}),(function(r){u(t,r)}))}catch(n){u(t,n)}}r=function(){setTimeout(n)};var o=2;function i(r){return new e((function(t){t(r)}))}function a(r,t){if(r.a==o){if(t==r)throw new TypeError;var n=!1;try{var e=t&&t.then;if(null!=t&&\"object\"==typeof t&&\"function\"==typeof e)return void e.call(t,(function(t){n||a(r,t),n=!0}),(function(t){n||u(r,t),n=!0}))}catch(i){return void(n||u(r,i))}r.a=0,r.b=t,f(r)}}function u(r,t){if(r.a==o){if(t==r)throw new TypeError;r.a=1,r.b=t,f(r)}}function f(n){!function(n){t.push(n),1==t.length&&r()}((function(){if(n.a!=o)for(;n.f.length;){var r=(i=n.f.shift())[0],t=i[1],e=i[2],i=i[3];try{0==n.a?e(\"function\"==typeof r?r.call(void 0,n.b):n.b):1==n.a&&(\"function\"==typeof t?e(t.call(void 0,n.b)):i(n.b))}catch(a){i(a)}}}))}e.prototype.g=function(r){return this.c(void 0,r)},e.prototype.c=function(r,t){var n=this;return new e((function(e,o){n.f.push([r,t,e,o]),f(n)}))},self.Promise||(self.Promise=e,self.Promise.resolve=i,self.Promise.reject=function(r){return new e((function(t,n){n(r)}))},self.Promise.race=function(r){return new e((function(t,n){for(var e=0;e<r.length;e+=1)i(r[e]).c(t,n)}))},self.Promise.all=function(r){return new e((function(t,n){function e(n){return function(e){a[n]=e,(o+=1)==r.length&&t(a)}}var o=0,a=[];0==r.length&&t(a);for(var u=0;u<r.length;u+=1)i(r[u]).c(e(u),n)}))},self.Promise.prototype.then=e.prototype.c,self.Promise.prototype.catch=e.prototype.g)}(),function(){\"use strict\";var t=function r(t){!function(r,t){if(!(r instanceof t))throw new TypeError(\"Cannot call a class as a function\")}(this,r),this.b=new Uint8Array(128),this.h=new Uint32Array(16),this.t=0,this.c=0,this.v=new Uint32Array(32),this.m=new Uint32Array(32),this.outlen=t};function n(r,t){return r[t]^r[t+1]<<8^r[t+2]<<16^r[t+3]<<24}function e(r,t,n,e,o,i,a,u){var f,s,c,l=t[a],h=t[a+1],y=t[u],v=t[u+1],p=r[n],w=r[n+1],g=r[e],b=r[e+1],m=r[o],d=r[o+1],A=r[i],_=r[i+1];c=_^(w=(w=w+b+((p&g|(p|g)&~(f=p+g))>>>31))+h+(((p=f)&l|(p|l)&~(f=p+l))>>>31)),g=(c=(b=(c=b^(d=d+(_=s=A^(p=f))+((m&(A=c)|(m|A)&~(f=m+A))>>>31)))>>>24^(s=g^(m=f))<<8)^(d=d+(_=(c=_^(w=(w=w+b+((p&(g=s>>>24^c<<8)|(p|g)&~(f=p+g))>>>31))+v+(((p=f)&y|(p|y)&~(f=p+y))>>>31)))>>>16^(s=A^(p=f))<<16)+((m&(A=s>>>16^c<<16)|(m|A)&~(f=m+A))>>>31)))>>>31^(s=g^(m=f))<<1,b=s>>>31^c<<1,r[n]=p,r[n+1]=w,r[e]=g,r[e+1]=b,r[o]=m,r[o+1]=d,r[i]=A,r[i+1]=_}var o,i,a=[4089235720,1779033703,2227873595,3144134277,4271175723,1013904242,1595750129,2773480762,2917565137,1359893119,725511199,2600822924,4215389547,528734635,327033209,1541459225],u=[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,28,20,8,16,18,30,26,12,2,24,0,4,22,14,10,6,22,16,24,0,10,4,30,26,20,28,6,12,14,2,18,8,14,18,6,2,26,24,22,28,4,12,10,20,8,0,30,16,18,0,10,14,4,8,20,30,28,2,22,24,12,16,6,26,4,24,12,20,0,22,16,6,8,26,14,10,30,28,2,18,24,10,2,30,28,26,8,20,0,14,12,6,18,4,16,22,26,22,14,28,24,2,6,18,10,0,30,8,16,12,4,20,12,30,28,18,22,6,0,16,24,4,26,14,2,8,20,10,20,4,16,8,14,12,2,10,30,22,18,28,6,24,26,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,28,20,8,16,18,30,26,12,2,24,0,4,22,14,10,6];function f(r,t){for(var o=r.v,i=r.m,f=0;f<16;f++)o[f]=r.h[f],o[f+16]=a[f];o[24]=o[24]^r.t,o[25]=o[25]^r.t/4294967296,t&&(o[28]=~o[28],o[29]=~o[29]);for(var s=0;s<32;s++)i[s]=n(r.b,4*s);for(var c=0;c<12;c++)e(o,i,0,8,16,24,u[16*c+0],u[16*c+1]),e(o,i,2,10,18,26,u[16*c+2],u[16*c+3]),e(o,i,4,12,20,28,u[16*c+4],u[16*c+5]),e(o,i,6,14,22,30,u[16*c+6],u[16*c+7]),e(o,i,0,10,20,30,u[16*c+8],u[16*c+9]),e(o,i,2,12,22,24,u[16*c+10],u[16*c+11]),e(o,i,4,14,16,26,u[16*c+12],u[16*c+13]),e(o,i,6,8,18,28,u[16*c+14],u[16*c+15]);for(var l=0;l<16;l++)r.h[l]=r.h[l]^o[l]^o[l+16]}function s(r,t){for(var n=0;n<16;n++)r.h[n]=a[n];r.b.set(t),r.h[0]^=16842752^r.outlen}function c(r,n,e){if(128!=r.length)throw Error(\"Invalid input\");var o=r.buffer,i=new DataView(o),a=new t(32);a.t=128;for(var u=i.getUint32(124,!0),c=u+e,l=u;l<c;l++)if(i.setUint32(124,l,!0),s(a,r),f(a,!0),a.h[0]<n)return 0==ASC_TARGET?new Uint8Array(a.h.buffer):Uint8Array.wrap(a.h.buffer);return new Uint8Array(0)}Uint8Array.prototype.slice||Object.defineProperty(Uint8Array.prototype,\"slice\",{value:function(r,t){return new Uint8Array(Array.prototype.slice.call(this,r,t))}}),self.ASC_TARGET=0;var l=new Promise((function(r){return i=r})),h=!1;self.onerror=function(r){self.postMessage({type:\"error\",message:JSON.stringify(r)})},self.onmessage=function(t){return new Promise((function(n,e){var a,u,f,s;s=(f=t.data).type;var y,v=function(){try{return n()}catch(r){return e(r)}},p=function(r){try{return setTimeout((function(){throw r})),v()}catch(t){return e(t)}};try{var w,g=function(){return v()};if(\"module\"===s)return Promise.resolve((y=f.module,new Promise((function(r,t){var n,e,o;return Promise.resolve(function(r){return new Promise((function(t,n){var e,o;return e={env:{abort:function(){throw Error(\"Wasm aborted\")}}},Promise.resolve(WebAssembly.instantiate(r,e)).then((function(r){try{return o=function(r){var t={},n=r.exports,e=n.memory,o=n.__alloc,i=n.__retain,a=n.__rtti_base||-1;return t.__allocArray=function(r,t){var n=function(r){return new Uint32Array(e.buffer)[(a+4>>>2)+2*r]}(r),u=31-Math.clz32(n>>>6&31),f=t.length,s=o(f<<u,0),c=o(12,r),l=new Uint32Array(e.buffer);l[c+0>>>2]=i(s),l[c+4>>>2]=s,l[c+8>>>2]=f<<u;var h=e.buffer,y=new Uint8Array(h);if(16384&n)for(var v=0;v<f;++v)y[(s>>>u)+v]=i(t[v]);else y.set(t,s>>>u);return c},t.__getUint8Array=function(r){var t=new Uint32Array(e.buffer),n=t[r+4>>>2];return new Uint8Array(e.buffer,n,t[n-4>>>2]>>>0)},function(r){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.__argumentsLength?function(t){r.__argumentsLength.value=t}:r.__setArgumentsLength||r.__setargc||function(){return{}},e=function(e){if(!Object.prototype.hasOwnProperty.call(r,e))return\"continue\";var o=r[e],i=e.split(\".\")[0];\"function\"==typeof o&&o!==n?(t[i]=function(){return n(arguments.length),o.apply(void 0,arguments)}).original=o:t[i]=o};for(var o in r)e(o);return t}(n,t)}(r),t({exports:o})}catch(e){return n(e)}}),n)}))}(y)).then((function(i){try{return e=(n=i).exports.__retain(n.exports.__allocArray(n.exports.Uint8Array_ID,new Uint8Array(128))),o=n.exports.__getUint8Array(e),r((function(r,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:4294967295;o.set(r);var a=n.exports.solveBlake2b(e,t,i);o=n.exports.__getUint8Array(e);var u=n.exports.__getUint8Array(a);return n.exports.__release(a),[o,u]}))}catch(a){return t(a)}}),t)})))).then(function(r){try{return w=r,self.postMessage({type:\"ready\",solver:2}),o=2,i(w),g.call(this)}catch(t){return p(t)}}.bind(this),p);var b,m=function(){return g.call(this)};if(\"js\"===s)return Promise.resolve(new Promise((function(r){return r((function(r,t){return[r,c(r,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:4294967295)]}))}))).then(function(r){try{return b=r,self.postMessage({type:\"ready\",solver:1}),o=1,i(b),m.call(this)}catch(t){return p(t)}}.bind(this),p);var d,A,_,U,P,x,T,j=function(){return m.call(this)};return\"start\"===s?h?n():(h=!0,Promise.resolve(l).then(function(t){try{for(d=t,self.postMessage({type:\"started\"}),A=Date.now(),_=0,U=function(r,t){for(var n=[],e=0;e<t;e++){var o=new Uint8Array(128);o.set(r),o[120]=e,n.push(o)}return n}(f.buffer,f.n),P=new Uint8Array(8*f.n),a=0;a<U.length;a++){var n=Date.now(),e=void 0;for(u=0;u<256;u++){U[a][123]=u;var i=r(d(U[a],f.threshold),2),s=i[0];if(0!==i[1].length){e=s;break}console.warn(\"FC: Internal error or no solution found\")}var c=new DataView(e.slice(-4).buffer).getUint32(0,!0),l=(Date.now()-n)/1e3;_+=c,P.set(e.slice(-8),8*a),self.postMessage({type:\"progress\",n:f.n,h:c,t:l,i:a})}return x=(Date.now()-A)/1e3,T={type:\"done\",solution:P,h:_,t:x,diagnostics:(h=o,y=x,v=new Uint8Array(3),w=new DataView(v.buffer),w.setUint8(0,h),w.setUint16(1,y),v),solver:o},self.postMessage(T),j.call(this)}catch(g){return p(g)}var h,y,v,w}.bind(this),p)):j.call(this)}catch(S){p(S)}}))}}()}(\"undefined\"==typeof frcWorker?frcWorker={}:frcWorker);";
  var nav = navigator;
  var ua = nav.userAgent.toLowerCase();
  /**
   * Headless browser detection on the clientside is imperfect. One can modify any clientside code to disable or change this check,
   * and one can spoof whatever is checked here. However, that doesn't make it worthless: it's yet another hurdle for spammers and
   * it stops unsophisticated scripters from making any request whatsoever.
   */

  function isHeadless() {
    var correctPrototypes = true;

    try {
      correctPrototypes = PluginArray.prototype === nav.plugins.__proto__;
      if (nav.plugins.length > 0) correctPrototypes = correctPrototypes && Plugin.prototype === nav.plugins[0].__proto__;
    } catch (e) {
      /* Do nothing, this browser misbehaves in mysterious ways */
    }

    return (//tell-tale bot signs
      ua.indexOf("headless") !== -1 || nav.appVersion.indexOf("Headless") !== -1 || ua.indexOf("bot") !== -1 // http://www.useragentstring.com/pages/useragentstring.php?typ=Browser
      || ua.indexOf("crawl") !== -1 // Only IE5 has two distributions that has this on windows NT.. so yeah.
      || nav.webdriver === true || !nav.language || nav.languages !== undefined && !nav.languages.length // IE 11 does not support NavigatorLanguage.languages https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
      || !correctPrototypes
    );
  }
  /**
   * Maps a value between 0 and 255 to a difficulty threshold (as uint32)
   * Difficulty 0 maps to 99.99% probability of being right on the first attempt
   * Anything above 250 needs 2^32 tries on average to solve.
   * 150 to 180 seems reasonable
   */


  function difficultyToThreshold(value) {
    if (value > 255) {
      value = 255;
    } else if (value < 0) {
      value = 0;
    }

    return Math.pow(2, (255.999 - value) / 8.0) >>> 0;
  }

  var PUZZLE_EXPIRY_OFFSET = 13;
  var NUMBER_OF_PUZZLES_OFFSET = 14;
  var PUZZLE_DIFFICULTY_OFFSET = 15;

  function decodeBase64Puzzle(base64Puzzle) {
    var parts = base64Puzzle.split(".");
    var puzzle = parts[1];
    var arr = decode(puzzle);
    return {
      signature: parts[0],
      base64: puzzle,
      buffer: arr,
      n: arr[NUMBER_OF_PUZZLES_OFFSET],
      threshold: difficultyToThreshold(arr[PUZZLE_DIFFICULTY_OFFSET]),
      expiry: arr[PUZZLE_EXPIRY_OFFSET] * 300000
    };
  }

  function getPuzzle(url, siteKey) {
    return new Promise(function ($return, $error) {
      var urls;
      urls = url.split(",");
      var $Loop_5_trampoline, $Loop_5_local;

      function $Loop_5_step() {
        var _$Loop_5_local = $Loop_5_local(),
            _$Loop_5_local2 = _slicedToArray(_$Loop_5_local, 1),
            i = _$Loop_5_local2[0];

        i++;
        return $Loop_5.bind(this, i);
      }

      function $Loop_5(i) {
        $Loop_5_local = function $Loop_5_local() {
          return [i];
        };

        if (i < urls.length) {
          var response;
          return Promise.resolve(fetchAndRetryWithBackoff(url + "?sitekey=" + siteKey, {
            headers: [["x-frc-client", "js-0.8.4"]],
            mode: 'cors'
          }, 2)).then(function ($await_8) {
            try {
              var $If_7 = function $If_7() {
                return $Loop_5_step;
              };

              response = $await_8;

              if (response.ok) {
                var json;
                return Promise.resolve(response.json()).then(function ($await_9) {
                  try {
                    json = $await_9;
                    return $return(json.data.puzzle);
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }, $error);
              } else {
                var _json;

                var $Try_2_Post = function () {
                  try {
                    if (_json && _json.errors && _json.errors[0] === "endpoint_not_enabled") {
                      return $error(Error("Endpoint not allowed (".concat(response.status, ")")));
                    }

                    if (i === urls.length - 1) {
                      return $error(Error("Failure in getting puzzle: ".concat(response.status, " ").concat(response.statusText)));
                    }

                    return $If_7.call(this);
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                }.bind(this);

                var $Try_2_Catch = function $Try_2_Catch(e) {
                  /* Do nothing */
                  try {
                    return $Try_2_Post();
                  } catch ($boundEx) {
                    return $error($boundEx);
                  }
                };

                try {
                  return Promise.resolve(response.json()).then(function ($await_10) {
                    try {
                      _json = $await_10;
                      return $Try_2_Post();
                    } catch ($boundEx) {
                      return $Try_2_Catch($boundEx);
                    }
                  }, $Try_2_Catch);
                } catch (e) {
                  $Try_2_Catch(e);
                }
              }

              return $If_7.call(this);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        } else return [1];
      }

      return ($Loop_5_trampoline = function (q) {
        while (q) {
          if (q.then) return void q.then($Loop_5_trampoline, $error);

          try {
            if (q.pop) {
              if (q.length) return q.pop() ? $Loop_5_exit.call(this) : q;else q = $Loop_5_step;
            } else q = q.call(this);
          } catch (_exception) {
            return $error(_exception);
          }
        }
      }.bind(this))($Loop_5.bind(this, 0));

      function $Loop_5_exit() {
        // This code should never be reached.
        return $error(Error("Internal error"));
      }
    });
  }
  /**
   * Retries given request with exponential backoff (starting with 100ms delay, multiplying by 4 every time)
   * @param url Request (can be string url) to fetch
   * @param opts Options for fetch
   * @param n Number of times to attempt before giving up.
   */


  function fetchAndRetryWithBackoff(url, opts, n) {
    return new Promise(function ($return, $error) {
      var time = 500;
      return $return(fetch(url, opts).catch(function (error) {
        return new Promise(function ($return, $error) {
          if (n === 1) return $error(error);
          return Promise.resolve(new Promise(function (r) {
            return setTimeout(r, time);
          })).then(function ($await_11) {
            try {
              time *= 4;
              return $return(fetchAndRetryWithBackoff(url, opts, n - 1));
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }, $error);
        });
      }));
    });
  } // English


  var LANG_EN = {
    text_init: "Initializing..",
    text_ready: "Anti-Robot Verification",
    button_start: "Click to start verification",
    text_fetching: "Fetching Challenge",
    text_solving: "Verifying you are human..",
    text_completed: "I am human",
    text_expired: "Anti-Robot verification expired",
    button_restart: "Restart",
    text_error: "Verification failed:",
    button_retry: "Retry"
  }; // French

  var LANG_FR = {
    text_init: "Chargement..",
    text_ready: "Verification Anti-Robot",
    button_start: "Cliquez ici pour vérifier",
    text_fetching: "Chargement du challenge",
    text_solving: "Vérification que vous êtes humain..",
    text_completed: "Je suis humain",
    text_expired: "Verification échue",
    button_restart: "Recommencer",
    text_error: "Echec de verification:",
    button_retry: "Recommencer"
  }; // German

  var LANG_DE = {
    text_init: "Initialisierung..",
    text_ready: "Anti-Roboter-Verifizierung",
    button_start: "Hier klicken",
    text_fetching: "Herausforderung laden..",
    text_solving: "Verifizierung, dass Sie ein Mensch sind..",
    text_completed: "Ich bin ein Mensch",
    text_expired: "Verifizierung abgelaufen",
    button_restart: "Erneut starten",
    text_error: "Verifizierung fehlgeschlagen:",
    button_retry: "Erneut versuchen"
  }; // Dutch

  var LANG_NL = {
    text_init: "Initializeren..",
    text_ready: "Anti-robotverificatie",
    button_start: "Klik om te starten",
    text_fetching: "Aan het laden..",
    text_solving: "Anti-robotverificatie bezig..",
    text_completed: "Ik ben een mens",
    text_expired: "Verificatie verlopen",
    button_restart: "Opnieuw starten",
    text_error: "Verificatie mislukt:",
    button_retry: "Opnieuw proberen"
  }; // Italian

  var LANG_IT = {
    text_init: "Inizializzazione...",
    text_ready: "Verifica Anti-Robot",
    button_start: "Clicca per iniziare",
    text_fetching: "Caricamento...",
    text_solving: "Verificando che sei umano...",
    text_completed: "Non sono un robot",
    text_expired: "Verifica Anti-Robot scaduta",
    button_restart: "Ricomincia",
    text_error: "Verifica fallita:",
    button_retry: "Riprova"
  };
  var localizations = {
    en: LANG_EN,
    de: LANG_DE,
    nl: LANG_NL,
    fr: LANG_FR,
    it: LANG_IT
  };
  var PUZZLE_ENDPOINT_URL = "https://api.friendlycaptcha.com/api/v1/puzzle";
  var URL = window.URL || window.webkitURL;

  var WidgetInstance = /*#__PURE__*/function () {
    function WidgetInstance(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, WidgetInstance);

      this.worker = null;
      /**
       * The captcha has been succesfully solved.
       */

      this.valid = false;
      /**
       * Some errors may cause a need for the (worker) to be reinitialized. If this is
       * true `init` will be called again when start is called.
       */

      this.needsReInit = false;
      /**
       * Start() has been called at least once ever.
       */

      this.hasBeenStarted = false;
      this.hasBeenDestroyed = false;
      this.opts = Object.assign({
        forceJSFallback: false,
        startMode: "focus",
        puzzleEndpoint: element.dataset["puzzleEndpoint"] || PUZZLE_ENDPOINT_URL,
        startedCallback: function startedCallback() {
          return 0;
        },
        readyCallback: function readyCallback() {
          return 0;
        },
        doneCallback: function doneCallback() {
          return 0;
        },
        errorCallback: function errorCallback() {
          return 0;
        },
        sitekey: element.dataset["sitekey"] || "",
        language: element.dataset["lang"] || "en",
        solutionFieldName: element.dataset["solutionFieldName"] || "frc-captcha-solution"
      }, options);
      this.e = element; // Load language

      if (typeof this.opts.language === "string") {
        var l = localizations[this.opts.language.toLowerCase()];

        if (l === undefined) {
          console.error("FriendlyCaptcha: language \"" + this.opts.language + "\" not found."); // Fall back to English

          l = localizations.en;
        }

        this.lang = l;
      } else {
        // We assign to a copy of the English language localization, so that any missing values will be English
        this.lang = Object.assign(Object.assign({}, localizations.en), this.opts.language);
      }

      element.innerText = this.lang.text_init;
      injectStyle();
      this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
    }

    _createClass(WidgetInstance, [{
      key: "init",
      value: function init(forceStart) {
        var _this = this;

        if (this.hasBeenDestroyed) {
          console.error("FriendlyCaptcha widget has been destroyed using destroy(), it can not be used anymore.");
          return;
        }

        this.initWorker();
        this.setupSolver();

        if (forceStart) {
          this.start();
        } else if (this.e.dataset["start"] !== "none" && (this.opts.startMode === "focus" || this.e.dataset["start"] === "focus")) {
          var form = findParentFormElement(this.e);

          if (form) {
            executeOnceOnFocusInEvent(form, function () {
              if (!_this.hasBeenStarted) {
                _this.start();
              }
            });
          } else {
            console.log("FriendlyCaptcha div seems not to be contained in a form, autostart will not work");
          }
        }
      }
      /**
       * Compile the WASM and send the compiled module to the webworker.
       * If WASM support is not present, it tells the webworker to initialize the JS solver instead.
       */

    }, {
      key: "setupSolver",
      value: function setupSolver() {
        return new Promise(function ($return, $error) {
          if (this.opts.forceJSFallback) {
            this.worker.postMessage({
              type: "js"
            });
            return $return();
          }

          var $Try_3_Post = function $Try_3_Post() {
            try {
              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          };

          var $Try_3_Catch = function (e) {
            try {
              console.log("FriendlyCaptcha failed to initialize WebAssembly, falling back to Javascript solver: " + e.toString());
              this.worker.postMessage({
                type: "js"
              });
              return $Try_3_Post();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this);

          try {
            var module;
            module = WebAssembly.compile(decode(base64));
            return Promise.resolve(module).then(function ($await_12) {
              try {
                this.worker.postMessage({
                  type: "module",
                  module: $await_12
                });
                return $Try_3_Post();
              } catch ($boundEx) {
                return $Try_3_Catch($boundEx);
              }
            }.bind(this), $Try_3_Catch);
          } catch (e) {
            $Try_3_Catch(e);
          }
        }.bind(this));
      }
      /**
       * Add a listener to the button that calls `this.start` on click.
       */

    }, {
      key: "makeButtonStart",
      value: function makeButtonStart() {
        var _this2 = this;

        var b = this.e.querySelector("button");

        if (b) {
          b.addEventListener("click", function (e) {
            return _this2.start();
          }, {
            once: true,
            passive: true
          });
          b.addEventListener("touchstart", function (e) {
            return _this2.start();
          }, {
            once: true,
            passive: true
          });
        }
      }
    }, {
      key: "onWorkerError",
      value: function onWorkerError(e) {
        this.needsReInit = true;
        this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Background worker error " + e.message);
        this.makeButtonStart(); // Just out of precaution

        this.opts.forceJSFallback = true;
      }
    }, {
      key: "initWorker",
      value: function initWorker() {
        var _this3 = this;

        if (this.worker) this.worker.terminate();
        var workerBlob = new Blob([workerString], {
          type: "text/javascript"
        });
        this.worker = new Worker(URL.createObjectURL(workerBlob));

        this.worker.onerror = function (e) {
          return _this3.onWorkerError(e);
        };

        this.worker.onmessage = function (e) {
          if (_this3.hasBeenDestroyed) return;
          var data = e.data;
          if (!data) return;

          if (data.type === "progress") {
            updateProgressBar(_this3.e, data);
          } else if (data.type === "ready") {
            _this3.e.innerHTML = getReadyHTML(_this3.opts.solutionFieldName, _this3.lang);

            _this3.makeButtonStart();

            _this3.opts.readyCallback();
          } else if (data.type === "started") {
            _this3.e.innerHTML = getRunningHTML(_this3.opts.solutionFieldName, _this3.lang);

            _this3.opts.startedCallback();
          } else if (data.type === "done") {
            var solutionPayload = _this3.handleDone(data);

            _this3.opts.doneCallback(solutionPayload);

            var callback = _this3.e.dataset["callback"];

            if (callback) {
              window[callback](solutionPayload);
            }
          } else if (data.type === "error") {
            _this3.onWorkerError(data);
          }
        };
      }
    }, {
      key: "expire",
      value: function expire() {
        this.e.innerHTML = getExpiredHTML(this.opts.solutionFieldName, this.lang);
        this.makeButtonStart();
      }
    }, {
      key: "start",
      value: function start() {
        return new Promise(function ($return, $error) {
          var sitekey;

          if (this.hasBeenDestroyed) {
            console.error("Can not start FriendlyCaptcha widget which has been destroyed");
            return $return();
          }

          this.hasBeenStarted = true;
          sitekey = this.opts.sitekey || this.e.dataset["sitekey"];

          if (!sitekey) {
            console.error("FriendlyCaptcha: sitekey not set on frc-captcha element");
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Website problem: sitekey not set", false);
            return $return();
          }

          if (isHeadless()) {
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Browser check failed, try a different browser", false);
            return $return();
          }

          if (this.needsReInit) {
            this.needsReInit = false;
            this.init(true);
            return $return();
          }

          var $Try_4_Post = function () {
            try {
              this.worker.postMessage({
                type: "start",
                buffer: this.puzzle.buffer,
                n: this.puzzle.n,
                threshold: this.puzzle.threshold
              });
              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this);

          var $Try_4_Catch = function (e) {
            try {
              {
                this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, e.toString());
                this.makeButtonStart();
                var code;
                code = "error_getting_puzzle";
                this.opts.errorCallback({
                  code: code,
                  description: e.toString(),
                  error: e
                });
                var callback;
                callback = this.e.dataset["callback-error"];

                if (callback) {
                  window[callback](this);
                }

                return $return();
              }
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this);

          try {
            this.e.innerHTML = getFetchingHTML(this.opts.solutionFieldName, this.lang);
            return Promise.resolve(getPuzzle(this.opts.puzzleEndpoint, sitekey)).then(function ($await_13) {
              var _this4 = this;

              try {
                this.puzzle = decodeBase64Puzzle($await_13);
                setTimeout(function () {
                  return _this4.expire();
                }, this.puzzle.expiry - 30000); // 30s grace

                return $Try_4_Post();
              } catch ($boundEx) {
                return $Try_4_Catch($boundEx);
              }
            }.bind(this), $Try_4_Catch);
          } catch (e) {
            $Try_4_Catch(e);
          }
        }.bind(this));
      }
      /**
       * This is to be called when the puzzle has been succesfully completed.
       * Here the hidden field gets updated with the solution.
       * @param data message from the webworker
       */

    }, {
      key: "handleDone",
      value: function handleDone(data) {
        this.valid = true;
        var puzzleSolutionMessage = "".concat(this.puzzle.signature, ".").concat(this.puzzle.base64, ".").concat(encode(data.solution), ".").concat(encode(data.diagnostics));
        this.e.innerHTML = getDoneHTML(this.opts.solutionFieldName, this.lang, puzzleSolutionMessage, data);
        if (this.worker) this.worker.terminate(); // this.worker = null; // This literally crashes very old browsers..

        this.needsReInit = true;
        return puzzleSolutionMessage;
      }
      /**
       * Cleans up the widget entirely, removing any DOM elements and terminating any background workers.
       * After it is destroyed it can no longer be used for any purpose.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.needsReInit = false;
        this.hasBeenStarted = false;

        if (this.e) {
          this.e.remove();
          delete this.e;
        }

        this.hasBeenDestroyed = true;
      }
      /**
       * Resets the widget to the initial state.
       * This is useful in situations where the page does not refresh when you submit and the form may be re-submitted again
       */

    }, {
      key: "reset",
      value: function reset() {
        if (this.hasBeenDestroyed) {
          console.error("FriendlyCaptcha widget has been destroyed, it can not be used anymore");
          return;
        }

        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.needsReInit = false;
        this.hasBeenStarted = false;
        this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
      }
    }]);

    return WidgetInstance;
  }();

  var fc = window.friendlyChallenge;
  var autoWidget = fc ? fc.autoWidget : null;
  var elements = findCaptchaElements();

  for (var index = 0; index < elements.length; index++) {
    var hElement = elements[index];

    if (hElement && !hElement.dataset["attached"]) {
      autoWidget = new WidgetInstance(hElement);
      hElement.dataset["attached"] = "1";
    }
  } // @ts-ignore


  window.friendlyChallenge = {
    WidgetInstance: WidgetInstance,
    autoWidget: autoWidget
  };
})();
