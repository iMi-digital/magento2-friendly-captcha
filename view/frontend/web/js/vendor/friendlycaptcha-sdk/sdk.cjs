"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/entry/sdk.ts
var sdk_exports = {};
__export(sdk_exports, {
  FRCRiskIntelligenceCompleteEventName: () => FRCRiskIntelligenceCompleteEventName,
  FRCRiskIntelligenceErrorEventName: () => FRCRiskIntelligenceErrorEventName,
  FRCRiskIntelligenceExpireEventName: () => FRCRiskIntelligenceExpireEventName,
  FRCWidgetCompleteEventName: () => FRCWidgetCompleteEventName,
  FRCWidgetErrorEventName: () => FRCWidgetErrorEventName,
  FRCWidgetExpireEventName: () => FRCWidgetExpireEventName,
  FRCWidgetResetEventName: () => FRCWidgetResetEventName,
  FRCWidgetStateChangeEventName: () => FRCWidgetStateChangeEventName,
  FriendlyCaptchaSDK: () => FriendlyCaptchaSDK
});
module.exports = __toCommonJS(sdk_exports);

// src/util/flatPromise.ts
function flatPromise(executor) {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (executor) {
    executor(resolve, reject);
  }
  return { promise, resolve, reject };
}

// src/util/string.ts
function stringHasPrefix(str, word) {
  return str.lastIndexOf(word, 0) === 0;
}

// src/util/url.ts
var originRegex = /^((?:\w+:)?\/\/([^\/]+))/;
function encodeQuery(queryParams) {
  let out = [];
  const k = Object.keys(queryParams);
  const eu = encodeURIComponent;
  for (let i = 0; i < k.length; i++) {
    out.push(`${eu(k[i])}=${eu(queryParams[k[i]])}`);
  }
  return out.join("&");
}
function originOf(url) {
  const l = document.location;
  if (stringHasPrefix(url, "/") || stringHasPrefix(url, ".")) {
    if (l.origin) return l.origin;
    return l.protocol + "//" + l.host;
  }
  const match = url.match(originRegex);
  if (!match) throw new Error("Invalid URL: " + url);
  return match[1];
}

// src/communication/iframeTarget.ts
var IFrameCommunicationTarget = class {
  constructor(opts) {
    /**
     * We have received a message from this target at any point
     */
    this.ready = false;
    /**
     * Messages that couldn't be delivered yet as the target isn't ready to receive messages.
     */
    this.buffer = [];
    this.id = opts.id;
    this.type = opts.type;
    this.element = opts.element;
    this.onReady = opts.onReady;
    this.origin = originOf(opts.element.src);
  }
  send(msg) {
    if (this.ready) {
      this.element.contentWindow.postMessage(msg, this.origin);
    } else {
      this.buffer.push(msg);
    }
  }
  setReady(ready) {
    this.onReady();
    this.ready = ready;
    if (this.ready) {
      this.flush();
    }
  }
  flush() {
    for (let i = 0; i < this.buffer.length; i++) {
      this.element.contentWindow.postMessage(this.buffer[i], this.origin);
    }
    this.buffer = [];
  }
};

// src/communication/bus.ts
function isAllowedOrigin(origin, allowedOrigins) {
  return origin === "*" || allowedOrigins.has(origin);
}
var CommunicationBus = class {
  constructor() {
    /**
     * Messages sent from this set of origins will be considered, all others are ignored.
     * Perhaps the website this code runs on has more cross-origin message passing happening, we don't want to interfere.
     */
    this.origins = /* @__PURE__ */ new Set();
    // We use a Record here to prevent the need to add a Map polyfill in the widget.
    this.targets = {};
    /** Some messages that expect an answer may be handled twice if two SDKs are present. Here we keep track of those and deliver them only once. */
    this.answered = /* @__PURE__ */ new Set();
    /**
     * Called upon receiving a message intended for consumption by the root itself, which is the host page
     * that contains the widgets and agent iframes.
     */
    this.onReceiveRootMessage = () => {
    };
    window.addEventListener("message", (ev) => {
      this.onReceive(ev);
    });
  }
  /**
   * Adds a listener for root messages.
   * @internal
   */
  listen(onReceiveRootMessage) {
    let orig = this.onReceiveRootMessage;
    this.onReceiveRootMessage = (msg) => {
      orig(msg);
      onReceiveRootMessage(msg);
    };
  }
  /**
   * Add origins to allow messages from.
   * @internal
   */
  addOrigins(origins) {
    origins.forEach((origin) => this.origins.add(origin));
  }
  /**
   * Send from the local root
   * @param msg
   * @internal
   */
  send(msg) {
    if (msg.from_id) {
      const messageSender = this.targets[msg.from_id];
      if (!messageSender) {
        console.error(`[bus] Unexpected message from unknown sender ${msg.from_id}`, msg);
        return;
      }
      if (msg.type === "widget_announce" || msg.type === "agent_announce") {
        messageSender.setReady(true);
      }
    }
    const rid = msg.rid;
    if (rid) {
      if (this.answered.has(rid + msg.to_id)) {
        return;
      }
      this.answered.add(rid + msg.to_id);
    }
    if (msg.to_id === "") {
      this.onReceiveRootMessage(msg);
      return;
    }
    const messageTarget = this.targets[msg.to_id];
    if (!messageTarget) {
      console.error(`[bus] Unexpected message to unknown target ${msg.to_id}`, msg);
      return;
    }
    messageTarget.send(msg);
  }
  onReceive(ev) {
    if (!isAllowedOrigin(ev.origin, this.origins)) {
      return;
    }
    const msg = ev.data;
    if (!msg || !msg._frc) return;
    this.send(msg);
  }
  /**
   * @param ct
   * @internal
   */
  registerTarget(ct) {
    this.targets[ct.id] = ct;
  }
  /**
   * @internal
   */
  registerTargetIFrame(type, id, iframe, timeout) {
    const fp = flatPromise();
    let timeoutPromise = new Promise((resolve) => setTimeout(() => resolve("timeout"), timeout));
    const t = new IFrameCommunicationTarget({
      id,
      element: iframe,
      type,
      onReady: () => fp.resolve("registered")
    });
    this.registerTarget(t);
    return Promise.race([fp.promise, timeoutPromise]);
  }
  /**
   * @internal
   */
  removeTarget(id) {
    delete this.targets[id];
  }
};

