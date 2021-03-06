var css = '.frc-captcha *{margin:0;padding:0;border:0;text-align:initial;border-radius:px;filter:none!important;transition:none!important;font-weight:400;font-size:14px;line-height:1.35;text-decoration:none;background-color:initial;color:#222}.frc-captcha{position:relative;width:312px;border:1px solid #f4f4f4;padding-bottom:12px;background-color:#fff}.frc-container{display:flex;align-items:center;min-height:52px}.frc-icon{fill:#222;stroke:#222;flex-shrink:0;margin:8px 8px 0}.frc-icon.frc-warning{fill:#c00}.frc-content{white-space:nowrap;display:flex;flex-direction:column;margin:4px 6px 0 0;overflow-x:auto;flex-grow:1}.frc-banner{position:absolute;bottom:0;right:6px;line-height:1}.frc-banner *{font-size:10px;opacity:.8}.frc-banner b{font-weight:700}.frc-progress{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:3px 0;height:4px;border:none;background-color:#eee;color:#222;width:100%;transition:.5s linear}.frc-progress::-webkit-progress-bar{background:#eee}.frc-progress::-webkit-progress-value{background:#222}.frc-progress::-moz-progress-bar{background:#222}.frc-button{cursor:pointer;padding:2px 6px;background-color:#f1f1f1;border:1px solid transparent;text-align:center;font-weight:600;text-transform:none}.frc-button:focus{border:1px solid #333}.frc-button:hover{background-color:#ddd}.dark.frc-captcha{color:#fff;background-color:#222;border-color:#333}.dark.frc-captcha *{color:#fff}.dark.frc-captcha button{background-color:#444}.dark .frc-icon{fill:#fff;stroke:#fff}.dark .frc-progress{background-color:#444}.dark .frc-progress::-webkit-progress-bar{background:#444}.dark .frc-progress::-webkit-progress-value{background:#ddd}.dark .frc-progress::-moz-progress-bar{background:#ddd}';

// This is not an enum to save some bytes in the output bundle.
const SOLVER_TYPE_JS = 1;

// @ts-ignore
const loaderSVG = `<circle cx="12" cy="12" r="8" stroke-width="3" stroke-dasharray="15 10" fill="none" stroke-linecap="round" transform="rotate(0 12 12)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.9s" values="0 12 12;360 12 12"/></circle>`;
const errorSVG = `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`;
/**
 * Base template used for all widget states
 * The reason we use raw string interpolation here is so we don't have to ship something like lit-html.
 */
function getTemplate(fieldName, svgContent, textContent, solutionString, buttonText, progress = false, debugData) {
    return `<div class="frc-container">
<svg class="frc-icon" role="img" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 24 24">${svgContent}</svg>
<div class="frc-content">
    <span class="frc-text" ${debugData ? `title="${debugData}"` : ``}>${textContent}</span>
    ${buttonText ? `<button type="button" class="frc-button">${buttonText}</button>` : ''}
    ${progress ? `<progress class="frc-progress" value="0">0%</progress>` : ''}
</div>
</div><span class="frc-banner"><a href="https://friendlycaptcha.com/" rel="noopener" style="text-decoration:none;" target="_blank"><b>Friendly</b>Captcha ???</a></span>
<input name="${fieldName}" class="frc-captcha-solution" style="display: none;" type="hidden" value="${solutionString}">`;
}
/**
 * Used when the widget is ready to start solving.
 */
