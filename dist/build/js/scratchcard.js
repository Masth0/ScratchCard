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
        // Mobile events
        this.canvas.addEventListener('touchstart', function (event) {
            self.canvas.addEventListener('touchmove', scratching);
            document.body.addEventListener('touchend', function _func() {
                self.canvas.removeEventListener('touchmove', scratching);
                this.removeEventListener('touchend', _func);
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
                posX = event.touches[0].clientX - this.config.clearZoneRadius - window.pageXOffset - this.zone.left;
                posY = event.touches[0].clientY - this.config.clearZoneRadius - window.pageYOffset - this.zone.top;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmNmUxZDk0OTU3NDc4NmUyYTIzMCIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZENvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9CcnVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBLGlEQUE0RDtBQUM1RCxxQ0FBOEU7QUFDOUUscUNBQTRCO0FBRTVCO0lBZUUscUJBQWEsUUFBZ0IsRUFBRSxNQUFpQjtRQUFoRCxpQkFnRkM7UUEvRUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQU0sUUFBUSxHQUFHO1lBQ2YsV0FBVyxFQUFFLGdDQUFZLENBQUMsS0FBSztZQUMvQixjQUFjLEVBQUUsR0FBRztZQUNuQixlQUFlLEVBQUUsR0FBRztZQUNwQixPQUFPLEVBQUUsR0FBRztZQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUUs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QU8sR0FBcUI7UUFDMUIsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUUsZ0NBQWdDLENBQUMsQ0FBQztZQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFSCxZQUFDO0FBQUQsQ0FBQyIsImZpbGUiOiJzY3JhdGNoY2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlNjcmF0Y2hDYXJkLmRlZmF1bHRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU2NyYXRjaENhcmQuZGVmYXVsdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmNmUxZDk0OTU3NDc4NmUyYTIzMCIsImltcG9ydCB7U0NfQ09ORklHLCBTQ1JBVENIX1RZUEV9IGZyb20gJy4vU2NyYXRjaENhcmRDb25maWcnO1xyXG5pbXBvcnQge3JhbmRvbVBvaW50LCBsb2FkSW1hZ2UsIHRocm90dGxlLCBkaXNwYXRjaEN1c3RvbUV2ZW50fSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IEJydXNoIGZyb20gJy4vQnJ1c2gnO1xyXG5cclxuY2xhc3MgU2NyYXRjaENhcmQge1xyXG4gIHJlYWRvbmx5IGNvbmZpZzogU0NfQ09ORklHO1xyXG4gIHByaXZhdGUgZGVmYXVsdHM6IFNDX0NPTkZJRztcclxuICBwdWJsaWMgcGVyY2VudDogbnVtYmVyOyBcclxuICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIHNjcmF0Y2hJbWFnZTogSFRNTEltYWdlRWxlbWVudDtcclxuICBwcml2YXRlIHpvbmU6IENsaWVudFJlY3Q7XHJcbiAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIHByaXZhdGUgcG9zaXRpb246IG51bWJlcltdO1xyXG4gIHByaXZhdGUgc2NyYXRjaFR5cGU6IFNDUkFUQ0hfVFlQRTtcclxuICBwcml2YXRlIHJlYWR5VG9DbGVhcjogQm9vbGVhbjtcclxuICBwcml2YXRlIGJydXNoOiBCcnVzaDtcclxuICBwcml2YXRlIGJydXNoSW1hZ2U6IGFueTtcclxuICBcclxuICBjb25zdHJ1Y3RvciAoc2VsZWN0b3I6IHN0cmluZywgY29uZmlnOiBTQ19DT05GSUcpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XHJcbiAgICAgIHNjcmF0Y2hUeXBlOiBTQ1JBVENIX1RZUEUuU1BSQVksXHJcbiAgICAgIGNvbnRhaW5lcldpZHRoOiAxMDAsXHJcbiAgICAgIGNvbnRhaW5lckhlaWdodDogMTAwLFxyXG4gICAgICBuUG9pbnRzOiAxMDAsXHJcbiAgICAgIHBvaW50U2l6ZTogWzEwLCAxMF0sXHJcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYWxlcnQoJ2RvbmUuJylcclxuICAgICAgfSxcclxuICAgICAgYnJ1c2hTcmM6ICcnLFxyXG4gICAgICBpbWFnZUZvcndhcmRTcmM6ICcuL2ltYWdlcy9zY3JhdGNoY2FyZC5wbmcnLFxyXG4gICAgICBpbWFnZUJhY2tncm91bmRTcmM6ICcuL2ltYWdlcy9zY3JhdGNoY2FyZC1iYWNrZ3JvdW5kLnN2ZycsXHJcbiAgICAgIGNsZWFyWm9uZVJhZGl1czogMCxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBjb25maWcpO1xyXG4gICAgdGhpcy5zY3JhdGNoVHlwZSA9IHRoaXMuY29uZmlnLnNjcmF0Y2hUeXBlO1xyXG4gICAgdGhpcy5jb250YWluZXIgPSA8SFRNTEVsZW1lbnQ+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IFswLCAwXTsgLy8gaW5pdCBwb3NpdGlvblxyXG4gICAgdGhpcy5yZWFkeVRvQ2xlYXIgPSBmYWxzZTtcclxuICAgIHRoaXMucGVyY2VudCA9IDA7XHJcblxyXG4gICAgLy8gQ3JlYXRlIGFuZCBhZGQgdGhlIGNhbnZhc1xyXG4gICAgdGhpcy5nZW5lcmF0ZUNhbnZhcygpO1xyXG5cclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuem9uZSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIC8vIEluaXQgdGhlIGJydXNoIGluc3RhbmNlXHJcbiAgICB0aGlzLmJydXNoID0gbmV3IEJydXNoKHRoaXMuY3R4LCB0aGlzLnBvc2l0aW9uWzBdLCB0aGlzLnBvc2l0aW9uWzFdKTtcclxuXHJcbiAgICAvLyBJbml0IHRoZSBicnVzaCBpZiAgbmVjZXNzYXJ5XHJcbiAgICBpZiAodGhpcy5jb25maWcuc2NyYXRjaFR5cGUgPT09IFNDUkFUQ0hfVFlQRS5CUlVTSCkge1xyXG4gICAgICB0aGlzLmJydXNoSW1hZ2UgPSBCcnVzaC5nZW5lcmF0ZUJydXNoKHRoaXMuY29uZmlnLmJydXNoU3JjKTtcclxuICAgIH1cclxuXHJcbiAgICAvKi0tLS0gU2NyYXRjaGluZyBtZXRob2QgLCBjYWxsIGluIHRocm90dGxlIGV2ZW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbiAgICBsZXQgc2NyYXRjaGluZyA9IHRocm90dGxlKChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KCdzY3JhdGNoJywgJ21vdmUnKTtcclxuICAgICAgc2VsZi5wb3NpdGlvbiA9IHNlbGYubW91c2VQb3NpdGlvbihldmVudCk7XHJcbiAgICAgIHNlbGYuYnJ1c2gudXBkYXRlTW91c2VQb3NpdGlvbihzZWxmLnBvc2l0aW9uWzBdLCBzZWxmLnBvc2l0aW9uWzFdKTtcclxuICAgICAgc2VsZi5zY3JhdGNoKCk7XHJcblxyXG4gICAgICAvLyBjYWxjdWxhdGUgdGhlIHBlcmNlbnQgb2YgYXJlYSBzY3JhdGNoZWQuXHJcbiAgICAgIHNlbGYucGVyY2VudCA9IHNlbGYudXBkYXRlUGVyY2VudCgpO1xyXG4gICAgICBcclxuICAgICAgaWYgKHNlbGYucGVyY2VudCA+PSA1MCkge1xyXG4gICAgICAgIHNlbGYuY2xlYXIoKTtcclxuICAgICAgICBzZWxmLmNhbnZhcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG4gICAgICAgIGlmIChzZWxmLmNvbmZpZy5jYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBzZWxmLmNvbmZpZy5jYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwgMTYpO1xyXG5cclxuICAgIC8qLS0tLSBFdmVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHNlbGYuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNjcmF0Y2hpbmcpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiBfZnVuYyAoKSB7XHJcbiAgICAgICAgc2VsZi5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2NyYXRjaGluZyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX2Z1bmMpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIE1vYmlsZSBldmVudHNcclxuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgc2VsZi5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgc2NyYXRjaGluZyk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBmdW5jdGlvbiBfZnVuYyAoKSB7XHJcbiAgICAgICAgc2VsZi5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgc2NyYXRjaGluZyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIF9mdW5jKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBVcGRhdGUgY2FudmFzIHBvc2l0aW9ucyB3aGVuIHRoZSB3aW5kb3cgaGFzIGJlZW4gcmVzaXplZFxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKCgpID0+IHtcclxuICAgICAgdGhpcy56b25lID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9LCAxMDApKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBwZXJjZW50IG9mIHNjcmF0Y2hDYXJkXHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cclxuICBnZXRQZXJjZW50ICgpIHtcclxuICAgIHJldHVybiB0aGlzLnBlcmNlbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEaXN0cGFjaCBldmVudFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwaGFzZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAgICovXHJcbiAgZGlzcGF0Y2hFdmVudCAocGhhc2U6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XHJcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KHRoaXMuY2FudmFzLCBgJHtwaGFzZX0uJHt0eXBlfWAsIHt9KTtcclxuICB9XHJcblxyXG4gIGluaXQgKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsb2FkSW1hZ2UodGhpcy5jb25maWcuaW1hZ2VGb3J3YXJkU3JjKS50aGVuKChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcclxuICAgICAgICB0aGlzLnNjcmF0Y2hJbWFnZSA9IGltZztcclxuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5zY3JhdGNoSW1hZ2UsIDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuc2V0QmFja2dyb3VuZCgpO1xyXG4gICAgICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2UgaW5pdFxyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgLy8gUmVqZWN0IGluaXRcclxuICAgICAgICByZWplY3QoZXZlbnQpO1xyXG4gICAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKGAke3RoaXMuY29uZmlnLmltYWdlRm9yd2FyZFNyY30gaXMgbm90IGxvYWRlZC5gKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZUNhbnZhcyAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgdGhpcy5jYW52YXMuY2xhc3NMaXN0LmFkZCgnc2NfX2NhbnZhcycpO1xyXG4gIFxyXG4gICAgLy8gQWRkIGNhbnZhcyBpbnRvIGNvbnRhaW5lclxyXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmNvbmZpZy5jb250YWluZXJXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuY29uZmlnLmNvbnRhaW5lckhlaWdodDtcclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0QmFja2dyb3VuZCAoKTogdm9pZCB7XHJcbiAgICBsZXQgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIGxvYWRJbWFnZSh0aGlzLmNvbmZpZy5pbWFnZUJhY2tncm91bmRTcmMpLnRoZW4oKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4geyAgICBcclxuICAgICAgaW1hZ2Uuc3JjID0gaW1nLnNyYztcclxuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGltYWdlLCB0aGlzLmNhbnZhcyk7XHJcbiAgICB9LCAoZXJyb3IpID0+IHtcclxuICAgICAgLy8gU3RvcCBhbGwgc2NyaXB0IGhlcmVcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBtb3VzZVBvc2l0aW9uIChldmVudDogYW55KTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHBvc1g6IG51bWJlcjtcclxuICAgIGxldCBwb3NZOiBudW1iZXI7XHJcblxyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3RvdWNobW92ZSc6XHJcbiAgICAgICAgcG9zWCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cyAtIHdpbmRvdy5wYWdlWE9mZnNldCAtIHRoaXMuem9uZS5sZWZ0O1xyXG4gICAgICAgIHBvc1kgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdtb3VzZW1vdmUnOlxyXG4gICAgICAgIHBvc1ggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gdGhpcy56b25lLmxlZnQ7XHJcbiAgICAgICAgcG9zWSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVlPZmZzZXQgLSB0aGlzLnpvbmUudG9wO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbcG9zWCwgcG9zWV07XHJcbiAgfVxyXG5cclxuICBzY3JhdGNoICgpOiB2b2lkIHtcclxuICAgIGxldCB4ID0gdGhpcy5wb3NpdGlvblswXTtcclxuICAgIGxldCB5ID0gdGhpcy5wb3NpdGlvblsxXTtcclxuICAgIGxldCBpID0gMDtcclxuXHJcbiAgICB0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuXHJcbiAgICAvLyBDaG9vc2UgdGhlIGdvb2QgbWV0aG9kIHRvICdwYWludCdcclxuICAgIHN3aXRjaCAodGhpcy5jb25maWcuc2NyYXRjaFR5cGUpIHtcclxuICAgICAgY2FzZSBTQ1JBVENIX1RZUEUuQlJVU0g6XHJcbiAgICAgICAgdGhpcy5icnVzaC5icnVzaCh0aGlzLmJydXNoSW1hZ2UpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFNDUkFUQ0hfVFlQRS5DSVJDTEU6XHJcbiAgICAgICAgdGhpcy5icnVzaC5jaXJjbGUodGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBTQ1JBVENIX1RZUEUuU1BSQVk6XHJcbiAgICAgICAgdGhpcy5icnVzaC5zcHJheSh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMsIHRoaXMuY29uZmlnLnBvaW50U2l6ZSwgIHRoaXMuY29uZmlnLm5Qb2ludHMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgKiBJbWFnZSBkYXRhIDpcclxuICAqIFJlZDogaW1hZ2UuZGF0YVswXVxyXG4gICogR3JlZW46IGltYWdlLmRhdGFbMV1cclxuICAqIEJsdWU6IGltYWdlLmRhdGFbMl1cclxuICAqIEFscGhhOiBpbWFnZS5kYXRhWzNdXHJcbiAgKiAqL1xyXG4gIHVwZGF0ZVBlcmNlbnQgKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnRlciA9IDA7IC8vIG51bWJlciBvZiBwaXhlbHMgY2xlYXJlZFxyXG4gICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGxldCBpbWFnZURhdGFMZW5ndGggPSBpbWFnZURhdGEuZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgLy8gbG9vcCBkYXRhIGltYWdlIGRyb3AgZXZlcnkgNCBpdGVtcyBbciwgZywgYiwgYSwgLi4uXVxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YUxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgIC8vIEluY3JlbWVudCB0aGUgY291bnRlciBvbmx5IGlmIHRoZSBwaXhlbCBpbiBjb21wbGV0ZWx5IGNsZWFyXHJcbiAgICAgIGlmIChpbWFnZURhdGEuZGF0YVtpXSA9PT0gMCAmJiBpbWFnZURhdGEuZGF0YVtpKzFdID09PSAwICYmIGltYWdlRGF0YS5kYXRhW2krMl0gPT09IDAgJiYgaW1hZ2VEYXRhLmRhdGFbaSszXSA9PT0gMCkge1xyXG4gICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoY291bnRlciA+PSAxKSA/IChjb3VudGVyIC8gKHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0KSkgKiAxMDAgOiAwO1xyXG4gIH1cclxuXHJcbiAgLy8gVE9ETzogSW1wcm92ZSB0aGlzXHJcbiAgcmVkcmF3ICgpIHtcclxuICAgIGxldCBvbGRXaWR0aCA9IHRoaXMuY29uZmlnLmNvbnRhaW5lcldpZHRoO1xyXG4gICAgbGV0IG5ld1dpZHRoID0gdGhpcy56b25lLndpZHRoO1xyXG4gICAgaWYgKG5ld1dpZHRoIDwgb2xkV2lkdGgpIHtcclxuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuem9uZS53aWR0aCwgdGhpcy56b25lLmhlaWdodCk7XHJcbiAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy56b25lLndpZHRoO1xyXG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnpvbmUuaGVpZ2h0O1xyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5zY3JhdGNoSW1hZ2UsIDAsIDAsIHRoaXMuem9uZS53aWR0aCwgdGhpcy56b25lLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8qKlxyXG4gICAqIEp1c3QgY2xlYXIgdGhlIGNhbnZhc1xyXG4gICAqL1xyXG4gIGNsZWFyICgpOiB2b2lkIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBFeHBvc2UgZGlyZWN0bHkgaW4gd2luZG93LCBhbnkgaWRlYXMgdG8gZG8gdGhpcyBiZXR0ZXIuXHJcbig8YW55PndpbmRvdykuU2NyYXRjaENhcmQgPSBTY3JhdGNoQ2FyZDtcclxuKDxhbnk+d2luZG93KS5TQ1JBVENIX1RZUEUgPSBTQ1JBVENIX1RZUEU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY3JhdGNoQ2FyZDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyYXRjaENhcmQudHMiLCJleHBvcnQgZW51bSBTQ1JBVENIX1RZUEUge1xyXG4gIEJSVVNILFxyXG4gIFNQUkFZLFxyXG4gIENJUkNMRVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNDX0NPTkZJRyB7XHJcbiAgc2NyYXRjaFR5cGU6IFNDUkFUQ0hfVFlQRSxcclxuICBjb250YWluZXJXaWR0aDogbnVtYmVyLFxyXG4gIGNvbnRhaW5lckhlaWdodDogbnVtYmVyLFxyXG4gIGltYWdlRm9yd2FyZFNyYzogc3RyaW5nLFxyXG4gIGltYWdlQmFja2dyb3VuZFNyYzogc3RyaW5nLFxyXG4gIGNsZWFyWm9uZVJhZGl1czogbnVtYmVyLFxyXG4gIG5Qb2ludHM6IG51bWJlcixcclxuICBwb2ludFNpemU6IG51bWJlcixcclxuICBjYWxsYmFjayA/OiAoKSA9PiB2b2lkLFxyXG4gIGJydXNoU3JjOiBzdHJpbmcsXHJcbiAgY3Vyc29yOiB7XHJcbiAgICBjdXI6IHN0cmluZyxcclxuICAgIHBuZzogc3RyaW5nLFxyXG4gICAgcG9vc2l0aW9uOiBudW1iZXJbXVxyXG4gIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmF0Y2hDYXJkQ29uZmlnLnRzIiwiLyoqXHJcbiAqIFJldHVybiBhIHJhbmRvbSBudW1iZXIgaW4gcmFuZ2VcclxuICogQHBhcmFtIG1pbiB7TnVtYmVyfVxyXG4gKiBAcGFyYW0gbWF4IHtOdW1iZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tUG9pbnQgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gIGxldCByYW5kb20gPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xyXG4gIHJldHVybiBwYXJzZUludChyYW5kb20udG9GaXhlZCgwKSwgMTApO1xyXG59XHJcblxyXG4vKipcclxuICogTWFrZSBhIHByb21pc2UgdG8gbG9hZCBpbWFnZVxyXG4gKiBAcGFyYW0gc3JjIHtTdHJpbmd9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbG9hZEltYWdlKHNyYzogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICByZXNvbHZlKGltYWdlKTtcclxuICAgIH07XHJcbiAgICBpbWFnZS5zcmMgPSBzcmM7XHJcbiAgICBpbWFnZS5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgSW1hZ2UgJHtzcmN9IGlzIG5vdCBsb2FkZWQuYCk7XHJcbiAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZSAoY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyKSB7XHJcbiAgbGV0IGxhc3Q6IG51bWJlcjtcclxuICBsZXQgdGltZXI6IG51bWJlcjtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgIGxldCBub3c6IG51bWJlciA9ICtuZXcgRGF0ZSgpO1xyXG4gICAgICBsZXQgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgaWYgKGxhc3QgJiYgbm93IDwgbGFzdCArIGRlbGF5KSB7XHJcbiAgICAgICAgICAvLyBsZSBkw6lsYWkgbidlc3QgcGFzIMOpY291bMOpIG9uIHJlc2V0IGxlIHRpbWVyXHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBsYXN0ID0gbm93O1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLyotLS0tIEV2ZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8vIHBvbHlmaWxsIHNvdXJjZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50L0N1c3RvbUV2ZW50XHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGlmICggdHlwZW9mICg8YW55PndpbmRvdykuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIiApIHJldHVybiBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKGV2ZW50OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XHJcbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdDdXN0b21FdmVudCcgKTtcclxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoIGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgfVxyXG5cclxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSAoPGFueT53aW5kb3cpLkV2ZW50LnByb3RvdHlwZTtcclxuXHJcbiAgKDxhbnk+d2luZG93KS5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gKiBAcGFyYW0gZGV0YWlsXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hDdXN0b21FdmVudCAodGFyZ2V0OiBIVE1MQ2FudmFzRWxlbWVudCwgdHlwZTogc3RyaW5nLCBkZXRhaWw6IGFueSkge1xyXG4gIGxldCBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDogZGV0YWlsXHJcbiAgfSk7XHJcbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vdXRpbHMudHMiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCcnVzaCB7XHJcbiAgcmVhZG9ubHkgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgcHVibGljIG1vdXNlWDogbnVtYmVyO1xyXG4gIHB1YmxpYyBtb3VzZVk6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IgKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBtb3VzZVg6IG51bWJlciwgbW91c2VZOiBudW1iZXIpIHtcclxuICAgIHRoaXMuY3R4ID0gY3R4O1xyXG4gICAgdGhpcy5tb3VzZVggPSBtb3VzZVg7XHJcbiAgICB0aGlzLm1vdXNlWSA9IG1vdXNlWTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZU1vdXNlUG9zaXRpb24gKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLm1vdXNlWCA9IHg7XHJcbiAgICB0aGlzLm1vdXNlWSA9IHk7XHJcbiAgfVxyXG5cclxuICBjaXJjbGUgKHI6IG51bWJlcikge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLmN0eC5hcmModGhpcy5tb3VzZVggKyByLCB0aGlzLm1vdXNlWSArIHIsIHIsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XHJcbiAgICB0aGlzLmN0eC5maWxsKCk7XHJcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvciBzcHJheSBnZXQgcG9pbnQgcG9zaXRpb24gaW4gdGhlIGFyZWEgdG8gY2xlYXIgdGhlIGNhbnZhc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByXHJcbiAgICogQHJldHVybnMge251bWJlcltdfVxyXG4gICAqL1xyXG4gIGNsZWFyUG9pbnQgKHI6IG51bWJlcik6IG51bWJlcltdIHtcclxuICAgIGxldCByYWRpdXM6IG51bWJlciA9IHI7XHJcbiAgICBsZXQgeDogbnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIDIgKiByYWRpdXMgLSByYWRpdXM7XHJcbiAgICBsZXQgeWxpbTogbnVtYmVyID0gTWF0aC5zcXJ0KHJhZGl1cyAqIHJhZGl1cyAtIHggKiB4KTtcclxuICAgIGxldCB5OiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMiAqIHlsaW0gLSB5bGltO1xyXG4gICAgeCArPSByYWRpdXM7XHJcbiAgICB5ICs9IHJhZGl1cztcclxuXHJcbiAgICB4ICs9IHRoaXMubW91c2VYO1xyXG4gICAgeSArPSB0aGlzLm1vdXNlWTtcclxuXHJcbiAgICByZXR1cm4gW3gsIHldO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgc2V0IG9mIHBvaW50cyBhbGxvY2F0ZWQgaW4gYXJlYSxcclxuICAgKiBAcGFyYW0ge251bWJlcn0gYXJlYVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkcm9wc1NpemVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gZHJvcHNDb3VudFxyXG4gICAqL1xyXG4gIHNwcmF5IChhcmVhOiBudW1iZXIsIGRyb3BzU2l6ZTogbnVtYmVyLCBkcm9wc0NvdW50OiBudW1iZXIpIHtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGxldCBkcm9wc0xlbmd0aCA9IGRyb3BzQ291bnQ7XHJcblxyXG4gICAgZm9yIChpOyBpIDwgZHJvcHNMZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgcG9pbnRzID0gdGhpcy5jbGVhclBvaW50KGFyZWEgLyAyKTtcclxuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgIHRoaXMuY3R4LmFyYyhwb2ludHNbMF0gKyAoYXJlYSAvIDIpLCBwb2ludHNbMV0gKyAoYXJlYSAvIDIpLCBkcm9wc1NpemUgLyAyLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XHJcbiAgICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYnJ1c2ggaW1hZ2VcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW1nU3JjXHJcbiAgICogQHJldHVybnMge0hUTUxJbWFnZUVsZW1lbnR9XHJcbiAgICovXHJcbiAgc3RhdGljIGdlbmVyYXRlQnJ1c2ggKGltZ1NyYzogc3RyaW5nKTogSFRNTEltYWdlRWxlbWVudCB7XHJcbiAgICBpZiAoaW1nU3JjLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBsZXQgYnJ1c2ggPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgYnJ1c2guc3JjID0gaW1nU3JjO1xyXG4gICAgICByZXR1cm4gYnJ1c2g7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERyYXcgdGhlIGJydXNoIGltYWdlIG9uIGNhbnZhc1xyXG4gICAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1nXHJcbiAgICovXHJcbiAgYnJ1c2ggKGltZzogSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgaWYgKGltZyA9PT0gbnVsbCkge1xyXG4gICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoICdhcmd1bWVudCBpbWcgaXMgbm90IGEgbm9kZSBJTUcnKTtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBhbmdsZSA9IE1hdGguYXRhbjIodGhpcy5tb3VzZVksIHRoaXMubW91c2VYKTtcclxuICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpO1xyXG4gICAgdGhpcy5jdHgucm90YXRlKGFuZ2xlKTtcclxuICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIC0oaW1nLndpZHRoIC8gMiksIC0oaW1nLmhlaWdodCAvIDIpKTtcclxuICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQnJ1c2gudHMiXSwic291cmNlUm9vdCI6IiJ9