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
        this.brush = this.generateBrush();
        // Add canvas in container
        this.init();
        // debug
        var cursorDebug = document.getElementById('js-debug-cursor');
        var scratching = utils_1.throttle(function (event) {
            self.position = self.mousePosition(event);
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
        var posX, posY;
        switch (event.type) {
            case 'touchmove':
                posX = event.touches[0].clientX - (this.config.clearZoneRadius / 2) - window.pageXOffset - this.zone.left;
                posY = event.touches[0].clientY - (this.config.clearZoneRadius / 2) - window.pageYOffset - this.zone.top;
            case 'mousemove':
                posX = event.clientX - this.config.clearZoneRadius - window.pageXOffset - this.zone.left;
                posY = event.clientY - this.config.clearZoneRadius - window.pageYOffset - this.zone.top;
                break;
        }
        return [posX, posY];
    };
    ScratchCard.prototype.clearPoint = function (posX, posY) {
        var radius = this.config.clearZoneRadius;
        var x = Math.random() * 2 * radius - radius;
        var ylim = Math.sqrt(radius * radius - x * x);
        var y = Math.random() * 2 * ylim - ylim;
        x += radius;
        y += radius;
        x += posX;
        y += posY;
        return [x, y];
    };
    ScratchCard.prototype.scratch = function () {
        var x = this.position[0];
        var y = this.position[1];
        var i = 0;
        console.log(x, y);
        // let len = this.config.nPoints;
        // for (i; i < len; i++) {
        //   let points = this.clearPoint(x, y);
        //   this.ctx.clearRect(points[0], points[1], this.config.pointSize[0], this.config.pointSize[1]);
        // }
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x + this.config.clearZoneRadius, y + this.config.clearZoneRadius, this.config.clearZoneRadius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
        // this.ctx.globalCompositeOperation = 'destination-out';
        // let angle = Math.atan2(y, x);
        // this.ctx.save();
        // this.ctx.translate(x, y);
        // this.ctx.rotate(angle);
        // this.ctx.drawImage(this.brush, -(this.brush.width / 2), -(this.brush.height / 2));
        // this.ctx.restore();
    };
    ScratchCard.prototype.generateBrush = function () {
        if (this.config.brushSrc.length !== 0) {
            var brush = new Image();
            brush.src = './images/brush.png';
            return brush;
        }
        else {
            return null;
        }
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5MjkwOWJmZWMyYTcwZmUyMzZhOCIsIndlYnBhY2s6Ly8vLi9TY3JhdGNoQ2FyZC50cyIsIndlYnBhY2s6Ly8vLi91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDNURBLHFDQUE4RTtBQUU5RTs7R0FFRztBQUNILElBQUssWUFJSjtBQUpELFdBQUssWUFBWTtJQUNmLCtEQUFZO0lBQ1oscURBQU87SUFDUCwyREFBVTtBQUNaLENBQUMsRUFKSSxZQUFZLEtBQVosWUFBWSxRQUloQjtBQUVEO0lBY0UscUJBQWEsUUFBZ0IsRUFBRSxNQUFpQjtRQUM5QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBTSxRQUFRLEdBQUc7WUFDZixXQUFXLEVBQUUsT0FBTztZQUNwQixTQUFTLEVBQUUsV0FBVztZQUN0QixPQUFPLEVBQUUsR0FBRztZQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDakIs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QixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdCLDhDQUE4QztZQUM5QyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsS0FBSyxHQUFHLFVBQVUsQ0FBQztnQkFDZixJQUFJLEdBQUcsR0FBRyxDQUFDO2dCQUNYLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksR0FBRyxHQUFHLENBQUM7WUFDWCxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQW5CRCw0QkFtQkMiLCJmaWxlIjoic2NyYXRjaGNhcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTY3JhdGNoQ2FyZFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTY3JhdGNoQ2FyZFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5MjkwOWJmZWMyYTcwZmUyMzZhOCIsImltcG9ydCB7U0NfQ09ORklHLCBTY3JhdGNoVHlwZX0gZnJvbSAnLi9TY3JhdGNoQ2FyZENvbmZpZyc7XHJcbmltcG9ydCB7cmFuZG9tUG9pbnQsIGxvYWRJbWFnZSwgdGhyb3R0bGUsIGRpc3BhdGNoQ3VzdG9tRXZlbnR9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlbnVtIFNjcmF0Y2hDYXJkRXZlbnRcclxuICovXHJcbmVudW0gU2NyYXRjaEV2ZW50IHtcclxuICBTY3JhdGNoU3RhcnQsXHJcbiAgU2NyYXRjaCxcclxuICBTY3JhdGNoRW5kXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmF0Y2hDYXJkIHtcclxuICByZWFkb25seSBjb25maWc6IFNDX0NPTkZJRztcclxuICBwcml2YXRlIGRlZmF1bHRzOiBTQ19DT05GSUc7XHJcbiAgcHVibGljIHBlcmNlbnQ6IG51bWJlcjsgXHJcbiAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBiZ0ltYWdlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIHByaXZhdGUgem9uZTogQ2xpZW50UmVjdDtcclxuICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBwb3NpdGlvbjogbnVtYmVyW107XHJcbiAgcHVibGljIHNjcmF0Y2hUeXBlOiBTY3JhdGNoVHlwZTtcclxuICBwdWJsaWMgcmVhZHlUb0NsZWFyOiBCb29sZWFuO1xyXG4gIHB1YmxpYyBicnVzaDogSFRNTEltYWdlRWxlbWVudDtcclxuICBcclxuICBjb25zdHJ1Y3RvciAoc2VsZWN0b3I6IHN0cmluZywgY29uZmlnOiBTQ19DT05GSUcpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XHJcbiAgICAgIHNjcmF0Y2hUeXBlOiAnU1BSQVknLFxyXG4gICAgICBjb250YWluZXI6IEhUTUxFbGVtZW50LFxyXG4gICAgICBuUG9pbnRzOiAxMDAsXHJcbiAgICAgIHBvaW50U2l6ZTogWzEwLCAxMF0sXHJcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYWxlcnQoJ2RvbmUuJylcclxuICAgICAgfSxcclxuICAgICAgYnJ1c2hTcmM6ICcnLFxyXG4gICAgICBpbWFnZUZvcndhcmRTcmM6ICcuL2ltYWdlcy9zY3JhdGNoY2FyZC5wbmcnLFxyXG4gICAgICBpbWFnZUJhY2tncm91bmRTcmM6ICcuL2ltYWdlcy9zY3JhdGNoY2FyZC1iYWNrZ3JvdW5kLnN2ZycsXHJcbiAgICAgIGNsZWFyWm9uZVJhZGl1czogMCxcclxuICAgIH07XHJcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIGNvbmZpZyk7XHJcbiAgICB0aGlzLnNjcmF0Y2hUeXBlID0gdGhpcy5jb25maWcuc2NyYXRjaFR5cGU7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IDxIVE1MRWxlbWVudD4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gWzAsIDBdOyAvLyBpbml0IHBvc2l0aW9uXHJcbiAgICB0aGlzLnJlYWR5VG9DbGVhciA9IGZhbHNlO1xyXG4gICAgdGhpcy5icnVzaCA9IHRoaXMuZ2VuZXJhdGVCcnVzaCgpO1xyXG4gICAgLy8gQWRkIGNhbnZhcyBpbiBjb250YWluZXJcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgXHJcbiAgICAvLyBkZWJ1Z1xyXG4gICAgY29uc3QgY3Vyc29yRGVidWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtZGVidWctY3Vyc29yJyk7XHJcblxyXG4gICAgbGV0IHNjcmF0Y2hpbmcgPSB0aHJvdHRsZSgoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgIHNlbGYucG9zaXRpb24gPSBzZWxmLm1vdXNlUG9zaXRpb24oZXZlbnQpO1xyXG4gICAgICBzZWxmLnNjcmF0Y2goKTtcclxuICAgICAgLy8gY2FsY3VsYXRlIHRoZSBwZXJjZW50IG9mIGFyZWEgc2NyYXRjaGVkLlxyXG4gICAgICBzZWxmLnBlcmNlbnQgPSBzZWxmLmdldFBlcmNlbnQoKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChzZWxmLnBlcmNlbnQgPj0gNTApIHtcclxuICAgICAgICBzZWxmLmNsZWFyKCk7XHJcbiAgICAgICAgc2VsZi5jYW52YXMuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuICAgICAgICBpZiAoc2VsZi5jb25maWcuY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgc2VsZi5jb25maWcuY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIDE2KTtcclxuXHJcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgc2VsZi5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2NyYXRjaGluZyk7XHJcblxyXG4gICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGZ1bmN0aW9uIF9mdW5jICgpIHtcclxuICAgICAgIHNlbGYuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHNjcmF0Y2hpbmcpO1xyXG4gICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX2Z1bmMpO1xyXG4gICAgIH0pO1xyXG4gICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBpbml0ICgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ2VuZXJhdGVDYW52YXMoKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMuem9uZSA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIGxvYWRJbWFnZSh0aGlzLmNvbmZpZy5pbWFnZUZvcndhcmRTcmMpLnRoZW4oKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xyXG4gICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kKCk7XHJcbiAgICB9LCAoZXZlbnQpID0+IHtcclxuICAgICAgLy8gU3RvcCBhbGwgc2NyaXB0IGhlcmVcclxuICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFxyXG4gIHByaXZhdGUgZ2VuZXJhdGVDYW52YXMgKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHRoaXMuY2FudmFzLmNsYXNzTGlzdC5hZGQoJ3NjX19jYW52YXMnKTtcclxuICBcclxuICAgIC8vIEFkZCBjYW52YXMgaW50byBjb250YWluZXJcclxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jb250YWluZXIuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEJhY2tncm91bmQgKCk6IHZvaWQge1xyXG4gICAgbGV0IGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICBsb2FkSW1hZ2UodGhpcy5jb25maWcuaW1hZ2VCYWNrZ3JvdW5kU3JjKS50aGVuKChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHsgICAgXHJcbiAgICAgIGltYWdlLnNyYyA9IGltZy5zcmM7XHJcbiAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShpbWFnZSwgdGhpcy5jYW52YXMpO1xyXG4gICAgfSwgKGV2ZW50KSA9PiB7XHJcbiAgICAgIC8vIFN0b3AgYWxsIHNjcmlwdCBoZXJlXHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIG1vdXNlUG9zaXRpb24gKGV2ZW50OiBhbnkpOiBudW1iZXJbXSB7XHJcblx0XHRsZXQgcG9zWDogbnVtYmVyLCBwb3NZOiBudW1iZXI7XHJcblx0XHRzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuXHRcdFx0Y2FzZSAndG91Y2htb3ZlJzpcclxuXHRcdFx0XHRwb3NYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gKHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cyAvIDIpIC0gd2luZG93LnBhZ2VYT2Zmc2V0IC0gdGhpcy56b25lLmxlZnQ7XHJcblx0XHRcdFx0cG9zWSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtICh0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLyAyKSAtIHdpbmRvdy5wYWdlWU9mZnNldCAtIHRoaXMuem9uZS50b3A7XHJcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcblx0XHRcdFx0cG9zWCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMgLSB3aW5kb3cucGFnZVhPZmZzZXQgLSB0aGlzLnpvbmUubGVmdDtcclxuXHRcdFx0XHRwb3NZID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cyAtIHdpbmRvdy5wYWdlWU9mZnNldCAtIHRoaXMuem9uZS50b3A7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFtwb3NYLCBwb3NZXTtcclxuICB9XHJcblxyXG4gIGNsZWFyUG9pbnQgKHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgbGV0IHJhZGl1czogbnVtYmVyID0gdGhpcy5jb25maWcuY2xlYXJab25lUmFkaXVzO1xyXG4gICAgbGV0IHg6IG51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAyICogcmFkaXVzIC0gcmFkaXVzO1xyXG4gICAgbGV0IHlsaW06IG51bWJlciA9IE1hdGguc3FydChyYWRpdXMgKiByYWRpdXMgLSB4ICogeCk7XHJcbiAgICBsZXQgeTogbnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIDIgKiB5bGltIC0geWxpbTtcclxuICAgIHggKz0gcmFkaXVzO1xyXG4gICAgeSArPSByYWRpdXM7XHJcbiBcclxuICAgIHggKz0gcG9zWDtcclxuICAgIHkgKz0gcG9zWTtcclxuIFxyXG4gICAgcmV0dXJuIFt4LCB5XTtcclxuICB9XHJcblxyXG4gIHNjcmF0Y2ggKCk6IHZvaWQge1xyXG4gICAgbGV0IHggPSB0aGlzLnBvc2l0aW9uWzBdO1xyXG4gICAgbGV0IHkgPSB0aGlzLnBvc2l0aW9uWzFdO1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgXHJcbiAgICBjb25zb2xlLmxvZyh4LCB5KTtcclxuICAgIFxyXG4gICAgLy8gbGV0IGxlbiA9IHRoaXMuY29uZmlnLm5Qb2ludHM7XHJcbiAgICAvLyBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xyXG4gICAgLy8gICBsZXQgcG9pbnRzID0gdGhpcy5jbGVhclBvaW50KHgsIHkpO1xyXG4gICAgLy8gICB0aGlzLmN0eC5jbGVhclJlY3QocG9pbnRzWzBdLCBwb2ludHNbMV0sIHRoaXMuY29uZmlnLnBvaW50U2l6ZVswXSwgdGhpcy5jb25maWcucG9pbnRTaXplWzFdKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICB0aGlzLmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgIHRoaXMuY3R4LnNhdmUoKTtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgdGhpcy5jdHguYXJjKHggKyB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMsIHkgKyB0aGlzLmNvbmZpZy5jbGVhclpvbmVSYWRpdXMsIHRoaXMuY29uZmlnLmNsZWFyWm9uZVJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xyXG4gICAgdGhpcy5jdHguZmlsbCgpO1xyXG4gICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcbiAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XHJcbiAgICBcclxuICAgIFxyXG4gICAgLy8gdGhpcy5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2Rlc3RpbmF0aW9uLW91dCc7XHJcbiAgICAvLyBsZXQgYW5nbGUgPSBNYXRoLmF0YW4yKHksIHgpO1xyXG4gICAgLy8gdGhpcy5jdHguc2F2ZSgpO1xyXG4gICAgLy8gdGhpcy5jdHgudHJhbnNsYXRlKHgsIHkpO1xyXG4gICAgLy8gdGhpcy5jdHgucm90YXRlKGFuZ2xlKTtcclxuICAgIC8vIHRoaXMuY3R4LmRyYXdJbWFnZSh0aGlzLmJydXNoLCAtKHRoaXMuYnJ1c2gud2lkdGggLyAyKSwgLSh0aGlzLmJydXNoLmhlaWdodCAvIDIpKTtcclxuICAgIC8vIHRoaXMuY3R4LnJlc3RvcmUoKTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlQnJ1c2ggKCk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJydXNoU3JjLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBsZXQgYnJ1c2ggPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgYnJ1c2guc3JjID0gJy4vaW1hZ2VzL2JydXNoLnBuZyc7XHJcbiAgICAgIHJldHVybiBicnVzaDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UGVyY2VudCAoKTogbnVtYmVyIHtcclxuICAgIGxldCBwZXJjZW50O1xyXG4gICAgbGV0IGNvdW50ZXIgPSAwOyAvLyBudW1iZXIgb2YgcGl4ZWxzIGNsZWFyXHJcbiAgICBsZXQgaW1hZ2VEYXRhID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgbGV0IGltYWdlRGF0YUxlbmd0aCA9IGltYWdlRGF0YS5kYXRhLmxlbmd0aDtcclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgaW1hZ2VEYXRhTGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgaWYgKGltYWdlRGF0YS5kYXRhW2ldID09PSAwICYmIGltYWdlRGF0YS5kYXRhW2krMV0gPT09IDAgJiYgaW1hZ2VEYXRhLmRhdGFbaSsyXSA9PT0gMCAmJiBpbWFnZURhdGEuZGF0YVtpKzNdID09PSAwKSB7XHJcbiAgICAgICAgY291bnRlcisrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvdW50ZXIgPj0gMSkge1xyXG4gICAgICBwZXJjZW50ID0gKGNvdW50ZXIgLyAodGhpcy5jYW52YXMud2lkdGggKiB0aGlzLmNhbnZhcy5oZWlnaHQpKSAqIDEwMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBlcmNlbnQgPSAwO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBlcmNlbnQ7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKlxyXG4gICAqIEp1c3QgY2xlYXIgdGhlIGNhbnZhc1xyXG4gICAqL1xyXG4gIGNsZWFyICgpOiB2b2lkIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vU2NyYXRjaENhcmQudHMiLCIvKipcclxuICogUmV0dXJuIGEgcmFuZG9tIG51bWJlciBpbiByYW5nZVxyXG4gKiBAcGFyYW0gbWluIHtOdW1iZXJ9XHJcbiAqIEBwYXJhbSBtYXgge051bWJlcn1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kb21Qb2ludCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgbGV0IHJhbmRvbSA9IE1hdGguYWJzKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XHJcbiAgcmV0dXJuIHBhcnNlSW50KHJhbmRvbS50b0ZpeGVkKDApLCAxMCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaEN1c3RvbUV2ZW50ICh0YXJnZXQ6IEhUTUxFbGVtZW50LCB0eXBlOiBzdHJpbmcsIGRldGFpbDogYW55KSB7XHJcbiAgbGV0IGN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KHR5cGUsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiBkZXRhaWxcclxuICB9KTtcclxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChjdXN0b21FdmVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHNyYyB7U3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRJbWFnZShzcmM6IHN0cmluZykge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgcmVzb2x2ZShpbWFnZSk7XHJcbiAgICB9XHJcbiAgICBpbWFnZS5zcmMgPSBzcmM7XHJcbiAgICBpbWFnZS5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICByZWplY3QoZXZlbnQudHlwZSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZSAoY2FsbGJhY2s6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyKSB7XHJcbiAgdmFyIGxhc3Q6IG51bWJlcjtcclxuICB2YXIgdGltZXI6IG51bWJlcjtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgIHZhciBub3c6IG51bWJlciA9ICtuZXcgRGF0ZSgpO1xyXG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgaWYgKGxhc3QgJiYgbm93IDwgbGFzdCArIGRlbGF5KSB7XHJcbiAgICAgICAgICAvLyBsZSBkw6lsYWkgbidlc3QgcGFzIMOpY291bMOpIG9uIHJlc2V0IGxlIHRpbWVyXHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBsYXN0ID0gbm93O1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGFzdCA9IG5vdztcclxuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgfTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3V0aWxzLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==