function isNil(value) {
  return value === null || value === void 0;
}
const WIX_SDK_ERROR_TEXT = "Wix code SDK error:";
const reportError = (message) => {
  console.error(`${WIX_SDK_ERROR_TEXT} ${message}`);
};
const types = {
  IMAGE: "image",
  DOCUMENT: "document",
  VIDEO: "video",
  AUDIO: "audio",
  VECTOR: "vector"
};
const errors = {
  empty_media_id: "empty_media_id",
  empty_poster_id: "empty_poster_id",
  bad_media_id: "bad_media_id",
  unknown_media_type: "unknown_media_type",
  missing_width_height: "missing_width_height",
  non_string_media_id: "non_string_media_id"
};
const snakeToCamel = (str) => str.toLowerCase().replace(/(^_+)|(_+$)/g, "").replace(/_+([^_])/g, (_, match) => match.toUpperCase());
const alignTypes = {
  CENTER: "center",
  TOP: "top",
  TOP_LEFT: "top_left",
  TOP_RIGHT: "top_right",
  BOTTOM: "bottom",
  BOTTOM_LEFT: "bottom_left",
  BOTTOM_RIGHT: "bottom_right",
  LEFT: "left",
  RIGHT: "right"
};
const imageFilters = {
  CONTRAST: "contrast",
  BRIGHTNESS: "brightness",
  SATURATION: "saturation",
  HUE: "hue",
  BLUR: "blur"
};
function template(strings, ...keys) {
  return function(...values) {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach(function(key, i) {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
}
function populateGlobalFeatureSupport() {
  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
  }
}
template`fit/w_${"width"},h_${"height"}`;
template`fill/w_${"width"},h_${"height"},al_${"alignment"}`;
template`fill/w_${"width"},h_${"height"},fp_${"focalPointX"}_${"focalPointY"}`;
template`crop/x_${"x"},y_${"y"},w_${"width"},h_${"height"}`;
template`crop/w_${"width"},h_${"height"},al_${"alignment"}`;
template`fill/w_${"width"},h_${"height"},al_${"alignment"}`;
template`,lg_${"upscaleMethodValue"}`;
template`,q_${"quality"}`;
template`,quality_auto`;
template`,usm_${"radius"}_${"amount"}_${"threshold"}`;
template`,bl`;
template`,wm_${"watermark"}`;
({
  [imageFilters.CONTRAST]: template`,con_${"contrast"}`,
  [imageFilters.BRIGHTNESS]: template`,br_${"brightness"}`,
  [imageFilters.SATURATION]: template`,sat_${"saturation"}`,
  [imageFilters.HUE]: template`,hue_${"hue"}`,
  [imageFilters.BLUR]: template`,blur_${"blur"}`
});
template`,enc_auto`;
template`,enc_avif`;
template`,enc_pavif`;
template`,pstr`;
template`,anm_all`;
const ALIGN_TYPE_TO_POSITION = {
  [alignTypes.CENTER]: "50% 50%",
  [alignTypes.TOP_LEFT]: "0% 0%",
  [alignTypes.TOP_RIGHT]: "100% 0%",
  [alignTypes.TOP]: "50% 0%",
  [alignTypes.BOTTOM_LEFT]: "0% 100%",
  [alignTypes.BOTTOM_RIGHT]: "100% 100%",
  [alignTypes.BOTTOM]: "50% 100%",
  [alignTypes.RIGHT]: "100% 50%",
  [alignTypes.LEFT]: "0% 50%"
};
Object.entries(ALIGN_TYPE_TO_POSITION).reduce((acc, [align, position]) => {
  acc[position] = align;
  return acc;
}, {});
populateGlobalFeatureSupport();
populateGlobalFeatureSupport();
const TITLE_LENGTH_LIMIT = 100;
const getObjectValueByKey = (object, key) => object[key] || object[snakeToCamel(key)];
const url2uri = (url) => url.replace(/^(.*[/])/, "");
const parseVideoPosters = (fileOutput) => fileOutput.image.map((image) => url2uri(image.url));
const fixMediaTitleLength = (value, lengthLimit) => {
  const CHARS_TO_ADD = "...";
  const NUM_OF_CHARS_TO_KEEP = 3;
  if (value.length <= lengthLimit) {
    return value;
  }
  const arr = value.split("");
  const numOfCharsToRemove = value.length - lengthLimit + CHARS_TO_ADD.length;
  const isFileTypeSuffix = value.lastIndexOf(".") > value.length - numOfCharsToRemove - NUM_OF_CHARS_TO_KEEP;
  const fileTypeSuffixIndex = isFileTypeSuffix ? value.lastIndexOf(".") : value.length - 1;
  const removeIndex = fileTypeSuffixIndex - numOfCharsToRemove - NUM_OF_CHARS_TO_KEEP;
  arr.splice(removeIndex, numOfCharsToRemove, CHARS_TO_ADD);
  return arr.join("");
};
const parseVideoQualities = (fileOutput) => {
  var _fileOutput$storyboar;
  const mp4Videos = fileOutput.video.filter((_ref) => {
    let {
      format
    } = _ref;
    return format === "mp4";
  });
  const storyboard = (_fileOutput$storyboar = fileOutput.storyboard) == null ? void 0 : _fileOutput$storyboar.find((_ref2) => {
    let {
      format
    } = _ref2;
    return format === "mp4";
  });
  const qualities = mp4Videos.map((_ref3) => {
    let {
      width,
      height,
      quality,
      url
    } = _ref3;
    return {
      width,
      height,
      quality,
      url
    };
  });
  if (storyboard) {
    qualities.push({
      quality: "storyboard",
      width: storyboard.width,
      height: storyboard.height,
      url: storyboard.url
    });
  }
  return qualities;
};
const parseAdaptiveUrls = (fileOutput) => {
  const adaptiveVideo = getObjectValueByKey(fileOutput, "adaptive_video");
  return adaptiveVideo.map((item) => {
    return {
      format: item.format,
      url: item.url
    };
  });
};
const parseMediaFeatures = (fileInfo) => {
  var _fileInfo$tags;
  const mediaFeatures = [];
  if ((_fileInfo$tags = fileInfo.tags) != null && _fileInfo$tags.includes("_mp4_alpha")) {
    mediaFeatures.push("alpha");
  }
  return mediaFeatures.length ? mediaFeatures : null;
};
const getIdFromUrl = (fileUrl) => {
  const result = fileUrl.match(/(?:\/|^)([0-9a-fA-F_]+)(?:\/|$)/) || [];
  return result[1] ?? "";
};
const parseVideoFileInfo = (fileInfo, info) => {
  var _fileOutput$video$;
  const fileInput = getObjectValueByKey(fileInfo, "file_input");
  const fileOutput = getObjectValueByKey(fileInfo, "file_output");
  const videoId = getIdFromUrl(getObjectValueByKey(fileInfo, "file_name") || getObjectValueByKey(fileInfo, "file_url"));
  const title = fixMediaTitleLength(fileInfo.title, TITLE_LENGTH_LIMIT);
  const qualities = parseVideoQualities(fileOutput);
  const adaptiveVideo = parseAdaptiveUrls(fileOutput);
  const mediaFeatures = parseMediaFeatures(fileInfo);
  const imageData = fileOutput.image[0];
  const posterImageRef = {
    type: "Image",
    width: imageData.width,
    height: imageData.height,
    uri: url2uri(imageData.url),
    description: info.path ? info.path : void 0
  };
  return {
    type: "WixVideo",
    title,
    videoId,
    duration: +(fileInput.duration / 1e3).toFixed(2),
    posterImageRef,
    generatedPosters: parseVideoPosters(fileOutput),
    qualities,
    adaptiveVideo,
    artist: {
      name: fileInfo.vendor || "",
      id: fileInfo.reference || ""
    },
    hasAudio: getObjectValueByKey(fileOutput.video[0], "audio_bitrate") !== -1,
    fps: (((_fileOutput$video$ = fileOutput.video[0]) == null ? void 0 : _fileOutput$video$.fps) ?? "").toString(),
    mediaFeatures: mediaFeatures || []
  };
};
const NO_SCENARIO_FOUND = "NO_SCENARIO_FOUND";
const SSR_HOST = "www.wix.com";
const SSR_PROTOCOL = "http";
const ORIGINAL_URL_HEADER = "x-wix-metro-original-url";
const ORIGINAL_HOST_HEADER = "x-wix-metro-original-host";
const ORIGINAL_PROTOCOL_HEADER = "x-wix-metro-original-protocol";
const MAX_NGINX_URL_LENGTH = 2e3;
function maybeGetDocument() {
  if (typeof document === "object") {
    return document;
  }
  return void 0;
}
function maybeGetGlobal() {
  if (typeof self === "object") {
    return self;
  } else {
    return global;
  }
}
function readCookie(name) {
  const cookieValue = getCookieByName(name);
  if (cookieValue) {
    return cookieValue.split("=")[1];
  }
  return "";
}
function loadCookies() {
  const documentObj = maybeGetDocument();
  if (documentObj && documentObj.cookie) {
    return decodeURIComponent(documentObj.cookie).split(";");
  }
  return [];
}
function getCookieByName(name) {
  return loadCookies().filter((cookie) => name === cookie.split("=")[0].trim())[0];
}
const XSRF_TOKEN_COOKIE_NAME = "XSRF-TOKEN";
const XSRF_HEADER_NAME = "x-xsrf-token";
function csrf() {
  const value = readCookie(XSRF_TOKEN_COOKIE_NAME);
  return { [XSRF_HEADER_NAME]: value };
}
const X_WIX_BRAND_NAME = "x-wix-brand";
function xWixBrand() {
  const value = extractBrand();
  return { [X_WIX_BRAND_NAME]: value };
}
function extractBrand() {
  const globalObj = maybeGetGlobal();
  if (globalObj && globalObj.commonConfig && typeof globalObj.commonConfig.brand === "string") {
    return globalObj.commonConfig.brand;
  }
  return "";
}
function consentPolicy() {
  return tryResolveNativeAPI() || tryResolveJsSDK() || none();
}
function tryResolveJsSDK() {
  const globalObj = maybeGetGlobal();
  if (globalObj && globalObj.Wix && globalObj.Wix.Utils && typeof globalObj.Wix.Utils._getConsentPolicyHeader === "function") {
    return globalObj.Wix.Utils._getConsentPolicyHeader();
  }
  return void 0;
}
function tryResolveNativeAPI() {
  const globalObj = maybeGetGlobal();
  if (globalObj && globalObj.consentPolicyManager && typeof globalObj.consentPolicyManager._getConsentPolicyHeader === "function") {
    return globalObj.consentPolicyManager._getConsentPolicyHeader();
  }
  return void 0;
}
function none() {
  return {};
}
function authorization(signedInstance) {
  return { authorization: signedInstance };
}
var define_process_env_default$2 = {};
function isCI() {
  if (isNode$1()) {
    return !!define_process_env_default$2.TEAMCITY_VERSION || !!define_process_env_default$2.BUILDKITE;
  }
  return false;
}
function isNode$1() {
  var _a;
  return typeof process !== "undefined" && ((_a = process.versions) == null ? void 0 : _a.node) != null;
}
var define_process_env_default$1 = {};
function artifactId(override) {
  const artifactIdToUse = isNode$1() ? define_process_env_default$1.ARTIFACT_ID ?? define_process_env_default$1.APP_NAME ?? "" : "";
  return {
    "X-Wix-Client-Artifact-Id": override ?? (!isCI() ? artifactIdToUse : "")
  };
}
const IGNORE_KEYS = ["consentPolicy", "consentPolicyHeader"];
const COMMON_CONFIG_NAME = "commonConfig";
const MAP_KEYS = {
  bsi: "BSI"
};
function extractCommonConfigValues() {
  const globalObj = maybeGetGlobal();
  const commonConfigObj = globalObj == null ? void 0 : globalObj.commonConfig;
  if (!commonConfigObj) {
    return null;
  }
  const res = {};
  let addedKeys = false;
  Object.keys(commonConfigObj).forEach((key) => {
    const newKey = MAP_KEYS[key];
    if (newKey) {
      res[newKey] = commonConfigObj[key];
      addedKeys = true;
    } else if (IGNORE_KEYS.indexOf(key) < 0 && typeof commonConfigObj[key] !== "function") {
      res[key] = commonConfigObj[key];
      addedKeys = true;
    }
  });
  return addedKeys ? res : null;
}
const commonConfig = () => {
  const commonConfigValues = extractCommonConfigValues();
  const value = commonConfigValues ? JSON.stringify(commonConfigValues) : "";
  return { [COMMON_CONFIG_NAME]: encodeURIComponent(value) };
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var base64$2 = { exports: {} };
/*! https://mths.be/base64 v1.0.0 by @mathias | MIT license */
var base64$1 = base64$2.exports;
var hasRequiredBase64;
function requireBase64() {
  if (hasRequiredBase64) return base64$2.exports;
  hasRequiredBase64 = 1;
  (function(module, exports$1) {
    (function(root) {
      var freeExports = exports$1;
      var freeModule = module && module.exports == freeExports && module;
      var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      var InvalidCharacterError = function(message) {
        this.message = message;
      };
      InvalidCharacterError.prototype = new Error();
      InvalidCharacterError.prototype.name = "InvalidCharacterError";
      var error = function(message) {
        throw new InvalidCharacterError(message);
      };
      var TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;
      var decode = function(input) {
        input = String(input).replace(REGEX_SPACE_CHARACTERS, "");
        var length = input.length;
        if (length % 4 == 0) {
          input = input.replace(/==?$/, "");
          length = input.length;
        }
        if (length % 4 == 1 || // http://whatwg.org/C#alphanumeric-ascii-characters
        /[^+a-zA-Z0-9/]/.test(input)) {
          error(
            "Invalid character: the string to be decoded is not correctly encoded."
          );
        }
        var bitCounter = 0;
        var bitStorage;
        var buffer;
        var output = "";
        var position = -1;
        while (++position < length) {
          buffer = TABLE.indexOf(input.charAt(position));
          bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
          if (bitCounter++ % 4) {
            output += String.fromCharCode(
              255 & bitStorage >> (-2 * bitCounter & 6)
            );
          }
        }
        return output;
      };
      var encode = function(input) {
        input = String(input);
        if (/[^\0-\xFF]/.test(input)) {
          error(
            "The string to be encoded contains characters outside of the Latin1 range."
          );
        }
        var padding = input.length % 3;
        var output = "";
        var position = -1;
        var a;
        var b;
        var c;
        var buffer;
        var length = input.length - padding;
        while (++position < length) {
          a = input.charCodeAt(position) << 16;
          b = input.charCodeAt(++position) << 8;
          c = input.charCodeAt(++position);
          buffer = a + b + c;
          output += TABLE.charAt(buffer >> 18 & 63) + TABLE.charAt(buffer >> 12 & 63) + TABLE.charAt(buffer >> 6 & 63) + TABLE.charAt(buffer & 63);
        }
        if (padding == 2) {
          a = input.charCodeAt(position) << 8;
          b = input.charCodeAt(++position);
          buffer = a + b;
          output += TABLE.charAt(buffer >> 10) + TABLE.charAt(buffer >> 4 & 63) + TABLE.charAt(buffer << 2 & 63) + "=";
        } else if (padding == 1) {
          buffer = input.charCodeAt(position);
          output += TABLE.charAt(buffer >> 2) + TABLE.charAt(buffer << 4 & 63) + "==";
        }
        return output;
      };
      var base642 = {
        "encode": encode,
        "decode": decode,
        "version": "1.0.0"
      };
      if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          freeModule.exports = base642;
        } else {
          for (var key in base642) {
            base642.hasOwnProperty(key) && (freeExports[key] = base642[key]);
          }
        }
      } else {
        root.base64 = base642;
      }
    })(base64$1);
  })(base64$2, base64$2.exports);
  return base64$2.exports;
}
var base64Exports = requireBase64();
const base64 = /* @__PURE__ */ getDefaultExportFromCjs(base64Exports);
const LINGUIST_HEADER_KEY = "x-wix-linguist";
function linguistHeader({ lang, locale, isPrimaryLanguage, signedInstance }) {
  if (isMultilingualOptionsAreValid({ lang, locale, isPrimaryLanguage })) {
    const instanceId = getInstanceIdFromSignedInstance(signedInstance);
    if (instanceId !== void 0) {
      return {
        [LINGUIST_HEADER_KEY]: [
          lang,
          locale,
          isPrimaryLanguage == null ? void 0 : isPrimaryLanguage.toString(),
          instanceId
        ].join("|")
      };
    }
  }
  return {};
}
function isMultilingualOptionsAreValid({ lang, locale, isPrimaryLanguage }) {
  return lang && locale && /^(true|false)$/.test((isPrimaryLanguage == null ? void 0 : isPrimaryLanguage.toString()) || "");
}
function getInstanceIdFromSignedInstance(signedInstance) {
  try {
    const encodedInstance = (signedInstance == null ? void 0 : signedInstance.startsWith("wixcode")) ? signedInstance == null ? void 0 : signedInstance.split(".")[2] : signedInstance == null ? void 0 : signedInstance.split(".")[1];
    if (encodedInstance) {
      return JSON.parse(base64.decode(encodedInstance)).instanceId;
    }
  } catch (e) {
  }
}
class WixHeadersValidationError extends Error {
  constructor(type, key, value) {
    super(`WixHeadersValidationError: expected ${key} to be ${type} but got ${JSON.stringify(value)}`);
  }
}
function assertBoolean(key, value) {
  if (typeof value !== "boolean") {
    throw new WixHeadersValidationError("boolean", key, value);
  }
}
function assertString(key, value) {
  if (typeof value !== "string") {
    throw new WixHeadersValidationError("string", key, value);
  }
}
function createHeaders(opts = {}) {
  opts = { csrf: true, signedInstance: "", ...opts };
  verifyOptsOrThrow(opts);
  const headers = [
    xWixBrand(),
    consentPolicy(),
    authorization(opts.signedInstance),
    artifactId(opts.artifactId),
    commonConfig(),
    linguistHeader({
      signedInstance: opts.signedInstance,
      ...opts.multilingualOptions
    })
  ];
  if (opts.csrf) {
    headers.push(csrf());
  }
  return headers.filter((hdrs) => Object.values(hdrs).every((v) => v)).reduce((result, hdrs) => ({
    ...result,
    ...hdrs
  }), {});
}
function verifyOptsOrThrow(opts) {
  assertBoolean("opts.csrf", opts.csrf);
  assertString("opts.signedInstance", opts.signedInstance);
}
function isBrowser() {
  return typeof window !== "undefined";
}
function isWebWorker() {
  var _a;
  return typeof self === "object" && ((_a = self === null || self === void 0 ? void 0 : self.constructor) === null || _a === void 0 ? void 0 : _a.name) === "DedicatedWorkerGlobalScope";
}
function isNode() {
  var _a;
  return typeof process !== "undefined" && ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node) != null;
}
var define_process_env_default = {};
function isAbsoluteUrl(url) {
  if (typeof url !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof url}\``);
  }
  return /(^https?:)|(^\/\/)/.test(url);
}
async function silent(fn) {
  try {
    await fn();
  } catch (_a) {
  }
}
function extractProp(data, path) {
  return path.split(".").filter((prop) => prop).reduce((result, prop) => result[prop], data);
}
function resolveHost(opts) {
  if (opts.baseURL) {
    return extractHost(opts.baseURL);
  } else if (opts.isSSR) {
    return SSR_HOST;
  } else if (typeof self !== "undefined" && !!self.location) {
    return self.location.host;
  } else {
    return "";
  }
}
function resolveProtocol(opts) {
  if (opts.baseURL) {
    return extractProtocol(opts.baseURL);
  } else if (opts.isSSR) {
    return SSR_PROTOCOL;
  } else if (typeof self !== "undefined" && !!self.location) {
    return self.location.protocol;
  } else {
    return "";
  }
}
function extractProtocol(url) {
  try {
    const asUrl = new URL(url);
    return asUrl.protocol;
  } catch (_a) {
    const hostAndProtocol = extractHostAndProtocolUsingRegExp(url);
    return hostAndProtocol.protocol;
  }
}
function extractHost(url) {
  let asUrl;
  try {
    asUrl = new URL(url);
  } catch (_a) {
    asUrl = new URL(`http:${url}`);
  }
  try {
    return asUrl.host;
  } catch (_b) {
    const hostAndProtocol = extractHostAndProtocolUsingRegExp(url);
    return hostAndProtocol.host;
  }
}
function extractHostAndProtocolUsingRegExp(url) {
  const regExp = new RegExp("^(.*:)//([A-Za-z0-9-.]+)(:[0-9]+)?(.*)$");
  try {
    const urlOptions = regExp.exec(url);
    return { protocol: urlOptions[1], host: urlOptions[2] };
  } catch (_a) {
    return { protocol: "http:", host: "" };
  }
}
function changeHost(urlOrPath, host) {
  let url;
  try {
    url = new URL(urlOrPath);
    url.host = host;
    url.protocol = "http";
  } catch (_a) {
    url = new URL(`http://${host}`);
    url.pathname = urlOrPath;
  }
  return url.toString();
}
function getGlobalConfig() {
  const defaultConfig = { httpMockServer: { enabled: false } };
  let globalConfig;
  if (isNode() && define_process_env_default.HTTP_CLIENT_GLOBAL_CONFIG) {
    try {
      globalConfig = JSON.parse(define_process_env_default.HTTP_CLIENT_GLOBAL_CONFIG);
    } catch (e) {
    }
  }
  if (!globalConfig) {
    if (isBrowser()) {
      globalConfig = window._httpClientGlobalConfig;
    } else if (isWebWorker()) ;
  }
  return globalConfig || defaultConfig;
}
function isHttpMockServerEnabled() {
  const globalConfig = getGlobalConfig();
  return globalConfig.httpMockServer.enabled;
}
function shouldAllowUnmocked() {
  const globalConfig = getGlobalConfig();
  return globalConfig.httpMockServer.allowUnmocked;
}
function toSearchQueryParams(params) {
  return Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).flat().join("&");
}
const whitelistedHosts = [
  "wix.com",
  "editorx.com",
  "wix-code.com",
  "wixapps.net",
  "wixprod.net"
];
function requestIdOrEmptyString(response) {
  var _a;
  return ((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a["x-wix-request-id"]) || "";
}
const composeHeaders = ({ url, disableWixHeaders, includeWixHeaders, wixHeadersOpts }) => {
  const shouldAssignWixHeaders = includeWixHeaders || !disableWixHeaders && isWixDomain(url);
  return shouldAssignWixHeaders ? createHeaders(wixHeadersOpts) : {};
};
function isWixDomain(url) {
  const isRelative = !isAbsoluteUrl(url);
  if (isRelative) {
    return true;
  }
  const host = `.${extractHost(url)}`;
  const isWhitelisted = whitelistedHosts.find((wixHost) => host.endsWith(`.${wixHost}`));
  return !!isWhitelisted;
}
const axiosErrorFields = [
  "code",
  "config",
  "request",
  "response",
  "toJSON",
  "__CANCEL__"
];
class HttpError extends Error {
  constructor(error) {
    var _a;
    super(error.message);
    this.isWixHttpError = true;
    Object.setPrototypeOf(this, HttpError.prototype);
    axiosErrorFields.forEach((key) => {
      this[key] = error[key];
    });
    if ((_a = this.response) === null || _a === void 0 ? void 0 : _a.headers) {
      this.response.requestId = requestIdOrEmptyString(this.response);
    }
  }
  get requestId() {
    return requestIdOrEmptyString(this.response);
  }
}
function createHttpError(...args) {
  return new HttpError(...args);
}
var axios$2 = { exports: {} };
var bind;
var hasRequiredBind;
function requireBind() {
  if (hasRequiredBind) return bind;
  hasRequiredBind = 1;
  bind = function bind2(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
  return bind;
}
var utils;
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  var bind2 = requireBind();
  var toString = Object.prototype.toString;
  function isArray(val) {
    return toString.call(val) === "[object Array]";
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  function isArrayBuffer(val) {
    return toString.call(val) === "[object ArrayBuffer]";
  }
  function isFormData(val) {
    return typeof FormData !== "undefined" && val instanceof FormData;
  }
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && val.buffer instanceof ArrayBuffer;
    }
    return result;
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isNumber(val) {
    return typeof val === "number";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(val) {
    if (toString.call(val) !== "[object Object]") {
      return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }
  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }
  function isFile(val) {
    return toString.call(val) === "[object File]";
  }
  function isBlob(val) {
    return toString.call(val) === "[object Blob]";
  }
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== "undefined" && val instanceof URLSearchParams;
  }
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
  }
  function isStandardBrowserEnv() {
    if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
      return false;
    }
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function merge() {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a[key] = bind2(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  utils = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    extend,
    trim,
    stripBOM
  };
  return utils;
}
var buildURL;
var hasRequiredBuildURL;
function requireBuildURL() {
  if (hasRequiredBuildURL) return buildURL;
  hasRequiredBuildURL = 1;
  var utils2 = requireUtils();
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  buildURL = function buildURL2(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils2.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils2.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils2.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils2.forEach(val, function parseValue(v) {
          if (utils2.isDate(v)) {
            v = v.toISOString();
          } else if (utils2.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  };
  return buildURL;
}
var InterceptorManager_1;
var hasRequiredInterceptorManager;
function requireInterceptorManager() {
  if (hasRequiredInterceptorManager) return InterceptorManager_1;
  hasRequiredInterceptorManager = 1;
  var utils2 = requireUtils();
  function InterceptorManager() {
    this.handlers = [];
  }
  InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils2.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };
  InterceptorManager_1 = InterceptorManager;
  return InterceptorManager_1;
}
var normalizeHeaderName;
var hasRequiredNormalizeHeaderName;
function requireNormalizeHeaderName() {
  if (hasRequiredNormalizeHeaderName) return normalizeHeaderName;
  hasRequiredNormalizeHeaderName = 1;
  var utils2 = requireUtils();
  normalizeHeaderName = function normalizeHeaderName2(headers, normalizedName) {
    utils2.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };
  return normalizeHeaderName;
}
var enhanceError;
var hasRequiredEnhanceError;
function requireEnhanceError() {
  if (hasRequiredEnhanceError) return enhanceError;
  hasRequiredEnhanceError = 1;
  enhanceError = function enhanceError2(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };
  return enhanceError;
}
var createError;
var hasRequiredCreateError;
function requireCreateError() {
  if (hasRequiredCreateError) return createError;
  hasRequiredCreateError = 1;
  var enhanceError2 = requireEnhanceError();
  createError = function createError2(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError2(error, config, code, request, response);
  };
  return createError;
}
var settle;
var hasRequiredSettle;
function requireSettle() {
  if (hasRequiredSettle) return settle;
  hasRequiredSettle = 1;
  var createError2 = requireCreateError();
  settle = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError2(
        "Request failed with status code " + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };
  return settle;
}
var cookies;
var hasRequiredCookies;
function requireCookies() {
  if (hasRequiredCookies) return cookies;
  hasRequiredCookies = 1;
  var utils2 = requireUtils();
  cookies = utils2.isStandardBrowserEnv() ? (
    // Standard browser envs support document.cookie
    /* @__PURE__ */ (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + "=" + encodeURIComponent(value));
          if (utils2.isNumber(expires)) {
            cookie.push("expires=" + new Date(expires).toGMTString());
          }
          if (utils2.isString(path)) {
            cookie.push("path=" + path);
          }
          if (utils2.isString(domain)) {
            cookie.push("domain=" + domain);
          }
          if (secure === true) {
            cookie.push("secure");
          }
          document.cookie = cookie.join("; ");
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      };
    })()
  ) : (
    // Non standard browser env (web workers, react-native) lack needed support.
    /* @__PURE__ */ (function nonStandardBrowserEnv() {
      return {
        write: function write() {
        },
        read: function read() {
          return null;
        },
        remove: function remove() {
        }
      };
    })()
  );
  return cookies;
}
var isAbsoluteURL;
var hasRequiredIsAbsoluteURL;
function requireIsAbsoluteURL() {
  if (hasRequiredIsAbsoluteURL) return isAbsoluteURL;
  hasRequiredIsAbsoluteURL = 1;
  isAbsoluteURL = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };
  return isAbsoluteURL;
}
var combineURLs;
var hasRequiredCombineURLs;
function requireCombineURLs() {
  if (hasRequiredCombineURLs) return combineURLs;
  hasRequiredCombineURLs = 1;
  combineURLs = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  return combineURLs;
}
var buildFullPath;
var hasRequiredBuildFullPath;
function requireBuildFullPath() {
  if (hasRequiredBuildFullPath) return buildFullPath;
  hasRequiredBuildFullPath = 1;
  var isAbsoluteURL2 = requireIsAbsoluteURL();
  var combineURLs2 = requireCombineURLs();
  buildFullPath = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL2(requestedURL)) {
      return combineURLs2(baseURL, requestedURL);
    }
    return requestedURL;
  };
  return buildFullPath;
}
var parseHeaders;
var hasRequiredParseHeaders;
function requireParseHeaders() {
  if (hasRequiredParseHeaders) return parseHeaders;
  hasRequiredParseHeaders = 1;
  var utils2 = requireUtils();
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  parseHeaders = function parseHeaders2(headers) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers) {
      return parsed;
    }
    utils2.forEach(headers.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils2.trim(line.substr(0, i)).toLowerCase();
      val = utils2.trim(line.substr(i + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
  return parseHeaders;
}
var isURLSameOrigin;
var hasRequiredIsURLSameOrigin;
function requireIsURLSameOrigin() {
  if (hasRequiredIsURLSameOrigin) return isURLSameOrigin;
  hasRequiredIsURLSameOrigin = 1;
  var utils2 = requireUtils();
  isURLSameOrigin = utils2.isStandardBrowserEnv() ? (
    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement("a");
      var originURL;
      function resolveURL(url) {
        var href = url;
        if (msie) {
          urlParsingNode.setAttribute("href", href);
          href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
      }
      originURL = resolveURL(window.location.href);
      return function isURLSameOrigin2(requestURL) {
        var parsed = utils2.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    })()
  ) : (
    // Non standard browser envs (web workers, react-native) lack needed support.
    /* @__PURE__ */ (function nonStandardBrowserEnv() {
      return function isURLSameOrigin2() {
        return true;
      };
    })()
  );
  return isURLSameOrigin;
}
var xhr;
var hasRequiredXhr;
function requireXhr() {
  if (hasRequiredXhr) return xhr;
  hasRequiredXhr = 1;
  var utils2 = requireUtils();
  var settle2 = requireSettle();
  var cookies2 = requireCookies();
  var buildURL2 = requireBuildURL();
  var buildFullPath2 = requireBuildFullPath();
  var parseHeaders2 = requireParseHeaders();
  var isURLSameOrigin2 = requireIsURLSameOrigin();
  var createError2 = requireCreateError();
  xhr = function xhrAdapter2(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;
      if (utils2.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      var request = new XMLHttpRequest();
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath2(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL2(fullPath, config.params, config.paramsSerializer), true);
      request.timeout = config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders2(request.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle2(resolve, reject, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(createError2("Request aborted", config, "ECONNABORTED", request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(createError2("Network Error", config, null, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = "timeout of " + config.timeout + "ms exceeded";
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError2(
          timeoutErrorMessage,
          config,
          config.transitional && config.transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
          request
        ));
        request = null;
      };
      if (utils2.isStandardBrowserEnv()) {
        var xsrfValue = (config.withCredentials || isURLSameOrigin2(fullPath)) && config.xsrfCookieName ? cookies2.read(config.xsrfCookieName) : void 0;
        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }
      if ("setRequestHeader" in request) {
        utils2.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
            delete requestHeaders[key];
          } else {
            request.setRequestHeader(key, val);
          }
        });
      }
      if (!utils2.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = config.responseType;
      }
      if (typeof config.onDownloadProgress === "function") {
        request.addEventListener("progress", config.onDownloadProgress);
      }
      if (typeof config.onUploadProgress === "function" && request.upload) {
        request.upload.addEventListener("progress", config.onUploadProgress);
      }
      if (config.cancelToken) {
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }
          request.abort();
          reject(cancel);
          request = null;
        });
      }
      if (!requestData) {
        requestData = null;
      }
      request.send(requestData);
    });
  };
  return xhr;
}
var defaults_1;
var hasRequiredDefaults;
function requireDefaults() {
  if (hasRequiredDefaults) return defaults_1;
  hasRequiredDefaults = 1;
  var utils2 = requireUtils();
  var normalizeHeaderName2 = requireNormalizeHeaderName();
  var enhanceError2 = requireEnhanceError();
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers, value) {
    if (!utils2.isUndefined(headers) && utils2.isUndefined(headers["Content-Type"])) {
      headers["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = requireXhr();
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = requireXhr();
    }
    return adapter;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils2.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils2.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults = {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    },
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName2(headers, "Accept");
      normalizeHeaderName2(headers, "Content-Type");
      if (utils2.isFormData(data) || utils2.isArrayBuffer(data) || utils2.isBuffer(data) || utils2.isStream(data) || utils2.isFile(data) || utils2.isBlob(data)) {
        return data;
      }
      if (utils2.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils2.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data.toString();
      }
      if (utils2.isObject(data) || headers && headers["Content-Type"] === "application/json") {
        setContentTypeIfUnset(headers, "application/json");
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      var transitional = this.transitional;
      var silentJSONParsing = transitional && transitional.silentJSONParsing;
      var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
      if (strictJSONParsing || forcedJSONParsing && utils2.isString(data) && data.length) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw enhanceError2(e, this, "E_JSON_PARSE");
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };
  defaults.headers = {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  };
  utils2.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });
  utils2.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults.headers[method] = utils2.merge(DEFAULT_CONTENT_TYPE);
  });
  defaults_1 = defaults;
  return defaults_1;
}
var transformData$1;
var hasRequiredTransformData;
function requireTransformData() {
  if (hasRequiredTransformData) return transformData$1;
  hasRequiredTransformData = 1;
  var utils2 = requireUtils();
  var defaults = requireDefaults();
  transformData$1 = function transformData2(data, headers, fns) {
    var context = this || defaults;
    utils2.forEach(fns, function transform(fn) {
      data = fn.call(context, data, headers);
    });
    return data;
  };
  return transformData$1;
}
var isCancel;
var hasRequiredIsCancel;
function requireIsCancel() {
  if (hasRequiredIsCancel) return isCancel;
  hasRequiredIsCancel = 1;
  isCancel = function isCancel2(value) {
    return !!(value && value.__CANCEL__);
  };
  return isCancel;
}
var dispatchRequest;
var hasRequiredDispatchRequest;
function requireDispatchRequest() {
  if (hasRequiredDispatchRequest) return dispatchRequest;
  hasRequiredDispatchRequest = 1;
  var utils2 = requireUtils();
  var transformData2 = requireTransformData();
  var isCancel2 = requireIsCancel();
  var defaults = requireDefaults();
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }
  dispatchRequest = function dispatchRequest2(config) {
    throwIfCancellationRequested(config);
    config.headers = config.headers || {};
    config.data = transformData2.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );
    config.headers = utils2.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );
    utils2.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );
    var adapter = config.adapter || defaults.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData2.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel2(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData2.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }
      return Promise.reject(reason);
    });
  };
  return dispatchRequest;
}
var mergeConfig;
var hasRequiredMergeConfig;
function requireMergeConfig() {
  if (hasRequiredMergeConfig) return mergeConfig;
  hasRequiredMergeConfig = 1;
  var utils2 = requireUtils();
  mergeConfig = function mergeConfig2(config1, config2) {
    config2 = config2 || {};
    var config = {};
    var valueFromConfig2Keys = ["url", "method", "data"];
    var mergeDeepPropertiesKeys = ["headers", "auth", "proxy", "params"];
    var defaultToConfig2Keys = [
      "baseURL",
      "transformRequest",
      "transformResponse",
      "paramsSerializer",
      "timeout",
      "timeoutMessage",
      "withCredentials",
      "adapter",
      "responseType",
      "xsrfCookieName",
      "xsrfHeaderName",
      "onUploadProgress",
      "onDownloadProgress",
      "decompress",
      "maxContentLength",
      "maxBodyLength",
      "maxRedirects",
      "transport",
      "httpAgent",
      "httpsAgent",
      "cancelToken",
      "socketPath",
      "responseEncoding"
    ];
    var directMergeKeys = ["validateStatus"];
    function getMergedValue(target, source) {
      if (utils2.isPlainObject(target) && utils2.isPlainObject(source)) {
        return utils2.merge(target, source);
      } else if (utils2.isPlainObject(source)) {
        return utils2.merge({}, source);
      } else if (utils2.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils2.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils2.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(void 0, config1[prop]);
      }
    }
    utils2.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils2.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(void 0, config2[prop]);
      }
    });
    utils2.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
    utils2.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils2.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(void 0, config2[prop]);
      } else if (!utils2.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(void 0, config1[prop]);
      }
    });
    utils2.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(void 0, config1[prop]);
      }
    });
    var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
    var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });
    utils2.forEach(otherKeys, mergeDeepProperties);
    return config;
  };
  return mergeConfig;
}
const version = "0.21.4";
const require$$0 = {
  version
};
var validator;
var hasRequiredValidator;
function requireValidator() {
  if (hasRequiredValidator) return validator;
  hasRequiredValidator = 1;
  var pkg = require$$0;
  var validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
    validators[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  var currentVerArr = pkg.version.split(".");
  function isOlderVersion(version2, thanVersion) {
    var pkgVersionArr = thanVersion ? thanVersion.split(".") : currentVerArr;
    var destVer = version2.split(".");
    for (var i = 0; i < 3; i++) {
      if (pkgVersionArr[i] > destVer[i]) {
        return true;
      } else if (pkgVersionArr[i] < destVer[i]) {
        return false;
      }
    }
    return false;
  }
  validators.transitional = function transitional(validator2, version2, message) {
    var isDeprecated = version2 && isOlderVersion(version2);
    function formatMessage(opt, desc) {
      return "[Axios v" + pkg.version + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return function(value, opt, opts) {
      if (validator2 === false) {
        throw new Error(formatMessage(opt, " has been removed in " + version2));
      }
      if (isDeprecated && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version2 + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new TypeError("options must be an object");
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator2 = schema[opt];
      if (validator2) {
        var value = options[opt];
        var result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new TypeError("option " + opt + " must be " + result);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw Error("Unknown option " + opt);
      }
    }
  }
  validator = {
    isOlderVersion,
    assertOptions,
    validators
  };
  return validator;
}
var Axios_1;
var hasRequiredAxios$2;
function requireAxios$2() {
  if (hasRequiredAxios$2) return Axios_1;
  hasRequiredAxios$2 = 1;
  var utils2 = requireUtils();
  var buildURL2 = requireBuildURL();
  var InterceptorManager = requireInterceptorManager();
  var dispatchRequest2 = requireDispatchRequest();
  var mergeConfig2 = requireMergeConfig();
  var validator2 = requireValidator();
  var validators = validator2.validators;
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  Axios.prototype.request = function request(config) {
    if (typeof config === "string") {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }
    config = mergeConfig2(this.defaults, config);
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = "get";
    }
    var transitional = config.transitional;
    if (transitional !== void 0) {
      validator2.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean, "1.0.0"),
        forcedJSONParsing: validators.transitional(validators.boolean, "1.0.0"),
        clarifyTimeoutError: validators.transitional(validators.boolean, "1.0.0")
      }, false);
    }
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    var promise;
    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest2, void 0];
      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);
      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    }
    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }
    try {
      promise = dispatchRequest2(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }
    return promise;
  };
  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig2(this.defaults, config);
    return buildURL2(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
  };
  utils2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig2(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils2.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    Axios.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig2(config || {}, {
        method,
        url,
        data
      }));
    };
  });
  Axios_1 = Axios;
  return Axios_1;
}
var Cancel_1;
var hasRequiredCancel;
function requireCancel() {
  if (hasRequiredCancel) return Cancel_1;
  hasRequiredCancel = 1;
  function Cancel(message) {
    this.message = message;
  }
  Cancel.prototype.toString = function toString() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel.prototype.__CANCEL__ = true;
  Cancel_1 = Cancel;
  return Cancel_1;
}
var CancelToken_1;
var hasRequiredCancelToken;
function requireCancelToken() {
  if (hasRequiredCancelToken) return CancelToken_1;
  hasRequiredCancelToken = 1;
  var Cancel = requireCancel();
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }
      token.reason = new Cancel(message);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  };
  CancelToken_1 = CancelToken;
  return CancelToken_1;
}
var spread;
var hasRequiredSpread;
function requireSpread() {
  if (hasRequiredSpread) return spread;
  hasRequiredSpread = 1;
  spread = function spread2(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };
  return spread;
}
var isAxiosError;
var hasRequiredIsAxiosError;
function requireIsAxiosError() {
  if (hasRequiredIsAxiosError) return isAxiosError;
  hasRequiredIsAxiosError = 1;
  isAxiosError = function isAxiosError2(payload) {
    return typeof payload === "object" && payload.isAxiosError === true;
  };
  return isAxiosError;
}
var hasRequiredAxios$1;
function requireAxios$1() {
  if (hasRequiredAxios$1) return axios$2.exports;
  hasRequiredAxios$1 = 1;
  var utils2 = requireUtils();
  var bind2 = requireBind();
  var Axios = requireAxios$2();
  var mergeConfig2 = requireMergeConfig();
  var defaults = requireDefaults();
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind2(Axios.prototype.request, context);
    utils2.extend(instance, Axios.prototype, context);
    utils2.extend(instance, context);
    return instance;
  }
  var axios2 = createInstance(defaults);
  axios2.Axios = Axios;
  axios2.create = function create(instanceConfig) {
    return createInstance(mergeConfig2(axios2.defaults, instanceConfig));
  };
  axios2.Cancel = requireCancel();
  axios2.CancelToken = requireCancelToken();
  axios2.isCancel = requireIsCancel();
  axios2.all = function all(promises) {
    return Promise.all(promises);
  };
  axios2.spread = requireSpread();
  axios2.isAxiosError = requireIsAxiosError();
  axios$2.exports = axios2;
  axios$2.exports.default = axios2;
  return axios$2.exports;
}
var axios$1;
var hasRequiredAxios;
function requireAxios() {
  if (hasRequiredAxios) return axios$1;
  hasRequiredAxios = 1;
  axios$1 = requireAxios$1();
  return axios$1;
}
var axiosExports = requireAxios();
const axios = /* @__PURE__ */ getDefaultExportFromCjs(axiosExports);
var xhrExports = requireXhr();
const xhrAdapter = /* @__PURE__ */ getDefaultExportFromCjs(xhrExports);
const buildOptions = ({ requestOptions, urlObject, headers, globalConfig = {
  httpMockServer: {
    enabled: false
  }
} }) => {
  const { url, method, params, fallback } = requestOptions;
  if (params) {
    if (typeof params !== "object") {
      throw new Error("Search params must be an object");
    }
    if (fallback === null || fallback === void 0 ? void 0 : fallback.length) {
      if (method === "GET" && !isValidGetRequest(requestOptions)) {
        const fallbackOptions = getFallbackRequestOptions(fallback);
        if (fallbackOptions) {
          requestOptions = Object.assign(Object.assign({}, requestOptions), fallbackOptions);
          if (fallbackOptions.method === "POST") {
            requestOptions.params = void 0;
          }
        }
      }
    }
  }
  const localConfigOptions = maybeRedirectToMockServer(url, globalConfig);
  const newOptions = Object.assign(Object.assign(Object.assign({}, requestOptions), localConfigOptions), { headers });
  return newOptions;
};
const buildAllHeaders = (requestOptions, wixHeadersOpts, globalConfig = {
  httpMockServer: {
    enabled: false
  }
}, urlObject) => {
  const { url, disableWixHeaders, headers, includeWixHeaders } = requestOptions;
  const composedHeaders = composeHeaders({
    url,
    disableWixHeaders,
    includeWixHeaders,
    wixHeadersOpts
  });
  const originalUrlHeader = getUrlHeaders(globalConfig, requestOptions, urlObject);
  return Object.assign(Object.assign(Object.assign({}, composedHeaders), lowerAllJsonKeys(headers)), originalUrlHeader);
};
const getUrlHeaders = (globalConfig, requestOptions, urlObject) => {
  const { url, params } = requestOptions;
  const { host, protocol } = urlObject;
  const originalUrlHeader = globalConfig.httpMockServer.enabled ? {
    [ORIGINAL_URL_HEADER]: buildUrlFromRequest(url, params),
    [ORIGINAL_HOST_HEADER]: isAbsoluteUrl(url) ? extractHost(url) : host,
    [ORIGINAL_PROTOCOL_HEADER]: isAbsoluteUrl(url) ? extractProtocol(url) : protocol
  } : {};
  return originalUrlHeader;
};
function maybeRedirectToMockServer(url, globalConfig) {
  if (globalConfig.httpMockServer.enabled) {
    const mockUrl = new URL(globalConfig.httpMockServer.mockServerUrl);
    return {
      url: changeHost(url, mockUrl.host)
    };
  }
  return {};
}
function buildUrlFromRequest(url, requestParams) {
  const { pathname, searchParams } = new URL(url, "http://unused.com");
  requestParams = requestParams || searchParams;
  if (requestParams) {
    const params = toSearchQueryParams(requestParams) || requestParams.toString();
    const paramsAsString = params ? `?${params}` : "";
    return `${pathname}${paramsAsString}`;
  }
  return pathname;
}
function lowerAllJsonKeys(objectToChange) {
  objectToChange = objectToChange || {};
  const result = Object.keys(objectToChange).reduce((prev, key) => Object.assign(Object.assign({}, prev), { [key.toLowerCase()]: objectToChange[key] }), {});
  return result;
}
function isValidGetRequest(requestOptions) {
  if (requestOptions.method !== "GET") {
    return false;
  }
  const { url, params } = requestOptions;
  return `${url}${params}`.length < MAX_NGINX_URL_LENGTH;
}
function getFallbackRequestOptions(fallbackRequests) {
  for (const requestOption of fallbackRequests) {
    if (requestOption.method !== "GET" || isValidGetRequest(requestOption)) {
      return requestOption;
    }
  }
}
class HttpClient {
  constructor(opts = {}) {
    this.opts = opts;
    this.opts = defaultClientOptions(this.opts);
    this.client = axios.create(this.opts);
    this.flags = {
      sanitizerPocEnabled: checkSanitizerPocEnabled()
    };
  }
  static isHttpError(payload) {
    return !!(payload === null || payload === void 0 ? void 0 : payload.isWixHttpError);
  }
  setErrorHandler(errorHandler) {
    this.opts.errorHandler = errorHandler;
  }
  async request(requestOptionsOrFactory, overrides) {
    var _a, _b;
    const host = resolveHost(this.opts);
    const protocol = resolveProtocol(this.opts);
    const urlObject = { protocol, host };
    const requestOptions = typeof requestOptionsOrFactory === "function" ? requestOptionsOrFactory({ isSSR: this.opts.isSSR, host }) : requestOptionsOrFactory;
    const signedInstance = (overrides === null || overrides === void 0 ? void 0 : overrides.signedInstance) || await ((_b = (_a = this.opts).getAppToken) === null || _b === void 0 ? void 0 : _b.call(_a)) || "";
    const headers = this.getHeaders(requestOptions, signedInstance, urlObject);
    const options = buildOptions({
      requestOptions,
      urlObject,
      headers,
      globalConfig: getGlobalConfig()
    });
    if (this.opts.isSSR) {
      options.baseURL = this.opts.baseURL ? this.opts.baseURL : `${SSR_PROTOCOL}://${SSR_HOST}`;
    }
    try {
      const res = await this.client.request(options).catch((err) => this.maybeFallbackRequest(err, requestOptions, urlObject, signedInstance));
      return this.transformResponse(res, requestOptions);
    } catch (e) {
      this.handleRequestError(e, options);
    }
  }
  async get(url, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), { url, method: "GET" });
    return this.request(opts);
  }
  async delete(url, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), { url, method: "DELETE" });
    return this.request(opts);
  }
  async head(url, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), { url, method: "HEAD" });
    return this.request(opts);
  }
  async options(url, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), { url, method: "OPTIONS" });
    return this.request(opts);
  }
  async post(url, data, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), {
      url,
      data,
      method: "POST"
    });
    return this.request(opts);
  }
  async put(url, data, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), {
      url,
      data,
      method: "PUT"
    });
    return this.request(opts);
  }
  async patch(url, data, requestOptions) {
    const opts = Object.assign(Object.assign({}, requestOptions), {
      url,
      data,
      method: "PATCH"
    });
    return this.request(opts);
  }
  get CancelToken() {
    return axios.CancelToken;
  }
  get isCancel() {
    return axios.isCancel;
  }
  getHeaders(requestOptions, signedInstance, urlObject) {
    if (typeof this.opts.createHeaders === "function") {
      return this.getCustomHeaders(requestOptions, signedInstance, urlObject);
    }
    const wixHeadersOpts = {
      signedInstance,
      artifactId: this.opts.artifactId,
      csrf: false,
      multilingualOptions: this.opts.multilingualOptions
    };
    return buildAllHeaders(requestOptions, wixHeadersOpts, getGlobalConfig(), urlObject);
  }
  getCustomHeaders(requestOptions, signedInstance, urlObject) {
    const { url, headers } = requestOptions;
    const authHeader = signedInstance && isWixDomain(url) ? { authorization: signedInstance } : {};
    const customHeaders = this.opts.createHeaders();
    const originalUrlHeader = getUrlHeaders(getGlobalConfig(), requestOptions, urlObject);
    return Object.assign(Object.assign(Object.assign(Object.assign({}, originalUrlHeader), customHeaders), authHeader), headers);
  }
  handleRequestError(error, requestOptions) {
    const requestError = createHttpError(error);
    silent(() => {
      var _a;
      return (_a = requestOptions.onError) === null || _a === void 0 ? void 0 : _a.call(requestOptions, requestError);
    });
    silent(() => {
      var _a;
      return (_a = this.opts.errorHandler) === null || _a === void 0 ? void 0 : _a.handleError(requestError, {
        requestOptions
      });
    });
    throw requestError;
  }
  maybeFallbackRequest(err, requestOptions, urlObject, signedInstance) {
    var _a, _b, _c;
    const shouldFallbackRequest = isHttpMockServerEnabled() && shouldAllowUnmocked() && ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 404 && ((_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.msg) === NO_SCENARIO_FOUND;
    if (shouldFallbackRequest) {
      const headers = this.getHeaders(requestOptions, signedInstance, urlObject);
      const prodOptions = buildOptions({
        requestOptions,
        urlObject,
        headers
      });
      return this.client.request(prodOptions);
    }
    throw err;
  }
  transformResponse(res, requestOptions) {
    const requestId = requestIdOrEmptyString(res);
    const data = transformData(res, requestOptions, this.flags);
    return Object.assign(Object.assign({}, res), {
      data,
      requestId
    });
  }
}
HttpClient.CancelToken = axios.CancelToken;
HttpClient.isCancel = axios.isCancel;
function defaultClientOptions(opts) {
  let adapter = opts.adapter;
  if (!adapter) {
    adapter = xhrAdapter;
    if (isNode()) {
      adapter = getNodeAdapter();
    }
  }
  return Object.assign({ adapter, isSSR: false }, opts);
}
function getNodeAdapter() {
  if (typeof __webpack_require__ === "function") {
    return __non_webpack_require__("axios/lib/adapters/http");
  }
  return require("axios/lib/adapters/http");
}
function transformData(res, requestOptions, flags) {
  let resData = sanitizeResponse(res, flags);
  if (requestOptions._pickResponseBody) {
    resData = extractProp(res.data, requestOptions._pickResponseBody);
  }
  if (requestOptions._logs) {
    const logs = extractProp(res.data, requestOptions._logs);
    if (logs === null || logs === void 0 ? void 0 : logs.length) {
      logs.map((log) => console.log(...log));
    }
  }
  return resData;
}
function sanitizeResponse(res, flags) {
  try {
    if (flags.sanitizerPocEnabled) {
      const start = performance.now();
      const sanitizer = new Sanitizer();
      if (res.headers["content-type"].includes("application/json")) {
        console.log("[+] JSON Response detected, sanitizing data");
        const sanitizeStringValue = function(jsonResponse) {
          try {
            Object.keys(jsonResponse).forEach((key) => {
              if (typeof jsonResponse[key] === "string") {
                jsonResponse[key] = sanitizer.sanitizeFor("span", jsonResponse[key]).innerHTML;
              } else if (typeof jsonResponse[key] === "object") {
                jsonResponse[key] = sanitizeStringValue(jsonResponse[key]);
              }
            });
            return jsonResponse;
          } catch (error) {
            console.log(error);
          }
        };
        const end = performance.now();
        console.log(`Time taken: ${end - start} milliseconds.`);
        return sanitizeStringValue(res.data);
      }
    }
  } catch (e) {
    console.log("[+] Sanitizer API not supported: %o", e);
  }
  return res.data;
}
function checkSanitizerPocEnabled() {
  var _a;
  try {
    return isBrowser() && new URLSearchParams(((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hash) || "").get("sanitizerPOC") === "true";
  } catch (_b) {
    return false;
  }
}
const templates = {
  vector: (svgId, filename) => `wix:vector://v1/${svgId}/${filename}`,
  image: (uri, filename, width, height, watermark) => `wix:image://v1/${uri}/${filename}#originWidth=${width}&originHeight=${height}${watermark ? `&watermark=${watermark}` : ""}`,
  document: (uri, filename) => `wix:document://v1/${uri}/${filename}`,
  video: (videoId, posterId, filename, width = 0, height = 0) => `wix:video://v1/${videoId}/${filename}#posterUri=${posterId}&posterWidth=${width}&posterHeight=${height}`,
  audio: (uri, filename, duration) => `wix:audio://v1/${uri}/${filename}#duration=${duration}`
};
const matchers$1 = {
  vector: /^wix:vector:\/\/v1\/([^\/]+)\/([^\/]*)$/,
  image: /^wix:image:\/\/v1\/([^\/]+)\/([^\/]*)#originWidth=([0-9]+)&originHeight=([0-9]+)(?:&watermark=([^\/]+))?$/,
  document: /^wix:document:\/\/v1\/([^\/]+)\/([^\/]+)$/,
  video: /^wix:video:\/\/v1\/([^\/]+)\/([^\/]+)#posterUri=([^\/]+)&posterWidth=([0-9]+)&posterHeight=([0-9]+)$/,
  audio: /^wix:audio:\/\/v1\/([^\/]+)\/([^\/]+)#duration=([0-9]+)$/,
  deprecated_video: /^wix:video:\/\/v1\/([^\/]+)\/([^\/]+)\/#posterUri=([^\/]+)&posterWidth=([0-9]+)&posterHeight=([0-9]+)$/,
  deprecated_image: /^image:\/\/v1\/([^\/]+)\/([0-9]+)_([0-9]+)\/([^\/]*)$/,
  deprecated_type: /^(image):/,
  type: /^wix:(\w+):/,
  splitExtension: /\.(?=[^.]+$)/,
  emptyTitle: /^_\./
};
const matchersByType = {
  vector: [matchers$1.vector],
  image: [matchers$1.image, matchers$1.deprecated_image],
  document: [matchers$1.document],
  video: [matchers$1.video, matchers$1.deprecated_video],
  audio: [matchers$1.audio]
};
function convertTitleToFilename(type, title = "", uri) {
  const [uriName, uriExtension] = uri.split(matchers$1.splitExtension);
  const [titleName, titleExtension] = title.split(matchers$1.splitExtension);
  let filename;
  switch (type) {
    case types.IMAGE:
      filename = `${titleName || "_"}.${titleExtension || uriExtension}`;
      break;
    case types.DOCUMENT:
      filename = `${titleName || uriName}.${titleExtension || uriExtension}`;
      break;
    case types.VIDEO:
      filename = `${titleName || "_"}${titleExtension ? `.${titleExtension}` : ""}`;
      break;
    case types.AUDIO:
      filename = `${titleName || uriName}.${titleExtension || uriExtension}`;
      break;
    case types.VECTOR:
      filename = `${titleName || uriName}.${titleExtension || uriExtension}`;
      break;
    default:
      filename = "";
      break;
  }
  return encodeURI(filename);
}
function convertFilenameToTitle(filename) {
  return matchers$1.emptyTitle.test(filename) ? "" : decodeURI(filename);
}
function createImageItem({ mediaId, title, width, height, watermark }) {
  if (!mediaId) {
    return { error: errors.empty_media_id };
  }
  if (typeof height !== "number" || typeof width !== "number") {
    return { error: errors.missing_width_height };
  }
  const filename = convertTitleToFilename(types.IMAGE, title, mediaId);
  return { item: templates.image(mediaId, filename, width, height, watermark) };
}
function createDocumentItem({ mediaId, title }) {
  if (!mediaId) {
    return { error: errors.empty_media_id };
  }
  const filename = convertTitleToFilename(types.DOCUMENT, title, mediaId);
  return { item: templates.document(mediaId, filename) };
}
function createVectorItem({ mediaId, title }) {
  if (!mediaId) {
    return { error: errors.empty_media_id };
  }
  const filename = convertTitleToFilename(types.VECTOR, title, mediaId);
  return { item: templates.vector(mediaId, filename) };
}
function createVideoItem({ mediaId, title, width, height, posterId }) {
  if (!mediaId) {
    return { error: errors.empty_media_id };
  }
  if (!posterId) {
    return { error: errors.empty_poster_id };
  }
  if (isNaN(height || NaN) || isNaN(width || NaN)) {
    return { error: errors.missing_width_height };
  }
  const strippedMediaId = mediaId.replace("video/", "");
  const filename = convertTitleToFilename(types.VIDEO, title, strippedMediaId);
  return {
    item: templates.video(strippedMediaId, posterId, filename, width, height)
  };
}
function createAudioItem({ mediaId, title, duration }) {
  if (!mediaId) {
    return { error: errors.empty_media_id };
  }
  const filename = convertTitleToFilename(types.AUDIO, title, mediaId);
  return { item: templates.audio(mediaId, filename, duration || 0) };
}
function parseImageItem(item) {
  const [, mediaId, filename, width, height, watermark] = item.match(matchers$1.image) || [];
  const title = convertFilenameToTitle(filename);
  if (mediaId) {
    const parsed = {
      type: types.IMAGE,
      mediaId,
      title,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      watermark
    };
    return parsed;
  }
  return { error: errors.bad_media_id };
}
function parseDeprecatedImageItem(item) {
  const [, mediaId, width, height, filename] = item.match(matchers$1.deprecated_image) || [];
  const title = convertFilenameToTitle(filename);
  if (mediaId) {
    return {
      type: types.IMAGE,
      mediaId,
      title,
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    };
  }
  return { error: errors.bad_media_id };
}
function parseDocumentItem(item) {
  const [, mediaId, filename] = item.match(matchers$1.document) || [];
  const title = convertFilenameToTitle(filename);
  if (mediaId) {
    return {
      type: types.DOCUMENT,
      mediaId,
      title
    };
  }
  return { error: errors.bad_media_id };
}
function parseVectorItem(item) {
  const [, mediaId, filename] = item.match(matchers$1.vector) || [];
  const title = convertFilenameToTitle(filename);
  if (mediaId) {
    return {
      type: types.VECTOR,
      mediaId,
      title
    };
  }
  return { error: errors.bad_media_id };
}
function parseVideoItem(item) {
  const videoMatcher = matchers$1.deprecated_video.test(item) ? matchers$1.deprecated_video : matchers$1.video;
  const [, mediaId, filename, posterId, width, height] = item.match(videoMatcher) || [];
  const title = convertFilenameToTitle(filename);
  if (mediaId && posterId) {
    return {
      type: types.VIDEO,
      mediaId,
      posterId,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      title
    };
  }
  return { error: errors.bad_media_id };
}
function parseAudioItem(item) {
  const [, mediaId, filename, duration] = item.match(matchers$1.audio) || [];
  const title = convertFilenameToTitle(filename);
  if (mediaId) {
    return {
      type: types.AUDIO,
      mediaId,
      title,
      duration: parseInt(duration, 10)
    };
  }
  return { error: errors.bad_media_id };
}
function createMediaItemUri({ mediaId, type, title, width, height, posterId, watermark, duration }) {
  switch (type) {
    case types.IMAGE:
      return createImageItem({ mediaId, title, width, height, watermark });
    case types.DOCUMENT:
      return createDocumentItem({ mediaId, title });
    case types.VECTOR:
      return createVectorItem({ mediaId, title });
    case types.VIDEO:
      return createVideoItem({ mediaId, title, width, height, posterId });
    case types.AUDIO:
      return createAudioItem({ mediaId, title, duration });
    default:
      return { error: errors.unknown_media_type };
  }
}
function parseMediaItemUri(mediaItemUri = "") {
  if (typeof mediaItemUri !== "string") {
    return { error: errors.non_string_media_id };
  }
  const [, type] = mediaItemUri.match(matchers$1.type) || [];
  switch (type) {
    case types.IMAGE:
      return parseImageItem(mediaItemUri);
    case types.DOCUMENT:
      return parseDocumentItem(mediaItemUri);
    case types.VECTOR:
      return parseVectorItem(mediaItemUri);
    case types.VIDEO:
      return parseVideoItem(mediaItemUri);
    case types.AUDIO:
      return parseAudioItem(mediaItemUri);
    default:
      const [, deprecatedType] = mediaItemUri.match(matchers$1.deprecated_type) || [];
      if (deprecatedType) {
        return parseDeprecatedImageItem(mediaItemUri);
      }
      return { error: errors.unknown_media_type };
  }
}
function isValidMediaItemUri(mediaItemUri = "", type) {
  const typeMatchers = matchersByType[type];
  return typeMatchers && typeMatchers.some((matcher) => matcher.test(mediaItemUri));
}
const matchers = {
  externalUrl: /(^https?)|(^data)|(^blob)|(^\/\/)/,
  inlineSvg: /<svg[\s\S]*>[\s\S]*<\/svg>/im
};
const extraMatchersByType = {
  [types.VECTOR]: [matchers.externalUrl, matchers.inlineSvg],
  [types.IMAGE]: [matchers.externalUrl],
  [types.DOCUMENT]: [],
  [types.VIDEO]: [],
  [types.AUDIO]: [matchers.externalUrl]
};
function createMediaSrc({ mediaId, type, title, width, height, posterId, watermark, duration }) {
  var _a;
  if (
    // @ts-expect-error
    (_a = extraMatchersByType[type]) == null ? void 0 : _a.some((matcher) => matcher.test(mediaId))
  ) {
    return { item: mediaId };
  }
  return createMediaItemUri({
    mediaId,
    type,
    title,
    width,
    height,
    posterId,
    watermark,
    duration
  });
}
function parseMediaSrc(mediaItemSrc, type) {
  if (!Object.values(types).includes(type)) {
    return { error: errors.unknown_media_type };
  }
  if (extraMatchersByType[type].some((matcher) => matcher.test(mediaItemSrc))) {
    return { type, mediaId: mediaItemSrc };
  }
  const mediaItemUri = parseMediaItemUri(mediaItemSrc);
  if (mediaItemUri.error === errors.non_string_media_id) {
    return mediaItemUri;
  }
  if (mediaItemUri.error === errors.unknown_media_type || type !== mediaItemUri.type) {
    return { error: errors.bad_media_id };
  }
  return mediaItemUri;
}
function isValidMediaSrc(mediaSrc, type) {
  const isValidMediaItemUri$1 = isValidMediaItemUri(mediaSrc, type);
  return isValidMediaItemUri$1 || extraMatchersByType[type] && extraMatchersByType[type].some((matcher) => matcher.test(mediaSrc));
}
const CORVID_BG_VIDEO_DEFAULTS = {
  loop: true,
  preload: "auto",
  muted: true,
  isVideoEnabled: true
};
const getVideoPosterObject = ({ mediaId, posterId, width, height, title }) => {
  return {
    type: "WixVideo",
    videoId: mediaId,
    posterImageRef: {
      type: "Image",
      uri: posterId,
      width,
      height,
      title
    }
  };
};
const getVideoId = (videoId) => {
  return videoId.replace("video/", "");
};
const getFullVideoObject = (fileInfo, info) => {
  const MEDIA_OBJECT_DEFAULTS = {
    animatePoster: "none",
    autoPlay: true,
    playbackRate: 1,
    fittingType: "fill",
    hasBgScrollEffect: "",
    bgEffectName: "",
    isVideoDataExists: "1",
    alignType: "center",
    videoFormat: "mp4",
    playerType: "html5",
    isEditorMode: false,
    isViewerMode: true,
    videoHeight: fileInfo.file_input.height,
    videoWidth: fileInfo.file_input.width
  };
  const mediaObject = parseVideoFileInfo(fileInfo, info);
  return {
    mediaObject: {
      ...MEDIA_OBJECT_DEFAULTS,
      ...mediaObject
    },
    ...CORVID_BG_VIDEO_DEFAULTS
  };
};
const getMediaDataFromSrc = (value) => {
  if (isValidMediaSrc(value, "video")) {
    const parseMediaItem = parseMediaSrc(value, "video");
    if (parseMediaItem.error) {
      return null;
    }
    return {
      ...getVideoPosterObject(parseMediaItem),
      ...{
        name: parseMediaItem.title,
        fileName: parseMediaItem.title,
        type: "WixVideo"
      }
    };
  } else {
    const parseMediaItem = parseMediaSrc(value, "image");
    if (parseMediaItem.error) {
      return null;
    }
    return {
      ...parseMediaItem,
      ...{
        name: parseMediaItem.title,
        type: "Image"
      }
    };
  }
};
const getVideoDataByVideoId = async (videoId) => {
  videoId = getVideoId(videoId);
  const VIDEO_INFO_END_POINT = `https://files.wix.com/site/media/files/${videoId}/info`;
  const httpClient = new HttpClient();
  const videoData = await httpClient.get(VIDEO_INFO_END_POINT);
  return getFullVideoObject(videoData.data, {});
};
function createSdk(getProps, setProps) {
  return {
    get src() {
      var _a, _b, _c, _d, _e, _f;
      const props = getProps();
      if ((_a = props.videoMedia) == null ? void 0 : _a.uri) {
        return createMediaSrc({
          type: "video",
          mediaId: props.videoMedia.uri,
          title: props.videoMedia.name,
          width: (_c = (_b = props.videoMedia.sources) == null ? void 0 : _b[0]) == null ? void 0 : _c.width,
          height: (_e = (_d = props.videoMedia.sources) == null ? void 0 : _d[0]) == null ? void 0 : _e.height,
          posterId: (_f = props.videoMedia.poster) == null ? void 0 : _f.uri,
          duration: props.videoMedia.duration
        }).item ?? "";
      }
      if (props.image) {
        return createMediaSrc({
          type: "image",
          mediaId: props.image.uri,
          title: props.image.name,
          width: props.image.width,
          height: props.image.height
        }).item ?? "";
      }
      return "";
    },
    set src(value) {
      const src = isNil(value) ? "" : value;
      if (src === "") {
        setProps({
          videoMedia: void 0,
          loop: void 0,
          muted: void 0,
          autoplay: void 0,
          playbackRate: void 0,
          qualityPolicy: void 0,
          posterEffect: void 0,
          image: void 0
        });
        return;
      }
      if (isValidMediaSrc(src, "video")) {
        const mediaData = getMediaDataFromSrc(src);
        if (!mediaData || mediaData.type !== "WixVideo" || !mediaData.videoId) {
          return;
        }
        const preservedProps = getProps();
        getVideoDataByVideoId(mediaData.videoId).then((fullVideoRefData) => {
          var _a, _b;
          const updatedVideoMedia = {
            uri: fullVideoRefData.mediaObject.videoId || "",
            name: mediaData.name || fullVideoRefData.mediaObject.title || "",
            sources: ((_a = fullVideoRefData.mediaObject.qualities) == null ? void 0 : _a.map((quality) => ({
              quality: quality.quality,
              width: quality.width,
              height: quality.height,
              types: [
                {
                  format: quality.format || "mp4",
                  uri: quality.url
                }
              ]
            }))) || [],
            adaptiveSources: ((_b = fullVideoRefData.mediaObject.adaptiveVideo) == null ? void 0 : _b.map(
              (adaptive) => ({
                format: adaptive.format,
                uri: adaptive.url
              })
            )) || [],
            hasAudio: fullVideoRefData.mediaObject.hasAudio || false,
            fps: fullVideoRefData.mediaObject.fps ? Number(fullVideoRefData.mediaObject.fps) : void 0,
            duration: fullVideoRefData.mediaObject.duration,
            poster: fullVideoRefData.mediaObject.posterImageRef
          };
          setProps({
            image: void 0,
            videoMedia: updatedVideoMedia,
            loop: preservedProps.loop ?? true,
            muted: preservedProps.muted ?? true,
            autoplay: preservedProps.autoplay ?? true,
            playbackRate: preservedProps.playbackRate ?? "1.0",
            qualityPolicy: preservedProps.qualityPolicy ?? "proportional"
          });
        }).catch((error2) => {
          reportError(error2);
        });
        return;
      }
      const {
        height,
        width,
        title,
        error,
        mediaId: uri
      } = parseMediaSrc(src.toString(), "image");
      if (error) {
        reportError(
          `The "src" property cannot be set to "${src}". It must be a valid URL starting with "http://", "https://", "wix:image://", or "wix:video://".`
        );
        return;
      }
      const currentData = getProps();
      const updatedImageData = {
        width: width || 0,
        height: height || 0,
        uri: uri || "",
        name: title || "",
        alt: title || ""
      };
      setProps({
        videoMedia: void 0,
        loop: void 0,
        muted: void 0,
        autoplay: void 0,
        playbackRate: void 0,
        qualityPolicy: void 0,
        posterEffect: void 0,
        image: updatedImageData,
        fittingType: (currentData == null ? void 0 : currentData.fittingType) || "fill"
      });
    },
    get title() {
      var _a, _b;
      const props = getProps();
      if ((_a = props.videoMedia) == null ? void 0 : _a.name) {
        return props.videoMedia.name;
      }
      if ((_b = props.image) == null ? void 0 : _b.name) {
        return props.image.name;
      }
      return "";
    },
    set title(value) {
      var _a, _b;
      const title = isNil(value) ? "" : value.toString();
      const props = getProps();
      if ((_a = props.videoMedia) == null ? void 0 : _a.uri) {
        setProps({
          videoMedia: {
            ...props.videoMedia,
            name: title
          }
        });
      } else if ((_b = props.image) == null ? void 0 : _b.uri) {
        setProps({
          image: {
            ...props.image,
            name: title
          }
        });
      } else {
        reportError("Cannot set title when no media is set.");
      }
    },
    get description() {
      var _a, _b;
      const props = getProps();
      return ((_a = props.videoMedia) == null ? void 0 : _a.name) || ((_b = props.image) == null ? void 0 : _b.alt) || "";
    },
    set description(value) {
      var _a, _b;
      const description = isNil(value) ? "" : value.toString();
      const props = getProps();
      if ((_a = props.videoMedia) == null ? void 0 : _a.uri) {
        setProps({
          videoMedia: {
            ...props.videoMedia,
            name: description
          }
        });
      } else if ((_b = props.image) == null ? void 0 : _b.uri) {
        setProps({
          image: {
            ...props.image,
            alt: description
          }
        });
      } else {
        reportError("Cannot set description when no media is set.");
      }
    },
    get sources() {
      var _a, _b, _c;
      const props = getProps();
      if ((_a = props.videoMedia) == null ? void 0 : _a.uri) {
        if (props.videoMedia.sources) {
          return (_b = props.videoMedia.sources) == null ? void 0 : _b.map((source) => {
            var _a2, _b2, _c2, _d;
            return {
              quality: source.quality,
              width: source.width,
              height: source.height,
              url: ((_b2 = (_a2 = source.types) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.uri) || "",
              format: ((_d = (_c2 = source.types) == null ? void 0 : _c2[0]) == null ? void 0 : _d.format) || "mp4"
            };
          });
        }
        if (props.videoMedia.adaptiveSources) {
          return (_c = props.videoMedia.adaptiveSources) == null ? void 0 : _c.map((source) => ({
            quality: source.format,
            url: source.uri
          }));
        }
      }
      return [];
    },
    get fittingType() {
      const props = getProps();
      return props.fittingType || "fill";
    },
    set fittingType(value) {
      const validValues = [
        "fill",
        "tile",
        "original_size"
      ];
      if (typeof value !== "string" || !validValues.includes(value)) {
        reportError(
          `The "fittingType" property cannot be set to "${String(value)}". It must be one of: ${validValues.join(", ")}.`
        );
        return;
      }
      setProps({ fittingType: value });
    },
    get type() {
      return "$w.Background";
    },
    toJSON() {
      var _a, _b, _c, _d;
      const props = getProps();
      return {
        type: "$w.Background",
        src: ((_a = props.videoMedia) == null ? void 0 : _a.uri) || ((_b = props.image) == null ? void 0 : _b.uri) || "",
        title: ((_c = props.videoMedia) == null ? void 0 : _c.name) || ((_d = props.image) == null ? void 0 : _d.name) || "",
        description: this.description,
        sources: this.sources,
        fittingType: props.fittingType
      };
    }
  };
}
export {
  createSdk as default
};
//# sourceMappingURL=script-asset-81f3000f-f78a-459d-a044-59bd7a96092a-sdk.ch.v-4uu9iF.js.map