// src/util/random.ts
function randomId(length, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}
function shuffledCopy(values) {
  const out = values.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

// src/sdk/persist.ts
var SESSION_COUNT_KEY = "frc_sc";
var SESSION_ID_KEY = "frc_sid";
var SEPARATOR = "__";
var didIncrease = false;
var sc = "0";
var sid = "__" + randomId(10);
function sessionCount(increase) {
  if (!didIncrease) {
    let scnumber = 0;
    try {
      scnumber = parseInt(sessionStorage.getItem(SESSION_COUNT_KEY) || "", 10);
    } catch (e) {
    }
    if (isNaN(scnumber)) scnumber = 0;
    increase && scnumber++;
    sc = scnumber.toString();
    try {
      sessionStorage.setItem(SESSION_COUNT_KEY, sc);
    } catch (e) {
    }
  }
  return sc;
}
function sessionId() {
  let id;
  try {
    id = sessionStorage.getItem(SESSION_ID_KEY);
  } catch (e) {
    return sid;
  }
  if (!id) {
    id = randomId(12);
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}
var Store = class {
  constructor(prefix) {
    /**
     * Fallback memory-only store
     */
    this.mem = /* @__PURE__ */ new Map();
    this.storePrefix = prefix;
  }
  get(key) {
    const storeKey = this.storePrefix + SEPARATOR + key;
    try {
      const sessValue = sessionStorage.getItem(storeKey);
      return sessValue === null ? void 0 : sessValue;
    } catch (e) {
    }
    return this.mem.get(key);
  }
  set(key, value) {
    const storeKey = this.storePrefix + SEPARATOR + key;
    try {
      if (value === void 0) {
        this.mem.delete(key);
        sessionStorage.removeItem(storeKey);
      } else {
        this.mem.set(key, value);
        sessionStorage.setItem(storeKey, value);
      }
    } catch (e) {
    }
  }
};

// src/sdk/supports.ts
var supportAllowClipboardWrite = typeof navigator !== "undefined" && navigator.userAgentData !== void 0;

// src/sdk/dom.ts
function findFRCElements() {
  const captchaElements = document.querySelectorAll(".frc-captcha");
  const riskIntelligenceElements = document.querySelectorAll(".frc-risk-intelligence");
  return [captchaElements, riskIntelligenceElements];
}
function findParentFormElement(element) {
  let current = element;
  while (current) {
    if (current.tagName === "FORM") {
      return current;
    }
    if (current.parentElement) {
      current = current.parentElement;
      continue;
    }
    const parentNode = current.parentNode;
    if (parentNode && parentNode.host) {
      current = parentNode.host;
      continue;
    }
    current = null;
  }
  return null;
}
function executeOnceOnFocusInEvent(element, listener) {
  element.addEventListener("focusin", listener, { once: true, passive: true });
}
function createManagedInputElement(parentElement, formFieldName) {
  const iel = document.createElement("input");
  iel.type = "hidden";
  iel.style.display = "none";
  iel.name = formFieldName;
  parentElement.appendChild(iel);
  return iel;
}
function styleIfNotAlreadySet(el, name, value) {
  if (el.style[name] === "") {
    el.style[name] = value;
  }
}
function setWidgetRootStyles(el) {
  const sinas = styleIfNotAlreadySet;
  sinas(el, "position", "relative");
  sinas(el, "height", "70px");
  sinas(el, "padding", "0");
  sinas(el, "width", "316px");
  sinas(el, "maxWidth", "100%");
  sinas(el, "maxHeight", "100%");
  sinas(el, "overflow", "hidden");
  sinas(el, "borderRadius", "4px");
}
function removeWidgetRootStyles(el) {
  el.removeAttribute("style");
}
function runOnDocumentLoaded(func) {
  if (document.readyState !== "loading") {
    func();
  } else {
    document.addEventListener("DOMContentLoaded", func);
  }
}
function fireFRCEvent(element, eventData) {
  let event;
  if (typeof window.CustomEvent === "function") {
    event = new CustomEvent(eventData.name, {
      bubbles: true,
      detail: eventData
    });
  } else {
    event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventData.name, true, false, eventData);
  }
  element.dispatchEvent(event);
}
function findFirstParentLangAttribute(element) {
  while (!element.lang || typeof element.lang !== "string") {
    element = element.parentElement;
    if (!element) {
      return null;
    }
  }
  return element.lang;
}

// src/sdk/localization.ts
var PLACEHOLDER_LOCALIZATIONS = {
  ar: {
    title: "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0645\u0643\u0627\u0641\u062D\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A\u0627\u062A",
    connecting: "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0645\u0643\u0627\u0641\u062D\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A\u0627\u062A \u0642\u064A\u062F \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u2026",
    retrying: "\u0627\u0633\u062A\u063A\u0631\u0642 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0645\u0643\u0627\u0641\u062D\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A\u0627\u062A \u0648\u0642\u062A\u064B\u0627 \u0637\u0648\u064A\u0644\u0627\u064B.\n\n\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629\u2026",
    failed: "\u0641\u0634\u0644 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0645\u0643\u0627\u0641\u062D\u0629 \u0627\u0644\u0631\u0648\u0628\u0648\u062A\u0627\u062A."
  },
  bg: {
    title: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0441\u0440\u0435\u0449\u0443 \u0440\u043E\u0431\u043E\u0442\u0438",
    connecting: "\u0417\u0430\u0440\u0435\u0436\u0434\u0430 \u0441\u0435 \u0437\u0430\u0434\u0430\u0447\u0430\u0442\u0430\u2026",
    retrying: "\u041D\u0435\u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u0432\u044A\u0440\u0437\u0432\u0430\u043D\u0435.\n\n\u041E\u043F\u0438\u0442 \u0437\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u0441\u0432\u044A\u0440\u0437\u0432\u0430\u043D\u0435\u2026",
    failed: "\u041D\u0435\u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u0432\u044A\u0440\u0437\u0432\u0430\u043D\u0435."
  },
  ca: {
    title: "Verificaci\xF3 anti-robot",
    connecting: "Carregant el desafiament\u2026",
    retrying: "Errada de conexi\xF3.\n\nReintentant\u2026",
    failed: "Errada de conexi\xF3."
  },
  cs: {
    title: "Ov\u011B\u0159en\xED proti robot\u016Fm",
    connecting: "P\u0159ipojov\xE1n\xED kontroly proti robot\u016Fm\u2026",
    retrying: "P\u0159ipojen\xED kontroly proti robot\u016Fm trvalo p\u0159\xEDli\u0161 dlouho.\n\nOpakuji pokus\u2026",
    failed: "Kontrola proti robot\u016Fm se nepoda\u0159ilo p\u0159ipojit."
  },
  da: {
    title: "Anti-robot-verifikation",
    connecting: "Anti-robot-kontrol forbinder\u2026",
    retrying: "Anti-robot-kontrol tog for lang tid at oprette forbindelse.\n\nPr\xF8ver igen\u2026",
    failed: "Anti-robot-kontrol kunne ikke oprette forbindelse."
  },
  nl: {
    title: "Anti-robotcheck",
    connecting: "Verbinden met Anti-robotcheck\u2026",
    retrying: "Verbinden met Anti-robotcheck mislukt.\n\nOpnieuw aan het proberen\u2026",
    failed: "Verbinden met Anti-robotcheck mislukt."
  },
  en: {
    title: "Anti-Robot verification",
    connecting: "Anti-Robot check connecting\u2026",
    retrying: "Anti-Robot check took too long to connect.\n\nRetrying\u2026",
    failed: "Anti-Robot check failed to connect."
  },
  fi: {
    title: "Robottien torjunnan vahvistus",
    connecting: "Robottien torjunnan tarkistus k\xE4ynniss\xE4\u2026",
    retrying: "Robottien torjunnan tarkistus kesti liian kauan.\n\nYritet\xE4\xE4n uudelleen\u2026",
    failed: "Robottien torjunnan tarkistus ep\xE4onnistui."
  },
  fr: {
    title: "V\xE9rification anti-robot",
    connecting: "Connexion \xE0 la v\xE9rification anti-robot\u2026",
    retrying: "La connexion \xE0 la v\xE9rification anti-robot a pris trop de temps.\n\nNouvelle tentative\u2026",
    failed: "\xC9chec de la connexion \xE0 la v\xE9rification anti-robot."
  },
  de: {
    title: "Anti-Roboter-Verifizierung",
    connecting: "Verbindung zur Anti-Roboter-Verifizierung wird hergestellt\u2026",
    retrying: "Verbindung zur Anti-Roboter-Verifizierung hat zu lange gedauert.\n\nErneuter Versuch\u2026",
    failed: "Verbindung zur Anti-Roboter-Verifizierung ist fehlgeschlagen."
  },
  hi: {
    title: "\u090F\u0902\u091F\u0940-\u0930\u094B\u092C\u094B\u091F \u0938\u0924\u094D\u092F\u093E\u092A\u0928",
    connecting: "\u091A\u0941\u0928\u094C\u0924\u0940 \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u0940 \u0939\u0948\u2026",
    retrying: "\u0915\u0928\u0947\u0915\u094D\u0936\u0928 \u0935\u093F\u092B\u0932.\n\n\u092A\u0941\u0928\u0903 \u092A\u094D\u0930\u092F\u093E\u0938 \u0915\u0930 \u0930\u0939\u0947 \u0939\u0948\u0902\u2026",
    failed: "\u0915\u0928\u0947\u0915\u094D\u0936\u0928 \u0935\u093F\u092B\u0932."
  },
  hu: {
    title: "Robotellen\u0151rz\xE9s",
    connecting: "Robotellen\u0151rz\xE9s csatlakoz\xE1s\u2026",
    retrying: "A robotellen\u0151rz\xE9s t\xFAl sok\xE1ig tartott a csatlakoz\xE1shoz.\n\n\xDAjrapr\xF3b\xE1lom\u2026",
    failed: "A robotellen\u0151rz\xE9s nem tudott csatlakozni."
  },
  id: {
    title: "Verifikasi Anti-Robot",
    connecting: "Pemeriksaan Anti-Robot sedang terhubung\u2026",
    retrying: "Pemeriksaan Anti-Robot memakan waktu terlalu lama untuk terhubung.\n\nMencoba lagi\u2026",
    failed: "Pemeriksaan Anti-Robot gagal terhubung."
  },
  ja: {
    title: "\u30ED\u30DC\u30C3\u30C8\u9632\u6B62\u8A8D\u8A3C",
    connecting: "\u30C1\u30E3\u30EC\u30F3\u30B8\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u3044\u307E\u3059\u2026",
    retrying: "\u63A5\u7D9A\u5931\u6557.\n\n\u518D\u8A66\u884C\u4E2D\u2026",
    failed: "\u63A5\u7D9A\u5931\u6557."
  },
  it: {
    title: "Verifica anti-robot",
    connecting: "Connessione verifica anti-robot in corso\u2026",
    retrying: "La connessione alla verifica anti-robot ha richiesto troppo tempo.\n\nRiprovando\u2026",
    failed: "Impossibile connettersi alla verifica anti-robot."
  },
  nb: {
    title: "Anti-robot-verifisering",
    connecting: "Laster inn utfordring\u2026",
    retrying: "Klarte ikke \xE5 koble til.\n\nPr\xF8ver igjen\u2026",
    failed: "Klarte ikke \xE5 koble til."
  },
  pl: {
    title: "Weryfikacja antyrobotowa",
    connecting: "\u0141\u0105czenie si\u0119 z kontrol\u0105 antyrobotow\u0105\u2026",
    retrying: "\u0141\u0105czenie si\u0119 z kontrol\u0105 antyrobotow\u0105 trwa\u0142o zbyt d\u0142ugo. \n\nPonowna pr\xF3ba\u2026",
    failed: "Nie uda\u0142o si\u0119 po\u0142\u0105czy\u0107 z kontrol\u0105 antyrobotow\u0105."
  },
  ro: {
    title: "Verificare anti-robot",
    connecting: "Se incarca testul\u2026",
    retrying: "Conexiunea a esuat.\n\nReincercare\u2026",
    failed: "Conexiunea a esuat."
  },
  pt: {
    title: "Verifica\xE7\xE3o anti-rob\xF4",
    connecting: "Verifica\xE7\xE3o anti-rob\xF4 a ligar\u2026",
    retrying: "A verifica\xE7\xE3o anti-rob\xF4 demorou demasiado tempo a ligar-se.\n\nA tentar novamente\u2026",
    failed: "A verifica\xE7\xE3o anti-rob\xF4 n\xE3o conseguiu ligar-se."
  },
  ru: {
    title: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0430\u043D\u0442\u0438\u0440\u043E\u0431\u043E\u0442\u0430",
    connecting: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435 \u0430\u043D\u0442\u0438\u0440\u043E\u0431\u043E\u0442\u0430\u2026",
    retrying: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435 \u0430\u043D\u0442\u0438\u0440\u043E\u0431\u043E\u0442\u0430 \u0437\u0430\u043D\u044F\u043B\u043E \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438.\n\n\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u043C \u043F\u043E\u043F\u044B\u0442\u043A\u0443\u2026",
    failed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F \u043A \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435 \u0430\u043D\u0442\u0438\u0440\u043E\u0431\u043E\u0442\u0430."
  },
  sk: {
    title: "Overovanie proti robotom",
    connecting: "Pripojenie kontroly proti robotom\u2026",
    retrying: "Pripojenie kontroly proti robotom trvalo pr\xEDli\u0161 dlho.\n\nOpakujem pokus\u2026",
    failed: "Pripojenie kontroly proti robotom sa nepodarilo."
  },
  sl: {
    title: "Preverjanje proti robotom",
    connecting: "Nalaganje izziva\u2026",
    retrying: "Povezava ni uspela.\n\nPonovni poskus\u2026",
    failed: "Povezava ni uspela."
  },
  es: {
    title: "Verificaci\xF3n antirrobot",
    connecting: "Conectando verificaci\xF3n antirrobot\u2026",
    retrying: "La verificaci\xF3n antirrobot tard\xF3 demasiado en conectarse.\n\nReintentando\u2026",
    failed: "Error al conectar la verificaci\xF3n antirrobot."
  },
  sv: {
    title: "Anti-robotverifiering",
    connecting: "Anti-robotverifiering ansluter\u2026",
    retrying: "Anti-robotverifiering tog f\xF6r l\xE5ng tid att ansluta.\n\nF\xF6rs\xF6ker igen\u2026",
    failed: "Anti-robotverifiering kunde inte ansluta."
  },
  th: {
    title: "\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E1B\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19\u0E1A\u0E2D\u0E17",
    connecting: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E01\u0E32\u0E23\u0E17\u0E49\u0E32\u0E17\u0E32\u0E22\u2026",
    retrying: "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08.\n\n\u0E01\u0E33\u0E25\u0E31\u0E07\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u2026",
    failed: "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08."
  },
  tr: {
    title: "Robot \xF6nleme do\u011Frulamas\u0131",
    connecting: "Robot \xF6nleme kontrol\xFC ba\u011Flan\u0131yor\u2026",
    retrying: "Robot \xF6nleme kontrol\xFC ba\u011Flanmak i\xE7in \xE7ok uzun s\xFCrd\xFC.\n\nYeniden deniyor\u2026",
    failed: "Robot \xF6nleme kontrol\xFC ba\u011Flanamad\u0131."
  },
  vi: {
    title: "X\xE1c minh ch\u1ED1ng robot",
    connecting: "Ki\u1EC3m tra robot \u0111ang k\u1EBFt n\u1ED1i\u2026",
    retrying: "Ki\u1EC3m tra ch\u1ED1ng robot m\u1EA5t qu\xE1 nhi\u1EC1u th\u1EDDi gian \u0111\u1EC3 k\u1EBFt n\u1ED1i.\n\n\u0110ang th\u1EED l\u1EA1i\u2026",
    failed: "Ki\u1EC3m tra ch\u1ED1ng robot kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i."
  },
  zh: {
    title: "\u53CD\u673A\u5668\u4EBA\u9A8C\u8BC1",
    connecting: "\u53CD\u673A\u5668\u4EBA\u9A8C\u8BC1\u6B63\u5728\u8FDE\u63A5\u2026",
    retrying: "\u53CD\u673A\u5668\u4EBA\u9A8C\u8BC1\u8FDE\u63A5\u8017\u65F6\u8FC7\u957F\u3002\n\n\u6B63\u5728\u91CD\u8BD5\u2026",
    failed: "\u53CD\u673A\u5668\u4EBA\u9A8C\u8BC1\u8FDE\u63A5\u5931\u8D25\u3002"
  }
};
var RTL_LANGUAGES = ["ar", "he", "fa", "ur", "ps", "sd", "yi"];
function getLanguageCode(lang) {
  return lang.toLowerCase().split("-")[0].split("_")[0];
}
function isRTLLanguage(lang) {
  lang = getLanguageCode(lang);
  return RTL_LANGUAGES.indexOf(lang) !== -1;
}
function getLocalizedWidgetTitle(lang) {
  lang = getLanguageCode(lang);
  const messages = PLACEHOLDER_LOCALIZATIONS[lang] || PLACEHOLDER_LOCALIZATIONS["en"];
  return messages.title + " - Widget";
}
function getLocalizedPlaceholderText(lang, type) {
  lang = getLanguageCode(lang);
  const messages = PLACEHOLDER_LOCALIZATIONS[lang] || PLACEHOLDER_LOCALIZATIONS["en"];
  return messages[type];
}

// src/sdk/create.ts
var FRAME_ID_DATASET_FIELD = "FrcFrameId";
var AGENT_FRAME_CLASSNAME = "frc-i-agent";
var WIDGET_FRAME_CLASSNAME = "frc-i-widget";
var WIDGET_PLACEHOLDER_CLASSNAME = "frc-widget-placeholder";
function createAgentIFrame(frcSDK, agentId, src) {
  const frameParams = {
    origin: document.location.origin,
    sess_id: sessionId(),
    sess_c: sessionCount(true),
    comm_id: agentId,
    sdk_v: "1.0.0",
    v: "1",
    agent_id: agentId,
    ts: Date.now().toString()
  };
  const el = document.createElement("iframe");
  el.className = AGENT_FRAME_CLASSNAME;
  el.dataset[FRAME_ID_DATASET_FIELD] = agentId;
  el.src = src + "?" + encodeQuery(frameParams);
  el.frcSDK = frcSDK;
  const s = el.style;
  s.width = s.height = s.border = s.visibility = "0";
  s.display = "none";
  return el;
}
function createWidgetIFrame(agentId, widgetId, widgetUrl, opts) {
  const el = document.createElement("iframe");
  const language = getLanguageFromOptionsOrParent(opts);
  const frameData = {
    origin: document.location.origin,
    sess_id: sessionId(),
    sess_c: sessionCount(true),
    comm_id: widgetId,
    sdk_v: "1.0.0",
    v: "1",
    agent_id: agentId,
    lang: language,
    sitekey: opts.sitekey || "",
    ts: Date.now().toString()
  };
  if (opts.theme) {
    frameData.theme = opts.theme;
  }
  if (supportAllowClipboardWrite) {
    el.allow = "clipboard-write";
  }
  el.frameBorder = "0";
  el.src = widgetUrl + "?" + encodeQuery(frameData);
  el.className = WIDGET_FRAME_CLASSNAME;
  el.title = getLocalizedWidgetTitle(language);
  el.dataset[FRAME_ID_DATASET_FIELD] = widgetId;
  const s = el.style;
  s.border = s.visibility = "0";
  s.position = "absolute";
  s.height = s.width = "100%";
  s.userSelect = "none";
  s["-webkit-tap-highlight-color"] = "transparent";
  s.display = "none";
  opts.element.appendChild(el);
  return el;
}
function createWidgetPlaceholder(opts) {
  const el = document.createElement("div");
  el.classList.add(WIDGET_PLACEHOLDER_CLASSNAME);
  const s = el.style;
  const isDark = opts.theme === "dark" || opts.theme === "auto" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  s.color = isDark ? "#fff" : "#222";
  s.backgroundColor = isDark ? "#171717" : "#fafafa";
  s.borderRadius = "4px";
  s.border = "1px solid";
  s.borderColor = "#ddd";
  s.padding = "8px";
  s.height = s.width = "100%";
  s.fontSize = "14px";
  s.boxSizing = "border-box";
  setCommonTextStyles(s);
  opts.element.appendChild(el);
  return el;
}
function setCommonTextStyles(s) {
  s.textDecoration = s.fontStyle = "none";
  s.fontWeight = "500";
  s.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  s.lineHeight = "1";
  s.letterSpacing = "-0.0125rem";
}
function createBanner(opts) {
  const el = document.createElement("div");
  el.classList.add("frc-banner");
  const language = getLanguageFromOptionsOrParent(opts);
  const isDark = opts.theme === "dark" || opts.theme === "auto" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  let primaryColor = "#565656";
  let secondaryColor = "#a2a2a2";
  if (isDark) {
    primaryColor = "#a2a2a2";
    secondaryColor = "#565656";
  }
  const els = el.style;
  els.position = "absolute";
  els.bottom = "6px";
  if (isRTLLanguage(language)) {
    els.left = "6px";
  } else {
    els.right = "6px";
  }
  els.lineHeight = "1";
  const a = document.createElement("a");
  a.href = "https://friendlycaptcha.com";
  a.rel = "noopener";
  const s = a.style;
  setCommonTextStyles(s);
  s.color = primaryColor;
  s.fontSize = "10px";
  s.userSelect = "none";
  s.textDecorationLine = "underline";
  s.textDecorationThickness = "1px";
  s.textDecorationColor = secondaryColor;
  s.letterSpacing = "-0.0125rem";
  a.target = "_blank";
  a.textContent = "Friendly Captcha";
  a.onmouseenter = () => s.textDecorationColor = primaryColor;
  a.onmouseleave = () => s.textDecorationColor = secondaryColor;
  el.appendChild(a);
  opts.element.appendChild(el);
}
function getLanguageFromOptionsOrParent(opts) {
  let language = opts.language;
  if (!language || language === "html") {
    language = findFirstParentLangAttribute(opts.element) || "";
  }
  return language;
}
function createFallback(el, apiOrigin, language) {
  const link = (href, text) => {
    const l = document.createElement("a");
    l.href = href;
    l.target = "_blank";
    l.rel = "noopener";
    l.textContent = text;
    const style = l.style;
    setCommonTextStyles(style);
    style.textDecoration = "underline";
    style.color = "#565656";
    l.onmouseenter = () => style.textDecoration = "none";
    l.onmouseleave = () => style.textDecoration = "underline";
    return l;
  };
  const failedText = getLocalizedPlaceholderText(language, "failed");
  const els = [link(`${apiOrigin}/connectionTest`, failedText)];
  el.textContent = "";
  els.forEach((e) => el.appendChild(e));
}

// src/util/performance.ts
function windowPerformanceNow() {
  const p = window.performance;
  return p ? p.now() : 0;
}

// src/signals/trigger.ts
function getTrigger(type, startMode, el, ev) {
  const t = windowPerformanceNow();
  const bcr = el.getBoundingClientRect();
  const trigger = {
    v: 1,
    tt: type,
    pnow: t,
    sm: startMode,
    el: {
      bcr: [bcr.left, bcr.top, bcr.width, bcr.height],
      con: document.body.contains(el)
    },
    stack: new Error().stack || "",
    we: !!window.event,
    weit: !!window.event && !!window.event.isTrusted
  };
  if (ev) {
    trigger.ev = {
      ts: ev.timeStamp,
      rt: !!ev.relatedTarget,
      // @ts-ignore: not present in every browser
      eot: !!ev.explicitOriginalTarget,
      it: ev.isTrusted
    };
  }
  return trigger;
}

// src/util/object.ts
function mergeObject(target, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// src/sdk/widgetHandle.ts
var DEFAULT_FORM_FIELD_NAME = "frc-captcha-response";
var WidgetHandle = class {
  /**
   * You don't want to create this yourself, use `FriendlyCaptcha.createWidget` instead.
   * @internal
   */
  constructor(opts) {
    this.state = "init";
    this.response = ".UNINITIALIZED";
    this.focusEventPending = false;
    /**
     * When this is true the widget has been destroyed and can no longer be used.
     */
    this.isDestroyed = false;
    this.id = opts.id;
    const createOpts = opts.createOpts;
    this.e = createOpts.element;
    this.ready = opts.registered;
    if (!this.e) throw new Error("No element provided to mount widget under.");
    this.e.frcWidget = this;
    this.formFieldName = createOpts.formFieldName === void 0 ? DEFAULT_FORM_FIELD_NAME : createOpts.formFieldName;
    this.sitekey = createOpts.sitekey;
    this._reset = opts.callbacks.onReset;
    this._destroy = opts.callbacks.onDestroy;
    this._trigger = opts.callbacks.onTrigger;
    this.startMode = opts.createOpts.startMode || "focus";
    if (this.formFieldName !== null) {
      this.hiddenFormEl = createManagedInputElement(this.e, this.formFieldName);
    }
    this.setState({ response: ".UNCONNECTED", state: "init" });
    this.ready.then(() => {
      this.handleStartMode();
    });
  }
  handleStartMode() {
    if (this.startMode === "focus" && !this.focusEventPending && !this.isDestroyed) {
      const formElement = findParentFormElement(this.e);
      if (formElement) {
        this.focusEventPending = true;
        executeOnceOnFocusInEvent(formElement, (ev) => {
          this.trigger("focus", { ev });
          this.focusEventPending = false;
        });
      }
    } else if (this.startMode === "auto") {
      this.trigger("auto");
    }
  }
  /**
   * Reset the widget, removing any progress.
   *
   * Optional argument: an object with the name of the trigger that caused the reset.
   * You would usually keep this empty. This is the `trigger` field in the `frc:widget.reset` event, which defaults to `root`.
   */
  reset(opts = { trigger: "root" }) {
    if (this.isDestroyed) throw new Error("Can not reset destroyed widget.");
    this.setState({ response: ".RESET", state: "reset", resetTrigger: opts.trigger });
    this._reset(opts);
    this.handleStartMode();
  }
  /**
   * Destroy the widget.
   *
   * This removes the `element` that the widget was mounted to as well as the hidden `frc-captcha-response` form field.
   */
  destroy() {
    this.isDestroyed = true;
    this.hiddenFormEl && this.hiddenFormEl.remove();
    this.hiddenFormEl = void 0;
    this.setState({ response: ".DESTROYED", state: "destroyed" });
    this._destroy();
  }
  /**
   * @internal
   */
  trigger(triggerType, data = {}) {
    if (this.isDestroyed) throw new Error("Can not start destroyed widget.");
    const trigger = getTrigger(triggerType, this.startMode, this.e, data.ev);
    this._trigger({ trigger });
  }
  /**
   * Trigger the widget to start a challenge.
   * The widget will start a challenge solving in the background.
   *
   * * In `interactive` mode, the user will need to click the widget to complete the process.
   * * In `noninteractive` mode, the widget will complete the process automatically.
   *
   */
  start() {
    this.trigger("programmatic");
  }
  /**
   * Sets the state of the widget, this is for internal use.
   * It is unlikely this is useful to call yourself.
   * @internal
   */
  setState(s) {
    const didStateChange = this.state !== s.state;
    this.response = s.response;
    this.state = s.state;
    if (this.hiddenFormEl && this.e.isConnected !== false) {
      this.hiddenFormEl.value = s.response;
    }
    if (didStateChange) {
      this.dispatchWidgetEvent({ name: "frc:widget.statechange", error: s.error, mode: s.mode });
    }
    if (this.state === "expired") {
      this.dispatchWidgetEvent({ name: "frc:widget.expire" });
    } else if (this.state === "completed") {
      this.dispatchWidgetEvent({ name: "frc:widget.complete" });
    } else if (this.state === "error") {
      this.dispatchWidgetEvent({ name: "frc:widget.error", error: s.error });
    } else if (this.state === "reset") {
      this.dispatchWidgetEvent({ name: "frc:widget.reset", trigger: s.resetTrigger });
    }
  }
  dispatchWidgetEvent(eventData) {
    const ed = {
      response: this.response,
      state: this.state,
      id: this.id
    };
    mergeObject(ed, eventData);
    fireFRCEvent(this.e, ed);
  }
  /**
   * Shorthand for `this.getElement().addEventListener`  (that is strictly typed in Typescript)
   */
  addEventListener(type, listener, options) {
    this.e.addEventListener(type, listener, options);
  }
  /**
   * Shorthand for `this.getElement().removeEventListener` (that is strictly typed in Typescript)
   */
  removeEventListener(type, listener, options) {
    this.e.removeEventListener(type, listener, options);
  }
  /**
   * The current state of the widget.
   */
  getState() {
    return this.state;
  }
  /**
   * The current response of the widget. This is the value that should be sent to the server and is embedded in HTML forms.
   */
  getResponse() {
    return this.response;
  }
  /**
   * The HTML element that contains the widget.
   */
  getElement() {
    return this.e;
  }
};

// src/signals/collectStacktrace.ts
var isFunc = function(value) {
  return typeof value === "function";
};
var patchNativeFunctions = function(opts) {
  const queue = [];
  const origPatchMap = /* @__PURE__ */ new Map();
  const takeRecords = function() {
    const records = queue.splice(0, queue.length);
    return records;
  };
  const w = window;
  const $window = (function getRealmSafely() {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      (document.body || document.head).appendChild(iframe);
      const $window2 = iframe ? iframe.contentWindow : 0;
      iframe.remove();
      return $window2 || w;
    } catch (e) {
      return w;
    }
  })();
  const originalFuncToString = Function.prototype.toString;
  const newFuncToString = function toString(...args) {
    const patchedRef = isFunc(this) ? origPatchMap.get(this) : false;
    const ref = this === newFuncToString ? originalFuncToString : patchedRef ? patchedRef : this;
    return originalFuncToString.apply(ref, args);
  };
  Function.prototype.toString = newFuncToString;
  const getStackSafely = function FC_DummyTrace() {
    const Error2 = $window.Error || w.Error;
    return Error2("FriendlyCaptcha_DummyTrace").stack || "";
  };
  const p = "prototype";
  const dispatchEvent = w.EventTarget ? w.EventTarget[p].dispatchEvent : {};
  const patches = [
    // Getters as non-function
    ["Document." + p + ".documentElement", w.Document[p], "documentElement"],
    ["Element." + p + ".shadowRoot", w.Element[p], "shadowRoot"],
    ["Node." + p + ".nodeType", w.Node[p], "nodeType"],
    // Values holding functions
    ["Object.is", w.Object, "is"],
    ["Array." + p + ".slice", w.Array[p], "slice"],
    ["Document." + p + ".querySelectorAll", w.Document[p], "querySelectorAll"],
    ["Document." + p + ".createElement", w.Document[p], "createElement"],
    ["EventTarget." + p + ".dispatchEvent", dispatchEvent, "dispatchEvent"]
  ];
  if (!opts.disableEvalPatching) {
    patches.push(["eval", w, "eval"]);
  }
  patches.forEach(function([name, target, prop]) {
    const descriptor = Object.getOwnPropertyDescriptor(target, prop);
    const hasGetterOrSetter = descriptor && (descriptor.get || descriptor.set);
    if (!descriptor) {
      return;
    } else if (hasGetterOrSetter) {
      if (!descriptor.get) {
        return;
      }
    } else {
      if (typeof descriptor.value !== "object" && typeof descriptor.value !== "function") {
        return;
      }
    }
    let l = 0, c = 0;
    const newAccessor = function fcPatch(...args) {
      const now = Date.now();
      if (now - l >= 1e3) {
        c = 0;
        l = now;
      }
      if (c < 50) {
        const record = {
          d: now,
          pnow: windowPerformanceNow(),
          n: name,
          st: getStackSafely()
        };
        if (queue.length > 2e4) {
          queue.splice(0, 1e3);
        }
        queue.push(record);
        c++;
      }
      return (hasGetterOrSetter ? descriptor.get : descriptor.value).apply(this, args);
    };
    try {
      const descriptorValue = hasGetterOrSetter ? descriptor.get ? descriptor.get() : void 0 : descriptor.value();
      if (descriptorValue) {
        newAccessor.length = descriptorValue.length;
        newAccessor.name = descriptorValue.name;
      }
    } catch (e) {
    }
    try {
      const newDescriptor = mergeObject({}, descriptor);
      if (hasGetterOrSetter) {
        newDescriptor.get = newAccessor;
      } else {
        newDescriptor.value = newAccessor;
      }
      Object.defineProperty(target, prop, newDescriptor);
      origPatchMap.set(newAccessor, hasGetterOrSetter ? descriptor.get : descriptor.value);
    } catch (e) {
    }
  });
  return takeRecords;
};

// src/signals/online.ts
function buildOnlineMetric() {
  const s = [0, 0, 0, 0, 0, 0, 0];
  return {
    s,
    add(x2) {
      const n = ++s[0];
      const d = x2 - s[1];
      const dN = d / n;
      const dN2 = dN * dN;
      const t1 = d * dN * (n - 1);
      s[1] += dN;
      s[4] += t1 * dN2 * (n * n - 3 * n + 3) + 6 * dN2 * s[2] - 4 * dN * s[3];
      s[3] += t1 * dN * (n - 2) - 3 * dN * s[2];
      s[2] += t1;
      if (n == 1) {
        s[5] = s[6] = x2;
      } else {
        if (x2 < s[5]) s[5] = x2;
        if (x2 > s[6]) s[6] = x2;
      }
    }
  };
}

// src/signals/collect.ts
var x = "addEventListener";
var M = Math;
var ssig;
function isAndroidUA() {
  return /Android/i.test(navigator.userAgent);
}
function onOffEventMetric(onEventName, offEventName, retrigger = false, target) {
  const m = buildOnlineMetric();
  let on = false;
  let ts;
  runOnDocumentLoaded(() => {
    target = target || document.body;
    target[x](onEventName, (ev) => {
      if (!on || retrigger) {
        ts = ev.timeStamp;
        on = true;
      }
    });
    target[x](offEventName, (ev) => {
      if (on) {
        m.add(ev.timeStamp - ts);
        on = false;
      }
    });
  });
  return m.s;
}
function eventCounts(events) {
  const out = [];
  for (let i = 0; i < events.length; i++) {
    out.push(0);
    document[x](events[i], (_) => out[i]++);
  }
  return out;
}
function keyCountMetric() {
  const out = [0, 0, 0, 0, 0, 0, 0, 0];
  const m = {
    8: 1,
    // Backspace
    46: 1,
    // Delete
    9: 2,
    // Tab
    45: 3,
    // Insert
    17: 4,
    // Control
    13: 5,
    // Enter
    37: 6,
    // Arrow keys
    38: 6,
    39: 6,
    40: 6,
    33: 7,
    // Page up/down
    34: 7
  };
  document[x]("keydown", (ev) => {
    const kc = ev.keyCode;
    if (m[kc]) {
      out[m[kc]]++;
    } else if (kc >= 112 && kc <= 123)
      out[0]++;
  });
  return out;
}
function euclidean2d(x0, x1, y0, y1) {
  return M.sqrt(M.pow(x0 - x1, 2) + M.pow(y0 - y1, 2));
}
function vector3Length(x2, y, z) {
  return M.sqrt(M.pow(x2, 2) + M.pow(y, 2) + M.pow(z, 2));
}
function deltaAngle(a, b) {
  let angle = b - a;
  angle += angle > 180 ? -360 : angle < -180 ? 360 : 0;
  return angle;
}
var Signals = class {
  constructor(opts) {
    /** Distinct touch event radius count */
    this.rn = 0;
    /** Counter */
    this.i = 0;
    this.smel = {
      n: 0,
      ts: 0,
      d: 0
    };
    const $ = "mouse";
    const sm = this.smel;
    const updateMouseEnterMouseLeave = (e) => {
      if (!sm.n) {
        sm.fts = e.timeStamp;
        sm.fxy = [e.clientX, e.clientY, e.screenX, e.screenY];
      }
      sm.n++;
      if (e.type === $ + "leave") {
        sm.d += e.timeStamp - sm.ts;
      }
      sm.ts = e.timeStamp;
      sm.xy = [e.clientX, e.clientY];
    };
    const d = document;
    runOnDocumentLoaded(() => {
      const b = d.body;
      b[x]($ + "enter", updateMouseEnterMouseLeave);
      b[x]($ + "leave", updateMouseEnterMouseLeave);
    });
    this.bh = {
      onoff: {
        kdu: onOffEventMetric("keydown", "keyup"),
        cse: onOffEventMetric("compositionstart", "compositionend"),
        mdu: onOffEventMetric($ + "down", $ + "up"),
        mle: onOffEventMetric($ + "leave", $ + "enter"),
        med: onOffEventMetric($ + "enter", $ + "down", true),
        semd: onOffEventMetric("scrollend", $ + "down", true, d),
        se: onOffEventMetric("scroll", "scrollend", false, d),
        pdc: onOffEventMetric("pointerdown", "pointercancel", true),
        mmc: onOffEventMetric($ + "move", "click", true),
        tse: onOffEventMetric("touchstart", "touchend"),
        fikd: onOffEventMetric("focusin", "keydown", true)
      },
      nev: eventCounts([
        $ + "out",
        "pointercancel",
        "focus",
        "focusin",
        "blur",
        "visibilitychange",
        "copy",
        "paste",
        "cut",
        "contextmenu",
        "click",
        "auxclick",
        "wheel",
        "resize"
      ]),
      nk: keyCountMetric(),
      mov: this.setupMovementMetrics(),
      dm: this.setupMotionMetrics(),
      do: this.setupOrientationMetrics()
    };
    this.dep = opts.disableEvalPatching || false;
    this.takeTraceRecords = patchNativeFunctions(opts);
  }
  setupMovementMetrics() {
    let intervalHandle = void 0;
    let sample = [];
    const interval = 50;
    const duration = buildOnlineMetric();
    const distance = buildOnlineMetric();
    const vel = buildOnlineMetric();
    const out = {
      t: duration.s,
      v: vel.s,
      d: distance.s,
      ns: 0
    };
    const updateFunc = () => {
      const lastSample = sample[sample.length - 1];
      if (sample.length >= 1e4 / interval || // A reasonable upper bound
      lastSample && (lastSample[0] && this.tm.timeStamp === lastSample[1] || // Last sample was touch and timestamp is unchanged.
      !lastSample[0] && this.mm.timeStamp === lastSample[1])) {
        clearInterval(intervalHandle);
        intervalHandle = void 0;
        if (sample.length === 1) {
          out.ns++;
          sample = [];
          return;
        }
        const firstSample = sample[0];
        duration.add(lastSample[1] - firstSample[1]);
        distance.add(euclidean2d(lastSample[2], firstSample[2], lastSample[3], firstSample[3]));
        for (let i = 1; i < sample.length; i++) {
          const c = sample[i];
          const p = sample[i - 1];
          const dist = euclidean2d(c[2], p[2], c[3], p[3]) * 1e3;
          const dt = c[1] - p[1];
          vel.add(dist / dt);
        }
        sample = [];
        return;
      }
      let evType = 0;
      if (lastSample) evType = lastSample[0];
      else if (this.mm && this.tm)
        evType = this.mm.timeStamp > this.tm.timeStamp ? 0 : 1;
      else if (!this.mm) evType = 1;
      if (evType) {
        const t = this.tm.touches[0];
        t && sample.push([1, this.tm.timeStamp, t.screenX, t.screenY]);
      } else {
        sample.push([0, this.mm.timeStamp, this.mm.screenX, this.mm.screenY]);
      }
    };
    let lastRadius = -1;
    runOnDocumentLoaded(() => {
      const b = document.body;
      b[x]("mousemove", (e) => {
        this.mm = e;
        if (intervalHandle === void 0) {
          updateFunc();
          intervalHandle = setInterval(updateFunc, interval);
        }
      });
      b[x]("touchmove", (e) => {
        this.tm = e;
        const t = e.touches[0];
        if (t) {
          const newRadius = t.radiusX + t.radiusY * 1.234;
          if (newRadius !== lastRadius) {
            lastRadius = newRadius;
            this.rn++;
          }
        }
        if (intervalHandle === void 0) {
          updateFunc();
          intervalHandle = setInterval(updateFunc, interval);
        }
      });
    });
    return out;
  }
  /**
   * @internal
   */
  setupMotionMetrics() {
    const acc = buildOnlineMetric();
    const rr = buildOnlineMetric();
    const sig = {
      n: 0,
      ts: 0,
      ac: acc.s,
      rr: rr.s,
      i: 0,
      g: false
    };
    if (!isAndroidUA()) {
      return sig;
    }
    window[x]("devicemotion", (e) => {
      sig.ts = e.timeStamp;
      sig.i = e.interval;
      sig.g = !e.acceleration;
      const a = e.acceleration || e.accelerationIncludingGravity;
      if (a) {
        acc.add(vector3Length(a.x, a.y, a.z));
      }
      const r = e.rotationRate;
      if (r) {
        rr.add(vector3Length(r.alpha, r.beta, r.gamma));
      }
    });
    return sig;
  }
  /**
   * @internal
   */
  setupOrientationMetrics() {
    const gd = buildOnlineMetric();
    const bd = buildOnlineMetric();
    const sig = {
      fts: 0,
      ts: 0,
      gd: gd.s,
      bd: bd.s
    };
    if (!isAndroidUA()) {
      return sig;
    }
    let hasPrevious;
    window[x]("deviceorientation", (e) => {
      if (e.gamma == null || e.beta == null || e.alpha == null) return;
      sig.ts = e.timeStamp;
      sig.a = e.alpha;
      sig.b = e.beta;
      sig.g = e.gamma;
      if (!hasPrevious) {
        sig.fts = sig.ts;
        hasPrevious = true;
      } else {
        gd.add(deltaAngle(e.gamma, sig.g));
        bd.add(deltaAngle(sig.b, e.beta));
      }
    });
    return sig;
  }
  /**
   * @internal
   */
  gmm() {
    const e = this.mm;
    return e && {
      xy: [
        e.clientX,
        e.clientY,
        e.screenX,
        e.screenY,
        e.offsetX,
        e.offsetY,
        e.pageX,
        e.pageY,
        e.movementX,
        e.movementY
      ],
      ts: e.timeStamp
    };
  }
  /**
   * @internal
   */
  gtm() {
    const tm = this.tm;
    const tt = tm && tm.touches;
    const tm0 = tt && tt[0];
    return tm && tm0 && {
      id: tm0.identifier,
      xy: [tm0.clientX, tm0.clientY, tm0.screenX, tm0.screenY, tm0.pageX, tm0.pageY],
      r: [tm0.radiusX, tm0.radiusX, tm0.rotationAngle, tm0.force],
      n: tt.length,
      ts: tm.timeStamp,
      rn: this.rn
    };
  }
  /**
   * @internal
   */
  get(widgetId) {
    const b = document.body;
    const w = window;
    const p = w.performance;
    const sig = {
      v: 1,
      i: ++this.i,
      hl: history.length,
      fe: !!window.frameElement,
      dep: this.dep,
      wid: widgetId,
      sc: parseInt(sessionCount(false)),
      sid: sessionId(),
      conv: 0,
      t: {
        pnow: windowPerformanceNow(),
        pto: p && p.timeOrigin || 0,
        ts: Date.now()
      },
      dims: {
        d: [
          w.innerWidth,
          w.innerHeight,
          w.outerWidth,
          w.outerHeight,
          w.screenX,
          w.screenY,
          w.pageXOffset,
          w.pageYOffset,
          b.clientWidth,
          b.clientHeight
        ],
        dpr: w.devicePixelRatio
      },
      mel: this.smel,
      mm: this.gmm(),
      tm: this.gtm(),
      bh: this.bh,
      stack: new Error().stack || "",
      trc: this.takeTraceRecords()
    };
    return sig;
  }
};
function getSignals(opts) {
  return ssig || (ssig = new Signals(opts));
}

// src/sdk/options.ts
var toFRCAPIUrl = (hosts) => hosts.map((h) => `https://${h}.frcapi.com`).join(",");
var SHORTHANDS = {
  eu: toFRCAPIUrl(["eu", "eu0", "eu1"]),
  global: toFRCAPIUrl(["global", "global0", "global1"])
};
var splitCSV = (value) => value.split(",").map((v) => v.trim()).filter((v) => !!v);
var expandEndpointShorthand = (value) => splitCSV(SHORTHANDS[value] || value);
function resolveAPIOrigins(optionValue) {
  const endpointList = optionValue || SHORTHANDS.global;
  const resolved = splitCSV(endpointList).reduce((acc, endpoint) => acc.concat(expandEndpointShorthand(endpoint)), []).map(originOf);
  if (resolved.length > 0) {
    return resolved;
  }
  return splitCSV(SHORTHANDS.global).map(originOf);
}
function getSDKDisableEvalPatching() {
  const m = document.querySelector(`meta[name="frc-disable-eval-patching"]`);
  if (!m) return false;
  return !!m.content;
}
function getSDKAPIEndpoint() {
  const m = document.querySelector(`meta[name="frc-api-endpoint"]`);
  if (m) return m.content;
  const cs = document.currentScript;
  if (cs) {
    const endpoint = cs.dataset["frcApiEndpoint"];
    if (endpoint) return endpoint;
  }
  const we = document.querySelector(".frc-captcha[data-api-endpoint]");
  if (we) {
    const endpoint = we.dataset["apiEndpoint"];
    if (endpoint) return endpoint;
  }
  return void 0;
}

// src/util/tz.ts
function tz() {
  const intl = window.Intl;
  if (!intl || !intl.DateTimeFormat) {
    return;
  }
  const dtf = new intl.DateTimeFormat();
  if (!dtf || !dtf.resolvedOptions) {
    return;
  }
  return dtf.resolvedOptions().timeZone;
}

// src/util/encode.ts
var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function encodeStringToBase64Url(str) {
  if (!window.TextEncoder) {
    return "";
  }
  return encodeBase64Url(new TextEncoder().encode(str));
}
function encodeBase64Url(bytes) {
  const len = bytes.length;
  let base64 = "";
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i + 0];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    let t = "";
    t += CHARS.charAt(b0 >>> 2);
    t += CHARS.charAt((b0 & 3) << 4 | b1 >>> 4);
    t += CHARS.charAt((b1 & 15) << 2 | b2 >>> 6);
    t += CHARS.charAt(b2 & 63);
    base64 += t;
  }
  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }
  return base64;
}