function getReadyHTML(fieldName, l) {
    return getTemplate(fieldName, `<path d="M17,11c0.34,0,0.67,0.04,1,0.09V6.27L10.5,3L3,6.27v4.91c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55 C11.41,19.47,11,18.28,11,17C11,13.69,13.69,11,17,11z"/><path d="M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38"/>`, l.text_ready, ".UNSTARTED", l.button_start, false);
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
    const timeData = `Completed: ${data.t.toFixed(0)}s (${(data.h / data.t * 0.001).toFixed(0)}K/s)${data.solver === SOLVER_TYPE_JS ? " JS Fallback" : ""}`;
    return getTemplate(fieldName, `<title>${timeData}</title><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"><animate attributeName="opacity" dur="1.0s" values="0;1"/></path>`, l.text_completed, solution, undefined, false, timeData);
}
function getExpiredHTML(fieldName, l) {
    return getTemplate(fieldName, errorSVG, l.text_expired, ".EXPIRED", l.button_restart);
}
function getErrorHTML(fieldName, l, errorDescription, recoverable = true) {
    return getTemplate(fieldName, errorSVG, l.text_error + " " + errorDescription, ".ERROR", recoverable ? l.button_retry : undefined);
}
function findCaptchaElements() {
    const elements = document.querySelectorAll(".frc-captcha");
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
        const styleSheet = document.createElement("style");
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
    const p = element.querySelector(".frc-progress");
    const perc = (data.i + 1) / data.n;
    if (p) {
        p.value = perc;
        p.innerText = perc.toFixed(2) + "%";
        p.title = (data.i + 1) + "/" + data.n + " (" + (data.h / data.t * 0.001).toFixed(0) + "K/s)";
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
    element.addEventListener("focusin", listener, { once: true, passive: true });
}

// WARNING: This file was autogenerated by wasmwrap and should not be edited manually.

const base64 = "AGFzbQEAAAABKghgAABgAn9/AGADf39/AX9gAX8AYAR/f39/AGAAAX9gAX8Bf2ACf38BfwINAQNlbnYFYWJvcnQABAMMCwcGAwAAAQIFAQIABQMBAAEGFgR/AUEAC38BQQALfwBBAwt/AEHgDAsHbgkGbWVtb3J5AgAHX19hbGxvYwABCF9fcmV0YWluAAIJX19yZWxlYXNlAAMJX19jb2xsZWN0AAQHX19yZXNldAAFC19fcnR0aV9iYXNlAwMNVWludDhBcnJheV9JRAMCDHNvbHZlQmxha2UyYgAKCAELCvgSC5IBAQV/IABB8P///wNLBEAACyMBQRBqIgQgAEEPakFwcSICQRAgAkEQSxsiBmoiAj8AIgVBEHQiA0sEQCAFIAIgA2tB//8DakGAgHxxQRB2IgMgBSADShtAAEEASARAIANAAEEASARAAAsLCyACJAEgBEEQayICIAY2AgAgAkEBNgIEIAIgATYCCCACIAA2AgwgBAsEACAACwMAAQsDAAELBgAjACQBC7sCAQF/AkAgAUUNACAAQQA6AAAgACABakEEayICQQA6AAMgAUECTQ0AIABBADoAASAAQQA6AAIgAkEAOgACIAJBADoAASABQQZNDQAgAEEAOgADIAJBADoAACABQQhNDQAgAEEAIABrQQNxIgJqIgBBADYCACAAIAEgAmtBfHEiAmpBHGsiAUEANgIYIAJBCE0NACAAQQA2AgQgAEEANgIIIAFBADYCECABQQA2AhQgAkEYTQ0AIABBADYCDCAAQQA2AhAgAEEANgIUIABBADYCGCABQQA2AgAgAUEANgIEIAFBADYCCCABQQA2AgwgACAAQQRxQRhqIgFqIQAgAiABayEBA0AgAUEgTwRAIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGCABQSBrIQEgAEEgaiEADAELCwsLcgACfyAARQRAQQxBAhABIQALIAALQQA2AgAgAEEANgIEIABBADYCCCABQfD///8DIAJ2SwRAQcAKQfAKQRJBORAAAAsgASACdCIBQQAQASICIAEQBiAAKAIAGiAAIAI2AgAgACACNgIEIAAgATYCCCAAC88BAQJ/QaABQQAQASIAQQxBAxABQYABQQAQBzYCACAAQQxBBBABQQhBAxAHNgIEIABCADcDCCAAQQA2AhAgAEIANwMYIABC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";

// Adapted from the base64-arraybuffer package implementation
// (https://github.com/niklasvh/base64-arraybuffer, MIT licensed)
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const EQ_CHAR = "=".charCodeAt(0);
// Use a lookup table to find the index.
const lookup = new Uint8Array(256);
for (let i = 0; i < CHARS.length; i++) {
    lookup[CHARS.charCodeAt(i)] = i;
}
function encode(bytes) {
    const len = bytes.length;
    let base64 = "";
    for (let i = 0; i < len; i += 3) {
        const b0 = bytes[i + 0];
        const b1 = bytes[i + 1];
        const b2 = bytes[i + 2];
        base64 += CHARS.charAt(b0 >>> 2);
        base64 += CHARS.charAt(((b0 & 3) << 4) | (b1 >>> 4));
        base64 += CHARS.charAt(((b1 & 15) << 2) | (b2 >>> 6));
        base64 += CHARS.charAt(b2 & 63);
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
    }
    else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
    }
    return base64;
}
function decode(base64) {
    const len = base64.length;
    let bufferLength = len * 3 >>> 2; // * 0.75
    if (base64.charCodeAt(len - 1) === EQ_CHAR)
        bufferLength--;
    if (base64.charCodeAt(len - 2) === EQ_CHAR)
        bufferLength--;
    const bytes = new Uint8Array(bufferLength);
    for (let i = 0, p = 0; i < len; i += 4) {
        const encoded1 = lookup[base64.charCodeAt(i + 0)];
        const encoded2 = lookup[base64.charCodeAt(i + 1)];
        const encoded3 = lookup[base64.charCodeAt(i + 2)];
        const encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return bytes;
}

var workerString = "!function(){\"use strict\";function t(t){const e={},r=t.exports,n=r.memory,s=r.__alloc,o=r.__retain,a=r.__rtti_base||-1;return e.__allocArray=(t,e)=>{const r=function(t){return new Uint32Array(n.buffer)[(a+4>>>2)+2*t]}(t),i=31-Math.clz32(r>>>6&31),c=e.length,f=s(c<<i,0),l=s(12,t),u=new Uint32Array(n.buffer);u[l+0>>>2]=o(f),u[l+4>>>2]=f,u[l+8>>>2]=c<<i;const y=n.buffer,p=new Uint8Array(y);if(16384&r)for(let t=0;t<c;++t)p[(f>>>i)+t]=o(e[t]);else p.set(e,f>>>i);return l},e.__getUint8Array=t=>{const e=new Uint32Array(n.buffer),r=e[t+4>>>2];return new Uint8Array(n.buffer,r,e[r-4>>>2]>>>0)},function(t,e={}){const r=t.__argumentsLength?e=>{t.__argumentsLength.value=e}:t.__setArgumentsLength||t.__setargc||(()=>({}));for(const n in t){if(!Object.prototype.hasOwnProperty.call(t,n))continue;const s=t[n],o=n.split(\".\")[0];\"function\"==typeof s&&s!==r?(e[o]=(...t)=>(r(t.length),s(...t))).original=s:e[o]=s}return e}(r,e)}class e{constructor(t){this.b=new Uint8Array(128),this.h=new Uint32Array(16),this.t=0,this.c=0,this.v=new Uint32Array(32),this.m=new Uint32Array(32),this.outlen=t}}function r(t,e){return t[e]^t[e+1]<<8^t[e+2]<<16^t[e+3]<<24}function n(t,e,r,n,s,o,a,i){const c=e[a],f=e[a+1],l=e[i],u=e[i+1];let y,p,w,h,_=t[r],A=t[r+1],g=t[n],U=t[n+1],b=t[s],m=t[s+1],d=t[o],v=t[o+1];y=_+g,p=(_&g|(_|g)&~y)>>>31,_=y,A=A+U+p,y=_+c,p=(_&c|(_|c)&~y)>>>31,_=y,A=A+f+p,w=d^_,h=v^A,d=h,v=w,y=b+d,p=(b&d|(b|d)&~y)>>>31,b=y,m=m+v+p,w=g^b,h=U^m,g=w>>>24^h<<8,U=h>>>24^w<<8,y=_+g,p=(_&g|(_|g)&~y)>>>31,_=y,A=A+U+p,y=_+l,p=(_&l|(_|l)&~y)>>>31,_=y,A=A+u+p,w=d^_,h=v^A,d=w>>>16^h<<16,v=h>>>16^w<<16,y=b+d,p=(b&d|(b|d)&~y)>>>31,b=y,m=m+v+p,w=g^b,h=U^m,g=h>>>31^w<<1,U=w>>>31^h<<1,t[r]=_,t[r+1]=A,t[n]=g,t[n+1]=U,t[s]=b,t[s+1]=m,t[o]=d,t[o+1]=v}const s=[4089235720,1779033703,2227873595,3144134277,4271175723,1013904242,1595750129,2773480762,2917565137,1359893119,725511199,2600822924,4215389547,528734635,327033209,1541459225],o=[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,28,20,8,16,18,30,26,12,2,24,0,4,22,14,10,6,22,16,24,0,10,4,30,26,20,28,6,12,14,2,18,8,14,18,6,2,26,24,22,28,4,12,10,20,8,0,30,16,18,0,10,14,4,8,20,30,28,2,22,24,12,16,6,26,4,24,12,20,0,22,16,6,8,26,14,10,30,28,2,18,24,10,2,30,28,26,8,20,0,14,12,6,18,4,16,22,26,22,14,28,24,2,6,18,10,0,30,8,16,12,4,20,12,30,28,18,22,6,0,16,24,4,26,14,2,8,20,10,20,4,16,8,14,12,2,10,30,22,18,28,6,24,26,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,28,20,8,16,18,30,26,12,2,24,0,4,22,14,10,6];function a(t,e){const a=t.v,i=t.m;for(let e=0;e<16;e++)a[e]=t.h[e],a[e+16]=s[e];a[24]=a[24]^t.t,a[25]=a[25]^t.t/4294967296,e&&(a[28]=~a[28],a[29]=~a[29]);for(let e=0;e<32;e++)i[e]=r(t.b,4*e);for(let t=0;t<12;t++)n(a,i,0,8,16,24,o[16*t+0],o[16*t+1]),n(a,i,2,10,18,26,o[16*t+2],o[16*t+3]),n(a,i,4,12,20,28,o[16*t+4],o[16*t+5]),n(a,i,6,14,22,30,o[16*t+6],o[16*t+7]),n(a,i,0,10,20,30,o[16*t+8],o[16*t+9]),n(a,i,2,12,22,24,o[16*t+10],o[16*t+11]),n(a,i,4,14,16,26,o[16*t+12],o[16*t+13]),n(a,i,6,8,18,28,o[16*t+14],o[16*t+15]);for(let e=0;e<16;e++)t.h[e]=t.h[e]^a[e]^a[e+16]}function i(t,e){for(let e=0;e<16;e++)t.h[e]=s[e];t.b.set(e),t.h[0]^=16842752^t.outlen}function c(t,e){const r=new Uint8Array(3),n=new DataView(r.buffer);return n.setUint8(0,t),n.setUint16(1,e),r}let f,l;Uint8Array.prototype.slice||Object.defineProperty(Uint8Array.prototype,\"slice\",{value:function(t,e){return new Uint8Array(Array.prototype.slice.call(this,t,e))}}),self.ASC_TARGET=0;let u=new Promise((t=>l=t)),y=!1;self.onerror=t=>{self.postMessage({type:\"error\",message:JSON.stringify(t)})},self.onmessage=async r=>{const n=r.data,s=n.type;try{if(\"module\"===s){const e=await async function(e){const r=await async function(e){const r={env:{abort(){throw Error(\"Wasm aborted\")}}};return{exports:t(await WebAssembly.instantiate(e,r))}}(e),n=r.exports.__retain(r.exports.__allocArray(r.exports.Uint8Array_ID,new Uint8Array(128)));let s=r.exports.__getUint8Array(n);return(t,e,o=4294967295)=>{s.set(t);const a=r.exports.solveBlake2b(n,e,o);s=r.exports.__getUint8Array(n);const i=r.exports.__getUint8Array(a);return r.exports.__release(a),[s,i]}}(n.module);self.postMessage({type:\"ready\",solver:2}),f=2,l(e)}else if(\"js\"===s){const t=await async function(){return(t,r,n=4294967295)=>[t,function(t,r,n){if(128!=t.length)throw Error(\"Invalid input\");const s=t.buffer,o=new DataView(s),c=new e(32);c.t=128;const f=o.getUint32(124,!0),l=f+n;for(let e=f;e<l;e++)if(o.setUint32(124,e,!0),i(c,t),a(c,!0),c.h[0]<r)return 0==ASC_TARGET?new Uint8Array(c.h.buffer):Uint8Array.wrap(c.h.buffer);return new Uint8Array(0)}(t,r,n)]}();self.postMessage({type:\"ready\",solver:1}),f=1,l(t)}else if(\"start\"===s){if(y)return;y=!0;const t=await u;self.postMessage({type:\"started\"});let e=Date.now(),r=0;const s=function(t,e){const r=[];for(let n=0;n<e;n++){const e=new Uint8Array(128);e.set(t),e[120]=n,r.push(e)}return r}(n.buffer,n.n),a=new Uint8Array(8*n.n);for(var o=0;o<s.length;o++){const e=Date.now();let i;for(var p=0;p<256;p++){s[o][123]=p;const[e,r]=t(s[o],n.threshold);if(0!==r.length){i=e;break}console.warn(\"FC: Internal error or no solution found\")}const c=new DataView(i.slice(-4).buffer).getUint32(0,!0),f=(Date.now()-e)/1e3;r+=c,a.set(i.slice(-8),8*o),self.postMessage({type:\"progress\",n:n.n,h:c,t:f,i:o})}const i=(Date.now()-e)/1e3,l={type:\"done\",solution:a,h:r,t:i,diagnostics:c(f,i),solver:f};self.postMessage(l)}}catch(t){setTimeout((()=>{throw t}))}}}();";

const nav = navigator;
const ua = nav.userAgent.toLowerCase();
/**
 * Headless browser detection on the clientside is imperfect. One can modify any clientside code to disable or change this check,
 * and one can spoof whatever is checked here. However, that doesn't make it worthless: it's yet another hurdle for spammers and
 * it stops unsophisticated scripters from making any request whatsoever.
 */
function isHeadless() {
    let correctPrototypes = true;
    try {
        correctPrototypes = PluginArray.prototype === nav.plugins.__proto__;
        if (nav.plugins.length > 0)
            correctPrototypes = correctPrototypes && Plugin.prototype === nav.plugins[0].__proto__;
    }
    catch (e) { /* Do nothing, this browser misbehaves in mysterious ways */ }
    return ( //tell-tale bot signs
    ua.indexOf("headless") !== -1
        || nav.appVersion.indexOf("Headless") !== -1
        || ua.indexOf("bot") !== -1 // http://www.useragentstring.com/pages/useragentstring.php?typ=Browser
        || ua.indexOf("crawl") !== -1 // Only IE5 has two distributions that has this on windows NT.. so yeah.
        || nav.webdriver === true
        || !nav.language
        || (nav.languages !== undefined && !nav.languages.length) // IE 11 does not support NavigatorLanguage.languages https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
        || !correctPrototypes);
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
    }
    else if (value < 0) {
        value = 0;
    }
    return (Math.pow(2, (255.999 - value) / 8.0) >>> 0);
}

