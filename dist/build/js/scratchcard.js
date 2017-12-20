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
        var _this = this;
        var self = this;
        var defaults = {
            scratchType: ScratchCardConfig_1.SCRATCH_TYPE.SPRAY,
            containerWidth: 100,
            containerHeight: 100,
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
        this.percent = 0;
        // Create and add the canvas
        this.generateCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.zone = this.canvas.getBoundingClientRect();
        // Init the brush instance
        this.brush = new Brush_1.default(this.ctx, this.position[0], this.position[1]);
        // Init the brush if  necessary
        if (this.config.scratchType === ScratchCardConfig_1.SCRATCH_TYPE.BRUSH) {
            this.brushImage = Brush_1.default.generateBrush(this.config.brushSrc);
        }
        /*---- Scratching method , call in throttle event ------------------------------------*/
        var scratching = utils_1.throttle(function (event) {
            self.dispatchEvent('scratch', 'move');
            self.position = self.mousePosition(event);
            self.brush.updateMousePosition(self.position[0], self.position[1]);
            self.scratch();
            // calculate the percent of area scratched.
            self.percent = self.updatePercent();
            if (self.percent >= 50) {
                self.clear();
                self.canvas.style.pointerEvents = 'none';
                if (self.config.callback !== undefined) {
                    self.config.callback();
                }
            }
        }, 16);
        /*---- Events -----------------------------------------------------------------------*/
        this.canvas.addEventListener('mousedown', function (event) {
            self.canvas.addEventListener('mousemove', scratching);
            document.body.addEventListener('mouseup', function _func() {
                self.canvas.removeEventListener('mousemove', scratching);
                this.removeEventListener('mouseup', _func);
            });
        });
        // Update canvas positions when the window has been resized
        window.addEventListener('resize', utils_1.throttle(function () {
            _this.zone = _this.canvas.getBoundingClientRect();
            _this.redraw();
        }, 100));
    }
    /**
     * Get percent of scratchCard
     * @returns {number}
     */
    ScratchCard.prototype.getPercent = function () {
        return this.percent;
    };
    /**
     * Distpach event
     * @param {string} phase
     * @param {string} type
     */
    ScratchCard.prototype.dispatchEvent = function (phase, type) {
        utils_1.dispatchCustomEvent(this.canvas, phase + "." + type, {});
    };
    ScratchCard.prototype.init = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            utils_1.loadImage(_this.config.imageForwardSrc).then(function (img) {
                _this.scratchImage = img;
                _this.ctx.drawImage(_this.scratchImage, 0, 0, _this.canvas.width, _this.canvas.height);
                _this.setBackground();
                // Resolve the promise init
                resolve();
            }, function (event) {
                // Reject init
                reject(event);
                return new TypeError(_this.config.imageForwardSrc + " is not loaded.");
            });
        });
    };
    ScratchCard.prototype.generateCanvas = function () {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('sc__canvas');
        // Add canvas into container
        this.canvas.width = this.config.containerWidth;
        this.canvas.height = this.config.containerHeight;
        this.container.appendChild(this.canvas);
        console.log(this.config);
    };
    ScratchCard.prototype.setBackground = function () {
        var _this = this;
        var image = document.createElement('img');
        utils_1.loadImage(this.config.imageBackgroundSrc).then(function (img) {
            image.src = img.src;
            _this.container.insertBefore(image, _this.canvas);
        }, function (error) {
            // Stop all script here
            console.log(error.message);
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
        // Choose the good method to 'paint'
        switch (this.config.scratchType) {
            case ScratchCardConfig_1.SCRATCH_TYPE.BRUSH:
                this.brush.brush(this.brushImage);
                break;
            case ScratchCardConfig_1.SCRATCH_TYPE.CIRCLE:
                this.brush.circle(this.config.clearZoneRadius);
                break;
            case ScratchCardConfig_1.SCRATCH_TYPE.SPRAY:
                this.brush.spray(this.config.clearZoneRadius, this.config.pointSize, this.config.nPoints);
                break;
        }
        this.ctx.restore();
    };
    /*
    * Image data :
    * Red: image.data[0]
    * Green: image.data[1]
    * Blue: image.data[2]
    * Alpha: image.data[3]
    * */
    ScratchCard.prototype.updatePercent = function () {
        var counter = 0; // number of pixels cleared
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var imageDataLength = imageData.data.length;
        // loop data image drop every 4 items [r, g, b, a, ...]
        for (var i = 0; i < imageDataLength; i += 4) {
            // Increment the counter only if the pixel in completely clear
            if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
                counter++;
            }
        }
        return (counter >= 1) ? (counter / (this.canvas.width * this.canvas.height)) * 100 : 0;
    };
    // TODO: Improve this
    ScratchCard.prototype.redraw = function () {
        var oldWidth = this.config.containerWidth;
        var newWidth = this.zone.width;
        if (newWidth < oldWidth) {
            this.ctx.clearRect(0, 0, this.zone.width, this.zone.height);
            this.canvas.width = this.zone.width;
            this.canvas.height = this.zone.height;
            this.ctx.drawImage(this.scratchImage, 0, 0, this.zone.width, this.zone.height);
        }
    };
    /**
     * Just clear the canvas
     */
    ScratchCard.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return ScratchCard;
}());
// Expose directly in window, any ideas to do this better.
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
/**
 * Make a promise to load image
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
            var error = new Error("Image " + src + " is not loaded.");
            reject(error);
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
/*---- Events -----------------------------------------------------------------------*/
// polyfill source: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
    if (typeof window.CustomEvent === "function")
        return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