// src/sdk/riskIntelligenceHandle.ts
var DEFAULT_FORM_FIELD_NAME2 = "frc-risk-intelligence-token";
var RiskIntelligenceHandle = class {
  /**
   * This class is only instantiated by the SDK by calling FriendlyCaptchaSDK.attach()
   * Do not create a handle manually.
   *
   * @internal
   */
  constructor(opts) {
    /**
     * A timeout ID used for firing an expiration event when this handle's
     * token expires.
     */
    this.timeout = null;
    this.data = null;
    this.e = opts.element;
    if (!this.e) throw new Error("No element provided for mounting Risk Intelligence handle.");
    this.e.frcRiskIntelligence = this;
    this.formFieldName = opts.formFieldName === void 0 ? DEFAULT_FORM_FIELD_NAME2 : opts.formFieldName;
    if (this.formFieldName !== null) {
      this.hiddenFormEl = createManagedInputElement(this.e, this.formFieldName);
    }
    this.startMode = opts.startMode || "focus";
    this.requestRiskIntelligence = opts.riskIntelligence;
    this.handleStartMode();
  }
  handleStartMode() {
    if (this.startMode === "none") {
      console.warn('Risk Intelligence <div> found with data-start="none" (no-op), skipping...', this.e);
    } else if (this.startMode === "auto") {
      this.request();
    } else {
      const parentForm = findParentFormElement(this.e);
      if (!parentForm) {
        console.warn(
          'Risk Intelligence <div> with startMode of "focus" found without a parent <form> element, skipping...',
          this.e
        );
      } else {
        executeOnceOnFocusInEvent(parentForm, () => {
          this.request();
        });
      }
    }
  }
  request() {
    this.requestRiskIntelligence().then((data) => {
      if (this.timeout !== null) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        fireFRCEvent(this.e, {
          name: "frc:riskintelligence.expire"
        });
      }, data.expiresAt - Date.now());
      this.data = {
        token: data.token,
        expiresAt: data.expiresAt
      };
      if (this.hiddenFormEl) {
        this.hiddenFormEl.value = data.token;
      }
      fireFRCEvent(this.e, {
        name: "frc:riskintelligence.complete",
        token: data.token,
        expiresAt: data.expiresAt
      });
    }).catch((error) => {
      fireFRCEvent(this.e, {
        name: "frc:riskintelligence.error",
        error: {
          code: error.code,
          detail: error.detail
        }
      });
    });
  }
  /**
   * @returns Risk Intelligence data if request is done and `null` if not.
   */
  getData() {
    return this.data;
  }
  /**
   * @returns The HTML element used to configure the Risk Intelligence request.
   */
  getElement() {
    return this.e;
  }
  /**
   * Shorthand for `this.getElement().addEventListener`  (that is strictly typed in Typescript)
   */
  addEventListener(type, listener, options) {
    this.e.addEventListener(type, listener, options);
  }
  /**
   * Shorthand for `this.getElement().removeEventListener` (that is strictly typed in Typescript)
   */
  removeEventListener(type, listener, options) {
    this.e.removeEventListener(type, listener, options);
  }
};