const PUZZLE_EXPIRY_OFFSET = 13;
const NUMBER_OF_PUZZLES_OFFSET = 14;
const PUZZLE_DIFFICULTY_OFFSET = 15;

function decodeBase64Puzzle(base64Puzzle) {
    const parts = base64Puzzle.split(".");
    const puzzle = parts[1];
    const arr = decode(puzzle);
    return {
        signature: parts[0],
        base64: puzzle,
        buffer: arr,
        n: arr[NUMBER_OF_PUZZLES_OFFSET],
        threshold: difficultyToThreshold(arr[PUZZLE_DIFFICULTY_OFFSET]),
        expiry: arr[PUZZLE_EXPIRY_OFFSET] * 300000,
    };
}
async function getPuzzle(url, siteKey) {
    const urls = url.split(",");
    for (let i = 0; i < urls.length; i++) {
        const response = await fetchAndRetryWithBackoff(url + "?sitekey=" + siteKey, { headers: [["x-frc-client", "js-0.8.4"]], mode: 'cors' }, 2);
        if (response.ok) {
            const json = await response.json();
            return json.data.puzzle;
        }
        else {
            let json;
            try {
                json = await response.json();
            }
            catch (e) {
                /* Do nothing */
            }
            if (json && json.errors && json.errors[0] === "endpoint_not_enabled") {
                throw Error(`Endpoint not allowed (${response.status})`);
            }
            if (i === urls.length - 1) {
                throw Error(`Failure in getting puzzle: ${response.status} ${response.statusText}`);
            }
        }
    }
    // This code should never be reached.
    throw Error(`Internal error`);
}
/**
 * Retries given request with exponential backoff (starting with 100ms delay, multiplying by 4 every time)
 * @param url Request (can be string url) to fetch
 * @param opts Options for fetch
 * @param n Number of times to attempt before giving up.
 */