/**
 *
 * @param {HTMLElement} target
 * @param {string} type
 * @param detail
 */
function dispatchCustomEvent(target, type, detail) {
    var customEvent = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: detail
    });
    target.dispatchEvent(customEvent);
}
exports.dispatchCustomEvent = dispatchCustomEvent;


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
            this.ctx.beginPath();
            this.ctx.arc(points[0] + (area / 2), points[1] + (area / 2), dropsSize / 2, 0, Math.PI * 2, false);
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
            this.ctx.closePath();
        }
    };
    /**
     * Create brush image
     * @param {string} imgSrc
     * @returns {HTMLImageElement}
     */
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
    /**
     * Draw the brush image on canvas
     * @param {HTMLImageElement} img
     */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhNjBmMzU1OWE1M2YwMzc2MTc3NSIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZENvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9CcnVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBLGlEQUE0RDtBQUM1RCxxQ0FBOEU7QUFDOUUscUNBQTRCO0FBRTVCO0lBZUUscUJBQWEsUUFBZ0IsRUFBRSxNQUFpQjtRQUFoRCxpQkF1RUM7UUF0RUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQU0sUUFBUSxHQUFHO1lBQ2YsV0FBVyxFQUFFLGdDQUFZLENBQUMsS0FBSztZQUMvQixjQUFjLEVBQUUsR0FBRztZQUNuQixlQUFlLEVBQUUsR0FBRztZQUNwQixPQUFPLEVBQUUsR0FBRztZQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUUs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LENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUgsWUFBQztBQUFELENBQUMiLCJmaWxlIjoic2NyYXRjaGNhcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTY3JhdGNoQ2FyZC5kZWZhdWx0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlNjcmF0Y2hDYXJkLmRlZmF1bHRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTYwZjM1NTlhNTNmMDM3NjE3NzUiLCJpbXBvcnQge1NDX0NPTkZJRywgU0NSQVRDSF9UWVBFfSBmcm9tICcuL1NjcmF0Y2hDYXJkQ29uZmlnJztcclxuaW1wb3J0IHtyYW5kb21Qb2ludCwgbG9hZEltYWdlLCB0aHJvdHRsZSwgZGlzcGF0Y2hDdXN0b21FdmVudH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCBCcnVzaCBmcm9tICcuL0JydXNoJztcclxuXHJcbmNsYXNzIFNjcmF0Y2hDYXJkIHtcclxuICByZWFkb25seSBjb25maWc6IFNDX0NPTkZJRztcclxuICBwcml2YXRlIGRlZmF1bHRzOiBTQ19DT05GSUc7XHJcbiAgcHVibGljIHBlcmNlbnQ6IG51bWJlcjsgXHJcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBzY3JhdGNoSW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSB6b25lOiBDbGllbnRSZWN0O1xyXG4gIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBwcml2YXRlIHBvc2l0aW9uOiBudW1iZXJbXTtcclxuICBwcml2YXRlIHNjcmF0Y2hUeXBlOiBTQ1JBVENIX1RZUEU7XHJcbiAgcHJpdmF0ZSByZWFkeVRvQ2xlYXI6IEJvb2xlYW47XHJcbiAgcHJpdmF0ZSBicnVzaDogQnJ1c2g7XHJcbiAgcHJpdmF0ZSBicnVzaEltYWdlOiBhbnk7XHJcbiAgXHJcbiAgY29uc3RydWN0b3IgKHNlbGVjdG9yOiBzdHJpbmcsIGNvbmZpZzogU0NfQ09ORklHKSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xyXG4gICAgICBzY3JhdGNoVHlwZTogU0NSQVRDSF9UWVBFLlNQUkFZLFxyXG4gICAgICBjb250YWluZXJXaWR0aDogMTAwLFxyXG4gICAgICBjb250YWluZXJIZWlnaHQ6IDEwMCxcclxuICAgICAgblBvaW50czogMTAwLFxyXG4gICAgICBwb2ludFNpemU6IFsxMCwgMTBdLFxyXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGFsZXJ0KCdkb25lLicpXHJcbiAgICAgIH0sXHJcbiAgICAgIGJydXNoU3JjOiAnJyxcclxuICAgICAgaW1hZ2VGb3J3YXJkU3JjOiAnLi9pbWFnZXMvc2NyYXRjaGNhcmQucG5nJyxcclxuICAgICAgaW1hZ2VCYWNrZ3JvdW5kU3JjOiAnLi9pbWFnZXMvc2NyYXRjaGNhcmQtYmFja2dyb3VuZC5zdmcnLFxyXG4gICAgICBjbGVhclpvbmVSYWRpdXM6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgY29uZmlnKTtcclxuICAgIHRoaXMuc2NyYXRjaFR5cGUgPSB0aGlzLmNvbmZpZy5zY3JhdGNoVHlwZTtcclxuICAgIHRoaXMuY29udGFpbmVyID0gPEhUTUxFbGVtZW50PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIHRoaXMucG9zaXRpb24gPSBbMCwgMF07IC8vIGluaXQgcG9zaXRpb25cclxuICAgIHRoaXMucmVhZHlUb0NsZWFyID0gZmFsc2U7XHJcbiAgICB0aGlzLnBlcmNlbnQgPSAwO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhbmQgYWRkIHRoZSBjYW52YXNcclxuICAgIHRoaXMuZ2VuZXJhdGVDYW52YXMoKTtcclxuXHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB0aGlzLnpvbmUgPSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAvLyBJbml0IHRoZSBicnVzaCBpbnN0YW5jZVxyXG4gICAgdGhpcy5icnVzaCA9IG5ldyBCcnVzaCh0aGlzLmN0eCwgdGhpcy5wb3NpdGlvblswXSwgdGhpcy5wb3NpdGlvblsxXSk7XHJcblxyXG4gICAgLy8gSW5pdCB0aGUgYnJ1c2ggaWYgIG5lY2Vzc2FyeVxyXG4gICAgaWYgKHRoaXMuY29uZmlnLnNjcmF0Y2hUeXBlID09PSBTQ1JBVENIX1RZUEUuQlJVU0gpIHtcclxuICAgICAgdGhpcy5icnVzaEltYWdlID0gQnJ1c2guZ2VuZXJhdGVCcnVzaCh0aGlzLmNvbmZpZy5icnVzaFNyYyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyotLS0tIFNjcmF0Y2hpbmcgbWV0aG9kICwgY2FsbCBpbiB0aHJvdHRsZSBldmVudCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgbGV0IHNjcmF0Y2hpbmcgPSB0aHJvdHRsZSgoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudCgnc2NyYXRjaCcsICdtb3ZlJyk7XHJcbiAgICAgIHNlbGYucG9zaXRpb24gPSBzZWxmLm1vdXNlUG9zaXRpb24oZXZlbnQpO1xyXG4gICAgICBzZWxmLmJydXNoLnVwZGF0ZU1vdXNlUG9zaXRpb24oc2VsZi5wb3NpdGlvblswXSwgc2VsZi5wb3NpdGlvblsxXSk7XHJcbiAgICAgIHNlbGYuc2NyYXRjaCgpO1xyXG5cclxuICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwZXJjZW50IG9mIGFyZWEgc2NyYXRjaGVkLlxyXG4gICAgICBzZWxmLnBlcmNlbnQgPSBzZWxmLnVwZGF0ZVBlcmNlbnQoKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChzZWxmLnBlcmNlbnQgPj0gNTApIHtcclxuICAgICAgICBzZWxmLmNsZWFyKCk7XHJcbiAgICAgICAgc2VsZi5jYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgc2VsZi5jb25maWcuY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIDE2KTtcclxuXHJcbiAgICAvKi0tLS0gRXZlbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBzZWxmLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzY3JhdGNoaW5nKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gX2Z1bmMgKCkge1xyXG4gICAgICAgIHNlbGYuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNjcmF0Y2hpbmcpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9mdW5jKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBVcGRhdGUgY2FudmFzIHBvc2l0aW9ucyB3aGVuIHRoZSB3aW5kb3cgaGFzIGJlZW4gcmVzaXplZFxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKCgpID0+IHtcclxuICAgICAgdGhpcy56b25lID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9LCAxMDApKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBwZXJjZW50IG9mIHNjcmF0Y2hDYXJkXHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cclxuICBnZXRQZXJjZW50ICgpIHtcclxuICAgIHJldHVybiB0aGlzLnBlcmNlbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXN0cGFjaCBldmVudFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwaGFzZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAgICovXHJcbiAgZGlzcGF0Y2hFdmVudCAocGhhc2U6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XHJcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KHRoaXMuY2FudmFzLCBgJHtwaGFzZX0uJHt0eXBlfWAsIHt9KTtcclxuICB9XHJcblxyXG4gIGluaXQgKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsb2FkSW1hZ2UodGhpcy5jb25maWcuaW1hZ2VGb3J3YXJkU3JjKS50aGVuKChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcclxuICAgICAgICB0aGlzLnNjcmF0Y2hJbWFnZSA9IGltZztcclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5zY3JhdGNoSW1hZ2UsIDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZCgpO1xyXG4gICAgICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2UgaW5pdFxyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgLy8gUmVqZWN0IGluaXRcclxuICAgICAgICByZWplY3QoZXZlbnQpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKGAke3RoaXMuY29uZmlnLmltYWdlRm9yd2FyZFNyY30gaXMgbm90IGxvYWRlZC5gKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZUNhbnZhcyAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZCgnc2NfX2NhbnZhcycpO1xyXG4gIFxyXG4gICAgLy8gQWRkIGNhbnZhcyBpbnRvIGNvbnRhaW5lclxyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNvbmZpZy5jb250YWluZXJXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY29uZmlnLmNvbnRhaW5lckhlaWdodDtcclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuY29uZmlnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0QmFja2dyb3VuZCAoKTogdm9pZCB7XHJcbiAgICBsZXQgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIGxvYWRJbWFnZSh0aGlzLmNvbmZpZy5pbWFnZUJhY2tncm91bmRTcmMpLnRoZW4oKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4geyAgICBcclxuICAgICAgaW1hZ2Uuc3JjID0gaW1nLnNyYztcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGltYWdlLCB0aGlzLmNhbnZhcyk7XHJcbiAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgLy8gU3RvcCBhbGwgc2NyaXB0IGhlcmVcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBtb3VzZVBvc2l0aW9uIChldmVudDogYW55KTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHBvc1g6IG51bWJlcjtcclxuICAgIGxldCBwb3NZOiBudW1iZXI7XHJcblxyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3RvdWNobW92ZSc6XHJcbiAgICAgICAgcG9zWCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtICh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLyAyKSAtIHdpbmRvdy5wYWdlWE9mZnNldCAtIHRoaXMuem9uZS5sZWZ0O1xyXG4gICAgICAgIHBvc1kgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSAodGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC8gMikgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgIHBvc1ggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gdGhpcy56b25lLmxlZnQ7XHJcbiAgICAgICAgcG9zWSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbcG9zWCwgcG9zWV07XHJcbiAgfVxyXG5cclxuICBzY3JhdGNoICgpOiB2b2lkIHtcclxuICAgIGxldCB4ID0gdGhpcy5wb3NpdGlvblswXTtcclxuICAgIGxldCB5ID0gdGhpcy5wb3NpdGlvblsxXTtcclxuICAgIGxldCBpID0gMDtcclxuXHJcbiAgICB0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuXHJcbiAgICAvLyBDaG9vc2UgdGhlIGdvb2QgbWV0aG9kIHRvICdwYWludCdcclxuICAgIHN3aXRjaCAodGhpcy5jb25maWcuc2NyYXRjaFR5cGUpIHtcclxuICAgICAgY2FzZSBTQ1JBVENIX1RZUEUuQlJVU0g6XHJcbiAgICAgICAgdGhpcy5icnVzaC5icnVzaCh0aGlzLmJydXNoSW1hZ2UpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNDUkFUQ0hfVFlQRS5DSVJDTEU6XHJcbiAgICAgICAgdGhpcy5icnVzaC5jaXJjbGUodGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTQ1JBVENIX1RZUEUuU1BSQVk6XHJcbiAgICAgICAgdGhpcy5icnVzaC5zcHJheSh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMsIHRoaXMuY29uZmlnLnBvaW50U2l6ZSwgIHRoaXMuY29uZmlnLm5Qb2ludHMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgKiBJbWFnZSBkYXRhIDpcclxuICAqIFJlZDogaW1hZ2UuZGF0YVswXVxyXG4gICogR3JlZW46IGltYWdlLmRhdGFbMV1cclxuICAqIEJsdWU6IGltYWdlLmRhdGFbMl1cclxuICAqIEFscGhhOiBpbWFnZS5kYXRhWzNdXHJcbiAgKiAqL1xyXG4gIHVwZGF0ZVBlcmNlbnQgKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnRlciA9IDA7IC8vIG51bWJlciBvZiBwaXhlbHMgY2xlYXJlZFxyXG4gICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGxldCBpbWFnZURhdGFMZW5ndGggPSBpbWFnZURhdGEuZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy8gbG9vcCBkYXRhIGltYWdlIGRyb3AgZXZlcnkgNCBpdGVtcyBbciwgZywgYiwgYSwgLi4uXVxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YUxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgIC8vIEluY3JlbWVudCB0aGUgY291bnRlciBvbmx5IGlmIHRoZSBwaXhlbCBpbiBjb21wbGV0ZWx5IGNsZWFyXHJcbiAgICAgIGlmIChpbWFnZURhdGEuZGF0YVtpXSA9PT0gMCAmJiBpbWFnZURhdGEuZGF0YVtpKzFdID09PSAwICYmIGltYWdlRGF0YS5kYXRhW2krMl0gPT09IDAgJiYgaW1hZ2VEYXRhLmRhdGFbaSszXSA9PT0gMCkge1xyXG4gICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoY291bnRlciA+PSAxKSA/IChjb3VudGVyIC8gKHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0KSkgKiAxMDAgOiAwO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogSW1wcm92ZSB0aGlzXHJcbiAgcmVkcmF3ICgpIHtcclxuICAgIGxldCBvbGRXaWR0aCA9IHRoaXMuY29uZmlnLmNvbnRhaW5lcldpZHRoO1xyXG4gICAgbGV0IG5ld1dpZHRoID0gdGhpcy56b25lLndpZHRoO1xyXG4gICAgaWYobmV3V2lkdGggPCBvbGRXaWR0aCkge1xyXG4gICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy56b25lLndpZHRoLCB0aGlzLnpvbmUuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnpvbmUud2lkdGg7XHJcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuem9uZS5oZWlnaHQ7XHJcbiAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZSh0aGlzLnNjcmF0Y2hJbWFnZSwgMCwgMCwgdGhpcy56b25lLndpZHRoLCB0aGlzLnpvbmUuaGVpZ2h0KTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLyoqXHJcbiAgICogSnVzdCBjbGVhciB0aGUgY2FudmFzXHJcbiAgICovXHJcbiAgY2xlYXIgKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIEV4cG9zZSBkaXJlY3RseSBpbiB3aW5kb3csIGFueSBpZGVhcyB0byBkbyB0aGlzIGJldHRlci5cclxuKDxhbnk+d2luZG93KS5TY3JhdGNoQ2FyZCA9IFNjcmF0Y2hDYXJkO1xyXG4oPGFueT53aW5kb3cpLlNDUkFUQ0hfVFlQRSA9IFNDUkFUQ0hfVFlQRTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjcmF0Y2hDYXJkO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9TY3JhdGNoQ2FyZC50cyIsImV4cG9ydCBlbnVtIFNDUkFUQ0hfVFlQRSB7XHJcbiAgQlJVU0gsXHJcbiAgU1BSQVksXHJcbiAgQ0lSQ0xFXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU0NfQ09ORklHIHtcclxuICBzY3JhdGNoVHlwZTogU0NSQVRDSF9UWVBFLFxyXG4gIGNvbnRhaW5lcldpZHRoOiBudW1iZXIsXHJcbiAgY29udGFpbmVySGVpZ2h0OiBudW1iZXIsXHJcbiAgaW1hZ2VGb3J3YXJkU3JjOiBzdHJpbmcsXHJcbiAgaW1hZ2VCYWNrZ3JvdW5kU3JjOiBzdHJpbmcsXHJcbiAgY2xlYXJab25lUmFkaXVzOiBudW1iZXIsXHJcbiAgblBvaW50czogbnVtYmVyLFxyXG4gIHBvaW50U2l6ZTogbnVtYmVyLFxyXG4gIGNhbGxiYWNrID86ICgpID0+IHZvaWQsXHJcbiAgYnJ1c2hTcmM6IHN0cmluZyxcclxuICBjdXJzb3I6IHtcclxuICAgIGN1cjogc3RyaW5nLFxyXG4gICAgcG5nOiBzdHJpbmcsXHJcbiAgICBwb29zaXRpb246IG51bWJlcltdXHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyYXRjaENhcmRDb25maWcudHMiLCIvKipcclxuICogUmV0dXJuIGEgcmFuZG9tIG51bWJlciBpbiByYW5nZVxyXG4gKiBAcGFyYW0gbWluIHtOdW1iZXJ9XHJcbiAqIEBwYXJhbSBtYXgge051bWJlcn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21Qb2ludCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgbGV0IHJhbmRvbSA9IE1hdGguYWJzKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XHJcbiAgcmV0dXJuIHBhcnNlSW50KHJhbmRvbS50b0ZpeGVkKDApLCAxMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgcHJvbWlzZSB0byBsb2FkIGltYWdlXHJcbiAqIEBwYXJhbSBzcmMge1N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgfTtcclxuICAgIGltYWdlLnNyYyA9IHNyYztcclxuICAgIGltYWdlLm9uZXJyb3IgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBJbWFnZSAke3NyY30gaXMgbm90IGxvYWRlZC5gKTtcclxuICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlIChjYWxsYmFjazogRnVuY3Rpb24sIGRlbGF5OiBudW1iZXIpIHtcclxuICBsZXQgbGFzdDogbnVtYmVyO1xyXG4gIGxldCB0aW1lcjogbnVtYmVyO1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcztcclxuICAgICAgbGV0IG5vdzogbnVtYmVyID0gK25ldyBEYXRlKCk7XHJcbiAgICAgIGxldCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICBpZiAobGFzdCAmJiBub3cgPCBsYXN0ICsgZGVsYXkpIHtcclxuICAgICAgICAgIC8vIGxlIGTDqWxhaSBuJ2VzdCBwYXMgw6ljb3Vsw6kgb24gcmVzZXQgbGUgdGltZXJcclxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGxhc3QgPSBub3c7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICB9LCBkZWxheSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsYXN0ID0gbm93O1xyXG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vKi0tLS0gRXZlbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLy8gcG9seWZpbGwgc291cmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQvQ3VzdG9tRXZlbnRcclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgaWYgKCB0eXBlb2YgKDxhbnk+d2luZG93KS5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudCAoZXZlbnQ6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfTtcclxuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0N1c3RvbUV2ZW50JyApO1xyXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudCggZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICB9XHJcblxyXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9ICg8YW55PndpbmRvdykuRXZlbnQucHJvdG90eXBlO1xyXG5cclxuICAoPGFueT53aW5kb3cpLkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAqIEBwYXJhbSBkZXRhaWxcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaEN1c3RvbUV2ZW50ICh0YXJnZXQ6IEhUTUxDYW52YXNFbGVtZW50LCB0eXBlOiBzdHJpbmcsIGRldGFpbDogYW55KSB7XHJcbiAgbGV0IGN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KHR5cGUsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiBkZXRhaWxcclxuICB9KTtcclxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChjdXN0b21FdmVudCk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlscy50cyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJydXNoIHtcclxuICByZWFkb25seSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwdWJsaWMgbW91c2VYOiBudW1iZXI7XHJcbiAgcHVibGljIG1vdXNlWTogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvciAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgdGhpcy5jdHggPSBjdHg7XHJcbiAgICB0aGlzLm1vdXNlWCA9IG1vdXNlWDtcclxuICAgIHRoaXMubW91c2VZID0gbW91c2VZO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTW91c2VQb3NpdGlvbiAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIHRoaXMubW91c2VYID0geDtcclxuICAgIHRoaXMubW91c2VZID0geTtcclxuICB9XHJcblxyXG4gIGNpcmNsZSAocjogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuY3R4LmFyYyh0aGlzLm1vdXNlWCArIHIsIHRoaXMubW91c2VZICsgciwgciwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcclxuICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRm9yIHNwcmF5IGdldCBwb2ludCBwb3NpdGlvbiBpbiB0aGUgYXJlYSB0byBjbGVhciB0aGUgY2FudmFzXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcbiAgICovXHJcbiAgY2xlYXJQb2ludCAocjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHJhZGl1czogbnVtYmVyID0gcjtcclxuICAgIGxldCB4OiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMiAqIHJhZGl1cyAtIHJhZGl1cztcclxuICAgIGxldCB5bGltOiBudW1iZXIgPSBNYXRoLnNxcnQocmFkaXVzICogcmFkaXVzIC0geCAqIHgpO1xyXG4gICAgbGV0IHk6IG51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAyICogeWxpbSAtIHlsaW07XHJcbiAgICB4ICs9IHJhZGl1cztcclxuICAgIHkgKz0gcmFkaXVzO1xyXG5cclxuICAgIHggKz0gdGhpcy5tb3VzZVg7XHJcbiAgICB5ICs9IHRoaXMubW91c2VZO1xyXG5cclxuICAgIHJldHVybiBbeCwgeV07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBzZXQgb2YgcG9pbnRzIGFsbG9jYXRlZCBpbiBhcmVhLFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhcmVhXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGRyb3BzU2l6ZVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkcm9wc0NvdW50XHJcbiAgICovXHJcbiAgc3ByYXkgKGFyZWE6IG51bWJlciwgZHJvcHNTaXplOiBudW1iZXIsIGRyb3BzQ291bnQ6IG51bWJlcikge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgbGV0IGRyb3BzTGVuZ3RoID0gZHJvcHNDb3VudDtcclxuXHJcbiAgICBmb3IgKGk7IGkgPCBkcm9wc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBwb2ludHMgPSB0aGlzLmNsZWFyUG9pbnQoYXJlYSAvIDIpO1xyXG4gICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgdGhpcy5jdHguYXJjKHBvaW50c1swXSArIChhcmVhIC8gMiksIHBvaW50c1sxXSArIChhcmVhIC8gMiksIGRyb3BzU2l6ZSAvIDIsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcclxuICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG4gICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBicnVzaCBpbWFnZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbWdTcmNcclxuICAgKiBAcmV0dXJucyB7SFRNTEltYWdlRWxlbWVudH1cclxuICAgKi9cclxuICBzdGF0aWMgZ2VuZXJhdGVCcnVzaCAoaW1nU3JjOiBzdHJpbmcpOiBIVE1MSW1hZ2VFbGVtZW50IHtcclxuICAgIGlmIChpbWdTcmMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGxldCBicnVzaCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBicnVzaC5zcmMgPSBpbWdTcmM7XHJcbiAgICAgIHJldHVybiBicnVzaDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHJhdyB0aGUgYnJ1c2ggaW1hZ2Ugb24gY2FudmFzXHJcbiAgICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWdcclxuICAgKi9cclxuICBicnVzaCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICBpZiAoaW1nID09PSBudWxsKSB7XHJcbiAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvciggJ2FyZ3VtZW50IGltZyBpcyBub3QgYSBub2RlIElNRycpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGFuZ2xlID0gTWF0aC5hdGFuMih0aGlzLm1vdXNlWSwgdGhpcy5tb3VzZVgpO1xyXG4gICAgdGhpcy5jdHguc2F2ZSgpO1xyXG4gICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcbiAgICB0aGlzLmN0eC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgLShpbWcud2lkdGggLyAyKSwgLShpbWcuaGVpZ2h0IC8gMikpO1xyXG4gIH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9CcnVzaC50cyJdLCJzb3VyY2VSb290IjoiIn0=