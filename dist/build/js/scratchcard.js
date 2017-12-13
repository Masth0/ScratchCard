(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ScratchCard.default"] = factory();
	else
		root["ScratchCard.default"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ScratchCardConfig_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(2);
var Brush_1 = __webpack_require__(3);
var ScratchCard = /** @class */ (function () {
    function ScratchCard(selector, config) {
        var self = this;
        var defaults = {
            scratchType: ScratchCardConfig_1.SCRATCH_TYPE.SPRAY,
            container: HTMLElement,
            nPoints: 100,
            pointSize: [10, 10],
            callback: function () {
                alert('done.');
            },
            brushSrc: '',
            imageForwardSrc: './images/scratchcard.png',
            imageBackgroundSrc: './images/scratchcard-background.svg',
            clearZoneRadius: 0,
        };
        this.config = Object.assign(defaults, config);
        this.scratchType = this.config.scratchType;
        this.container = document.querySelector(selector);
        this.position = [0, 0]; // init position
        this.readyToClear = false;
        // Add canvas in container
        this.init();
        // debug
        var cursorDebug = document.getElementById('js-debug-cursor');
        var scratching = utils_1.throttle(function (event) {
            self.position = self.mousePosition(event);
            self.brush.updateMousePosition(self.position[0], self.position[1]);
            self.scratch();
            // calculate the percent of area scratched.
            self.percent = self.getPercent();
            if (self.percent >= 50) {
                self.clear();
                self.canvas.style.pointerEvents = 'none';
                if (self.config.callback !== undefined) {
                    self.config.callback();
                }
            }
        }, 16);
        this.canvas.addEventListener('mousedown', function (event) {
            self.canvas.addEventListener('mousemove', scratching);
            document.body.addEventListener('mouseup', function _func() {
                self.canvas.removeEventListener('mousemove', scratching);
                this.removeEventListener('mouseup', _func);
            });
        });
    }
    ScratchCard.prototype.init = function () {
        var _this = this;
        this.generateCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.zone = this.canvas.getBoundingClientRect();
        this.brush = new Brush_1.default(this.ctx, this.position[0], this.position[1]);
        // Init the brush if  necessary
        if (this.config.scratchType === ScratchCardConfig_1.SCRATCH_TYPE.BRUSH) {
            this.brushImage = Brush_1.default.generateBrush(this.config.brushSrc);
        }
        utils_1.loadImage(this.config.imageForwardSrc).then(function (img) {
            _this.ctx.drawImage(img, 0, 0, _this.canvas.width, _this.canvas.height);
            _this.setBackground();
        }, function (event) {
            // Stop all script here
            console.log(event);
            return new TypeError(_this.config.imageForwardSrc + " is not loaded.");
        });
    };
    ScratchCard.prototype.generateCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('sc__canvas');
        // Add canvas into container
        this.container.appendChild(this.canvas);
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    };
    ScratchCard.prototype.setBackground = function () {
        var _this = this;
        var image = document.createElement('img');
        utils_1.loadImage(this.config.imageBackgroundSrc).then(function (img) {
            image.src = img.src;
            _this.container.insertBefore(image, _this.canvas);
        }, function (event) {
            // Stop all script here
            console.log(event);
        });
    };
    ;
    ScratchCard.prototype.mousePosition = function (event) {
        var posX;
        var posY;
        switch (event.type) {
            case 'touchmove':
                posX = event.touches[0].clientX - (this.config.clearZoneRadius / 2) - window.pageXOffset - this.zone.left;
                posY = event.touches[0].clientY - (this.config.clearZoneRadius / 2) - window.pageYOffset - this.zone.top;
                break;
            case 'mousemove':
                posX = event.clientX - this.config.clearZoneRadius - window.pageXOffset - this.zone.left;
                posY = event.clientY - this.config.clearZoneRadius - window.pageYOffset - this.zone.top;
                break;
        }
        return [posX, posY];
    };
    ScratchCard.prototype.scratch = function () {
        var x = this.position[0];
        var y = this.position[1];
        var i = 0;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.save();
        switch (this.config.scratchType) {
            case ScratchCardConfig_1.SCRATCH_TYPE.BRUSH:
                this.brush.brush(this.brushImage);
                break;
            case ScratchCardConfig_1.SCRATCH_TYPE.CIRCLE:
                this.brush.circle(this.config.clearZoneRadius);
                break;
            case ScratchCardConfig_1.SCRATCH_TYPE.SPRAY:
                this.brush.spray(this.config.clearZoneRadius, 2, 100);
                break;
        }
        this.ctx.restore();
    };
    ScratchCard.prototype.getPercent = function () {
        var percent;
        var counter = 0; // number of pixels clear
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var imageDataLength = imageData.data.length;
        for (var i = 0; i < imageDataLength; i += 4) {
            if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
                counter++;
            }
        }
        if (counter >= 1) {
            percent = (counter / (this.canvas.width * this.canvas.height)) * 100;
        }
        else {
            percent = 0;
        }
        return percent;
    };
    /**
     * Just clear the canvas
     */
    ScratchCard.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return ScratchCard;
}());
// Expose in window directly
window.ScratchCard = ScratchCard;
window.SCRATCH_TYPE = ScratchCardConfig_1.SCRATCH_TYPE;
exports.default = ScratchCard;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SCRATCH_TYPE;
(function (SCRATCH_TYPE) {
    SCRATCH_TYPE[SCRATCH_TYPE["BRUSH"] = 0] = "BRUSH";
    SCRATCH_TYPE[SCRATCH_TYPE["SPRAY"] = 1] = "SPRAY";
    SCRATCH_TYPE[SCRATCH_TYPE["CIRCLE"] = 2] = "CIRCLE";
})(SCRATCH_TYPE = exports.SCRATCH_TYPE || (exports.SCRATCH_TYPE = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return a random number in range
 * @param min {Number}
 * @param max {Number}
 */
function randomPoint(min, max) {
    var random = Math.abs(Math.random() * (max - min) + min);
    return parseInt(random.toFixed(0), 10);
}
exports.randomPoint = randomPoint;
function dispatchCustomEvent(target, type, detail) {
    var customEvent = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: detail
    });
    target.dispatchEvent(customEvent);
}
exports.dispatchCustomEvent = dispatchCustomEvent;
/**
 *
 * @param src {String}
 */
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () {
            resolve(image);
        };
        image.src = src;
        image.onerror = function (event) {
            reject(event.type);
        };
    });
}
exports.loadImage = loadImage;
function throttle(callback, delay) {
    var last;
    var timer;
    return function () {
        var context = this;
        var now = +new Date();
        var args = arguments;
        if (last && now < last + delay) {
            // le délai n'est pas écoulé on reset le timer
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                callback.apply(context, args);
            }, delay);
        }
        else {
            last = now;
            callback.apply(context, args);
        }
    };
}
exports.throttle = throttle;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Brush = /** @class */ (function () {
    function Brush(ctx, mouseX, mouseY) {
        this.ctx = ctx;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }
    Brush.prototype.updateMousePosition = function (x, y) {
        this.mouseX = x;
        this.mouseY = y;
    };
    Brush.prototype.circle = function (r) {
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX + r, this.mouseY + r, r, 0, Math.PI * 2, false);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        this.ctx.closePath();
    };
    /**
     * For spray get point position in the area to clear the canvas
     * @param {number} r
     * @returns {number[]}
     */
    Brush.prototype.clearPoint = function (r) {
        var radius = r;
        var x = Math.random() * 2 * radius - radius;
        var ylim = Math.sqrt(radius * radius - x * x);
        var y = Math.random() * 2 * ylim - ylim;
        x += radius;
        y += radius;
        x += this.mouseX;
        y += this.mouseY;
        return [x, y];
    };
    /**
     * Create a set of points allocated in area,
     * @param {number} area
     * @param {number} dropsSize
     * @param {number} dropsCount
     */
    Brush.prototype.spray = function (area, dropsSize, dropsCount) {
        var i = 0;
        var dropsLength = dropsCount;
        for (i; i < dropsLength; i++) {
            var points = this.clearPoint(area / 2);
            this.ctx.clearRect(points[0], points[1], dropsSize, dropsSize);
        }
    };
    Brush.generateBrush = function (imgSrc) {
        if (imgSrc.length !== 0) {
            var brush = new Image();
            brush.src = imgSrc;
            return brush;
        }
        else {
            return null;
        }
    };
    Brush.prototype.brush = function (img) {
        if (img === null) {
            var error = new Error('argument img is not a node IMG');
            console.log(error.message);
            return;
        }
        var angle = Math.atan2(this.mouseY, this.mouseX);
        this.ctx.save();
        this.ctx.translate(this.mouseX, this.mouseY);
        this.ctx.rotate(angle);
        this.ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
    };
    return Brush;
}());
exports.default = Brush;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiM2RiNjdiYjJkZjlkNGU0MzZiMCIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZENvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9CcnVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBLGlEQUE0RDtBQUM1RCxxQ0FBOEU7QUFDOUUscUNBQTRCO0FBRTVCO0lBZUUscUJBQWEsUUFBZ0IsRUFBRSxNQUFpQjtRQUM5QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBTSxRQUFRLEdBQUc7WUFDZixXQUFXLEVBQUUsZ0NBQVksQ0FBQyxLQUFLO1lBQy9CLFNBQVMsRUFBRSxXQUFXO1lBQ3RCLE9BQU8sRUFBRSxHQUFHO1lBQ1osU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNqQixRQUFRLEVBQUU7Z0JB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ImZpbGUiOiJzY3JhdGNoY2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlNjcmF0Y2hDYXJkLmRlZmF1bHRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU2NyYXRjaENhcmQuZGVmYXVsdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiM2RiNjdiYjJkZjlkNGU0MzZiMCIsImltcG9ydCB7U0NfQ09ORklHLCBTQ1JBVENIX1RZUEV9IGZyb20gJy4vU2NyYXRjaENhcmRDb25maWcnO1xyXG5pbXBvcnQge3JhbmRvbVBvaW50LCBsb2FkSW1hZ2UsIHRocm90dGxlLCBkaXNwYXRjaEN1c3RvbUV2ZW50fSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IEJydXNoIGZyb20gJy4vQnJ1c2gnO1xyXG5cclxuY2xhc3MgU2NyYXRjaENhcmQge1xyXG4gIHJlYWRvbmx5IGNvbmZpZzogU0NfQ09ORklHO1xyXG4gIHByaXZhdGUgZGVmYXVsdHM6IFNDX0NPTkZJRztcclxuICBwdWJsaWMgcGVyY2VudDogbnVtYmVyOyBcclxuICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIGJnSW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSB6b25lOiBDbGllbnRSZWN0O1xyXG4gIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBwcml2YXRlIHBvc2l0aW9uOiBudW1iZXJbXTtcclxuICBwcml2YXRlIHNjcmF0Y2hUeXBlOiBTQ1JBVENIX1RZUEU7XHJcbiAgcHJpdmF0ZSByZWFkeVRvQ2xlYXI6IEJvb2xlYW47XHJcbiAgcHJpdmF0ZSBicnVzaDogQnJ1c2g7XHJcbiAgcHJpdmF0ZSBicnVzaEltYWdlOiBhbnk7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IgKHNlbGVjdG9yOiBzdHJpbmcsIGNvbmZpZzogU0NfQ09ORklHKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xyXG4gICAgICBzY3JhdGNoVHlwZTogU0NSQVRDSF9UWVBFLlNQUkFZLFxyXG4gICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50LFxyXG4gICAgICBuUG9pbnRzOiAxMDAsXHJcbiAgICAgIHBvaW50U2l6ZTogWzEwLCAxMF0sXHJcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYWxlcnQoJ2RvbmUuJylcclxuICAgICAgfSxcclxuICAgICAgYnJ1c2hTcmM6ICcnLFxyXG4gICAgICBpbWFnZUZvcndhcmRTcmM6ICcuL2ltYWdlcy9zY3JhdGNoY2FyZC5wbmcnLFxyXG4gICAgICBpbWFnZUJhY2tncm91bmRTcmM6ICcuL2ltYWdlcy9zY3JhdGNoY2FyZC1iYWNrZ3JvdW5kLnN2ZycsXHJcbiAgICAgIGNsZWFyWm9uZVJhZGl1czogMCxcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIGNvbmZpZyk7XHJcbiAgICB0aGlzLnNjcmF0Y2hUeXBlID0gdGhpcy5jb25maWcuc2NyYXRjaFR5cGU7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IDxIVE1MRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gWzAsIDBdOyAvLyBpbml0IHBvc2l0aW9uXHJcbiAgICB0aGlzLnJlYWR5VG9DbGVhciA9IGZhbHNlO1xyXG4gICAgLy8gQWRkIGNhbnZhcyBpbiBjb250YWluZXJcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgXHJcbiAgICAvLyBkZWJ1Z1xyXG4gICAgY29uc3QgY3Vyc29yRGVidWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtZGVidWctY3Vyc29yJyk7XHJcblxyXG4gICAgbGV0IHNjcmF0Y2hpbmcgPSB0aHJvdHRsZSgoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgIHNlbGYucG9zaXRpb24gPSBzZWxmLm1vdXNlUG9zaXRpb24oZXZlbnQpO1xyXG4gICAgICBzZWxmLmJydXNoLnVwZGF0ZU1vdXNlUG9zaXRpb24oc2VsZi5wb3NpdGlvblswXSwgc2VsZi5wb3NpdGlvblsxXSk7XHJcbiAgICAgIHNlbGYuc2NyYXRjaCgpO1xyXG4gICAgICAvLyBjYWxjdWxhdGUgdGhlIHBlcmNlbnQgb2YgYXJlYSBzY3JhdGNoZWQuXHJcbiAgICAgIHNlbGYucGVyY2VudCA9IHNlbGYuZ2V0UGVyY2VudCgpO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNlbGYucGVyY2VudCA+PSA1MCkge1xyXG4gICAgICAgIHNlbGYuY2xlYXIoKTtcclxuICAgICAgICBzZWxmLmNhbnZhcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5jYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBzZWxmLmNvbmZpZy5jYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwgMTYpO1xyXG5cclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBzZWxmLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzY3JhdGNoaW5nKTtcclxuICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiBfZnVuYyAoKSB7XHJcbiAgICAgICBzZWxmLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzY3JhdGNoaW5nKTtcclxuICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9mdW5jKTtcclxuICAgICB9KTtcclxuICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgaW5pdCAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdlbmVyYXRlQ2FudmFzKCk7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnpvbmUgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuYnJ1c2ggPSBuZXcgQnJ1c2godGhpcy5jdHgsIHRoaXMucG9zaXRpb25bMF0sIHRoaXMucG9zaXRpb25bMV0pO1xyXG5cclxuICAgIC8vIEluaXQgdGhlIGJydXNoIGlmICBuZWNlc3NhcnlcclxuICAgIGlmICh0aGlzLmNvbmZpZy5zY3JhdGNoVHlwZSA9PT0gU0NSQVRDSF9UWVBFLkJSVVNIKSB7XHJcbiAgICAgIHRoaXMuYnJ1c2hJbWFnZSA9IEJydXNoLmdlbmVyYXRlQnJ1c2godGhpcy5jb25maWcuYnJ1c2hTcmMpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRJbWFnZSh0aGlzLmNvbmZpZy5pbWFnZUZvcndhcmRTcmMpLnRoZW4oKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kKCk7XHJcbiAgICB9LCAoZXZlbnQpID0+IHtcclxuICAgICAgLy8gU3RvcCBhbGwgc2NyaXB0IGhlcmVcclxuICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcihgJHt0aGlzLmNvbmZpZy5pbWFnZUZvcndhcmRTcmN9IGlzIG5vdCBsb2FkZWQuYCk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZUNhbnZhcyAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZCgnc2NfX2NhbnZhcycpO1xyXG4gIFxyXG4gICAgLy8gQWRkIGNhbnZhcyBpbnRvIGNvbnRhaW5lclxyXG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNvbnRhaW5lci5jbGllbnRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY29udGFpbmVyLmNsaWVudEhlaWdodDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0QmFja2dyb3VuZCAoKTogdm9pZCB7XHJcbiAgICBsZXQgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIGxvYWRJbWFnZSh0aGlzLmNvbmZpZy5pbWFnZUJhY2tncm91bmRTcmMpLnRoZW4oKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4geyAgICBcclxuICAgICAgaW1hZ2Uuc3JjID0gaW1nLnNyYztcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGltYWdlLCB0aGlzLmNhbnZhcyk7XHJcbiAgICB9LCAoZXZlbnQpID0+IHtcclxuICAgICAgLy8gU3RvcCBhbGwgc2NyaXB0IGhlcmVcclxuICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgbW91c2VQb3NpdGlvbihldmVudDogYW55KTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHBvc1g6IG51bWJlcjtcclxuICAgIGxldCBwb3NZOiBudW1iZXI7XHJcblxyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3RvdWNobW92ZSc6XHJcbiAgICAgICAgcG9zWCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtICh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLyAyKSAtIHdpbmRvdy5wYWdlWE9mZnNldCAtIHRoaXMuem9uZS5sZWZ0O1xyXG4gICAgICAgIHBvc1kgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSAodGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC8gMikgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgIHBvc1ggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gdGhpcy56b25lLmxlZnQ7XHJcbiAgICAgICAgcG9zWSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbcG9zWCwgcG9zWV07XHJcbiAgfVxyXG5cclxuICBzY3JhdGNoICgpOiB2b2lkIHtcclxuICAgIGxldCB4ID0gdGhpcy5wb3NpdGlvblswXTtcclxuICAgIGxldCB5ID0gdGhpcy5wb3NpdGlvblsxXTtcclxuICAgIGxldCBpID0gMDtcclxuXHJcbiAgICB0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnNjcmF0Y2hUeXBlKSB7XHJcbiAgICAgIGNhc2UgU0NSQVRDSF9UWVBFLkJSVVNIOlxyXG4gICAgICAgIHRoaXMuYnJ1c2guYnJ1c2godGhpcy5icnVzaEltYWdlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTQ1JBVENIX1RZUEUuQ0lSQ0xFOlxyXG4gICAgICAgIHRoaXMuYnJ1c2guY2lyY2xlKHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgU0NSQVRDSF9UWVBFLlNQUkFZOlxyXG4gICAgICAgIHRoaXMuYnJ1c2guc3ByYXkodGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzLCAyLCAgMTAwKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRQZXJjZW50ICgpOiBudW1iZXIge1xyXG4gICAgbGV0IHBlcmNlbnQ7XHJcbiAgICBsZXQgY291bnRlciA9IDA7IC8vIG51bWJlciBvZiBwaXhlbHMgY2xlYXJcclxuICAgIGxldCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgICBsZXQgaW1hZ2VEYXRhTGVuZ3RoID0gaW1hZ2VEYXRhLmRhdGEubGVuZ3RoO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpbWFnZURhdGFMZW5ndGg7IGkgKz0gNCkge1xyXG4gICAgICBpZiAoaW1hZ2VEYXRhLmRhdGFbaV0gPT09IDAgJiYgaW1hZ2VEYXRhLmRhdGFbaSsxXSA9PT0gMCAmJiBpbWFnZURhdGEuZGF0YVtpKzJdID09PSAwICYmIGltYWdlRGF0YS5kYXRhW2krM10gPT09IDApIHtcclxuICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY291bnRlciA+PSAxKSB7XHJcbiAgICAgIHBlcmNlbnQgPSAoY291bnRlciAvICh0aGlzLmNhbnZhcy53aWR0aCAqIHRoaXMuY2FudmFzLmhlaWdodCkpICogMTAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGVyY2VudCA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGVyY2VudDtcclxuICB9XHJcbiAgXHJcbiAgLyoqXHJcbiAgICogSnVzdCBjbGVhciB0aGUgY2FudmFzXHJcbiAgICovXHJcbiAgY2xlYXIgKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIEV4cG9zZSBpbiB3aW5kb3cgZGlyZWN0bHlcclxuKDxhbnk+d2luZG93KS5TY3JhdGNoQ2FyZCA9IFNjcmF0Y2hDYXJkO1xyXG4oPGFueT53aW5kb3cpLlNDUkFUQ0hfVFlQRSA9IFNDUkFUQ0hfVFlQRTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjcmF0Y2hDYXJkO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JhdGNoQ2FyZC50cyIsImV4cG9ydCBlbnVtIFNDUkFUQ0hfVFlQRSB7XHJcbiAgQlJVU0gsXHJcbiAgU1BSQVksXHJcbiAgQ0lSQ0xFXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU0NfQ09ORklHIHtcclxuICBzY3JhdGNoVHlwZTogU0NSQVRDSF9UWVBFLFxyXG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgaW1hZ2VGb3J3YXJkU3JjOiBzdHJpbmcsXHJcbiAgaW1hZ2VCYWNrZ3JvdW5kU3JjOiBzdHJpbmcsXHJcbiAgY2xlYXJab25lUmFkaXVzOiBudW1iZXIsXHJcbiAgblBvaW50czogbnVtYmVyLFxyXG4gIHBvaW50U2l6ZTogbnVtYmVyW10sXHJcbiAgY2FsbGJhY2sgPzogKCkgPT4gdm9pZCxcclxuICBicnVzaFNyYzogc3RyaW5nLFxyXG4gIGN1cnNvcjoge1xyXG4gICAgY3VyOiBzdHJpbmcsXHJcbiAgICBwbmc6IHN0cmluZyxcclxuICAgIHBvb3NpdGlvbjogbnVtYmVyW11cclxuICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JhdGNoQ2FyZENvbmZpZy50cyIsIi8qKlxyXG4gKiBSZXR1cm4gYSByYW5kb20gbnVtYmVyIGluIHJhbmdlXHJcbiAqIEBwYXJhbSBtaW4ge051bWJlcn1cclxuICogQHBhcmFtIG1heCB7TnVtYmVyfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVBvaW50IChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICBsZXQgcmFuZG9tID0gTWF0aC5hYnMoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcclxuICByZXR1cm4gcGFyc2VJbnQocmFuZG9tLnRvRml4ZWQoMCksIDEwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoQ3VzdG9tRXZlbnQgKHRhcmdldDogSFRNTEVsZW1lbnQsIHR5cGU6IHN0cmluZywgZGV0YWlsOiBhbnkpIHtcclxuICBsZXQgY3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xyXG4gICAgYnViYmxlczogdHJ1ZSxcclxuICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICBkZXRhaWw6IGRldGFpbFxyXG4gIH0pO1xyXG4gIHRhcmdldC5kaXNwYXRjaEV2ZW50KGN1c3RvbUV2ZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0gc3JjIHtTdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbG9hZEltYWdlKHNyYzogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgIH07XHJcbiAgICBpbWFnZS5zcmMgPSBzcmM7XHJcbiAgICBpbWFnZS5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICByZWplY3QoZXZlbnQudHlwZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZSAoY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyKSB7XHJcbiAgbGV0IGxhc3Q6IG51bWJlcjtcclxuICBsZXQgdGltZXI6IG51bWJlcjtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgIGxldCBub3c6IG51bWJlciA9ICtuZXcgRGF0ZSgpO1xyXG4gICAgICBsZXQgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgaWYgKGxhc3QgJiYgbm93IDwgbGFzdCArIGRlbGF5KSB7XHJcbiAgICAgICAgICAvLyBsZSBkw6lsYWkgbidlc3QgcGFzIMOpY291bMOpIG9uIHJlc2V0IGxlIHRpbWVyXHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBsYXN0ID0gbm93O1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgfTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWxzLnRzIiwiaW1wb3J0IHtsb2FkSW1hZ2V9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcnVzaCB7XHJcbiAgcmVhZG9ubHkgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgcHVibGljIG1vdXNlWDogbnVtYmVyO1xyXG4gIHB1YmxpYyBtb3VzZVk6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IgKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4O1xyXG4gICAgdGhpcy5tb3VzZVggPSBtb3VzZVg7XHJcbiAgICB0aGlzLm1vdXNlWSA9IG1vdXNlWTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU1vdXNlUG9zaXRpb24gKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLm1vdXNlWCA9IHg7XHJcbiAgICB0aGlzLm1vdXNlWSA9IHk7XHJcbiAgfVxyXG5cclxuICBjaXJjbGUgKHI6IG51bWJlcikge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLmN0eC5hcmModGhpcy5tb3VzZVggKyByLCB0aGlzLm1vdXNlWSArIHIsIHIsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XHJcbiAgICB0aGlzLmN0eC5maWxsKCk7XHJcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvciBzcHJheSBnZXQgcG9pbnQgcG9zaXRpb24gaW4gdGhlIGFyZWEgdG8gY2xlYXIgdGhlIGNhbnZhc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByXHJcbiAgICogQHJldHVybnMge251bWJlcltdfVxyXG4gICAqL1xyXG4gIGNsZWFyUG9pbnQgKHI6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgIGxldCByYWRpdXM6IG51bWJlciA9IHI7XHJcbiAgICBsZXQgeDogbnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIDIgKiByYWRpdXMgLSByYWRpdXM7XHJcbiAgICBsZXQgeWxpbTogbnVtYmVyID0gTWF0aC5zcXJ0KHJhZGl1cyAqIHJhZGl1cyAtIHggKiB4KTtcclxuICAgIGxldCB5OiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMiAqIHlsaW0gLSB5bGltO1xyXG4gICAgeCArPSByYWRpdXM7XHJcbiAgICB5ICs9IHJhZGl1cztcclxuXHJcbiAgICB4ICs9IHRoaXMubW91c2VYO1xyXG4gICAgeSArPSB0aGlzLm1vdXNlWTtcclxuXHJcbiAgICByZXR1cm4gW3gsIHldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc2V0IG9mIHBvaW50cyBhbGxvY2F0ZWQgaW4gYXJlYSxcclxuICAgKiBAcGFyYW0ge251bWJlcn0gYXJlYVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkcm9wc1NpemVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gZHJvcHNDb3VudFxyXG4gICAqL1xyXG4gIHNwcmF5IChhcmVhOiBudW1iZXIsIGRyb3BzU2l6ZTogbnVtYmVyLCBkcm9wc0NvdW50OiBudW1iZXIpIHtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGxldCBkcm9wc0xlbmd0aCA9IGRyb3BzQ291bnQ7XHJcblxyXG4gICAgZm9yIChpOyBpIDwgZHJvcHNMZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgcG9pbnRzID0gdGhpcy5jbGVhclBvaW50KGFyZWEgLyAyKTtcclxuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KHBvaW50c1swXSwgcG9pbnRzWzFdLCBkcm9wc1NpemUsIGRyb3BzU2l6ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2VuZXJhdGVCcnVzaCAoaW1nU3JjOiBzdHJpbmcpOiBIVE1MSW1hZ2VFbGVtZW50IHtcclxuICAgIGlmIChpbWdTcmMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGxldCBicnVzaCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBicnVzaC5zcmMgPSBpbWdTcmM7XHJcbiAgICAgIHJldHVybiBicnVzaDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYnJ1c2ggKGltZzogSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgaWYgKGltZyA9PT0gbnVsbCkge1xyXG4gICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoICdhcmd1bWVudCBpbWcgaXMgbm90IGEgbm9kZSBJTUcnKTtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbjIodGhpcy5tb3VzZVksIHRoaXMubW91c2VYKTtcclxuICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpO1xyXG4gICAgdGhpcy5jdHgucm90YXRlKGFuZ2xlKTtcclxuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIC0oaW1nLndpZHRoIC8gMiksIC0oaW1nLmhlaWdodCAvIDIpKTtcclxuICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQnJ1c2gudHMiXSwic291cmNlUm9vdCI6IiJ9