async function fetchAndRetryWithBackoff(url, opts, n) {
    let time = 500;
    return fetch(url, opts).catch(async (error) => {
        if (n === 1)
            throw error;
        await new Promise(r => setTimeout(r, time));
        time *= 4;
        return fetchAndRetryWithBackoff(url, opts, n - 1);
    });
}

// English
const LANG_EN = {
    text_init: "Initializing..",
    text_ready: "Anti-Robot Verification",
    button_start: "Click to start verification",
    text_fetching: "Fetching Challenge",
    text_solving: "Verifying you are human..",
    text_completed: "I am human",
    text_expired: "Anti-Robot verification expired",
    button_restart: "Restart",
    text_error: "Verification failed:",
    button_retry: "Retry",
};
// French
const LANG_FR = {
    text_init: "Chargement..",
    text_ready: "Verification Anti-Robot",
    button_start: "Cliquez ici pour v??rifier",
    text_fetching: "Chargement du challenge",
    text_solving: "V??rification que vous ??tes humain..",
    text_completed: "Je suis humain",
    text_expired: "Verification ??chue",
    button_restart: "Recommencer",
    text_error: "Echec de verification:",
    button_retry: "Recommencer",
};
// German
const LANG_DE = {
    text_init: "Initialisierung..",
    text_ready: "Anti-Roboter-Verifizierung",
    button_start: "Hier klicken",
    text_fetching: "Herausforderung laden..",
    text_solving: "Verifizierung, dass Sie ein Mensch sind..",
    text_completed: "Ich bin ein Mensch",
    text_expired: "Verifizierung abgelaufen",
    button_restart: "Erneut starten",
    text_error: "Verifizierung fehlgeschlagen:",
    button_retry: "Erneut versuchen",
};
// Dutch
const LANG_NL = {
    text_init: "Initializeren..",
    text_ready: "Anti-robotverificatie",
    button_start: "Klik om te starten",
    text_fetching: "Aan het laden..",
    text_solving: "Anti-robotverificatie bezig..",
    text_completed: "Ik ben een mens",
    text_expired: "Verificatie verlopen",
    button_restart: "Opnieuw starten",
    text_error: "Verificatie mislukt:",
    button_retry: "Opnieuw proberen",
};
// Italian
const LANG_IT = {
    text_init: "Inizializzazione...",
    text_ready: "Verifica Anti-Robot",
    button_start: "Clicca per iniziare",
    text_fetching: "Caricamento...",
    text_solving: "Verificando che sei umano...",
    text_completed: "Non sono un robot",
    text_expired: "Verifica Anti-Robot scaduta",
    button_restart: "Ricomincia",
    text_error: "Verifica fallita:",
    button_retry: "Riprova",
};
const localizations = {
    en: LANG_EN,
    de: LANG_DE,
    nl: LANG_NL,
    fr: LANG_FR,
    it: LANG_IT,
};