// src/sdk/retry.ts
function getRetryOrigins(origins) {
  if (origins.length === 0) return [];
  return [origins[0]].concat(shuffledCopy(origins.slice(1)));
}
function getRetryOriginIndex(attemptNumber, retryOrigins) {
  const retryOriginsLength = retryOrigins.length;
  if (retryOriginsLength === 0) return -1;
  if (attemptNumber <= 2 || retryOriginsLength === 1) return 0;
  const fallbackCount = retryOriginsLength - 1;
  const fallbackAttempt = attemptNumber - 2;
  if (fallbackAttempt <= fallbackCount) {
    return fallbackAttempt;
  }
  return 1 + Math.floor(Math.random() * fallbackCount);
}
function getRetrySrc(src, nextOrigin, retryCount) {
  const srcOrigin = originOf(src);
  const normalizedNextOrigin = originOf(nextOrigin);
  let pathAndQuery = stringHasPrefix(src, srcOrigin) ? src.slice(srcOrigin.length) : src;
  if (pathAndQuery.length === 0) {
    pathAndQuery = "/";
  } else if (!stringHasPrefix(pathAndQuery, "/")) {
    pathAndQuery = "/" + pathAndQuery;
  }
  const separator = pathAndQuery.indexOf("?") === -1 ? "?" : "&";
  return normalizedNextOrigin + pathAndQuery + separator + "retry=" + retryCount;
}

