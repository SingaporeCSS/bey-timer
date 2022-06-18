"use strict";

/* global FastClick, screenfull */
(function () {
  console.log('%c happy timing ;-)', 'background: #f15b47; color: #fff');
  var play = false;
  var intervalID;
  var minElement = document.getElementById('minutes');
  var secElement = document.getElementById('seconds');
  var infoElement = document.getElementById('info');
  var progressElement = document.getElementById('progress');
  var no = document.getElementById('no');
  var minValue = sanitize(minElement.innerHTML);
  var secValue = sanitize(secElement.innerHTML);
  var minSecValues = [0, 5, 0, 0];
  var minSecValueCount = 0;
  var totalSeconds = minValue * 60 + secValue;
  var currentSeconds = 0;
  var singleTap = false;
  var doubleTap = false;
  var configAscii = {
    '48': '0',
    '49': 1,
    '50': 2,
    '51': 3,
    '52': 4,
    '53': 5,
    '54': 6,
    '55': 7,
    '56': 8,
    '57': 9
  };
  var audio = new Audio('assets/crazy-in-love.mp3');
  minElement.addEventListener('blur', setTimer);
  secElement.addEventListener('blur', setTimer);

  function setMinSecValues(pressedValue) {
    if (!pressedValue) return;
    if (play) return;
    minSecValues[0] = minSecValues[1];
    minSecValues[1] = minSecValues[2];
    minSecValues[2] = minSecValues[3];
    minSecValues[3] = pressedValue;
    minElement.innerHTML = minSecValues[0] + '' + minSecValues[1];
    secElement.innerHTML = minSecValues[2] + '' + minSecValues[3];
    setTimer();
    setColors(minSecValueCount);
    minSecValueCount = (minSecValueCount + 1) % 4;
  }

  function setColors(count) {
    return count < 2 ? minElement.className = 'clock mute' : minElement.className = 'clock info';
  }

  function setTimer() {
    minValue = sanitize(minElement.innerHTML);
    secValue = sanitize(secElement.innerHTML);
    totalSeconds = secValue + 60 * minValue;
    currentSeconds = 0;
  }

  function sanitize(input) {
    return Math.abs(parseInt(input, 10));
  }

  function make2Digits(input) {
    return ('0' + input).slice(-2);
  }

  function startCountdown(min, sec) {
    intervalID = setInterval(function () {
      if (--sec < 0) {
        sec += 60;

        if (--min < 0) {
          endCountdown();
          audio.play();
          clearInterval(intervalID);
          return;
        }
      }

      minElement.innerHTML = ('0' + min).slice(-2);
      secElement.innerHTML = ('0' + sec).slice(-2);
      currentSeconds++;
      progressElement.value = Math.ceil(currentSeconds / totalSeconds * 100);
    }, 1000);
  }

  function endCountdown() {
    infoElement.style.display = 'block';
    progressElement.style.display = 'none';
    no.style.display = 'flex';
  }

  function togglePausePlay() {
    if (play) {
      play = false;
      clearInterval(intervalID);
      if (screenfull.enabled) screenfull.exit();
    } else {
      minElement.innerHTML = make2Digits(sanitize(minElement.innerHTML));
      secElement.innerHTML = make2Digits(sanitize(secElement.innerHTML));
      startCountdown(minElement.innerHTML, secElement.innerHTML);
      play = true;
      infoElement.style.display = 'none';
      progressElement.style.display = 'block';
      if (screenfull.enabled) screenfull.request();
    }
  }

  function resetTimer() {
    audio.load();
    clearInterval(intervalID);
    minElement.innerHTML = make2Digits(minValue);
    secElement.innerHTML = make2Digits(secValue);
    infoElement.style.display = 'block';
    progressElement.style.display = 'none';
    progressElement.value = 0;
    no.style.display = 'none';
    currentSeconds = 0;
  }

  function is_touch_device() {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  }

  function setIntructions() {
    if (is_touch_device()) {
      var className = 'hidden';
      var nilClass = '';
      document.getElementById('info-space').className = className;
      document.getElementById('info-esc').className = className;
      document.getElementById('info-tap').className = nilClass;
      document.getElementById('info-2tap').className = nilClass;
    }
  }

  setMinSecValues();
  setIntructions();

  if (is_touch_device()) {
    document.getElementById('edit').innerHTML = '<input type="number" placeholder="0500" class="input"> edit time';

    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
      }, false);
    }
  }

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 32) {
      // ASCII 32 is space
      e.preventDefault();
      return togglePausePlay();
    } else if (e.keyCode === 27 || e.keyCode === 13) {
      // ASCII 27, 13 is escape, enter
      return resetTimer();
    } else if (e.keyCode > 47 && e.keyCode < 58) {
      // ASCII value is a number
      return setMinSecValues(configAscii[e.keyCode]);
    }
  });
  window.addEventListener('click', function (e) {
    if (e.toElement && e.toElement.tagName !== 'INPUT') {
      return togglePausePlay();
    }

    if (e.target && e.target.tagName !== 'INPUT' && e.target.className !== 'clock info') {
      return togglePausePlay();
    }
  });
  window.addEventListener('touchend', function (e) {
    if (e.srcElement.tagName !== 'INPUT') {
      if (!singleTap) {
        singleTap = true;
        setTimeout(function () {
          singleTap = false;
          if (doubleTap) resetTimer();else togglePausePlay();
          doubleTap = false;
        }, 400);
      } else {
        doubleTap = true;
      }
    }
  });
})();
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * Minified by jsDelivr using UglifyJS v3.4.4.
 * Original file: /npm/fastclick@1.0.6/lib/fastclick.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function () {
  "use strict";

  function s(i, t) {
    var e;

    if (t = t || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = t.touchBoundary || 10, this.layer = i, this.tapDelay = t.tapDelay || 200, this.tapTimeout = t.tapTimeout || 700, !s.notNeeded(i)) {
      for (var n = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], o = this, r = 0, a = n.length; r < a; r++) {
        o[n[r]] = c(o[n[r]], o);
      }

      u && (i.addEventListener("mouseover", this.onMouse, !0), i.addEventListener("mousedown", this.onMouse, !0), i.addEventListener("mouseup", this.onMouse, !0)), i.addEventListener("click", this.onClick, !0), i.addEventListener("touchstart", this.onTouchStart, !1), i.addEventListener("touchmove", this.onTouchMove, !1), i.addEventListener("touchend", this.onTouchEnd, !1), i.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (i.removeEventListener = function (t, e, n) {
        var o = Node.prototype.removeEventListener;
        "click" === t ? o.call(i, t, e.hijacked || e, n) : o.call(i, t, e, n);
      }, i.addEventListener = function (t, e, n) {
        var o = Node.prototype.addEventListener;
        "click" === t ? o.call(i, t, e.hijacked || (e.hijacked = function (t) {
          t.propagationStopped || e(t);
        }), n) : o.call(i, t, e, n);
      }), "function" == typeof i.onclick && (e = i.onclick, i.addEventListener("click", function (t) {
        e(t);
      }, !1), i.onclick = null);
    }

    function c(t, e) {
      return function () {
        return t.apply(e, arguments);
      };
    }
  }

  var t = 0 <= navigator.userAgent.indexOf("Windows Phone"),
      u = 0 < navigator.userAgent.indexOf("Android") && !t,
      c = /iP(ad|hone|od)/.test(navigator.userAgent) && !t,
      l = c && /OS 4_\d(_\d)?/.test(navigator.userAgent),
      h = c && /OS [6-7]_\d/.test(navigator.userAgent),
      i = 0 < navigator.userAgent.indexOf("BB10");
  s.prototype.needsClick = function (t) {
    switch (t.nodeName.toLowerCase()) {
      case "button":
      case "select":
      case "textarea":
        if (t.disabled) return !0;
        break;

      case "input":
        if (c && "file" === t.type || t.disabled) return !0;
        break;

      case "label":
      case "iframe":
      case "video":
        return !0;
    }

    return /\bneedsclick\b/.test(t.className);
  }, s.prototype.needsFocus = function (t) {
    switch (t.nodeName.toLowerCase()) {
      case "textarea":
        return !0;

      case "select":
        return !u;

      case "input":
        switch (t.type) {
          case "button":
          case "checkbox":
          case "file":
          case "image":
          case "radio":
          case "submit":
            return !1;
        }

        return !t.disabled && !t.readOnly;

      default:
        return /\bneedsfocus\b/.test(t.className);
    }
  }, s.prototype.sendClick = function (t, e) {
    var n, o;
    document.activeElement && document.activeElement !== t && document.activeElement.blur(), o = e.changedTouches[0], (n = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t), !0, !0, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n);
  }, s.prototype.determineEventType = function (t) {
    return u && "select" === t.tagName.toLowerCase() ? "mousedown" : "click";
  }, s.prototype.focus = function (t) {
    var e;
    c && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus();
  }, s.prototype.updateScrollParent = function (t) {
    var e, n;

    if (!(e = t.fastClickScrollParent) || !e.contains(t)) {
      n = t;

      do {
        if (n.scrollHeight > n.offsetHeight) {
          e = n, t.fastClickScrollParent = n;
          break;
        }

        n = n.parentElement;
      } while (n);
    }

    e && (e.fastClickLastScrollTop = e.scrollTop);
  }, s.prototype.getTargetElementFromEventTarget = function (t) {
    return t.nodeType === Node.TEXT_NODE ? t.parentNode : t;
  }, s.prototype.onTouchStart = function (t) {
    var e, n, o;
    if (1 < t.targetTouches.length) return !0;

    if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], c) {
      if ((o = window.getSelection()).rangeCount && !o.isCollapsed) return !0;

      if (!l) {
        if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
        this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e);
      }
    }

    return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0;
  }, s.prototype.touchHasMoved = function (t) {
    var e = t.changedTouches[0],
        n = this.touchBoundary;
    return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n;
  }, s.prototype.onTouchMove = function (t) {
    return this.trackingClick && (this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0;
  }, s.prototype.findControl = function (t) {
    return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea");
  }, s.prototype.onTouchEnd = function (t) {
    var e,
        n,
        o,
        i,
        r,
        a = this.targetElement;
    if (!this.trackingClick) return !0;
    if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0;
    if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;

    if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, n = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, h && (r = t.changedTouches[0], (a = document.elementFromPoint(r.pageX - window.pageXOffset, r.pageY - window.pageYOffset) || a).fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (o = a.tagName.toLowerCase())) {
      if (e = this.findControl(a)) {
        if (this.focus(a), u) return !1;
        a = e;
      }
    } else if (this.needsFocus(a)) return 100 < t.timeStamp - n || c && window.top !== window && "input" === o ? this.targetElement = null : (this.focus(a), this.sendClick(a, t), c && "select" === o || (this.targetElement = null, t.preventDefault())), !1;

    return !(!c || l || !(i = a.fastClickScrollParent) || i.fastClickLastScrollTop === i.scrollTop) || (this.needsClick(a) || (t.preventDefault(), this.sendClick(a, t)), !1);
  }, s.prototype.onTouchCancel = function () {
    this.trackingClick = !1, this.targetElement = null;
  }, s.prototype.onMouse = function (t) {
    return !this.targetElement || !!t.forwardedTouchEvent || !t.cancelable || !(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1);
  }, s.prototype.onClick = function (t) {
    var e;
    return this.trackingClick ? (this.targetElement = null, !(this.trackingClick = !1)) : "submit" === t.target.type && 0 === t.detail || ((e = this.onMouse(t)) || (this.targetElement = null), e);
  }, s.prototype.destroy = function () {
    var t = this.layer;
    u && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1);
  }, s.notNeeded = function (t) {
    var e, n, o;
    if (void 0 === window.ontouchstart) return !0;

    if (n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
      if (!u) return !0;

      if (e = document.querySelector("meta[name=viewport]")) {
        if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
        if (31 < n && document.documentElement.scrollWidth <= window.outerWidth) return !0;
      }
    }

    if (i && 10 <= (o = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] && 3 <= o[2] && (e = document.querySelector("meta[name=viewport]"))) {
      if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
      if (document.documentElement.scrollWidth <= window.outerWidth) return !0;
    }

    return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || !!(27 <= +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || "none" === t.style.touchAction || "manipulation" === t.style.touchAction;
  }, s.attach = function (t, e) {
    return new s(t, e);
  }, "function" == typeof define && "object" == _typeof(define.amd) && define.amd ? define(function () {
    return s;
  }) : "undefined" != typeof module && module.exports ? (module.exports = s.attach, module.exports.FastClick = s) : window.FastClick = s;
}();
"use strict";