const PUZZLE_ENDPOINT_URL = "https://api.friendlycaptcha.com/api/v1/puzzle";
const URL = window.URL || window.webkitURL;
class WidgetInstance {
    constructor(element, options = {}) {
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
            startedCallback: () => 0,
            readyCallback: () => 0,
            doneCallback: () => 0,
            errorCallback: () => 0,
            sitekey: element.dataset["sitekey"] || "",
            language: element.dataset["lang"] || "en",
            solutionFieldName: element.dataset["solutionFieldName"] || "frc-captcha-solution"
        }, options);
        this.e = element;
        // Load language
        if (typeof this.opts.language === "string") {
            let l = localizations[this.opts.language.toLowerCase()];
            if (l === undefined) {
                console.error("FriendlyCaptcha: language \"" + this.opts.language + "\" not found.");
                // Fall back to English
                l = localizations.en;
            }
            this.lang = l;
        }
        else {
            // We assign to a copy of the English language localization, so that any missing values will be English
            this.lang = Object.assign(Object.assign({}, localizations.en), this.opts.language);
        }
        element.innerText = this.lang.text_init;
        injectStyle();
        this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
    }
    init(forceStart) {
        if (this.hasBeenDestroyed) {
            console.error("FriendlyCaptcha widget has been destroyed using destroy(), it can not be used anymore.");
            return;
        }
        this.initWorker();
        this.setupSolver();
        if (forceStart) {
            this.start();
        }
        else if (this.e.dataset["start"] !== "none" && (this.opts.startMode === "focus" || this.e.dataset["start"] === "focus")) {
            const form = findParentFormElement(this.e);
            if (form) {
                executeOnceOnFocusInEvent(form, () => {
                    if (!this.hasBeenStarted) {
                        this.start();
                    }
                });
            }
            else {
                console.log("FriendlyCaptcha div seems not to be contained in a form, autostart will not work");
            }
        }
    }
    /**
     * Compile the WASM and send the compiled module to the webworker.
     * If WASM support is not present, it tells the webworker to initialize the JS solver instead.
     */
    async setupSolver() {
        if (this.opts.forceJSFallback) {
            this.worker.postMessage({ type: "js" });
            return;
        }
        try {
            const module = WebAssembly.compile(decode(base64));
            this.worker.postMessage({ type: "module", module: await module });
        }
        catch (e) {
            console.log("FriendlyCaptcha failed to initialize WebAssembly, falling back to Javascript solver: " + e.toString());
            this.worker.postMessage({ type: "js" });
        }
    }
    /**
     * Add a listener to the button that calls `this.start` on click.
     */
    makeButtonStart() {
        const b = this.e.querySelector("button");
        if (b) {
            b.addEventListener("click", (e) => this.start(), { once: true, passive: true });
            b.addEventListener("touchstart", (e) => this.start(), { once: true, passive: true });
        }
    }
    onWorkerError(e) {
        this.needsReInit = true;
        this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Background worker error " + e.message);
        this.makeButtonStart();
        // Just out of precaution
        this.opts.forceJSFallback = true;
    }
    initWorker() {
        if (this.worker)
            this.worker.terminate();
        const workerBlob = new Blob([workerString], { type: "text/javascript" });
        this.worker = new Worker(URL.createObjectURL(workerBlob));
        this.worker.onerror = (e) => this.onWorkerError(e);
        this.worker.onmessage = (e) => {
            if (this.hasBeenDestroyed)
                return;
            const data = e.data;
            if (!data)
                return;
            if (data.type === "progress") {
                updateProgressBar(this.e, data);
            }
            else if (data.type === "ready") {
                this.e.innerHTML = getReadyHTML(this.opts.solutionFieldName, this.lang);
                this.makeButtonStart();
                this.opts.readyCallback();
            }
            else if (data.type === "started") {
                this.e.innerHTML = getRunningHTML(this.opts.solutionFieldName, this.lang);
                this.opts.startedCallback();
            }
            else if (data.type === "done") {
                const solutionPayload = this.handleDone(data);
                this.opts.doneCallback(solutionPayload);
                const callback = this.e.dataset["callback"];
                if (callback) {
                    window[callback](solutionPayload);
                }
            }
            else if (data.type === "error") {
                this.onWorkerError(data);
            }
        };
    }
    expire() {
        this.e.innerHTML = getExpiredHTML(this.opts.solutionFieldName, this.lang);
        this.makeButtonStart();
    }
    async start() {
        if (this.hasBeenDestroyed) {
            console.error("Can not start FriendlyCaptcha widget which has been destroyed");
            return;
        }
        this.hasBeenStarted = true;
        const sitekey = this.opts.sitekey || this.e.dataset["sitekey"];
        if (!sitekey) {
            console.error("FriendlyCaptcha: sitekey not set on frc-captcha element");
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Website problem: sitekey not set", false);
            return;
        }
        if (isHeadless()) {
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, "Browser check failed, try a different browser", false);
            return;
        }
        if (this.needsReInit) {
            this.needsReInit = false;
            this.init(true);
            return;
        }
        try {
            this.e.innerHTML = getFetchingHTML(this.opts.solutionFieldName, this.lang);
            this.puzzle = decodeBase64Puzzle(await getPuzzle(this.opts.puzzleEndpoint, sitekey));
            setTimeout(() => this.expire(), this.puzzle.expiry - 30000); // 30s grace
        }
        catch (e) {
            this.e.innerHTML = getErrorHTML(this.opts.solutionFieldName, this.lang, e.toString());
            this.makeButtonStart();
            const code = "error_getting_puzzle";
            this.opts.errorCallback({ code, description: e.toString(), error: e });
            const callback = this.e.dataset["callback-error"];
            if (callback) {
                window[callback](this);
            }
            return;
        }
        this.worker.postMessage({ type: "start", buffer: this.puzzle.buffer, n: this.puzzle.n, threshold: this.puzzle.threshold });
    }
    /**
     * This is to be called when the puzzle has been succesfully completed.
     * Here the hidden field gets updated with the solution.
     * @param data message from the webworker
     */
    handleDone(data) {
        this.valid = true;
        const puzzleSolutionMessage = `${this.puzzle.signature}.${this.puzzle.base64}.${encode(data.solution)}.${encode(data.diagnostics)}`;
        this.e.innerHTML = getDoneHTML(this.opts.solutionFieldName, this.lang, puzzleSolutionMessage, data);
        if (this.worker)
            this.worker.terminate();
        // this.worker = null; // This literally crashes very old browsers..
        this.needsReInit = true;
        return puzzleSolutionMessage;
    }
    /**
     * Cleans up the widget entirely, removing any DOM elements and terminating any background workers.
     * After it is destroyed it can no longer be used for any purpose.
     */
    destroy() {
        if (this.worker)
            this.worker.terminate();
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
    reset() {
        if (this.hasBeenDestroyed) {
            console.error("FriendlyCaptcha widget has been destroyed, it can not be used anymore");
            return;
        }
        if (this.worker)
            this.worker.terminate();
        this.worker = null;
        this.needsReInit = false;
        this.hasBeenStarted = false;
        this.init(this.opts.startMode === "auto" || this.e.dataset["start"] === "auto");
    }
}

const fc = window.friendlyChallenge;
let autoWidget = fc ? fc.autoWidget : null;
const elements = findCaptchaElements();
for (var index = 0; index < elements.length; index++) {
    const hElement = elements[index];
    if (hElement && !hElement.dataset["attached"]) {
        autoWidget = new WidgetInstance(hElement);
        hElement.dataset["attached"] = "1";
    }
}
// @ts-ignore
window.friendlyChallenge = {
    WidgetInstance,
    autoWidget
};