// src/sdk/sdk.ts
var agentEndpoint = "/api/v2/captcha/agent";
var widgetEndpoint = "/api/v2/captcha/widget";
var FRAME_ID_DATASET_FIELD2 = "FrcFrameId";
var AGENT_ORIGIN_KEY_DATASET_FIELD = "FrcAgentOriginKey";
var IFRAME_EXP_TIME = 1e3 * 60 * 60 * 36;
var MAX_IFRAME_LOAD_ATTEMPTS = 5;
var cbus;
var sdkC = 0;
var FriendlyCaptchaSDK = class {
  constructor(opts = {}) {
    /**
     * Multiple agents may be running at the same time, this is the case if someone uses widgets with different endpoints on a single page.
     * This is a mapping from the origin to the IFrame.
     */
    this.agents = /* @__PURE__ */ new Map();
    /**
     * A mapping from the agent ID to its local state.
     */
    this.agentState = /* @__PURE__ */ new Map();
    /**
     * Mapping of widget ID to the widget handle.
     */
    this.widgets = /* @__PURE__ */ new Map();
    this._attached = flatPromise();
    /**
     * A promise that resolves to all the widgets that are currently attached.
     * @public
     */
    this.attached = this._attached.promise;
    /**
     * A mapping of random IDs to promises that resolve to a risk intelligence
     * token generation response. Each call to `riskIntelligence()` will return
     * a promise that gets a unique ID. The mapping is used for tying the agent
     * message to its reply.
     */
    this.riskIntelligencePromises = /* @__PURE__ */ new Map();
    /**
     * A mapping of random IDs to promises that resolve when a risk intelligence
     * clear request completes. Each call to `clearRiskIntelligence()`  will return
     * a promise that gets a unique ID. The mapping is used for tying the agent message
     * to its reply.
     */
    this.clearRiskIntelligencePromises = /* @__PURE__ */ new Map();
    /**
     * A list of handles (objects that manage a Risk Intelligence DOM element)
     * associated with the SDK instance.
     */
    this.riskIntelligenceHandles = [];
    this.apiEndpoint = opts.apiEndpoint;
    cbus = cbus || new CommunicationBus();
    cbus.listen((msg) => this.onReceiveMessage(msg));
    this.bus = cbus;
    sdkC++;
    if (sdkC > 1) {
      console.warn(
        "Multiple Friendly Captcha SDKs created, this is not recommended. Please use a single SDK instance."
      );
    }
    this.signals = getSignals({
      disableEvalPatching: opts.disableEvalPatching || getSDKDisableEvalPatching()
    });
    if (opts.startAgent) {
      const origins = resolveAPIOrigins(this.apiEndpoint || getSDKAPIEndpoint());
      const retryOrigins = this.getRetryOrigins(origins);
      this.ensureAgentIFrame(retryOrigins);
    }
    this.setupPeriodicRefresh();
  }
  getRetryOrigins(origins) {
    return getRetryOrigins(origins);
  }
  onReceiveMessage(msg) {
    if (msg.type === "root_set_response") {
      const w = this.widgets.get(msg.widget_id);
      if (!w) {
        if (sdkC === 1) {
          console.warn(`Received set response message for widget ${msg.widget_id} that doesn't exist`);
        }
        return;
      }
      w.setState(msg);
    } else if (stringHasPrefix(msg.type, "root_store")) {
      this.handleStoreMessage(msg);
    } else if (msg.type === "root_signals_get") {
      this.handleSignalsGetMessage(msg);
    } else if (msg.type === "widget_language_change") {
      this.handleWidgetLanguageChange(msg);
    } else if (msg.type === "widget_reset") {
      const w = this.widgets.get(msg.from_id);
      if (!w) {
        if (sdkC === 1) {
          console.warn(`Received reset message for widget ${msg.from_id} that doesn't exist`);
        }
        return;
      }
      w.reset({ trigger: "widget" });
    } else if (stringHasPrefix(msg.type, "root_risk_intelligence")) {
      this.handleRiskIntelligenceMessage(msg);
    }
  }
  handleRiskIntelligenceMessage(msg) {
    if (msg.type === "root_risk_intelligence_generate_reply") {
      const promise = this.riskIntelligencePromises.get(msg.uid);
      if (promise) {
        if (msg.data) {
          promise.resolve(msg.data);
        } else if (msg.error) {
          promise.reject(msg.error);
        } else {
          console.warn("Received risk intelligence generate reply message with no data");
        }
        this.riskIntelligencePromises.delete(msg.uid);
      } else {
        console.warn("Received risk intelligence generate reply message with no promise to resolve");
      }
    } else if (msg.type === "root_risk_intelligence_clear_reply") {
      const promise = this.clearRiskIntelligencePromises.get(msg.uid);
      if (promise) {
        if (msg.error) {
          promise.reject(msg.error);
        } else {
          promise.resolve();
        }
      } else {
        console.warn("Received risk intelligence clear reply message with no promise to resolve");
      }
      this.clearRiskIntelligencePromises.delete(msg.uid);
    }
  }
  handleWidgetLanguageChange(msg) {
    const w = this.widgets.get(msg.from_id);
    if (!w) {
      if (sdkC === 1) {
        console.warn(`Received language change message for widget ${msg.from_id} that doesn't exist`);
      }
      return;
    }
    const element = w.getElement();
    const iframe = element.querySelector("iframe");
    if (iframe) {
      iframe.title = getLocalizedWidgetTitle(msg.language);
    }
    const banner = element.querySelector(".frc-banner");
    if (banner) {
      const bs = banner.style;
      if (isRTLLanguage(msg.language)) {
        bs.left = "6px";
        bs.right = "auto";
      } else {
        bs.left = "auto";
        bs.right = "6px";
      }
    }
  }
  handleSignalsGetMessage(msg) {
    const sigs = this.signals.get(msg.widget_id);
    this.bus.send({
      type: "root_signals_get_reply",
      from_id: "",
      to_id: msg.from_id,
      _frc: 1,
      rid: msg.rid,
      value: sigs
    });
  }
  handleStoreMessage(msg) {
    const from = msg.from_id;
    const s = this.agentState.get(from);
    if (!s) {
      console.error(`Store not found ${from}`);
      return;
    }
    if (msg.type === "root_store_get") {
      this.bus.send({
        type: "root_store_get_reply",
        from_id: "",
        to_id: from,
        _frc: 1,
        rid: msg.rid,
        value: s.store.get(msg.key),
        sa: true
        // Backwards compatibility: we always say that storage access is possible.
      });
    } else if (msg.type === "root_store_set") {
      s.store.set(msg.key, msg.value);
      this.bus.send({
        type: "root_store_set_reply",
        from_id: "",
        to_id: from,
        _frc: 1,
        rid: msg.rid,
        sa: true
        // Backwards compatibility: we always say that storage access is possible.
      });
    }
  }
  /**
   * Ensures an agent iframe exists for the configured primary origin in `retryOrigins`.
   *
   * Reuses an existing iframe when possible (within this SDK instance and across SDK
   * instances on the same page), otherwise creates and registers a new one with retry
   * failover across `retryOrigins`.
   *
   * @param retryOrigins - Ordered retry origins with the primary origin at index 0.
   * @returns String - The agent ID for the reused or newly created iframe.
   */
  ensureAgentIFrame(retryOrigins) {
    let attempt = 1;
    const originIndex = getRetryOriginIndex(attempt, retryOrigins);
    const origin = retryOrigins[originIndex];
    const src = origin + agentEndpoint;
    const maxAttempts = MAX_IFRAME_LOAD_ATTEMPTS;
    const existing = this.agents.get(origin);
    if (existing && existing.dataset[FRAME_ID_DATASET_FIELD2]) {
      return existing.dataset[FRAME_ID_DATASET_FIELD2];
    }
    let agentIFrames = document.getElementsByClassName(AGENT_FRAME_CLASSNAME);
    for (let index = 0; index < agentIFrames.length; index++) {
      const i = agentIFrames[index];
      if (i.dataset[AGENT_ORIGIN_KEY_DATASET_FIELD] === origin && i.dataset[FRAME_ID_DATASET_FIELD2]) {
        this.agents.set(origin, i);
        return i.dataset[FRAME_ID_DATASET_FIELD2];
      }
    }
    const agentId = "a_" + randomId(12);
    const el = createAgentIFrame(this, agentId, src);
    el.dataset[AGENT_ORIGIN_KEY_DATASET_FIELD] = origin;
    const initialSrc = el.src;
    let currentOrigin = origin;
    this.agents.set(origin, el);
    this.agentState.set(agentId, { store: new Store(origin), origin });
    document.body.appendChild(el);
    const registerWithRetry = () => {
      this.bus.registerTargetIFrame("agent", agentId, el, this.getRetryTimeout(attempt)).then((status) => {
        if (status === "timeout") {
          if (attempt >= maxAttempts) {
            console.error(`[Friendly Captcha] Failed to load agent iframe after ${attempt - 1} retries.`);
            el.remove();
            this.agents.delete(origin);
            return;
          }
          const nextAttempt = attempt + 1;
          const nextIndex = getRetryOriginIndex(nextAttempt, retryOrigins);
          currentOrigin = retryOrigins[nextIndex] || currentOrigin;
          console.warn("[Friendly Captcha] Retrying agent iframe load.");
          el.src = getRetrySrc(initialSrc, currentOrigin, nextAttempt - 1);
          attempt = nextAttempt;
          registerWithRetry();
        }
      });
    };
    registerWithRetry();
    return agentId;
  }
  /**
   * @internal
   */
  setupPeriodicRefresh() {
    let count = 1;
    setInterval(() => {
      const e = "&expire=" + count++;
      this.agents.forEach((el, origin) => {
        el.src += e;
      });
      this.widgets.forEach((w, id) => {
        const iframe = w.getElement().querySelector("iframe");
        iframe.src += e;
      });
    }, IFRAME_EXP_TIME);
  }
  /**
   * @internal
   */
  getRetryTimeout(retryLoadCounter) {
    return (1.5 + Math.pow(retryLoadCounter, 1.8)) * 1e3;
  }
  /**
   * Attaches a widget to given element or elements if they are not attached to yet.
   *
   * You can pass one or more HTML elements to attach to, or undefined. If `undefined` is passed, the HTML page is scanned
   * for unattached widget elements (= elements with the `frc-captcha` class).
   *
   * Returns handles to the newly-attached elements.
   * @public
   */
  attach(elements) {
    const [captchaElements, riskIntelligenceElements] = findFRCElements();
    for (let index = 0; index < riskIntelligenceElements.length; index++) {
      const hElement = riskIntelligenceElements[index];
      if (hElement && !hElement.frcRiskIntelligence) {
        const ds = hElement.dataset;
        const sitekey = ds.sitekey;
        if (!sitekey) {
          console.warn("Risk Intelligence <div> found with no sitekey, skipping...", hElement);
          continue;
        }
        this.riskIntelligenceHandles.push(
          new RiskIntelligenceHandle({
            element: hElement,
            formFieldName: ds.formFieldName,
            startMode: ds.start,
            riskIntelligence: () => {
              return this.riskIntelligence({
                sitekey,
                apiEndpoint: ds.apiEndpoint
              });
            }
          })
        );
      }
    }
    if (elements === void 0) {
      elements = captchaElements;
    }
    if (!(Array.isArray(elements) || elements instanceof NodeList)) {
      elements = [elements];
    }
    const newWidgets = [];
    for (let index = 0; index < elements.length; index++) {
      const hElement = elements[index];
      if (hElement && !hElement.frcWidget) {
        const ds = hElement.dataset;
        const opts = {
          element: hElement,
          sitekey: ds.sitekey,
          formFieldName: ds.formFieldName,
          apiEndpoint: ds.apiEndpoint,
          language: ds.lang,
          theme: ds.theme,
          // Perhaps we should we check for valid values?
          startMode: ds.start
          // Perhaps we should we check for valid values?
        };
        newWidgets.push(this.createWidget(opts));
      }
    }
    const allWidgets = this.getAllWidgets();
    this._attached.resolve(allWidgets);
    this.attached = Promise.resolve(allWidgets);
    return newWidgets;
  }
  /**
   * Creates a Friendly Captcha widget with given options under given HTML element.
   * @public
   */
  createWidget(opts) {
    const origins = resolveAPIOrigins(opts.apiEndpoint || this.apiEndpoint || getSDKAPIEndpoint());
    const retryOrigins = this.getRetryOrigins(origins);
    let attempt = 1;
    this.bus.addOrigins(origins);
    const origin = retryOrigins[getRetryOriginIndex(attempt, retryOrigins)] || origins[0];
    const agentId = this.ensureAgentIFrame(retryOrigins);
    const widgetId = "w_" + randomId(12);
    const send = (msg) => {
      const msgToSend = { from_id: widgetId, to_id: agentId, _frc: 1 };
      this.bus.send(mergeObject(msgToSend, msg));
    };
    const callbacks = {
      onDestroy: () => {
        send({ type: "root_destroy_widget" });
        this.bus.removeTarget(widgetId);
        this.widgets.delete(widgetId);
        opts.element.innerHTML = "";
        removeWidgetRootStyles(opts.element);
      },
      onReset: () => {
        send({ type: "root_reset_widget" });
      },
      onTrigger: (data) => {
        send({ type: "root_trigger_widget", trigger: data.trigger });
      }
    };
    const registered = flatPromise();
    const widgetHandle = new WidgetHandle({
      id: widgetId,
      createOpts: opts,
      callbacks,
      registered: registered.promise
    });
    this.widgets.set(widgetId, widgetHandle);
    const widgetUrl = origin + widgetEndpoint;
    const wel = createWidgetIFrame(agentId, widgetId, widgetUrl, opts);
    const maxAttempts = MAX_IFRAME_LOAD_ATTEMPTS;
    const initialSrc = wel.src;
    let currentOrigin = origin;
    const widgetPlaceholder = createWidgetPlaceholder(opts);
    setWidgetRootStyles(opts.element);
    createBanner(opts);
    let language = getLanguageFromOptionsOrParent(opts);
    if (isRTLLanguage(language)) {
      opts.element.dir = "rtl";
    }
    const widgetPlaceholderStyle = widgetPlaceholder.style;
    widgetPlaceholder.textContent = getLocalizedPlaceholderText(language, "connecting");
    function setUnreachableState(detail) {
      const debugString = encodeStringToBase64Url(
        JSON.stringify({
          sdk_v: "1.0.0",
          sitekey: opts.sitekey || "",
          retry: attempt + "",
          endpoint: currentOrigin,
          ua: navigator.userAgent,
          tz: tz() || ""
        })
      );
      let resp = ".ERROR.UNREACHABLE";
      if (debugString) {
        resp += "~" + debugString;
      }
      widgetHandle.setState({
        state: "error",
        response: resp,
        error: { code: "network_error", detail }
      });
    }
    const registerWithRetry = () => {
      this.bus.registerTargetIFrame("widget", widgetId, wel, this.getRetryTimeout(attempt)).then((status) => {
        if (status === "timeout") {
          if (attempt >= maxAttempts) {
            console.error(`[Friendly Captcha] Failed to load widget iframe after ${attempt - 1} retries.`);
            setUnreachableState("Widget load timeout, stopped retrying");
            widgetPlaceholderStyle.borderColor = "#f00";
            widgetPlaceholderStyle.fontSize = "12px";
            createFallback(widgetPlaceholder, originOf(wel.src), language);
            return;
          }
          const nextAttempt = attempt + 1;
          const nextIndex = getRetryOriginIndex(nextAttempt, retryOrigins);
          currentOrigin = retryOrigins[nextIndex] || currentOrigin;
          widgetPlaceholderStyle.backgroundColor = "#fee";
          widgetPlaceholderStyle.color = "#222";
          widgetPlaceholder.textContent = getLocalizedPlaceholderText(language, "retrying") + ` (${attempt})`;
          console.warn(`[Friendly Captcha] Retrying widget ${widgetId} iframe load.`);
          setUnreachableState("Widget load timeout, will retry");
          wel.src = getRetrySrc(initialSrc, currentOrigin, nextAttempt - 1);
          attempt = nextAttempt;
          registerWithRetry();
        } else if (status === "registered") {
          opts.element.removeChild(widgetPlaceholder);
          wel.style.display = "";
        }
      });
    };
    registerWithRetry();
    registered.resolve();
    return widgetHandle;
  }
  /**
   * Creates a Risk Intelligence token generation request, returning a Promise that resolves
   * to the generated token.
   *
   * @public
   */
  riskIntelligence(opts) {
    const origins = resolveAPIOrigins(opts.apiEndpoint || this.apiEndpoint || getSDKAPIEndpoint());
    const retryOrigins = this.getRetryOrigins(origins);
    this.bus.addOrigins(origins);
    const agentId = this.ensureAgentIFrame(retryOrigins);
    const uid = randomId(8);
    this.bus.send({
      type: "root_risk_intelligence_generate",
      to_id: agentId,
      from_id: "",
      _frc: 1,
      sitekey: opts.sitekey,
      bypassCache: opts.bypassCache || false,
      uid
    });
    const riskIntelligencePromise = flatPromise();
    this.riskIntelligencePromises.set(uid, riskIntelligencePromise);
    return riskIntelligencePromise.promise;
  }
  /**
   * Clears cached Risk Intelligence tokens. Cached tokens for a given sitekey can be cleared
   * by specifying it; if a sitekey is not specified, all tokens will be cleared from the cache.
   *
   * @public
   */
  clearRiskIntelligence(opts) {
    const origins = resolveAPIOrigins((opts == null ? void 0 : opts.apiEndpoint) || this.apiEndpoint || getSDKAPIEndpoint());
    const retryOrigins = this.getRetryOrigins(origins);
    this.bus.addOrigins(origins);
    const agentId = this.ensureAgentIFrame(retryOrigins);
    const uid = randomId(8);
    this.bus.send({
      type: "root_risk_intelligence_clear",
      to_id: agentId,
      from_id: "",
      _frc: 1,
      sitekey: opts == null ? void 0 : opts.sitekey,
      uid
    });
    const clearRiskIntelligencePromise = flatPromise();
    this.clearRiskIntelligencePromises.set(uid, clearRiskIntelligencePromise);
    return clearRiskIntelligencePromise.promise;
  }
  /**
   * Returns all current widgets known about (in an unspecified order).
   * @public
   */
  getAllWidgets() {
    const out = [];
    this.widgets.forEach((w) => {
      out.push(w);
    });
    return out;
  }
  /**
   * Retrieves a widget by its widget ID.
   * @public
   */
  getWidgetById(id) {
    return this.widgets.get(id);
  }
  /**
   * Returns all current Risk Intelligence handles known about (in an unspecified order).
   * @public
   */
  getAllRiskIntelligenceHandles() {
    const out = [];
    this.riskIntelligenceHandles.forEach((rih) => {
      out.push(rih);
    });
    return out;
  }
  /**
   * Completely remove all widgets and background agents related to the SDK on this page.
   * @public
   */
  clear() {
    this.widgets.forEach((w) => {
      w.destroy();
    });
    this.agents.forEach((el) => {
      el.remove();
    });
    this.agents.clear();
  }
};

// src/sdk/events.ts
var FRCWidgetStateChangeEventName = "frc:widget.statechange";
var FRCWidgetCompleteEventName = "frc:widget.complete";
var FRCWidgetExpireEventName = "frc:widget.expire";
var FRCWidgetErrorEventName = "frc:widget.error";
var FRCWidgetResetEventName = "frc:widget.reset";
var FRCRiskIntelligenceCompleteEventName = "frc:riskintelligence.complete";
var FRCRiskIntelligenceErrorEventName = "frc:riskintelligence.error";
var FRCRiskIntelligenceExpireEventName = "frc:riskintelligence.expire";
/*!
 * Copyright (c) Friendly Captcha GmbH 2023.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/*!
 * Copyright (c) Friendly Captcha GmbH 2026.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