/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/screenfull@4.2.0/dist/screenfull.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function () {
  "use strict";

  var e = "undefined" != typeof window && void 0 !== window.document ? window.document : {},
      n = "undefined" != typeof module && module.exports,
      l = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
      r = function () {
    for (var n, l = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], r = 0, t = l.length, u = {}; r < t; r++) {
      if ((n = l[r]) && n[1] in e) {
        for (r = 0; r < n.length; r++) {
          u[l[0][r]] = n[r];
        }

        return u;
      }
    }

    return !1;
  }(),
      t = {
    change: r.fullscreenchange,
    error: r.fullscreenerror
  },
      u = {
    request: function request(n) {
      return new Promise(function (t) {
        var u = r.requestFullscreen,
            c = function () {
          this.off("change", c), t();
        }.bind(this);

        n = n || e.documentElement, / Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent) ? n[u]() : n[u](l ? Element.ALLOW_KEYBOARD_INPUT : {}), this.on("change", c);
      }.bind(this));
    },
    exit: function exit() {
      return new Promise(function (n) {
        if (this.isFullscreen) {
          var l = function () {
            this.off("change", l), n();
          }.bind(this);

          e[r.exitFullscreen](), this.on("change", l);
        } else n();
      }.bind(this));
    },
    toggle: function toggle(e) {
      return this.isFullscreen ? this.exit() : this.request(e);
    },
    onchange: function onchange(e) {
      this.on("change", e);
    },
    onerror: function onerror(e) {
      this.on("error", e);
    },
    on: function on(n, l) {
      var r = t[n];
      r && e.addEventListener(r, l, !1);
    },
    off: function off(n, l) {
      var r = t[n];
      r && e.removeEventListener(r, l, !1);
    },
    raw: r
  };

  r ? (Object.defineProperties(u, {
    isFullscreen: {
      get: function get() {
        return Boolean(e[r.fullscreenElement]);
      }
    },
    element: {
      enumerable: !0,
      get: function get() {
        return e[r.fullscreenElement];
      }
    },
    enabled: {
      enumerable: !0,
      get: function get() {
        return Boolean(e[r.fullscreenEnabled]);
      }
    }
  }), n ? (module.exports = u, module.exports["default"] = u) : window.screenfull = u) : n ? module.exports = !1 : window.screenfull = !1;
}();