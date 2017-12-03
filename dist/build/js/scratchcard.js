(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ScratchCard"] = factory();
	else
		root["ScratchCard"] = factory();
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
var utils_1 = __webpack_require__(1);
var Brush_1 = __webpack_require__(2);
/**
 * @enum ScratchCardEvent
 */
var ScratchEvent;
(function (ScratchEvent) {
    ScratchEvent[ScratchEvent["ScratchStart"] = 0] = "ScratchStart";
    ScratchEvent[ScratchEvent["Scratch"] = 1] = "Scratch";
    ScratchEvent[ScratchEvent["ScratchEnd"] = 2] = "ScratchEnd";
})(ScratchEvent || (ScratchEvent = {}));
var ScratchCard = /** @class */ (function () {
    function ScratchCard(selector, config) {
        var self = this;
        var defaults = {
            scratchType: 'SPRAY',
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
        // TODO: Here choose the type of brush ['BRUSH', 'SPRAY', 'CIRCLE'].
        utils_1.loadImage(this.config.imageForwardSrc).then(function (img) {
            _this.ctx.drawImage(img, 0, 0);
            _this.setBackground();
        }, function (event) {
            // Stop all script here
            console.log(event);
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
        // TODO: Here call Brush method from brush type
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
exports.default = ScratchCard;


/***/ }),
/* 1 */
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
/* 2 */
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
            brush.src = './images/brush.png';
            return brush;
        }
        else {
            return null;
        }
    };
    Brush.prototype.brush = function (img) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjZjA5YmEzZDg2YjMyY2I1ZGM1NCIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9CcnVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDNURBLHFDQUE4RTtBQUM5RSxxQ0FBNEI7QUFFNUI7O0dBRUc7QUFDSCxJQUFLLFlBSUo7QUFKRCxXQUFLLFlBQVk7SUFDZiwrREFBWTtJQUNaLHFEQUFPO0lBQ1AsMkRBQVU7QUFDWixDQUFDLEVBSkksWUFBWSxLQUFaLFlBQVksUUFJaEI7QUFFRDtJQWVFLHFCQUFhLFFBQWdCLEVBQUUsTUFBaUI7UUFDOUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQU0sUUFBUSxHQUFHO1lBQ2YsV0FBVyxFQUFFLE9BQU87WUFDcEIsU0FBUyxFQUFFLFdBQVc7WUFDdEIsT0FBTyxFQUFFLEdBQUc7WUFDWixTQUFT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QUFjO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxHQUFHLEdBQUcsb0JBQW9CLENBQUM7WUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELHFCQUFLLEdBQUwsVUFBTyxHQUFxQjtRQUMxQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUdILFlBQUM7QUFBRCxDQUFDIiwiZmlsZSI6InNjcmF0Y2hjYXJkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiU2NyYXRjaENhcmRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU2NyYXRjaENhcmRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2YwOWJhM2Q4NmIzMmNiNWRjNTQiLCJpbXBvcnQge1NDX0NPTkZJRywgU2NyYXRjaFR5cGV9IGZyb20gJy4vU2NyYXRjaENhcmRDb25maWcnO1xyXG5pbXBvcnQge3JhbmRvbVBvaW50LCBsb2FkSW1hZ2UsIHRocm90dGxlLCBkaXNwYXRjaEN1c3RvbUV2ZW50fSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IEJydXNoIGZyb20gJy4vQnJ1c2gnO1xyXG5cclxuLyoqXHJcbiAqIEBlbnVtIFNjcmF0Y2hDYXJkRXZlbnRcclxuICovXHJcbmVudW0gU2NyYXRjaEV2ZW50IHtcclxuICBTY3JhdGNoU3RhcnQsXHJcbiAgU2NyYXRjaCxcclxuICBTY3JhdGNoRW5kXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmF0Y2hDYXJkIHtcclxuICByZWFkb25seSBjb25maWc6IFNDX0NPTkZJRztcclxuICBwcml2YXRlIGRlZmF1bHRzOiBTQ19DT05GSUc7XHJcbiAgcHVibGljIHBlcmNlbnQ6IG51bWJlcjsgXHJcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBiZ0ltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIHByaXZhdGUgem9uZTogQ2xpZW50UmVjdDtcclxuICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBwb3NpdGlvbjogbnVtYmVyW107XHJcbiAgcHVibGljIHNjcmF0Y2hUeXBlOiBTY3JhdGNoVHlwZTtcclxuICBwdWJsaWMgcmVhZHlUb0NsZWFyOiBCb29sZWFuO1xyXG4gIHB1YmxpYyBicnVzaDogQnJ1c2g7XHJcbiAgcHJpdmF0ZSBicnVzaEltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIFxyXG4gIGNvbnN0cnVjdG9yIChzZWxlY3Rvcjogc3RyaW5nLCBjb25maWc6IFNDX0NPTkZJRykge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcclxuICAgICAgc2NyYXRjaFR5cGU6ICdTUFJBWScsXHJcbiAgICAgIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICAgIG5Qb2ludHM6IDEwMCxcclxuICAgICAgcG9pbnRTaXplOiBbMTAsIDEwXSxcclxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBhbGVydCgnZG9uZS4nKVxyXG4gICAgICB9LFxyXG4gICAgICBicnVzaFNyYzogJycsXHJcbiAgICAgIGltYWdlRm9yd2FyZFNyYzogJy4vaW1hZ2VzL3NjcmF0Y2hjYXJkLnBuZycsXHJcbiAgICAgIGltYWdlQmFja2dyb3VuZFNyYzogJy4vaW1hZ2VzL3NjcmF0Y2hjYXJkLWJhY2tncm91bmQuc3ZnJyxcclxuICAgICAgY2xlYXJab25lUmFkaXVzOiAwLFxyXG4gICAgfTtcclxuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgY29uZmlnKTtcclxuICAgIHRoaXMuc2NyYXRjaFR5cGUgPSB0aGlzLmNvbmZpZy5zY3JhdGNoVHlwZTtcclxuICAgIHRoaXMuY29udGFpbmVyID0gPEhUTUxFbGVtZW50PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIHRoaXMucG9zaXRpb24gPSBbMCwgMF07IC8vIGluaXQgcG9zaXRpb25cclxuICAgIHRoaXMucmVhZHlUb0NsZWFyID0gZmFsc2U7XHJcbiAgICAvLyBBZGQgY2FudmFzIGluIGNvbnRhaW5lclxyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgICBcclxuICAgIC8vIGRlYnVnXHJcbiAgICBjb25zdCBjdXJzb3JEZWJ1ZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqcy1kZWJ1Zy1jdXJzb3InKTtcclxuXHJcbiAgICBsZXQgc2NyYXRjaGluZyA9IHRocm90dGxlKChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgc2VsZi5wb3NpdGlvbiA9IHNlbGYubW91c2VQb3NpdGlvbihldmVudCk7XHJcbiAgICAgIHNlbGYuYnJ1c2gudXBkYXRlTW91c2VQb3NpdGlvbihzZWxmLnBvc2l0aW9uWzBdLCBzZWxmLnBvc2l0aW9uWzFdKTtcclxuICAgICAgc2VsZi5zY3JhdGNoKCk7XHJcbiAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgcGVyY2VudCBvZiBhcmVhIHNjcmF0Y2hlZC5cclxuICAgICAgc2VsZi5wZXJjZW50ID0gc2VsZi5nZXRQZXJjZW50KCk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoc2VsZi5wZXJjZW50ID49IDUwKSB7XHJcbiAgICAgICAgc2VsZi5jbGVhcigpO1xyXG4gICAgICAgIHNlbGYuY2FudmFzLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLmNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHNlbGYuY29uZmlnLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCAxNik7XHJcblxyXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIHNlbGYuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNjcmF0Y2hpbmcpO1xyXG4gICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uIF9mdW5jICgpIHtcclxuICAgICAgIHNlbGYuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNjcmF0Y2hpbmcpO1xyXG4gICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX2Z1bmMpO1xyXG4gICAgIH0pO1xyXG4gICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0ICgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2VuZXJhdGVDYW52YXMoKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuem9uZSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5icnVzaCA9IG5ldyBCcnVzaCh0aGlzLmN0eCwgdGhpcy5wb3NpdGlvblswXSwgdGhpcy5wb3NpdGlvblsxXSk7XHJcblxyXG4gICAgLy8gVE9ETzogSGVyZSBjaG9vc2UgdGhlIHR5cGUgb2YgYnJ1c2ggWydCUlVTSCcsICdTUFJBWScsICdDSVJDTEUnXS5cclxuXHJcbiAgICBsb2FkSW1hZ2UodGhpcy5jb25maWcuaW1hZ2VGb3J3YXJkU3JjKS50aGVuKChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcclxuICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgIHRoaXMuc2V0QmFja2dyb3VuZCgpO1xyXG4gICAgfSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIC8vIFN0b3AgYWxsIHNjcmlwdCBoZXJlXHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBwcml2YXRlIGdlbmVyYXRlQ2FudmFzICgpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QuYWRkKCdzY19fY2FudmFzJyk7XHJcbiAgXHJcbiAgICAvLyBBZGQgY2FudmFzIGludG8gY29udGFpbmVyXHJcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuY29udGFpbmVyLmNsaWVudFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jb250YWluZXIuY2xpZW50SGVpZ2h0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRCYWNrZ3JvdW5kICgpOiB2b2lkIHtcclxuICAgIGxldCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgbG9hZEltYWdlKHRoaXMuY29uZmlnLmltYWdlQmFja2dyb3VuZFNyYykudGhlbigoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7ICAgIFxyXG4gICAgICBpbWFnZS5zcmMgPSBpbWcuc3JjO1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoaW1hZ2UsIHRoaXMuY2FudmFzKTtcclxuICAgIH0sIChldmVudCkgPT4ge1xyXG4gICAgICAvLyBTdG9wIGFsbCBzY3JpcHQgaGVyZVxyXG4gICAgICBjb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBtb3VzZVBvc2l0aW9uKGV2ZW50OiBhbnkpOiBudW1iZXJbXSB7XHJcbiAgICBsZXQgcG9zWDogbnVtYmVyO1xyXG4gICAgbGV0IHBvc1k6IG51bWJlcjtcclxuXHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuICAgICAgY2FzZSAndG91Y2htb3ZlJzpcclxuICAgICAgICBwb3NYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gKHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cyAvIDIpIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gdGhpcy56b25lLmxlZnQ7XHJcbiAgICAgICAgcG9zWSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtICh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLyAyKSAtIHdpbmRvdy5wYWdlWU9mZnNldCAtIHRoaXMuem9uZS50b3A7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgICAgcG9zWCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVhPZmZzZXQgLSB0aGlzLnpvbmUubGVmdDtcclxuICAgICAgICBwb3NZID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cyAtIHdpbmRvdy5wYWdlWU9mZnNldCAtIHRoaXMuem9uZS50b3A7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtwb3NYLCBwb3NZXTtcclxuICB9XHJcblxyXG4gIHNjcmF0Y2ggKCk6IHZvaWQge1xyXG4gICAgbGV0IHggPSB0aGlzLnBvc2l0aW9uWzBdO1xyXG4gICAgbGV0IHkgPSB0aGlzLnBvc2l0aW9uWzFdO1xyXG4gICAgbGV0IGkgPSAwO1xyXG5cclxuICAgIHRoaXMuY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdXQnO1xyXG4gICAgdGhpcy5jdHguc2F2ZSgpO1xyXG4gICAgLy8gVE9ETzogSGVyZSBjYWxsIEJydXNoIG1ldGhvZCBmcm9tIGJydXNoIHR5cGVcclxuICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIGdldFBlcmNlbnQgKCk6IG51bWJlciB7XHJcbiAgICBsZXQgcGVyY2VudDtcclxuICAgIGxldCBjb3VudGVyID0gMDsgLy8gbnVtYmVyIG9mIHBpeGVscyBjbGVhclxyXG4gICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGxldCBpbWFnZURhdGFMZW5ndGggPSBpbWFnZURhdGEuZGF0YS5sZW5ndGg7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YUxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgIGlmIChpbWFnZURhdGEuZGF0YVtpXSA9PT0gMCAmJiBpbWFnZURhdGEuZGF0YVtpKzFdID09PSAwICYmIGltYWdlRGF0YS5kYXRhW2krMl0gPT09IDAgJiYgaW1hZ2VEYXRhLmRhdGFbaSszXSA9PT0gMCkge1xyXG4gICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb3VudGVyID49IDEpIHtcclxuICAgICAgcGVyY2VudCA9IChjb3VudGVyIC8gKHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0KSkgKiAxMDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwZXJjZW50ID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiBwZXJjZW50O1xyXG4gIH1cclxuICBcclxuICAvKipcclxuICAgKiBKdXN0IGNsZWFyIHRoZSBjYW52YXNcclxuICAgKi9cclxuICBjbGVhciAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XHJcbiAgfVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1NjcmF0Y2hDYXJkLnRzIiwiLyoqXHJcbiAqIFJldHVybiBhIHJhbmRvbSBudW1iZXIgaW4gcmFuZ2VcclxuICogQHBhcmFtIG1pbiB7TnVtYmVyfVxyXG4gKiBAcGFyYW0gbWF4IHtOdW1iZXJ9XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tUG9pbnQgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gIGxldCByYW5kb20gPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xyXG4gIHJldHVybiBwYXJzZUludChyYW5kb20udG9GaXhlZCgwKSwgMTApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hDdXN0b21FdmVudCAodGFyZ2V0OiBIVE1MRWxlbWVudCwgdHlwZTogc3RyaW5nLCBkZXRhaWw6IGFueSkge1xyXG4gIGxldCBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDogZGV0YWlsXHJcbiAgfSk7XHJcbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqIEBwYXJhbSBzcmMge1N0cmluZ31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIHJlc29sdmUoaW1hZ2UpO1xyXG4gICAgfVxyXG4gICAgaW1hZ2Uuc3JjID0gc3JjO1xyXG4gICAgaW1hZ2Uub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgcmVqZWN0KGV2ZW50LnR5cGUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGUgKGNhbGxiYWNrOiBGdW5jdGlvbiwgZGVsYXk6IG51bWJlcikge1xyXG4gIHZhciBsYXN0OiBudW1iZXI7XHJcbiAgdmFyIHRpbWVyOiBudW1iZXI7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xyXG4gICAgICB2YXIgbm93OiBudW1iZXIgPSArbmV3IERhdGUoKTtcclxuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgIGlmIChsYXN0ICYmIG5vdyA8IGxhc3QgKyBkZWxheSkge1xyXG4gICAgICAgICAgLy8gbGUgZMOpbGFpIG4nZXN0IHBhcyDDqWNvdWzDqSBvbiByZXNldCBsZSB0aW1lclxyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgICAgICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxhc3QgPSBub3c7XHJcbiAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfVxyXG4gIH07XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi91dGlscy50cyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJydXNoIHtcclxuICByZWFkb25seSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwdWJsaWMgbW91c2VYOiBudW1iZXI7XHJcbiAgcHVibGljIG1vdXNlWTogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvciAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG1vdXNlWDogbnVtYmVyLCBtb3VzZVk6IG51bWJlcikge1xyXG4gICAgdGhpcy5jdHggPSBjdHg7XHJcbiAgICB0aGlzLm1vdXNlWCA9IG1vdXNlWDtcclxuICAgIHRoaXMubW91c2VZID0gbW91c2VZO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTW91c2VQb3NpdGlvbiAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIHRoaXMubW91c2VYID0geDtcclxuICAgIHRoaXMubW91c2VZID0geTtcclxuICB9XHJcblxyXG4gIGNpcmNsZSAocjogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuY3R4LmFyYyh0aGlzLm1vdXNlWCArIHIsIHRoaXMubW91c2VZICsgciwgciwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcclxuICAgIHRoaXMuY3R4LmZpbGwoKTtcclxuICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRm9yIHNwcmF5IGdldCBwb2ludCBwb3NpdGlvbiBpbiB0aGUgYXJlYSB0byBjbGVhciB0aGUgY2FudmFzXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcbiAgICovXHJcbiAgY2xlYXJQb2ludCAocjogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHJhZGl1czogbnVtYmVyID0gcjtcclxuICAgIGxldCB4OiBudW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMiAqIHJhZGl1cyAtIHJhZGl1cztcclxuICAgIGxldCB5bGltOiBudW1iZXIgPSBNYXRoLnNxcnQocmFkaXVzICogcmFkaXVzIC0geCAqIHgpO1xyXG4gICAgbGV0IHk6IG51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAyICogeWxpbSAtIHlsaW07XHJcbiAgICB4ICs9IHJhZGl1cztcclxuICAgIHkgKz0gcmFkaXVzO1xyXG5cclxuICAgIHggKz0gdGhpcy5tb3VzZVg7XHJcbiAgICB5ICs9IHRoaXMubW91c2VZO1xyXG5cclxuICAgIHJldHVybiBbeCwgeV07XHJcbiAgfVxyXG5cclxuICBzcHJheSAoYXJlYTogbnVtYmVyLCBkcm9wc1NpemU6IG51bWJlciwgZHJvcHNDb3VudDogbnVtYmVyKSB7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBsZXQgZHJvcHNMZW5ndGggPSBkcm9wc0NvdW50O1xyXG5cclxuICAgIGZvciAoaTsgaSA8IGRyb3BzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHBvaW50cyA9IHRoaXMuY2xlYXJQb2ludChhcmVhIC8gMik7XHJcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdChwb2ludHNbMF0sIHBvaW50c1sxXSwgZHJvcHNTaXplLCBkcm9wc1NpemUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdlbmVyYXRlQnJ1c2ggKGltZ1NyYzogc3RyaW5nKTogSFRNTEltYWdlRWxlbWVudCB7XHJcbiAgICBpZiAoaW1nU3JjLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBsZXQgYnJ1c2ggPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgYnJ1c2guc3JjID0gJy4vaW1hZ2VzL2JydXNoLnBuZyc7XHJcbiAgICAgIHJldHVybiBicnVzaDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYnJ1c2ggKGltZzogSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgbGV0IGFuZ2xlID0gTWF0aC5hdGFuMih0aGlzLm1vdXNlWSwgdGhpcy5tb3VzZVgpO1xyXG4gICAgdGhpcy5jdHguc2F2ZSgpO1xyXG4gICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XHJcbiAgICB0aGlzLmN0eC5yb3RhdGUoYW5nbGUpO1xyXG4gICAgdGhpcy5jdHguZHJhd0ltYWdlKGltZywgLShpbWcud2lkdGggLyAyKSwgLShpbWcuaGVpZ2h0IC8gMikpO1xyXG4gIH1cclxuXHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQnJ1c2gudHMiXSwic291cmNlUm9vdCI6IiJ9